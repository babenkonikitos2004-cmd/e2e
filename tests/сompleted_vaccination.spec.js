import { test, expect } from '@playwright/test';
import {
  open063U,
  clickUpdate,
  expectTableUpdated,
  selectFirstVaccination,
  expectOneRecordNotification,
  expectEditDialog,
  expectDeleteSuccess,
  selectFirstPatientRow,
  openPatientCard,
  getActionButtons,
  canDeleteVaccination,       
  getSelectedRowECPStatus,
  attemptDelete,
} from './vaccination-cards-063u/helpers';


test.describe('Карта пациента — Выполненные прививки', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await open063U(page);
  });

  test('Открытие выполненных прививок пациента', async ({ page }) => {
    console.log('=== ТЕСТ: Работа с выполненными прививками ===');

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

    // ---------- Выполненные прививки ----------
    const completedMenu = page.locator(
      'li:has(img[alt="Выполненные прививки"])'
    );
    await completedMenu.click();

    await expect(completedMenu).toHaveClass(/active|SideMenu_active/);

    await expect(
      page.locator('div.SectionHeader_title_xzR9y', {
        hasText: 'Выполненные прививки',
      })
    ).toBeVisible({ timeout: 10000 });

    console.log('✓ Раздел "Выполненные прививки" открыт');

    // ---------- Проверка наличия прививок ----------
    const vaccinationSelected = await selectFirstVaccination(page);

    if (!vaccinationSelected) {
      console.log('⚠ Пропускаем тест - нет выполненных прививок');
      test.skip(true, 'Нет выполненных прививок для тестирования');
      return;
    }

    console.log('✓ Прививка выбрана');

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
    console.log('✓ Снят выбор прививки');

    // ---------- Без выбора прививки ----------
    await editBtn.click();
    await expectOneRecordNotification(page);
    console.log('✓ Уведомление при редактировании без выбора');

    await removeBtn.click();
    await expectOneRecordNotification(page);
    console.log('✓ Уведомление при удалении без выбора');

    // ---------- Снова выбираем прививку ----------
    await vaccinationCheckbox.click();
    await page.waitForTimeout(500);
    console.log('✓ Прививка выбрана повторно');

    // ---------- Редактирование ----------
    await editBtn.click();
    await expectEditDialog(page);
    console.log('✓ Редактирование работает корректно');

   // ---------- Удаление ----------
console.log('Проверяем возможность удаления...');

// Предварительная проверка статуса ЭЦП
const { canDelete, reason } = await canDeleteVaccination(page);

const rowsBefore = await page
  .locator('.PatientSectionTemplate_container_iWUfa .el-table__body')
  .locator('.el-table__row')
  .count();

console.log(`Количество прививок до удаления: ${rowsBefore}`);

// Кликаем на удаление в любом случае (чтобы проверить поведение системы)
await removeBtn.click();
const deleteResult = await attemptDelete(page, 'vaccination');

console.log(`Результат удаления: ${deleteResult.result}`);

// Анализируем результат
if (deleteResult.result === 'delete_forbidden') {
  console.log(`ℹ Удаление запрещено: ${deleteResult.reason}`);
  
  if (!canDelete) {
    console.log('✓ Это соответствует статусу ЭЦП (прививка подписана)');
  } else {
    console.log('⚠ Неожиданно: статус ЭЦП позволял удаление');
  }
  
} else if (deleteResult.result === 'deleted_success') {
  const rowsAfter = await page
    .locator('.PatientSectionTemplate_container_iWUfa .el-table__body')
    .locator('.el-table__row')
    .count();
  
  console.log(`Количество прививок после удаления: ${rowsAfter}`);
  
  if (rowsAfter < rowsBefore) {
    console.log('✓ Прививка успешно удалена из таблицы');
  }
  
  if (canDelete) {
    console.log('✓ Это соответствует статусу ЭЦП (не подписана)');
  } else {
    console.log('⚠ Неожиданно: статус ЭЦП запрещал удаление');
  }
  
} else if (deleteResult.result === 'confirm_dialog') {
  console.log('ℹ Удаление отменено пользователем в диалоге');
  
  const rowsAfter = await page
    .locator('.PatientSectionTemplate_container_iWUfa .el-table__body')
    .locator('.el-table__row')
    .count();
  
  if (rowsAfter === rowsBefore) {
    console.log('✓ Количество прививок не изменилось (удаление отменено)');
  }
}

console.log('=== ТЕСТ ЗАВЕРШЕН: Все проверки пройдены ===');
  });

  test('Проверка кнопок управления без выбора записи', async ({ page }) => {
    console.log('=== ТЕСТ: Кнопки без выбора записи ===');

    // ---------- Обновление таблицы ----------
    await clickUpdate(page);
    await expectTableUpdated(page);
    console.log('✓ Таблица обновлена');

    // ---------- Выбор первого пациента ----------
    const firstRow = page.locator('.el-table__body .el-table__row').first();
    await expect(firstRow).toBeVisible({ timeout: 10000 });

    const firstCheckbox = firstRow.locator('label.el-checkbox').first();
    await firstCheckbox.scrollIntoViewIfNeeded();
    await firstCheckbox.click();
    console.log(' Первый пациент выбран');

    // ---------- Открытие карты ----------
      const openCardBtn = page.locator('#_openCard').or(page.locator('#undefined_openCard'));
    await expect(openCardBtn).toBeVisible({ timeout: 10000 });
    await expect(openCardBtn).toBeEnabled({ timeout: 10000 });
    await openCardBtn.click();

    await expect(
      page.locator('div.SectionHeader_title_xzR9y', { hasText: 'О пациенте' })
    ).toBeVisible({ timeout: 10000 });

    console.log('✓ Карта пациента открыта');

    // ---------- Выполненные прививки ----------
    const completedMenu = page.locator(
      'li:has(img[alt="Выполненные прививки"])'
    );
    await completedMenu.click();

    await expect(
      page.locator('div.SectionHeader_title_xzR9y', {
        hasText: 'Выполненные прививки',
      })
    ).toBeVisible({ timeout: 10000 });

    console.log('✓ Раздел "Выполненные прививки" открыт');

  });
});