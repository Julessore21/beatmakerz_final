import { test, expect } from '@playwright/test';
import { mockApi } from './api-mock';

test('les pages retirées de la V1 redirigent vers le catalogue', async ({ page }) => {
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
    Array.from(new Set(links.map((a) => a.getAttribute('href')!.split('#')[0] || '/')))
  );
  expect(hrefs.length).toBeGreaterThan(8);
  for (const href of hrefs) {
    const res = await request.get(href);
    expect(res.status(), href).toBeLessThan(400);
  }
});

test('sans compte : on remplit le panier, la case de rétractation conditionne le paiement, puis on crée son compte', async ({ page }) => {
  await mockApi(page);
  await page.goto('/web/catalogue');
  await expect(page.locator('[role="listitem"]')).toHaveCount(3);
  await page.getByRole('button', { name: /Ajouter Dark Melo au panier/ }).click();
  const drawer = page.getByRole('dialog', { name: 'Panier' });
  await expect(drawer.getByText('Dark Melo')).toBeVisible();
  const pay = drawer.getByRole('button', { name: 'Payer' });
  await expect(pay).toBeDisabled();
  await drawer.getByRole('checkbox').check();
  await pay.click();
  await expect(page).toHaveURL(/\/web\/profil\?next=/);
  await expect(page.getByRole('heading', { name: 'Crée ton compte' })).toBeVisible();
  // Le panier sans compte reste dans le navigateur.
  await page.goto('/web/panier');
  await expect(page.locator('main').getByText('Dark Melo')).toBeVisible();
});

test('le catalogue filtre par genre et par recherche', async ({ page }) => {
  await mockApi(page);
  await page.goto('/web/catalogue');
  await page.getByRole('button', { name: 'Drill', exact: true }).click();
  await expect(page.locator('[role="listitem"]')).toHaveCount(1);
  await expect(page).toHaveURL(/genre=Drill/);
  await page.getByRole('button', { name: 'Tous', exact: true }).click();
  await page.getByPlaceholder(/Titre, genre/).fill('old');
  await expect(page.locator('[role="listitem"]')).toHaveCount(1);
});

test('le lien court d’une prod ouvre sa fiche', async ({ page }) => {
  await mockApi(page);
  await page.goto('/prod/b1');
  await expect(page).toHaveURL(/\/web\/prod\/b1$/);
  await expect(page.getByRole('heading', { name: 'Dark Melo' })).toBeVisible();
});

test('le panier vide le dit et renvoie au catalogue', async ({ page }) => {
  await page.goto('/web/panier');
  await expect(page.getByRole('heading', { name: 'Panier' })).toBeVisible();
  await expect(page.locator('main').getByText(/Ton panier est vide/i)).toBeVisible();
  await expect(page.locator('main').getByRole('link', { name: /Voir le catalogue/i })).toBeVisible();
});

test('la page 404 propose de revenir au catalogue', async ({ page }) => {
  await page.goto('/web/page-qui-n-existe-pas');
  await expect(page.getByRole('heading', { name: /Cette page n’existe pas/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /Voir le catalogue/i }).first()).toBeVisible();
});
