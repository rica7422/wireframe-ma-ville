import './style.css'
import { SCREENS, NAV_TREE, navIdsForSide } from './screens.js'
import { themeFor, colorFor, sectionFor } from './theme.js'

const historyStack = []
let currentId = 'ville-bienvenue'
let navTab = 'user' // 'user' | 'admin'
/** Preserve left-panel scroll across phone-only re-renders when possible */
let savedNavScroll = 0

const ADMIN_IDS = new Set(navIdsForSide('admin'))

function toast(msg) {
  const el = document.getElementById('toast')
  el.textContent = msg
  el.hidden = false
  clearTimeout(toast._t)
  toast._t = setTimeout(() => {
    el.hidden = true
  }, 2200)
}

function go(id, { push = true } = {}) {
  if (!SCREENS[id]) {
    toast(`Écran inconnu : ${id}`)
    return
  }
  if (push && currentId && currentId !== id) historyStack.push(currentId)
  currentId = id
  navTab = ADMIN_IDS.has(id) ? 'admin' : 'user'
  if (location.hash.slice(1) !== id) {
    history.replaceState(null, '', `#${id}`)
  }
  render({ focusActive: true })
}

function back() {
  const prev = historyStack.pop()
  if (prev) {
    currentId = prev
    navTab = ADMIN_IDS.has(prev) ? 'admin' : 'user'
    render({ focusActive: true })
  } else {
    go('ville-bienvenue', { push: false })
  }
}

function handleSim(kind) {
  const [action, arg] = String(kind).split(':')
  const map = {
    miasin: 'Retour MIASIN (simulé) — MIASIN hors scope',
    appeler: arg ? `Appel simulé → ${arg}` : 'Appel simulé',
    itineraire: 'Itinéraire simulé (carte externe)',
    message: 'Envoi de message simulé',
    'message-groupe': 'Message groupé simulé',
    inviter: 'Invitation simulée',
    publier: 'Publication simulée',
    commentaire: 'Commentaire envoyé (simulé)',
    partage: 'Partage simulé',
    suivre: 'Suivi simulé',
    participation: 'Participation mise à jour (simulé)',
    rdv: 'Rendez-vous — suite À préciser (simulé)',
    'rdv-annuler': 'Rendez-vous annulé (simulé) — bloc masqué',
    position: 'Partage de position (simulé)',
    upload: 'Upload photo (simulé)',
    sauver: 'Enregistrement admin (simulé)',
    'publier-admin': 'Publication admin (simulé — À préciser)',
    'filtre-admin': 'Filtres admin — À préciser',
    enregistrer: 'Ajout aux enregistrements (simulé)',
    signalement: 'Signalement envoyé (simulé — À préciser)',
    quitter: 'Quitter Ma Mairie (simulé — À préciser)',
    supprimer: 'Suppression (simulée — À préciser)',
    media: 'Ajout média (simulé)',
    ajouter: 'Ajout (simulé)',
    agrandir: 'Agrandir la carte (simulé)',
  }
  toast(map[action] || `Action simulée : ${kind}`)
}

/** Nested UL tree with CSS connectors + section color dots */
function renderTreeNodes(nodes, activeId) {
  if (!nodes?.length) return ''
  return `<ul>${nodes
    .map((node) => {
      const isActive = node.id && node.id === activeId
      const section = node.section || (node.id ? sectionFor(node.id) : null)
      const dot = colorFor(section || 'neutral')
      const classes = [
        'tree-node',
        node.id ? 'link' : 'note',
        isActive ? 'active' : '',
      ]
        .filter(Boolean)
        .join(' ')

      const row = node.id
        ? `<button type="button" class="${classes}" data-nav="${node.id}" title="${node.label}" style="--dot:${dot}"><span class="tree-dot" aria-hidden="true"></span><span class="tree-label">${node.label}</span></button>`
        : `<div class="${classes}" style="--dot:${dot}"><span class="tree-dot" aria-hidden="true"></span><span class="tree-label">${node.label}</span></div>`

      const kids = node.children ? renderTreeNodes(node.children, activeId) : ''
      return `<li>${row}${kids}</li>`
    })
    .join('')}</ul>`
}

function buildTabs(tab) {
  return ['user', 'admin']
    .map((key) => {
      const on = key === tab
      return `<button type="button" class="nav-tab ${on ? 'on' : ''}" role="tab" aria-selected="${on}" data-nav-tab="${key}">${NAV_TREE[key].tab}</button>`
    })
    .join('')
}

function buildTree(activeId, tab) {
  const side = NAV_TREE[tab]
  return `
    <nav class="nav-tree" aria-label="Arbre ${side.tab}">
      ${renderTreeNodes(side.roots, activeId)}
    </nav>
  `
}

function scrollActiveIntoNavPanel() {
  const scroll = document.querySelector('.proto-scroll')
  const active = document.querySelector('.nav-tree .tree-node.active')
  if (!scroll || !active) return
  const sRect = scroll.getBoundingClientRect()
  const aRect = active.getBoundingClientRect()
  scroll.scrollTop += aRect.top - sRect.top - sRect.height / 2 + aRect.height / 2
}

function render({ focusActive = false, resetNavScroll = false } = {}) {
  const prevScroll = document.querySelector('.proto-scroll')
  if (prevScroll && !resetNavScroll) savedNavScroll = prevScroll.scrollTop

  const screen = SCREENS[currentId]
  const theme = themeFor(currentId)
  const app = document.getElementById('app')
  app.innerHTML = `
    <div class="shell">
      <aside class="proto-nav">
        <header class="proto-brand">
          <strong>Ma Ville</strong>
          <span class="proto-tag">Wireframe · build 0930-i · plan + mairie chrome</span>
        </header>
        <p class="proto-hint">Navigation du prototype (≠ nav dans le téléphone)</p>
        <div class="nav-tabs" role="tablist" aria-label="Côté prototype">
          ${buildTabs(navTab)}
        </div>
        <div class="proto-scroll">${buildTree(currentId, navTab)}</div>
        <footer class="proto-meta">
          <span>${Object.keys(SCREENS).length} écrans</span>
          <span>390 px</span>
        </footer>
      </aside>
      <main class="stage">
        <div class="stage-label">
          <span>${screen.side === 'admin' ? 'Admin' : 'Utilisateur'} · ${screen.group}${
            theme !== 'neutral' ? ` · ${theme}` : ''
          }</span>
          <strong>${screen.title}</strong>
        </div>
        <div class="phone" id="phone" data-theme="${theme}">
          <div class="phone-notch"></div>
          <div class="phone-inner" id="phone-inner">${screen.render()}</div>
        </div>
      </main>
    </div>
  `

  const scroll = document.querySelector('.proto-scroll')
  if (scroll) {
    if (resetNavScroll) scroll.scrollTop = 0
    else scroll.scrollTop = savedNavScroll
  }
  if (focusActive) scrollActiveIntoNavPanel()

  const phone = document.getElementById('phone-inner')
  phone.addEventListener('click', (e) => {
    const day = e.target.closest('.cal-day')
    if (day && day.closest('.calendar') && !day.classList.contains('closed')) {
      e.preventDefault()
      day.parentElement.querySelectorAll('.cal-day').forEach((d) => d.classList.remove('on'))
      day.classList.add('on')
      return
    }
    const motifToggle = e.target.closest('[data-motif-toggle]')
    if (motifToggle) {
      e.preventDefault()
      const box = motifToggle.closest('[data-motif-select]')
      const open = box.classList.toggle('open')
      motifToggle.setAttribute('aria-expanded', open ? 'true' : 'false')
      const menu = box.querySelector('.motif-dropdown')
      if (menu) menu.hidden = !open
      return
    }
    const motifPick = e.target.closest('[data-motif-pick]')
    if (motifPick) {
      e.preventDefault()
      const box = motifPick.closest('[data-motif-select]')
      const value = box.querySelector('.motif-value')
      if (value) value.textContent = motifPick.dataset.motifPick
      box.querySelectorAll('[data-motif-pick]').forEach((o) => o.classList.remove('on'))
      motifPick.classList.add('on')
      box.classList.remove('open')
      const trigger = box.querySelector('[data-motif-toggle]')
      if (trigger) trigger.setAttribute('aria-expanded', 'false')
      const menu = box.querySelector('.motif-dropdown')
      if (menu) menu.hidden = true
      return
    }
    const chip = e.target.closest('.chip')
    if (chip && chip.closest('.chips')) {
      e.preventDefault()
      chip.parentElement.querySelectorAll('.chip').forEach((c) => c.classList.remove('on'))
      chip.classList.add('on')
      return
    }
    const t = e.target.closest('[data-go], [data-back], [data-sim]')
    if (!t) return
    e.preventDefault()
    if (t.hasAttribute('data-back')) back()
    else if (t.dataset.go) go(t.dataset.go)
    else if (t.dataset.sim) {
      handleSim(t.dataset.sim)
      if (t.dataset.sim === 'rdv-annuler') {
        const card = t.closest('.rdv-en-cours')
        if (card) card.remove()
      }
    }
  })
}

document.getElementById('app').addEventListener('click', (e) => {
  const tab = e.target.closest('[data-nav-tab]')
  if (tab) {
    e.preventDefault()
    const next = tab.dataset.navTab
    if (next === navTab) return
    navTab = next
    render({ resetNavScroll: true })
    return
  }
  const nav = e.target.closest('[data-nav]')
  if (nav && nav.closest('.proto-nav')) {
    e.preventDefault()
    go(nav.dataset.nav, { push: false })
  }
})

const startId = location.hash.slice(1)
go(SCREENS[startId] ? startId : 'ville-bienvenue', { push: false })

window.addEventListener('hashchange', () => {
  const id = location.hash.slice(1)
  if (SCREENS[id] && id !== currentId) go(id, { push: false })
})
