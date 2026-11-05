import { test, expect } from '@playwright/test';
import { expectCars, searchCars } from './helpers/user';

test.describe.configure({ timeout: 90_000 });

test('01. Cars: search, brand, query URL, kết hợp không khớp và reset', async ({ page }) => {
  await page.goto('/cars?brand=BMW&bodyType=Coupe&minPrice=1000&maxPrice=100000');
  await expectCars(page, ['BMW M4 Competition']);
  await expect(page.locator('.filter-sidebar #brand')).toHaveValue('BMW');
  await expect(page.getByRole('checkbox', { name: 'Coupe', exact: true })).toBeChecked();
  await page.getByRole('button', { name: 'Reset Filters', exact: true }).click();
  await searchCars(page, '  m4 competition  ');
  await expectCars(page, ['BMW M4 Competition']);
  await page.locator('.filter-sidebar #brand').selectOption('Audi');
  await expectCars(page, []);
  await expect(page.locator('.empty-results')).toBeVisible();
  await page.getByRole('button', { name: 'Reset Filters', exact: true }).click();
  await page.locator('.filter-sidebar #brand').selectOption('Porsche');
  await expectCars(page, ['Porsche Taycan Turbo GT', 'Porsche 911 Turbo S', 'Porsche 911 GT3 RS', 'Porsche 911 Carrera S']);
});

test('02. Cars: lọc giá/năm/body type AND và reset', async ({ page }) => {
  await page.goto('/cars');
  await expect(page.locator('.cars-grid .car-card')).toHaveCount(6);
  await page.locator('.filter-sidebar #brand').selectOption('BMW');
  await expectCars(page, ['BMW XM', 'BMW M8 Competition', 'BMW M3 Competition', 'BMW M4 Competition']);
  const years = page.getByPlaceholder('Any year');
  await years.nth(0).fill('2023'); await years.nth(0).press('Tab');
  await years.nth(1).fill('2024'); await years.nth(1).press('Tab');
  await page.getByRole('checkbox', { name: 'Coupe', exact: true }).check();
  const slider = page.locator('input[type="range"]');
  await slider.evaluate((element: HTMLInputElement) => {
    element.value = '50000'; element.dispatchEvent(new Event('input', { bubbles: true }));
    element.dispatchEvent(new Event('change', { bubbles: true }));
  });
  await expectCars(page, []);
  await slider.evaluate((element: HTMLInputElement) => {
    element.value = '100000'; element.dispatchEvent(new Event('input', { bubbles: true }));
    element.dispatchEvent(new Event('change', { bubbles: true }));
  });
  await expectCars(page, ['BMW M4 Competition']);
  await years.nth(0).fill('2024'); await years.nth(0).press('Tab');
  await expectCars(page, []);
  await page.getByRole('button', { name: 'Reset Filters', exact: true }).click();
  await expect(page.locator('.cars-grid .car-card')).toHaveCount(6);
  await expect(years.nth(0)).toHaveValue('');
  await expect(page.getByRole('checkbox', { name: 'Coupe', exact: true })).not.toBeChecked();
});

test('03. Cars: sort giá/năm, chuyển trang và tìm kiếm reset về trang 1', async ({ page }) => {
  await page.goto('/cars');
  const sort = page.locator('.sort select');
  await sort.selectOption('price-asc');
  await expect(page.locator('.cars-grid h3').first()).toHaveText('BMW M4 Competition');
  const ascending = (await page.locator('.cars-grid .price').allTextContents()).map(v => Number(v.replace(/[^\d.]/g, '')));
  expect(ascending).toEqual([...ascending].sort((a, b) => a - b));
  await sort.selectOption('price-desc');
  await expect(page.locator('.cars-grid h3').first()).toHaveText('Bugatti Divo');
  await sort.selectOption('year-desc');
  await expect(page.locator('.cars-grid .car-year').first()).toContainText('2026');
  await sort.selectOption('newest');
  await expect(page.locator('.cars-grid h3').first()).toHaveText('Rolls-Royce Cullinan');
  const names = await page.locator('.cars-grid h3').allTextContents();
  await page.locator('.pagination').getByRole('button', { name: '2', exact: true }).click();
  await expect(page.locator('.cars-grid h3').first()).toHaveText('Bugatti W16 Mistral');
  await expect(page.locator('.cars-grid .car-card')).toHaveCount(6);
  expect((await page.locator('.cars-grid h3').allTextContents()).some(name => names.includes(name))).toBe(false);
  await searchCars(page, 'M4 Competition');
  await expectCars(page, ['BMW M4 Competition']);
});

test('04. Chi tiết xe hiển thị đúng, đi tới đăng ký lái thử với xe đã chọn', async ({ page }) => {
  await page.goto('/cars');
  await searchCars(page, 'M4 Competition');
  await expectCars(page, ['BMW M4 Competition']);
  await page.getByRole('button', { name: 'View Details', exact: true }).click();
  await expect(page).toHaveURL(/\/cars\/1$/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('BMW M4 Competition');
  await page.getByRole('button', { name: 'Schedule Test Drive', exact: true }).click();
  await expect(page).toHaveURL(/\/test-drives\?vehicleId=1$/);
  await expect(page.locator('[formControlName="selectedVehicleId"] option:checked')).toHaveText('BMW M4 Competition');
  await expect(page.locator('fieldset')).toHaveJSProperty('disabled', true);
  await expect(page.getByRole('button', { name: 'Đăng ký lái thử', exact: true })).toBeDisabled();
});

test('05. Brands trang User: chọn thương hiệu mở catalog với brand tương ứng', async ({ page }) => {
  await page.goto('/brands');
  const card = page.locator('button.brand-card').filter({ has: page.getByRole('heading', { name: 'BMW', exact: true }) });
  await card.click();
  await expect(page).toHaveURL(/\/cars\?brand=BMW$/);
  await expect(page.locator('.filter-sidebar #brand')).toHaveValue('BMW');
  await expectCars(page, ['BMW XM', 'BMW M8 Competition', 'BMW M3 Competition', 'BMW M4 Competition']);
});
