/**
 * Playwright smoke — en-tête une ligne (build 1001-q)
 * Retour — Titre — Accueil Ma Ville — Accueil MIASIN ; ⋯ in content identity only
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
  results.push({ name, ok: !!ok, detail: String(detail).slice(0, 360) })
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
  await page.waitForTimeout(300)
}

async function appChromeHidden() {
  const n = await page.locator('.app-chrome').count()
  if (n === 0) return { ok: true, detail: 'absent' }
  const visible = await page.locator('.app-chrome').evaluateAll((els) =>
    els.map((el) => {
      const cs = getComputedStyle(el)
      return {
        display: cs.display,
        visibility: cs.visibility,
        empty: !(el.textContent || '').trim() && !el.children.length,
      }
    })
  )
  const ok = visible.every((v) => v.display === 'none' || v.visibility === 'hidden' || v.empty)
  return { ok, detail: JSON.stringify(visible) }
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
  // also catch title/aria containing options menu in header
  const moreInHeader = await full.locator('button[aria-label*="options" i], button[title*="options" i], button[title*="Menu" i]').count()
  return { ok: n === 0, detail: `ellipsisBtns=${n} maybeMenu=${moreInHeader}` }
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

try {
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(200)
  check('App opens', (await page.locator('.phone-inner, .phone').count()) > 0)

  const stamp = await page.locator('.proto-tag').textContent().catch(() => '')
  check('Stamp contains 1001-q', /1001-q/.test(stamp || ''), stamp)

  // ——— #mairie-accueil ———
  await gotoHash('#mairie-accueil')
  let hash = await page.evaluate(() => location.hash)
  check('On #mairie-accueil', /mairie-accueil/.test(hash), hash)

  let chrome = await appChromeHidden()
  check('NO .app-chrome visible (mairie)', chrome.ok, chrome.detail)

  let homes = await headerHomesOk()
  check('Header has Accueil Ma Ville + Accueil MIASIN (mairie)', homes.ok, homes.detail)

  let noEll = await noEllipsisInFullHeader()
  check('NO ⋯ in .phone-header-full (mairie)', noEll.ok, noEll.detail)

  const idRow = page.locator('.identity-row')
  const idEllipsis = idRow.locator('button').filter({ hasText: '⋯' })
  const idText = (await idRow.first().textContent().catch(() => '')) || ''
  check(
    '⋯ in .identity-row near Kapan — Arménie (mairie)',
    (await idEllipsis.count()) >= 1 && /Kapan/.test(idText),
    `ellipsis=${await idEllipsis.count()} text=${idText.slice(0, 80)}`
  )

  const mairieShots = await savePhoneShot('1001-q-mairie-entete.png')
  check('Screenshot mairie written', mairieShots.every((p) => fs.existsSync(p)), mairieShots.join(' | '))

  // ——— #accueil-kapan ———
  await gotoHash('#accueil-kapan')
  hash = await page.evaluate(() => location.hash)
  check('On #accueil-kapan', /accueil-kapan/.test(hash), hash)

  chrome = await appChromeHidden()
  check('NO .app-chrome visible (accueil)', chrome.ok, chrome.detail)

  homes = await headerHomesOk()
  check('One-line homes in header (accueil)', homes.ok, homes.detail)

  noEll = await noEllipsisInFullHeader()
  check('NO ⋯ in full header (accueil)', noEll.ok, noEll.detail)

  const heroId = page.locator('.hero-caption .identity-row, .hero-block .identity-row, .identity-row')
  const heroEll = heroId.locator('button').filter({ hasText: '⋯' })
  check('⋯ in hero identity (accueil)', (await heroEll.count()) >= 1, `count=${await heroEll.count()}`)

  const accueilShots = await savePhoneShot('1001-q-accueil-entete.png')
  check('Screenshot accueil written', accueilShots.every((p) => fs.existsSync(p)), accueilShots.join(' | '))

  // ——— Vie locale list (pharmacies / commerces) ———
  await gotoHash('#sante-pharmacies')
  hash = await page.evaluate(() => location.hash)
  if (!/sante-pharmacies/.test(hash)) {
    await gotoHash('#dir-economie-commerces')
    hash = await page.evaluate(() => location.hash)
  }
  check('On vie locale list', /sante-pharmacies|dir-economie-commerces/.test(hash), hash)

  homes = await headerHomesOk()
  check('Header homes on vie locale list', homes.ok, homes.detail)

  noEll = await noEllipsisInFullHeader()
  check('NO ⋯ in full header (vie locale)', noEll.ok, noEll.detail)

  const vieShots = await savePhoneShot('1001-q-vie-locale-entete.png')
  check('Screenshot vie locale written', vieShots.every((p) => fs.existsSync(p)), vieShots.join(' | '))

  // ——— #evenement-details ———
  // Ensure an event is open; direct hash may still render via default evt-atelier
  await gotoHash('#evenements-liste')
  await page.waitForTimeout(200)
  const openEvt = page.locator('[data-open-event], [data-go="evenement-details"]').first()
  if ((await openEvt.count()) > 0) {
    await openEvt.click()
    await page.waitForTimeout(350)
  } else {
    await gotoHash('#evenement-details')
  }
  hash = await page.evaluate(() => location.hash)
  check('On #evenement-details', /evenement-details/.test(hash), hash)

  homes = await headerHomesOk()
  check('Header has homes (evenement-details)', homes.ok, homes.detail)

  const isFull = (await page.locator('.phone-header-full').count()) > 0
  if (isFull) {
    noEll = await noEllipsisInFullHeader()
    check('NO ⋯ in full header (evenement-details)', noEll.ok, noEll.detail)
  } else {
    check('NO ⋯ in full header (evenement-details)', true, 'local chrome — skipped')
  }

  const contentEll = page.locator('.event-title-row button, .event-detail-head button').filter({ hasText: '⋯' })
  check('⋯ exists in event content (not header)', (await contentEll.count()) >= 1, `count=${await contentEll.count()}`)

  check('No page errors', pageErrors.length === 0, pageErrors.slice(0, 3).join(' | '))
} catch (err) {
  check('Smoke threw', false, err?.message || String(err))
} finally {
  const passed = results.filter((r) => r.ok).length
  const failed = results.filter((r) => !r.ok).length
  const summary = {
    stamp: '1001-q',
    base: BASE,
    passed,
    failed,
    ok: failed === 0,
    results,
    pageErrors,
    at: new Date().toISOString(),
  }
  const jsonPath = path.join(outDir, 'verify-entete-une-ligne-1001q.json')
  fs.writeFileSync(jsonPath, JSON.stringify(summary, null, 2))
  console.log(`\nWrote ${jsonPath} — ${passed} passed, ${failed} failed`)
  await browser.close()
  process.exit(failed === 0 ? 0 : 1)
}
