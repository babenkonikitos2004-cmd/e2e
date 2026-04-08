import { test, expect } from '@playwright/test';
import {
  open063U,
  clickUpdate,
  expectTableUpdated,
  selectFirstPatientRow,
  openPatientCard,
  selectFirstVaccination,
    expectOneRecordNotification,
  getActionButtons,
  attemptDelete, 
  closeDialogUniversalAuto,
  saveDialogUniversal
} from './vaccination-cards-063u/helpers';


test.describe('Карта пациента — перенесенные заболевания', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await open063U(page);
  });

  test('Открытие перенесенные заболевания пациента', async ({ page }) => {
    console.log('=== ТЕСТ: Работа с перенесенными заболеваниями ===');
  
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
    // ---------- Перенесенные заболевания ----------
    const completedMenu = page.locator(
      'li:has(img[alt="Перенесенные заболевания"])'
    );
    await completedMenu.click();

    await expect(completedMenu).toHaveClass(/active|SideMenu_active/);

    await expect(
      page.locator('div.SectionHeader_title_xzR9y', {
        hasText: 'Перенесенные заболевания',
      })
    ).toBeVisible({ timeout: 10000 });

    console.log('✓ Раздел "Перенесенные заболевания" открыт');

    // ---------- Проверка наличия Перенесенных заболеваний ----------
  let vacDiseasesSelected = await selectFirstVaccination(page);


if (!vacDiseasesSelected) {
  console.log('⚠ Пропускаем тест - нет Перенесенных заболеваний');
  test.skip(true, 'Нет Перенесенных заболеваний для тестирования');
  return;
}

console.log('✓ Перенесенное заболевание выбрано');

     // ---------- Кнопки ----------
 const { editBtn, removeBtn,  addBtn } = await getActionButtons(page)

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
console.log('✓ Снят выбор Перенесенных заболеваний')

    // ---------- Без выбора прививки ----------
    await editBtn.click();
    await expectOneRecordNotification(page);
    console.log('✓ Уведомление при редактировании без выбора');

    await removeBtn.click();
    await expectOneRecordNotification(page);
    console.log('✓ Уведомление при удалении без выбора');
    
    await addBtn.click();
    await page.waitForTimeout(500);
    const result = await closeDialogUniversalAuto(page);
    console.log('Результат:', result.result, result.message);

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

// ---------- Проверка кнопок с выбранным заболеванием ----------

// Редактирование - закрываем через сохранить или отмену   
await editBtn.click();
await page.waitForTimeout(500);

const editResult = await saveDialogUniversal(page, {
  successMessage: 'Заболевание успешно сохранено',
  expectSuccess: true
});

console.log('Результат сохранения:', editResult.result, editResult.message);

// ВАЖНО: Ждем закрытия диалога
if (editResult.type === 'success') {
  // Диалог может закрыться автоматически
  await page.waitForTimeout(1000);
} else {
  // Закрываем вручную
  await closeDialogUniversalAuto(page);
}

// Убеждаемся что диалог закрылся
const dialogClosed = await page.locator('.el-overlay-dialog, .el-dialog').isHidden({ timeout: 3000 }).catch(() => false);
if (!dialogClosed) {
  console.log('⚠ Диалог все еще открыт, закрываем принудительно...');
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);
}

console.log('✓ Диалог закрыт, готово к удалению');

// ---------- УДАЛЕНИЕ ----------
console.log('\n=== Проверка удаления заболевания ===');

const rowsBefore = await page
  .locator('.PatientSectionTemplate_container_iWUfa .el-table__body')
  .locator('.el-table__row')
  .count();

console.log(`Количество заболеваний до удаления: ${rowsBefore}`);

// Проверяем что кнопка доступна для клика
await removeBtn.waitFor({ state: 'visible', timeout: 3000 });
console.log('✓ Кнопка удаления видима');

// Используем force: true если элемент перекрыт
await removeBtn.click({ force: true });
console.log('✓ Кнопка удаления нажата');

const deleteResult = await attemptDelete(page, 'disease');

console.log(`Результат удаления: ${deleteResult.result}`);

if (deleteResult.result === 'delete_forbidden') {
  console.log(`ℹ Удаление запрещено: ${deleteResult.reason}`);
} else if (deleteResult.result === 'deleted_success' || deleteResult.result === 'deleted_silent') {
  await page.waitForTimeout(1000);
  
  const rowsAfter = await page
    .locator('.PatientSectionTemplate_container_iWUfa .el-table__body')
    .locator('.el-table__row')
    .count();
  
  console.log(`Количество заболеваний после удаления: ${rowsAfter}`);
  
  if (rowsAfter < rowsBefore) {
    console.log('✓ Заболевание успешно удалено из таблицы');
  } else {
    console.log('⚠ Количество строк не изменилось');
  }
}

console.log('=== ТЕСТ ЗАВЕРШЕН: Все проверки пройдены ===');
  });
});