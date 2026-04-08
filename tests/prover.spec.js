import { test, expect } from '@playwright/test';

test.use({ storageState: undefined });

test('Блокировка и mock ответ', async ({ page }) => {
  
  // Блокируем неправильный запрос
  await page.route('**/nullDiseases', async (route) => {
    console.log(`\n🚫 Заблокирован: ${route.request().url()}`);
    console.log(`✅ Возвращаем mock данные\n`);
    
    // Возвращаем успешный пустой ответ
    route.fulfill({
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
      ]
        
      ),
    });
  });
  
  await page.goto('http://vacemisdev.oblteh:90/');
  await page.waitForTimeout(2000);
  
  await page.locator('.login-input-login input').fill('USER2');
  await page.locator('.login-input-password input').fill('USER2');
  await page.locator('.login-input-password input').press('Enter');
  await page.waitForTimeout(3000);
  
  await page.locator('.el-main').click();
  await page.locator('#emisFieldInput').fill('пер');
  await page.waitForTimeout(1000);
  await page.locator('.cell').first().click();
  await page.locator('#SetBtnSelectArmEmis').click();
  
  console.log('⏳ Ждем 40 секунд...');
  await page.waitForTimeout(40000);
  
  console.log('🔄 Кликаем "Обновить"...');
  await page.locator('#_refresh').click();
  await page.waitForTimeout(3000);
  
  console.log('✅ ГОТОВО - запрос был заблокирован');
});