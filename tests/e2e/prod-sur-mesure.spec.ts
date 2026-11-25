import { test, expect } from '@playwright/test';
import { mockApi } from './api-mock';

test('le brief prod sur mesure part vers le paiement de l’API, avec l’adresse de livraison', async ({ page }) => {
  await mockApi(page);
  let payload: Record<string, string> | null = null;
  await page.route(/\/checkout\/custom-prod$/, async (route) => {
    if (route.request().method() !== 'POST') return route.fallback();
    payload = route.request().postDataJSON();
    await route.fulfill({ json: { url: 'http://localhost:3000/web/prodsurmesure?success=true' } });
  });

  await page.goto('/web/prodsurmesure');
  await expect(page.getByText('59,99 €').first()).toBeVisible();
  await page.getByRole('button', { name: /Payer/ }).click();
  await expect(page.getByText('Choisis un genre.')).toBeVisible();

  await page.getByRole('button', { name: 'Trap', exact: true }).click();
  await page.getByRole('button', { name: 'Sombre', exact: true }).click();
  await page.getByPlaceholder('Piano, 808…').fill('Piano');
  await page.getByPlaceholder(/Le thème du morceau/).fill('Prod trap sombre, piano planant et 808 lourde.');
  await page.getByPlaceholder('toi@exemple.fr').fill('artiste@exemple.fr');
  await page.getByRole('button', { name: /Payer/ }).click();

  await expect(page.getByText(/C’est parti pour ta prod/)).toBeVisible({ timeout: 20_000 });
  expect(payload).toMatchObject({ genre: 'Trap', style: 'Sombre', instruments: 'Piano', email: 'artiste@exemple.fr', brief: expect.stringContaining('808') });
});
