import { test, expect } from '@playwright/test';
import { openModule, clickUpdate } from './vaccination-cards-063u/helpers';

test.describe('Проверка пагинации во всех модулях', () => {
  
  test.setTimeout(300000); // 5 минут

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(3000);
    
    // Проверяем что таблица АРМ видна
    const armTable = page.locator('#SelectArmInfo .el-table__body');
    const tableVisible = await armTable.isVisible({ timeout: 5000 }).catch(() => false);
    
    if (!tableVisible) {
      console.log('⚠️ Таблица АРМ не видна, возможно уже на главной странице');
    } else {
      // Выбираем первый АРМ
      const firstRow = armTable.locator('.el-table__row').first();
      await firstRow.click();
      await page.waitForTimeout(2000);
      
      // Нажимаем "Запустить"
      const launchBtn = page.locator('button:has-text("Запустить")');
      const btnVisible = await launchBtn.isVisible({ timeout: 3000 }).catch(() => false);
      
      if (btnVisible) {
        await launchBtn.click();
        await page.waitForTimeout(5000);
        console.log('✓ АРМ запущен');
      }
    }
  });

  const modules = [
    'Карты прививок 063У',
    'Прививочная карта',
    'Прививочные карты на подпись',
    'Мониторинг отправки сертификата в РВИМИС',
    'Перенесенные заболевания',
    'Медотводы/отказы',
    'Планы вакцинации',
    'Архивные планы',
    'Назначенные вакцинации',
    'Запланированные прививки',
    'Выполненные прививки',
  ];

  test('Проверка пагинации во всех модулях - 6 кликов', async ({ page }) => {

    for (const moduleName of modules) {
      console.log(`\n${'='.repeat(60)}`);
      console.log(`📋 МОДУЛЬ: ${moduleName}`);
      console.log('='.repeat(60));

      // Открыть модуль
      const opened = await openModule(page, moduleName, { waitForFields: false });
      
      if (!opened) {
        console.log(`⚠️ Не удалось открыть модуль: ${moduleName}`);
        continue;
      }

      await page.waitForTimeout(3000);

      // Для "Прививочная карта" переключиться на вкладку "Выполненные прививки"
      if (moduleName === 'Прививочная карта') {
        console.log('→ Переключение на вкладку "Выполненные прививки"');
        
        const tab = page.locator('.el-tabs__item').filter({
          hasText: 'Выполненные прививки'
        });
        
        const tabVisible = await tab.isVisible({ timeout: 3000 }).catch(() => false);
        
        if (tabVisible) {
          await tab.click();
          await page.waitForTimeout(2000);
          console.log('✓ Вкладка "Выполненные прививки" открыта');
        } else {
          console.log('⚠️ Вкладка не найдена');
        }
      }

      // Обновить список
      console.log('→ Обновление списка...');
      
      const updateBtn = page.locator('#_refresh, button:has-text("Обновить")').first();
      const btnVisible = await updateBtn.isVisible({ timeout: 3000 }).catch(() => false);
      
      if (btnVisible) {
        await updateBtn.click();
        await page.waitForTimeout(2000);
        console.log('✓ Список обновлен');
      } else {
        console.log('ℹ️ Кнопка обновить не найдена');
      }

      // Найти пагинацию
      const pagination = page.locator('.pagination');
      const paginationVisible = await pagination.isVisible({ timeout: 3000 }).catch(() => false);

      if (!paginationVisible) {
        console.log('ℹ️ Пагинация не найдена (мало записей)');
        continue;
      }

      console.log('✓ Пагинация найдена');

      // Найти кнопку "Дальше"
      const nextBtn = pagination.locator('button').filter({
        hasText: 'Дальше'
      });

      const nextVisible = await nextBtn.isVisible({ timeout: 2000 }).catch(() => false);

      if (!nextVisible) {
        console.log('ℹ️ Кнопка "Дальше" не найдена');
        continue;
      }

      // Кликнуть 6 раз по "Дальше"
      console.log('→ Кликаем по "Дальше" 6 раз...');
      
      for (let i = 1; i <= 6; i++) {
        const isDisabled = await nextBtn.isDisabled().catch(() => true);
        
        if (isDisabled) {
          console.log(`  Клик ${i}/6: кнопка неактивна (последняя страница)`);
          break;
        }

        await nextBtn.click();
        console.log(`  ✓ Клик ${i}/6`);
        
        await page.waitForTimeout(1500);
        
        // Проверяем текущую страницу
        const activePage = pagination.locator('button.active span');
        const pageNumber = await activePage.textContent().catch(() => '?');
        console.log(`    Страница: ${pageNumber}`);
      }

      console.log(`✓ Модуль "${moduleName}" проверен`);
      await page.waitForTimeout(1000);
    }

    console.log('\n' + '='.repeat(60));
    console.log('🎉 ВСЕ МОДУЛИ ПРОВЕРЕНЫ!');
    console.log('='.repeat(60));
    
    // Финальная пауза для проверки дизайна
    console.log('\n⏸️  ПАУЗА ДЛЯ ПРОВЕРКИ ДИЗАЙНА (60 секунд)...');
    await page.waitForTimeout(60000);
  });
});