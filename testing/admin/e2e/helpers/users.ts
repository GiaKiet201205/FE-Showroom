import { expect, Page } from '@playwright/test';

export const userInput = {
  fullName: 'PW Customer', email: 'pw.customer@example.com', phone: '0901234567',
  password: 'customer123', role: 'user', status: 'active',
};

export function userRow(page: Page, email: string) {
  return page.locator('.user-table tbody tr').filter({
    has: page.locator('td:nth-child(2)', { hasText: email }),
  });
}

export async function fillUser(page: Page, data: typeof userInput) {
  const modal = page.locator('form.modal-content');
  for (const [field, value] of Object.entries(data)) {
    const control = modal.locator(`[formControlName="${field}"]`);
    if (field === 'role' || field === 'status') await control.selectOption(value);
    else await control.fill(value);
  }
}

export async function createUser(page: Page, data = userInput) {
  await page.getByRole('button', { name: 'Add User' }).click();
  await fillUser(page, data);
  await page.locator('form.modal-content').getByRole('button', { name: 'Save', exact: true }).click();
  await expect(page.locator('form.modal-content')).toHaveCount(0);
  await page.getByPlaceholder('Search users by name, email...').fill(data.email);
  await expect(userRow(page, data.email)).toHaveCount(1);
}

export async function expectUsers(page: Page, emails: string[]) {
  await expect(page.locator('.user-table tbody tr td:nth-child(2)')).toHaveText(emails);
  await expect(page.locator('.pagination-info')).toContainText(`of ${emails.length} users`);
}
