import { test, expect, type Page } from '@playwright/test'

async function open(page: Page, scene: Record<string, unknown> = {}) {
  await page.goto('/?scene=' + encodeURIComponent(JSON.stringify(scene)))
}
async function chapter(page: Page, n: number) {
  await page.locator('.nav-item').nth(n).click()
}
const field = (page: Page, name: string) =>
  page.getByRole('spinbutton', { name: `${name} exact value`, exact: true })

test('longitude is draggable, keyboard accessible, and independent of latitude', async ({
  page,
}) => {
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(e.message))
  await open(page)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Geocentric ecliptic longitude')
  await expect(field(page, 'Moon longitude')).toHaveValue('128')
  const coords = await page.locator('.sky-diagram').evaluate((svg: SVGSVGElement) => {
    const m = svg.getScreenCTM()!
    const from = new DOMPoint(
      360 + 195 * Math.cos((128 * Math.PI) / 180),
      315 - 195 * Math.sin((128 * Math.PI) / 180),
    ).matrixTransform(m)
    const to = new DOMPoint(360, 315 + 195).matrixTransform(m)
    return { from: { x: from.x, y: from.y }, to: { x: to.x, y: to.y } }
  })
  await page.mouse.move(coords.from.x, coords.from.y)
  await page.mouse.down()
  await page.mouse.move(coords.to.x, coords.to.y, { steps: 14 })
  await page.mouse.up()
  await expect(field(page, 'Moon longitude')).toHaveValue('270')
  const handle = page.getByRole('slider', { name: 'Moon longitude on diagram', exact: true })
  await handle.focus()
  await page.keyboard.press('ArrowRight')
  await page.keyboard.press('Shift+ArrowRight')
  await expect(field(page, 'Moon longitude')).toHaveValue('281')
  await page.getByRole('button', { name: 'Tilt the plane', exact: true }).click()
  await field(page, 'Moon latitude β').fill('5.1')
  await expect(field(page, 'Moon longitude')).toHaveValue('281')
  await expect(page.locator('.sky-diagram')).toContainText('β = 5.10°')
  expect(errors).toEqual([])
})

test('changing the zero relabels longitudes without changing the phase angle', async ({ page }) => {
  await open(page, { sun: 350, moon: 10 })
  await page.getByRole('button', { name: 'Tropical', exact: true }).click()
  await expect(field(page, 'Sun longitude')).toHaveValue('14')
  await expect(field(page, 'Moon longitude')).toHaveValue('34')
  await expect(page.locator('.readout-strip>div').nth(2)).toContainText('20.0°')
  await page.getByRole('button', { name: 'Sidereal', exact: true }).click()
  await expect(field(page, 'Sun longitude')).toHaveValue('350')
  await expect(field(page, 'Moon longitude')).toHaveValue('10')
  await expect(page.locator('.readout-strip>div').nth(2)).toContainText('20.0°')
  await page.getByRole('button', { name: 'Sun-centered', exact: true }).click()
  await expect(page.locator('.atlas-number')).toContainText('Heliocentric longitude')
  await expect(page.locator('.atlas-number')).toContainText('115.0°')
})

test('tithi uses directed lead and handles the full Moon boundary', async ({ page }) => {
  await open(page, { lesson: 1, sun: 0, moon: 179.9 })
  await expect(page.locator('.live-tithi h2')).toHaveText('Śukla Pūrṇimā')
  await page.getByRole('button', { name: 'Set Full Moon', exact: true }).click()
  await expect(page.locator('.live-tithi h2')).toHaveText('Kṛṣṇa Pratipadā')
  await expect(page.locator('.phase-portrait')).toContainText('Full Moon')
  await page.getByRole('button', { name: 'Set Last quarter', exact: true }).click()
  await expect(page.locator('.readout-strip>div').nth(2)).toContainText('270.0°')
  await expect(page.locator('.live-tithi')).toContainText('50% illuminated')
  await page.getByRole('button', { name: 'Waxing tithi 2, 12 to 24 degrees', exact: true }).click()
  await expect(page.locator('.live-tithi h2')).toHaveText('Śukla Dvitīyā')
  await expect(field(page, 'Moon longitude')).toHaveValue('18')
})

test('stellar index, both grids, pādas, and dasha balance agree', async ({ page }) => {
  await open(page, { lesson: 2 })
  await page.getByRole('textbox', { name: 'Search lunar stations' }).fill('rohini')
  await expect(page.locator('.nakshatra-index button')).toHaveCount(1)
  await page.locator('.nakshatra-index button').click()
  await expect(page.locator('.station-facts')).toContainText('Aldebaran')
  await page.getByRole('button', { name: 'Both', exact: true }).click()
  await expect(page.locator('.sky-diagram .clickable-sector')).toHaveCount(39)
  await page.getByRole('checkbox', { name: 'Show the 108 pādas' }).check()
  await page.locator('.pada-strip button').nth(3).click()
  await expect(page.locator('.pada-strip button').nth(3)).toHaveAttribute('aria-pressed', 'true')
  await page.getByRole('button', { name: 'How the Moon’s position becomes a daśā balance' }).click()
  await expect(page.locator('.dasha-equation')).toContainText('1.25 years')
  await page.getByRole('textbox', { name: 'Search lunar stations' }).fill('zzzz')
  await expect(page.getByText('No matching station. Try a star name, such as Spica.')).toBeVisible()
})

test('sidereal and synodic jumps maintain both synchronized views', async ({ page }) => {
  await open(page, { lesson: 3, sun: 0, moon: 0 })
  await page.getByRole('button', { name: '27.32 d to the stars' }).click()
  await expect(page.locator('.readout-strip>div').nth(1)).toContainText('0.0°')
  await expect(page.locator('.clock-counters>div').first()).toContainText('1.000')
  await page.getByRole('button', { name: '29.53 d to the Sun' }).click()
  await expect(page.locator('.clock-phase')).toContainText('New Moon')
  await expect(page.locator('.clock-counters>div').nth(1)).toContainText('1.000')
  await page.getByRole('button', { name: 'Play' }).click()
  await expect
    .poll(async () => Number(await field(page, 'Days since an imagined new Moon').inputValue()))
    .toBeGreaterThan(29.7)
  await page.getByRole('button', { name: 'Pause' }).click()
  const day = await field(page, 'Days since an imagined new Moon').inputValue()
  await page.getByRole('button', { name: '27.32 d to the stars' }).click()
  expect(Number(day)).toBeGreaterThan(29.7)
})

test('nodes distinguish a new Moon that misses from central alignment', async ({ page }) => {
  await open(page, { lesson: 4, sun: 0, moon: 0, node: 90, tilted: true })
  await expect(page.locator('.takeaway-strip')).toContainText(/Lunar latitude -5\.1[45]°/)
  await field(page, 'Ascending node · Rāhu').fill('0')
  await expect(page.locator('.takeaway-strip')).toContainText('Exact central alignment')
  await page.getByRole('button', { name: 'Set Full Moon', exact: true }).click()
  await expect(page.locator('.takeaway-strip')).toContainText('180.0°')
  await expect(page.locator('.takeaway-strip')).toContainText('Exact central alignment')
  await expect(page.locator('.node-strip')).toBeVisible()
})

test('month names set full Moon and historical layers reveal their sources', async ({ page }) => {
  await open(page, { lesson: 5 })
  await page.getByRole('button', { name: 'Caitra Citrā', exact: true }).click()
  await expect(page.locator('.readout-strip>div').nth(2)).toContainText('180.0°')
  await expect(page.locator('.panchanga-grid article').nth(2)).toContainText('Citrā')
  await page.locator('#historical-map').getByRole('button', { name: 'Historical context' }).click()
  await expect(page.locator('.historical-context')).toContainText('1,830 civil days')
  await expect(page.locator('.historical-context')).toContainText('Āryabhaṭa')
})

test('saved scenes survive reload and the reference dialog closes with Escape', async ({
  page,
}) => {
  await open(page, { lesson: 2, sun: 100, moon: 200, padas: true, grid: 'both' })
  await expect(field(page, 'Moon longitude')).toHaveValue('200')
  await expect
    .poll(() => page.evaluate(() => localStorage.getItem('tara-scene-v1')))
    .toContain('"moon":200')
  await page.goto('/')
  await expect(field(page, 'Sun longitude')).toHaveValue('100')
  await expect(page.getByRole('button', { name: 'Both', exact: true })).toHaveAttribute(
    'aria-pressed',
    'true',
  )
  await page.getByRole('button', { name: 'Notes & sources' }).click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await expect(page.locator('.source-list a')).toHaveCount(8)
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).not.toBeVisible()
})

test('all chapters fit a phone and every guide experiment executes', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(e.message))
  await page.setViewportSize({ width: 390, height: 844 })
  await open(page)
  for (let i = 0; i < 6; i++) {
    await chapter(page, i)
    const count = await page.locator('.step-track button').count()
    for (let j = 0; j < count; j++) {
      await page.locator('.step-track button').nth(j).click()
      await page.locator('.experiment-button').click()
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390)
    await expect(page.locator('h1')).toBeVisible()
  }
  expect(errors).toEqual([])
})

test('copying a view produces a restorable scene URL', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'])
  await open(page, { lesson: 1, sun: 350, moon: 10 })
  await page.getByRole('button', { name: 'Copy this view', exact: true }).click()
  await expect(page.getByRole('button', { name: 'Copied', exact: true })).toBeVisible()
  const link = await page.evaluate(() => navigator.clipboard.readText())
  expect(JSON.parse(new URL(link).searchParams.get('scene')!).moon).toBe(10)
  await page.goto(link)
  await expect(page.locator('.live-tithi h2')).toHaveText('Śukla Dvitīyā')
  await expect(field(page, 'Sun longitude')).toHaveValue('350')
})

test('all six explorations pass automated WCAG A and AA checks', async ({ page }) => {
  const { default: AxeBuilder } = await import('@axe-core/playwright')
  for (let lesson = 0; lesson < 6; lesson++) {
    await open(page, { lesson, grid: 'both', sun: 32, moon: 128, tilted: lesson === 4 })
    const scan = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze()
    expect(scan.violations, `Exploration ${lesson + 1}`).toEqual([])
  }
  await page.getByRole('button', { name: 'Notes & sources' }).click()
  const scan = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()
  expect(scan.violations, 'Reference dialog').toEqual([])
})
