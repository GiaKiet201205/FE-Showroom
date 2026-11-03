import { test, expect } from '@playwright/test';
import { createVehicle, loginToAdmin, vehicleInput, vehicleRow } from './helpers/admin';
import { brandCard, brandInput, createBrand, expectBrands, fillBrand, navigateAdmin } from './helpers/brands-sellers';

test.describe.configure({ timeout: 90_000 });
test.beforeEach(async ({ page }) => {
  await loginToAdmin(page, '/admin/brands', 'Brand Management');
});

test('01. Brands: thêm → tìm → sửa origin/status → hủy/xác nhận xóa', async ({ page }) => {
  await createBrand(page);
  const card = brandCard(page, brandInput.name);
  await expect(card.locator('.brand-origin')).toContainText('Japan');
  await expect(card.locator('.footer-value')).toHaveText('0 Active Units');
  await card.getByTitle('Sửa', { exact: true }).click();
  const modal = page.locator('form.modal-content');
  await fillBrand(page, { ...brandInput, name: 'PW Brand Updated', origin: 'France', status: 'inactive' });
  await modal.getByRole('button', { name: 'Save', exact: true }).click();
  await expect(modal).toHaveCount(0);
  const updated = brandCard(page, 'PW Brand Updated');
  await expect(updated.locator('.brand-origin')).toContainText('France');
  await expect(updated.locator('.status-badge')).toHaveText('inactive');
  await updated.getByTitle('Sửa', { exact: true }).click();
  await expect(modal.locator('[formControlName="name"]')).toHaveValue('PW Brand Updated');
  await modal.getByRole('button', { name: 'Cancel', exact: true }).click();
  page.once('dialog', dialog => dialog.dismiss());
  await updated.getByTitle('Xoá', { exact: true }).click();
  await expect(updated).toHaveCount(1);
  page.once('dialog', dialog => dialog.accept());
  await updated.getByTitle('Xoá', { exact: true }).click();
  await expectBrands(page, []);
});

test('02. Brands: search tên/xuất xứ, lọc region AND, reset và không khớp', async ({ page }) => {
  const data = [
    { ...brandInput, name: 'PW Filter A', origin: 'Japan' },
    { ...brandInput, name: 'PW Filter B', origin: 'France' },
    { ...brandInput, name: 'PW Filter C', origin: 'Japan', status: 'inactive' },
  ];
  for (const record of data) await createBrand(page, record);
  const search = page.getByPlaceholder('Search brands...');
  const region = page.locator('.filter-bar [formControlName="region"]');
  await search.fill('  pw filter  ');
  await expectBrands(page, data.map(b => b.name));
  await region.selectOption('Japan');
  await expectBrands(page, [data[0].name, data[2].name]);
  await region.selectOption('France');
  await expectBrands(page, [data[1].name]);
  await region.selectOption('Germany');
  await expectBrands(page, []);
  await region.selectOption('all');
  await expectBrands(page, data.map(b => b.name));
  await search.fill('  JAPAN  ');
  await expectBrands(page, [data[0].name, data[2].name]);
  await search.fill('PW NO BRAND EXISTS');
  await expectBrands(page, []);
});

test('03. Brands: tên rỗng/quá dài, số xe âm và hủy modal không tạo brand', async ({ page }) => {
  await page.getByRole('button', { name: 'Add Brand', exact: true }).click();
  const modal = page.locator('form.modal-content');
  const save = modal.getByRole('button', { name: 'Save', exact: true });
  await save.click();
  await expect(modal.getByText('Vui lòng nhập tên thương hiệu', { exact: true })).toBeVisible();
  await fillBrand(page, { ...brandInput, name: 'X'.repeat(51), listedVehicles: '-1' });
  await save.click();
  await expect(modal.getByText('Tối đa 50 ký tự', { exact: true })).toBeVisible();
  await expect(modal.getByText('Số xe không được âm', { exact: true })).toBeVisible();
  await modal.locator('[formControlName="name"]').fill('PW Cancelled Brand');
  await modal.getByRole('button', { name: 'Cancel', exact: true }).click();
  await page.getByPlaceholder('Search brands...').fill('PW Cancelled Brand');
  await expectBrands(page, []);
});

test('04. Brands ↔ Vehicles: đồng bộ số xe, chặn đổi tên/xóa khi có xe, cho phép sau khi hết xe', async ({ page }) => {
  await createBrand(page, { ...brandInput, name: 'PW Linked Brand' });
  await navigateAdmin(page, '/admin/vehicles', 'Vehicle Management');
  await createVehicle(page, { ...vehicleInput, brand: 'PW Linked Brand', model: 'PW Linked Car' });
  await navigateAdmin(page, '/admin/brands', 'Brand Management');
  await page.getByPlaceholder('Search brands...').fill('PW Linked Brand');
  const card = brandCard(page, 'PW Linked Brand');
  await expect(card.locator('.footer-value')).toHaveText('1 Active Units');
  await card.getByTitle('Sửa', { exact: true }).click();
  const modal = page.locator('form.modal-content');
  await modal.locator('[formControlName="name"]').fill('PW Renamed Brand');
  await modal.getByRole('button', { name: 'Save', exact: true }).click();
  // BrandService currently rejects locally without exposing a user-facing alert.
  await expect(modal).toBeVisible();
  await expect(modal.getByRole('button', { name: 'Save', exact: true })).toBeEnabled();
  await expect(card.locator('.brand-name')).toHaveText('PW Linked Brand');
  await modal.getByRole('button', { name: 'Cancel', exact: true }).click();
  page.once('dialog', dialog => dialog.accept());
  await card.getByTitle('Xoá', { exact: true }).click();
  await expect(card).toHaveCount(1);
  await navigateAdmin(page, '/admin/vehicles', 'Vehicle Management');
  await page.getByPlaceholder('Search vehicles...').fill('PW Linked Car');
  const row = vehicleRow(page, 'PW Linked Car');
  await expect(row).toHaveCount(1);
  page.once('dialog', dialog => dialog.accept());
  await row.getByTitle('Xoá', { exact: true }).click();
  await expect(row).toHaveCount(0);
  await navigateAdmin(page, '/admin/brands', 'Brand Management');
  await page.getByPlaceholder('Search brands...').fill('PW Linked Brand');
  await expect(card.locator('.footer-value')).toHaveText('0 Active Units');
  await card.getByTitle('Sửa', { exact: true }).click();
  await modal.locator('[formControlName="name"]').fill('PW Renamed Brand');
  await modal.getByRole('button', { name: 'Save', exact: true }).click();
  await expect(modal).toHaveCount(0);
  await page.getByPlaceholder('Search brands...').fill('PW Renamed Brand');
  const renamed = brandCard(page, 'PW Renamed Brand');
  page.once('dialog', dialog => dialog.accept());
  await renamed.getByTitle('Xoá', { exact: true }).click();
  await expectBrands(page, []);
});

test('05. Brands: thêm brand tạo trang mới; lọc đưa về trang 1', async ({ page }) => {
  await createBrand(page, { ...brandInput, name: 'PW Pagination Brand' });
  await page.getByPlaceholder('Search brands...').fill('');
  await expect(page.locator('.pagination-info')).toContainText('of 9 brands');
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(page.locator('.brand-grid .brand-name')).toHaveText(['PW Pagination Brand']);
  await expect(page.locator('.pagination-info')).toContainText('Showing 9-9 of 9 brands');
  await page.locator('.filter-bar [formControlName="region"]').selectOption('Germany');
  await expect(page.locator('.brand-grid .brand-name')).toHaveText(['Audi', 'Porsche', 'BMW']);
  await expect(page.getByRole('button', { name: 'Previous', exact: true })).toBeDisabled();
});
