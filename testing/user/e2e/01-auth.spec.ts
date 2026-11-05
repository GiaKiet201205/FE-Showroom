import { test, expect } from '@playwright/test';
import { account, fillRegistration, loginUser, logoutUser, registerUser, signIn } from './helpers/user';

test.describe.configure({ timeout: 90_000 });

test('01. Đăng ký → giữ phiên sau reload → đăng xuất → sai mật khẩu → đăng nhập lại', async ({ page }) => {
  await registerUser(page);
  await page.reload();
  await expect(page.locator('.navbar .account-name')).toHaveText(account.fullName);
  await logoutUser(page);
  await expect.poll(() => page.evaluate(() => localStorage.getItem('auth_token'))).toBeNull();
  await signIn(page, account.email, 'incorrect-password');
  await expect(page.getByRole('alert')).toHaveText('Email hoặc mật khẩu không đúng.');
  await page.locator('[formControlName="password"]').fill(account.password);
  await page.getByRole('button', { name: 'Sign In', exact: true }).click();
  await expect(page).toHaveURL(/\/home$/);
  await expect(page.locator('.navbar .account-name')).toHaveText(account.fullName);
});

test('02. Đăng ký thiếu/sai dữ liệu, xác nhận password và điều khoản', async ({ page }) => {
  await page.goto('/sign-up');
  await page.getByRole('button', { name: 'Create Account', exact: true }).click();
  await expect(page.getByText('Please enter your full name.', { exact: true })).toBeVisible();
  await expect(page.getByText('Please agree to the terms.', { exact: true })).toBeVisible();
  await fillRegistration(page, { ...account, phone: 'abc', password: '123' });
  await page.locator('[formControlName="confirmPassword"]').fill('different');
  await page.locator('[formControlName="acceptTerms"]').uncheck();
  await page.getByRole('button', { name: 'Create Account', exact: true }).click();
  await expect(page.getByText('Please enter a valid phone number.', { exact: true })).toBeVisible();
  await expect(page.getByText('Password must be at least 6 characters.', { exact: true })).toBeVisible();
  await expect(page.getByText('Passwords must match.', { exact: true })).toBeVisible();
  await expect(page).toHaveURL(/\/sign-up$/);
});

test('03. Email đã đăng ký bị chặn; đổi email mới thì đăng ký được', async ({ page }) => {
  await page.goto('/sign-up');
  await fillRegistration(page, { ...account, email: 'user@giakiet.com' });
  await page.getByRole('button', { name: 'Create Account', exact: true }).click();
  await expect(page.getByText('Email không hợp lệ hoặc đã được sử dụng.', { exact: true })).toBeVisible();
  await expect(page).toHaveURL(/\/sign-up$/);
  await page.locator('[formControlName="email"]').fill(account.email);
  await page.locator('[formControlName="phone"]').focus();
  await expect(page.getByRole('button', { name: 'Create Account', exact: true })).toBeEnabled();
  await page.getByRole('button', { name: 'Create Account', exact: true }).click();
  await expect(page).toHaveURL(/\/home$/);
});

test('04. User không có quyền vào admin; logout vẫn ở trang công khai', async ({ page }) => {
  await loginUser(page);
  await page.goto('/admin/vehicles');
  await expect(page).toHaveURL(/\/loginadmin\?redirectTo=/);
  await page.goto('/home');
  await logoutUser(page);
  await page.goto('/test-drives');
  await expect(page.locator('fieldset')).toHaveJSProperty('disabled', true);
  await expect(page.getByRole('button', { name: 'Đăng ký lái thử', exact: true })).toBeDisabled();
});

test('05. Đăng nhập form sai và tài khoản bị khóa bị từ chối', async ({ page }) => {
  await page.goto('/sign-in');
  await page.getByRole('button', { name: 'Sign In', exact: true }).click();
  await expect(page.getByText('Please enter a valid email address.', { exact: true })).toBeVisible();
  await expect(page.getByText('Password must be at least 6 characters.', { exact: true })).toBeVisible();
  await signIn(page, 'helena.v@outlook.com', 'user123');
  await expect(page.getByRole('alert')).toHaveText('Tài khoản chưa hoạt động hoặc đã bị khoá.');
  await expect(page).toHaveURL(/\/sign-in$/);
});
