// @ts-check
const { test, expect } = require('@playwright/test');

// This test is now tagged for both 'sanity' and 'regression' suites.
test('homepage has Playwright in title and get started link linking to the intro page @sanity @regression', async ({ page }, testInfo) => {
  await page.goto('https://playwright.dev/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);

  // create a locator
  const getStarted = page.locator('text=Get Started');

  // Expect an attribute "to be strictly equal" to the value.
  await expect(getStarted).toHaveAttribute('href', '/docs/intro');

  // Click the get started link.
  await getStarted.click();
  
  await page.screenshot({ path: 'screen_capture.png' });
  await testInfo.attach( 'screen_capture.png', { path: 'screen_capture.png', contentType: 'image/png' });

  // Expects the URL to contain intro.
  await expect(page).toHaveURL(/.*intro/);
});

// This is a second example test, tagged only for the 'smoke' suite.
test('Check for the search bar on the page @smoke', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  const searchButton = page.locator('.DocSearch-Button-Placeholder');
  await expect(searchButton).toBeVisible();
  await expect(searchButton).toHaveText('Search');
});
