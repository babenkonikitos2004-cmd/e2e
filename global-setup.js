import { chromium } from '@playwright/test';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const env = process.env.ENV || 'test';
dotenv.config({ path: `.env.${env}` });

const storageFile = path.join(__dirname, `storageState.${env}.json`);

export default async function globalSetup() {
  console.log('\n🔍 Проверка storageState для ENV=' + env);
  console.log('📦 Путь: ' + storageFile);

  // Проверяем существующий storageState
  if (fs.existsSync(storageFile)) {
    try {
      const content = fs.readFileSync(storageFile, 'utf-8');
      const parsed = JSON.parse(content);
      
      if (parsed.cookies && parsed.cookies.length > 0) {
        console.log('✅ storageState уже существует и валиден');
        console.log(`   Найдено cookies: ${parsed.cookies.length}`);
        return;
      }
    } catch (error) {
      console.log('⚠️  Ошибка чтения storageState:', error.message);
    }
  }

  console.log('⚠️  storageState отсутствует или пустой, создаём новый');
  console.log('🔐 Создаём новый storageState...');

  const browser = await chromium.launch({ 
    headless: false,
    timeout: 60000 
  });
  
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
  });
  
  const page = await context.newPage();

  try {
    const baseUrl = process.env.BASE_URL;
    const login = process.env.LOGIN;
    const password = process.env.PASSWORD;

    console.log('🌐 URL:', baseUrl);
    console.log('👤 Пользователь:', login);

    const loginUrl = `${baseUrl}/#/login`;
    console.log('📍 Открываем:', loginUrl);
    
    await page.goto(loginUrl, { 
      waitUntil: 'domcontentloaded', 
      timeout: 30000 
    });
    
    await page.waitForTimeout(2000);

    // Определяем тип формы
    const testLoginInput = page.locator('.login-input-login input');
    const devLoginInput = page.locator('#textlogin');

    const isTestForm = await testLoginInput.isVisible({ timeout: 3000 }).catch(() => false);
    const isDevForm = await devLoginInput.isVisible({ timeout: 3000 }).catch(() => false);

    if (isTestForm) {
      console.log('✓ Обнаружена форма TEST окружения');
      
      await page.waitForSelector('.login-input-login input', { timeout: 10000 });
      console.log('✓ Форма логина загружена');

      await page.locator('.login-input-login input').fill(login);
      console.log('✓ Логин заполнен');

      await page.locator('.login-input-password input').fill(password);
      console.log('✓ Пароль заполнен');

      // ← КРИТИЧНО: Слушаем навигацию ДО клика
      const navigationPromise = page.waitForNavigation({ 
        timeout: 30000,
        waitUntil: 'domcontentloaded' 
      }).catch(() => null);

      await page.locator('#EnterBtnAuthFormEmis').click();
      console.log('✓ Нажата кнопка входа');

      // Ждем навигации
      await navigationPromise;
      await page.waitForTimeout(3000);

      // Проверяем успешную авторизацию (несколько вариантов)
      const dialogVisible = await page.locator('#EmisFrameSelectArmDialog')
        .isVisible({ timeout: 10000 })
        .catch(() => false);
      
      const tableVisible = await page.locator('#SelectArmInfo .el-table__body')
        .isVisible({ timeout: 10000 })
        .catch(() => false);
      
      if (dialogVisible || tableVisible) {
        console.log('✓ Авторизация успешна');
      } else {
        // Проверяем что URL изменился
        const currentUrl = page.url();
        if (!currentUrl.includes('/login')) {
          console.log('✓ Авторизация успешна (по URL)');
        } else {
          throw new Error('Авторизация не прошла');
        }
      }

    } else if (isDevForm) {
      console.log('✓ Обнаружена форма DEV окружения');
      
      await page.locator('#textlogin').fill(login);
      console.log('✓ Логин заполнен');

      await page.locator('#passwordpassword').fill(password);
      console.log('✓ Пароль заполнен');

      // ← КРИТИЧНО: Слушаем навигацию ДО клика
      const navigationPromise = page.waitForNavigation({ 
        timeout: 30000,
        waitUntil: 'domcontentloaded' 
      }).catch(() => null);

      await page.locator('button:has-text("Войти")').click();
      console.log('✓ Нажата кнопка входа');

      await navigationPromise;
      await page.waitForTimeout(3000);

      const tableVisible = await page.locator('#SelectArmInfo .el-table__body')
        .isVisible({ timeout: 10000 })
        .catch(() => false);
      
      if (tableVisible) {
        console.log('✓ Авторизация успешна');
      } else {
        const currentUrl = page.url();
        if (!currentUrl.includes('/login')) {
          console.log('✓ Авторизация успешна (по URL)');
        } else {
          throw new Error('Авторизация не прошла');
        }
      }

    } else {
      throw new Error('Форма авторизации не найдена');
    }

    await page.waitForTimeout(2000);

    // Сохраняем storageState
    const storageState = await context.storageState();
    fs.writeFileSync(storageFile, JSON.stringify(storageState, null, 2));
    
    console.log('✅ storageState сохранён:', storageFile);
    console.log(`📊 Cookies: ${storageState.cookies.length}`);

  } catch (error) {
    console.log('❌ Ошибка при создании storageState:', error.message);
    
    // Делаем скриншот только если страница жива
    try {
      if (!page.isClosed()) {
        await page.screenshot({ 
          path: `error-global-setup-${Date.now()}.png`,
          fullPage: true 
        });
        console.log('📸 Скриншот сохранен для анализа');
      } else {
        console.log('⚠️  Страница закрыта, скриншот невозможен');
      }
    } catch (screenshotError) {
      console.log('⚠️  Не удалось сделать скриншот');
    }
    
    throw error;
    
  } finally {
    try {
      await browser.close();
      console.log('🔒 Браузер закрыт');
    } catch (closeError) {
      console.log('⚠️  Браузер уже закрыт');
    }
  }
}