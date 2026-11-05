import { expect, Page } from '@playwright/test';

export const bookingInput = {
  preferredDate: '2030-12-01', timeSlot: '09:00 AM', location: 'PW Showroom', status: 'pending',
};

export async function fillBooking(page: Page, data = bookingInput, customerLabel?: string) {
  const modal = page.locator('form.modal-content');
  await modal.locator('[formControlName="customerId"]').selectOption(customerLabel ? { label: customerLabel } : { index: 1 });
  await modal.locator('[formControlName="vehicleId"]').selectOption({ index: 1 });
  await modal.locator('[formControlName="sellerId"]').selectOption({ index: 1 });
  for (const field of ['preferredDate', 'timeSlot', 'location'] as const) {
    await modal.locator(`[formControlName="${field}"]`).fill(data[field]);
  }
  await modal.locator('[formControlName="status"]').selectOption(data.status);
}

export function bookingRow(page: Page, id: string) {
  return page.locator('.td-table tbody tr').filter({ has: page.locator('.cell-id', { hasText: id }) });
}

export async function scheduleBooking(page: Page, data = bookingInput, customerLabel?: string) {
  await page.getByRole('button', { name: 'Schedule Test Drive', exact: true }).click();
  await fillBooking(page, data, customerLabel);
  await page.locator('form.modal-content').getByRole('button', { name: 'Save', exact: true }).click();
  await expect(page.locator('form.modal-content')).toHaveCount(0);
  await page.locator('.filter-bar [formControlName="date"]').fill(data.preferredDate);
  const row = page.locator('.td-table tbody tr')
    .filter({ has: page.locator('td:nth-child(5)', { hasText: data.preferredDate }) })
    .filter({ has: page.locator('td:nth-child(6)', { hasText: data.timeSlot }) });
  await expect(row).toHaveCount(1);
  return (await row.locator('.cell-id').innerText()).trim();
}

export async function expectBookings(page: Page, ids: string[]) {
  await expect(page.locator('.td-table tbody .cell-id')).toHaveText(ids);
  await expect(page.locator('.pagination-info')).toContainText(`of ${ids.length} bookings`);
}
