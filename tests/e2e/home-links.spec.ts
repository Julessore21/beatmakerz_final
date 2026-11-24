import { test, expect } from '@playwright/test';
import { mockApi } from './api-mock';

for (const cta of [
  { label: 'Écouter le catalogue', path: '/web/catalogue' },
  { label: 'Prod sur mesure', path: '/web/prodsurmesure' },
]) {
  test(`le bouton « ${cta.label} » de l'accueil mène à ${cta.path}`, async ({ page }) => {
    await mockApi(page);
    await page.goto('/');
    const link = page.locator('section').first().getByRole('link', { name: cta.label });
    await expect(link).toHaveAttribute('href', cta.path);
    await link.click();
    await page.waitForURL(`**${cta.path}`);
  });
}

for (const old of ['/catalogue', '/prodsurmesure', '/contact']) {
  test(`${old} redirige vers /web${old} en 200`, async ({ page }) => {
    const response = await page.goto(old);
    expect(response?.status()).toBe(200);
    expect(new URL(page.url()).pathname).toBe(`/web${old}`);
  });
}
