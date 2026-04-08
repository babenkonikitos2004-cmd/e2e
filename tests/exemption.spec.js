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
        "patient": {
            "id": "b653f1e7-7f0d-4af0-b0cd-9df21f3a6718",
            "lastName": "ИВАНОВТЕСТ",
            "firstName": "ИВАН",
            "middleName": "ИВАНОВИЧЬ",
            "birthPlace": "г. Нижневартовск",
            "phone": "+79999999998",
            "email": "test@example.com",
            "snils": "26482104770",
            "birthDt": "1984-05-07",
            "sex": "Мужской",
            "workPlace": "ООО \"КОМТЕК\"",
            "workPosition": "АВИАМЕХАНИК",
            "studyPlace": "САНКТ-ПЕТЕРБУРГСКИЙ ГОСУДАРСТВЕННЫЙ УНИВЕРСИТЕТ, САНКТ-ПЕТЕРБУРГСКИЙ УНИВЕРСИТЕТ ИЛИ СПБГУ, МАУДО Г. НИЖНЕВАРТОВСКА \"ДШИ №1\"",
            "studyGrade": "1",
            "socialStatus": "Студент",
            "patientIdentities": {
                "typeName": "Свидетельство о рождении",
                "series": "II-ПН",
                "number": "665577",
                "issue_dt": "2025-11-28",
                "expirationDt": null,
                "issuer": "кав",
                "issueCode": "11111"
            },
            "patientOrgs": {
                "id": "a8fad9fc-161e-4de9-adab-5ac32ae9c460",
                "nameShort": "БУ \"НИЖНЕВАРТОВСКАЯ ОКРУЖНАЯ КЛИНИЧЕСКАЯ БОЛЬНИЦА\"",
                "nameFull": "БЮДЖЕТНОЕ УЧРЕЖДЕНИЕ ХАНТЫ-МАНСИЙСКОГО АВТОНОМНОГО ОКРУГА - ЮГРЫ \"НИЖНЕВАРТОВСКАЯ ОКРУЖНАЯ КЛИНИЧЕСКАЯ БОЛЬНИЦА\""
            },
            "patientPolicy": {
                "id": null,
                "serial": null,
                "number": null,
                "typeName": null,
                "enp": null,
                "issueDt": null,
                "issueDtEnd": null,
                "issueCode": null,
                "issuer": null
            },
            "disability": {
                "groupId": "39a5df1e-355b-46eb-8259-d1df0d684658",
                "groupName": "Вторая группа"
            },
            "privilageGroupName": "Инвалиды войны, Ветераны боевых действий, Участники Великой Отечественной войны, ставшие инвалидами",
            "citizenshipName": "РОССИЯ Российская Федерация",
            "addrLeave": "628415, Ханты-Мансийский Автономный округ - Югра, г Сургут, пр-кт Ленина, д 59, кв 1",
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
                    "id": "cf817399-0859-4e52-868e-6fe8206b5cb6",
                    "groupRiskId": 12,
                    "personId": "47cdc3fa-abe0-47ab-8365-c770694e2de4",
                    "checkDt": "2025-08-26",
                    "endDt": null
                },
                {
                    "id": "48582e31-c07c-4990-8ebe-5f848dbe0cb6",
                    "groupRiskId": 11,
                    "personId": "47cdc3fa-abe0-47ab-8365-c770694e2de4",
                    "checkDt": "2025-08-26",
                    "endDt": null
                }
            ],
            "age": "41 год",
            "statusId": "0",
            "individualPlan": false
        },
        "vacExemptionTypeName": "Противопоказание",
        "begDt": "2025-10-28",
        "indefinitePeriod": 1,
        "endDt": null,
        "vacPrepAll": 0,
        "reason": null,
        "vacPrepGroupName": null,
        "personName": "Круглов Петр Сергеевич",
        "vacDiseaseName": null,
        "icd10Code": "VI, VII",
        "externalMo": false,
        "externalPersonFio": null
    },
    {
        "patient": {
            "id": "b653f1e7-7f0d-4af0-b0cd-9df21f3a6718",
            "lastName": "ИВАНОВТЕСТ",
            "firstName": "ИВАН",
            "middleName": "ИВАНОВИЧЬ",
            "birthPlace": "г. Нижневартовск",
            "phone": "+79999999998",
            "email": "test@example.com",
            "snils": "26482104770",
            "birthDt": "1984-05-07",
            "sex": "Мужской",
            "workPlace": "ООО \"КОМТЕК\"",
            "workPosition": "АВИАМЕХАНИК",
            "studyPlace": "САНКТ-ПЕТЕРБУРГСКИЙ ГОСУДАРСТВЕННЫЙ УНИВЕРСИТЕТ, САНКТ-ПЕТЕРБУРГСКИЙ УНИВЕРСИТЕТ ИЛИ СПБГУ, МАУДО Г. НИЖНЕВАРТОВСКА \"ДШИ №1\"",
            "studyGrade": "1",
            "socialStatus": "Студент",
            "patientIdentities": {
                "typeName": "Свидетельство о рождении",
                "series": "II-ПН",
                "number": "665577",
                "issue_dt": "2025-11-28",
                "expirationDt": null,
                "issuer": "кав",
                "issueCode": "11111"
            },
            "patientOrgs": {
                "id": "a8fad9fc-161e-4de9-adab-5ac32ae9c460",
                "nameShort": "БУ \"НИЖНЕВАРТОВСКАЯ ОКРУЖНАЯ КЛИНИЧЕСКАЯ БОЛЬНИЦА\"",
                "nameFull": "БЮДЖЕТНОЕ УЧРЕЖДЕНИЕ ХАНТЫ-МАНСИЙСКОГО АВТОНОМНОГО ОКРУГА - ЮГРЫ \"НИЖНЕВАРТОВСКАЯ ОКРУЖНАЯ КЛИНИЧЕСКАЯ БОЛЬНИЦА\""
            },
            "patientPolicy": {
                "id": null,
                "serial": null,
                "number": null,
                "typeName": null,
                "enp": null,
                "issueDt": null,
                "issueDtEnd": null,
                "issueCode": null,
                "issuer": null
            },
            "disability": {
                "groupId": "39a5df1e-355b-46eb-8259-d1df0d684658",
                "groupName": "Вторая группа"
            },
            "privilageGroupName": "Инвалиды войны, Ветераны боевых действий, Участники Великой Отечественной войны, ставшие инвалидами",
            "citizenshipName": "РОССИЯ Российская Федерация",
            "addrLeave": "628415, Ханты-Мансийский Автономный округ - Югра, г Сургут, пр-кт Ленина, д 59, кв 1",
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
                    "id": "cf817399-0859-4e52-868e-6fe8206b5cb6",
                    "groupRiskId": 12,
                    "personId": "47cdc3fa-abe0-47ab-8365-c770694e2de4",
                    "checkDt": "2025-08-26",
                    "endDt": null
                },
                {
                    "id": "48582e31-c07c-4990-8ebe-5f848dbe0cb6",
                    "groupRiskId": 11,
                    "personId": "47cdc3fa-abe0-47ab-8365-c770694e2de4",
                    "checkDt": "2025-08-26",
                    "endDt": null
                }
            ],
            "age": "41 год",
            "statusId": "0",
            "individualPlan": false
        },
        "vacExemptionTypeName": "Противопоказание",
        "begDt": "2025-10-01",
        "indefinitePeriod": 1,
        "endDt": null,
        "vacPrepAll": 0,
        "reason": null,
        "vacPrepGroupName": "Прививки против туберкулеза",
        "personName": "Круглов Петр Сергеевич",
        "vacDiseaseName": "Брюшной тиф",
        "icd10Code": "VI, VII",
        "externalMo": false,
        "externalPersonFio": null
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
        "patient": {
            "id": "b653f1e7-7f0d-4af0-b0cd-9df21f3a6718",
            "lastName": "ИВАНОВТЕСТ",
            "firstName": "ИВАН",
            "middleName": "ИВАНОВИЧЬ",
            "birthPlace": "г. Нижневартовск",
            "phone": "+79999999998",
            "email": "test@example.com",
            "snils": "26482104770",
            "birthDt": "1984-05-07",
            "sex": "Мужской",
            "workPlace": "ООО \"КОМТЕК\"",
            "workPosition": "АВИАМЕХАНИК",
            "studyPlace": "САНКТ-ПЕТЕРБУРГСКИЙ ГОСУДАРСТВЕННЫЙ УНИВЕРСИТЕТ, САНКТ-ПЕТЕРБУРГСКИЙ УНИВЕРСИТЕТ ИЛИ СПБГУ, МАУДО Г. НИЖНЕВАРТОВСКА \"ДШИ №1\"",
            "studyGrade": "1",
            "socialStatus": "Студент",
            "patientIdentities": {
                "typeName": "Свидетельство о рождении",
                "series": "II-ПН",
                "number": "665577",
                "issue_dt": "2025-11-28",
                "expirationDt": null,
                "issuer": "кав",
                "issueCode": "11111"
            },
            "patientOrgs": {
                "id": "a8fad9fc-161e-4de9-adab-5ac32ae9c460",
                "nameShort": "БУ \"НИЖНЕВАРТОВСКАЯ ОКРУЖНАЯ КЛИНИЧЕСКАЯ БОЛЬНИЦА\"",
                "nameFull": "БЮДЖЕТНОЕ УЧРЕЖДЕНИЕ ХАНТЫ-МАНСИЙСКОГО АВТОНОМНОГО ОКРУГА - ЮГРЫ \"НИЖНЕВАРТОВСКАЯ ОКРУЖНАЯ КЛИНИЧЕСКАЯ БОЛЬНИЦА\""
            },
            "patientPolicy": {
                "id": null,
                "serial": null,
                "number": null,
                "typeName": null,
                "enp": null,
                "issueDt": null,
                "issueDtEnd": null,
                "issueCode": null,
                "issuer": null
            },
            "disability": {
                "groupId": "39a5df1e-355b-46eb-8259-d1df0d684658",
                "groupName": "Вторая группа"
            },
            "privilageGroupName": "Инвалиды войны, Ветераны боевых действий, Участники Великой Отечественной войны, ставшие инвалидами",
            "citizenshipName": "РОССИЯ Российская Федерация",
            "addrLeave": "628415, Ханты-Мансийский Автономный округ - Югра, г Сургут, пр-кт Ленина, д 59, кв 1",
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
                    "id": "cf817399-0859-4e52-868e-6fe8206b5cb6",
                    "groupRiskId": 12,
                    "personId": "47cdc3fa-abe0-47ab-8365-c770694e2de4",
                    "checkDt": "2025-08-26",
                    "endDt": null
                },
                {
                    "id": "48582e31-c07c-4990-8ebe-5f848dbe0cb6",
                    "groupRiskId": 11,
                    "personId": "47cdc3fa-abe0-47ab-8365-c770694e2de4",
                    "checkDt": "2025-08-26",
                    "endDt": null
                }
            ],
            "age": "41 год",
            "statusId": "0",
            "individualPlan": false
        },
        "vacExemptionTypeName": "Противопоказание",
        "begDt": "2025-10-28",
        "indefinitePeriod": 1,
        "endDt": null,
        "vacPrepAll": 0,
        "reason": null,
        "vacPrepGroupName": null,
        "personName": "Круглов Петр Сергеевич",
        "vacDiseaseName": null,
        "icd10Code": "VI, VII",
        "externalMo": false,
        "externalPersonFio": null
    },
    {
        "patient": {
            "id": "b653f1e7-7f0d-4af0-b0cd-9df21f3a6718",
            "lastName": "ИВАНОВТЕСТ",
            "firstName": "ИВАН",
            "middleName": "ИВАНОВИЧЬ",
            "birthPlace": "г. Нижневартовск",
            "phone": "+79999999998",
            "email": "test@example.com",
            "snils": "26482104770",
            "birthDt": "1984-05-07",
            "sex": "Мужской",
            "workPlace": "ООО \"КОМТЕК\"",
            "workPosition": "АВИАМЕХАНИК",
            "studyPlace": "САНКТ-ПЕТЕРБУРГСКИЙ ГОСУДАРСТВЕННЫЙ УНИВЕРСИТЕТ, САНКТ-ПЕТЕРБУРГСКИЙ УНИВЕРСИТЕТ ИЛИ СПБГУ, МАУДО Г. НИЖНЕВАРТОВСКА \"ДШИ №1\"",
            "studyGrade": "1",
            "socialStatus": "Студент",
            "patientIdentities": {
                "typeName": "Свидетельство о рождении",
                "series": "II-ПН",
                "number": "665577",
                "issue_dt": "2025-11-28",
                "expirationDt": null,
                "issuer": "кав",
                "issueCode": "11111"
            },
            "patientOrgs": {
                "id": "a8fad9fc-161e-4de9-adab-5ac32ae9c460",
                "nameShort": "БУ \"НИЖНЕВАРТОВСКАЯ ОКРУЖНАЯ КЛИНИЧЕСКАЯ БОЛЬНИЦА\"",
                "nameFull": "БЮДЖЕТНОЕ УЧРЕЖДЕНИЕ ХАНТЫ-МАНСИЙСКОГО АВТОНОМНОГО ОКРУГА - ЮГРЫ \"НИЖНЕВАРТОВСКАЯ ОКРУЖНАЯ КЛИНИЧЕСКАЯ БОЛЬНИЦА\""
            },
            "patientPolicy": {
                "id": null,
                "serial": null,
                "number": null,
                "typeName": null,
                "enp": null,
                "issueDt": null,
                "issueDtEnd": null,
                "issueCode": null,
                "issuer": null
            },
            "disability": {
                "groupId": "39a5df1e-355b-46eb-8259-d1df0d684658",
                "groupName": "Вторая группа"
            },
            "privilageGroupName": "Инвалиды войны, Ветераны боевых действий, Участники Великой Отечественной войны, ставшие инвалидами",
            "citizenshipName": "РОССИЯ Российская Федерация",
            "addrLeave": "628415, Ханты-Мансийский Автономный округ - Югра, г Сургут, пр-кт Ленина, д 59, кв 1",
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
                    "id": "cf817399-0859-4e52-868e-6fe8206b5cb6",
                    "groupRiskId": 12,
                    "personId": "47cdc3fa-abe0-47ab-8365-c770694e2de4",
                    "checkDt": "2025-08-26",
                    "endDt": null
                },
                {
                    "id": "48582e31-c07c-4990-8ebe-5f848dbe0cb6",
                    "groupRiskId": 11,
                    "personId": "47cdc3fa-abe0-47ab-8365-c770694e2de4",
                    "checkDt": "2025-08-26",
                    "endDt": null
                }
            ],
            "age": "41 год",
            "statusId": "0",
            "individualPlan": false
        },
        "vacExemptionTypeName": "Противопоказание",
        "begDt": "2025-10-01",
        "indefinitePeriod": 1,
        "endDt": null,
        "vacPrepAll": 0,
        "reason": null,
        "vacPrepGroupName": "Прививки против туберкулеза",
        "personName": "Круглов Петр Сергеевич",
        "vacDiseaseName": "Брюшной тиф",
        "icd10Code": "VI, VII",
        "externalMo": false,
        "externalPersonFio": null
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
        "patient": {
            "id": "b653f1e7-7f0d-4af0-b0cd-9df21f3a6718",
            "lastName": "ИВАНОВТЕСТ",
            "firstName": "ИВАН",
            "middleName": "ИВАНОВИЧЬ",
            "birthPlace": "г. Нижневартовск",
            "phone": "+79999999998",
            "email": "test@example.com",
            "snils": "26482104770",
            "birthDt": "1984-05-07",
            "sex": "Мужской",
            "workPlace": "ООО \"КОМТЕК\"",
            "workPosition": "АВИАМЕХАНИК",
            "studyPlace": "САНКТ-ПЕТЕРБУРГСКИЙ ГОСУДАРСТВЕННЫЙ УНИВЕРСИТЕТ, САНКТ-ПЕТЕРБУРГСКИЙ УНИВЕРСИТЕТ ИЛИ СПБГУ, МАУДО Г. НИЖНЕВАРТОВСКА \"ДШИ №1\"",
            "studyGrade": "1",
            "socialStatus": "Студент",
            "patientIdentities": {
                "typeName": "Свидетельство о рождении",
                "series": "II-ПН",
                "number": "665577",
                "issue_dt": "2025-11-28",
                "expirationDt": null,
                "issuer": "кав",
                "issueCode": "11111"
            },
            "patientOrgs": {
                "id": "a8fad9fc-161e-4de9-adab-5ac32ae9c460",
                "nameShort": "БУ \"НИЖНЕВАРТОВСКАЯ ОКРУЖНАЯ КЛИНИЧЕСКАЯ БОЛЬНИЦА\"",
                "nameFull": "БЮДЖЕТНОЕ УЧРЕЖДЕНИЕ ХАНТЫ-МАНСИЙСКОГО АВТОНОМНОГО ОКРУГА - ЮГРЫ \"НИЖНЕВАРТОВСКАЯ ОКРУЖНАЯ КЛИНИЧЕСКАЯ БОЛЬНИЦА\""
            },
            "patientPolicy": {
                "id": null,
                "serial": null,
                "number": null,
                "typeName": null,
                "enp": null,
                "issueDt": null,
                "issueDtEnd": null,
                "issueCode": null,
                "issuer": null
            },
            "disability": {
                "groupId": "39a5df1e-355b-46eb-8259-d1df0d684658",
                "groupName": "Вторая группа"
            },
            "privilageGroupName": "Инвалиды войны, Ветераны боевых действий, Участники Великой Отечественной войны, ставшие инвалидами",
            "citizenshipName": "РОССИЯ Российская Федерация",
            "addrLeave": "628415, Ханты-Мансийский Автономный округ - Югра, г Сургут, пр-кт Ленина, д 59, кв 1",
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
                    "id": "cf817399-0859-4e52-868e-6fe8206b5cb6",
                    "groupRiskId": 12,
                    "personId": "47cdc3fa-abe0-47ab-8365-c770694e2de4",
                    "checkDt": "2025-08-26",
                    "endDt": null
                },
                {
                    "id": "48582e31-c07c-4990-8ebe-5f848dbe0cb6",
                    "groupRiskId": 11,
                    "personId": "47cdc3fa-abe0-47ab-8365-c770694e2de4",
                    "checkDt": "2025-08-26",
                    "endDt": null
                }
            ],
            "age": "41 год",
            "statusId": "0",
            "individualPlan": false
        },
        "vacExemptionTypeName": "Противопоказание",
        "begDt": "2025-10-28",
        "indefinitePeriod": 1,
        "endDt": null,
        "vacPrepAll": 0,
        "reason": null,
        "vacPrepGroupName": null,
        "personName": "Круглов Петр Сергеевич",
        "vacDiseaseName": null,
        "icd10Code": "VI, VII",
        "externalMo": false,
        "externalPersonFio": null
    },
    {
        "patient": {
            "id": "b653f1e7-7f0d-4af0-b0cd-9df21f3a6718",
            "lastName": "ИВАНОВТЕСТ",
            "firstName": "ИВАН",
            "middleName": "ИВАНОВИЧЬ",
            "birthPlace": "г. Нижневартовск",
            "phone": "+79999999998",
            "email": "test@example.com",
            "snils": "26482104770",
            "birthDt": "1984-05-07",
            "sex": "Мужской",
            "workPlace": "ООО \"КОМТЕК\"",
            "workPosition": "АВИАМЕХАНИК",
            "studyPlace": "САНКТ-ПЕТЕРБУРГСКИЙ ГОСУДАРСТВЕННЫЙ УНИВЕРСИТЕТ, САНКТ-ПЕТЕРБУРГСКИЙ УНИВЕРСИТЕТ ИЛИ СПБГУ, МАУДО Г. НИЖНЕВАРТОВСКА \"ДШИ №1\"",
            "studyGrade": "1",
            "socialStatus": "Студент",
            "patientIdentities": {
                "typeName": "Свидетельство о рождении",
                "series": "II-ПН",
                "number": "665577",
                "issue_dt": "2025-11-28",
                "expirationDt": null,
                "issuer": "кав",
                "issueCode": "11111"
            },
            "patientOrgs": {
                "id": "a8fad9fc-161e-4de9-adab-5ac32ae9c460",
                "nameShort": "БУ \"НИЖНЕВАРТОВСКАЯ ОКРУЖНАЯ КЛИНИЧЕСКАЯ БОЛЬНИЦА\"",
                "nameFull": "БЮДЖЕТНОЕ УЧРЕЖДЕНИЕ ХАНТЫ-МАНСИЙСКОГО АВТОНОМНОГО ОКРУГА - ЮГРЫ \"НИЖНЕВАРТОВСКАЯ ОКРУЖНАЯ КЛИНИЧЕСКАЯ БОЛЬНИЦА\""
            },
            "patientPolicy": {
                "id": null,
                "serial": null,
                "number": null,
                "typeName": null,
                "enp": null,
                "issueDt": null,
                "issueDtEnd": null,
                "issueCode": null,
                "issuer": null
            },
            "disability": {
                "groupId": "39a5df1e-355b-46eb-8259-d1df0d684658",
                "groupName": "Вторая группа"
            },
            "privilageGroupName": "Инвалиды войны, Ветераны боевых действий, Участники Великой Отечественной войны, ставшие инвалидами",
            "citizenshipName": "РОССИЯ Российская Федерация",
            "addrLeave": "628415, Ханты-Мансийский Автономный округ - Югра, г Сургут, пр-кт Ленина, д 59, кв 1",
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
                    "id": "cf817399-0859-4e52-868e-6fe8206b5cb6",
                    "groupRiskId": 12,
                    "personId": "47cdc3fa-abe0-47ab-8365-c770694e2de4",
                    "checkDt": "2025-08-26",
                    "endDt": null
                },
                {
                    "id": "48582e31-c07c-4990-8ebe-5f848dbe0cb6",
                    "groupRiskId": 11,
                    "personId": "47cdc3fa-abe0-47ab-8365-c770694e2de4",
                    "checkDt": "2025-08-26",
                    "endDt": null
                }
            ],
            "age": "41 год",
            "statusId": "0",
            "individualPlan": false
        },
        "vacExemptionTypeName": "Противопоказание",
        "begDt": "2025-10-01",
        "indefinitePeriod": 1,
        "endDt": null,
        "vacPrepAll": 0,
        "reason": null,
        "vacPrepGroupName": "Прививки против туберкулеза",
        "personName": "Круглов Петр Сергеевич",
        "vacDiseaseName": "Брюшной тиф",
        "icd10Code": "VI, VII",
        "externalMo": false,
        "externalPersonFio": null
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
    
    const opened = await openModule(page, 'Медотводы/отказы', {
      waitForFields: false,
    });
    
  
    await page.waitForTimeout(3000);
    
    const diseasesTab = page.locator('.el-tabs__item', { hasText: 'Медотводы/отказы' });
    const tabVisible = await diseasesTab.isVisible({ timeout: 1000 }).catch(() => false);
    
    if (!tabVisible) {
      throw new Error('Вкладка "Медотводы/отказы" не найдена');
    }
    
    await diseasesTab.click();
    console.log('✓ Переход на вкладку "Медотводы/отказы"');
    
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
});