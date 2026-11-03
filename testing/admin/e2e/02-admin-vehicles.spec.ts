import { test, expect } from '@playwright/test';
import {
  createVehicle, expectModels, fillVehicle, loginToVehicles, vehicleInput, vehicleRow,
} from './helpers/admin';

test.beforeEach(async ({ page }) => {
  await loginToVehicles(page);
});

test('01. Thêm → tìm → sửa → hủy xóa → xác nhận xóa xe', async ({ page }) => {
  await test.step('Thêm xe hợp lệ và kiểm tra từng trường trong bảng', async () => {
    await createVehicle(page, vehicleInput);
    const row = vehicleRow(page, vehicleInput.model);
    await expect(row.locator('td:nth-child(3)')).toHaveText('BMW');
    await expect(row.locator('td:nth-child(5)')).toHaveText('2024');
    await expect(row.locator('.cell-price')).toHaveText('$50,000');
    await expect(row.locator('td:nth-child(7)')).toHaveText('3 xe');
    await expect(row.locator('td:nth-child(8)')).toHaveText('Black');
    await expect(row.locator('.status-badge')).toHaveText('available');
  });
  await test.step('Tìm model không phân biệt hoa thường', async () => {
    await page.getByPlaceholder('Search vehicles...').fill('  pw crud  ');
    await expectModels(page, [vehicleInput.model]);
  });
  const updatedModel = 'PW CRUD Updated';
  await test.step('Sửa brand, model, year, price, stock, color và status', async () => {
    await vehicleRow(page, vehicleInput.model).getByTitle('Sửa', { exact: true }).click();
    await fillVehicle(page, {
      ...vehicleInput, brand: 'Audi', model: updatedModel, year: 2023, price: 65000,
      stockQuantity: 7, color: 'White', status: 'reserved',
    });
    await page.locator('form.modal-content').getByRole('button', { name: 'Save', exact: true }).click();
    await expect(page.locator('form.modal-content')).toHaveCount(0);
    const row = vehicleRow(page, updatedModel);
    await expect(row.locator('td:nth-child(3)')).toHaveText('Audi');
    await expect(row.locator('td:nth-child(5)')).toHaveText('2023');
    await expect(row.locator('.cell-price')).toHaveText('$65,000');
    await expect(row.locator('td:nth-child(7)')).toHaveText('7 xe');
    await expect(row.locator('td:nth-child(8)')).toHaveText('White');
    await expect(row.locator('.status-badge')).toHaveText('reserved');
    await row.getByTitle('Sửa', { exact: true }).click();
    await expect(page.locator('form.modal-content [formControlName="model"]')).toHaveValue(updatedModel);
    await page.getByRole('button', { name: 'Cancel', exact: true }).click();
  });
  await test.step('Hủy xác nhận xóa: xe vẫn còn', async () => {
    page.once('dialog', dialog => dialog.dismiss());
    await vehicleRow(page, updatedModel).getByTitle('Xoá', { exact: true }).click();
    await expect(vehicleRow(page, updatedModel)).toHaveCount(1);
  });
  await test.step('Xác nhận xóa: xe biến mất, tìm lại không có', async () => {
    page.once('dialog', dialog => dialog.accept());
    await vehicleRow(page, updatedModel).getByTitle('Xoá', { exact: true }).click();
    await expectModels(page, []);
    await page.getByPlaceholder('Search vehicles...').fill(updatedModel);
    await expectModels(page, []);
  });
});

test('02. Tìm kiếm + brand/status/year riêng lẻ, kết hợp AND và reset bộ lọc', async ({ page }) => {
  test.setTimeout(60_000);
  await test.step('Tạo 4 xe có thuộc tính khác nhau để đối chiếu chính xác', async () => {
    await createVehicle(page, { ...vehicleInput, model: 'PW FILTER A' });
    await createVehicle(page, { ...vehicleInput, model: 'PW FILTER B', year: 2023, status: 'sold' });
    await createVehicle(page, { ...vehicleInput, model: 'PW FILTER C', brand: 'Audi', status: 'reserved' });
    await createVehicle(page, { ...vehicleInput, model: 'PW FILTER D', brand: 'Audi', year: 2023, status: 'draft' });
    await page.getByPlaceholder('Search vehicles...').fill('pw filter');
    await expectModels(page, ['PW FILTER D', 'PW FILTER C', 'PW FILTER B', 'PW FILTER A']);
  });
  const filters = page.locator('.filter-bar');
  await test.step('Lọc brand: BMW rồi Audi', async () => {
    await filters.locator('[formControlName="brand"]').selectOption('BMW');
    await expectModels(page, ['PW FILTER B', 'PW FILTER A']);
    await filters.locator('[formControlName="brand"]').selectOption('Audi');
    await expectModels(page, ['PW FILTER D', 'PW FILTER C']);
    await filters.locator('[formControlName="brand"]').selectOption('all');
    await expectModels(page, ['PW FILTER D', 'PW FILTER C', 'PW FILTER B', 'PW FILTER A']);
  });
  await test.step('Lọc từng status: available/reserved/sold/draft', async () => {
    for (const [status, model] of [
      ['available', 'PW FILTER A'], ['reserved', 'PW FILTER C'],
      ['sold', 'PW FILTER B'], ['draft', 'PW FILTER D'],
    ]) {
      await filters.locator('[formControlName="status"]').selectOption(status);
      await expectModels(page, [model]);
    }
    await filters.locator('[formControlName="status"]').selectOption('all');
    await expectModels(page, ['PW FILTER D', 'PW FILTER C', 'PW FILTER B', 'PW FILTER A']);
  });
  await test.step('Lọc năm 2024 và 2023', async () => {
    await filters.locator('[formControlName="year"]').selectOption({ label: '2024' });
    await expectModels(page, ['PW FILTER C', 'PW FILTER A']);
    await filters.locator('[formControlName="year"]').selectOption({ label: '2023' });
    await expectModels(page, ['PW FILTER D', 'PW FILTER B']);
  });
  await test.step('Kết hợp BMW + sold + 2023; đổi năm thành 2024 thì không có kết quả', async () => {
    await filters.locator('[formControlName="brand"]').selectOption('BMW');
    await filters.locator('[formControlName="status"]').selectOption('sold');
    await expectModels(page, ['PW FILTER B']);
    await filters.locator('[formControlName="year"]').selectOption({ label: '2024' });
    await expectModels(page, []);
  });
  await test.step('Reset bộ lọc và kiểm tra tìm kiếm không có kết quả', async () => {
    await filters.locator('[formControlName="brand"]').selectOption('all');
    await filters.locator('[formControlName="status"]').selectOption('all');
    await filters.locator('[formControlName="year"]').selectOption('all');
    await expectModels(page, ['PW FILTER D', 'PW FILTER C', 'PW FILTER B', 'PW FILTER A']);
    await page.getByPlaceholder('Search vehicles...').fill('PW DOES NOT EXIST');
    await expectModels(page, []);
    await page.getByPlaceholder('Search vehicles...').fill('pw filter');
    await expectModels(page, ['PW FILTER D', 'PW FILTER C', 'PW FILTER B', 'PW FILTER A']);
  });
});

test('03. Dữ liệu sai: hiện validation, giữ form, sửa lại thì thêm được', async ({ page }) => {
  await page.getByRole('button', { name: 'Add New Vehicle', exact: true }).click();
  const modal = page.locator('form.modal-content');
  const save = modal.getByRole('button', { name: 'Save', exact: true });
  await save.click();
  for (const message of [
    'Vui lòng nhập thương hiệu', 'Vui lòng nhập tên dòng xe', 'Vui lòng nhập màu xe', 'Giá phải lớn hơn 0',
  ]) await expect(modal.getByText(message, { exact: true })).toBeVisible();

  await fillVehicle(page, {
    ...vehicleInput, model: 'X'.repeat(61), year: 1899, price: -1, stockQuantity: 1.5, imageUrl: 'invalid-url',
  });
  await save.click();
  await expect(modal.getByText('Tối đa 60 ký tự', { exact: true })).toBeVisible();
  await expect(modal.getByText('Năm phải từ 1900 đến', { exact: false })).toBeVisible();
  await expect(modal.getByText('Số lượng phải là số nguyên không âm', { exact: true })).toBeVisible();
  await expect(modal.getByText('Đường dẫn phải bắt đầu bằng http:// hoặc https://', { exact: true })).toBeVisible();
  await fillVehicle(page, { ...vehicleInput, model: 'PW Corrected' });
  await save.click();
  await expect(modal).toHaveCount(0);
  await expect(vehicleRow(page, 'PW Corrected')).toHaveCount(1);
});

test('04. Thêm thất bại với brand không tồn tại: báo lỗi, giữ dữ liệu, cho thử lại', async ({ page }) => {
  await page.getByRole('button', { name: 'Add New Vehicle', exact: true }).click();
  await fillVehicle(page, { ...vehicleInput, brand: 'Unknown Brand', model: 'PW Retry Create' });
  const modal = page.locator('form.modal-content');
  await modal.getByRole('button', { name: 'Save', exact: true }).click();
  await expect(page.getByText('Vui lòng chọn thương hiệu có trong showroom.', { exact: true })).toBeVisible();
  await expect(modal).toBeVisible();
  await expect(modal.locator('[formControlName="model"]')).toHaveValue('PW Retry Create');
  await expect(modal.getByRole('button', { name: 'Save', exact: true })).toBeEnabled();
  await expect(vehicleRow(page, 'PW Retry Create')).toHaveCount(0);
  await modal.locator('[formControlName="brand"]').fill('BMW');
  await modal.getByRole('button', { name: 'Save', exact: true }).click();
  await expect(modal).toHaveCount(0);
  await expect(vehicleRow(page, 'PW Retry Create')).toHaveCount(1);
});

test('05. Sửa thất bại không ghi đè xe; sửa lại đúng thì lưu được', async ({ page }) => {
  await createVehicle(page, { ...vehicleInput, model: 'PW Retry Edit' });
  const row = vehicleRow(page, 'PW Retry Edit');
  await row.getByTitle('Sửa', { exact: true }).click();
  const modal = page.locator('form.modal-content');
  await modal.locator('[formControlName="brand"]').fill('Unknown Brand');
  await modal.getByRole('button', { name: 'Save', exact: true }).click();
  await expect(page.getByText('Vui lòng chọn thương hiệu có trong showroom.', { exact: true })).toBeVisible();
  await expect(modal).toBeVisible();
  await expect(row.locator('.cell-brand')).toHaveText('BMW');
  await modal.locator('[formControlName="brand"]').fill('Audi');
  await modal.getByRole('button', { name: 'Save', exact: true }).click();
  await expect(modal).toHaveCount(0);
  await expect(row.locator('.cell-brand')).toHaveText('Audi');
});

test('06. Xe có lịch lái thử: không cho xóa và xe vẫn còn trong bảng', async ({ page }) => {
  await page.getByPlaceholder('Search vehicles...').fill('M4 Competition');
  const row = vehicleRow(page, 'M4 Competition');
  await expect(row).toHaveCount(1);
  page.once('dialog', dialog => dialog.accept());
  await row.getByTitle('Xoá', { exact: true }).click();
  await expect(page.getByText('Xe đã có lịch lái thử, không thể xoá.', { exact: true })).toBeVisible();
  await expect(row).toHaveCount(1);
});

test('07. Lỗi máy chủ khi tìm kiếm: hiện thông báo và tìm lại được sau lỗi', async ({ page }) => {
  await page.getByPlaceholder('Search vehicles...').fill('!error');
  await expect(page.getByText('Lỗi máy chủ. Vui lòng thử lại sau.', { exact: true })).toBeVisible();
  await expect(page.locator('.loading-cell')).toHaveCount(0);
  await page.getByPlaceholder('Search vehicles...').fill('M4 Competition');
  await expectModels(page, ['M4 Competition']);
});

test('08. Phiên đăng nhập mất hiệu lực khi lưu: báo lỗi và yêu cầu đăng nhập lại', async ({ page }) => {
  await page.getByRole('button', { name: 'Add New Vehicle', exact: true }).click();
  await fillVehicle(page, { ...vehicleInput, model: 'PW Expired Session' });
  // Fault injection only inside this test's browser context; no change to application code.
  await page.evaluate(() => localStorage.removeItem('auth_token'));
  await page.locator('form.modal-content').getByRole('button', { name: 'Save', exact: true }).click();
  await expect(page.getByText('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.', { exact: true })).toBeVisible();
  await expect(page).toHaveURL(/\/loginadmin\?redirectTo=/);
});
