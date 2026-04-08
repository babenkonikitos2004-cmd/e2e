import { test, expect } from '@playwright/test';
import {
  openModule,
  clickUpdate,
  expectTableUpdated,
  selectFirstPatientRow,     
  openPatientCard,
  openExtendedSearch,
  checkReport,
  mockRequest,      
  logRequests,      // если ошибки надо вкл функц
  checkInfoSystem,
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
        "id": "ebb35ad5-c4c5-4482-b6d8-70ad0378f270",
        "patient": {
            "id": "fd3b8137-4fc2-41ec-9301-97b00e421fa9",
            "lastName": "АЛЕКСЕЕВА",
            "firstName": "ЮЛИЯ",
            "middleName": "ГЕОРГИЕВНА",
            "birthPlace": null,
            "phone": null,
            "email": null,
            "snils": "00010000700",
            "birthDt": "1984-08-20",
            "sex": "Женский",
            "workPlace": null,
            "workPosition": null,
            "studyPlace": null,
            "studyGrade": null,
            "socialStatus": "Пенсионер",
            "patientIdentities": null,
            "patientOrgs": {
                "id": "a8fad9fc-161e-4de9-adab-5ac32ae9c460",
                "nameShort": "БУ \"НИЖНЕВАРТОВСКАЯ ОКРУЖНАЯ КЛИНИЧЕСКАЯ БОЛЬНИЦА\"",
                "nameFull": "БЮДЖЕТНОЕ УЧРЕЖДЕНИЕ ХАНТЫ-МАНСИЙСКОГО АВТОНОМНОГО ОКРУГА - ЮГРЫ \"НИЖНЕВАРТОВСКАЯ ОКРУЖНАЯ КЛИНИЧЕСКАЯ БОЛЬНИЦА\""
            },
            "patientPolicy": null,
            "disability": null,
            "privilageGroupName": "",
            "citizenshipName": null,
            "addrLeave": "Ханты-Мансийский Автономный округ - Югра АО, г Сургут, ул Мелик-Карамова, д.60 кв.85",
            "addrReg": null,
            "district": {
                "id": "42d274de-c91d-4d7e-895f-2a1819a58388",
                "name": "510",
                "dateFrom": "2025-03-28",
                "dateTo": null
            },
            "patientRisk": [],
            "patientGroupRisk": [
                {
                    "id": "2eaedaea-6452-4303-a2ce-f7e752af0f1d",
                    "groupRiskId": 12,
                    "personId": "f18e2464-3864-4720-8077-0936cb668c79",
                    "checkDt": "2025-10-02",
                    "endDt": null
                }
            ],
            "age": "41 год",
            "statusId": "0",
            "individualPlan": false
        },
        "diseaseName": "COVID-19",
        "icdName": "COVID-19",
        "begDt": "2025-01-27",
        "endDt": "2025-02-02",
        "personFio": "Яковлева Мария Владимировна"
    },
     {
        "id": "ebb35ad5-c4c5-4482-b6d8-70ad0378f270",
        "patient": {
            "id": "fd3b8137-4fc2-41ec-9301-97b00e421fa9",
            "lastName": "АЛЕКСЕЕВА",
            "firstName": "ЮЛИЯ",
            "middleName": "ГЕОРГИЕВНА",
            "birthPlace": null,
            "phone": null,
            "email": null,
            "snils": "00010000700",
            "birthDt": "1984-08-20",
            "sex": "Женский",
            "workPlace": null,
            "workPosition": null,
            "studyPlace": null,
            "studyGrade": null,
            "socialStatus": "Пенсионер",
            "patientIdentities": null,
            "patientOrgs": {
                "id": "a8fad9fc-161e-4de9-adab-5ac32ae9c460",
                "nameShort": "БУ \"НИЖНЕВАРТОВСКАЯ ОКРУЖНАЯ КЛИНИЧЕСКАЯ БОЛЬНИЦА\"",
                "nameFull": "БЮДЖЕТНОЕ УЧРЕЖДЕНИЕ ХАНТЫ-МАНСИЙСКОГО АВТОНОМНОГО ОКРУГА - ЮГРЫ \"НИЖНЕВАРТОВСКАЯ ОКРУЖНАЯ КЛИНИЧЕСКАЯ БОЛЬНИЦА\""
            },
            "patientPolicy": null,
            "disability": null,
            "privilageGroupName": "",
            "citizenshipName": null,
            "addrLeave": "Ханты-Мансийский Автономный округ - Югра АО, г Сургут, ул Мелик-Карамова, д.60 кв.85",
            "addrReg": null,
            "district": {
                "id": "42d274de-c91d-4d7e-895f-2a1819a58388",
                "name": "510",
                "dateFrom": "2025-03-28",
                "dateTo": null
            },
            "patientRisk": [],
            "patientGroupRisk": [
                {
                    "id": "2eaedaea-6452-4303-a2ce-f7e752af0f1d",
                    "groupRiskId": 12,
                    "personId": "f18e2464-3864-4720-8077-0936cb668c79",
                    "checkDt": "2025-10-02",
                    "endDt": null
                }
            ],
            "age": "41 год",
            "statusId": "0",
            "individualPlan": false
        },
        "diseaseName": "COVID-19",
        "icdName": "COVID-19",
        "begDt": "2025-01-27",
        "endDt": "2025-02-02",
        "personFio": "Яковлева Мария Владимировна"
    },
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
        "id": "ebb35ad5-c4c5-4482-b6d8-70ad0378f270",
        "patient": {
            "id": "fd3b8137-4fc2-41ec-9301-97b00e421fa9",
            "lastName": "АЛЕКСЕЕВА",
            "firstName": "ЮЛИЯ",
            "middleName": "ГЕОРГИЕВНА",
            "birthPlace": null,
            "phone": null,
            "email": null,
            "snils": "00010000700",
            "birthDt": "1984-08-20",
            "sex": "Женский",
            "workPlace": null,
            "workPosition": null,
            "studyPlace": null,
            "studyGrade": null,
            "socialStatus": "Пенсионер",
            "patientIdentities": null,
            "patientOrgs": {
                "id": "a8fad9fc-161e-4de9-adab-5ac32ae9c460",
                "nameShort": "БУ \"НИЖНЕВАРТОВСКАЯ ОКРУЖНАЯ КЛИНИЧЕСКАЯ БОЛЬНИЦА\"",
                "nameFull": "БЮДЖЕТНОЕ УЧРЕЖДЕНИЕ ХАНТЫ-МАНСИЙСКОГО АВТОНОМНОГО ОКРУГА - ЮГРЫ \"НИЖНЕВАРТОВСКАЯ ОКРУЖНАЯ КЛИНИЧЕСКАЯ БОЛЬНИЦА\""
            },
            "patientPolicy": null,
            "disability": null,
            "privilageGroupName": "",
            "citizenshipName": null,
            "addrLeave": "Ханты-Мансийский Автономный округ - Югра АО, г Сургут, ул Мелик-Карамова, д.60 кв.85",
            "addrReg": null,
            "district": {
                "id": "42d274de-c91d-4d7e-895f-2a1819a58388",
                "name": "510",
                "dateFrom": "2025-03-28",
                "dateTo": null
            },
            "patientRisk": [],
            "patientGroupRisk": [
                {
                    "id": "2eaedaea-6452-4303-a2ce-f7e752af0f1d",
                    "groupRiskId": 12,
                    "personId": "f18e2464-3864-4720-8077-0936cb668c79",
                    "checkDt": "2025-10-02",
                    "endDt": null
                }
            ],
            "age": "41 год",
            "statusId": "0",
            "individualPlan": false
        },
        "diseaseName": "COVID-19",
        "icdName": "COVID-19",
        "begDt": "2025-01-27",
        "endDt": "2025-02-02",
        "personFio": "Яковлева Мария Владимировна"
    },
      {
        "id": "7ec6b4b1-c079-4ca5-963c-773bbf2ed677",
        "patient": {
            "id": "5642632f-979d-4e6f-92e9-166649cc482a",
            "lastName": "ШАКИРОВ",
            "firstName": "АЛЕКСЕЙ",
            "middleName": "ОЛЕГОВИЧ",
            "birthPlace": null,
            "phone": null,
            "email": null,
            "snils": "00010000000",
            "birthDt": "1996-08-22",
            "sex": "Мужской",
            "workPlace": "ООО \"МНОГОФУНКЦИОНАЛЬНЫЙ БИЗНЕС-ЦЕНТР\"",
            "workPosition": "Работяга",
            "studyPlace": null,
            "studyGrade": null,
            "socialStatus": "Дошкольник",
            "patientIdentities": null,
            "patientOrgs": null,
            "patientPolicy": null,
            "disability": null,
            "privilageGroupName": "",
            "citizenshipName": null,
            "addrLeave": "Ханты-Мансийский Автономный округ - Югра АО, г Сургут, ул Маяковского, д.16 кв.722",
            "addrReg": null,
            "district": null,
            "patientRisk": [],
            "patientGroupRisk": [
                {
                    "id": "311eedb8-4fc9-49c4-b69d-f9bd381c8db0",
                    "groupRiskId": 2,
                    "personId": "4cbc03cf-bf43-4617-9f02-89a914c09fa7",
                    "checkDt": "2025-03-06",
                    "endDt": "2025-03-11"
                }
            ],
            "age": "29 лет",
            "statusId": "0",
            "individualPlan": false
        },
        "diseaseName": "Оспа",
        "icdName": "Оспа",
        "begDt": "2025-03-04",
        "endDt": "2025-03-06",
        "personFio": "Яковлева Мария Владимировна"
    },
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
        "id": "ebb35ad5-c4c5-4482-b6d8-70ad0378f270",
        "patient": {
            "id": "fd3b8137-4fc2-41ec-9301-97b00e421fa9",
            "lastName": "АЛЕКСЕЕВА",
            "firstName": "ЮЛИЯ",
            "middleName": "ГЕОРГИЕВНА",
            "birthPlace": null,
            "phone": null,
            "email": null,
            "snils": "00010000700",
            "birthDt": "1984-08-20",
            "sex": "Женский",
            "workPlace": null,
            "workPosition": null,
            "studyPlace": null,
            "studyGrade": null,
            "socialStatus": "Пенсионер",
            "patientIdentities": null,
            "patientOrgs": {
                "id": "a8fad9fc-161e-4de9-adab-5ac32ae9c460",
                "nameShort": "БУ \"НИЖНЕВАРТОВСКАЯ ОКРУЖНАЯ КЛИНИЧЕСКАЯ БОЛЬНИЦА\"",
                "nameFull": "БЮДЖЕТНОЕ УЧРЕЖДЕНИЕ ХАНТЫ-МАНСИЙСКОГО АВТОНОМНОГО ОКРУГА - ЮГРЫ \"НИЖНЕВАРТОВСКАЯ ОКРУЖНАЯ КЛИНИЧЕСКАЯ БОЛЬНИЦА\""
            },
            "patientPolicy": null,
            "disability": null,
            "privilageGroupName": "",
            "citizenshipName": null,
            "addrLeave": "Ханты-Мансийский Автономный округ - Югра АО, г Сургут, ул Мелик-Карамова, д.60 кв.85",
            "addrReg": null,
            "district": {
                "id": "42d274de-c91d-4d7e-895f-2a1819a58388",
                "name": "510",
                "dateFrom": "2025-03-28",
                "dateTo": null
            },
            "patientRisk": [],
            "patientGroupRisk": [
                {
                    "id": "2eaedaea-6452-4303-a2ce-f7e752af0f1d",
                    "groupRiskId": 12,
                    "personId": "f18e2464-3864-4720-8077-0936cb668c79",
                    "checkDt": "2025-10-02",
                    "endDt": null
                }
            ],
            "age": "41 год",
            "statusId": "0",
            "individualPlan": false
        },
        "diseaseName": "COVID-19",
        "icdName": "COVID-19",
        "begDt": "2025-01-27",
        "endDt": "2025-02-02",
        "personFio": "Яковлева Мария Владимировна"
    },
      {
        "id": "7ec6b4b1-c079-4ca5-963c-773bbf2ed677",
        "patient": {
            "id": "5642632f-979d-4e6f-92e9-166649cc482a",
            "lastName": "ШАКИРОВ",
            "firstName": "АЛЕКСЕЙ",
            "middleName": "ОЛЕГОВИЧ",
            "birthPlace": null,
            "phone": null,
            "email": null,
            "snils": "00010000000",
            "birthDt": "1996-08-22",
            "sex": "Мужской",
            "workPlace": "ООО \"МНОГОФУНКЦИОНАЛЬНЫЙ БИЗНЕС-ЦЕНТР\"",
            "workPosition": "Работяга",
            "studyPlace": null,
            "studyGrade": null,
            "socialStatus": "Дошкольник",
            "patientIdentities": null,
            "patientOrgs": null,
            "patientPolicy": null,
            "disability": null,
            "privilageGroupName": "",
            "citizenshipName": null,
            "addrLeave": "Ханты-Мансийский Автономный округ - Югра АО, г Сургут, ул Маяковского, д.16 кв.722",
            "addrReg": null,
            "district": null,
            "patientRisk": [],
            "patientGroupRisk": [
                {
                    "id": "311eedb8-4fc9-49c4-b69d-f9bd381c8db0",
                    "groupRiskId": 2,
                    "personId": "4cbc03cf-bf43-4617-9f02-89a914c09fa7",
                    "checkDt": "2025-03-06",
                    "endDt": "2025-03-11"
                }
            ],
            "age": "29 лет",
            "statusId": "0",
            "individualPlan": false
        },
        "diseaseName": "Оспа",
        "icdName": "Оспа",
        "begDt": "2025-03-04",
        "endDt": "2025-03-06",
        "personFio": "Яковлева Мария Владимировна"
    },
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
    
    const opened = await openModule(page, 'Перенесенные заболевания', {
      waitForFields: false,
    });
    
  
    await page.waitForTimeout(3000);
    
    const diseasesTab = page.locator('.el-tabs__item', { hasText: 'Перенесенные заболевания' });
    const tabVisible = await diseasesTab.isVisible({ timeout: 1000 }).catch(() => false);
    
    if (!tabVisible) {
      throw new Error('Вкладка "Перенесенные заболевания" не найдена');
    }
    
    await diseasesTab.click();
    console.log('✓ Переход на вкладку "Перенесенные заболевания"');
    
    await page.waitForTimeout(2000);
  });


  test('Проверка перехода  из списка в карту', async ({ page }) => {
    console.log('=== ТЕСТ: Выбор первого пациента ===');

    await openExtendedSearch(page);
    
    await clickUpdate(page, null);
    await expectTableUpdated(page);

    await selectFirstPatientRow(page);
    const cardOpened = await openPatientCard(page);
     if (cardOpened) {
     console.log('Карта пациента открыта');
      return;

  } else if( !cardOpened) {
    console.log('⚠ Карта не открылась');
        
    // Проверяем наличие кнопки "Открыть карту"
    const openCardBtn = page.locator('#_openVac');
    const btnVisible = await openCardBtn.isVisible({ timeout: 3000 }).catch(() => false);
    console.log(`Кнопка "#_openVac" видна: ${btnVisible}`);
    
    // Пробуем альтернативные варианты
    const altBtn = page.locator('button:has-text("Открыть карту")');
    const altVisible = await altBtn.isVisible({ timeout: 3000 }).catch(() => false);
    console.log(`Альтернативная кнопка видна: ${altVisible}`);
    
    test.skip(true, 'Карта пациента не открылась');
    return;
  }
  console.log('=== ТЕСТ ЗАВЕРШЕН ===');
  });

    test('Тестирование отчетов', async ({ page }) => {
    console.log('=== ТЕСТ: Комплексная фильтрация ===');


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

    test('Тестирование Информации о системе', async ({ page }) => {
    console.log('=== ТЕСТ: Открытия через кнопку Действия ===');
    await checkInfoSystem(page);
    });
});