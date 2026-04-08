import { test, expect } from '@playwright/test';
import { openModule, checkInfoSystem } from './vaccination-cards-063u/helpers';

test('Debug checkInfoSystem', async ({ page }) => {
  console.log('=== Debug checkInfoSystem ===');
  await page.goto('/');
  
  // Open module
  const opened = await openModule(page, 'Карты прививок 063У', { waitForFields: false });
  expect(opened).toBe(true);
  console.log('Module opened:', opened);
  await page.waitForTimeout(3000);
  
  // Try checkInfoSystem
  try {
    await checkInfoSystem(page);
    console.log('checkInfoSystem succeeded');
  } catch (error) {
    console.error('checkInfoSystem failed:', error.message);
    // Take screenshot
    await page.screenshot({ path: 'debug-checkInfoSystem-error.png', fullPage: true });
    throw error;
  }
  
  // Wait a bit and take screenshot
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'debug-checkInfoSystem-success.png', fullPage: true });
  console.log('=== Debug completed ===');
});