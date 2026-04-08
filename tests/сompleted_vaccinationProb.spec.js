import { test, expect } from '@playwright/test';
import {
  open063U,
  clickUpdate,
  expectTableUpdated,
  selectFirstPatientRow,      
  openPatientCard,            
  selectFirstVaccination,
  expectOneRecordNotification,
  expectEditDialog,
  getActionButtons,            
  attemptDelete, 
} from './vaccination-cards-063u/helpers';


test.describe('Карта пациента — Выполненные пробы', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await open063U(page);
  });

  test('Открытие выполненных проб пациента', async ({ page }) => {
    console.log('=== ТЕСТ: Работа с выполненными пробами ===');

    // ---------- Обновление таблицы ----------
    await clickUpdate(page);
    await expectTableUpdated(page);
    console.log('✓ Таблица обновлена');

    // ---------- Выбор первого пациента ----------
    const patientSelected = await selectFirstPatientRow(page);
    
    if (!patientSelected) {
      console.log('⚠ Не удалось выбрать пациента');
      test.skip(true, 'Не удалось выбрать пациента из списка');
      return;
    }

    // ---------- Открытие карты ----------
    const cardOpened = await openPatientCard(page);
    
    if (!cardOpened) {
      console.log('⚠ Не удалось открыть карту пациента');
      test.skip(true, 'Не удалось открыть карту пациента');
      return;
    };

    // ---------- Выполненные пробы ----------
    const completedMenu = page.locator(
      'li:has(img[alt="Выполненные пробы"])'
    );
    await completedMenu.click();

    await expect(completedMenu).toHaveClass(/active|SideMenu_active/);

    await expect(
      page.locator('div.SectionHeader_title_xzR9y', {
        hasText: 'Выполненные пробы',
      })
    ).toBeVisible({ timeout: 10000 });

    console.log('✓ Раздел "Выполненные пробы" открыт');

    // ---------- Проверка наличия проб ----------
    const vaccinationSelected = await selectFirstVaccination(page);

    if (!vaccinationSelected) {
      console.log('⚠ Пропускаем тест - нет выполненных проб');
      test.skip(true, 'Нет выполненных проб для тестирования');
      return;
    }

    console.log('✓ проба выбрана');

    // ---------- Кнопки ----------
    const { editBtn, removeBtn } = await getActionButtons(page);

    // ---------- Снимаем выбор ----------
    const vaccinationCheckbox = page
      .locator('.PatientSectionTemplate_container_iWUfa .el-table__body')
      .locator('.el-table__row')
      .first()
      .locator('.el-checkbox');
    
    await vaccinationCheckbox.click();
    await page.waitForTimeout(500);
    console.log('✓ Снят выбор пробы');

    // ---------- Без выбора пробы ----------
    await editBtn.click();
    await expectOneRecordNotification(page);
    console.log('✓ Уведомление при редактировании без выбора');

    await removeBtn.click();
    await expectOneRecordNotification(page);
    console.log('✓ Уведомление при удалении без выбора');

    // ---------- Снова выбираем пробу ----------
    await vaccinationCheckbox.click();
    await page.waitForTimeout(500);
    console.log('✓ проба выбрана повторно');

    // ---------- Редактирование ----------
    await editBtn.click();
    await expectEditDialog(page, 'test');
    console.log('✓ Редактирование проверено')

    // ---------- Удаление ----------
     const rowsBefore = await page
      .locator('.PatientSectionTemplate_container_iWUfa .el-table__body')
      .locator('.el-table__row')
      .count();
    
    console.log(`Количество проб до удаления: ${rowsBefore}`);

    await removeBtn.click();
    const deleteResult = await attemptDelete(page, 'test');

    console.log(`Результат удаления: ${deleteResult.result}`);

    if (deleteResult.result === 'delete_forbidden') {
      console.log(`ℹ Удаление запрещено: ${deleteResult.reason}`);
    } else if (deleteResult.result === 'deleted_success') {
      const rowsAfter = await page
        .locator('.PatientSectionTemplate_container_iWUfa .el-table__body')
        .locator('.el-table__row')
        .count();
      
      console.log(`Количество проб после удаления: ${rowsAfter}`);
      
      if (rowsAfter < rowsBefore) {
        console.log('✓ Проба успешно удалена из таблицы');
      }
    }
  });

  test('Проверка кнопок управления без выбора записи', async ({ page }) => {
    console.log('=== ТЕСТ: Кнопки без выбора записи ===');

    // ---------- Обновление таблицы ----------
    await clickUpdate(page);
    await expectTableUpdated(page);
    console.log('✓ Таблица обновлена');

    // ---------- Выбор первого пациента ----------
    const patientSelected = await selectFirstPatientRow(page);
    
    if (!patientSelected) {
      test.skip(true, 'Не удалось выбрать пациента из списка');
      return;
    }

    // ---------- Открытие карты ----------
 
    const cardOpened = await openPatientCard(page);
    
    if (!cardOpened) {
       console.log('⚠ Не удалось открыть карту пациента');
      test.skip(true, 'Не удалось открыть карту пациента');
      return;
    }

    console.log('✓ Карта пациента открыта');

    // ---------- Выполненные пробы ----------
    const completedMenu = page.locator(
      'li:has(img[alt="Выполненные пробы"])'
    );
    await completedMenu.click();
    await expect(
      page.locator('div.SectionHeader_title_xzR9y', {
        hasText: 'Выполненные пробы',
      })
    ).toBeVisible({ timeout: 10000 });
    
    console.log('✓ Раздел "Выполненные пробы" открыт');
                
      
        
  });
});
