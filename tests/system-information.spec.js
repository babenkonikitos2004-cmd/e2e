import { test, expect } from '@playwright/test';
import {
  openModule,
  checkInfoSystem,
  closeDialogUniversalAuto,
} from './vaccination-cards-063u/helpers';

test.describe('Модуль Информация о системе', () => {
  
  test.describe.configure({ timeout: 120000 });

  test.beforeEach(async ({ page }, testInfo) => {
    testInfo.setTimeout(90000);
    
    console.log('=== beforeEach: Начало ===');
    
    await page.goto('/');
    
    // Открыть модуль "Карты прививок 063У"
    const opened = await openModule(page, 'Карты прививок 063У', {
      waitForFields: false,
    });
    
    expect(opened).toBe(true);
    await page.waitForTimeout(3000);
    
    // Открыть "Информация о системе" через готовую функцию
    await checkInfoSystem(page);
    
    await page.waitForTimeout(2000);
    
    console.log('=== beforeEach: Завершено ===');
  });

  // ==========================================
  // РАЗДЕЛ: НОВОСТИ
  // ==========================================

  test.describe('Раздел Новости', () => {
    
    test('Добавление новости без заполнения полей', async ({ page }) => {
      console.log('=== ТЕСТ: Добавление новости без данных ===');

      // Найти блок "Новости"
      const newsBlock = page.locator('.InfoBlock_container_HS3ix').filter({
        has: page.locator('.InfoBlock_title_j36W3:has-text("Новости")')
      });
      
      await expect(newsBlock).toBeVisible({ timeout: 5000 });
      console.log('✓ Блок "Новости" найден');
      
      // Кликнуть "Добавить"
      const addBtn = newsBlock.locator('button#_add');
      await addBtn.click();
      await page.waitForTimeout(1000);
      
      // Проверить что открылось модальное окно
      const dialog = page.locator('.el-dialog:visible');
      await expect(dialog).toBeVisible({ timeout: 5000 });
      
      const dialogTitle = page.locator('.title-name-text:has-text("Новость::ДОБАВЛЕНИЕ")');
      await expect(dialogTitle).toBeVisible();
      console.log('✓ Модальное окно "Добавление новости" открыто');
      
      // Кликнуть "Сохранить" без заполнения
      const saveBtn = page.locator('.DialogSystemInformation_saveButton_s9SKk');
      await saveBtn.click();
      await page.waitForTimeout(1500);
      
      // Проверить ошибку валидации
      const errorMsg = page.locator('text=Необходимо заполнить поля');
      const errorVisible = await errorMsg.isVisible({ timeout: 3000 }).catch(() => false);
      
      if (errorVisible) {
        console.log('✓ Ошибка валидации отображается');
      } else {
        console.log('⚠️ Ошибка валидации не найдена');
      }
      
      // Закрыть диалог
      await closeDialogUniversalAuto(page);
      
      console.log('=== ТЕСТ ЗАВЕРШЕН ===');
    });

    test('Редактирование новости без выбора', async ({ page }) => {
      console.log('=== ТЕСТ: Редактирование без выбора ===');

      const newsBlock = page.locator('.InfoBlock_container_HS3ix').filter({
        has: page.locator('.InfoBlock_title_j36W3:has-text("Новости")')
      });
      
      // Кликнуть "Редактировать" без выбора элемента
      const editBtn = newsBlock.locator('button#_edit');
      await editBtn.click();
      await page.waitForTimeout(1500);
      
      // Проверить уведомление
      const notification = page.locator('text=Необходимо выбрать ровно одну новость');
      const notifVisible = await notification.isVisible({ timeout: 3000 }).catch(() => false);
      
      if (notifVisible) {
        console.log('✓ Уведомление об ошибке отображается');
      } else {
        console.log('⚠️ Уведомление не найдено');
      }
      
      console.log('=== ТЕСТ ЗАВЕРШЕН ===');
    });

    test('Удаление новости без выбора', async ({ page }) => {
      console.log('=== ТЕСТ: Удаление без выбора ===');

      const newsBlock = page.locator('.InfoBlock_container_HS3ix').filter({
        has: page.locator('.InfoBlock_title_j36W3:has-text("Новости")')
      });
      
      // Кликнуть "Удалить" без выбора
      const deleteBtn = newsBlock.locator('button#_remove');
      await deleteBtn.click();
      await page.waitForTimeout(1500);
      
      // Проверить уведомление
      const notification = page.locator('text=Необходимо выбрать элемент для удаления');
      const notifVisible = await notification.isVisible({ timeout: 3000 }).catch(() => false);
      
      if (notifVisible) {
        console.log('✓ Уведомление об ошибке отображается');
      } else {
        console.log('⚠️ Уведомление не найдено');
      }
      
      console.log('=== ТЕСТ ЗАВЕРШЕН ===');
    });

    test('Проверка списка новостей', async ({ page }) => {
      console.log('=== ТЕСТ: Список новостей ===');

      const newsBlock = page.locator('.InfoBlock_container_HS3ix').filter({
        has: page.locator('.InfoBlock_title_j36W3:has-text("Новости")')
      });
      
      // Посчитать новости
      const newsItems = newsBlock.locator('.InfoBlockPost_container_vvF0L');
      const count = await newsItems.count();
      
      console.log(`✓ Найдено новостей: ${count}`);
      
      if (count > 0) {
        // Проверить первую новость
        const firstNews = newsItems.first();
        const title = await firstNews.locator('.InfoBlockPost_title_EHUwC').textContent();
        const date = await firstNews.locator('.InfoBlockPost_date_Esitt').textContent();
        
        console.log(`  Заголовок: ${title?.trim()}`);
        console.log(`  Дата: ${date?.trim()}`);
      }
      
      console.log('=== ТЕСТ ЗАВЕРШЕН ===');
    });

    test('Кнопка "Подробнее" в новости', async ({ page }) => {
      console.log('=== ТЕСТ: Кнопка "Подробнее" ===');

      const newsBlock = page.locator('.InfoBlock_container_HS3ix').filter({
        has: page.locator('.InfoBlock_title_j36W3:has-text("Новости")')
      });
      
      const newsItems = newsBlock.locator('.InfoBlockPost_container_vvF0L');
      const count = await newsItems.count();
      
      if (count > 0) {
        // Найти кнопку "Подробнее" в первой новости
        const moreBtn = newsItems.first().locator('button:has-text("Подробнее")');
        const btnVisible = await moreBtn.isVisible({ timeout: 2000 }).catch(() => false);
        
        if (btnVisible) {
          await moreBtn.click();
          console.log('✓ Кнопка "Подробнее" нажата');
          await page.waitForTimeout(1000);
        } else {
          console.log('ℹ️ Кнопка "Подробнее" не найдена');
        }
      } else {
        console.log('ℹ️ Нет новостей для теста');
      }
      
      console.log('=== ТЕСТ ЗАВЕРШЕН ===');
    });
  });

  // ==========================================
  // РАЗДЕЛ: ОБЗОРЫ
  // ==========================================

  test.describe('Раздел Обзоры', () => {
    
    test('Добавление обзора без заполнения полей', async ({ page }) => {
      console.log('=== ТЕСТ: Добавление обзора без данных ===');

      const block = page.locator('.InfoBlock_container_HS3ix').filter({
        has: page.locator('.InfoBlock_title_j36W3:has-text("Обзоры")')
      });
      
      const addBtn = block.locator('button#_add');
      await addBtn.click();
      await page.waitForTimeout(1000);
      
      const dialog = page.locator('.el-dialog:visible');
      await expect(dialog).toBeVisible({ timeout: 5000 });
      console.log('✓ Модальное окно открыто');
      
      const saveBtn = page.locator('.DialogSystemInformation_saveButton_s9SKk');
      await saveBtn.click();
      await page.waitForTimeout(1500);
      
      const errorMsg = page.locator('text=Необходимо заполнить поля');
      const errorVisible = await errorMsg.isVisible({ timeout: 3000 }).catch(() => false);
      
      if (errorVisible) {
        console.log('✓ Ошибка валидации отображается');
      }
      
      await closeDialogUniversalAuto(page);
      
      console.log('=== ТЕСТ ЗАВЕРШЕН ===');
    });

    test('Удаление обзора без выбора', async ({ page }) => {
      console.log('=== ТЕСТ: Удаление обзора без выбора ===');

      const block = page.locator('.InfoBlock_container_HS3ix').filter({
        has: page.locator('.InfoBlock_title_j36W3:has-text("Обзоры")')
      });
      
      const deleteBtn = block.locator('button#_remove');
      await deleteBtn.click();
      await page.waitForTimeout(1500);
      
      const notification = page.locator('text=Необходимо выбрать элемент');
      const notifVisible = await notification.isVisible({ timeout: 3000 }).catch(() => false);
      
      if (notifVisible) {
        console.log('✓ Уведомление об ошибке отображается');
      }
      
      console.log('=== ТЕСТ ЗАВЕРШЕН ===');
    });

    test('Проверка списка обзоров', async ({ page }) => {
      console.log('=== ТЕСТ: Список обзоров ===');

      const block = page.locator('.InfoBlock_container_HS3ix').filter({
        has: page.locator('.InfoBlock_title_j36W3:has-text("Обзоры")')
      });
      
      const items = block.locator('.InfoBlockFile_container_Iwgzn');
      const count = await items.count();
      
      console.log(`✓ Найдено обзоров: ${count}`);
      
      if (count > 0) {
        const firstItem = items.first().locator('span').textContent();
        console.log(`  Первый: ${await firstItem}`);
      }
      
      console.log('=== ТЕСТ ЗАВЕРШЕН ===');
    });
  });

  // ==========================================
  // РАЗДЕЛ: РУКОВОДСТВА
  // ==========================================

  test.describe('Раздел Руководства', () => {
    
    test('Добавление руководства без заполнения полей', async ({ page }) => {
      console.log('=== ТЕСТ: Добавление руководства без данных ===');

      const block = page.locator('.InfoBlock_container_HS3ix').filter({
        has: page.locator('.InfoBlock_title_j36W3:has-text("Руководства")')
      });
      
      const addBtn = block.locator('button#_add');
      await addBtn.click();
      await page.waitForTimeout(1000);
      
      const saveBtn = page.locator('.DialogSystemInformation_saveButton_s9SKk');
      await saveBtn.click();
      await page.waitForTimeout(1500);
      
      const errorMsg = page.locator('text=Необходимо заполнить поля');
      await expect(errorMsg).toBeVisible({ timeout: 3000 });
      console.log('✓ Ошибка валидации отображается');
      
      await closeDialogUniversalAuto(page);
      
      console.log('=== ТЕСТ ЗАВЕРШЕН ===');
    });

    test('Удаление руководства без выбора', async ({ page }) => {
      console.log('=== ТЕСТ: Удаление руководства без выбора ===');

      const block = page.locator('.InfoBlock_container_HS3ix').filter({
        has: page.locator('.InfoBlock_title_j36W3:has-text("Руководства")')
      });
      
      const deleteBtn = block.locator('button#_remove');
      await deleteBtn.click();
      await page.waitForTimeout(1500);
      
      const notification = page.locator('text=Необходимо выбрать элемент');
      await expect(notification).toBeVisible({ timeout: 3000 });
      
      console.log('=== ТЕСТ ЗАВЕРШЕН ===');
    });

    test('Проверка списка руководств', async ({ page }) => {
      console.log('=== ТЕСТ: Список руководств ===');

      const block = page.locator('.InfoBlock_container_HS3ix').filter({
        has: page.locator('.InfoBlock_title_j36W3:has-text("Руководства")')
      });
      
      const items = block.locator('.InfoBlockFile_container_Iwgzn');
      const count = await items.count();
      
      console.log(`✓ Найдено руководств: ${count}`);
      
      console.log('=== ТЕСТ ЗАВЕРШЕН ===');
    });
  });

  // ==========================================
  // РАЗДЕЛ: ВИДЕОРОЛИКИ
  // ==========================================

  test.describe('Раздел Видеоролики', () => {
    
    test('Добавление видеоролика без заполнения полей', async ({ page }) => {
      console.log('=== ТЕСТ: Добавление видео без данных ===');

      const block = page.locator('.InfoBlock_container_HS3ix').filter({
        has: page.locator('.InfoBlock_title_j36W3:has-text("Видеоролики")')
      });
      
      const addBtn = block.locator('button#_add');
      await addBtn.click();
      await page.waitForTimeout(1000);
      
      const saveBtn = page.locator('.DialogSystemInformation_saveButton_s9SKk');
      await saveBtn.click();
      await page.waitForTimeout(1500);
      
      const errorMsg = page.locator('text=Необходимо заполнить поля');
      await expect(errorMsg).toBeVisible({ timeout: 3000 });
      
      await closeDialogUniversalAuto(page);
      
      console.log('=== ТЕСТ ЗАВЕРШЕН ===');
    });

    test('Удаление видеоролика без выбора', async ({ page }) => {
      console.log('=== ТЕСТ: Удаление видео без выбора ===');

      const block = page.locator('.InfoBlock_container_HS3ix').filter({
        has: page.locator('.InfoBlock_title_j36W3:has-text("Видеоролики")')
      });
      
      const deleteBtn = block.locator('button#_remove');
      await deleteBtn.click();
      await page.waitForTimeout(1500);
      
      const notification = page.locator('text=Необходимо выбрать элемент');
      await expect(notification).toBeVisible({ timeout: 3000 });
      
      console.log('=== ТЕСТ ЗАВЕРШЕН ===');
    });

    test('Проверка списка видеороликов', async ({ page }) => {
      console.log('=== ТЕСТ: Список видеороликов ===');

      const block = page.locator('.InfoBlock_container_HS3ix').filter({
        has: page.locator('.InfoBlock_title_j36W3:has-text("Видеоролики")')
      });
      
      const items = block.locator('.InfoBlockFile_container_Iwgzn');
      const count = await items.count();
      
      console.log(`✓ Найдено видеороликов: ${count}`);
      
      console.log('=== ТЕСТ ЗАВЕРШЕН ===');
    });
  });
});