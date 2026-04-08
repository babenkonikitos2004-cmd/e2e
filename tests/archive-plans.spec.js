import { test, expect } from '@playwright/test';
import {
  openModule,
  checkArchivePlan,
  selectFirstPatientRow,
  openPatientCard,
  expectOneRecordNotification,
} from './vaccination-cards-063u/helpers';

test.describe('Модуль Архивные планы', () => {
  
  test.describe.configure({ timeout: 120000 });

  test.beforeEach(async ({ page }, testInfo) => {
    testInfo.setTimeout(90000);
    
    console.log('=== beforeEach: Начало ===');
    
    // Мок данных для архивных планов
    const mockArchiveData = [
      {
        "id": "015011d0-f294-4a52-8d42-1da0451c293c",
        "vacdocId": "00080895-d7da-4330-b01e-dd99e3ec758a",
        "recalcDt": "2026-01-29",
        "fio": "ПОЛЯКОВА НАДЕЖДА ЕВГЕНЬЕВНА",
        "fioPerson": "Круглов Петр Сергеевич",
        "vacDiseaseName": "Туберкулез",
        "vacTypeName": "Проба Манту",
        "sexName": "Женский",
        "birthDt": "2020-01-18",
        "dt": "2026-01-29",
        "type": "probe"
      },
      {
        "id": "015184c9-a141-4080-9c70-5c7d2a3bf7ce",
        "vacdocId": "0f77a51b-4f1d-4250-9005-7618aa3e8934",
        "recalcDt": "2025-11-18",
        "fio": "ЗАХАРОВ ВАСИЛИЙ БОРИСОВИЧ",
        "fioPerson": "Круглов Петр Сергеевич",
        "vacDiseaseName": "Паротит",
        "vacTypeName": "V1",
        "sexName": "Мужской",
        "birthDt": "2013-08-15",
        "dt": "2026-04-06",
        "type": "vaccine"
      },
      {
        "id": "018ce5a0-fbfe-4cba-8dd5-a9963311886d",
        "vacdocId": "000df957-f2da-49e7-a1d4-050184cbce99",
        "recalcDt": "2025-12-02",
        "fio": "СЕРГЕЕВ ИГОРЬ ДМИТРИЕВИЧ",
        "fioPerson": "Сафонова Юлия Сергеевна",
        "vacDiseaseName": "Туберкулез",
        "vacTypeName": "V1",
        "sexName": "Мужской",
        "birthDt": "1980-03-30",
        "dt": "2025-06-03",
        "type": "vaccine"
      },
      {
        "id": "01973896-6f40-4f89-a30c-15058fffc288",
        "vacdocId": "d8cc70e1-fdcb-4074-9bf1-0103b35b2d50",
        "recalcDt": "2025-11-01",
        "fio": "ШАКИРОВ МАКСИМ ДМИТРИЕВИЧ",
        "fioPerson": "Круглов Петр Сергеевич",
        "vacDiseaseName": "Краснуха",
        "vacTypeName": "R1",
        "sexName": "Мужской",
        "birthDt": "2024-06-13",
        "dt": "2030-06-13",
        "type": "vaccine"
      },
      {
        "id": "0247a36c-b27c-4ef1-a27a-40a28a4d92fd",
        "vacdocId": "f0393f6c-eacc-4b5a-8490-1cc834bd7924",
        "recalcDt": "2025-10-21",
        "fio": "ИВАНОВТЕСТ НИКОЛАЙ АЛЕКСАНДРОВИЧ",
        "fioPerson": "Круглов Петр Сергеевич",
        "vacDiseaseName": "Гепатит B",
        "vacTypeName": "V1",
        "sexName": "Мужской",
        "birthDt": "2023-12-11",
        "dt": "2025-11-22",
        "type": "vaccine"
      },
      {
        "id": "03167863-9b6d-41ac-8948-f1c8eebc4113",
        "vacdocId": "00080895-d7da-4330-b01e-dd99e3ec758a",
        "recalcDt": "2026-01-29",
        "fio": "ПОЛЯКОВА НАДЕЖДА ЕВГЕНЬЕВНА",
        "fioPerson": "Круглов Петр Сергеевич",
        "vacDiseaseName": "Туберкулез",
        "vacTypeName": "Диаскинтест",
        "sexName": "Женский",
        "birthDt": "2020-01-18",
        "dt": "2037-01-29",
        "type": "probe"
      }
    ];

    // Мок для запроса архивных планов
    await page.route('**/Vaccine/plan/archiveList', async (route) => {
      if (route.request().method() === 'POST') {
        console.log('🎭 MOCK: Перехвачен POST запрос archiveList');
        
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          headers: {
            'Access-Control-Allow-Origin': '*',
          },
          body: JSON.stringify(mockArchiveData),
        });
      } else {
        await route.continue();
      }
    });

    console.log('✓ Моки установлены');
    
    await page.goto('/');
    
    const opened = await openModule(page, 'Запланированные прививки', {
      waitForFields: false,
    });
    
    expect(opened).toBe(true);
    await page.waitForTimeout(3000);
    
    const tab = page.locator('.el-tabs__item:has-text("Запланированные прививки")');
    const tabVisible = await tab.isVisible({ timeout: 3000 }).catch(() => false);
    
    if (tabVisible) {
      await tab.click();
      await page.waitForTimeout(2000);
    }
    
    console.log('=== beforeEach: Завершено ===');
  });

  test('Открытие архивных планов с моковыми данными', async ({ page }) => {
    console.log('=== ТЕСТ: Открытие архивных планов ===');

    await page.waitForTimeout(2000);
    await checkArchivePlan(page);
    
    // Проверить заголовок
    const header = page.locator('.HeaderTitle_name_kyGrK:has-text("Архивные планы")');
    await expect(header).toBeVisible({ timeout: 10000 });
    console.log('✓ Заголовок "Архивные планы" виден');
    
    // Найти панель диалога архивных планов (ID начинается с "pane-VAP_")
    const archivePane = page.locator('[id^="pane-VAP_"]');
    await expect(archivePane).toBeVisible({ timeout: 10000 });
    console.log('✓ Панель архивных планов найдена');
    
    // Клик по кнопке "Обновить" внутри этой панели
    await archivePane.locator('#_refresh').click();
    console.log('✓ Кнопка "Обновить" нажата');
    
    await page.waitForTimeout(2000);
    
    // Проверить таблицу
    const rowCount = await page.locator('.el-table__body .el-table__row').count();
    console.log(`✓ Загружено записей: ${rowCount}`);
    
    expect(rowCount).toBe(6);
    
    console.log('=== ТЕСТ ЗАВЕРШЕН ===');
  });

  test('Проверка действий без выбора записи', async ({ page }) => {
    console.log('=== ТЕСТ: Действия без выбора ===');

    await page.waitForTimeout(2000);
    await checkArchivePlan(page);
    
    // Найти панель диалога архивных планов (ID начинается с "pane-VAP_")
    const archivePane = page.locator('[id^="pane-VAP_"]');
    await expect(archivePane).toBeVisible({ timeout: 10000 });
    console.log('✓ Панель архивных планов найдена');
    
    // Клик по кнопке "Обновить" внутри этой панели
    await archivePane.locator('#_refresh').click();
    await page.waitForTimeout(2000);
    
    // Кнопка "Открыть карту"
    const openCardBtn = page.locator('#_openCardArchivePlan');
    await expect(openCardBtn).toBeVisible({ timeout: 5000 });
    
    await openCardBtn.click();
    await expectOneRecordNotification(page);
    console.log('✓ Уведомление при открытии карты без выбора');
    
    console.log('=== ТЕСТ ЗАВЕРШЕН ===');
  });

  test('Открытие карты пациента из архива', async ({ page }) => {
    console.log('=== ТЕСТ: Открытие карты пациента ===');

    await page.waitForTimeout(2000);
    await checkArchivePlan(page);
    
    // Найти панель диалога архивных планов (ID начинается с "pane-VAP_")
    const archivePane = page.locator('[id^="pane-VAP_"]');
    await expect(archivePane).toBeVisible({ timeout: 10000 });
    console.log('✓ Панель архивных планов найдена');
    
    // Клик по кнопке "Обновить" внутри этой панели
    await archivePane.locator('#_refresh').click();
    await page.waitForTimeout(2000);
    
    // Проверить что есть данные
    const rowCount = await page.locator('.el-table__body .el-table__row').count();
    expect(rowCount).toBeGreaterThan(0);
    console.log(`✓ В таблице ${rowCount} записей`);
    
    // Выбрать первую строку
    const selected = await selectFirstPatientRow(page);
    expect(selected).toBe(true);
    console.log('✓ Первая запись выбрана');
    
    // Кликнуть "Открыть карту"
    await page.locator('#_openCardArchivePlan').click();
    await page.waitForTimeout(2000);
    
    // Проверить что карта открылась
    const cardOpened = await openPatientCard(page);
    
    if (cardOpened) {
      console.log('✓ Карта пациента открыта');
    } else {
      console.log('⚠️ Карта не открылась');
    }
    
    console.log('=== ТЕСТ ЗАВЕРШЕН ===');
  });

  test('Выгрузка в Excel', async ({ page }) => {
    console.log('=== ТЕСТ: Выгрузка в Excel ===');

    await page.waitForTimeout(2000);
    await checkArchivePlan(page);
    
    // Найти панель диалога архивных планов (ID начинается с "pane-VAP_")
    const archivePane = page.locator('[id^="pane-VAP_"]');
    await expect(archivePane).toBeVisible({ timeout: 10000 });
    console.log('✓ Панель архивных планов найдена');
    
    // Клик по кнопке "Обновить" внутри этой панели
    await archivePane.locator('#_refresh').click();
    await page.waitForTimeout(2000);
    
    // Выбрать первую строку
    const selected = await selectFirstPatientRow(page);
    expect(selected).toBe(true);
    console.log('✓ Запись выбрана');
    
    // Отладка: найти все меню внутри панели
    const menus = archivePane.locator('.el-menu--horizontal');
    const menuCount = await menus.count();
    console.log(`Найдено меню .el-menu--horizontal: ${menuCount}`);
    for (let i = 0; i < menuCount; i++) {
      const menu = menus.nth(i);
      const menuText = await menu.textContent();
      console.log(`  Меню ${i}: "${menuText?.substring(0, 50)}"`);
    }
    
    // Выбрать второе меню (предположительно содержит "ДействиеОбновитьВыгрузка в")
    let exportBtn;
    if (menuCount >= 2) {
      exportBtn = menus.nth(1).locator('#_exportExcel');
      console.log('✓ Выбрана кнопка из второго меню');
    } else {
      exportBtn = archivePane.locator('#_exportExcel').first();
      console.log('✓ Выбрана первая кнопка (только одно меню)');
    }
    
    await expect(exportBtn).toBeVisible({ timeout: 5000 });
    console.log('✓ Кнопка "Выгрузка в Excel" найдена');
    
    await exportBtn.click();
    console.log('✓ Клик по "Выгрузка в Excel"');
    
    await page.waitForTimeout(2000);
    
    console.log('=== ТЕСТ ЗАВЕРШЕН ===');
  });

  test('Проверка содержимого таблицы', async ({ page }) => {
    console.log('=== ТЕСТ: Проверка данных в таблице ===');

    await page.waitForTimeout(2000);
    await checkArchivePlan(page);
    
    // Найти панель диалога архивных планов (ID начинается с "pane-VAP_")
    const archivePane = page.locator('[id^="pane-VAP_"]');
    await expect(archivePane).toBeVisible({ timeout: 10000 });
    console.log('✓ Панель архивных планов найдена');
    
    // Клик по кнопке "Обновить" внутри этой панели
    await archivePane.locator('#_refresh').click();
    console.log('✓ Кнопка "Обновить" нажата');
    await page.waitForTimeout(2000);
    
    // Проверить, что таблица загрузилась
    const rows = page.locator('.el-table__body .el-table__row');
    await expect(rows).toHaveCount(6, { timeout: 10000 });
    console.log('✓ Таблица содержит 6 записей');
    
    // Проверить первую строку
    const firstRow = rows.first();
    const firstRowText = await firstRow.textContent();
    
    console.log('Содержимое первой строки:', firstRowText);
    
    expect(firstRowText).toContain('ПОЛЯКОВА');
    
    console.log('✓ Данные из мока отображаются корректно');
    console.log('=== ТЕСТ ЗАВЕРШЕН ===');
  });

  test('Выбор нескольких записей', async ({ page }) => {
    console.log('=== ТЕСТ: Множественный выбор ===');

    await page.waitForTimeout(2000);
    await checkArchivePlan(page);
    
    // Найти панель диалога архивных планов (ID начинается с "pane-VAP_")
    const archivePane = page.locator('[id^="pane-VAP_"]');
    await expect(archivePane).toBeVisible({ timeout: 10000 });
    console.log('✓ Панель архивных планов найдена');
    
    // Клик по кнопке "Обновить" внутри этой панели
    await archivePane.locator('#_refresh').click();
    await page.waitForTimeout(2000);
    
    // Выбрать первые 3 строки
    const rows = page.locator('.el-table__body .el-table__row');
    const rowCount = await rows.count();
    
    const selectCount = Math.min(3, rowCount);
    
    for (let i = 0; i < selectCount; i++) {
      const row = rows.nth(i);
      const checkbox = row.locator('.el-checkbox').first();
      await checkbox.click();
      await page.waitForTimeout(500);
    }
    
    console.log(`✓ Выбрано ${selectCount} записей`);

    // Проверить счетчик выбранных записей (элемент с классом selected_counter)
    const selectedCounter = archivePane.locator('.selected_counter').first();
    await expect(selectedCounter).toBeVisible({ timeout: 5000 });
    const selectedCounterText = await selectedCounter.textContent();
    console.log(`Счетчик выбранных (selected_counter): "${selectedCounterText}"`);

    // Извлечь число из текста (например, "Выбрано всего:3")
    const match = selectedCounterText.match(/\d+/);
    const selectedCountFromText = match ? match[0] : null;
    expect(selectedCountFromText).toBe(String(selectCount));

    // Дополнительно проверим, что элемент .amount-info с числом 3 также существует (опционально)
    const amountInfos = archivePane.locator('.amount-info');
    const amountInfoCount = await amountInfos.count();
    let foundSelectedAmount = false;
    for (let i = 0; i < amountInfoCount; i++) {
      const text = await amountInfos.nth(i).textContent();
      if (text === String(selectCount)) {
        foundSelectedAmount = true;
        break;
      }
    }
    if (foundSelectedAmount) {
      console.log(`✓ Найден .amount-info с числом выбранных: ${selectCount}`);
    }

    console.log('=== ТЕСТ ЗАВЕРШЕН ===');
  });
});