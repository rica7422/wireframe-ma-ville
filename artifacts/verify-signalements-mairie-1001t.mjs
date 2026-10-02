/**
 * Playwright smoke — Signalements → Ma mairie (build 1001-t)
 * Pas de git. Local + tunnel.
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
  results.push({ name, ok: !!ok, detail: String(detail).slice(0, 400) })
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? ' — ' + detail : ''}`)
}

const browser = await chromium.launch({
  executablePath: '/usr/local/bin/google-chrome',
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
})
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })

async function gotoHash(hash) {
  const h = hash.startsWith('#') ? hash : `#${hash}`
  await page.goto(`${BASE}/?v=${Date.now()}${h}`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(300)
}

async function savePhoneShot(name) {
  const phone = page.locator('.phone')
  for (const dir of shotDirs) {
    await phone.screenshot({ path: path.join(dir, name) })
  }
}

try {
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle' })
  const stamp = await page.locator('.proto-tag').textContent().catch(() => '')
  check('Stamp 1001-t', /1001-t/.test(stamp || ''), stamp)

  // Accueil — no Signalements tile
  await gotoHash('#accueil-kapan')
  const accueilHasSignal = await page.evaluate(() => {
    const tiles = [...document.querySelectorAll('.phone-inner .icon-tile, .phone-inner .tile')]
    return tiles.some((t) => /Signalements/i.test(t.textContent || ''))
  })
  check('Accueil: pas de tuile Signalements', !accueilHasSignal)

  // Vie locale hub — no Signalements
  await gotoHash('#vie-locale-hub')
  const hubHas = await page.evaluate(() =>
    [...document.querySelectorAll('.phone-inner button')].some((b) =>
      /^Signalements$/i.test((b.textContent || '').trim())
    )
  )
  check('Vie locale hub: pas Signalements', !hubHas)

  // Ma mairie — RDV + Signalements same row
  await gotoHash('#mairie-accueil')
  const services = await page.evaluate(() => {
    const row = document.querySelector('.mairie-services')
    if (!row) return { ok: false, detail: 'no .mairie-services' }
    const labels = [...row.querySelectorAll('button')].map((b) => (b.textContent || '').trim())
    const theme = document.querySelector('.phone')?.getAttribute('data-theme')
    const accent = getComputedStyle(document.querySelector('.phone')).getPropertyValue('--accent').trim()
    return {
      ok: labels.includes('Prendre rendez-vous') && labels.includes('Signalements') && labels.length === 2,
      detail: `labels=${labels.join('|')} theme=${theme} accent=${accent}`,
      theme,
      accent,
    }
  })
  check('Ma mairie: RDV + Signalements côte à côte', services.ok, services.detail)
  check(
    'Accent mairie #29676D',
    services.theme === 'mairie' || /29676d/i.test(services.accent || ''),
    services.detail
  )
  // Not a 5th sous-cat
  const sousCats = await page.evaluate(() => {
    const grid = document.querySelector('.sous-cat-grid, .grid-2')
    // sousCatGrid typically renders icon tiles in a grid
    const labels = [...document.querySelectorAll('.phone-inner .icon-tile span, .phone-inner .sous-cat span')]
      .map((s) => (s.textContent || '').trim())
      .filter(Boolean)
    return labels
  })
  check('Signalements pas dans les 4 sous-cats', !sousCats.includes('Signalements'), sousCats.join('|'))
  await savePhoneShot('1001-t-mairie-services-signalements.png')

  // Open signalements from button
  await page.locator('.mairie-services [data-go="signalements"]').click()
  await page.waitForTimeout(300)
  check('Ouvre #signalements', /signalements/.test(await page.evaluate(() => location.hash)))

  const sigTheme = await page.evaluate(() => {
    const phone = document.querySelector('.phone')
    return {
      theme: phone?.getAttribute('data-theme'),
      accent: getComputedStyle(phone).getPropertyValue('--accent').trim(),
      back: document.querySelector('[data-back], .phone-header [data-go]')?.getAttribute('data-back') != null
        || !!document.querySelector('.phone-header [data-go="mairie-accueil"], .phone-header [data-back]'),
    }
  })
  // backTo is data-back historically OR button - phoneHeader uses data-back for history; check title area
  const headerBack = await page.evaluate(() => {
    const h = document.querySelector('.phone-header')
    if (!h) return null
    // components phoneHeader back button
    const btn = h.querySelector('[data-back], [data-go]')
    return {
      hasBack: !!h.querySelector('[data-back]'),
      go: h.querySelector('[data-go]')?.getAttribute('data-go') || null,
      accent: getComputedStyle(document.querySelector('.phone')).getPropertyValue('--accent').trim(),
      theme: document.querySelector('.phone')?.getAttribute('data-theme'),
      title: h.querySelector('.phone-title, strong')?.textContent || '',
    }
  })
  check(
    'Signalements theme = mairie (plus bordeaux)',
    headerBack?.theme === 'mairie' || /29676d/i.test(headerBack?.accent || ''),
    JSON.stringify(headerBack)
  )
  check('Pas #9F1239', !/#9f1239/i.test(headerBack?.accent || ''))
  await savePhoneShot('1001-t-signalements-liste.png')

  // Redirect old hashes
  await gotoHash('#page-signalement')
  check('Redirect page-signalement → signalements', /signalements/.test(await page.evaluate(() => location.hash)))
  await gotoHash('#dir-signalement')
  check('Redirect dir-signalement → signalements', /signalements/.test(await page.evaluate(() => location.hash)))

  // Métier Q/R still there
  await gotoHash('#signalements')
  check(
    'Métier Q/R: Nouveau signalement',
    (await page.locator('[data-go="signalement-nouveau"]').count()) >= 1 ||
      (await page.getByText(/Nouveau signalement/i).count()) >= 1
  )

  // Nav tree under Ma mairie
  const navOk = await page.evaluate(() => {
    const nodes = [...document.querySelectorAll('.nav-tree .tree-label')]
    const texts = nodes.map((n) => n.textContent.trim())
    const mairieIdx = texts.indexOf('Ma mairie')
    const sigIdx = texts.indexOf('Signalements')
    const vieIdx = texts.indexOf('Vie locale (hub)')
    // Signalements should appear; ideally after we expand - just check presence in tree
    return { hasSig: sigIdx >= 0, mairieIdx, sigIdx, vieIdx, near: sigIdx > mairieIdx }
  })
  check('Arbre: Signalements présent', navOk.hasSig, JSON.stringify(navOk))
} catch (err) {
  check('Suite threw', false, err?.message || String(err))
} finally {
  const passed = results.filter((r) => r.ok).length
  const failed = results.filter((r) => !r.ok).length
  fs.writeFileSync(
    path.join(outDir, 'verify-signalements-mairie-1001t.json'),
    JSON.stringify({ stamp: '1001-t', base: BASE, passed, failed, total: results.length, results }, null, 2)
  )
  console.log(`\n${passed}/${results.length} passed (${failed} failed)`)
  await browser.close()
  if (failed) process.exit(1)
}
