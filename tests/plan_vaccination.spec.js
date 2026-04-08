import { test, expect } from '@playwright/test';
import {
  open063U,
  clickUpdate,
  expectTableUpdated,
  selectFirstPatientRow,
  openPatientCard,
  selectFirstVaccination,
  selectVaccinationByStatus,
  getSelectedVaccinationStatus,
  expectOneRecordNotification,
  expectEditDialog,
  expectExecuteDialog,
  getActionButtons,
  attemptDelete, 
  expectDialogOrNotification,
} from './vaccination-cards-063u/helpers';


test.describe('Карта пациента — Запланированые прививки', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await open063U(page);
  });

  test('Открытие запланированных прививок пациента', async ({ page }) => {
    console.log('=== ТЕСТ: Работа с запланированными прививками ===');
  
  // ---------- Обновление таблицы ----------
    await clickUpdate(page);
    await expectTableUpdated(page);
    console.log(' Таблица обновлена');

    // ---------- Выбор первого пациента ----------
    const patientSelected = await selectFirstPatientRow(page);
    
    if (!patientSelected) {
      test.skip(true, 'Не удалось выбрать пациента из списка');
      return;
    }

    // ---------- Открытие карты ----------
    const cardOpened = await openPatientCard(page);
    
    if (!cardOpened) {
      test.skip(true, 'Не удалось открыть карту пациента');
      return;
    }

    console.log('✓ Карта пациента открыта');
    // ---------- Запланированные прививки ----------
    const completedMenu = page.locator(
      'li:has(img[alt="Запланированные прививки"])'
    );
    await completedMenu.click();

    await expect(completedMenu).toHaveClass(/active|SideMenu_active/);

    await expect(
      page.locator('div.SectionHeader_title_xzR9y', {
        hasText: 'Запланированные прививки',
      })
    ).toBeVisible({ timeout: 10000 });

    console.log('✓ Раздел "Запланированные прививки" открыт');

    // ---------- Проверка наличия запланированных прививок ----------
    // Сначала пробуем выбрать планируемую прививку
let vaccinationSelected = await selectVaccinationByStatus(page, 'Планируемая');

// Если планируемых нет, пробуем Plan ручн
if (!vaccinationSelected) {
  vaccinationSelected = await selectVaccinationByStatus(page, 'План ручн');
}

// Если и их нет, берем любую первую
if (!vaccinationSelected) {
  vaccinationSelected = await selectFirstVaccination(page);
}

if (!vaccinationSelected) {
  console.log('⚠ Пропускаем тест - нет запланированных прививок');
  test.skip(true, 'Нет запланированных прививок для тестирования');
  return;
}

console.log('✓ Прививка выбрана');

     // ---------- Кнопки ----------
 const { editBtn, removeBtn, executeBtn, planBtnVac } = await getActionButtons(page)

      // ---------- Снимаем выбор ----------
           // ---------- Функция для получения чекбокса выбранной строки 
    await page.waitForTimeout(500);

// Находим чекбокс с классом is-checked
const checkedCheckbox = page
  .locator('.PatientSectionTemplate_container_iWUfa .el-table__body')
  .locator('.el-checkbox__input.is-checked')
  .first();

// Кликаем по родительскому .el-checkbox
const parentCheckbox = checkedCheckbox.locator('xpath=..');
await expect(parentCheckbox).toBeVisible({ timeout: 5000 });
await parentCheckbox.click();
await page.waitForTimeout(500);
console.log('✓ Снят выбор прививки')

    // ---------- Без выбора прививки ----------
    await editBtn.click();
    await expectOneRecordNotification(page);
    console.log('✓ Уведомление при редактировании без выбора');

    await removeBtn.click();
    await expectOneRecordNotification(page);
    console.log('✓ Уведомление при удалении без выбора');
    
    await executeBtn.click();
    await expectOneRecordNotification(page);
    console.log('✓ Уведомление при Выполнении без выбора');

    
    // ---------- Снова выбираем прививку ----------
    const firstRowCheckbox = page
  .locator('.PatientSectionTemplate_container_iWUfa .el-table__body')
  .locator('.el-table__row')
  .first()
  .locator('.el-checkbox');

await expect(firstRowCheckbox).toBeVisible({ timeout: 5000 });
await firstRowCheckbox.click();
await page.waitForTimeout(500);
console.log('✓ Строка выбрана повторно');

// ---------- Проверка кнопок с выбранной прививкой ----------

// Редактирование - закрываем через крестик
await editBtn.click();
await page.waitForTimeout(500);
// надо закрывать через сохранить и там будет уведомление (Существует план по такому заболеванию, туру и типу. Добавление запрещено)
const editResult = await expectEditDialog(page, 'vaccination');
console.log(' Редактирование проверено', editResult.result);

// Выполнение - с проверкой статуса
await executeBtn.click();
    const executeResult = await expectExecuteDialog(page, { type: 'vaccination' });
    console.log('✓ Выполнение проверено:', executeResult.result);

await planBtnVac.click();
    const result = await expectDialogOrNotification(page, {
  actionName: 'Пересбор плана',
  dialogPattern: /План успешно пересобран/,
  errorNotifications: [
    {
      pattern: /План успешно пересобран/,
      message: 'План успешно пересобран',
      expectedFor: ['Завершён', 'Архив'] // для каких статусов ожидаем эту ошибку
    },
    ],
    expectedStatus: 'завершен',
    strictMode: true
    });
    if (result.result === 'dialog_opened') {
    // Диалог открылся и был закрыт — продолжаем тест
  await expect(page.locator('.table')).toBeVisible();

    } else if (result.result === 'error_notification') {
  // Получили ожидаемое уведомление — тест пройден для этого кейса
  console.log(`Получено уведомление: ${result.message}`);
    }

// Удаление - закрываем диалог (если он есть)
const rowsBefore = await page
      .locator('.PatientSectionTemplate_container_iWUfa .el-table__body')
      .locator('.el-table__row')
      .count();
    
    console.log(`Количество прививок до удаления: ${rowsBefore}`);

    await removeBtn.click();
    const deleteResult = await attemptDelete(page, 'vaccination');

    console.log(`Результат удаления: ${deleteResult.result}`);

    if (deleteResult.result === 'delete_forbidden') {
      console.log(`ℹ Удаление запрещено: ${deleteResult.reason}`);
    } else if (deleteResult.result === 'deleted_success') {
      const rowsAfter = await page
        .locator('.PatientSectionTemplate_container_iWUfa .el-table__body')
        .locator('.el-table__row')
        .count();
      
      console.log(`Количество прививок после удаления: ${rowsAfter}`);
      
      if (rowsAfter < rowsBefore) {
        console.log('✓ Прививка успешно удалена из таблицы');
      }
    }

console.log('=== ТЕСТ ЗАВЕРШЕН: Все проверки пройдены ===');
  });
});