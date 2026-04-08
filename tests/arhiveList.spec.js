import { test, expect } from '@playwright/test';
import {
  openModule,
  clickUpdate,
  expectTableUpdated,
  selectFirstPatientRow,     
  openPatientCard,
  openExtendedSearch,
  checkReport,
  mockRequest,
  setArchivePlanDate,     
  checkArchivePlan,
} from './vaccination-cards-063u/helpers';

test.describe('Модуль Запланированные прививки — фильтры', () => {
  
 test.beforeEach(async ({ page }) => {
    await page.goto('/');
    const opened = await openModule(page, 'Запланированные прививки', {
      waitForFields: false,
    });
    await page.waitForTimeout(3000);
    
    const diseasesTab = page.locator('.el-tabs__item', { hasText: 'Запланированные прививки' });
    const tabVisible = await diseasesTab.isVisible({ timeout: 1000 }).catch(() => false);
    
    if (!tabVisible) {
      throw new Error('Вкладка "Запланированные прививки" не найдена');
    }
    
    await diseasesTab.click();
    console.log('✓ Переход на вкладку "Запланированные прививки"');
    
    await page.waitForTimeout(2000);
  });

test('Проверка перехода из Действия в Архивные планы', async ({ page }) => {
  console.log('=== ТЕСТ: переход из действия в архивные планы ===');

  // Открываем архивные планы
  await checkArchivePlan(page);

  

 await page.waitForTimeout(1000);
 await setArchivePlanDate(page, 1, 1, 2026);
  
  // Обновляем таблицу
  await clickUpdate(page, null);
  await expectTableUpdated(page);
  
  // Проверяем что записи загрузились
  const rows = page.locator('.el-table__body .el-table__row');
  const rowCount = await rows.count();
  
  console.log(`✓ Загружено записей: ${rowCount}`);
  
  if (rowCount > 0) {
    console.log('✓ Архивные планы загружены успешно');
  } else {
    console.log('ℹ Нет архивных планов на указанную дату');
  }
  
  console.log('=== ТЕСТ ЗАВЕРШЕН ===');
});



});