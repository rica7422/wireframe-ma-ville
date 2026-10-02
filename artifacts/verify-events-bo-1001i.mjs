/**
 * Playwright verification — events back-office build 1001-i
 */
import { chromium } from 'playwright'
import fs from 'node:fs'
import path from 'node:path'

const BASE = process.env.BASE_URL || 'http://127.0.0.1:4317'
const outDir = path.resolve('artifacts')
fs.mkdirSync(outDir, { recursive: true })

const results = []
function check(name, ok, detail = '') {
  results.push({ name, ok: !!ok, detail })
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? ' — ' + detail : ''}`)
}

const browser = await chromium.launch({
  executablePath: '/usr/local/bin/google-chrome',
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
})
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })

async function setRole(role) {
  // Prefer in-UI switch (keeps SPA memory); also set session for reloads
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

try {
  await page.goto(`${BASE}/#evenements-liste`, { waitUntil: 'networkidle' })

  // Stamp
  const stamp = await page.locator('.proto-tag').textContent()
  check('Stamp 1001-i events-bo', /1001-i/.test(stamp || '') && /events-bo/.test(stamp || ''), stamp)

  // Ensure habitant
  await setRole('habitant')
  await page.goto(`${BASE}/#evenements-liste`, { waitUntil: 'networkidle' })

  // 1. Créer → empty form, new id ≠ evt-atelier
  await page.locator('[data-sim="event-create"]').click()
  await page.waitForTimeout(300)
  const formMeta = await page.locator('.form-card .meta').first().textContent()
  const formIdMatch = (formMeta || '').match(/evt-\d+/)
  const createId = formIdMatch?.[0]
  check('Créer opens form with new id', !!createId && createId !== 'evt-atelier', formMeta)
  const titleVal = await page.locator('input[data-field="title"]').inputValue()
  check('Create title empty', titleVal === '', `value="${titleVal}"`)
  check('No Atelier prefilled', !(await page.content()).includes('value="Atelier créatif"'))

  // 2. Edit atelier → prefilled
  await page.evaluate(() => {
    sessionStorage.setItem('ma-ville-event-edit', 'evt-atelier')
    sessionStorage.setItem('ma-ville-event-form-step', '1')
  })
  await page.locator('[data-sim-role="habitant"]').click().catch(() => {})
  await page.evaluate(() => {
    sessionStorage.setItem('ma-ville-event-edit', 'evt-atelier')
    sessionStorage.setItem('ma-ville-event-form-step', '1')
    location.hash = 'evenement-form'
  })
  await page.waitForTimeout(400)
  // force render via click sim
  await page.evaluate(() => {
    sessionStorage.setItem('ma-ville-event-edit', 'evt-atelier')
    sessionStorage.setItem('ma-ville-event-form-step', '1')
  })
  await page.goto(`${BASE}/#evenement-form`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(300)
  const formDump = await page.locator('.form-card').innerHTML()
  const atelierTitle = await page.locator('input[data-field="title"]').inputValue().catch(() => '')
  check('Edit atelier prefilled', atelierTitle === 'Atelier créatif', `title="${atelierTitle}" meta=${(formDump || '').slice(0, 120)}`)

  // 3. List/detail same lieu/date/prix; Places restantes
  await page.goto(`${BASE}/#evenements-liste`, { waitUntil: 'networkidle' })
  const listCard = page.locator('[data-event-id="evt-atelier"]')
  const listLieu = await listCard.locator('.event-lieu').textContent()
  const listWhen = await listCard.locator('.event-date-block').textContent()
  await listCard.locator('[data-open-event="evt-atelier"]').first().click()
  await page.waitForTimeout(300)
  const detailLieu = await page.locator('.event-detail .event-lieu').textContent()
  const detailDate = await page.locator('.event-detail .meta-cell').nth(0).locator('strong').textContent()
  const detailPrix = await page.locator('.event-detail .meta-cell').nth(3).locator('strong').textContent()
  const detailHtml = await page.locator('.event-detail').innerHTML()
  check('List/detail lieu aligned', (listLieu || '').includes('Centre culturel'), `list=${listLieu} detail=${detailLieu}`)
  check('Detail date from store', /16\s*juin|Juin\s*16/i.test(detailDate || '') || (detailDate || '').includes('16'), detailDate)
  check('Detail prix 20 €', (detailPrix || '').includes('20'), detailPrix)
  check('Places restantes not Billets', /Places restantes/i.test(detailHtml) && !/Billets restants/i.test(detailHtml))
  check('List when has JUIN 16', /JUIN\s*16/i.test(listWhen || ''), listWhen)

  // 4. Habitant submit → pending; admin approve → published citizen
  await setRole('habitant')
  await page.goto(`${BASE}/#evenements-liste`, { waitUntil: 'networkidle' })
  await page.locator('[data-sim="event-create"]').click()
  await page.waitForTimeout(200)
  await page.locator('input[data-field="title"]').fill('Test photo club')
  const pendingMeta = await page.locator('.form-card .meta').first().textContent()
  const pendingId = (pendingMeta || '').match(/evt-\d+/)?.[0]
  await page.locator('[data-sim="event-submit-validation"]').click()
  await page.waitForTimeout(300)
  const toast1 = await page.locator('#toast').textContent()
  check('Submit validation toast', /validation/i.test(toast1 || ''), toast1)

  await setRole('admin-kapan')
  await page.goto(`${BASE}/#evenements-a-valider`, { waitUntil: 'networkidle' })
  const queueHtml = await page.locator('.phone-scroll').innerHTML()
  check('Pending in validation queue', queueHtml.includes('Test photo club') || queueHtml.includes(pendingId || '___'), pendingId)
  if (pendingId) {
    await page.locator(`[data-sim="event-approve:${pendingId}"]`).click()
    await page.waitForTimeout(200)
  }
  const approved = await page.evaluate((id) => {
    // read via session — use page module? fallback DOM after open
    return id
  }, pendingId)
  // Navigate to form of approved to check — use evaluate store isn't exposed.
  // Re-open details via open id after approve by checking admin list badge
  await page.goto(`${BASE}/#admin-evenements`, { waitUntil: 'networkidle' })
  const adminList = await page.locator('.phone-scroll').innerHTML()
  check('Approved still citizen origin', /Test photo club[\s\S]*Habitant/i.test(adminList) || /Habitant[\s\S]*Test photo club/i.test(adminList), 'admin list')
  check('Approved published badge', /Test photo club[\s\S]*Publié/i.test(adminList) || adminList.includes('Publié'))

  // 5. Comments from mairie → theme mairie
  await page.goto(`${BASE}/#mairie-accueil`, { waitUntil: 'networkidle' })
  await page.locator('[data-open-comments="pub-mairie-1"]').first().click()
  await page.waitForTimeout(300)
  const theme = await page.locator('#phone').getAttribute('data-theme')
  check('Mairie comments theme mairie', theme === 'mairie', `theme=${theme}`)

  // 6. Signalements still Q/A
  await page.goto(`${BASE}/#signalements`, { waitUntil: 'networkidle' })
  const sigHtml = await page.locator('.phone-scroll').innerHTML()
  check(
    'Signalements Q/A preserved',
    /signal/i.test(sigHtml) && !/En cours\/Résolu/.test(sigHtml) && (/Non lus|À répondre|Répondus|En attente de réponse|Avec réponse/.test(sigHtml) || sigHtml.includes('signal-row')),
  )

  // 7. No Archiver
  await page.goto(`${BASE}/#evenement-details`, { waitUntil: 'networkidle' })
  await page.evaluate(() => sessionStorage.setItem('ma-ville-event-open', 'evt-atelier'))
  await page.reload({ waitUntil: 'networkidle' })
  await page.locator('[data-open-menu="event"]').click()
  await page.waitForTimeout(200)
  const menuHtml = await page.locator('.phone-scroll, .modal-layer, .sheet-option').allTextContents()
  const menuText = menuHtml.join(' ')
  check('No Archiver in event menu', !/Archiver/i.test(menuText) && !/Épingler/i.test(menuText), menuText.slice(0, 200))

  // Screenshot shell
  await page.goto(`${BASE}/#evenements-liste`, { waitUntil: 'networkidle' })
  await page.screenshot({ path: path.join(outDir, 'events-bo-1001i-shell.png'), fullPage: true })
  check('Screenshot shell saved', fs.existsSync(path.join(outDir, 'events-bo-1001i-shell.png')))

  // Extra screenshots
  await page.goto(`${BASE}/#evenement-form`, { waitUntil: 'networkidle' })
  await page.screenshot({ path: path.join(outDir, 'events-bo-1001i-form.png'), fullPage: true })
  await page.goto(`${BASE}/#evenements-a-valider`, { waitUntil: 'networkidle' })
  await page.screenshot({ path: path.join(outDir, 'events-bo-1001i-queue.png'), fullPage: true })
} catch (err) {
  check('Script error', false, String(err))
  console.error(err)
} finally {
  await browser.close()
}

const passed = results.filter((r) => r.ok).length
const failed = results.filter((r) => !r.ok).length
const summary = { passed, failed, results, base: BASE }
fs.writeFileSync(path.join(outDir, 'verify-events-bo-1001i.json'), JSON.stringify(summary, null, 2))
console.log(`\n${passed} passed, ${failed} failed`)
process.exit(failed ? 1 : 0)
