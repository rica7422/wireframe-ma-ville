/**
 * Playwright smoke — messagerie / groupes / clubs build 1001-m
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
  results.push({ name, ok: !!ok, detail: String(detail).slice(0, 280) })
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
  await page.waitForTimeout(150)
}

try {
  await gotoHash('#accueil-kapan')
  await setRole('habitant')

  const stamp = await page.locator('.proto-tag').textContent()
  check('Stamp contains 1001-m', /1001-m/.test(stamp || ''), stamp)

  // ——— Messages MIASIN list ———
  await gotoHash('#messages')
  const msgHtml = await page.locator('.phone-scroll').innerHTML()
  check(
    'Messages list shows Anahit/Armen (not « Conversation MIASIN »)',
    /Anahit/.test(msgHtml) &&
      /Armen/.test(msgHtml) &&
      !/Conversation MIASIN/.test(msgHtml) &&
      !/Dernier message…/.test(msgHtml),
    msgHtml.replace(/\s+/g, ' ').slice(0, 200)
  )

  // Open Anahit thread
  const anahitRow = page.locator('[data-sim="msg-open:msg-miasin-anahit"]')
  check('Anahit row present', (await anahitRow.count()) === 1)
  await anahitRow.click()
  await page.waitForTimeout(250)

  const threadFooter = await page.locator('.phone-footer').count()
  const phoneFooterVisible = await page.evaluate(() => {
    const f = document.querySelector('.phone-footer')
    if (!f) return false
    const style = getComputedStyle(f)
    return style.display !== 'none' && f.children.length > 0 && f.offsetParent !== null
  })
  // Thread uses footer: '' — either no footer node or empty
  const footerHtml = (await page.locator('.phone .phone-footer').innerHTML().catch(() => '')) || ''
  check(
    'Anahit thread: no phone footer nav',
    !phoneFooterVisible || !footerHtml.trim() || !(await page.locator('.phone-footer .tabbar, .phone-footer [data-go]').count()),
    `footerVisible=${phoneFooterVisible} len=${footerHtml.length}`
  )

  const sendMarker = `Smoke 1001-m ${Date.now()}`
  await page.fill('[data-field="msg-text"]', sendMarker)
  await page.locator('[data-sim="msg-send"]').click()
  await page.waitForTimeout(300)
  const chatHtml = await page.locator('.chat').innerHTML()
  check('Sent message appears in chat', chatHtml.includes(sendMarker), sendMarker)

  // ——— Ma Ville tab ———
  await gotoHash('#messages-maville')
  // Also try tab click path
  const mavilleHtml = await page.locator('.phone-scroll').innerHTML()
  check(
    'Ma Ville tab: Lilit / Mairie (distinct)',
    /Lilit/.test(mavilleHtml) && /Mairie/.test(mavilleHtml) && !/Anahit/.test(mavilleHtml),
    mavilleHtml.replace(/\s+/g, ' ').slice(0, 200)
  )

  // ——— Groupes ———
  await gotoHash('#communautes-groupes')
  const grpHtml = await page.locator('.phone-scroll').innerHTML()
  check(
    '#communautes-groupes: Découvrir / Mes groupes',
    /Découvrir/.test(grpHtml) && /Mes groupes/.test(grpHtml),
    grpHtml.replace(/\s+/g, ' ').slice(0, 160)
  )
  check('Randonneurs listed', /Randonneurs/.test(grpHtml))

  const rando = page.locator('[data-sim="comm-open:grp-randonnee"]')
  check('Open Randonneurs control', (await rando.count()) === 1)
  await rando.click()
  await page.waitForTimeout(250)
  const randoPage = await page.locator('.phone-scroll').innerHTML()
  check('Randonneurs page open', /Randonneurs de Kapan/.test(randoPage), randoPage.replace(/\s+/g, ' ').slice(0, 120))

  const joinBtn = page.locator('[data-sim^="comm-join:"]')
  if (await joinBtn.count()) {
    await joinBtn.first().click()
    await page.waitForTimeout(250)
    const afterJoin = await page.locator('.phone-scroll').innerHTML()
    check(
      'Rejoindre applied (or pending)',
      /Quitter|Demande en attente|Publications/.test(afterJoin),
      afterJoin.replace(/\s+/g, ' ').slice(0, 120)
    )
  } else {
    check('Already member (Rejoindre not needed)', /Quitter le groupe|Publications/.test(randoPage))
  }

  // ——— Clubs blue section ———
  await gotoHash('#communautes-clubs')
  const clubsTheme = await page.locator('.phone').getAttribute('data-theme')
  const accent = await page.evaluate(() =>
    getComputedStyle(document.querySelector('.phone')).getPropertyValue('--accent').trim()
  )
  const clubsHtml = await page.locator('.phone-scroll').innerHTML()
  check(
    '#communautes-clubs works',
    /Découvrir/.test(clubsHtml) && /Mes clubs/.test(clubsHtml) && /Club/.test(clubsHtml),
    clubsHtml.replace(/\s+/g, ' ').slice(0, 160)
  )
  check(
    'Clubs blue section theme',
    clubsTheme === 'clubs' && (/1d4ed8/i.test(accent) || /rgb\(29,\s*78,\s*216\)/i.test(accent)),
    `theme=${clubsTheme} accent=${accent}`
  )

  // ——— Non-regression admin screens ———
  await setRole('admin-kapan')
  for (const hash of ['#evenements-a-valider', '#admin-moderation', '#admin-rdv', '#admin-annuaires']) {
    const beforeErr = pageErrors.length
    await gotoHash(hash)
    const body = await page.locator('.phone-scroll').innerHTML().catch(() => '')
    const crashed = pageErrors.slice(beforeErr).some((e) => /ReferenceError|is not defined|Failed to fetch|SyntaxError|Cannot find/i.test(e))
    check(
      `Non-regression ${hash} renders`,
      !!body && body.length > 40 && !crashed,
      crashed ? pageErrors.slice(beforeErr).join(' | ') : body.replace(/\s+/g, ' ').slice(0, 100)
    )
  }

  // Screenshot shell
  await setRole('habitant')
  await gotoHash('#messages')
  const shot = path.join(outDir, 'ma-ville-wireframe-shell.png')
  await page.locator('.shell').screenshot({ path: shot })
  fs.copyFileSync(shot, path.join(mediaDir, 'ma-ville-wireframe-shell.png'))
  check('Screenshot media', fs.existsSync(path.join(mediaDir, 'ma-ville-wireframe-shell.png')))

  const serious = pageErrors.filter((e) =>
    /ReferenceError|TypeError|SyntaxError|Failed to resolve|is not defined|Cannot find module|Importing a module/i.test(e)
  )
  check('No serious page JS errors', serious.length === 0, serious.slice(0, 3).join(' | ') || `${pageErrors.length} console noise`)
} catch (err) {
  check('Script error', false, err?.message || String(err))
} finally {
  const passed = results.filter((r) => r.ok).length
  const failed = results.filter((r) => !r.ok).length
  const out = {
    stamp: '1001-m',
    base: BASE,
    tunnel: 'https://implications-chelsea-wiley-easier.trycloudflare.com',
    passed,
    failed,
    pageErrors: pageErrors.slice(0, 20),
    results,
  }
  fs.writeFileSync(path.join(outDir, 'verify-messagerie-groupes-1001m.json'), JSON.stringify(out, null, 2))
  console.log(`\n${passed} passed, ${failed} failed`)
  if (pageErrors.length) console.log('Page errors:', pageErrors.slice(0, 10))
  await browser.close()
  process.exit(failed ? 1 : 0)
}
