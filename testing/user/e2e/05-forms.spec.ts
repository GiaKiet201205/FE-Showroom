import { test, expect } from '@playwright/test';
import { loginUser } from './helpers/user';

test.describe.configure({ timeout: 90_000 });

test('01. Quên mật khẩu: email sai không gửi; email đúng nhận thông báo mô phỏng', async ({ page }) => {
  await page.goto('/forgot-password');
  await page.getByRole('button', { name: 'Send Reset Link', exact: true }).click();
  await expect(page.getByRole('alert')).toHaveText('Vui lòng nhập email hợp lệ.');
  await page.locator('[formControlName="email"]').fill('user@giakiet.com');
  await page.getByRole('button', { name: 'Send Reset Link', exact: true }).click();
  await expect(page.locator('.hero [role="status"]')).toContainText('Không có email thực được gửi.');
});

test('02. Contact: validation → gửi mock → reset form; mở/đóng FAQ', async ({ page }) => {
  await page.goto('/contact');
  await page.getByRole('button', { name: 'Send Message', exact: true }).click();
  await expect(page.locator('form .error').first()).toBeVisible();
  const data = { fullName: 'PW Website Customer', email: 'pw.contact@example.com', phone: '0901234567',
    message: 'Please tell me more about available vehicles.' };
  for (const [field, value] of Object.entries(data)) await page.locator(`[formControlName="${field}"]`).fill(value);
  await page.getByRole('button', { name: 'Send Message', exact: true }).click();
  await expect(page.locator('.contact-page .success-message')).toBeVisible();
  await expect(page.locator('[formControlName="message"]')).toHaveValue('');
  const faq = page.locator('.faq-item').first();
  const wasOpen = await faq.locator('.faq-answer').count();
  await faq.locator('.faq-question').click();
  await expect(faq.locator('.faq-answer')).toHaveCount(wasOpen ? 0 : 1);
  await faq.locator('.faq-question').click();
  await expect(faq.locator('.faq-answer')).toHaveCount(wasOpen);
});

test('03. Profile: validation và cập nhật bản ghi mock cục bộ', async ({ page }) => {
  await loginUser(page);
  await page.goto('/profile');
  await page.locator('[formControlName="fullName"]').fill('');
  await page.locator('[formControlName="email"]').fill('invalid');
  await page.getByRole('button', { name: 'Save Changes', exact: true }).click();
  await expect(page.locator('form .error').first()).toBeVisible();
  const data = { fullName: 'PW Local Profile', email: 'pw.profile@example.com', phone: '0901234567', location: 'Ho Chi Minh City' };
  for (const [field, value] of Object.entries(data)) await page.locator(`[formControlName="${field}"]`).fill(value);
  await page.getByRole('button', { name: 'Save Changes', exact: true }).click();
  await expect(page.locator('.profile-page .success-message')).toBeVisible();
  await expect(page.getByText('PW Local Profile', { exact: true })).toBeVisible();
});
