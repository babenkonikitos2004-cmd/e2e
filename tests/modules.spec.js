import { test, expect } from '@playwright/test';

test.describe('Smoke: открытие ключевых модулей', () => {

  test.beforeEach(async ({ page }) => {
    // Пользователь уже авторизован
    await page.goto('/');

    // Ждём диалог выбора модулей
    const dialog = page.locator('#EmisFrameSelectArmDialog');
    await dialog.waitFor({ state: 'visible', timeout: 30_000 });
  });

  test('Пользователь может открывать ключевые модули', async ({ page }) => {
    const dialog = page.locator('#EmisFrameSelectArmDialog');
    const rows = dialog.locator('.el-table__body .el-table__row');

    const visibleCount = await rows.count();
    expect(visibleCount).toBeGreaterThan(0);

    const MODULES_TO_CHECK = Math.min(5, visibleCount);
    console.log(`Проверяем ${MODULES_TO_CHECK} модулей из ${visibleCount}`);

    for (let i = 0; i < MODULES_TO_CHECK; i++) {
      console.log(`\nМодуль #${i + 1}`);

      //  каждый раз пересоздаём локатор
      const row = dialog
        .locator('.el-table__body .el-table__row')
        .nth(i);
      await expect(row).toBeVisible({ timeout: 10_000 });

      const moduleName = (await row.textContent())?.trim();
      console.log(`Открываем модуль: ${moduleName}`);

      await row.click();

      const startBtn = dialog.locator('#SetBtnSelectArmEmis');
      await expect(startBtn).toBeEnabled({ timeout: 20_000 });
      await startBtn.click();

      // --- модуль загружается ---  
      const moduleRoot = page.locator('.emis-frame.tabs-menu').first();
      await moduleRoot.waitFor({ state: 'visible', timeout: 45_000 });

      console.log(`Модуль загружен: ${moduleName}`);

      // --- возрат к списку модулей ---
      const dashboardBtn = page.locator('.tab-icon-container').first();
      await expect(dashboardBtn).toBeVisible({ timeout: 20_000 });
      await dashboardBtn.click();

      // Диалог должен появиться снова
      await dialog.waitFor({ state: 'visible', timeout: 30_000 });
      await expect(
        dialog.locator('.el-table__body .el-table__row').first()
      ).toBeVisible({ timeout: 20_000 });

      console.log(`Возврат к списку модулей OK`);
    }
  });

}, { timeout: 5 * 60_000 });


