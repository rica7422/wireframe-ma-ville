/**
 * Playwright smoke — layout global (build 1001-r)
 * h-scroll flex-shrink + spacing 20/15/25; similares rail; header homes
 */
import { chromium } from 'playwright'
import fs from 'node:fs'
import path from 'node:path'

const BASE = process.env.BASE_URL || 'http://127.0.0.1:4317'
const outDir = path.resolve('artifacts')
const shotDirs = [
  '/opt/cursor/artifacts/screenshots',
  '/cursor/stores/bc-62a66aae-7ddf-4f7d-bfef-8741542e3a40/media',
  outDir,
]
for (const d of shotDirs) fs.mkdirSync(d, { recursive: true })

const results = []
function check(name, ok, detail = '') {
  results.push({ name, ok: !!ok, detail: String(detail).slice(0, 480) })
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? ' — ' + detail : ''}`)
}

const pageErrors = []

const browser = await chromium.launch({
  executablePath: '/usr/local/bin/google-chrome',
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
})
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })
page.on('pageerror', (err) => pageErrors.push(err?.message || String(err)))
page.on('console', (msg) => {
  if (msg.type() === 'error') pageErrors.push(msg.text())
})

async function gotoHash(hash) {
  const h = hash.startsWith('#') ? hash : `#${hash}`
  await page.goto(`${BASE}/?v=${Date.now()}${h}`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(350)
}

async function headerHomesOk() {
  const header = page.locator('.phone-header, .phone-header-full').first()
  const maVille = header.locator('[aria-label="Accueil Ma Ville"]')
  const miasin = header.locator('[aria-label="Accueil MIASIN"]')
  const a = await maVille.count()
  const b = await miasin.count()
  return { ok: a >= 1 && b >= 1, detail: `maVille=${a} miasin=${b}` }
}

async function noEllipsisInFullHeader() {
  const full = page.locator('.phone-header-full, .phone-header:not(.phone-header-local)')
  const count = await full.count()
  if (count === 0) return { ok: true, detail: 'no full header' }
  const ellipsis = full.locator('button').filter({ hasText: '⋯' })
  const n = await ellipsis.count()
  return { ok: n === 0, detail: `ellipsisBtns=${n}` }
}

async function headerOneLineOk() {
  return page.evaluate(() => {
    const header = document.querySelector('.phone-header-full, .phone-header')
    if (!header) return { ok: false, detail: 'no header' }
    const rect = header.getBoundingClientRect()
    const h = Math.round(rect.height)
    // one-line header should stay compact (~40–56px typical)
    const ok = h > 0 && h <= 64
    return { ok, detail: `headerH=${h}` }
  })
}

async function phoneScrollPaddingLeft() {
  return page.evaluate(() => {
    const el = document.querySelector('.phone-scroll')
    if (!el) return { ok: false, detail: 'no .phone-scroll', pl: null }
    const pl = parseFloat(getComputedStyle(el).paddingLeft)
    const ok = Math.abs(pl - 20) <= 1.5
    return { ok, detail: `paddingLeft=${pl}`, pl }
  })
}

async function savePhoneShot(name) {
  const phone = page.locator('.phone')
  const paths = []
  for (const dir of shotDirs) {
    const p = path.join(dir, name)
    await phone.screenshot({ path: p })
    paths.push(p)
  }
  return paths
}

const spacingSpot = {}

try {
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(200)
  check('App opens', (await page.locator('.phone-inner, .phone').count()) > 0)

  const stamp = await page.locator('.proto-tag').textContent().catch(() => '')
  check('Stamp contains 1001-r', /1001-r/.test(stamp || ''), stamp)

  // ——— #annonce-details ———
  await gotoHash('#annonce-details')
  let hash = await page.evaluate(() => location.hash)
  check('On #annonce-details', /annonce-details/.test(hash), hash)

  // Scroll to bottom so similaires is visible
  await page.evaluate(() => {
    const sc = document.querySelector('.phone-scroll')
    if (sc) sc.scrollTop = sc.scrollHeight
  })
  await page.waitForTimeout(250)

  const similairesHeading = page.locator('.phone-scroll').getByText('Annonces similaires', { exact: true })
  check('« Annonces similaires » present', (await similairesHeading.count()) >= 1)

  const similaresVisible = await similairesHeading.first().isVisible().catch(() => false)
  check('« Annonces similaires » visible after scroll', similaresVisible)

  const railMetrics = await page.evaluate(() => {
    const heading =
      [...document.querySelectorAll('.phone-scroll h2.sec, .phone-scroll .sec')].find((el) =>
        /Annonces similaires/i.test(el.textContent || '')
      ) || null
    const secRow = heading?.closest('.sec-row') || heading?.parentElement
    const rail =
      document.querySelector('.similaires-rail') ||
      (secRow?.nextElementSibling?.classList?.contains('h-scroll')
        ? secRow.nextElementSibling
        : null) ||
      heading?.parentElement?.nextElementSibling ||
      document.querySelector('.phone-scroll .h-scroll.similaires-rail, .phone-scroll .similaires-rail, .phone-scroll .h-scroll:last-of-type')
    if (!rail) return { found: false }
    const r = rail.getBoundingClientRect()
    return {
      found: true,
      className: rail.className,
      clientHeight: rail.clientHeight,
      scrollHeight: rail.scrollHeight,
      offsetHeight: rail.offsetHeight,
      width: Math.round(r.width),
      top: Math.round(r.top),
      bottom: Math.round(r.bottom),
      childCount: rail.children.length,
    }
  })
  check(
    '.similaires-rail or .h-scroll near similaires clientHeight >= 80',
    railMetrics.found && railMetrics.clientHeight >= 80,
    JSON.stringify(railMetrics)
  )
  check(
    '.h-scroll under similares not collapsed',
    railMetrics.found && railMetrics.clientHeight >= 80 && railMetrics.scrollHeight >= 80,
    `clientH=${railMetrics.clientHeight} scrollH=${railMetrics.scrollHeight}`
  )

  const toutVoir = page.locator('.phone-scroll').getByRole('button', { name: /Tout voir/i })
  check('Tout voir present', (await toutVoir.count()) >= 1)

  let noEll = await noEllipsisInFullHeader()
  check('NO ⋯ in .phone-header-full (annonce-details)', noEll.ok, noEll.detail)

  let homes = await headerHomesOk()
  check('Homes present in header (annonce-details)', homes.ok, homes.detail)

  const similaresShot = await savePhoneShot('1001-r-annonce-details-similaires.png')
  check(
    'Screenshot similares written',
    similaresShot.every((p) => fs.existsSync(p)),
    similaresShot.join(' | ')
  )

  // Top of annonce-details
  await page.evaluate(() => {
    const sc = document.querySelector('.phone-scroll')
    if (sc) sc.scrollTop = 0
  })
  await page.waitForTimeout(200)
  const topShot = await savePhoneShot('1001-r-annonce-details-top.png')
  check(
    'Screenshot annonce top written',
    topShot.every((p) => fs.existsSync(p)),
    topShot.join(' | ')
  )

  // ——— Spot screens: padding-left ~20 + header one-line ———
  for (const spot of ['mairie-accueil', 'sante-pharmacies', 'evenements-liste']) {
    await gotoHash(`#${spot}`)
    hash = await page.evaluate(() => location.hash)
    check(`On #${spot}`, new RegExp(spot).test(hash), hash)

    const pad = await phoneScrollPaddingLeft()
    spacingSpot[spot] = { paddingLeft: pad.pl, header: null }
    check(`.phone-scroll padding-left ~20 (#${spot})`, pad.ok, pad.detail)

    const oneLine = await headerOneLineOk()
    spacingSpot[spot].header = oneLine.detail
    check(`Header one-line still OK (#${spot})`, oneLine.ok, oneLine.detail)

    homes = await headerHomesOk()
    check(`Homes present (#${spot})`, homes.ok, homes.detail)

    noEll = await noEllipsisInFullHeader()
    check(`NO ⋯ in full header (#${spot})`, noEll.ok, noEll.detail)
  }

  await gotoHash('#mairie-accueil')
  const mairieShot = await savePhoneShot('1001-r-mairie-spacing.png')
  check(
    'Screenshot mairie spacing written',
    mairieShot.every((p) => fs.existsSync(p)),
    mairieShot.join(' | ')
  )

  check('No page errors', pageErrors.length === 0, pageErrors.slice(0, 3).join(' | '))
} catch (err) {
  check('Smoke threw', false, err?.message || String(err))
} finally {
  const passed = results.filter((r) => r.ok).length
  const failed = results.filter((r) => !r.ok).length
  const summary = {
    stamp: '1001-r',
    base: BASE,
    passed,
    failed,
    ok: failed === 0,
    spacingSpot,
    results,
    pageErrors,
    screenshots: [
      '1001-r-annonce-details-similaires.png',
      '1001-r-annonce-details-top.png',
      '1001-r-mairie-spacing.png',
    ],
    at: new Date().toISOString(),
  }
  const jsonPath = path.join(outDir, 'verify-layout-global-1001r.json')
  fs.writeFileSync(jsonPath, JSON.stringify(summary, null, 2))
  console.log(`\nWrote ${jsonPath} — ${passed} passed, ${failed} failed`)
  await browser.close()
  process.exit(failed === 0 ? 0 : 1)
}
