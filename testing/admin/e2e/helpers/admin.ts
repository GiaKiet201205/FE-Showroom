import { expect, Page } from '@playwright/test';
import { MOCK_ADMIN_CREDENTIALS } from '../../../../src/app/core/services/auth.mock';

export async function fillLogin(page: Page, email = MOCK_ADMIN_CREDENTIALS.email, password = MOCK_ADMIN_CREDENTIALS.password) {
  await page.locator('input[formControlName="email"]').fill(email);
  await page.locator('input[formControlName="password"]').fill(password);
  await page.getByRole('button', { name: 'Đăng nhập', exact: true }).click();
}

// Each test signs in through the real form in a fresh browser context.
export async function loginToAdmin(page: Page, path: string, heading: string) {
  await page.goto(path);
  await expect(page).toHaveURL(/\/loginadmin\?redirectTo=/);
  await fillLogin(page);
  await expect(page).toHaveURL(new RegExp(`${path}$`));
  await expect(page.getByRole('heading', { name: heading, exact: true })).toBeVisible();
  await expect(page.locator('.loading-cell')).toHaveCount(0);
}

export async function loginToVehicles(page: Page) {
  await loginToAdmin(page, '/admin/vehicles', 'Vehicle Management');
}

export interface VehicleForm {
  brand: string;
  model: string;
  year: number;
  price: number;
  stockQuantity: number;
  color: string;
  status: string;
  imageUrl: string;
}

export const vehicleInput: VehicleForm = {
  brand: 'BMW', model: 'PW CRUD', year: 2024, price: 50000,
  stockQuantity: 3, color: 'Black', status: 'available', imageUrl: '',
};

export async function fillVehicle(page: Page, data: VehicleForm) {
  const modal = page.locator('form.modal-content');
  for (const [field, value] of Object.entries(data)) {
    const control = modal.locator(`[formControlName="${field}"]`);
    if (field === 'status') await control.selectOption(String(value));
    else await control.fill(String(value));
  }
}

export async function createVehicle(page: Page, data: VehicleForm) {
  await page.getByRole('button', { name: 'Add New Vehicle', exact: true }).click();
  await fillVehicle(page, data);
  await page.locator('form.modal-content').getByRole('button', { name: 'Save', exact: true }).click();
  await expect(page.locator('form.modal-content')).toHaveCount(0);
  await expect(page.locator('.vehicle-table tbody tr').filter({ hasText: data.model })).toHaveCount(1);
}

export function vehicleRow(page: Page, model: string) {
  return page.locator('.vehicle-table tbody tr').filter({
    has: page.locator('td:nth-child(4)', { hasText: new RegExp(`^${model}$`) }),
  });
}

export async function expectModels(page: Page, models: string[]) {
  await expect(page.locator('.loading-cell')).toHaveCount(0);
  await expect(page.locator('.vehicle-table tbody tr td:nth-child(4)')).toHaveText(models);
  await expect(page.locator('.pagination-info')).toContainText(`of ${models.length} vehicles`);
}
