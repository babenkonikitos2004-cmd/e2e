import { test, expect } from '@playwright/test';

test.describe('Авторизация: логин в ЭМИС', () => {

  test('пользователь авторизовывается', async ({ page }) => {

    await page.goto('/#/login');

    const loginInput = page.locator('.login-input-login input');
    const passwordInput = page.locator('.login-input-password input');
    const submitButton = page.locator('#EnterBtnAuthFormEmis');

    // --- файл логина и пароля ---
    await expect(loginInput).toBeVisible({ timeout: 15_000 });
    await loginInput.fill(process.env.LOGIN);

    await expect(passwordInput).toBeVisible({ timeout: 15_000 });
    await passwordInput.fill(process.env.PASSWORD);

    // кнопка становится активной после валидации
    await expect(submitButton).toBeEnabled({ timeout: 15_000 });

    // --- авторизация ---
    await Promise.all([
      page.waitForURL(url => !url.toString().includes('login'), {
        timeout: 30_000,
      }),
      submitButton.click(),
    ]);

    // --- главная страница ЭМИС ---
    const modulesDialog = page.locator('#EmisFrameSelectArmDialog');
    await expect(modulesDialog).toBeVisible({ timeout: 30_000 });

    // минимальная проверка, что есть хотя бы один модуль
    await expect(
      modulesDialog.locator('.el-table__body .el-table__row').first()
    ).toBeVisible({ timeout: 20_000 });

    console.log('Авторизация прошла успешно, диалог модулей отображается');
  });

});
