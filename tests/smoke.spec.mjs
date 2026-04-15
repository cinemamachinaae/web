import { test, expect } from '@playwright/test';

const pages = [
  '/',
  '/services.html',
  '/about.html',
  '/why-setup-matters.html',
  '/contact.html',
];

for (const route of pages) {
  test(`loads ${route}`, async ({ page }) => {
    const response = await page.goto(route, { waitUntil: 'domcontentloaded' });
    expect(response && response.ok()).toBeTruthy();
    await expect(page.locator('body')).toBeVisible();
  });
}

test('homepage hero is visible', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toBeVisible();
});

test('contact form is visible', async ({ page }) => {
  await page.goto('/contact.html');
  await expect(page.locator('form')).toBeVisible();
});

test('navigation renders', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('nav, .nav').first()).toBeVisible();
});
