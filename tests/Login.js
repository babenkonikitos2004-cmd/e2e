import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  // Переход на страницу логина
  await page.goto('https://emis-test.miacugra.ru/#//login');

  // Логинимся
  await page.fill('.login-input-login input', 'USER2');
  await page.fill('.login-input-password input', 'USER2');
  await page.click('#EnterBtnAuthFormEmis');

  // Ждем, пока загрузится главная страница после логина
  await page.waitForURL('**/#/');

  // Сохраняем storageState с токеном и куками
  await page.context().storageState({ path: 'storageState.json' });
await page.goto('chrome-error://chromewebdata/');
await page.getByText('Не удается получить доступ к сайту Веб-страница по адресу chrome://blankhttp//').click();
await page.getByText('Не удается получить доступ к сайту').click();
await page.getByRole('strong').dblclick();

await page.getByRole('strong').dblclick();
await browser.close();


})();
