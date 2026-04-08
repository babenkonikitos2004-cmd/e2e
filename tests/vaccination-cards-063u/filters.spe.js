import { test, expect } from '@playwright/test'
import { open063U, clickUpdate, resetFilters, expectTableUpdated } from './helpers'

test.describe('Фильтры модуля 063У', () => {

  test.beforeEach(async ({ page }) => {
    await open063U(page)
  })

  test('Фильтрация по фамилии', async ({ page }) => {
    await page.fill('input[placeholder="Фамилия"]', 'Ивановтест')
    await clickUpdate(page)
    await expectTableUpdated(page)
  })

  test('Фильтрация по имени и отчеству', async ({ page }) => {
    await page.fill('input[placeholder="Имя"]', 'Иван')
    await page.fill('input[placeholder="Отчество"]', 'Иванович')
    await clickUpdate(page)
    await expectTableUpdated(page)
  })

  test('Фильтрация по диапазону года рождения', async ({ page }) => {
    await page.fill('input[placeholder="От"]', '1990')
    await page.fill('input[placeholder="До"]', '2000')
    await clickUpdate(page)
    await expectTableUpdated(page)
  })

  test('Фильтрация по полу (мужчина)', async ({ page }) => {
    await page.selectOption('select[name="gender"]', 'М')
    await clickUpdate(page)
    await expectTableUpdated(page)
  })

  test('Фильтрация по участку', async ({ page }) => {
    await page.selectOption('select[name="uchastok"]', '123')
    await clickUpdate(page)
    await expectTableUpdated(page)
  })

  test('Сброс фильтров очищает поля', async ({ page }) => {
    await resetFilters(page)
    await expect(page.locator('input[placeholder="Фамилия"]')).toHaveValue('')
    await expect(page.locator('input[placeholder="Имя"]')).toHaveValue('')
    await expect(page.locator('input[placeholder="Отчество"]')).toHaveValue('')
  })
})
