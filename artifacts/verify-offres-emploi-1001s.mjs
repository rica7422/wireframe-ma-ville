/**
 * Playwright smoke — Offres d’emploi (build 1001-s)
 * Public hub/cats/filters/details + apply methods + admin BO/forms + stamp
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

async function setRole(role) {
  await page.evaluate((r) => {
    sessionStorage.setItem('ma-ville-sim-role', r)
  }, role)
  const btn = page.locator(`[data-sim-role="${role}"]`)
  if ((await btn.count()) > 0) {
    await btn.first().click()
    await page.waitForTimeout(200)
  } else {
    await page.reload({ waitUntil: 'networkidle' })
    await page.waitForTimeout(250)
  }
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

async function accentIsBlue() {
  return page.evaluate(() => {
    const phone = document.querySelector('.phone')
    if (!phone) return { ok: false, detail: 'no phone' }
    const accent = getComputedStyle(phone).getPropertyValue('--accent').trim()
    const theme = phone.getAttribute('data-theme')
    const ok = theme === 'emplois' || /1d4ed8/i.test(accent) || accent.includes('29, 78, 216')
    return { ok, detail: `theme=${theme} accent=${accent}` }
  })
}

try {
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(200)
  check('App opens', (await page.locator('.phone-inner, .phone').count()) > 0)

  const stamp = await page.locator('.proto-tag').textContent().catch(() => '')
  check('Stamp contains 1001-s', /1001-s/.test(stamp || ''), stamp)

  await setRole('habitant')

  // ——— Accueil ———
  await gotoHash('#emplois-liste')
  check('On #emplois-liste', /emplois-liste/.test(await page.evaluate(() => location.hash)))
  const accentHub = await accentIsBlue()
  check('Accent emplois #1D4ED8 on hub', accentHub.ok, accentHub.detail)
  check(
    'Banner copy',
    (await page.getByText('Trouvez un emploi près de chez vous').count()) >= 1
  )
  check(
    '4 category access',
    (await page.locator('.phone-inner').getByRole('button', { name: 'Emplois', exact: true }).count()) >= 1 &&
      (await page.locator('.phone-inner').getByRole('button', { name: 'Stages', exact: true }).count()) >= 1 &&
      (await page.locator('.phone-inner').getByRole('button', { name: 'Alternance', exact: true }).count()) >= 1
  )
  check(
    'Habitant: no create shortcut on hub',
    (await page.locator('.phone-inner').getByText('Créer une offre').count()) === 0
  )
  check(
    'Public list shows Voir l’offre',
    (await page.locator('[data-open-offre]').count()) >= 1
  )
  await savePhoneShot('1001-s-emplois-accueil.png')

  // ——— Catégorie ———
  await page.locator('.phone-inner').getByRole('button', { name: 'Stages', exact: true }).first().click()
  await page.waitForTimeout(300)
  check('Category Stages hash', /emplois-cat-stages/.test(await page.evaluate(() => location.hash)))
  check(
    'Category has no banner re-show',
    (await page.getByText('Trouvez un emploi près de chez vous').count()) === 0
  )
  await savePhoneShot('1001-s-emplois-cat-stages.png')

  // ——— Filtres ———
  await gotoHash('#emplois-filtres')
  check('Filtres panel', (await page.getByText('Filtres des offres').count()) >= 1)
  await page.locator('[data-sim="offre-filters-apply"]').click()
  await page.waitForTimeout(300)
  check('Apply filters → liste', /emplois-liste/.test(await page.evaluate(() => location.hash)))

  // ——— Détail + apply email ———
  await page.evaluate(() => {
    try {
      sessionStorage.setItem('ma-ville-emploi-open', 'offre-1')
    } catch {
      /* ignore */
    }
  })
  await gotoHash('#emploi-details')
  check('Detail offre-1 title', (await page.getByText('Chargé(e) de communication').count()) >= 1)
  check(
    'Apply CTA courriel',
    (await page.locator('[data-sim="offre-apply-email:offre-1"]').count()) >= 1
  )
  check(
    'No « candidature envoyée » copy',
    (await page.getByText(/candidature envoyée/i).count()) === 0
  )
  const toastPromise = page.waitForFunction(
    () => {
      const t = document.getElementById('toast')
      return t && !t.hidden && /messagerie|envoyé automatiquement/i.test(t.textContent || '')
    },
    { timeout: 4000 }
  ).catch(() => null)
  await page.locator('[data-sim="offre-apply-email:offre-1"]').click()
  await toastPromise
  const toastText = await page.locator('#toast').textContent().catch(() => '')
  check('Apply email toast (not sent)', /automatiquement|messagerie/i.test(toastText || ''), toastText)
  await savePhoneShot('1001-s-emploi-details-email.png')

  // Title-row ⋯ (not full header)
  check(
    '⋯ on job title row',
    (await page.locator('.event-title-row [data-open-menu="offre"]').count()) >= 1
  )
  const fullHeaderEllipsis = await page.evaluate(() => {
    const full = document.querySelector('.phone-header-full, .phone-header:not(.phone-header-local)')
    if (!full) return 0
    return [...full.querySelectorAll('button')].filter((b) => (b.textContent || '').includes('⋯')).length
  })
  check('No ⋯ in full page header', fullHeaderEllipsis === 0, `n=${fullHeaderEllipsis}`)

  // Similaires rail (layout 1001-r)
  await page.evaluate(() => {
    const sc = document.querySelector('.phone-scroll')
    if (sc) sc.scrollTop = sc.scrollHeight
  })
  await page.waitForTimeout(250)
  const simOk = await page.evaluate(() => {
    const rail = document.querySelector('.similaires-rail, .h-scroll')
    const heading = [...document.querySelectorAll('.sec')].some((el) =>
      /Offres similaires/i.test(el.textContent || '')
    )
    if (!rail || !heading) return { ok: false, detail: `rail=${!!rail} heading=${heading}` }
    const rect = rail.getBoundingClientRect()
    return { ok: rect.height > 40, detail: `h=${Math.round(rect.height)}` }
  })
  check('Similaires rail visible', simOk.ok, simOk.detail)
  await savePhoneShot('1001-s-emploi-similaires.png')

  // ——— Apply URL ———
  await page.evaluate(() => sessionStorage.setItem('ma-ville-emploi-open', 'offre-2'))
  await gotoHash('#emploi-details')
  check(
    'Apply CTA site',
    (await page.locator('[data-sim="offre-apply-url:offre-2"]').count()) >= 1
  )

  // ——— Closed ———
  await page.evaluate(() => sessionStorage.setItem('ma-ville-emploi-open', 'offre-3'))
  await gotoHash('#emploi-details')
  check(
    'Closed notice',
    (await page.getByText(/n’accepte plus de candidatures/i).count()) >= 1
  )
  check(
    'Closed: no apply primary',
    (await page.locator('[data-sim^="offre-apply-"]').count()) === 0
  )
  await savePhoneShot('1001-s-emploi-cloturee.png')

  // ——— Auto-closed by deadline (offre-7) ———
  await page.evaluate(() => sessionStorage.setItem('ma-ville-emploi-open', 'offre-7'))
  await gotoHash('#emploi-details')
  check(
    'Past deadline → closed UI',
    (await page.getByText(/n’accepte plus de candidatures/i).count()) >= 1 ||
      (await page.getByText('Clôturée').count()) >= 1
  )

  // ——— Modalités ———
  // reopen a modalites published if any; offre-3 is closed — use create? skip if none
  // offre with modalites published may be none; check list doesn't invent distance
  await gotoHash('#emplois-liste')
  await page.locator('[data-sim="offre-quick:proximite"]').click()
  await page.waitForTimeout(200)
  check('Quick proximité does not invent km', (await page.getByText(/km/i).count()) === 0)

  // ——— Admin ———
  await setRole('admin-kapan')
  await gotoHash('#emplois-liste')
  check(
    'Admin shortcut Créer on public hub',
    (await page.locator('[data-sim="offre-create"]').count()) >= 1
  )
  await savePhoneShot('1001-s-emplois-accueil-admin.png')

  await gotoHash('#admin-offres')
  check('BO list', (await page.getByText('Créer une offre').count()) >= 1)
  check('BO tabs', (await page.locator('[data-sim^="offre-admin-tab:"]').count()) >= 4)
  await page.locator('[data-sim="offre-admin-tab:brouillons"]').click()
  await page.waitForTimeout(250)
  check('BO draft visible', (await page.getByText(/Animateur|Brouillon|Sans titre/i).count()) >= 1)
  await savePhoneShot('1001-s-admin-offres.png')

  await page.locator('[data-sim="offre-create"]').first().click()
  await page.waitForTimeout(350)
  check('Form screen', /emploi-form/.test(await page.evaluate(() => location.hash)))
  check('Form step 1', (await page.getByText(/1 · Employeur/i).count()) >= 1)
  await page.locator('[data-field="offre-employer"]').fill('Entreprise Démo Kapan')
  await page.locator('[data-field="offre-title"]').fill('Poste test wireframe')
  await page.locator('[data-field="offre-location"]').fill('Centre-ville')
  await page.locator('[data-sim="offre-step:2"]').click()
  await page.waitForTimeout(250)
  check('Form step 2', (await page.getByText(/2 · Description/i).count()) >= 1)
  await page.locator('[data-field="offre-presentation"]').fill('Présentation démo pour publication.')
  await page.locator('[data-sim="offre-step:3"]').click()
  await page.waitForTimeout(200)
  await page.locator('[data-sim="offre-step:4"]').click()
  await page.waitForTimeout(200)
  check('Form step 4 candidature', (await page.getByText(/4 · Candidature/i).count()) >= 1)
  await page.locator('[data-field="offre-apply-email"]').fill('demo@example.com')
  await savePhoneShot('1001-s-emploi-form.png')

  const editId = await page.evaluate(() => sessionStorage.getItem('ma-ville-emploi-edit'))
  if (editId) {
    await page.locator(`[data-sim="offre-publish:${editId}"]`).click()
    await page.waitForTimeout(400)
    check(
      'Publish → details',
      /emploi-details/.test(await page.evaluate(() => location.hash)),
      await page.evaluate(() => location.hash)
    )
    check('Published title shown', (await page.getByText('Poste test wireframe').count()) >= 1)
  } else {
    check('Publish → details', false, 'no edit id')
  }

  // Draft inaccessible for habitant
  await setRole('habitant')
  await page.evaluate(() => sessionStorage.setItem('ma-ville-emploi-open', 'offre-6'))
  await gotoHash('#emploi-details')
  check(
    'Habitant blocked on draft',
    (await page.getByText(/n’est plus disponible/i).count()) >= 1
  )

  // Non-regression layout spacing on annonce
  await gotoHash('#annonce-details')
  const pl = await page.evaluate(() => {
    const el = document.querySelector('.phone-scroll')
    return el ? parseFloat(getComputedStyle(el).paddingLeft) : null
  })
  check('Non-régression padding 1001-r', pl != null && Math.abs(pl - 20) <= 1.5, `pl=${pl}`)

  const criticalErrors = pageErrors.filter(
    (m) => !/favicon|ResizeObserver|net::ERR/i.test(m || '')
  )
  check('No critical page errors', criticalErrors.length === 0, criticalErrors.slice(0, 3).join(' | '))
} catch (err) {
  check('Suite threw', false, err?.message || String(err))
} finally {
  const passed = results.filter((r) => r.ok).length
  const failed = results.filter((r) => !r.ok).length
  const summary = { stamp: '1001-s', base: BASE, passed, failed, total: results.length, results }
  fs.writeFileSync(path.join(outDir, 'verify-offres-emploi-1001s.json'), JSON.stringify(summary, null, 2))
  console.log(`\n${passed}/${results.length} passed (${failed} failed)`)
  await browser.close()
  if (failed) process.exit(1)
}
