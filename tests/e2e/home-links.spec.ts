import { test, expect } from '@playwright/test';

const CTAS = [
  { section: 'Section 1', label: /VOIR LE CATALOGUE/i, path: '/web/catalogue' },
  { section: 'Section 2', label: /EN SAVOIR PLUS/i, path: '/web/prodsurmesure' },
  { section: 'Section 3', label: /NOUS CONTACTER/i, path: '/web/contact' },
];

for (const cta of CTAS) {
  test(`le CTA de l'accueil (${cta.section}) mène à ${cta.path} en 200`, async ({ page }) => {
    await page.goto('/');

    await page.getByRole('button', { name: cta.section }).click();

    // Le menu et le footer pointent aussi vers ces pages : on cible le CTA par son libellé.
    const link = page.getByRole('link', { name: cta.label });
    await expect(link).toHaveAttribute('href', cta.path);

    await link.click();
    await page.waitForURL(`**${cta.path}`);

    const response = await page.request.get(cta.path);
    expect(response.status()).toBe(200);
  });
}

for (const old of ['/catalogue', '/prodsurmesure', '/contact']) {
  test(`${old} redirige vers /web${old} en 200`, async ({ page }) => {
    const response = await page.goto(old);
    expect(response?.status()).toBe(200);
    expect(new URL(page.url()).pathname).toBe(`/web${old}`);
  });
}
