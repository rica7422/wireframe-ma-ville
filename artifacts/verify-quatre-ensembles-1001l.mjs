/**
 * Playwright verification — quatre ensembles build 1001-l
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
  results.push({ name, ok: !!ok, detail: String(detail).slice(0, 240) })
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? ' — ' + detail : ''}`)
}

const browser = await chromium.launch({
  executablePath: '/usr/local/bin/google-chrome',
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
})
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })

/** Full document load so module-level hydrate() picks up sessionStorage writes. */
async function hardGoto(hash) {
  const h = hash.startsWith('#') ? hash : `#${hash}`
  await page.goto(`${BASE}/?v=${Date.now()}${h}`, { waitUntil: 'networkidle' })
}

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
    'Stamp 1001-l quatre-ensembles-final',
    /1001-l/.test(stamp || '') && /quatre-ensembles-final/.test(stamp || ''),
    stamp
  )

  // ——— ÉVÉNEMENTS create + steps ———
  await setRole('habitant')
  await page.goto(`${BASE}/#evenements-liste`, { waitUntil: 'networkidle' })
  await page.locator('[data-sim="event-create"]').click()
  await page.waitForTimeout(300)
  const formMeta = await page.locator('.form-card .meta').first().textContent()
  const createId = (formMeta || '').match(/evt-\d+/)?.[0]
  check('Create ≠ atelier', !!createId && createId !== 'evt-atelier', formMeta)

  await page.fill('[data-field="title"]', 'Fête du quartier test')
  await page.locator('[data-sim="event-form-next"]').click()
  await page.waitForTimeout(200)
  check('Step2 Précédent', (await page.locator('[data-sim="event-form-prev"]').count()) === 1)
  await page.fill('[data-field="dateLabel"]', 'Samedi 20 juin 2026')
  await page.fill('[data-field="lieu"]', 'Place centrale')
  await page.locator('[data-sim="event-form-next"]').click()
  await page.waitForTimeout(200)
  await page.locator('[data-sim="event-submit-validation"]').click()
  await page.waitForTimeout(400)
  check('Submit validation toast', /validation/i.test(await toastText()), await toastText())

  // ——— Published revision keeps public ———
  await page.evaluate(() => {
    const raw = sessionStorage.getItem('ma-ville-event-store') || localStorage.getItem('ma-ville-event-store')
    const store = raw ? JSON.parse(raw) : {}
    const id = 'evt-atelier'
    if (store[id]) {
      store[id].publication = 'published'
      store[id].origin = 'citizen'
      store[id].authorId = 'user-rica'
      store[id].title = 'Atelier créatif PUBLIC'
      store[id].pendingRevision = null
      store[id].revisionStatus = null
    }
    sessionStorage.setItem('ma-ville-event-store', JSON.stringify(store))
    localStorage.setItem('ma-ville-event-store', JSON.stringify(store))
    sessionStorage.setItem('ma-ville-event-edit', id)
    sessionStorage.setItem('ma-ville-event-form-step', '1')
  })
  await hardGoto('#evenement-form')
  await page.waitForTimeout(200)
  await page.fill('[data-field="title"]', 'Atelier RÉVISION')
  // jump to step 3
  await page.locator('[data-sim="event-form-step:3"]').click()
  await page.waitForTimeout(200)
  await page.locator('[data-sim="event-submit-validation"]').click()
  await page.waitForTimeout(400)
  check('Revision toast', /révision|agenda public/i.test(await toastText()), await toastText())

  const after = await page.evaluate(() => {
    const store = JSON.parse(sessionStorage.getItem('ma-ville-event-store') || '{}')
    const e = store['evt-atelier']
    return e
      ? {
          title: e.title,
          revTitle: e.pendingRevision?.title,
          revStatus: e.revisionStatus,
          pub: e.publication,
        }
      : null
  })
  check(
    'Public title unchanged',
    after?.title === 'Atelier créatif PUBLIC' && after?.revTitle === 'Atelier RÉVISION',
    JSON.stringify(after)
  )
  check('Revision pending + still published', after?.revStatus === 'pending' && after?.pub === 'published', JSON.stringify(after))

  await setRole('admin-kapan')
  await page.goto(`${BASE}/#evenements-a-valider`, { waitUntil: 'networkidle' })
  const queueHtml = await page.locator('.phone-scroll').innerHTML()
  check('Queue shows revision', /Révision d’un événement publié|Atelier RÉVISION/.test(queueHtml), queueHtml.slice(0, 160))

  // ——— MODÉRATION ———
  await page.goto(`${BASE}/#admin-moderation`, { waitUntil: 'networkidle' })
  const caseBtn = page.locator('[data-open-mod-case]').first()
  check('Case row present', (await caseBtn.count()) > 0)
  await caseBtn.click()
  await page.waitForTimeout(300)
  const caseHtml = await page.locator('.phone-scroll').innerHTML()
  check('Case dossier', /Classer sans suite|Dossier/.test(caseHtml))
  check('No Signalement toast', !/Signalement envoyé/.test(await toastText()), await toastText())

  // ——— ANNUAIRES ———
  await page.goto(`${BASE}/#admin-annuaires`, { waitUntil: 'networkidle' })
  const annHtml = await page.locator('.phone-scroll').innerHTML()
  check('Autres rubriques form', /Ajouter une rubrique/.test(annHtml))
  await page.locator('[data-sim="annuaire-rubrique:education"]').click()
  await page.waitForTimeout(200)
  check('Éducation fiches', /École primaire/.test(await page.locator('.phone-scroll').innerHTML()))

  await page.goto(`${BASE}/#sante-hopital-details`, { waitUntil: 'networkidle' })
  const hop = await page.locator('.phone-scroll').innerHTML()
  check('Hôpital no Coordonnées…', !/Coordonnées…/.test(hop) && /Grand Hôpital/.test(hop))

  // ——— PUBLICATIONS ———
  await page.goto(`${BASE}/#admin-mairie`, { waitUntil: 'networkidle' })
  check('Pubs BO list', /Horaires d’accueil/.test(await page.content()))

  // ——— RDV displace + free slot ———
  await setRole('habitant')
  await page.evaluate(() => {
    const DEFAULT_DISPOS = {
      1: ['09:00', '09:30', '10:00', '11:00', '14:00', '14:30', '15:00', '16:00'],
      2: ['09:00', '09:30', '10:00', '11:00', '14:00', '14:30', '15:00', '16:00'],
      3: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
      4: ['09:00', '09:30', '10:00', '11:00', '14:00', '14:30', '15:00', '16:00'],
      5: ['09:00', '09:30', '10:00', '11:00', '14:00', '15:00'],
    }
    const DEFAULT_MOTIFS = [
      { id: 'motif-cni', label: 'Carte d’identité / Passeport', duration: 30, active: true },
      { id: 'motif-etat-civil', label: 'État civil', duration: 20, active: true },
    ]
    let motifs = DEFAULT_MOTIFS
    let dispos = DEFAULT_DISPOS
    let indispos = []
    try {
      const raw = sessionStorage.getItem('ma-ville-rdv-store') || localStorage.getItem('ma-ville-rdv-store')
      if (raw) {
        const s = JSON.parse(raw)
        if (Array.isArray(s.motifs) && s.motifs.length) motifs = s.motifs
        if (s.dispos && Object.keys(s.dispos).length) dispos = s.dispos
        if (Array.isArray(s.indispos)) indispos = s.indispos
      }
    } catch {}
    const store = {
      motifs,
      dispos,
      indispos,
      bookings: [
        {
          id: 'rdv-test-move',
          motifId: 'motif-cni',
          slot: '2026-05-27T09:00',
          slotLabel: '27 mai 2026 · 09:00',
          user: 'Rica',
          userId: 'user-rica',
          status: 'confirmed',
          cancelMotif: '',
        },
      ],
    }
    sessionStorage.setItem('ma-ville-rdv-store', JSON.stringify(store))
    localStorage.setItem('ma-ville-rdv-store', JSON.stringify(store))
    sessionStorage.setItem(
      'ma-ville-rdv-pick',
      JSON.stringify({ motifId: 'motif-cni', day: 27, slot: '10:00', moveId: 'rdv-test-move' })
    )
  })
  await hardGoto('#mairie-rdv-suite')
  const confirmLabel = await page.locator('[data-sim="rdv-confirm"]').textContent()
  check('Confirm displace label', /déplacement/i.test(confirmLabel || ''), confirmLabel)
  await page.locator('[data-sim="rdv-confirm"]').click()
  await page.waitForTimeout(400)
  const moved = await page.evaluate(() => {
    const s = JSON.parse(sessionStorage.getItem('ma-ville-rdv-store') || '{}')
    const b = (s.bookings || []).find((x) => x.id === 'rdv-test-move')
    const rica = (s.bookings || []).filter((x) => x.userId === 'user-rica' && x.status === 'confirmed')
    return { b, count: rica.length }
  })
  check(
    'Displace same id new slot',
    moved?.b?.slot === '2026-05-27T10:00' && moved.count === 1,
    JSON.stringify(moved)
  )

  // Cancel frees slot
  await page.goto(`${BASE}/#mairie-rdv`, { waitUntil: 'networkidle' })
  await page.locator('[data-sim="rdv-annuler:rdv-test-move"]').click()
  await page.waitForTimeout(300)
  const freed = await page.evaluate(() => {
    const s = JSON.parse(sessionStorage.getItem('ma-ville-rdv-store') || '{}')
    const b = (s.bookings || []).find((x) => x.id === 'rdv-test-move')
    return b?.status
  })
  check('Cancel frees booking', freed === 'cancelled', freed)

  await page.evaluate(() => {
    sessionStorage.setItem('ma-ville-rdv-pick', JSON.stringify({ motifId: 'motif-cni', day: 27 }))
  })
  await hardGoto('#mairie-rdv')
  const slotsHtml = await page.locator('.phone-scroll').innerHTML()
  // Booking was moved to 10:00 then cancelled — that Wed slot must reappear
  check('Cancelled slot available again', /data-sim="rdv-pick-slot:10:00"/.test(slotsHtml), '10:00 chip after cancel')

  // Admin dispos editor
  await setRole('admin-kapan')
  await page.goto(`${BASE}/#admin-rdv`, { waitUntil: 'networkidle' })
  await page.locator('[data-sim="rdv-admin-tab:dispos"]').click()
  await page.waitForTimeout(200)
  await page.locator('[data-sim="rdv-dispo-edit:1"]').click()
  await page.waitForTimeout(200)
  check('Dispo textarea', (await page.locator('[data-field="dispo-slots"]').count()) === 1)

  // Screenshot
  await page.goto(`${BASE}/#admin-home`, { waitUntil: 'networkidle' })
  const shot = path.join(outDir, 'ma-ville-wireframe-shell.png')
  await page.locator('.shell').screenshot({ path: shot })
  fs.copyFileSync(shot, path.join(mediaDir, 'ma-ville-wireframe-shell.png'))
  check('Screenshot media', fs.existsSync(path.join(mediaDir, 'ma-ville-wireframe-shell.png')))
} catch (err) {
  check('Script error', false, err?.message || String(err))
} finally {
  const passed = results.filter((r) => r.ok).length
  const failed = results.filter((r) => !r.ok).length
  const out = { passed, failed, results }
  fs.writeFileSync(path.join(outDir, 'verify-quatre-ensembles-1001l.json'), JSON.stringify(out, null, 2))
  console.log(`\n${passed} passed, ${failed} failed`)
  await browser.close()
  process.exit(failed ? 1 : 0)
}
