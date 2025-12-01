import { test, expect } from '@playwright/test';

test('soumission du brief prod sur mesure', async ({ page }) => {
  await page.goto('/prodsurmesure');

  await page.getByRole('button', { name: /Remplir le formulaire/i }).click();
  await expect(page.getByText(/Formulaire de production/i)).toBeVisible();

  await page.getByRole('button', { name: /^Piano$/i }).click();

  const detailsField = page.locator('textarea[name="details"]');
  await detailsField.fill('Je veux une prod trap sombre avec un piano planant et une 808 lourde.');

  await page.getByRole('button', { name: /Proc[ée]der au paiement/i }).click();

  await expect(page.getByText(/Ton formulaire a bien/)).toBeVisible();
});
