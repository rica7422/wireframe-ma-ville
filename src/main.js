import './style.css'
import { SCREENS, NAV } from './screens.js'

const historyStack = []
let currentId = 'ville-bienvenue'

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
  if (location.hash.slice(1) !== id) {
    history.replaceState(null, '', `#${id}`)
  }
  render()
}

function back() {
  const prev = historyStack.pop()
  if (prev) {
    currentId = prev
    render()
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
    'rdv-annuler': 'Annulation RDV (simulé — À préciser)',
    position: 'Partage de position (simulé)',
    upload: 'Upload photo (simulé)',
    sauver: 'Enregistrement admin (simulé)',
    'publier-admin': 'Publication admin (simulé — À préciser)',
    'filtre-admin': 'Filtres admin — À préciser',
    enregistrer: 'Ajout aux enregistrements (simulé)',
    signalement: 'Signalement envoyé (simulé — À préciser)',
  }
  toast(map[action] || `Action simulée : ${kind}`)
}

function themeFor(id) {
  if (id.startsWith('mairie-')) return 'mairie'
  if (id === 'infos-citoyen' || id.startsWith('infos-')) return 'infos'
  if (id.startsWith('sante-')) return 'sante'
  if (id.startsWith('dir-education')) return 'education'
  if (
    id.startsWith('dir-tourisme') ||
    id.startsWith('dir-nature') ||
    id.startsWith('dir-activites')
  )
    return 'tourisme'
  if (id.startsWith('dir-cinemas')) return 'cinemas'
  if (id === 'urgence-numeros') return 'urgence'
  if (id.startsWith('dir-economie')) return 'economie'
  if (id.startsWith('dir-aide')) return 'aide'
  return 'neutral'
}

function buildNav(activeId) {
  const columns = NAV.map((side) => {
    const groups = side.groups
      .map((g) => {
        const items = g.ids
          .map((id) => {
            const s = SCREENS[id]
            if (!s) return ''
            return `<button class="nav-item ${id === activeId ? 'active' : ''}" data-nav="${id}">
              <span class="nav-dot"></span>${s.title}
            </button>`
          })
          .join('')
        return `<div class="nav-group"><div class="nav-group-title">${g.name}</div>${items}</div>`
      })
      .join('')
    return `
      <section class="nav-side">
        <h2 class="nav-side-title">${side.label}</h2>
        ${groups}
      </section>`
  }).join('')
  return `<div class="nav-columns">${columns}</div>`
}

function render() {
  const screen = SCREENS[currentId]
  const theme = themeFor(currentId)
  const app = document.getElementById('app')
  app.innerHTML = `
    <div class="shell">
      <aside class="proto-nav">
        <header class="proto-brand">
          <strong>Ma Ville</strong>
          <span class="proto-tag">Wireframe structure</span>
        </header>
        <p class="proto-hint">Navigation du prototype (≠ nav dans le téléphone)</p>
        <div class="proto-scroll">${buildNav(currentId)}</div>
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

  app.querySelectorAll('[data-nav]').forEach((btn) => {
    btn.addEventListener('click', () => go(btn.dataset.nav, { push: false }))
  })

  const phone = document.getElementById('phone-inner')
  phone.addEventListener('click', (e) => {
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
    else if (t.dataset.sim) handleSim(t.dataset.sim)
  })
}

const startId = location.hash.slice(1)
go(SCREENS[startId] ? startId : 'ville-bienvenue', { push: false })

window.addEventListener('hashchange', () => {
  const id = location.hash.slice(1)
  if (SCREENS[id] && id !== currentId) go(id, { push: false })
})
