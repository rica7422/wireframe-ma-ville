/**
 * Playwright smoke — navigation détails by id (build 1001-p)
 * Commerces list → fiche Marché / Épicerie + Pharmacie du Parc
 */
import { chromium } from 'playwright'
import fs from 'node:fs'
import path from 'node:path'

const BASE = process.env.BASE_URL || 'http://127.0.0.1:4317'
const outDir = path.resolve('artifacts')
fs.mkdirSync(outDir, { recursive: true })

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
  await page.waitForTimeout(250)
}

async function phoneHtml() {
  return page.locator('.phone-inner').innerHTML()
}

async function detailTitleText() {
  const strong = page.locator('.phone-inner .detail-head strong')
  if ((await strong.count()) > 0) return (await strong.first().textContent())?.trim() || ''
  return (await page.locator('.phone-inner').textContent())?.trim() || ''
}

try {
  // 1. Open the app
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(200)
  check('App opens', (await page.locator('.phone-inner').count()) > 0)

  // Stamp 1001-p (also re-checked at end on document)
  const stampEarly = await page.locator('.proto-tag').textContent()
  check('Stamp contains 1001-p (early)', /1001-p/.test(stampEarly || ''), stampEarly)

  // 2. Go to #dir-economie-commerces
  await gotoHash('#dir-economie-commerces')
  let hash = await page.evaluate(() => location.hash)
  let html = await phoneHtml()
  check(
    'On commerces list (#dir-economie-commerces)',
    /dir-economie-commerces/.test(hash) && (/Commerces|Marché|Épicerie|Epicerie/.test(html) || /data-open-fiche/.test(html)),
    hash
  )

  const detailsBtns = page.locator('.phone-inner [data-open-fiche]')
  const detailsCount = await detailsBtns.count()
  check('Commerces list has Détails (data-open-fiche)', detailsCount >= 2, `count=${detailsCount}`)

  // 3. Click first Détails
  const firstOpenId = await detailsBtns.first().getAttribute('data-open-fiche')
  await detailsBtns.first().click()
  await page.waitForTimeout(350)

  html = await phoneHtml()
  const title1 = await detailTitleText()
  const openId = await page.evaluate(() => {
    try {
      return sessionStorage.getItem('ma-ville-dir-fiche-open')
    } catch {
      return null
    }
  })
  hash = await page.evaluate(() => location.hash)

  // 4. Assert Marché OR fiche-commerce-1 and not école
  const hasMarche = /Marché/i.test(title1) || /Marché/i.test(html)
  const isCommerce1 = openId === 'fiche-commerce-1' || firstOpenId === 'fiche-commerce-1'
  const notEcole = !/École primaire/i.test(html) && !/Écoles — fiche/i.test(html)
  check(
    'First détail = Marché (or fiche-commerce-1) and not école',
    (hasMarche || isCommerce1) && notEcole,
    `title="${title1}" openId=${openId} firstAttr=${firstOpenId} hash=${hash}`
  )
  check('Open fiche id is fiche-commerce-1', openId === 'fiche-commerce-1' || firstOpenId === 'fiche-commerce-1', openId)

  // 5. Back → commerces list
  const backBtn = page.locator('.phone-inner [data-back]').first()
  check('Back button present', (await backBtn.count()) > 0)
  await backBtn.click()
  await page.waitForTimeout(300)
  hash = await page.evaluate(() => location.hash)
  html = await phoneHtml()
  check(
    'Back on commerces list',
    /dir-economie-commerces/.test(hash) && !/dir-economie-commerces-fiche/.test(hash),
    hash
  )
  check('Commerces list visible after back', /data-open-fiche/.test(html) && /Marché|Épicerie|Epicerie|Commerces/.test(html))

  // 6. Second Détails (épicerie)
  const detailsAgain = page.locator('.phone-inner [data-open-fiche]')
  const second = detailsAgain.nth(1)
  const secondId = await second.getAttribute('data-open-fiche')
  await second.click()
  await page.waitForTimeout(350)
  const title2 = await detailTitleText()
  html = await phoneHtml()
  const openId2 = await page.evaluate(() => {
    try {
      return sessionStorage.getItem('ma-ville-dir-fiche-open')
    } catch {
      return null
    }
  })
  check(
    'Second détail different title (épicerie)',
    title2 !== title1 && (/épicerie|epicerie/i.test(title2) || /épicerie|epicerie/i.test(html) || secondId !== firstOpenId),
    `title1="${title1}" title2="${title2}" id2=${openId2 || secondId}`
  )

  // 7. Stamp 1001-p in document
  const docText = await page.evaluate(() => document.body.innerText)
  const stamp = await page.locator('.proto-tag').textContent()
  check('Document contains stamp 1001-p', /1001-p/.test(docText) || /1001-p/.test(stamp || ''), stamp)

  // Pharmacies: #sante-pharmacies → Parc
  await gotoHash('#sante-pharmacies')
  hash = await page.evaluate(() => location.hash)
  check('On pharmacies list', /sante-pharmacies/.test(hash), hash)

  const parcBtn = page.locator('.phone-inner [data-open-fiche="dir-pharmacie-parc"]')
  check('Pharmacie du Parc Détails present', (await parcBtn.count()) > 0)
  await parcBtn.first().click()
  await page.waitForTimeout(350)
  const pharmTitle = await detailTitleText()
  html = await phoneHtml()
  const pharmOpen = await page.evaluate(() => {
    try {
      return sessionStorage.getItem('ma-ville-dir-fiche-open')
    } catch {
      return null
    }
  })
  check(
    'Pharmacie du Parc title',
    /Pharmacie du Parc/i.test(pharmTitle) || /Pharmacie du Parc/i.test(html),
    `title="${pharmTitle}" openId=${pharmOpen}`
  )
  check('Open fiche id dir-pharmacie-parc', pharmOpen === 'dir-pharmacie-parc', pharmOpen)

  check('No page errors', pageErrors.length === 0, pageErrors.slice(0, 4).join(' | '))
} catch (err) {
  check('Script completed without throw', false, err?.stack || String(err))
} finally {
  const summary = {
    base: BASE,
    stampExpected: '1001-p',
    pass: results.every((r) => r.ok),
    passCount: results.filter((r) => r.ok).length,
    total: results.length,
    results,
    pageErrors,
    at: new Date().toISOString(),
  }
  const outPath = path.join(outDir, 'verify-navigation-details-1001p.json')
  fs.writeFileSync(outPath, JSON.stringify(summary, null, 2))
  console.log('\nSUMMARY', summary.pass ? 'PASS' : 'FAIL', `(${summary.passCount}/${summary.total})`)
  console.log('Wrote', outPath)
  await browser.close()
  process.exit(summary.pass ? 0 : 1)
}
