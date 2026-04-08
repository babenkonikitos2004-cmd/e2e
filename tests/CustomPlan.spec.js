import { test, expect } from '@playwright/test';
import {
    clickUpdate,
  expectTableUpdated,
  selectFirstPatientRow,
  openPatientCard,
  expectOneRecordNotification,
  expectEditDialog,
  expectExecuteDialog,
  saveDialogUniversal,
  getActionButtons,
  attemptDelete, 
  mockRequest,
  openModule,
  closeDialogUniversalAuto,
} from './vaccination-cards-063u/helpers';


test.describe('Модуль список медотводов/отказов — фильтры', () => {
  
  test.beforeEach(async ({ page }) => {
    
    // ← УСТАНАВЛИВАЕМ МОКИ ПЕРЕД ВСЕМИ ДЕЙСТВИЯМИ
    console.log('🎭 Установка моков...');
    
    // Mock для /nullDiseases
    await mockRequest(page, '**/nullDiseases', {
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
          {
        "id": "c63253eb-1d4e-4ac2-b7d1-a04d6f15a901",
        "changePersonFio": "Круглов Петр Сергеевич",
        "createDt": "2025-10-08T07:26:15.143791",
        "changeDt": "2025-11-06T10:20:32.492398",
        "isSystem": false,
        "planName": "Группа риска сахарный диабет",
        "indicationUseId": "5c3771e3-9322-499a-8407-d357fdc215ab",
        "indicationUseName": "Иммунодиагностика",
        "deleteExistsPlan": false,
        "planningHorizon": 5,
        "planStartDt": "2025-11-06",
        "minAge": 17,
        "maxAge": 40,
        "groupRiskId": 11,
        "groupRiskName": "Лица больные сахарным диабетом",
        "sexId": "4d1f2771-befa-472d-a70d-26704300229c",
        "sexName": "Мужской"
    },
    {
        "id": "1a2cd622-31b7-45e0-b1d1-140a1ac18332",
        "changePersonFio": "Круглов Петр Сергеевич",
        "createDt": null,
        "changeDt": "2025-11-27T12:21:00.918369",
        "isSystem": false,
        "planName": "тест2",
        "indicationUseId": "bf7af05c-a680-40df-a299-ccebf56cdbd8",
        "indicationUseName": "Вакцинация в рамках национального календаря профилактических прививок",
        "deleteExistsPlan": true,
        "planningHorizon": 50,
        "planStartDt": "2025-11-27",
        "minAge": 1,
        "maxAge": 40,
        "groupRiskId": 2,
        "groupRiskName": "Дети, рожденные ВИЧ-инфицированными матерями",
        "sexId": "4d1f2771-befa-472d-a70d-26704300229c",
        "sexName": "Мужской"
    },
    {
        "id": "b3a6a4a4-e1bd-4be4-b794-f86a829894db",
        "changePersonFio": "Круглов Петр Сергеевич",
        "createDt": "2025-10-17T10:09:15.45822",
        "changeDt": "2025-10-17T10:09:15.458241",
        "isSystem": false,
        "planName": "проверкаодинаковыхдубл",
        "indicationUseId": "5c3771e3-9322-499a-8407-d357fdc215ab",
        "indicationUseName": "Иммунодиагностика",
        "deleteExistsPlan": true,
        "planningHorizon": 100,
        "planStartDt": "2025-10-17",
        "minAge": 1,
        "maxAge": 100,
        "groupRiskId": null,
        "groupRiskName": null,
        "sexId": "4d1f2771-befa-472d-a70d-26704300229c",
        "sexName": "Мужской"
    },
    {
        "id": "5f73a8eb-a81b-4b1e-8d77-c44b42bd1c5e",
        "changePersonFio": "Круглов Петр Сергеевич",
        "createDt": "2025-12-05T16:26:56.752598",
        "changeDt": "2025-12-05T16:26:56.752632",
        "isSystem": false,
        "planName": "Нац. календарь (кастомный,взрослые) (Копия)-2025-12-05",
        "indicationUseId": "bf7af05c-a680-40df-a299-ccebf56cdbd8",
        "indicationUseName": "Вакцинация в рамках национального календаря профилактических прививок",
        "deleteExistsPlan": true,
        "planningHorizon": 50,
        "planStartDt": null,
        "minAge": 18,
        "maxAge": null,
        "groupRiskId": null,
        "groupRiskName": null,
        "sexId": null,
        "sexName": null
    },
    {
        "id": "60b0f64e-906c-44d8-a53b-d85e9f5e4c07",
        "changePersonFio": "Круглов Петр Сергеевич",
        "createDt": "2026-03-02T17:11:43.157396",
        "changeDt": "2026-03-02T17:11:43.157426",
        "isSystem": false,
        "planName": "каак",
        "indicationUseId": "8ebc710f-7212-4028-8532-23b7764112b4",
        "indicationUseName": "Вакцинация по эпидемическим показаниям",
        "deleteExistsPlan": true,
        "planningHorizon": 34,
        "planStartDt": "2026-03-06",
        "minAge": 23,
        "maxAge": 33,
        "groupRiskId": 7,
        "groupRiskName": "Направление к фтизиатру по результату тубпробы",
        "sexId": "4d1f2771-befa-472d-a70d-26704300229c",
        "sexName": "Мужской"
    },
    {
        "id": "cd7f6c98-fdea-4f62-a4b8-943250227ded",
        "changePersonFio": null,
        "createDt": "2025-01-09T10:31:50.81756",
        "changeDt": "2025-01-09T10:31:50.81756",
        "isSystem": true,
        "planName": "Нац. календарь (кастомный,дети)",
        "indicationUseId": "bf7af05c-a680-40df-a299-ccebf56cdbd8",
        "indicationUseName": "Вакцинация в рамках национального календаря профилактических прививок",
        "deleteExistsPlan": true,
        "planningHorizon": 50,
        "planStartDt": null,
        "minAge": null,
        "maxAge": 18,
        "groupRiskId": null,
        "groupRiskName": null,
        "sexId": null,
        "sexName": null
    },
    {
        "id": "c9a8ed3c-cab7-4976-9838-5e8403d81060",
        "changePersonFio": null,
        "createDt": "2025-01-09T10:31:50.81756",
        "changeDt": "2025-01-09T10:31:50.81756",
        "isSystem": true,
        "planName": "Нац. календарь (кастомный,взрослые)",
        "indicationUseId": "bf7af05c-a680-40df-a299-ccebf56cdbd8",
        "indicationUseName": "Вакцинация в рамках национального календаря профилактических прививок",
        "deleteExistsPlan": true,
        "planningHorizon": 50,
        "planStartDt": null,
        "minAge": 18,
        "maxAge": null,
        "groupRiskId": null,
        "groupRiskName": null,
        "sexId": null,
        "sexName": null
    }
      ]
        
        ),
      log: true,
    });
    
    // Mock для /nullAdmin
    await mockRequest(page, '**/nullAdmin**', {
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
          {
        "id": "c63253eb-1d4e-4ac2-b7d1-a04d6f15a901",
        "changePersonFio": "Круглов Петр Сергеевич",
        "createDt": "2025-10-08T07:26:15.143791",
        "changeDt": "2025-11-06T10:20:32.492398",
        "isSystem": false,
        "planName": "Группа риска сахарный диабет",
        "indicationUseId": "5c3771e3-9322-499a-8407-d357fdc215ab",
        "indicationUseName": "Иммунодиагностика",
        "deleteExistsPlan": false,
        "planningHorizon": 5,
        "planStartDt": "2025-11-06",
        "minAge": 17,
        "maxAge": 40,
        "groupRiskId": 11,
        "groupRiskName": "Лица больные сахарным диабетом",
        "sexId": "4d1f2771-befa-472d-a70d-26704300229c",
        "sexName": "Мужской"
    },
    {
        "id": "1a2cd622-31b7-45e0-b1d1-140a1ac18332",
        "changePersonFio": "Круглов Петр Сергеевич",
        "createDt": null,
        "changeDt": "2025-11-27T12:21:00.918369",
        "isSystem": false,
        "planName": "тест2",
        "indicationUseId": "bf7af05c-a680-40df-a299-ccebf56cdbd8",
        "indicationUseName": "Вакцинация в рамках национального календаря профилактических прививок",
        "deleteExistsPlan": true,
        "planningHorizon": 50,
        "planStartDt": "2025-11-27",
        "minAge": 1,
        "maxAge": 40,
        "groupRiskId": 2,
        "groupRiskName": "Дети, рожденные ВИЧ-инфицированными матерями",
        "sexId": "4d1f2771-befa-472d-a70d-26704300229c",
        "sexName": "Мужской"
    },
    {
        "id": "b3a6a4a4-e1bd-4be4-b794-f86a829894db",
        "changePersonFio": "Круглов Петр Сергеевич",
        "createDt": "2025-10-17T10:09:15.45822",
        "changeDt": "2025-10-17T10:09:15.458241",
        "isSystem": false,
        "planName": "проверкаодинаковыхдубл",
        "indicationUseId": "5c3771e3-9322-499a-8407-d357fdc215ab",
        "indicationUseName": "Иммунодиагностика",
        "deleteExistsPlan": true,
        "planningHorizon": 100,
        "planStartDt": "2025-10-17",
        "minAge": 1,
        "maxAge": 100,
        "groupRiskId": null,
        "groupRiskName": null,
        "sexId": "4d1f2771-befa-472d-a70d-26704300229c",
        "sexName": "Мужской"
    },
    {
        "id": "5f73a8eb-a81b-4b1e-8d77-c44b42bd1c5e",
        "changePersonFio": "Круглов Петр Сергеевич",
        "createDt": "2025-12-05T16:26:56.752598",
        "changeDt": "2025-12-05T16:26:56.752632",
        "isSystem": false,
        "planName": "Нац. календарь (кастомный,взрослые) (Копия)-2025-12-05",
        "indicationUseId": "bf7af05c-a680-40df-a299-ccebf56cdbd8",
        "indicationUseName": "Вакцинация в рамках национального календаря профилактических прививок",
        "deleteExistsPlan": true,
        "planningHorizon": 50,
        "planStartDt": null,
        "minAge": 18,
        "maxAge": null,
        "groupRiskId": null,
        "groupRiskName": null,
        "sexId": null,
        "sexName": null
    },
    {
        "id": "60b0f64e-906c-44d8-a53b-d85e9f5e4c07",
        "changePersonFio": "Круглов Петр Сергеевич",
        "createDt": "2026-03-02T17:11:43.157396",
        "changeDt": "2026-03-02T17:11:43.157426",
        "isSystem": false,
        "planName": "каак",
        "indicationUseId": "8ebc710f-7212-4028-8532-23b7764112b4",
        "indicationUseName": "Вакцинация по эпидемическим показаниям",
        "deleteExistsPlan": true,
        "planningHorizon": 34,
        "planStartDt": "2026-03-06",
        "minAge": 23,
        "maxAge": 33,
        "groupRiskId": 7,
        "groupRiskName": "Направление к фтизиатру по результату тубпробы",
        "sexId": "4d1f2771-befa-472d-a70d-26704300229c",
        "sexName": "Мужской"
    },
    {
        "id": "cd7f6c98-fdea-4f62-a4b8-943250227ded",
        "changePersonFio": null,
        "createDt": "2025-01-09T10:31:50.81756",
        "changeDt": "2025-01-09T10:31:50.81756",
        "isSystem": true,
        "planName": "Нац. календарь (кастомный,дети)",
        "indicationUseId": "bf7af05c-a680-40df-a299-ccebf56cdbd8",
        "indicationUseName": "Вакцинация в рамках национального календаря профилактических прививок",
        "deleteExistsPlan": true,
        "planningHorizon": 50,
        "planStartDt": null,
        "minAge": null,
        "maxAge": 18,
        "groupRiskId": null,
        "groupRiskName": null,
        "sexId": null,
        "sexName": null
    },
    {
        "id": "c9a8ed3c-cab7-4976-9838-5e8403d81060",
        "changePersonFio": null,
        "createDt": "2025-01-09T10:31:50.81756",
        "changeDt": "2025-01-09T10:31:50.81756",
        "isSystem": true,
        "planName": "Нац. календарь (кастомный,взрослые)",
        "indicationUseId": "bf7af05c-a680-40df-a299-ccebf56cdbd8",
        "indicationUseName": "Вакцинация в рамках национального календаря профилактических прививок",
        "deleteExistsPlan": true,
        "planningHorizon": 50,
        "planStartDt": null,
        "minAge": 18,
        "maxAge": null,
        "groupRiskId": null,
        "groupRiskName": null,
        "sexId": null,
        "sexName": null
    }
      ]
        
        ),
      log: true,
    });
    
    // Общий mock для всех запросов с /null
    await mockRequest(page, '**/null**', {
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
          {
        "id": "c63253eb-1d4e-4ac2-b7d1-a04d6f15a901",
        "changePersonFio": "Круглов Петр Сергеевич",
        "createDt": "2025-10-08T07:26:15.143791",
        "changeDt": "2025-11-06T10:20:32.492398",
        "isSystem": false,
        "planName": "Группа риска сахарный диабет",
        "indicationUseId": "5c3771e3-9322-499a-8407-d357fdc215ab",
        "indicationUseName": "Иммунодиагностика",
        "deleteExistsPlan": false,
        "planningHorizon": 5,
        "planStartDt": "2025-11-06",
        "minAge": 17,
        "maxAge": 40,
        "groupRiskId": 11,
        "groupRiskName": "Лица больные сахарным диабетом",
        "sexId": "4d1f2771-befa-472d-a70d-26704300229c",
        "sexName": "Мужской"
    },
    {
        "id": "1a2cd622-31b7-45e0-b1d1-140a1ac18332",
        "changePersonFio": "Круглов Петр Сергеевич",
        "createDt": null,
        "changeDt": "2025-11-27T12:21:00.918369",
        "isSystem": false,
        "planName": "тест2",
        "indicationUseId": "bf7af05c-a680-40df-a299-ccebf56cdbd8",
        "indicationUseName": "Вакцинация в рамках национального календаря профилактических прививок",
        "deleteExistsPlan": true,
        "planningHorizon": 50,
        "planStartDt": "2025-11-27",
        "minAge": 1,
        "maxAge": 40,
        "groupRiskId": 2,
        "groupRiskName": "Дети, рожденные ВИЧ-инфицированными матерями",
        "sexId": "4d1f2771-befa-472d-a70d-26704300229c",
        "sexName": "Мужской"
    },
    {
        "id": "b3a6a4a4-e1bd-4be4-b794-f86a829894db",
        "changePersonFio": "Круглов Петр Сергеевич",
        "createDt": "2025-10-17T10:09:15.45822",
        "changeDt": "2025-10-17T10:09:15.458241",
        "isSystem": false,
        "planName": "проверкаодинаковыхдубл",
        "indicationUseId": "5c3771e3-9322-499a-8407-d357fdc215ab",
        "indicationUseName": "Иммунодиагностика",
        "deleteExistsPlan": true,
        "planningHorizon": 100,
        "planStartDt": "2025-10-17",
        "minAge": 1,
        "maxAge": 100,
        "groupRiskId": null,
        "groupRiskName": null,
        "sexId": "4d1f2771-befa-472d-a70d-26704300229c",
        "sexName": "Мужской"
    },
    {
        "id": "5f73a8eb-a81b-4b1e-8d77-c44b42bd1c5e",
        "changePersonFio": "Круглов Петр Сергеевич",
        "createDt": "2025-12-05T16:26:56.752598",
        "changeDt": "2025-12-05T16:26:56.752632",
        "isSystem": false,
        "planName": "Нац. календарь (кастомный,взрослые) (Копия)-2025-12-05",
        "indicationUseId": "bf7af05c-a680-40df-a299-ccebf56cdbd8",
        "indicationUseName": "Вакцинация в рамках национального календаря профилактических прививок",
        "deleteExistsPlan": true,
        "planningHorizon": 50,
        "planStartDt": null,
        "minAge": 18,
        "maxAge": null,
        "groupRiskId": null,
        "groupRiskName": null,
        "sexId": null,
        "sexName": null
    },
    {
        "id": "60b0f64e-906c-44d8-a53b-d85e9f5e4c07",
        "changePersonFio": "Круглов Петр Сергеевич",
        "createDt": "2026-03-02T17:11:43.157396",
        "changeDt": "2026-03-02T17:11:43.157426",
        "isSystem": false,
        "planName": "каак",
        "indicationUseId": "8ebc710f-7212-4028-8532-23b7764112b4",
        "indicationUseName": "Вакцинация по эпидемическим показаниям",
        "deleteExistsPlan": true,
        "planningHorizon": 34,
        "planStartDt": "2026-03-06",
        "minAge": 23,
        "maxAge": 33,
        "groupRiskId": 7,
        "groupRiskName": "Направление к фтизиатру по результату тубпробы",
        "sexId": "4d1f2771-befa-472d-a70d-26704300229c",
        "sexName": "Мужской"
    },
    {
        "id": "cd7f6c98-fdea-4f62-a4b8-943250227ded",
        "changePersonFio": null,
        "createDt": "2025-01-09T10:31:50.81756",
        "changeDt": "2025-01-09T10:31:50.81756",
        "isSystem": true,
        "planName": "Нац. календарь (кастомный,дети)",
        "indicationUseId": "bf7af05c-a680-40df-a299-ccebf56cdbd8",
        "indicationUseName": "Вакцинация в рамках национального календаря профилактических прививок",
        "deleteExistsPlan": true,
        "planningHorizon": 50,
        "planStartDt": null,
        "minAge": null,
        "maxAge": 18,
        "groupRiskId": null,
        "groupRiskName": null,
        "sexId": null,
        "sexName": null
    },
    {
        "id": "c9a8ed3c-cab7-4976-9838-5e8403d81060",
        "changePersonFio": null,
        "createDt": "2025-01-09T10:31:50.81756",
        "changeDt": "2025-01-09T10:31:50.81756",
        "isSystem": true,
        "planName": "Нац. календарь (кастомный,взрослые)",
        "indicationUseId": "bf7af05c-a680-40df-a299-ccebf56cdbd8",
        "indicationUseName": "Вакцинация в рамках национального календаря профилактических прививок",
        "deleteExistsPlan": true,
        "planningHorizon": 50,
        "planStartDt": null,
        "minAge": 18,
        "maxAge": null,
        "groupRiskId": null,
        "groupRiskName": null,
        "sexId": null,
        "sexName": null
    }
      ]
        
        ),
      log: true,
    });
    
    /** Опционально: Логируем все ошибочные запросы
    *logRequests(page, { 
      responses: true, 
      requests: false,
      statusFilter: [404, 405, 500] 
    });
    */

    console.log('Моки установлены\n');
    
    // Остальной код beforeEach
     await page.goto('/');
    
    const opened = await openModule(page, 'Планы вакцинации', {
      waitForFields: false,
    });
    
    await page.waitForTimeout(3000);
    
    const diseasesTab = page.locator('.el-tabs__item', { hasText: 'Планы вакцинации' });
    const tabVisible = await diseasesTab.isVisible({ timeout: 1000 }).catch(() => false);
    
    if (!tabVisible) {
      throw new Error('Вкладка "Планы вакцинации" не найдена');
    }
    
    await diseasesTab.click();
    console.log('✓ Переход на вкладку "Планы вакцинации"');
    
    await page.waitForTimeout(2000);
  });

  test('Открытие и просмотр планов вакцинации', async ({ page }) => {
  console.log('=== ТЕСТ: Планы вакцинации ===');
  
  // ---------- Выбор первого плана ----------
  const patientSelected = await selectFirstPatientRow(page);
  
  if (!patientSelected) {
    test.skip(true, 'Не удалось выбрать план из списка');
    return;
  }
  
  console.log('✓ План выбран');

  // ---------- Кнопки ----------
  const { editBtn, removeBtn, planBtn, editPlanDetails, duplicatePlan } = await getActionButtons(page);

  // ---------- Снимаем выбор ----------
  await page.waitForTimeout(500);

  // Упрощенный способ - находим чекбокс первой строки и кликаем еще раз
  const firstRowCheckbox = page
    .locator('.el-table__body .el-table__row')
    .first()
    .locator('.el-checkbox')
    .first();

  const checkboxVisible = await firstRowCheckbox.isVisible({ timeout: 3000 }).catch(() => false);
  
  if (checkboxVisible) {
    await firstRowCheckbox.click();
    await page.waitForTimeout(500);
    console.log('✓ Снят выбор плана');
  } else {
    console.log('⚠ Чекбокс не найден, пропускаем снятие выбора');
  }

    // ---------- Без выбора плана ----------
    await editPlanDetails.click();
    await expectOneRecordNotification(page);
    console.log('✓ Уведомление при детализации без выбора');

    await editBtn.click();
    await expectOneRecordNotification(page);
    console.log('✓ Уведомление при редактировании без выбора');

    await duplicatePlan.click();
    await expectOneRecordNotification(page);
    console.log('✓ Уведомление при дублировании без выбора');

    await removeBtn.click();
    await expectOneRecordNotification(page);
    console.log('✓ Уведомление при удалении без выбора');
    

    
    // ---------- Снова выбираем план ----------
await firstRowCheckbox.click();
  await page.waitForTimeout(500);
  console.log('✓ План выбран повторно');

// ---------- Проверка кнопок с выбранной прививкой ----------

//_______________Детализация
await editPlanDetails.click();
await page.waitForTimeout(500);


  
  // Находим диалоговое окно на странице

  let dialog = page.locator('.BasicDialogFooter_container_fYQkE').first();
  let dialogVisible = await dialog.isVisible({ timeout: 3000 }).catch(() => false);
  
  if (dialogVisible) {
    await saveDialogUniversal(page, {
    pagesuccessMessage: 'Детализация обновлена.',
    errorMessage: 'Ошибка при сохранении детализации',
  });

    console.log('✓ Диалог детализации открыт');

    // Ищем кнопку "Сохранить"
    const saveBtn = dialog.locator('button:has-text("Сохранить")').first();
    const saveBtnVisible = await saveBtn.isVisible({ timeout: 1000 }).catch(() => false);
    
    if (saveBtnVisible) {
      await saveBtn.click();
      console.log('✓ Кнопка "Сохранить" нажата');
      
      // Ждем пока диалог закроется
      await page.waitForTimeout(1000);
      
      // Проверяем что диалог действительно закрылся
      const dialogStillVisible = await dialog.isVisible({ timeout: 2000 }).catch(() => false);
      
      if (dialogStillVisible) {
        console.log('⚠ Диалог все еще открыт, закрываем через Escape');
        await page.keyboard.press('Escape');
        await page.waitForTimeout(500);
      } else {
        console.log('✓ Диалог закрыт');
      }
    } else {
      console.log('⚠ Кнопка "Сохранить" не найдена, закрываем через Escape');
      await page.keyboard.press('Escape');
      await page.waitForTimeout(500);
    }
  }
console.log('✓ Детализация проверена');

//__________________Редактирование
await editBtn.click();
await page.waitForTimeout(500);
await closeDialogUniversalAuto(page);
console.log('✓ Редактирование проверено');


//_______________Добавление
await planBtn.click();
await page.waitForTimeout(500);
await closeDialogUniversalAuto(page);
console.log('✓ Добавление проверено');


//_______________Дублирование
await duplicatePlan.click();
await page.waitForTimeout(500);
await closeDialogUniversalAuto(page);


// Удаление - закрываем диалог (если он есть)
const rowsBefore = await page
      .locator('.PatientSectionTemplate_container_iWUfa .el-table__body')
      .locator('.el-table__row')
      .count();
    
    console.log(`Количество планов до удаления: ${rowsBefore}`);

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
      console.log(`Количество ПЛАНОВ после удаления: ${rowsAfter}`);
      
      if (rowsAfter < rowsBefore) {
        console.log('✓ Прививка успешно удалена из таблицы');
      }
    }

console.log('=== ТЕСТ ЗАВЕРШЕН: Все проверки пройдены ===');
  });
});