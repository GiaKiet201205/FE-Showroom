import { test, expect } from '@playwright/test';
import { fillLogin, loginToVehicles } from './helpers/admin';
import { MOCK_ADMIN_CREDENTIALS } from '../../../src/app/core/services/auth.mock';

test('01. Chưa đăng nhập: chuyển từ Vehicles về trang đăng nhập admin', async ({ page }) => {
  await page.goto('/admin/vehicles');
  await expect(page).toHaveURL(/\/loginadmin\?redirectTo=%2Fadmin%2Fvehicles/);
  await expect(page.getByText('Đăng nhập khu vực quản trị', { exact: true })).toBeVisible();
});

test('02. Form trống hoặc sai định dạng: hiển thị lỗi và không đăng nhập', async ({ page }) => {
  await page.goto('/loginadmin');
  await page.getByRole('button', { name: 'Đăng nhập', exact: true }).click();
  await expect(page.getByText('Vui lòng nhập email hợp lệ.', { exact: true })).toBeVisible();
  await expect(page.getByText('Mật khẩu tối thiểu 6 ký tự.', { exact: true })).toBeVisible();
  await fillLogin(page, 'invalid-email', '123');
  await expect(page.locator('input[formControlName="email"]')).toHaveClass(/ng-invalid/);
  await expect(page.locator('input[formControlName="password"]')).toHaveClass(/ng-invalid/);
  await expect(page).toHaveURL(/\/loginadmin$/);
});

test('03. Sai mật khẩu: báo lỗi; nhập lại đúng thì vào Vehicles', async ({ page }) => {
  await page.goto('/admin/vehicles');
  await fillLogin(page, MOCK_ADMIN_CREDENTIALS.email, 'wrong-password');
  await expect(page.locator('.form-error')).toHaveText('Email hoặc mật khẩu không đúng.');
  await expect(page).toHaveURL(/\/loginadmin/);
  await fillLogin(page);
  await expect(page).toHaveURL(/\/admin\/vehicles$/);
  await expect(page.getByRole('heading', { name: 'Vehicle Management' })).toBeVisible();
});

test('04. Tài khoản không có quyền admin: bị từ chối và không giữ phiên đăng nhập', async ({ page }) => {
  await page.goto('/loginadmin');
  await fillLogin(page, 'm.chang@autodrive.com', 'seller123');
  await expect(page.locator('.form-error')).toHaveText('Tài khoản này không có quyền quản trị.');
  await expect.poll(() => page.evaluate(() => localStorage.getItem('auth_token'))).toBeNull();
  await page.goto('/admin/vehicles');
  await expect(page).toHaveURL(/\/loginadmin\?redirectTo=/);
});

test('05. Admin đúng: đăng nhập thành công và mở danh sách Vehicles', async ({ page }) => {
  await loginToVehicles(page);
  await expect(page.locator('.vehicle-table tbody .cell-brand').first()).toBeVisible();
  await expect(page.getByRole('button', { name: 'Add New Vehicle', exact: true })).toBeVisible();
});
