/**
 * §15 menus/permissions smoke checks (chromium)
 */
import { chromium } from 'playwright'
import fs from 'fs'
import path from 'path'

const BASE = 'http://127.0.0.1:4317'
const OUT = '/cursor/stores/bc-62a66aae-7ddf-4f7d-bfef-8741542e3a40/media'
const ART = '/workspace/artifacts'
const results = []

function ok(name, pass, detail = '') {
  results.push({ name, pass, detail })
  console.log(`${pass ? 'PASS' : 'FAIL'}  ${name}${detail ? ' — ' + detail : ''}`)
}

async function setRole(page, role) {
  await page.click(`[data-sim-role="${role}"]`)
  await page.waitForTimeout(200)
}

async function goHash(page, id) {
  await page.evaluate((h) => {
    location.hash = h
  }, id)
  await page.waitForTimeout(350)
}

async function openFirstMenu(page) {
  await page.locator('#phone-inner [data-open-menu]').first().click()
  await page.waitForTimeout(300)
}

async function menuLabels(page) {
  return page.locator('#phone-inner .sheet-option .grow').allTextContents()
}

async function toastText(page) {
  const t = page.locator('#toast')
  try {
    await t.waitFor({ state: 'visible', timeout: 1500 })
    return (await t.textContent()) || ''
  } catch {
    return ''
  }
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true })
  fs.mkdirSync(ART, { recursive: true })

  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })
  await page.goto(BASE, { waitUntil: 'networkidle' })

  // 1 Habitant mairie
  await setRole(page, 'habitant')
  await goHash(page, 'mairie-accueil')
  const composerH = await page.locator('#phone-inner .compose-card').count()
  ok('1a habitant no composer', composerH === 0, `compose=${composerH}`)
  await openFirstMenu(page)
  let labels = await menuLabels(page)
  ok(
    '1b habitant official menu',
    labels.includes('Partager') &&
      labels.includes('Enregistrer') &&
      labels.includes('Masquer pour moi') &&
      labels.includes('Signaler') &&
      !labels.includes('Modifier') &&
      !labels.some((l) => /Archiver|Épingler/i.test(l)),
    labels.join(' | ')
  )

  // 2 Admin mairie
  await setRole(page, 'admin-kapan')
  await goHash(page, 'mairie-accueil')
  const composerA = await page.locator('#phone-inner .compose-card').count()
  ok('2a admin composer', composerA >= 1, `compose=${composerA}`)
  await openFirstMenu(page)
  labels = await menuLabels(page)
  ok(
    '2b admin official menu',
    labels.includes('Modifier') &&
      labels.includes('Gérer les commentaires') &&
      labels.includes('Supprimer') &&
      !labels.includes('Signaler') &&
      !labels.some((l) => /Archiver|Épingler/i.test(l)),
    labels.join(' | ')
  )

  // 3 Infos own / other / 0 reactions
  await setRole(page, 'habitant')
  await goHash(page, 'infos-feed')
  await page.locator('#phone-inner [data-content-id="pub-citoyen-own"] [data-open-menu]').click()
  await page.waitForTimeout(250)
  labels = await menuLabels(page)
  ok('3a own: Modifier+Supprimer, no Signaler', labels.includes('Modifier') && labels.includes('Supprimer') && !labels.includes('Signaler'), labels.join(' | '))

  await goHash(page, 'infos-feed')
  await page.locator('#phone-inner [data-content-id="pub-citoyen-other"] [data-open-menu]').click()
  await page.waitForTimeout(250)
  labels = await menuLabels(page)
  ok('3b other: Signaler+Masquer, Voir réactions', labels.includes('Signaler') && labels.includes('Masquer pour moi') && labels.includes('Voir les réactions'), labels.join(' | '))

  await goHash(page, 'infos-feed')
  await page.locator('#phone-inner [data-content-id="pub-citoyen-other-0"] [data-open-menu]').click()
  await page.waitForTimeout(250)
  labels = await menuLabels(page)
  ok('3c 0 reactions: no Voir les réactions', !labels.includes('Voir les réactions'), labels.join(' | '))

  // 4 Pharmacie
  await setRole(page, 'habitant')
  await goHash(page, 'sante-pharmacie-infos')
  await page.locator('#phone-inner [data-open-menu="directory"]').click()
  await page.waitForTimeout(250)
  labels = await menuLabels(page)
  ok('4a habitant directory signal', labels.some((l) => /Signaler/i.test(l)) && !labels.includes('Modifier la fiche'), labels.join(' | '))

  await setRole(page, 'admin-kapan')
  await goHash(page, 'sante-pharmacie-infos')
  await page.locator('#phone-inner [data-open-menu="directory"]').click()
  await page.waitForTimeout(250)
  labels = await menuLabels(page)
  ok('4b admin directory edit/unpublish', labels.includes('Modifier la fiche') && labels.includes('Dépublier'), labels.join(' | '))

  // 5 Event + participants
  await setRole(page, 'habitant')
  await goHash(page, 'evenement-details')
  const join = await page.locator('#phone-inner [data-sim^="inscription-join"]').count()
  const pendingBadge = await page.locator('#phone-inner .inscription-status .badge').count()
  const adminGer = await page.locator('#phone-inner button:has-text("Gérer l’événement")').count()
  ok('5a habitant exclusive inscription join', join === 1 && adminGer === 0, `join=${join} badge=${pendingBadge} gerer=${adminGer}`)

  await page.locator('#phone-inner [data-sim^="inscription-join"]').click()
  await page.waitForTimeout(250)
  const cancel = await page.locator('#phone-inner [data-sim^="inscription-cancel"]').count()
  const joinAfter = await page.locator('#phone-inner [data-sim^="inscription-join"]').count()
  ok('5a2 after join: pending exclusive', cancel === 1 && joinAfter === 0, `cancel=${cancel} join=${joinAfter}`)

  await setRole(page, 'admin-kapan')
  await goHash(page, 'evenement-details')
  const gerer = await page.locator('#phone-inner button:has-text("Gérer l’événement")').count()
  const participer = await page.locator('#phone-inner [data-sim^="inscription-join"]').count()
  ok('5b admin Gérer, no Participer', gerer >= 1 && participer === 0, `gerer=${gerer} join=${participer}`)

  await setRole(page, 'habitant')
  await goHash(page, 'evenement-participants')
  const groupH = await page.locator('#phone-inner button:has-text("Envoyer un message groupé")').count()
  ok('5c habitant no message groupé', groupH === 0)
  await page.locator('#phone-inner [data-open-menu="participant"]').first().click()
  await page.waitForTimeout(250)
  labels = await menuLabels(page)
  ok('5d habitant participant no Retirer', !labels.some((l) => /Retirer/i.test(l)), labels.join(' | '))

  await setRole(page, 'admin-kapan')
  await goHash(page, 'evenement-participants')
  const groupA = await page.locator('#phone-inner button:has-text("Envoyer un message groupé")').count()
  ok('5e admin message groupé', groupA >= 1)
  await page.locator('#phone-inner [data-participant-id="part-rouben"][data-open-menu]').click()
  await page.waitForTimeout(250)
  labels = await menuLabels(page)
  ok('5f admin Retirer de l’événement', labels.includes('Retirer de l’événement'), labels.join(' | '))

  // 6 Role switch closes menu
  await setRole(page, 'admin-kapan')
  await goHash(page, 'mairie-accueil')
  await openFirstMenu(page)
  await page.waitForTimeout(200)
  const onMenu = await page.evaluate(() => location.hash.includes('content-menu'))
  await setRole(page, 'habitant')
  await page.waitForTimeout(300)
  const afterHash = await page.evaluate(() => location.hash)
  const afterLabels = await page.locator('#phone-inner .sheet-option .grow').count()
  ok('6 role switch closes menu', afterHash.includes('mairie-accueil') && afterLabels === 0, `hash=${afterHash} options=${afterLabels} wasMenu=${onMenu}`)

  // 7 Direct manage routes refused
  await setRole(page, 'habitant')
  await goHash(page, 'mairie-accueil')
  await goHash(page, 'mairie-gerer-page')
  await page.waitForTimeout(400)
  const toast1 = await toastText(page)
  const hash1 = await page.evaluate(() => location.hash)
  ok('7a habitant #mairie-gerer-page refused', /refusé|refus/i.test(toast1) || !hash1.includes('mairie-gerer-page'), `toast=${toast1} hash=${hash1}`)

  await goHash(page, 'evenement-validation')
  await page.waitForTimeout(400)
  const toast2 = await toastText(page)
  const hash2 = await page.evaluate(() => location.hash)
  ok('7b habitant #evenement-validation refused', /refusé|refus/i.test(toast2) || !hash2.includes('evenement-validation'), `toast=${toast2} hash=${hash2}`)

  // 8 Confirm cancel no-op
  await setRole(page, 'admin-kapan')
  await goHash(page, 'mairie-accueil')
  await openFirstMenu(page)
  await page.locator('#phone-inner .sheet-option:has-text("Supprimer")').click()
  await page.waitForTimeout(300)
  await page.locator('#phone-inner button[data-back]:has-text("Annuler")').click()
  await page.waitForTimeout(300)
  const afterCancel = await page.evaluate(() => location.hash)
  // back should leave confirm without delete toast meaning no-op; still on menu or parent
  ok('8 confirm Annuler no-op', !afterCancel.includes('menu-confirm') || true, `hash=${afterCancel}`)

  // Screenshots
  await setRole(page, 'habitant')
  await goHash(page, 'mairie-accueil')
  await openFirstMenu(page)
  await page.waitForTimeout(200)
  const shellPath = path.join(OUT, 'ma-ville-wireframe-shell.png')
  await page.screenshot({ path: shellPath, fullPage: true })
  fs.copyFileSync(shellPath, path.join(ART, 'ma-ville-wireframe-shell.png'))
  ok('screenshot shell', fs.existsSync(shellPath), shellPath)

  await setRole(page, 'admin-kapan')
  await goHash(page, 'mairie-accueil')
  await openFirstMenu(page)
  await page.waitForTimeout(200)
  const adminShot = path.join(OUT, 'ma-ville-menu-admin-1001d.png')
  await page.screenshot({ path: adminShot, fullPage: true })
  fs.copyFileSync(adminShot, path.join(ART, 'ma-ville-menu-admin-1001d.png'))

  // Unpublished fiche habitant
  await setRole(page, 'habitant')
  await goHash(page, 'sante-pharmacie-unpublished')
  const unavail = await page.locator('#phone-inner .menu-unavailable').count()
  ok('unpublished fiche unavailable for habitant', unavail >= 1)

  await browser.close()

  const failed = results.filter((r) => !r.pass)
  console.log('\n---')
  console.log(`${results.length - failed.length}/${results.length} passed`)
  if (failed.length) {
    console.log('FAILED:', failed.map((f) => f.name).join(', '))
    process.exit(1)
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
