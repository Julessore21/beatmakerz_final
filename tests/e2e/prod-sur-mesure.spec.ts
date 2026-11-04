import { test, expect } from '@playwright/test';

test('le brief prod sur mesure part vers le checkout de l’API', async ({ page }) => {
  // On intercepte l'appel API : le test ne dépend ni du backend ni de Stripe.
  let payload: Record<string, string> | null = null;
  await page.route('**/checkout/custom-prod', async (route) => {
    payload = route.request().postDataJSON();
    await route.fulfill({ json: { url: 'http://localhost:3000/web/prodsurmesure?success=true' } });
  });

  await page.goto('/web/prodsurmesure');
  await page.getByRole('button', { name: /Remplir le formulaire/i }).click();
  await expect(page.getByText(/Formulaire de production/i)).toBeVisible();

  await page.getByRole('button', { name: /^Piano$/i }).click();
  await page.locator('textarea[name="details"]').fill('Prod trap sombre, piano planant et 808 lourde.');
  await page.getByRole('button', { name: /Proc[ée]der au paiement/i }).click();

  // Laisse le temps au serveur de dev de compiler la page de retour.
  await expect(page.getByText(/Paiement reçu, merci/)).toBeVisible({ timeout: 20_000 });
  expect(payload).toMatchObject({ instruments: 'Piano', brief: expect.stringContaining('808') });
});
