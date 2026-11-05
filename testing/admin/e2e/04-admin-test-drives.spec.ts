import { test, expect } from '@playwright/test';
import { loginToAdmin } from './helpers/admin';
import { bookingInput, bookingRow, expectBookings, fillBooking, scheduleBooking } from './helpers/test-drives';
import { createUser, userInput, userRow } from './helpers/users';

test.describe.configure({ timeout: 90_000 });
test.beforeEach(async ({ page }) => {
  await loginToAdmin(page, '/admin/test-drives', 'Test Drive Management');
});

test('01. Test Drives: validation → tạo → sửa → reload → hủy và giữ lịch sử', async ({ page }) => {
  await page.getByRole('button', { name: 'Schedule Test Drive', exact: true }).click();
  const modal = page.locator('form.modal-content');
  await modal.getByRole('button', { name: 'Save', exact: true }).click();
  await expect(modal.locator('.field-error')).toHaveCount(6);
  await modal.getByRole('button', { name: 'Cancel', exact: true }).click();
  const id = await scheduleBooking(page);
  const row = bookingRow(page, id);
  await expect(row.locator('.status-badge')).toHaveText('pending');
  await expect(row).toContainText('PW Showroom');
  await page.getByPlaceholder('Search bookings...').fill(id);
  await page.locator('.filter-bar [formControlName="date"]').fill('');
  await expectBookings(page, [id]);
  await row.getByTitle('Sửa lịch lái thử', { exact: true }).click();
  await modal.locator('[formControlName="preferredDate"]').fill('2030-12-02');
  await modal.locator('[formControlName="timeSlot"]').fill('10:30 AM');
  await modal.locator('[formControlName="location"]').fill('PW Updated Showroom');
  await modal.locator('[formControlName="status"]').selectOption('confirmed');
  await modal.getByRole('button', { name: 'Save', exact: true }).click();
  await expect(modal).toHaveCount(0);
  await expect(row).toContainText('2030-12-02');
  await expect(row).toContainText('10:30 AM');
  await expect(row).toContainText('PW Updated Showroom');
  await expect(row.locator('.status-badge')).toHaveText('confirmed');
  await page.reload();
  await page.getByPlaceholder('Search bookings...').fill(id);
  await expect(row.locator('.status-badge')).toHaveText('confirmed');
  await expect(row).toContainText('PW Updated Showroom');
  page.once('dialog', dialog => dialog.dismiss());
  await row.getByTitle('Huỷ lịch lái thử', { exact: true }).click();
  await expect(row.locator('.status-badge')).toHaveText('confirmed');
  page.once('dialog', dialog => dialog.accept());
  await row.getByTitle('Huỷ lịch lái thử', { exact: true }).click();
  await expect(row.locator('.status-badge')).toHaveText('cancelled');
  await page.reload();
  await page.getByPlaceholder('Search bookings...').fill(id);
  await expectBookings(page, [id]);
  await expect(row.locator('.status-badge')).toHaveText('cancelled');
});

test('02. Test Drives: search khách/ID, lọc ngày/status, kết hợp và reset', async ({ page }) => {
  const customer = { ...userInput, fullName: 'PW Booking Filter', email: 'pw.booking.filter@example.com' };
  await page.goto('/admin/users');
  await createUser(page, customer);
  await page.goto('/admin/test-drives');
  const label = `${customer.fullName} — ${customer.email}`;
  const a = await scheduleBooking(page, bookingInput, label);
  const b = await scheduleBooking(page, { ...bookingInput, timeSlot: '10:30 AM', status: 'confirmed' }, label);
  const c = await scheduleBooking(page, { ...bookingInput, preferredDate: '2030-12-02', timeSlot: '02:30 PM', status: 'completed' }, label);
  const d = await scheduleBooking(page, { ...bookingInput, preferredDate: '2030-12-02', timeSlot: '04:00 PM', status: 'cancelled' }, label);
  const search = page.getByPlaceholder('Search bookings...');
  const date = page.locator('.filter-bar [formControlName="date"]');
  const status = page.locator('.filter-bar [formControlName="status"]');
  await search.fill('  pw booking filter  ');
  await date.fill('');
  await expectBookings(page, [a, b, c, d]);
  for (const [value, id] of [['pending', a], ['confirmed', b], ['completed', c], ['cancelled', d]]) {
    await status.selectOption(value);
    await expectBookings(page, [id]);
  }
  await status.selectOption('all');
  await date.fill('2030-12-01');
  await expectBookings(page, [a, b]);
  await status.selectOption('confirmed');
  await expectBookings(page, [b]);
  await date.fill('2030-12-02');
  await expectBookings(page, []);
  await status.selectOption('all');
  await expectBookings(page, [c, d]);
  await date.fill('');
  await expectBookings(page, [a, b, c, d]);
  await search.fill(a);
  await expectBookings(page, [a]);
  await search.fill('PW NO BOOKING EXISTS');
  await expectBookings(page, []);
});

test('03. Test Drives: trùng lịch khi tạo/sửa báo lỗi; đổi giờ thì thử lại được', async ({ page }) => {
  const first = await scheduleBooking(page);
  await page.getByRole('button', { name: 'Schedule Test Drive', exact: true }).click();
  await fillBooking(page);
  const modal = page.locator('form.modal-content');
  const save = modal.getByRole('button', { name: 'Save', exact: true });
  await save.click();
  await expect(modal.getByRole('alert')).toHaveText('Khách hàng hoặc seller đã có lịch trong khung giờ này.');
  await expect(modal.locator('[formControlName="location"]')).toHaveValue(bookingInput.location);
  await expect(save).toBeEnabled();
  await modal.locator('[formControlName="timeSlot"]').fill('10:30 AM');
  await save.click();
  await expect(modal).toHaveCount(0);
  await expect(page.locator('.td-table tbody .cell-id')).toHaveCount(2);
  const ids = await page.locator('.td-table tbody .cell-id').allTextContents();
  const second = ids.map(id => id.trim()).find(id => id !== first)!;
  await bookingRow(page, second).getByTitle('Sửa lịch lái thử', { exact: true }).click();
  await modal.locator('[formControlName="timeSlot"]').fill(bookingInput.timeSlot);
  await save.click();
  await expect(modal.getByRole('alert')).toContainText('đã có lịch trong khung giờ này');
  await expect(bookingRow(page, second)).toContainText('10:30 AM');
  await modal.locator('[formControlName="timeSlot"]').fill('02:30 PM');
  await save.click();
  await expect(modal).toHaveCount(0);
  await expect(bookingRow(page, second)).toContainText('02:30 PM');
});

test('04. Test Drives: không được hủy lịch đã completed', async ({ page }) => {
  const id = await scheduleBooking(page, { ...bookingInput, status: 'completed' });
  const row = bookingRow(page, id);
  page.once('dialog', dialog => dialog.accept());
  await row.getByTitle('Huỷ lịch lái thử', { exact: true }).click();
  await expect(page.getByRole('alert')).toHaveText('Không thể huỷ lịch đã hoàn thành.');
  await expect(row.locator('.status-badge')).toHaveText('completed');
});

test('05. Test Drives ↔ Users: tên khách đồng bộ và khách có lịch không được xóa/khóa', async ({ page }) => {
  const customer = { ...userInput, fullName: 'PW Linked Customer', email: 'pw.linked@example.com' };
  await page.goto('/admin/users');
  await createUser(page, customer);
  await page.goto('/admin/test-drives');
  const id = await scheduleBooking(page, bookingInput, `${customer.fullName} — ${customer.email}`);
  await page.goto('/admin/users');
  await page.getByPlaceholder('Search users by name, email...').fill(customer.email);
  const row = userRow(page, customer.email);
  await row.getByTitle('Sửa', { exact: true }).click();
  const modal = page.locator('form.modal-content');
  await modal.locator('[formControlName="fullName"]').fill('PW Linked Renamed');
  await modal.getByRole('button', { name: 'Save', exact: true }).click();
  await expect(modal).toHaveCount(0);
  for (const title of ['Xoá', 'Khoá/Mở khoá']) {
    page.once('dialog', dialog => dialog.accept());
    await row.getByTitle(title, { exact: true }).click();
    await expect(page.getByRole('alert')).toContainText('được liên kết với lịch lái thử');
  }
  await page.goto('/admin/test-drives');
  await page.getByPlaceholder('Search bookings...').fill(id);
  await expect(bookingRow(page, id)).toContainText('PW Linked Renamed');
});

test('06. Test Drives: phân trang và filter ngày không có lịch đưa về trang 1', async ({ page }) => {
  const first = await page.locator('.td-table tbody .cell-id').first().innerText();
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(page.locator('.pagination-info')).toContainText('Showing 9-');
  await expect(page.locator('.td-table tbody .cell-id').first()).not.toHaveText(first);
  await page.locator('.filter-bar [formControlName="date"]').fill('2030-01-01');
  await expectBookings(page, []);
  await expect(page.getByRole('button', { name: 'Previous', exact: true })).toBeDisabled();
  await page.locator('.filter-bar [formControlName="date"]').fill('');
  await expect(page.locator('.td-table tbody .cell-id')).toHaveCount(8);
});
