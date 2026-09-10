import { test, expect } from '@playwright/test'
import { passages, topicPassages } from '../src/passages'

const sceneUrl = (scene: Record<string, unknown>, id?: string) =>
  '/?scene=' + encodeURIComponent(JSON.stringify(scene)) + (id ? '&passage=' + id : '')

test('reading preserves the scene, guide, and focus while the sky remains interactive', async ({
  page,
}) => {
  await page.goto(sceneUrl({ lesson: 1, sun: 32, moon: 128, step: 1 }))
  const link = page.locator('.guide-card .passage-link')
  await link.click()
  const reader = page.getByRole('dialog', { name: 'Vedic passage reader' })
  await expect(reader.getByRole('heading', { name: 'The Moon’s renewal' })).toBeVisible()
  await expect(reader.locator('.vedic-text')).toContainText('नवो॑नवो')
  await expect(page.getByRole('spinbutton', { name: 'Sun longitude exact value' })).toHaveValue(
    '32',
  )
  await expect(page.getByRole('spinbutton', { name: 'Moon longitude exact value' })).toHaveValue(
    '128',
  )
  const moon = page.getByRole('slider', { name: 'Moon longitude on diagram', exact: true })
  await moon.focus()
  await page.keyboard.press('ArrowRight')
  await expect(page.getByRole('spinbutton', { name: 'Moon longitude exact value' })).toHaveValue(
    '129',
  )
  await expect(reader.getByRole('heading', { name: 'The Moon’s renewal' })).toBeVisible()
  await reader.getByRole('button', { name: /62 phase cycles/ }).click()
  await expect(reader.locator('.vedic-text')).toHaveAttribute('data-accented', 'false')
  await page.keyboard.press('Escape')
  await expect(reader).toHaveCount(0)
  await expect(page.locator('.guide-card h2')).toHaveText('Tithi boundaries')
  await expect(link).toBeFocused()
})

test('the selected station opens its own passage and returns to the station details', async ({
  page,
}) => {
  await page.goto(sceneUrl({ lesson: 2, moon: 45, sun: 12 }))
  const link = page.locator('.lesson-details .passage-link')
  await link.scrollIntoViewIfNeeded()
  const before = await page.evaluate(() => window.scrollY)
  await link.click()
  const reader = page.locator('.passage-reader')
  await expect(reader.getByRole('heading', { name: 'Rohiṇī and Prajāpati' })).toBeVisible()
  await page.getByRole('slider', { name: 'Moon longitude on diagram', exact: true }).focus()
  await page.keyboard.press('Shift+ArrowRight')
  await expect(reader.getByRole('heading', { name: 'Rohiṇī and Prajāpati' })).toBeVisible()
  await reader.getByRole('button', { name: 'Close passage and return to exploration' }).click()
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeCloseTo(before, 0)
})

test('all eight texts use the bundled Vedic font without system-font fallback or clipped words', async ({
  page,
  context,
}) => {
  const cdp = await context.newCDPSession(page)
  await cdp.send('DOM.enable')
  await cdp.send('CSS.enable')
  for (const p of passages) {
    const lesson = topicPassages.findIndex((ids) => ids.includes(p.id))
    await page.goto(sceneUrl({ lesson }, p.id))
    const text = page.locator('.vedic-text')
    await expect(text).toHaveText(p.sanskrit)
    const { root } = await cdp.send('DOM.getDocument')
    const { nodeId } = await cdp.send('DOM.querySelector', {
      nodeId: root.nodeId,
      selector: '.vedic-text',
    })
    const { fonts } = await cdp.send('CSS.getPlatformFontsForNode', { nodeId })
    expect(fonts.length, p.id).toBeGreaterThan(0)
    expect(
      fonts.every((font) => font.isCustomFont && font.postScriptName === 'Shobhika-Regular'),
      p.id,
    ).toBe(true)
    const shape = await text.evaluate((el) => {
      const style = getComputedStyle(el)
      return {
        width: el.clientWidth,
        content: el.scrollWidth,
        size: parseFloat(style.fontSize),
        height: parseFloat(style.lineHeight),
        decoration: style.textDecorationLine,
        spacing: style.letterSpacing,
      }
    })
    expect(shape.content, p.id).toBeLessThanOrEqual(shape.width)
    expect(shape.height / shape.size, p.id).toBeGreaterThanOrEqual(2)
    expect(shape.decoration).toBe('none')
    expect(shape.spacing).toBe('normal')
  }
})

test('mobile reading is modal, handles all texts, and restores background scrolling', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto(sceneUrl({ lesson: 2, moon: 32 }, 'ts-krittika'))
  const reader = page.locator('.passage-reader')
  await expect(reader).toBeVisible()
  expect(await reader.evaluate((el) => el.matches(':modal'))).toBe(true)
  expect(await page.evaluate(() => getComputedStyle(document.body).overflow)).toBe('hidden')
  // Exercise narrow line wrapping for every quotation, including the long prose formula.
  for (const p of passages) {
    await page.goto(sceneUrl({ lesson: 2 }, p.id))
    await expect(page.locator('.vedic-text')).toHaveText(p.sanskrit)
    expect(
      await page.locator('.vedic-text').evaluate((el) => el.scrollWidth <= el.clientWidth),
      p.id,
    ).toBe(true)
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390)
  }
  await page.getByRole('button', { name: 'Close passage and return to exploration' }).click()
  await expect(reader).toHaveCount(0)
  expect(await page.evaluate(() => getComputedStyle(document.body).overflow)).not.toBe('hidden')
  expect(new URL(page.url()).searchParams.has('passage')).toBe(false)
  await expect(page.getByRole('spinbutton', { name: 'Moon longitude exact value' })).toHaveValue(
    '128',
  )
})

test('opening pauses motion and copying a view restores the passage with its scene', async ({
  page,
  context,
}) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'])
  await page.goto(sceneUrl({ lesson: 3, day: 12, sun: 12, moon: 160 }))
  await page.getByRole('button', { name: 'Play', exact: true }).click()
  await page.locator('.guide-card .passage-link').click()
  await expect(page.getByRole('button', { name: 'Play', exact: true })).toBeVisible()
  const day = await page
    .getByRole('spinbutton', { name: 'Days since an imagined new Moon exact value' })
    .inputValue()
  await page.getByRole('button', { name: 'Copy this view', exact: true }).click()
  const url = await page.evaluate(() => navigator.clipboard.readText())
  expect(new URL(url).searchParams.get('passage')).toBe('vj-months')
  await page.goto(url)
  await expect(page.locator('.passage-reader h2')).toHaveText(
    '62 phase cycles, 67 stellar circuits',
  )
  await expect(
    page.getByRole('spinbutton', { name: 'Days since an imagined new Moon exact value' }),
  ).toHaveValue(day)
  await page.goto('/?passage=does-not-exist')
  await expect(page.locator('.passage-reader')).toHaveCount(0)
})

test('a failed font load does not show an unverified fallback rendering', async ({ page }) => {
  await page.route('**/fonts/shobhika-regular.woff2*', (route) => route.abort())
  await page.goto(sceneUrl({ lesson: 2 }, 'ts-rohini'))
  await expect(page.getByText('The Vedic font could not load.')).toBeVisible()
  await expect(page.locator('.vedic-text')).toHaveCount(0)
  await expect(page.getByRole('link', { name: 'Read the source page' })).toBeVisible()
  await page.unroute('**/fonts/shobhika-regular.woff2*')
  await page.getByRole('button', { name: 'Retry', exact: true }).click()
  await expect(page.locator('.vedic-text')).toContainText('रोहि॒णी')
})

test('reader accessibility, resizing, and keyboard focus work on desktop and phone', async ({
  page,
}) => {
  const { default: AxeBuilder } = await import('@axe-core/playwright')
  await page.goto(sceneUrl({ lesson: 2 }, 'ts-krittika'))
  await expect(page.locator('.vedic-text')).toBeVisible()
  for (const width of [1440, 390, 1440]) {
    await page.setViewportSize({ width, height: 900 })
    await expect(page.locator('.passage-reader')).toBeVisible()
    expect(await page.locator('.passage-reader').evaluate((el) => el.matches(':modal'))).toBe(
      width < 1001,
    )
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze()
    expect(results.violations, `Reader at ${width}px`).toEqual([])
  }
  await page.keyboard.press('Escape')
  await expect(page.locator('.passage-reader')).toHaveCount(0)
})
