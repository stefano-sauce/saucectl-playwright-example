// @ts-check
const { test, expect } = require('@playwright/test');

// This test is now tagged and points to your local server.
test('homepage has the correct title on localhost @sanity @regression', async ({ page }, testInfo) => {
  // 1. Navigate to the local server URL
  await page.goto('http://localhost:3000/');

  // 2. Expect the title to match the content of your index.html file
  await expect(page).toHaveTitle(/Localhost Test/);

  // 3. Verify the h1 tag content on the page
  const header = page.locator('h1');
  await expect(header).toHaveText('Hello from my Local Server!');
  
  // You can still take screenshots and attach them
  await page.screenshot({ path: 'screen_capture.png' });
  await testInfo.attach( 'screen_capture.png', { path: 'screen_capture.png', contentType: 'image/png' });
});

// You can add other tests as needed.
test('Check for the paragraph on the localhost page @smoke', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  const paragraph = page.locator('p');
  await expect(paragraph).toBeVisible();
  await expect(paragraph).toHaveText('This page is running on my machine.');
});
