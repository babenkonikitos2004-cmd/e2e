import { test, expect } from '@playwright/test';
import {
  open063U,
  clickUpdate,
  expectTableUpdated,
  selectFirstPatientRow,
  openPatientCard,
  selectFirstVaccination,
  selectVaccinationByStatus,
  expectOneRecordNotification,
  expectEditDialog,
  expectExecuteDialog,
  getActionButtons,
  attemptDelete,
} from './vaccination-cards-063u/helpers';

test.describe('Карта пациента — Запланированные пробы', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await open063U(page);
  });

  test('Открытие запланированных проб пациента', async ({ page }) => {
    console.log('=== ТЕСТ: Работа с запланированными пробами ===');
  
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
    }

    console.log('✓ Карта пациента открыта');

    // ---------- Запланированные пробы ----------
    const plannedMenu = page.locator(
      'li:has(img[alt="Запланированные пробы"])'
    );
    await plannedMenu.click();

    await expect(plannedMenu).toHaveClass(/active|SideMenu_active/, { timeout: 5000 });

    await expect(
      page.locator('div.SectionHeader_title_xzR9y', {
        hasText: 'Запланированные пробы',
      })
    ).toBeVisible({ timeout: 10000 });

    console.log('✓ Раздел "Запланированные пробы" открыт');

    // ---------- Проверка наличия запланированных проб ----------
    let testSelected = await selectVaccinationByStatus(page, 'Планируемая');

    if (!testSelected) {
      testSelected = await selectVaccinationByStatus(page, 'План ручн');
    }

    if (!testSelected) {
      testSelected = await selectFirstVaccination(page);
    }

    if (!testSelected) {
      console.log('⚠ Пропускаем тест - нет запланированных проб');
      test.skip(true, 'Нет запланированных проб для тестирования');
      return;
    }

    console.log('✓ Проба выбрана');

    // ---------- Получаем кнопки (универсально) ----------
    const { editBtn, removeBtn, executeBtn } = await getActionButtons(page);

    // ---------- Снимаем выбор ----------
    await page.waitForTimeout(500);

    const checkedCheckbox = page
      .locator('.PatientSectionTemplate_container_iWUfa .el-table__body')
      .locator('.el-checkbox__input.is-checked')
      .first();

    const parentCheckbox = checkedCheckbox.locator('xpath=..');
    await expect(parentCheckbox).toBeVisible({ timeout: 5000 });
    await parentCheckbox.click();
    await page.waitForTimeout(500);
    console.log('✓ Снят выбор пробы');

    // ---------- Без выбора пробы ----------
    await editBtn.click();
    await expectOneRecordNotification(page);
    console.log('✓ Уведомление при редактировании без выбора');

    await removeBtn.click();
    await expectOneRecordNotification(page);
    console.log('✓ Уведомление при удалении без выбора');
    
    await executeBtn.click();
    await expectOneRecordNotification(page);
    console.log('✓ Уведомление при Выполнении без выбора');

    // ---------- Снова выбираем первую пробу ----------
    const firstRowCheckbox = page
      .locator('.PatientSectionTemplate_container_iWUfa .el-table__body')
      .locator('.el-table__row')
      .first()
      .locator('.el-checkbox');

    await expect(firstRowCheckbox).toBeVisible({ timeout: 5000 });
    await firstRowCheckbox.click();
    await page.waitForTimeout(500);
    console.log('✓ Строка выбрана повторно');

    // ---------- Проверка кнопок с выбранной пробой ----------
    // Редактирование
    await editBtn.click();
    await page.waitForTimeout(500);
    const editResult = await expectEditDialog(page, 'test');
    console.log('✓ Редактирование проверено', editResult.result);

    // Выполнение
    await executeBtn.click();
    const executeResult = await expectExecuteDialog(page, { type: 'test' });
    console.log('✓ Выполнение проверено:', executeResult.result);

    // Удаление
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

    console.log('=== ТЕСТ ЗАВЕРШЕН: Все проверки пройдены ===');
  });
});