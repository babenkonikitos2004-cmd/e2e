import { test, expect } from '@playwright/test';
import {
  open063U,
  fillFioFields,
  clickUpdate,
  expectTableUpdated,
  resetFilters,
  selectFirstPatientRow,     
  openPatientCard,
  openExtendedSearch,
  fillAgeRange,
  selectMaleGender,
  getActionButtons,
  expectOneRecordNotification,
  closeDialogUniversalAuto,
  checkReport
} from './vaccination-cards-063u/helpers';

test.describe('Модуль Карты прививок 063У — фильтры', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await open063U(page);
  });

  test('Расширенный поиск - фильтрация по возрасту', async ({ page }) => {
    console.log('=== ТЕСТ: Фильтрация по возрасту ===');

    const opened = await openExtendedSearch(page);
    expect(opened).toBe(true);

    // Заполнение возраста: с 40 лет
    await fillAgeRange(page, 40);

    await clickUpdate(page);
    await expectTableUpdated(page);

    const rows = page.locator('.el-table__body .el-table__row');
    const rowCount = await rows.count();
    
    console.log(`✓ Найдено пациентов: ${rowCount}`);
    expect(rowCount).toBeGreaterThan(0);

    // Проверка данных первого пациента
    const firstRow = rows.first();
    const ageCell = firstRow.locator('td').nth(5); // Колонка "Возраст"
    const age = await ageCell.textContent();

    console.log(`Возраст первого пациента: ${age}`);

    // Извлекаем число из текста (например, "41 год" -> 41)
    const ageNumber = parseInt(age.match(/\d+/)?.[0] || '0');
    
    expect(ageNumber).toBeGreaterThanOrEqual(40);
    console.log(`✓ Возраст ${ageNumber} >= 40`);

    await resetFilters(page);

    console.log('=== ТЕСТ ЗАВЕРШЕН ===');
  });

  test('Фильтрация по диапазону возраста', async ({ page }) => {
    console.log('=== ТЕСТ: Диапазон возраста 40-45 ===');

    await openExtendedSearch(page);

    // Заполнение диапазона: с 40 по 45 лет
    await fillAgeRange(page, 40, 45);

    await clickUpdate(page); 
    await expectTableUpdated(page);

    const rows = page.locator('.el-table__body .el-table__row');
    const rowCount = await rows.count();
    
    console.log(`✓ Найдено пациентов: ${rowCount}`);
    expect(rowCount).toBeGreaterThan(0);

    // Проверяем возраст первых 3 пациентов
    for (let i = 0; i < Math.min(rowCount, 3); i++) {
      const row = rows.nth(i);
      const ageCell = row.locator('td').nth(5);
      const age = await ageCell.textContent();
      const ageNumber = parseInt(age.match(/\d+/)?.[0] || '0');
      
      console.log(`  Пациент ${i + 1}: ${ageNumber} лет`);
      
      expect(ageNumber).toBeGreaterThanOrEqual(40);
      expect(ageNumber).toBeLessThanOrEqual(45);
    }

    console.log('✓ Все пациенты в диапазоне 40-45 лет');

  // ---------- Получаем кнопки (универсально) ----------
      const { planBtn } = await getActionButtons(page);
    
        // ---------- Снимаем выбор ----------
        await page.waitForTimeout(500);
  
    // ---------- Без выбора ----------
    await planBtn.click();
    await expectOneRecordNotification(page);
    console.log('✓ Уведомление при Выполнении без выбора');

    // ---------- Выбор пациента ----------
    await selectFirstPatientRow(page);
    await planBtn.click();
    await expectOneRecordNotification(page);
    await closeDialogUniversalAuto(page);

    console.log('=== ТЕСТ ЗАВЕРШЕН ===');
  });


  test('Комплексная фильтрация: ФИО + возраст + пол', async ({ page }) => {
    console.log('=== ТЕСТ: Комплексная фильтрация ===');

    await openExtendedSearch(page);

    // ФИО
    await fillFioFields(page, {
      surname: 'ИВАНОВТЕСТ',
      name: 'ИВАН',
      patronymic: 'ИВАНОВИЧЬ'
    });

    // Возраст
    await fillAgeRange(page, 40, 45);

    // Пол
    await selectMaleGender(page);

    // Обновление
    await clickUpdate(page);
    await expectTableUpdated(page);

    const rows = page.locator('.el-table__body .el-table__row');
    const rowCount = await rows.count();
    
    console.log(`✓ Найдено пациентов: ${rowCount}`);
    expect(rowCount).toBeGreaterThan(0);

    // Проверка данных
    const firstRow = rows.first();
    const fioCell = firstRow.locator('td').nth(2);
    const ageCell = firstRow.locator('td').nth(5);
    const genderCell = firstRow.locator('td').nth(4);

    const fio = await fioCell.textContent();
    const age = await ageCell.textContent();
    const gender = await genderCell.textContent();

    console.log(`\nДанные пациента:`);
    console.log(`  ФИО: ${fio}`);
    console.log(`  Возраст: ${age}`);
    console.log(`  Пол: ${gender}`);

    expect(fio).toContain('ИВАН');
    
    const ageNumber = parseInt(age.match(/\d+/)?.[0] || '0');
    expect(ageNumber).toBeGreaterThanOrEqual(40);
    expect(ageNumber).toBeLessThanOrEqual(45);
    
    expect(gender).toContain('М');
    console.log('✓ Все фильтры работают корректно');

    // Выбор и открытие карты
    await selectFirstPatientRow(page);
    const cardOpened = await openPatientCard(page);
    expect(cardOpened).toBe(true);

        console.log('=== ТЕСТ ЗАВЕРШЕН ===');
  });

  test('Тестирование отчетов', async ({ page }) => {
    console.log('=== ТЕСТ: Комплексная фильтрация ===');

    await openExtendedSearch(page);

    await clickUpdate(page);
    await expectTableUpdated(page);

    const rows = page.locator('.el-table__body .el-table__row');
    const rowCount = await rows.count();
    
    console.log(`✓ Найдено пациентов: ${rowCount}`);
    expect(rowCount).toBeGreaterThan(0);

    await checkReport(page, 'Журнал прививок', '_form_64_PDF',  'Журнал прививок');
await checkReport(page, 'Профилактические прививки (Форма 5)', '_forma_5_PDF',  'Профилактические прививки форма №5');
const [pdfPage] = await Promise.all([
  page.waitForEvent('popup', { timeout: 5000 }),
  checkReport(page, 'Контингенты привитого населения (Форма 6)', '_vac_fm6_PDF', null)
]);

console.log('✓ PDF Формы 6 открылся:', pdfPage.url());
await pdfPage.close();
     }
    );
});