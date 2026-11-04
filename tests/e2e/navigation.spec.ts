import { test, expect } from '@playwright/test';

test('les pages masquées en V1 redirigent vers le catalogue', async ({ page }) => {
  test.setTimeout(180_000);
  for (const path of ['/web/abonnements', '/web/marketplace', '/web/cartes-cadeau', '/web/vendeur/onboarding', '/web/tarification', '/web/notrehistoire']) {
    await page.goto(path);
    await expect(page).toHaveURL(/\/web\/catalogue$/);
  }
});

test('aucun lien du menu ni du footer ne mène à une 404', async ({ page, request }) => {
  test.setTimeout(180_000); // en dev, chaque page est compilée à la première visite
  await page.goto('/web/faq');
  const hrefs = await page.locator('nav a[href^="/"], footer a[href^="/"]').evaluateAll((links) =>
    Array.from(new Set(links.map((a) => a.getAttribute('href')!.split('#')[0] ?? '')))
  );
  expect(hrefs.length).toBeGreaterThan(8);
  for (const href of hrefs) {
    const res = await request.get(href);
    expect(res.status(), href).toBeLessThan(400);
  }
});

test('un visiteur qui paie est invité à se connecter', async ({ page }) => {
  await page.goto('/web/panier');
  await expect(page.getByRole('heading', { name: /Mon panier/i })).toBeVisible();
  await expect(page.getByText(/Ton panier est vide/i)).toBeVisible();
  await expect(page.getByRole('button', { name: /Payer avec Stripe/i })).toBeDisabled();
});

test('la page 404 propose de revenir au catalogue', async ({ page }) => {
  await page.goto("/web/page-qui-n-existe-pas");
  await expect(page.getByRole('heading', { name: /Cette page n’existe pas/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /Voir le catalogue/i })).toBeVisible();
});
