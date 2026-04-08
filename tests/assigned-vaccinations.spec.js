import { test, expect } from '@playwright/test';
import {
  openAssignedVaccinations,
  switchToTab,
  clickUpdate,
  expectTableUpdated,
  selectPatientRowInAssigned,
  getAssignedActionButtons,
  expectOneRecordNotification,
  expectAtLeastOneRecordNotification,
  openPatientCard,
  closeDialogUniversalAuto,
} from './vaccination-cards-063u/helpers';

test.describe('Модуль Назначенные вакцинации', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    const opened = await openAssignedVaccinations(page);
    expect(opened).toBe(true);
    await page.waitForTimeout(3000);
  });

  // ТЕСТ 1: Переключение вкладок
  test('Переключение между Прививки и Пробы', async ({ page }) => {
    console.log('=== ТЕСТ: Переключение вкладок ===');
    
    // Проверить что по умолчанию активна "Прививки"
    const activeTab = page.locator('.SheetHeader_temp_item_qGYWW.SheetHeader_checked_wr4un');
    await expect(activeTab).toBeVisible({ timeout: 5000 });
    const activeText = await activeTab.textContent();
    expect(activeText).toContain('Прививки');
    console.log('✓ По умолчанию активна "Прививки"');
    
    // Переключиться на "Пробы"
    await switchToTab(page, 'Пробы');
    
    // Проверить что "Пробы" активна
    const activeTabAfter = page.locator('.SheetHeader_temp_item_qGYWW.SheetHeader_checked_wr4un');
    await expect(activeTabAfter).toBeVisible({ timeout: 5000 });
    const activeTextAfter = await activeTabAfter.textContent();
    expect(activeTextAfter).toContain('Пробы');
    console.log('✓ Вкладка "Пробы" активна');
    
    // Переключиться обратно на "Прививки"
    await switchToTab(page, 'Прививки');
    
    // Проверить что "Прививки" активна
    const activeTabFinal = page.locator('.SheetHeader_temp_item_qGYWW.SheetHeader_checked_wr4un');
    await expect(activeTabFinal).toBeVisible({ timeout: 5000 });
    const activeTextFinal = await activeTabFinal.textContent();
    expect(activeTextFinal).toContain('Прививки');
    console.log('✓ Вкладка "Прививки" снова активна');
    
    console.log('=== ТЕСТ ЗАВЕРШЕН ===');
  });

  // ТЕСТ 2: Обновление без фильтров
  test('Обновление списка прививок', async ({ page }) => {
    console.log('=== ТЕСТ: Обновление списка прививок ===');
    
    // Переключиться на "Прививки" (если не активна)
    await switchToTab(page, 'Прививки');
    
    // Нажать "Обновить"
    await clickUpdate(page, '/vaccination');
    
    // Проверить что таблица обновилась
    await expectTableUpdated(page);
    
    // Проверить что есть хотя бы 1 строка
    const rows = page.locator('.el-table__row');
    const rowCount = await rows.count();
    expect(rowCount).toBeGreaterThan(0);
    console.log(`✓ Найдено строк: ${rowCount}`);
    
    console.log('=== ТЕСТ ЗАВЕРШЕН ===');
  });

  // ТЕСТ 3: Проверка уведомлений без выбора
  test('Уведомления при действиях без выбора записи', async ({ page }) => {
    console.log('=== ТЕСТ: Уведомления без выбора ===');
    
    // Переключиться на "Прививки"
    await switchToTab(page, 'Прививки');
    
    // Обновить таблицу
    await clickUpdate(page, '/vaccination');
    await expectTableUpdated(page);
    
    // Получить кнопки действий
    const { openCardBtn, executeBtn } = await getAssignedActionButtons(page);
    
    // Кликнуть "Открыть карту" без выбора
    await openCardBtn.click();
    
    // Проверить уведомление expectAtLeastOneRecordNotification
    await expectAtLeastOneRecordNotification(page);
    
    // Кликнуть "Выполнить" без выбора
    await executeBtn.click();
    
    // Проверить уведомление expectAtLeastOneRecordNotification
    await expectAtLeastOneRecordNotification(page);
    
    console.log('=== ТЕСТ ЗАВЕРШЕН ===');
  });

  // ТЕСТ 4: Открытие карты пациента
  test('Открытие карты пациента из назначенных', async ({ page }) => {
    console.log('=== ТЕСТ: Открытие карты пациента ===');
    
    // Переключиться на "Прививки"
    await switchToTab(page, 'Прививки');
    
    // Обновить
    await clickUpdate(page, '/vaccination');
    await expectTableUpdated(page);
    
    // Выбрать первую строку
    const selected = await selectPatientRowInAssigned(page, 0);
    expect(selected).toBe(true);
    
    // Кликнуть "Открыть карту"
    const { openCardBtn } = await getAssignedActionButtons(page);
    await openCardBtn.click();
    
    // Проверить что карта открылась (использовать openPatientCard или проверку диалога)
    const cardOpened = await openPatientCard(page);
    expect(cardOpened).toBe(true);
    
    // Закрыть диалог
    await closeDialogUniversalAuto(page);
    
    console.log('=== ТЕСТ ЗАВЕРШЕН ===');
  });

  // ТЕСТ 5: Открытие формы выполнения
  test('Открытие формы выполнения прививки', async ({ page }) => {
    console.log('=== ТЕСТ: Открытие формы выполнения прививки ===');
    
    // Переключиться на "Прививки"
    await switchToTab(page, 'Прививки');
    
    // Обновить
    await clickUpdate(page, '/vaccination');
    await expectTableUpdated(page);
    
    // Выбрать первую строку
    const selected = await selectPatientRowInAssigned(page, 0);
    expect(selected).toBe(true);
    
    // Кликнуть "Выполнить"
    const { executeBtn } = await getAssignedActionButtons(page);
    await executeBtn.click();
    
    // Проверить что открылся диалог с формой выполнения
    const dialog = page.locator('.el-dialog').filter({ hasText: /Выполнение|Выполнить|Карта прививки/i });
    await expect(dialog).toBeVisible({ timeout: 5000 });
    console.log('✓ Диалог формы выполнения открыт');
    
    // Закрыть диалог через Escape
    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden({ timeout: 3000 });
    
    console.log('=== ТЕСТ ЗАВЕРШЕН ===');
  });

  // ТЕСТ 6: Проверка для проб
  test('Выполнение пробы', async ({ page }) => {
    console.log('=== ТЕСТ: Выполнение пробы ===');
    
    // Переключиться на "Пробы"
    await switchToTab(page, 'Пробы');
    
    // Обновить
    await clickUpdate(page, '/vaccination');
    await expectTableUpdated(page);
    
    // Выбрать первую строку (если есть)
    const rows = page.locator('.el-table__row');
    const rowCount = await rows.count();
    if (rowCount === 0) {
      console.log('⚠ Нет записей проб, тест пропущен');
      return;
    }
    
    const selected = await selectPatientRowInAssigned(page, 0);
    expect(selected).toBe(true);
    
    // Кликнуть "Выполнить"
    const { executeBtn } = await getAssignedActionButtons(page);
    await executeBtn.click();
    
    // Проверить что открылась форма выполнения пробы
    const dialog = page.locator('.el-dialog').filter({ hasText: /Выполнение|Выполнить|Карта пробы/i });
    await expect(dialog).toBeVisible({ timeout: 5000 });
    console.log('✓ Диалог формы выполнения пробы открыт');
    
    // Закрыть диалог
    await closeDialogUniversalAuto(page);
    
    console.log('=== ТЕСТ ЗАВЕРШЕН ===');
  });
});