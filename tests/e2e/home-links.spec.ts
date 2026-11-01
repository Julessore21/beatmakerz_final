import { test, expect } from '@playwright/test';

const CTAS = [
  { section: 'Section 1', label: /VOIR LE CATALOGUE/i, path: '/web/catalogue' },
  { section: 'Section 2', label: /VOIR NOS OFFRES/i, path: '/web/abonnements' },
  { section: 'Section 3', label: /EN SAVOIR PLUS/i, path: '/web/prodsurmesure' },
  { section: 'Section 4', label: /EN SAVOIR PLUS/i, path: '/web/notrehistoire' },
];

for (const cta of CTAS) {
  test(`le CTA de l'accueil (${cta.section}) mène à ${cta.path} en 200`, async ({ page }) => {
    await page.goto('/');

    await page.getByRole('button', { name: cta.section }).click();

    const link = page.locator(`a[href="${cta.path}"]`);
    await expect(link).toHaveText(cta.label);

    await link.click();
    await page.waitForURL(`**${cta.path}`);

    const response = await page.request.get(cta.path);
    expect(response.status()).toBe(200);
  });
}

for (const old of ['/catalogue', '/abonnements', '/prodsurmesure']) {
  test(`${old} redirige vers /web${old} en 200`, async ({ page }) => {
    const response = await page.goto(old);
    expect(response?.status()).toBe(200);
    expect(new URL(page.url()).pathname).toBe(`/web${old}`);
  });
}
