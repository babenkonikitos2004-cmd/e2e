import { test, expect } from '@playwright/test'
import { open063U, clickUpdate, resetFilters, expectTableUpdated } from './helpers'

test.describe('Сценарии модуля 063У', () => {

  test.beforeEach(async ({ page }) => {
    await open063U(page)
  })

  test('Поиск карты по ФИО и дате рождения', async ({ page }) => {
    await page.fill('input[placeholder="Фамилия"]', 'Иванов')
    await page.fill('input[placeholder="Имя"]', 'Иван')
    await page.fill('input[placeholder="Отчество"]', 'Иванович')
    await page.fill('input[placeholder="Дата рождения"]', '01.01.1995')
    await clickUpdate(page)
    await expectTableUpdated(page)
  })

  test('Сброс фильтров возвращает исходное состояние', async ({ page }) => {
    await page.fill('input[placeholder="Фамилия"]', 'Иванов')
    await page.fill('input[placeholder="Имя"]', 'Иван')
    await clickUpdate(page)
    await resetFilters(page)
    await expect(page.locator('input[placeholder="Фамилия"]')).toHaveValue('')
    await expect(page.locator('input[placeholder="Имя"]')).toHaveValue('')
  })
})
