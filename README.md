#Test commita

# Руководство по запуску тестов

## Установка необходимых компонентов

### Вариант 1: Автоматическая установка (рекомендуется)
Запустите файл `install.bat` двойным кликом или из командной строки:
```cmd
.\install.bat
```

### Вариант 2: Ручная установка
1. Установите Node.js (https://nodejs.org/)
2. Установите зависимости проекта:
   ```cmd
   npm install
   ```
3. Установите браузерные драйверы Playwright:
   ```cmd
   npx playwright install
   ```

## Запуск тестов

### Запуск всех тестов
```cmd
npx playwright test
```

### Запуск конкретного теста
```cmd
npx playwright test tests/название-теста.spec.js
```

Примеры:
```cmd
npx playwright test tests/smoke.spec.js
npx playwright test tests/modules.spec.js
npx playwright test tests/063U.spec.js
```

### Запуск тестов в режиме отладки (с открытием браузера)
```cmd
npx playwright test --headed
```

### Запуск тестов с генерацией отчета
```cmd
npx playwright test --reporter=html
$env:ENV="dev"; npx playwright test tests/plan_vaccination.spec.js --headed
```

Отчет будет доступен в папке `playwright-report`.

## Структура проекта тестов
- `tests/` - папка с тестами
- `tests/vaccination-cards-063u/` - тесты для модуля "Карты прививок 063У"
- `tests/vaccination-cards-063u/helpers.js` - вспомогательные функции
- `playwright.config.js` - конфигурация Playwright

## Полезные команды

### Повторная установка браузеров
```cmd
npx playwright install 
```
### Проверка версии Playwright
```cmd  
npx playwright --version 
```

### Генерация кода для теста (запись действий в браузере)
```cmd
npx playwright codegen