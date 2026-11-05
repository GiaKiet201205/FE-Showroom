import { expect, Page } from '@playwright/test';

export const brandInput = { name: 'PW Brand', origin: 'Japan', listedVehicles: '0', status: 'active' };
export const sellerInput = {
  fullName: 'PW Seller', email: 'pw.seller@example.com', phone: '0998880001',
  company: 'PW Company', joinDate: '2030-12-01', status: 'verified',
};

export async function navigateAdmin(page: Page, path: string, heading: string) {
  // Router navigation preserves the in-memory brand/vehicle store and seller company details.
  await page.locator(`.nav-list a[href="${path}"]`).click();
  await expect(page).toHaveURL(new RegExp(`${path}$`));
  await expect(page.getByRole('heading', { name: heading, exact: true })).toBeVisible();
}

export function brandCard(page: Page, name: string) {
  return page.locator('.brand-card').filter({ has: page.locator('.brand-name', { hasText: new RegExp(`^${name}$`) }) });
}

export async function fillBrand(page: Page, data = brandInput) {
  const modal = page.locator('form.modal-content');
  for (const [field, value] of Object.entries(data)) {
    const control = modal.locator(`[formControlName="${field}"]`);
    if (field === 'origin' || field === 'status') await control.selectOption(value);
    else await control.fill(value);
  }
}

export async function createBrand(page: Page, data = brandInput) {
  await page.getByRole('button', { name: 'Add Brand', exact: true }).click();
  await fillBrand(page, data);
  await page.locator('form.modal-content').getByRole('button', { name: 'Save', exact: true }).click();
  await expect(page.locator('form.modal-content')).toHaveCount(0);
  await page.getByPlaceholder('Search brands...').fill(data.name);
  await expect(brandCard(page, data.name)).toHaveCount(1);
}

export async function expectBrands(page: Page, names: string[]) {
  await expect(page.locator('.brand-grid .brand-name')).toHaveText(names);
  await expect(page.locator('.pagination-info')).toContainText(`of ${names.length} brands`);
}

export function sellerRow(page: Page, email: string) {
  return page.locator('.seller-table tbody tr').filter({ has: page.locator('td:nth-child(2)', { hasText: email }) });
}

export async function fillSeller(page: Page, data = sellerInput) {
  const modal = page.locator('form.modal-content');
  for (const [field, value] of Object.entries(data)) {
    const control = modal.locator(`[formControlName="${field}"]`);
    if (field === 'status') await control.selectOption(value);
    else await control.fill(value);
  }
}

export async function createSeller(page: Page, data = sellerInput) {
  await page.getByRole('button', { name: 'Thêm seller', exact: true }).click();
  await fillSeller(page, data);
  await page.locator('form.modal-content').getByRole('button', { name: 'Lưu seller', exact: true }).click();
  await expect(page.locator('form.modal-content')).toHaveCount(0);
  await page.getByPlaceholder('Search sellers, company name...').fill(data.email);
  await expect(sellerRow(page, data.email)).toHaveCount(1);
}

export async function expectSellers(page: Page, emails: string[]) {
  await expect(page.locator('.seller-table tbody tr td:nth-child(2)')).toHaveText(emails);
  await expect(page.locator('.pagination-info')).toContainText(`of ${emails.length} sellers`);
}
