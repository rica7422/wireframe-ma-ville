/**
 * Playwright smoke — Mes rencontres build 1001-o
 */
import { chromium } from 'playwright'
import fs from 'node:fs'
import path from 'node:path'

const BASE = process.env.BASE_URL || 'http://127.0.0.1:4318'
const outDir = path.resolve('artifacts')
const mediaDir = '/cursor/stores/bc-62a66aae-7ddf-4f7d-bfef-8741542e3a40/media'
fs.mkdirSync(outDir, { recursive: true })
fs.mkdirSync(mediaDir, { recursive: true })

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
  await page.waitForTimeout(250)
}

async function phoneHtml() {
  return page.locator('.phone-inner').innerHTML()
}

try {
  // Clear rencontres store for predictable demos
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle' })
  await page.evaluate(() => {
    try {
      localStorage.removeItem('ma-ville-rencontres-store')
      sessionStorage.removeItem('ma-ville-rencontres-store')
      sessionStorage.removeItem('ma-ville-rencontre-tab')
      sessionStorage.removeItem('ma-ville-rencontre-filter')
      sessionStorage.removeItem('ma-ville-rencontre-temp')
      sessionStorage.removeItem('ma-ville-rencontre-search')
      sessionStorage.removeItem('ma-ville-rencontre-draft')
      sessionStorage.removeItem('ma-ville-rencontre-open')
    } catch {
      /* ignore */
    }
  })

  await gotoHash('#accueil-kapan')
  await setRole('habitant')

  const stamp = await page.locator('.proto-tag').textContent()
  check('Stamp contains 1001-o · mes-rencontres', /1001-o/.test(stamp || '') && /mes-rencontres/i.test(stamp || ''), stamp)

  // Shell screenshot
  const shellPath = path.join(mediaDir, 'ma-ville-wireframe-shell.png')
  await page.locator('.phone').screenshot({ path: shellPath })
  check('Shell screenshot written', fs.existsSync(shellPath), shellPath)
  await page.screenshot({ path: path.join(outDir, 'ma-ville-wireframe-shell-full.png') })

  // ——— List tabs / filters ———
  await gotoHash('#communautes-rencontres')
  let html = await phoneHtml()
  const theme = await page.locator('.phone').getAttribute('data-theme')
  check('List theme = rencontres', theme === 'rencontres', `theme=${theme}`)
  check(
    'List has Créer une rencontre + Reçues/Envoyées',
    /Créer une rencontre/.test(html) && /Reçues/.test(html) && /Envoyées/.test(html),
    html.replace(/\s+/g, ' ').slice(0, 200)
  )
  check(
    'Response filters Toutes / En attente / Acceptées / Refusées',
    /Toutes/.test(html) && /En attente/.test(html) && /Acceptées/.test(html) && /Refusées/.test(html)
  )
  check(
    'Temp filters À venir / Passées / Annulées + Brouillons',
    /À venir/.test(html) && /Passées/.test(html) && /Annulées/.test(html) && /Brouillons/.test(html)
  )
  check('Footer Ma Ville present on list', /phone-footer/.test(html) && /Accueil/.test(html))
  check('Uses Organisateur wording (not admin for creator)', !/admin de la rencontre/i.test(html))

  // Received pending card with Accept/Refuse
  check(
    'Pending received shows Accepter/Refuser',
    /data-sim="renc-accept:renc-1"/.test(html) && /data-sim="renc-refuse:renc-1"/.test(html),
    'renc-1 Café'
  )

  // Accept from list
  page.once('dialog', async (d) => d.dismiss().catch(() => {}))
  await page.locator('[data-sim="renc-accept:renc-1"]').click()
  await page.waitForTimeout(300)
  html = await phoneHtml()
  check(
    'Accept from list updates chip (Vous avez accepté)',
    /Vous avez accepté/.test(html) && !/data-sim="renc-accept:renc-1"/.test(html),
    html.replace(/\s+/g, ' ').slice(0, 180)
  )

  // Envoyées tab + collectif summary
  await page.locator('[data-sim="renc-tab:envoyees"]').click()
  await page.waitForTimeout(200)
  html = await phoneHtml()
  check('Envoyées tab shows org cards', /Balade Vahanavank|Soirée jeux|Appel projet/.test(html), html.replace(/\s+/g, ' ').slice(0, 180))
  check(
    'Collectif summary on card',
    /\d+ acceptation/.test(html) && /refus/.test(html) && /en attente/.test(html),
    html.replace(/\s+/g, ' ').slice(0, 200)
  )

  // Online meeting in list
  check('Online meeting label present', /Rencontre en ligne|Appel projet MIASIN/.test(html))

  // Org detail (renc-4 collectif)
  await page.locator('[data-sim="renc-open:renc-4"]').click()
  await page.waitForTimeout(300)
  html = await phoneHtml()
  const detailHash = await page.evaluate(() => location.hash)
  check('Org detail opens', /rencontre-details/.test(detailHash), detailHash)
  check(
    'Org detail has Modifier + Organisateur + guest responses',
    /Modifier la rencontre/.test(html) &&
      /Organisateur/.test(html) &&
      /Acceptée|En attente|Refusée/.test(html),
    html.replace(/\s+/g, ' ').slice(0, 220)
  )
  check('Org detail footer Ma Ville', /phone-footer/.test(html))
  check('No Accepter/Refuser for organizer on own meeting', !/data-sim="renc-accept:renc-4"/.test(html))

  // Create flow — draft + send
  await gotoHash('#communautes-rencontres')
  await page.locator('[data-sim="renc-create"]').click()
  await page.waitForTimeout(250)
  let createHash = await page.evaluate(() => location.hash)
  html = await phoneHtml()
  check('Create step 1 Amis', /rencontre-create/.test(createHash) && /Amis/.test(html), createHash)
  check('Create form without global footer chrome', !/phone-footer/.test(html))

  await page.locator('[data-sim="renc-toggle-guest:user-armen"]').click()
  await page.waitForTimeout(150)
  await page.locator('[data-sim="renc-create-step:2"]').click()
  await page.waitForTimeout(200)
  html = await phoneHtml()
  check('Create step 2 Infos', /Informations/.test(html) || /Titre/.test(html))

  await page.fill('[data-field="renc-title"]', 'Smoke test rencontre')
  await page.fill('[data-field="renc-date"]', '2026-11-15')
  await page.fill('[data-field="renc-time"]', '18:00')
  await page.fill('[data-field="renc-address"]', '1 rue Test, Kapan')
  await page.locator('[data-sim="renc-create-step:3"]').click()
  await page.waitForTimeout(200)
  html = await phoneHtml()
  check('Create step 3 Vérif', /Vérification|Envoyer les invitations/.test(html))

  // Save draft path
  await page.locator('[data-sim="renc-save-draft"]').click()
  await page.waitForTimeout(300)
  html = await phoneHtml()
  const afterDraftHash = await page.evaluate(() => location.hash)
  check(
    'Save draft returns to list (brouillons)',
    /communautes-rencontres/.test(afterDraftHash) && (/Smoke test|Brouillon/.test(html) || /brouillons/.test(html)),
    afterDraftHash
  )

  // Fresh create + send
  await page.locator('[data-sim="renc-create"]').click()
  await page.waitForTimeout(200)
  await page.locator('[data-sim="renc-toggle-guest:user-lilit"]').click()
  await page.waitForTimeout(100)
  await page.locator('[data-sim="renc-create-step:2"]').click()
  await page.waitForTimeout(150)
  await page.fill('[data-field="renc-title"]', 'Invitation envoyée smoke')
  await page.fill('[data-field="renc-date"]', '2026-11-20')
  await page.fill('[data-field="renc-time"]', '19:30')
  await page.fill('[data-field="renc-address"]', 'Place smoke, Kapan')
  await page.locator('[data-sim="renc-create-step:3"]').click()
  await page.waitForTimeout(150)
  await page.locator('[data-sim="renc-send"]').click()
  await page.waitForTimeout(350)
  html = await phoneHtml()
  const afterSend = await page.evaluate(() => location.hash)
  check(
    'Send invitations lands on org details',
    /rencontre-details/.test(afterSend) && /Invitation envoyée smoke/.test(html),
    afterSend
  )

  // Online mode path
  await gotoHash('#communautes-rencontres')
  await page.locator('[data-sim="renc-create"]').click()
  await page.waitForTimeout(150)
  await page.locator('[data-sim="renc-toggle-guest:user-anahit"]').click()
  await page.locator('[data-sim="renc-create-step:2"]').click()
  await page.waitForTimeout(150)
  await page.check('[data-field="renc-mode"][value="online"]')
  await page.waitForTimeout(200)
  html = await phoneHtml()
  check(
    'Online mode hides address / shows connexion hint',
    /en ligne/i.test(html) && /Lien de connexion|connexion/.test(html),
    html.replace(/\s+/g, ' ').slice(0, 180)
  )

  // Community menu → Rencontres
  await page.evaluate(() => {
    sessionStorage.setItem('ma-ville-communaute-open', 'grp-randonnee')
  })
  await gotoHash('#communaute-menu')
  html = await phoneHtml()
  check('Community menu has Rencontres link', /communautes-rencontres/.test(html) && /Rencontres/.test(html), html.replace(/\s+/g, ' ').slice(0, 160))
  const rencLink = page.locator('[data-go="communautes-rencontres"]')
  if ((await rencLink.count()) > 0) {
    await rencLink.first().click()
    await page.waitForTimeout(250)
  } else {
    await gotoHash('#communautes-rencontres')
  }
  check(
    'Menu Rencontres opens mes rencontres list',
    /communautes-rencontres/.test(await page.evaluate(() => location.hash)) &&
      /Créer une rencontre/.test(await phoneHtml())
  )

  // Preserve groupes / clubs / messages / events routes still exist
  await setRole('habitant')
  for (const id of [
    'communautes-groupes',
    'communautes-clubs',
    'messages',
    'evenements-liste',
    'signalements',
    'dir-education',
    'mairie-rdv',
  ]) {
    await gotoHash(`#${id}`)
    const h = await page.evaluate(() => location.hash)
    const body = await phoneHtml()
    check(`Non-regression screen ${id}`, h.includes(id) && body.length > 40, h)
  }

  // Municipal admin: same personal list, NO BO of others' private rencontres
  await setRole('admin-kapan')
  await gotoHash('#communautes-rencontres')
  html = await phoneHtml()
  const navHtml = await page.locator('.proto-nav').innerHTML()
  check(
    'Admin municipal sees Mes rencontres (personal), not BO all-private',
    /Mes rencontres|Créer une rencontre/.test(html) &&
      !/Toutes les rencontres privées|BO rencontres|Modérer les rencontres/.test(html + navHtml),
    'no private BO list'
  )
  check(
    'Admin nav has no dedicated BO rencontres privées',
    !/rencontres privées|admin-rencontres/i.test(navHtml)
  )

  // Guest detail counter-propose affordance on pending TÀT
  await setRole('habitant')
  await page.evaluate(() => {
    try {
      localStorage.removeItem('ma-ville-rencontres-store')
      sessionStorage.removeItem('ma-ville-rencontres-store')
      sessionStorage.setItem('ma-ville-rencontre-tab', 'recues')
      sessionStorage.setItem('ma-ville-rencontre-filter', 'toutes')
      sessionStorage.setItem('ma-ville-rencontre-temp', 'avenir')
      sessionStorage.removeItem('ma-ville-rencontre-search')
      sessionStorage.setItem('ma-ville-rencontre-open', 'renc-1')
    } catch {
      /* ignore */
    }
  })
  // Reload so rencontres-data hydrate() resets DEFAULT fixtures
  await gotoHash('#rencontre-details')
  await page.reload({ waitUntil: 'networkidle' })
  await page.waitForTimeout(300)
  html = await phoneHtml()
  check(
    'Guest pending detail: Accepter / Refuser / Proposer',
    /renc-accept:renc-1/.test(html) &&
      /renc-refuse:renc-1/.test(html) &&
      /Proposer autre date/.test(html),
    html.replace(/\s+/g, ' ').slice(0, 200)
  )

  check('No page errors', pageErrors.length === 0, pageErrors.slice(0, 4).join(' | '))
} catch (err) {
  check('Script completed without throw', false, err?.stack || String(err))
} finally {
  const summary = {
    base: BASE,
    stampExpected: '1001-o',
    pass: results.every((r) => r.ok),
    passCount: results.filter((r) => r.ok).length,
    total: results.length,
    results,
    pageErrors,
    at: new Date().toISOString(),
  }
  fs.writeFileSync(path.join(outDir, 'verify-mes-rencontres-1001o.json'), JSON.stringify(summary, null, 2))
  console.log('\nSUMMARY', summary.pass ? 'PASS' : 'FAIL', `(${summary.passCount}/${summary.total})`)
  await browser.close()
  process.exit(summary.pass ? 0 : 1)
}
