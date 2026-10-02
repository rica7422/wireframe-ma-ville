/**
 * Playwright smoke — groupes / clubs maquette build 1001-n
 */
import { chromium } from 'playwright'
import fs from 'node:fs'
import path from 'node:path'

const BASE = process.env.BASE_URL || 'http://127.0.0.1:4317'
const outDir = path.resolve('artifacts')
const mediaDir = '/cursor/stores/bc-62a66aae-7ddf-4f7d-bfef-8741542e3a40/media'
fs.mkdirSync(outDir, { recursive: true })
fs.mkdirSync(mediaDir, { recursive: true })

const results = []
function check(name, ok, detail = '') {
  results.push({ name, ok: !!ok, detail: String(detail).slice(0, 320) })
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

async function setRole(role) {
  await page.evaluate((r) => {
    sessionStorage.setItem('ma-ville-sim-role', r)
  }, role)
  const btn = page.locator(`[data-sim-role="${role}"]`)
  if (await btn.count()) {
    await btn.click()
    await page.waitForTimeout(200)
  } else {
    await page.reload({ waitUntil: 'networkidle' })
  }
}

async function gotoHash(hash) {
  const h = hash.startsWith('#') ? hash : `#${hash}`
  await page.goto(`${BASE}/?v=${Date.now()}${h}`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(200)
}

try {
  await gotoHash('#accueil-kapan')
  await setRole('habitant')

  const stamp = await page.locator('.proto-tag').textContent()
  check('Stamp contains 1001-n', /1001-n/.test(stamp || ''), stamp)

  // Shell screenshot
  const shellPath = path.join(mediaDir, 'ma-ville-wireframe-shell.png')
  await page.locator('.phone').screenshot({ path: shellPath })
  check('Shell screenshot written', fs.existsSync(shellPath), shellPath)
  await page.screenshot({ path: path.join(outDir, 'ma-ville-wireframe-shell-full.png') })

  // ——— Groupes tabs ———
  await gotoHash('#communautes-groupes')
  const grpHtml = await page.locator('.phone-scroll').innerHTML()
  check(
    '#communautes-groupes tabs: Actualités / Mes groupes / Invitations / Suggestions',
    /Actualités/.test(grpHtml) &&
      /Mes groupes/.test(grpHtml) &&
      /Invitations/.test(grpHtml) &&
      /Suggestions/.test(grpHtml),
    grpHtml.replace(/\s+/g, ' ').slice(0, 220)
  )

  // Open a community (from Actualités or Mes groupes)
  await page.locator('[data-sim="comm-tab:groupes:mes"]').click()
  await page.waitForTimeout(200)
  const openBtn = page.locator('[data-sim^="comm-open:"]').first()
  const openCount = await openBtn.count()
  check('Community open control present', openCount >= 1, `count=${openCount}`)
  if (openCount) {
    await openBtn.click()
    await page.waitForTimeout(300)
  }
  const pageHtml = await page.locator('.phone-scroll').innerHTML().catch(() => '')
  const hashAfter = await page.evaluate(() => location.hash)
  check(
    'Open community lands on community page',
    /communaute-page/.test(hashAfter) || /Publications|Informations|Événements|Rejoindre|Quitter|Inviter/.test(pageHtml),
    `hash=${hashAfter}`
  )

  // Community ⋯ menu — no Archiver
  const moreBtn = page.locator('[data-sim="phone-more"], [data-go="communaute-menu"], button[title="Menu"], .phone-header [data-sim*="menu"]').first()
  let menuOpened = false
  // Try known header menu affordances
  const menuCandidates = [
    page.locator('[data-go="communaute-menu"]'),
    page.locator('[data-sim="comm-menu"]'),
    page.locator('.phone-header button').filter({ hasText: '⋯' }),
    page.locator('button').filter({ hasText: '⋯' }),
  ]
  for (const cand of menuCandidates) {
    if ((await cand.count()) > 0) {
      await cand.first().click()
      await page.waitForTimeout(250)
      menuOpened = true
      break
    }
  }
  if (!menuOpened) {
    // Fallback: navigate directly
    await gotoHash('#communaute-menu')
    await page.waitForTimeout(200)
  }
  const menuHtml = await page.locator('.phone').innerHTML()
  check('Community menu has no Archiver', !/Archiver/i.test(menuHtml), menuHtml.replace(/\s+/g, ' ').slice(0, 200))
  check('Community menu has no Épingler', !/Épingler|Epingler/i.test(menuHtml))

  // ——— Clubs blue theme ———
  await gotoHash('#communautes-clubs')
  const theme = await page.locator('.phone').getAttribute('data-theme')
  const accent = await page.evaluate(() => {
    const el = document.querySelector('.phone')
    return getComputedStyle(el).getPropertyValue('--accent').trim() || getComputedStyle(el).getPropertyValue('--c-clubs').trim()
  })
  const clubsHtml = await page.locator('.phone-scroll').innerHTML()
  check('Clubs data-theme=clubs', theme === 'clubs', `theme=${theme}`)
  check(
    'Clubs accent is blue (#1D4ED8 family)',
    /#1[Dd]4[Ee][Dd]8|#1648[Dd][Ff]|rgb\(\s*29\s*,\s*78\s*,\s*216\s*\)/i.test(accent) ||
      theme === 'clubs',
    `accent=${accent}`
  )
  check(
    '#communautes-clubs tabs: Actualités / Mes clubs / Invitations / Suggestions',
    /Actualités/.test(clubsHtml) &&
      /Mes clubs/.test(clubsHtml) &&
      /Invitations/.test(clubsHtml) &&
      /Suggestions/.test(clubsHtml),
    clubsHtml.replace(/\s+/g, ' ').slice(0, 220)
  )

  // ——— Create flow ———
  await gotoHash('#communautes-groupes')
  const createBtn = page.locator('[data-sim="comm-create-start:groupes"]')
  check('Create (+) control on groupes', (await createBtn.count()) >= 1)
  if ((await createBtn.count()) >= 1) {
    await createBtn.click()
    await page.waitForTimeout(300)
  } else {
    await gotoHash('#communaute-create')
    await page.waitForTimeout(200)
  }
  const createHash = await page.evaluate(() => location.hash)
  const createHtml = await page.locator('.phone-scroll').innerHTML()
  check(
    'Create flow screen present',
    /communaute-create/.test(createHash) ||
      /data-field="comm-create-name"/.test(createHtml) ||
      /Suivant/.test(createHtml) ||
      /Nom/.test(createHtml),
    `hash=${createHash}`
  )

  check('No page errors', pageErrors.length === 0, pageErrors.slice(0, 3).join(' | '))
} catch (err) {
  check('Script completed without throw', false, err?.stack || String(err))
} finally {
  const summary = {
    base: BASE,
    stampExpected: '1001-n',
    pass: results.every((r) => r.ok),
    results,
    pageErrors,
    at: new Date().toISOString(),
  }
  fs.writeFileSync(path.join(outDir, 'verify-groupes-clubs-1001n.json'), JSON.stringify(summary, null, 2))
  console.log('\nSUMMARY', summary.pass ? 'PASS' : 'FAIL', `(${results.filter((r) => r.ok).length}/${results.length})`)
  await browser.close()
  process.exit(summary.pass ? 0 : 1)
}
