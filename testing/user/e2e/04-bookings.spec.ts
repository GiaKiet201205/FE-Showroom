import { test, expect } from '@playwright/test';
import { account, booking, fillBooking, logoutUser, registerUser, signIn, submitBooking } from './helpers/user';
import { MOCK_ADMIN_CREDENTIALS } from '../../../src/app/core/services/auth.mock';

test.describe.configure({ timeout: 90_000 });

test('01. Guest: form đặt lịch disabled, chỉ có lời nhắc đăng nhập và không lộ lịch', async ({ page }) => {
  await page.goto('/test-drives');
  await expect(page.locator('fieldset')).toHaveJSProperty('disabled', true);
  await expect(page.getByRole('button', { name: 'Đăng ký lái thử', exact: true })).toBeDisabled();
  await expect(page.locator('.test-drive-card')).toHaveCount(0);
  await page.locator('.account-notice').getByRole('link', { name: 'đăng nhập', exact: true }).click();
  await expect(page).toHaveURL(/\/sign-in$/);
});

test('02. User đặt → admin xác nhận → user reload xem → hủy và giữ lịch sử', async ({ page }) => {
  await registerUser(page);
  await page.goto('/cars/1');
  await page.getByRole('button', { name: 'Schedule Test Drive', exact: true }).click();
  await expect(page.locator('[formControlName="email"]')).toHaveValue(account.email);
  await expect(page.locator('[formControlName="email"]')).toHaveAttribute('readonly', '');
  await expect(page.locator('[formControlName="selectedVehicleId"] option:checked')).toHaveText('BMW M4 Competition');
  await submitBooking(page);
  await expect(page.getByText('Vui lòng chọn seller đi cùng.', { exact: true })).toBeVisible();
  await fillBooking(page); await submitBooking(page);
  await expect(page.locator('.success-message')).toBeVisible();
  await expect(page.locator('.test-drive-card')).toHaveCount(1);
  const id = (await page.locator('.booking-id').innerText()).replace('Mã lịch:', '').trim();
  await expect(page.locator('.test-drive-card .status')).toHaveText('Đang chờ xác nhận');
  await logoutUser(page);

  await page.goto('/loginadmin');
  await page.locator('[formControlName="email"]').fill(MOCK_ADMIN_CREDENTIALS.email);
  await page.locator('[formControlName="password"]').fill(MOCK_ADMIN_CREDENTIALS.password);
  await page.getByRole('button', { name: 'Đăng nhập', exact: true }).click();
  await expect(page).toHaveURL(/\/admin\/dashboard$/);
  await page.goto('/admin/test-drives');
  await page.getByPlaceholder('Search bookings...').fill(id);
  const row = page.locator('.td-table tbody tr').filter({ hasText: id });
  await row.getByTitle('Sửa lịch lái thử', { exact: true }).click();
  const modal = page.locator('form.modal-content');
  await modal.locator('[formControlName="status"]').selectOption('confirmed');
  await modal.getByRole('button', { name: 'Save', exact: true }).click();
  await expect(modal).toHaveCount(0);
  await page.locator('.sidebar-footer').getByTitle('Đăng xuất', { exact: true }).click();
  await expect(page).toHaveURL(/\/loginadmin$/);
  await signIn(page, account.email, account.password);
  await expect(page).toHaveURL(/\/home$/);
  await page.goto('/test-drives');
  await expect(page.locator('.test-drive-card .status')).toHaveText('Đã xác nhận');
  await page.reload();
  await expect(page.locator('.booking-id')).toContainText(id);
  page.once('dialog', dialog => dialog.dismiss());
  await page.getByRole('button', { name: 'Hủy lịch', exact: true }).click();
  await expect(page.locator('.test-drive-card .status')).toHaveText('Đã xác nhận');
  page.once('dialog', dialog => dialog.accept());
  await page.getByRole('button', { name: 'Hủy lịch', exact: true }).click();
  await expect(page.locator('.test-drive-card')).toHaveCount(0);
  await page.getByRole('button', { name: 'Đã hủy', exact: true }).click();
  await expect(page.locator('.booking-id')).toContainText(id);
  await expect(page.locator('.test-drive-card .status')).toHaveText('Đã hủy');
  await page.reload();
  await page.getByRole('button', { name: 'Đã hủy', exact: true }).click();
  await expect(page.locator('.booking-id')).toContainText(id);
});

test('03. Chặn ngày quá khứ và lịch trùng; đổi khung giờ thì đăng ký lại được', async ({ page }) => {
  await registerUser(page);
  await page.goto('/test-drives');
  await fillBooking(page, '2000-01-01'); await submitBooking(page);
  await expect(page.getByRole('alert')).toHaveText('Vui lòng chọn ngày lái thử từ hôm nay trở đi.');
  await fillBooking(page); await submitBooking(page);
  await expect(page.locator('.test-drive-card')).toHaveCount(1);
  await fillBooking(page); await submitBooking(page);
  await expect(page.getByRole('alert')).toContainText('đã có lịch trong khung giờ này');
  await expect(page.locator('.test-drive-card')).toHaveCount(1);
  await expect(page.locator('[formControlName="preferredTime"]')).toHaveValue(booking.time);
  await page.locator('[formControlName="preferredTime"]').selectOption('10:30 AM');
  await submitBooking(page);
  await expect(page.locator('.test-drive-card')).toHaveCount(2);
});

test('04. Lịch chỉ thuộc tài khoản đăng nhập, User mới không nhìn thấy lịch người khác', async ({ page }) => {
  await registerUser(page);
  await page.goto('/test-drives');
  await fillBooking(page); await submitBooking(page);
  await expect(page.locator('.test-drive-card')).toHaveCount(1);
  const id = await page.locator('.booking-id').innerText();
  await logoutUser(page);
  await registerUser(page, { ...account, fullName: 'PW Other Customer', email: 'pw.other@example.com' });
  await page.goto('/test-drives');
  await expect(page.locator('.test-drive-card')).toHaveCount(0);
  await expect(page.getByText(id, { exact: true })).toHaveCount(0);
  await page.getByRole('button', { name: 'Đã hoàn thành', exact: true }).click();
  await expect(page.locator('.test-drive-card')).toHaveCount(0);
  await page.getByRole('button', { name: 'Đã hủy', exact: true }).click();
  await expect(page.locator('.test-drive-card')).toHaveCount(0);
});
