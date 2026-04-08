import { test, expect } from '@playwright/test';

test('Проверка откроетия страницы входа в систему', async ({ page }) => {
  await page.goto('/#/login')

  await expect(page).toHaveURL(/login/)

  const loginButton = page.locator('#EnterBtnAuthFormEmis')

  await expect(loginButton).toBeVisible()
})
