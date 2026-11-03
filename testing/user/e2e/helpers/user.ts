import { expect, Page } from '@playwright/test';

export const account = {
  fullName: 'PW Website Customer', email: 'pw.website@example.com',
  phone: '0901234567', password: 'customer123',
};

export async function fillRegistration(page: Page, data = account) {
  for (const [field, value] of Object.entries(data)) await page.locator(`[formControlName="${field}"]`).fill(value);
  await page.locator('[formControlName="confirmPassword"]').fill(data.password);
  await page.locator('[formControlName="acceptTerms"]').check();
  await expect(page.getByRole('button', { name: 'Create Account', exact: true })).toBeEnabled();
}

export async function registerUser(page: Page, data = account) {
  await page.goto('/sign-up');
  await fillRegistration(page, data);
  await page.getByRole('button', { name: 'Create Account', exact: true }).click();
  await expect(page).toHaveURL(/\/home$/);
  await expect(page.locator('.navbar .account-name')).toHaveText(data.fullName);
}

export async function signIn(page: Page, email = 'user@giakiet.com', password = 'user123') {
  await page.goto('/sign-in');
  await page.locator('[formControlName="email"]').fill(email);
  await page.locator('[formControlName="password"]').fill(password);
  await page.getByRole('button', { name: 'Sign In', exact: true }).click();
}

export async function loginUser(page: Page) {
  await signIn(page);
  await expect(page).toHaveURL(/\/home$/);
  await expect(page.locator('.navbar .account-name')).toHaveText('Demo User');
}

export async function logoutUser(page: Page) {
  await page.locator('.navbar').getByRole('button', { name: 'Đăng xuất', exact: true }).click();
  await expect(page).toHaveURL(/\/home$/);
  await expect(page.locator('.navbar').getByRole('link', { name: 'Sign In', exact: true })).toBeVisible();
}

export async function searchCars(page: Page, search: string) {
  await page.getByPlaceholder('Search by brand, model, color...').fill(search);
  await page.locator('.cars-content').getByRole('button', { name: 'Search', exact: true }).click();
  await expect(page.getByText('Loading vehicles...', { exact: true })).toHaveCount(0);
}

export async function expectCars(page: Page, names: string[]) {
  await expect(page.locator('.cars-grid .car-card h3')).toHaveText(names);
  await expect(page.locator('.cars-toolbar > strong')).toContainText(`Showing ${names.length} premium vehicles`);
}

export const booking = { date: '2099-12-01', time: '09:00 AM' };
export async function fillBooking(page: Page, date = booking.date, time = booking.time) {
  await page.locator('[formControlName="selectedVehicleId"]').selectOption({ label: 'BMW M4 Competition' });
  await page.locator('[formControlName="sellerId"]').selectOption({ index: 1 });
  await page.locator('[formControlName="preferredDate"]').fill(date);
  await page.locator('[formControlName="preferredTime"]').selectOption(time);
}

export async function submitBooking(page: Page) {
  await page.getByRole('button', { name: 'Đăng ký lái thử', exact: true }).click();
}
