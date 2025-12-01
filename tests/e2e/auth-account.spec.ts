import { test, expect } from '@playwright/test';

test('parcours complet inscription, accès compte et déconnexion', async ({ page }) => {
  const username = 'testuser-' + Date.now();
  const password = 'Password!123';

  await page.goto('/profil');

  await page.getByRole('button', { name: /s'?inscrire/i }).click();
  await page.locator('input[name="username"]').fill(username);
  await page.locator('input[name="password"]').fill(password);
  await page.getByRole('button', { name: /cr[ée]er un compte/i }).click();
  await expect(page).toHaveURL(/\/$/);

  await page.goto('/account');
  const greetingRegex = new RegExp('Bonjour\\s+' + username, 'i');
  await expect(page.getByText(greetingRegex)).toBeVisible();
  await expect(page.getByText(username + '@beatmakerz.com', { exact: false })).toBeVisible();

  await page.getByRole('button', { name: /se d.?connecter/i }).click();
  await expect(page).toHaveURL(/\\\/account$/);
  await expect(page.getByRole('button', { name: /se connecter/i })).toBeVisible();
});
