import { test, expect } from '@playwright/test';
import { loginToAdmin } from './helpers/admin';
import { createUser, expectUsers, fillUser, userInput, userRow } from './helpers/users';

test.describe.configure({ timeout: 90_000 });
test.beforeEach(async ({ page }) => {
  await loginToAdmin(page, '/admin/users', 'User Management');
});

test('01. Users: thêm → tìm → sửa → reload → khóa/mở khóa → hủy/xác nhận xóa', async ({ page }) => {
  await createUser(page);
  const row = userRow(page, userInput.email);
  await expect(row).toContainText(userInput.fullName);
  await row.getByTitle('Sửa', { exact: true }).click();
  const modal = page.locator('form.modal-content');
  await expect(modal.locator('[formControlName="password"]')).toHaveValue('');
  await modal.locator('[formControlName="fullName"]').fill('PW Updated Customer');
  await modal.locator('[formControlName="phone"]').fill('0987654321');
  await modal.getByRole('button', { name: 'Save', exact: true }).click();
  await expect(row).toContainText('PW Updated Customer');
  await expect(row).toContainText('0987654321');
  await page.reload();
  await page.getByPlaceholder('Search users by name, email...').fill(userInput.email);
  await expect(row).toContainText('PW Updated Customer');

  page.once('dialog', dialog => dialog.dismiss());
  await row.getByTitle('Khoá/Mở khoá', { exact: true }).click();
  await expect(row.locator('.status-badge')).toHaveText('active');
  for (const status of ['blocked', 'active']) {
    page.once('dialog', dialog => dialog.accept());
    await row.getByTitle('Khoá/Mở khoá', { exact: true }).click();
    await expect(row.locator('.status-badge')).toHaveText(status);
  }
  page.once('dialog', dialog => dialog.dismiss());
  await row.getByTitle('Xoá', { exact: true }).click();
  await expect(row).toHaveCount(1);
  page.once('dialog', dialog => dialog.accept());
  await row.getByTitle('Xoá', { exact: true }).click();
  await expectUsers(page, []);
  await page.reload();
  await page.getByPlaceholder('Search users by name, email...').fill(userInput.email);
  await expectUsers(page, []);
});

test('02. Users: search tên/email/phone, lọc role/status riêng và kết hợp, reset', async ({ page }) => {
  const records = [
    { ...userInput, fullName: 'PW Filter A', email: 'pw.filter.a@example.com', phone: '0998880001' },
    { ...userInput, fullName: 'PW Filter B', email: 'pw.filter.b@example.com', status: 'blocked' },
    { ...userInput, fullName: 'PW Filter C', email: 'pw.filter.c@example.com', role: 'seller', status: 'pending' },
    { ...userInput, fullName: 'PW Filter D', email: 'pw.filter.d@example.com', role: 'seller' },
  ];
  for (const record of records) await createUser(page, record);
  const search = page.getByPlaceholder('Search users by name, email...');
  const filters = page.locator('.filter-bar');
  await search.fill('  PW FILTER  ');
  await expectUsers(page, records.map(r => r.email));
  await filters.locator('[formControlName="role"]').selectOption('user');
  await expectUsers(page, records.slice(0, 2).map(r => r.email));
  await filters.locator('[formControlName="status"]').selectOption('blocked');
  await expectUsers(page, [records[1].email]);
  await filters.locator('[formControlName="role"]').selectOption('seller');
  await expectUsers(page, []);
  await filters.locator('[formControlName="status"]').selectOption('pending');
  await expectUsers(page, [records[2].email]);
  await filters.locator('[formControlName="status"]').selectOption('active');
  await expectUsers(page, [records[3].email]);
  await filters.locator('[formControlName="role"]').selectOption('all');
  await expectUsers(page, [records[0].email, records[3].email]);
  await filters.locator('[formControlName="status"]').selectOption('all');
  await expectUsers(page, records.map(r => r.email));
  await search.fill(records[0].email);
  await expectUsers(page, [records[0].email]);
  await search.fill(records[0].phone);
  await expectUsers(page, [records[0].email]);
  await search.fill('PW DOES NOT EXIST');
  await expectUsers(page, []);
});

test('03. Users: validation, email trùng khi thêm/sửa, giữ form và thử lại', async ({ page }) => {
  await page.getByRole('button', { name: 'Add User' }).click();
  const modal = page.locator('form.modal-content');
  const save = modal.getByRole('button', { name: 'Save', exact: true });
  await save.click();
  await expect(modal.getByText('Yêu cầu nhập họ và tên.', { exact: true })).toBeVisible();
  await expect(modal.getByText('Yêu cầu nhập địa chỉ email.', { exact: true })).toBeVisible();
  await fillUser(page, { ...userInput, email: 'invalid', password: '123' });
  await save.click();
  await expect(modal.getByText('Định dạng email không hợp lệ.', { exact: true })).toBeVisible();
  await expect(modal.getByText('Mật khẩu phải có ít nhất 6 ký tự.', { exact: true })).toBeVisible();
  await fillUser(page, { ...userInput, email: 'admin@giakiet.com' });
  await save.click();
  await expect(modal.getByRole('alert')).toContainText('Email đã được sử dụng');
  await expect(modal.locator('[formControlName="fullName"]')).toHaveValue(userInput.fullName);
  await modal.locator('[formControlName="email"]').fill(userInput.email);
  await save.click();
  await page.getByPlaceholder('Search users by name, email...').fill(userInput.email);
  const row = userRow(page, userInput.email);
  await row.getByTitle('Sửa', { exact: true }).click();
  await modal.locator('[formControlName="email"]').fill('admin@giakiet.com');
  await save.click();
  await expect(modal.getByRole('alert')).toContainText('Email đã được sử dụng');
  await expect(row.locator('td:nth-child(2)')).toHaveText(userInput.email);
  await modal.getByRole('button', { name: 'Cancel', exact: true }).click();
});

test('04. Users: bảo vệ admin và báo lỗi khóa/xóa/đổi role khách đã có lịch', async ({ page }) => {
  const admin = userRow(page, 'admin@giakiet.com');
  await expect(admin).toContainText('Tài khoản quản trị cố định');
  await expect(admin.getByRole('button')).toHaveCount(0);
  await page.getByPlaceholder('Search users by name, email...').fill('marcus.sterling@gmail.com');
  const row = userRow(page, 'marcus.sterling@gmail.com');
  for (const title of ['Khoá/Mở khoá', 'Xoá']) {
    page.once('dialog', dialog => dialog.accept());
    await row.getByTitle(title, { exact: true }).click();
    await expect(page.getByRole('alert')).toContainText('được liên kết với lịch lái thử');
    await expect(row).toHaveCount(1);
    await expect(row.locator('.status-badge')).toHaveText('active');
  }
  await row.getByTitle('Sửa', { exact: true }).click();
  const modal = page.locator('form.modal-content');
  await modal.locator('[formControlName="role"]').selectOption('seller');
  await modal.getByRole('button', { name: 'Save', exact: true }).click();
  await expect(modal.getByRole('alert')).toHaveText('Không thể đổi vai trò người dùng đã có lịch lái thử.');
});

test('05. Users: mật khẩu mới được lưu và dùng đăng nhập website; mật khẩu cũ bị từ chối', async ({ page }) => {
  await createUser(page);
  await userRow(page, userInput.email).getByTitle('Sửa', { exact: true }).click();
  const modal = page.locator('form.modal-content');
  await modal.locator('[formControlName="password"]').fill('changed123');
  await modal.getByRole('button', { name: 'Save', exact: true }).click();
  await expect(modal).toHaveCount(0);
  await page.locator('.sidebar-footer').getByTitle('Đăng xuất', { exact: true }).click();
  await expect(page).toHaveURL(/\/loginadmin$/);
  await page.goto('/sign-in');
  await page.locator('[formControlName="email"]').fill(userInput.email);
  await page.locator('[formControlName="password"]').fill(userInput.password);
  await page.locator('form').getByRole('button', { name: 'Sign In', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('Email hoặc mật khẩu không đúng.');
  await page.locator('[formControlName="password"]').fill('changed123');
  await page.locator('form').getByRole('button', { name: 'Sign In', exact: true }).click();
  await expect(page).toHaveURL(/\/home$/);
});

test('06. Users: chuyển trang, lọc admin đưa về trang 1 và bỏ lọc khôi phục danh sách', async ({ page }) => {
  const firstEmail = await page.locator('.user-table tbody tr td:nth-child(2)').first().innerText();
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(page.locator('.pagination-info')).toContainText('Showing 9-');
  await expect(page.locator('.user-table tbody tr td:nth-child(2)').first()).not.toHaveText(firstEmail);
  await page.locator('.filter-bar [formControlName="role"]').selectOption('admin');
  await expectUsers(page, ['admin@giakiet.com']);
  await expect(page.getByRole('button', { name: 'Previous', exact: true })).toBeDisabled();
  await page.locator('.filter-bar [formControlName="role"]').selectOption('all');
  await expect(page.locator('.user-table tbody tr')).toHaveCount(8);
});
