import { test, expect } from '@playwright/test';
import { loginToAdmin } from './helpers/admin';
import { createSeller, expectSellers, fillSeller, navigateAdmin, sellerInput, sellerRow } from './helpers/brands-sellers';
import { expectUsers, userRow } from './helpers/users';

test.describe.configure({ timeout: 90_000 });
test.beforeEach(async ({ page }) => {
  await loginToAdmin(page, '/admin/sellers', 'Seller Management');
});

test('01. Sellers: thêm/sửa/xóa đồng bộ tài khoản User; hủy xác nhận giữ dữ liệu', async ({ page }) => {
  await createSeller(page);
  const row = sellerRow(page, sellerInput.email);
  await expect(row).toContainText('PW Company');
  await expect(row.locator('.status-badge')).toHaveText('verified');
  await row.getByTitle('Sửa seller', { exact: true }).click();
  const modal = page.locator('form.modal-content');
  await fillSeller(page, { ...sellerInput, fullName: 'PW Updated Seller', company: 'PW Updated Company', joinDate: '2030-12-02', status: 'pending' });
  await modal.getByRole('button', { name: 'Lưu seller', exact: true }).click();
  await expect(modal).toHaveCount(0);
  await expect(row).toContainText('PW Updated Seller');
  await expect(row).toContainText('PW Updated Company');
  await expect(row).toContainText('2030-12-02');
  await expect(row.locator('.status-badge')).toHaveText('pending');
  await navigateAdmin(page, '/admin/users', 'User Management');
  await page.getByPlaceholder('Search users by name, email...').fill(sellerInput.email);
  const user = userRow(page, sellerInput.email);
  await expect(user).toContainText('PW Updated Seller');
  await expect(user.locator('.role-badge')).toHaveText('seller');
  await expect(user.locator('.status-badge')).toHaveText('pending');
  await navigateAdmin(page, '/admin/sellers', 'Seller Management');
  await page.getByPlaceholder('Search sellers, company name...').fill(sellerInput.email);
  await expect(row).toContainText('PW Updated Company');
  page.once('dialog', dialog => dialog.dismiss());
  await row.getByTitle('Xoá seller', { exact: true }).click();
  await expect(row).toHaveCount(1);
  page.once('dialog', dialog => dialog.accept());
  await row.getByTitle('Xoá seller', { exact: true }).click();
  await expectSellers(page, []);
  await navigateAdmin(page, '/admin/users', 'User Management');
  await page.getByPlaceholder('Search users by name, email...').fill(sellerInput.email);
  await expectUsers(page, []);
});

test('02. Sellers: search tên/email/phone/company, lọc date/status AND, reset', async ({ page }) => {
  const data = [
    { ...sellerInput, fullName: 'PW Filter A', email: 'pw.seller.a@example.com' },
    { ...sellerInput, fullName: 'PW Filter B', email: 'pw.seller.b@example.com', phone: '0998880002', status: 'pending' },
    { ...sellerInput, fullName: 'PW Filter C', email: 'pw.seller.c@example.com', phone: '0998880003', joinDate: '2030-12-02', status: 'suspended' },
  ];
  for (const record of data) await createSeller(page, record);
  const search = page.getByPlaceholder('Search sellers, company name...');
  const date = page.locator('.filter-bar [formControlName="date"]');
  const status = page.locator('.filter-bar [formControlName="status"]');
  await search.fill('  PW FILTER  ');
  await expectSellers(page, data.map(s => s.email));
  for (const [value, record] of [['verified', data[0]], ['pending', data[1]], ['suspended', data[2]]] as const) {
    await status.selectOption(value);
    await expectSellers(page, [record.email]);
  }
  await status.selectOption('all');
  await date.fill('2030-12-01');
  await expectSellers(page, [data[0].email, data[1].email]);
  await status.selectOption('pending');
  await expectSellers(page, [data[1].email]);
  await date.fill('2030-12-02');
  await expectSellers(page, []);
  await status.selectOption('all');
  await expectSellers(page, [data[2].email]);
  await date.fill('');
  await search.fill('pw company');
  await expectSellers(page, data.map(s => s.email));
  await search.fill(data[0].phone);
  await expectSellers(page, [data[0].email]);
  await search.fill(data[1].email);
  await expectSellers(page, [data[1].email]);
  await search.fill('PW NO SELLER EXISTS');
  await expectSellers(page, []);
});

test('03. Sellers: validation, email trùng khi thêm/sửa; giữ form và thử lại', async ({ page }) => {
  await page.getByRole('button', { name: 'Thêm seller', exact: true }).click();
  const modal = page.locator('form.modal-content');
  const save = modal.getByRole('button', { name: 'Lưu seller', exact: true });
  await save.click();
  await expect(modal.getByText('Nhập họ tên, tối đa 80 ký tự.', { exact: true })).toBeVisible();
  await expect(modal.getByText('Nhập email hợp lệ.', { exact: true })).toBeVisible();
  await fillSeller(page, { ...sellerInput, fullName: 'X'.repeat(81), email: 'invalid', phone: 'abc', company: ' ', joinDate: '' });
  await save.click();
  await expect(modal.locator('.field-error')).toHaveCount(5);
  await fillSeller(page, { ...sellerInput, email: 'admin@giakiet.com' });
  await save.click();
  await expect(modal.getByRole('alert')).toContainText('Email đã được sử dụng');
  await expect(modal.locator('[formControlName="fullName"]')).toHaveValue(sellerInput.fullName);
  await expect(save).toBeEnabled();
  await modal.locator('[formControlName="email"]').fill(sellerInput.email);
  await save.click();
  await expect(modal).toHaveCount(0);
  await page.getByPlaceholder('Search sellers, company name...').fill(sellerInput.email);
  const row = sellerRow(page, sellerInput.email);
  await row.getByTitle('Sửa seller', { exact: true }).click();
  await modal.locator('[formControlName="email"]').fill('admin@giakiet.com');
  await save.click();
  await expect(modal.getByRole('alert')).toContainText('Email đã được sử dụng');
  await expect(row.locator('td:nth-child(2)')).toHaveText(sellerInput.email);
  await modal.getByRole('button', { name: 'Huỷ', exact: true }).click();
});

test('04. Sellers: không xóa seller có lịch; sửa tên đồng bộ sang Test Drives', async ({ page }) => {
  await page.getByPlaceholder('Search sellers, company name...').fill('m.chang@autodrive.com');
  const row = sellerRow(page, 'm.chang@autodrive.com');
  page.once('dialog', dialog => dialog.accept());
  await row.getByTitle('Xoá seller', { exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('được liên kết với lịch lái thử');
  await expect(row).toHaveCount(1);
  await row.getByTitle('Sửa seller', { exact: true }).click();
  const modal = page.locator('form.modal-content');
  await modal.locator('[formControlName="fullName"]').fill('PW Linked Seller');
  await modal.getByRole('button', { name: 'Lưu seller', exact: true }).click();
  await expect(modal).toHaveCount(0);
  await navigateAdmin(page, '/admin/test-drives', 'Test Drive Management');
  await page.getByPlaceholder('Search bookings...').fill('PW Linked Seller');
  const names = page.locator('.td-table tbody tr td:nth-child(4)');
  await expect(names.first()).toHaveText('PW Linked Seller');
  await expect.poll(async () => {
    const values = await names.allTextContents();
    return values.length > 0 && values.every(name => name.trim() === 'PW Linked Seller');
  }).toBe(true);
});

test('05. Sellers: giữ thông tin tài khoản sau reload, phân trang và reset filter', async ({ page }) => {
  await createSeller(page, { ...sellerInput, status: 'suspended' });
  await page.reload();
  await page.getByPlaceholder('Search sellers, company name...').fill(sellerInput.email);
  const row = sellerRow(page, sellerInput.email);
  await expect(row).toContainText(sellerInput.fullName);
  await expect(row).toContainText(sellerInput.phone);
  await expect(row).toContainText(sellerInput.joinDate);
  await expect(row.locator('.status-badge')).toHaveText('suspended');
  // Company details are memory-only; persistence assertions cover the linked User fields.
  await page.getByPlaceholder('Search sellers, company name...').fill('');
  await expect(page.locator('.seller-table tbody tr')).toHaveCount(8);
  const first = await page.locator('.seller-table tbody tr td:nth-child(2)').first().innerText();
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(page.locator('.pagination-info')).toContainText('Showing 9-');
  await expect(page.locator('.seller-table tbody tr td:nth-child(2)').first()).not.toHaveText(first);
  await page.locator('.filter-bar [formControlName="date"]').fill(sellerInput.joinDate);
  await expectSellers(page, [sellerInput.email]);
  await expect(page.getByRole('button', { name: 'Previous', exact: true })).toBeDisabled();
  await page.locator('.filter-bar [formControlName="date"]').fill('');
  await expect(page.locator('.seller-table tbody tr')).toHaveCount(8);
});
