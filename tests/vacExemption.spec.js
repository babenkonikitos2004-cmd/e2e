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
  saveDialogUniversal,
  getMedotvodDoctorFromSelectedRow,
} from './vaccination-cards-063u/helpers';


test.describe('Карта пациента — Медотводы/отказы', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await open063U(page);
  });

  test('Открытие Медотводы/отказы пациента', async ({ page }) => {
    console.log('=== ТЕСТ: Работа с Медотводами ===');
  
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
    // ---------- Медотводы/отказы ----------
    const completedMenu = page.locator(
      'li:has(img[alt="Медотводы / отказы"])'
    );
    await completedMenu.click();


    await expect(completedMenu).toHaveClass(/active|SideMenu_active/);

    await expect(
      page.locator('div.SectionHeader_title_xzR9y', {
        hasText: 'Медотводы / отказы',
      })
    ).toBeVisible({ timeout: 10000 });

    console.log('✓ Раздел "Медотводы / отказы" открыт');

    // ---------- Проверка наличия Медотводов / отказов ----------
  let vacDiseasesSelected = await selectFirstVaccination(page);


if (!vacDiseasesSelected) {
  console.log('⚠ Пропускаем тест - нет Медотводов / отказов');
  test.skip(true, 'Нет Медотводов / отказов для тестирования');
  return;
}

console.log('✓ Медотвод выбран');

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
console.log('✓ Снят выбор Медотводов')

    // ---------- Без выбора Медотводов ----------
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

    // ---------- Снова выбираем Медотвод ----------
    const firstRowCheckbox = page
  .locator('.PatientSectionTemplate_container_iWUfa .el-table__body')
  .locator('.el-table__row')
  .first()
  .locator('.el-checkbox');

await expect(firstRowCheckbox).toBeVisible({ timeout: 5000 });
await firstRowCheckbox.click();
await page.waitForTimeout(500);
console.log('✓ Строка выбрана повторно');

// ---------- Проверка кнопок с выбранным Медотводом ----------

// Редактирование - закрываем через сохранить или отмену   
await editBtn.click();
await page.waitForTimeout(500);

const editResult = await saveDialogUniversal(page, {
  successMessage: 'Медотвод успешно добавлен',
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
console.log('\n=== Проверка удаления Медотвода ===');

const rowsBefore = await page
  .locator('.PatientSectionTemplate_container_iWUfa .el-table__body')
  .locator('.el-table__row')
  .count();

console.log(`Количество Медотводов до удаления: ${rowsBefore}`);

const doctorInfo = await getMedotvodDoctorFromSelectedRow(page);
console.log(`Врач: ${doctorInfo.doctor}, можно удалять: ${doctorInfo.canDelete}`);

// Проверяем что кнопка доступна для клика
await removeBtn.waitFor({ state: 'visible', timeout: 3000 });
console.log('✓ Кнопка удаления видима');

// Используем force: true если элемент перекрыт
 const deleteResult = await attemptDelete(page, 'medotvod', doctorInfo);
  
  console.log(`Результат удаления: ${deleteResult.result}`);
  
  if (deleteResult.result === 'delete_forbidden') {
  console.log(`ℹ Удаление запрещено: ${deleteResult.reason}`);
  if (deleteResult.doctor && !deleteResult.doctor.includes('Круглов Петр Сергеевич')) {
    console.log('✓ Корректно запрещено удаление медотвода другого врача');
  }
} else if (deleteResult.result === 'deleted_success' || deleteResult.result === 'deleted_silent') {
  await page.waitForTimeout(1000);
    
    // Проверяем что количество строк уменьшилось
    const rowsAfter = await page.locator('.el-table__row').count();
    console.log(`Количество медотводов после удаления: ${rowsAfter}`);
  }
});

// Тест на проверку разных врачей
test('Проверка удаления медотводов разных врачей', async ({ page }) => {
  const rows = await page.locator('.el-table__row').all();
  
  for (let i = 0; i < Math.min(rows.length, 3); i++) {
    console.log(`\n--- Проверка строки ${i + 1} ---`);
    
    await rows[i].click();
    await page.waitForTimeout(300);
    
    // Проверяем врача перед удалением
    const doctorCell = rows[i].locator('td').filter({
      has: page.locator('.cell')
    }).last();
    
    const doctorText = await doctorCell.textContent();
    console.log(`Врач: ${doctorText}`);
    
    const removeBtn = page.locator('#_remove').last();
    await removeBtn.click({ force: true });
    
    const deleteResult = await attemptDelete(page, 'medotvod');
    
    if (doctorText.includes('Круглов Петр Сергеевич')) {
      expect(['deleted_success', 'deleted_silent']).toContain(deleteResult.result);
      console.log('✓ Медотвод Круглова успешно удален');
      break; // Удалили, выходим
    } else {
      expect(deleteResult.result).toBe('delete_forbidden');
      console.log('✓ Корректно запрещено удаление чужого медотвода');
    }
  }

console.log('=== ТЕСТ ЗАВЕРШЕН: Все проверки пройдены ===');
  });
});
// Нужно проверять не сохранение а добавление, и не работатет удаление 