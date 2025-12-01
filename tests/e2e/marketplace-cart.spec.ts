import { test, expect } from '@playwright/test';

test('navigation marketplace et gestion du panier', async ({ page }) => {
  await page.goto('/marketplace');

  const searchInput = page.getByPlaceholder(/Rechercher/i);
  await expect(searchInput).toBeVisible();
  await searchInput.fill('beat');
  await expect(searchInput).toHaveValue('beat');

  await page.getByRole('button', { name: /tableau/i }).click();
  await expect(page.locator('table')).toBeVisible();

  await page.getByRole('button', { name: /grille/i }).click();
  await page.getByRole('button', { name: /vendre/i }).click();
  await expect(page.getByText(/Devenez vendeur/i)).toBeVisible();

  await page.getByRole('button', { name: /consulter/i }).click();

  await expect(page.getByTestId('beat-card').first()).toBeVisible();
  const addButton = page.getByTestId('action-add-to-cart').first();
  await addButton.scrollIntoViewIfNeeded();
  await expect(addButton).toBeVisible();
  await addButton.click();

  await page.getByRole('button', { name: /Panier/i }).click();
  await expect(page.getByText(/Mon panier/i)).toBeVisible();

  await page.getByRole('button', { name: /Voir mon panier/i }).click();
  await page.waitForURL('**/panier');
  await expect(page.getByRole('heading', { name: /Mon panier/i })).toBeVisible();

  const increaseButton = page.getByRole('button', { name: /Augmenter/i }).first();
  await expect(increaseButton).toBeVisible();
  await increaseButton.click();

  await expect(page.getByText(/Nombre d['’]articles\s*:\s*2/i)).toBeVisible();
});
