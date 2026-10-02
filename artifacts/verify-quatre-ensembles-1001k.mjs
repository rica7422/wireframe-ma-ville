/**
 * Playwright verification — quatre ensembles build 1001-k
 */
import { chromium } from 'playwright'
import fs from 'node:fs'
import path from 'node:path'

const BASE = process.env.BASE_URL || 'http://127.0.0.1:4317'
const outDir = path.resolve('artifacts')
fs.mkdirSync(outDir, { recursive: true })

const results = []
function check(name, ok, detail = '') {
  results.push({ name, ok: !!ok, detail: String(detail).slice(0, 200) })
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? ' — ' + detail : ''}`)
}

const browser = await chromium.launch({
  executablePath: '/usr/local/bin/google-chrome',
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
})
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })

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

async function toastText() {
  const t = page.locator('#toast')
  if (!(await t.count())) return ''
  const hidden = await t.getAttribute('hidden')
  if (hidden !== null) return ''
  return (await t.textContent()) || ''
}

try {
  await page.goto(`${BASE}/#accueil-kapan`, { waitUntil: 'networkidle' })

  const stamp = await page.locator('.proto-tag').textContent()
  check(
    'Stamp 1001-k quatre-ensembles',
    /1001-k/.test(stamp || '') && /quatre-ensembles/.test(stamp || ''),
    stamp
  )

  // ——— ÉVÉNEMENTS ———
  await setRole('habitant')
  await page.goto(`${BASE}/#evenements-liste`, { waitUntil: 'networkidle' })
  await page.locator('[data-sim="event-create"]').click()
  await page.waitForTimeout(300)
  const formMeta = await page.locator('.form-card .meta').first().textContent()
  const createId = (formMeta || '').match(/evt-\d+/)?.[0]
  check('Create ≠ atelier', !!createId && createId !== 'evt-atelier', formMeta)

  const orga = await page.locator('input[data-field="orgLabel"]').inputValue()
  const ville = await page.locator('input[data-field="ville"]').inputValue()
  check('Step1 orga Rica', orga === 'Rica', orga)
  check('Step1 ville Kapan', ville === 'Kapan', ville)

  await page.locator('[data-sim="event-form-next"]').click()
  await page.waitForTimeout(200)
  check('Step2 has date début', (await page.locator('[data-field="dateLabel"]').count()) === 1)
  check('Step2 has date fin', (await page.locator('[data-field="dateEndLabel"]').count()) === 1)
  check('Step2 has priceMode', (await page.locator('[data-field="priceMode"]').count()) === 1)
  check('Step2 has Précédent', (await page.locator('[data-sim="event-form-prev"]').count()) === 1)

  await page.locator('[data-sim="event-form-next"]').click()
  await page.waitForTimeout(200)
  check('Step3 deadline', (await page.locator('[data-field="inscriptionDeadline"]').count()) === 1)
  check('Step3 conditions', (await page.locator('[data-field="conditions"]').count()) === 1)

  // Admin refuse with motif
  await setRole('admin-kapan')
  await page.goto(`${BASE}/#evenements-a-valider`, { waitUntil: 'networkidle' })
  const refuseBtn = page.locator('[data-sim^="event-refuse-ask:"]').first()
  check('Refuse button present', (await refuseBtn.count()) > 0)
  if (await refuseBtn.count()) {
    await refuseBtn.click()
    await page.waitForTimeout(300)
    check('Motif screen opened', await page.locator('[data-field="motif"]').count())
    await page.fill('[data-field="motif"]', 'Hors charte municipale')
    await page.locator('[data-sim^="event-refuse-confirm:"]').click()
    await page.waitForTimeout(400)
    const toast = await toastText()
    check('Refuse toast', /refusé/i.test(toast), toast)
  }

  // ——— MODÉRATION ———
  await page.goto(`${BASE}/#admin-moderation`, { waitUntil: 'networkidle' })
  check('Mod filters', (await page.locator('[data-sim="mod-filter:open"]').count()) === 1)
  check('No data-sim=signalement rows', (await page.locator('[data-sim="signalement"]').count()) === 0)
  const caseBtn = page.locator('[data-open-mod-case]').first()
  check('Case row present', (await caseBtn.count()) > 0)
  await caseBtn.click()
  await page.waitForTimeout(300)
  const caseHtml = await page.locator('.form-card').innerHTML()
  check('Case dossier title', /Dossier de modération/.test(caseHtml))
  check('Case has Classer', /Classer sans suite/.test(caseHtml))
  const toastAfterCase = await toastText()
  check('No Signalement envoyé toast', !/Signalement envoyé/.test(toastAfterCase), toastAfterCase)

  // ——— ANNUAIRES ———
  await page.goto(`${BASE}/#admin-annuaires`, { waitUntil: 'networkidle' })
  await page.locator('[data-sim="annuaire-rubrique:education"]').click()
  await page.waitForTimeout(300)
  const rubHtml = await page.locator('.phone-scroll').innerHTML()
  check('Éducation not stub', !/Liste admin \(stub\)/.test(rubHtml) && /École primaire/.test(rubHtml), rubHtml.slice(0, 120))
  await page.locator('[data-sim="fiche-create:education"]').click()
  await page.waitForTimeout(300)
  const nameVal = await page.locator('[data-field="fiche-name"]').inputValue()
  check('Fiche create empty', nameVal === '', `value="${nameVal}"`)

  // ——— PUBLICATIONS ———
  await page.goto(`${BASE}/#admin-mairie`, { waitUntil: 'networkidle' })
  check('Pubs list from store', /Horaires d’accueil/.test(await page.content()))
  await page.locator('[data-sim="pub-create"]').click()
  await page.waitForTimeout(300)
  const pubTitle = await page.locator('[data-field="pub-title"]').inputValue()
  check('Pub create empty', pubTitle === '', pubTitle)

  // ——— RDV ———
  await page.goto(`${BASE}/#admin-rdv`, { waitUntil: 'networkidle' })
  await page.locator('[data-sim="rdv-admin-tab:motifs"]').click()
  await page.waitForTimeout(200)
  check('Admin motifs list', /Carte d’identité/.test(await page.content()))

  await setRole('habitant')
  await page.goto(`${BASE}/#mairie-rdv`, { waitUntil: 'networkidle' })
  // clear prior bookings for clean test
  await page.evaluate(() => {
    try {
      const raw = sessionStorage.getItem('ma-ville-rdv-store')
      if (raw) {
        const s = JSON.parse(raw)
        s.bookings = (s.bookings || []).filter((b) => b.userId !== 'user-rica')
        sessionStorage.setItem('ma-ville-rdv-store', JSON.stringify(s))
      }
      sessionStorage.setItem(
        'ma-ville-rdv-pick',
        JSON.stringify({ motifId: 'motif-cni', day: 27, slot: '09:30' })
      )
    } catch {}
  })
  await page.goto(`${BASE}/#mairie-rdv-suite`, { waitUntil: 'networkidle' })
  await page.locator('[data-sim="rdv-confirm"]').click()
  await page.waitForTimeout(400)
  await page.goto(`${BASE}/#mairie-rdv`, { waitUntil: 'networkidle' })
  const rdvHtml = await page.locator('.phone-scroll').innerHTML()
  check('Booking in en cours', /Rendez-vous en cours/.test(rdvHtml) && /27 mai 2026/.test(rdvHtml), rdvHtml.slice(0, 150))

  // ——— Signalements Q/A still works ———
  await page.goto(`${BASE}/#signalements`, { waitUntil: 'networkidle' })
  check('Signalements screen', /Signalement/i.test(await page.content()))

  // ——— app-chrome on mairie ———
  await page.goto(`${BASE}/#mairie-accueil`, { waitUntil: 'networkidle' })
  check('app-chrome present', (await page.locator('.app-chrome').count()) > 0)

  // Screenshot shell
  await page.goto(`${BASE}/#admin-home`, { waitUntil: 'networkidle' })
  await page.locator('.phone').screenshot({
    path: path.join(outDir, 'ma-ville-wireframe-shell.png'),
  })
  // also copy to media store path later
  check('Screenshot taken', fs.existsSync(path.join(outDir, 'ma-ville-wireframe-shell.png')))
} catch (err) {
  check('Script error', false, err?.message || String(err))
} finally {
  const passed = results.filter((r) => r.ok).length
  const failed = results.filter((r) => !r.ok).length
  const out = { passed, failed, results }
  fs.writeFileSync(path.join(outDir, 'verify-quatre-ensembles-1001k.json'), JSON.stringify(out, null, 2))
  console.log(`\n${passed} passed, ${failed} failed`)
  await browser.close()
  process.exit(failed ? 1 : 0)
}
