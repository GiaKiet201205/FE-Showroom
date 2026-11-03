import { test, expect } from '@playwright/test';
import { expectCars, searchCars } from './helpers/user';

test.describe.configure({ timeout: 90_000 });

async function saveCar(page: import('@playwright/test').Page, search: string, name: string) {
  await searchCars(page, search);
  await expectCars(page, [name]);
  const card = page.locator('.cars-grid .car-card');
  await card.getByRole('button', { name: 'Add to favorites and comparison', exact: true }).click();
  await expect(card.locator('.favorite-button')).toHaveAttribute('aria-pressed', 'true');
}

test('01. Favorites → Compare: đúng xe, highlight giá/năm, reload và loại xe', async ({ page }) => {
  await page.goto('/compare');
  await expect(page.getByRole('heading', { name: 'No vehicles to compare', exact: true })).toBeVisible();
  await page.goto('/cars');
  await saveCar(page, 'M4 Competition', 'BMW M4 Competition');
  await saveCar(page, '911 Carrera S', 'Porsche 911 Carrera S');
  await page.locator('.navbar').getByRole('link', { name: 'Compare', exact: true }).click();
  await expect(page.locator('.compare-card h2')).toHaveText(['BMW M4 Competition', 'Porsche 911 Carrera S']);
  const bmw = page.locator('.compare-card').filter({ has: page.getByRole('heading', { name: 'BMW M4 Competition', exact: true }) });
  for (const label of ['Price', 'Year']) {
    const row = bmw.locator('.spec-row').filter({ has: page.getByText(label, { exact: true }) });
    await expect(row.locator('strong')).toHaveClass(/highlight/);
  }
  await page.reload();
  await expect(page.locator('.compare-card')).toHaveCount(2);
  await page.locator('.compare-card').filter({ hasText: 'Porsche 911 Carrera S' }).getByRole('button', { name: 'Remove vehicle', exact: true }).click();
  await expect(page.locator('.compare-card')).toHaveCount(1);
  await expect(page.getByText('Choose another vehicle using the heart button to compare.', { exact: true })).toBeVisible();
  await expect(page.locator('.highlight')).toHaveCount(0);
  await page.getByRole('button', { name: 'Remove vehicle', exact: true }).click();
  await expect(page.locator('.empty-compare')).toBeVisible();
  // Removing comparison entries does not remove favorites; clearing favorites removes both.
  await page.goto('/favorites');
  await expect(page.locator('.favorites-grid .vehicle-card')).toHaveCount(2);
  await page.getByRole('button', { name: 'Clear All', exact: true }).click();
  await expect(page.locator('.empty-favorites')).toBeVisible();
  await page.goto('/compare');
  await expect(page.locator('.empty-compare')).toBeVisible();
});

test('02. Favorites: thêm từ chi tiết, lưu qua reload, xem lại chi tiết và bỏ yêu thích', async ({ page }) => {
  await page.goto('/cars/1');
  await page.getByRole('button', { name: 'Add to Favorites', exact: true }).click();
  await page.locator('.navbar').getByRole('link', { name: 'Wishlist', exact: true }).click();
  await expect(page.locator('.favorites-grid h2')).toHaveText(['BMW M4 Competition']);
  await page.reload();
  await expect(page.locator('.favorites-grid h2')).toHaveText(['BMW M4 Competition']);
  await page.getByRole('button', { name: 'View Details', exact: true }).click();
  await expect(page).toHaveURL(/\/cars\/1$/);
  await page.goto('/favorites');
  await page.getByRole('button', { name: 'Remove favorite', exact: true }).click();
  await expect(page).toHaveURL(/\/favorites$/);
  await expect(page.locator('.empty-favorites')).toBeVisible();
  await page.goto('/compare');
  await expect(page.locator('.empty-compare')).toBeVisible();
});
