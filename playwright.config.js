import { defineConfig, devices } from '@playwright/test';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// ES Modules __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ENV
const env = process.env.ENV || 'test';

// Загружаем .env
dotenv.config({ path: `.env.${env}` });

// Файл storage под ENV
const storageFile = path.join(__dirname, `storageState.${env}.json`);

console.log(`\n🚀 Запуск тестов на окружении: ${env.toUpperCase()}`);
console.log(`🌐 BASE_URL: ${process.env.BASE_URL}`);
console.log(`👤 LOGIN: ${process.env.LOGIN}`);
console.log(`📦 STORAGE_STATE: ${storageFile}\n`);

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  timeout: 60000,
  globalSetup: './global-setup.js', // создаёт storage если нет

  use: {
    baseURL: process.env.BASE_URL,
    storageState: storageFile, // <- всегда берём актуальный файл
    headless: false,
    viewport: { width: 1920, height: 1080 },
    launchOptions: {
      args: ['--start-maximized',
        
      ],
    },
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report' }],
  ],

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
     {
      name: 'yandex',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome',
        viewport: { width: 1800, height: 970 },
        launchOptions: {
          executablePath: 'C:\\Users\\Бабенко Никита\\AppData\\Local\\Yandex\\YandexBrowser\\Application\\browser.exe',
          args: ['--start-maximized',
            '--window-size=1920,1080'
          ],
        },
      },
    },
  ],
});
