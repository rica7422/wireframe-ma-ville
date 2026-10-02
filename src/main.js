import './style.css'
import { SCREENS, NAV_TREE, navIdsForSide } from './screens.js'
import { themeFor, colorFor, sectionFor } from './theme.js'
import {
  getRole,
  setRole,
  isAdminRole,
  roleLabel,
  ROLE_HABITANT,
  ROLE_ADMIN_KAPAN,
} from './role.js'
import {
  canAccessManageRoute,
  isMenuScreen,
  parentForMenuScreen,
  toggleSaved,
  toggleHidden,
  setInscription,
} from './permissions.js'
import { setMenuContext, getMenuContext, clearMenuContext } from './menu-context.js'
import {
  setCommentContext,
  setReactContext,
  getCommentContext,
} from './content-context.js'
import { getDirectory } from './demo-data.js'
import {
  setSignalFilter,
  setOpenSignalId,
  createSignalement,
  appendUserReply,
  appendMairieReply,
} from './signalements-data.js'
import {
  createEmptyEvent,
  setEditEventId,
  getEditEventId,
  setOpenEventId,
  setFormStep,
  setListTab,
  setMesSub,
  submitForValidation,
  publishEvent,
  withdrawValidationRequest,
  approveEvent,
  refuseEvent,
  requestCorrections,
  updateEvent,
  getEvent as getEventFull,
} from './events-data.js'
import { SIM_VIEWER_ID } from './demo-data.js'

const historyStack = []
let currentId = 'ville-bienvenue'
let navTab = 'user' // 'user' | 'admin'
/** Preserve left-panel scroll across phone-only re-renders when possible */
let savedNavScroll = 0

const ADMIN_IDS = new Set(navIdsForSide('admin'))
const USER_IDS = new Set(navIdsForSide('user'))
const ROOTS = new Set([
  'accueil-kapan',
  'mairie-accueil',
  'infos-feed',
  'messages',
  'menu-plus',
])

function pickNavTab(id) {
  const inAdmin = ADMIN_IDS.has(id)
  const inUser = USER_IDS.has(id)
  if (inAdmin && inUser) return isAdminRole() ? 'admin' : 'user'
  return inAdmin ? 'admin' : 'user'
}

function toast(msg) {
  const el = document.getElementById('toast')
  el.textContent = msg
  el.hidden = false
  clearTimeout(toast._t)
  toast._t = setTimeout(() => {
    el.hidden = true
  }, 2200)
}

function readEventFormFields() {
  const root = document.querySelector('.form-card')
  if (!root) return {}
  const val = (name) => {
    const el = root.querySelector(`[data-field="${name}"]`)
    return el ? el.value : undefined
  }
  const patch = {}
  const title = val('title')
  if (title !== undefined) patch.title = title
  const description = val('description')
  if (description !== undefined) patch.description = description
  const category = val('category')
  if (category !== undefined) patch.category = category
  const dateLabel = val('dateLabel')
  if (dateLabel !== undefined) patch.dateLabel = dateLabel
  const time = val('time')
  if (time !== undefined) patch.time = time
  const lieu = val('lieu')
  if (lieu !== undefined) {
    patch.lieu = lieu
    patch.lieuDetail = lieu
  }
  const price = val('price')
  if (price !== undefined) patch.price = price
  const inscriptionMode = val('inscriptionMode')
  if (inscriptionMode !== undefined) patch.inscriptionMode = inscriptionMode
  const capacityRaw = val('capacity')
  if (capacityRaw !== undefined) {
    const t = String(capacityRaw).trim()
    patch.capacity = t === '' ? null : Number(t) || null
  }
  if (patch.title || patch.category || patch.price) {
    const tags = []
    if (patch.category || getEventFull(getEditEventId())?.category)
      tags.push(patch.category || getEventFull(getEditEventId())?.category)
    const p = patch.price || getEventFull(getEditEventId())?.price
    if (p) tags.push(p === 'Gratuit' ? 'Gratuit' : 'Payant')
    patch.tags = tags.filter(Boolean)
  }
  return patch
}

function refuseManage(id) {
  toast('Accès refusé pour ce rôle (simulé)')
  const publicFallback = id?.startsWith('evenement-')
    ? 'evenement-details'
    : id?.startsWith('signalement')
      ? 'signalements'
      : id?.startsWith('mairie-')
        ? 'mairie-accueil'
        : 'mairie-accueil'
  if (SCREENS[publicFallback]) {
    // Always land on public view + sync hash (currentId may already be the fallback
    // when hash was set before the gate ran).
    currentId = publicFallback
    navTab = ADMIN_IDS.has(publicFallback) ? 'admin' : 'user'
    if (location.hash.slice(1) !== publicFallback) {
      history.replaceState(null, '', `#${publicFallback}`)
    }
    render({ focusActive: true })
  } else {
    render()
  }
}

function go(id, { push = true, resetStack = false } = {}) {
  id = resolveScreenId(id)
  if (!SCREENS[id]) {
    toast(`Écran inconnu : ${id}`)
    return
  }
  if (id === 'evenement-form' && !getEditEventId()) {
    if (isAdminRole()) {
      createEmptyEvent({
        origin: 'municipal',
        authorId: 'org-mairie-kapan',
        orgLabel: 'Mairie de Kapan',
      })
    } else {
      createEmptyEvent({ origin: 'citizen', authorId: SIM_VIEWER_ID, orgLabel: 'Rica' })
    }
  }
  if (!canAccessManageRoute(id)) {
    refuseManage(id)
    return
  }
  if (resetStack) historyStack.length = 0
  if (push && currentId && currentId !== id) historyStack.push(currentId)
  currentId = id
  navTab = pickNavTab(id)
  if (location.hash.slice(1) !== id) {
    history.replaceState(null, '', `#${id}`)
  }
  render({ focusActive: true })
}

function back() {
  const prev = historyStack.pop()
  if (prev) {
    if (!canAccessManageRoute(prev)) {
      clearMenuContext()
      go('mairie-accueil', { push: false })
      return
    }
    currentId = prev
    navTab = pickNavTab(prev)
    if (location.hash.slice(1) !== prev) {
      history.replaceState(null, '', `#${prev}`)
    }
    render({ focusActive: true })
  } else {
    go('accueil-kapan', { push: false })
  }
}

function handleSim(kind) {
  const [action, arg] = String(kind).split(':')

  if (action === 'save' && arg) {
    const on = toggleSaved(arg)
    toast(on ? 'Ajouté aux enregistrements (simulé)' : 'Retiré des enregistrements (simulé)')
    if (isMenuScreen(currentId)) render()
    return
  }
  if (action === 'hide' && arg) {
    toggleHidden(arg)
    toast('Masqué pour vous (simulé)')
    const parent = getMenuContext()?.parent || parentForMenuScreen(currentId) || 'infos-feed'
    clearMenuContext()
    go(parent, { push: false })
    return
  }
  if (action === 'inscription-join' && arg) {
    setInscription(arg, 'pending')
    toast('Demande envoyée (simulé)')
    render()
    return
  }
  if (action === 'inscription-cancel' && arg) {
    setInscription(arg, 'none')
    toast('Inscription annulée (simulé)')
    render()
    return
  }
  if (action === 'publish' && arg) {
    const d = getDirectory(arg)
    if (d) d.state = 'published'
    toast('Fiche publiée (simulé)')
    render()
    return
  }
  if (action === 'unpublish' && arg) {
    const d = getDirectory(arg)
    if (d) d.state = 'unpublished'
    toast('Fiche dépubliée (simulé)')
    render()
    return
  }
  if (action === 'republish' && arg) {
    const d = getDirectory(arg)
    if (d) d.state = 'published'
    toast('Fiche republiée (simulé)')
    render()
    return
  }
  if (action === 'menu-close') {
    back()
    return
  }
  if (action === 'accept' && arg) {
    toast('Participant accepté (simulé)')
    render()
    return
  }
  if (action === 'signal-filter' && arg) {
    setSignalFilter(isAdminRole(), arg)
    render()
    return
  }
  if (action === 'signal-create') {
    createSignalement({
      subject: 'Nouveau signalement',
      place: 'Adresse ou lieu précis',
      body: 'Décrivez le problème…',
      category: '',
    })
    toast('Votre signalement a été envoyé à la mairie.')
    go('signalement-conversation', { push: false })
    return
  }
  if (action === 'signal-reply-user' && arg) {
    appendUserReply(arg, 'Réponse habitant (simulée).')
    toast('Votre réponse a été envoyée.')
    render()
    return
  }
  if (action === 'signal-reply-mairie' && arg) {
    if (!isAdminRole()) {
      toast('Accès refusé pour ce rôle (simulé)')
      return
    }
    appendMairieReply(arg, 'Réponse de la mairie (simulée).')
    toast('Réponse envoyée à l’habitant.')
    render()
    return
  }
  if (action === 'event-create' || action === 'event-create-citoyen' || action === 'event-create-municipal') {
    if (action === 'event-create-municipal' || (action === 'event-create' && isAdminRole())) {
      if (!isAdminRole()) {
        toast('Accès refusé pour ce rôle (simulé)')
        return
      }
      createEmptyEvent({
        origin: 'municipal',
        authorId: 'org-mairie-kapan',
        orgLabel: 'Mairie de Kapan',
      })
    } else {
      createEmptyEvent({ origin: 'citizen', authorId: SIM_VIEWER_ID, orgLabel: 'Rica' })
    }
    go('evenement-form', { push: true })
    return
  }
  if (action === 'event-edit' && arg) {
    setEditEventId(arg)
    setFormStep(1)
    go('evenement-form')
    return
  }
  if (action === 'event-form-step' && arg) {
    setFormStep(Number(arg) || 1)
    render()
    return
  }
  if (action === 'event-list-tab' && arg) {
    setListTab(arg)
    render()
    return
  }
  if (action === 'event-mes-sub' && arg) {
    setMesSub(arg)
    setListTab('mes')
    render()
    return
  }
  if (action === 'event-save-draft') {
    const id = getEditEventId()
    if (id) {
      updateEvent(id, { publication: 'draft', ...readEventFormFields() })
      toast('Brouillon enregistré')
    } else toast('Brouillon enregistré (simulé)')
    render()
    return
  }
  if (action === 'event-preview') {
    const id = getEditEventId()
    if (id) {
      updateEvent(id, readEventFormFields())
      setOpenEventId(id)
      go('evenement-details')
    } else toast('Prévisualisation (simulé)')
    return
  }
  if (action === 'event-submit-validation') {
    const id = getEditEventId()
    if (!id) {
      toast('Aucun événement à envoyer')
      return
    }
    updateEvent(id, readEventFormFields())
    const e = getEventFull(id)
    if (e && !e.title) {
      updateEvent(id, { title: 'Nouvel événement (brouillon)' })
    }
    submitForValidation(id)
    toast('Envoyé pour validation mairie')
    go('evenements-liste', { push: false })
    return
  }
  if (action === 'event-publish') {
    if (!isAdminRole()) {
      toast('Accès refusé pour ce rôle (simulé)')
      return
    }
    const id = getEditEventId()
    if (!id) {
      toast('Aucun événement')
      return
    }
    updateEvent(id, readEventFormFields())
    const e = getEventFull(id)
    if (e && !e.title) updateEvent(id, { title: 'Événement municipal' })
    publishEvent(id)
    toast('Événement publié')
    setOpenEventId(id)
    go('evenement-details', { push: false })
    return
  }
  if (action === 'event-withdraw') {
    const id = getEditEventId()
    if (id) {
      withdrawValidationRequest(id)
      toast('Demande retirée · brouillon')
    }
    render()
    return
  }
  if (action === 'event-approve' && arg) {
    if (!isAdminRole()) {
      toast('Accès refusé pour ce rôle (simulé)')
      return
    }
    const e = approveEvent(arg)
    toast(
      e
        ? `Approuvé · reste ${e.origin === 'citizen' ? 'habitant' : 'municipal'}`
        : 'Approuvé'
    )
    render()
    return
  }
  if (action === 'event-refuse' && arg) {
    if (!isAdminRole()) {
      toast('Accès refusé pour ce rôle (simulé)')
      return
    }
    refuseEvent(arg, 'Motif (simulé)')
    toast('Événement refusé')
    render()
    return
  }
  if (action === 'event-correct' && arg) {
    if (!isAdminRole()) {
      toast('Accès refusé pour ce rôle (simulé)')
      return
    }
    requestCorrections(arg)
    toast('Corrections demandées')
    render()
    return
  }
  if (action === 'supprimer' || action === 'delete-confirm') {
    toast('Suppression (simulée)')
    const parent = getMenuContext()?.parent || parentForMenuScreen(currentId) || 'mairie-accueil'
    clearMenuContext()
    // After delete confirm → go list / parent
    const list =
      parent === 'evenement-details' || parent === 'evenement-participants'
        ? 'evenements-liste'
        : parent === 'sante-pharmacie-infos'
          ? 'sante-pharmacies'
          : parent === 'infos-feed'
            ? 'infos-feed'
            : 'mairie-accueil'
    go(list, { push: false })
    return
  }

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
    partager: 'Partage simulé',
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
    signaler: 'Signalement envoyé (simulé)',
    quitter: 'Quitter Ma Mairie (simulé — À préciser)',
    media: 'Ajout média (simulé)',
    ajouter: 'Ajout (simulé)',
    agrandir: 'Agrandir la carte (simulé)',
    brouillon: 'Brouillon enregistré (simulé)',
    previsualiser: 'Prévisualisation (simulé)',
    calendrier: 'Ajout au calendrier (simulé)',
    profil: 'Profil (simulé)',
    'consulter-demande': 'Demande consultée (simulé)',
    'consulter-inscription': 'Inscription consultée (simulé)',
    'consulter-refus': 'Refus consulté (simulé)',
    dispo: 'Disponibilité mise à jour (simulé)',
    depublier: 'Dépublier (simulé)',
    cloturer: 'Offre clôturée (simulé)',
    masquer: 'Masqué pour vous (simulé)',
    modifier: 'Modification (simulée)',
    visio: 'Visio (simulée)',
    'raison-inapproprie': 'Signalement : contenu inapproprié (simulé)',
    'raison-harcelement': 'Signalement : harcèlement (simulé)',
    'raison-faux': 'Signalement : fausse information (simulé)',
    'raison-autre': 'Signalement : autre (simulé)',
    'moderer-masquer': 'Contenu masqué publiquement (simulé)',
    'moderer-retirer': 'Contenu retiré avec motif (simulé)',
    'signal-info': 'Info incorrecte signalée (simulé) — la fiche n’est pas modifiée',
    'cancel-evt': 'Événement annulé (simulé)',
  }
  // Never honor archiver / épingler
  if (action === 'archiver' || action === 'epingler' || action === 'desarchiver' || action === 'desepingler') {
    toast('Action non disponible dans ce prototype')
    return
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

function roleSimulatorHtml() {
  const role = getRole()
  return `
    <div class="role-sim" role="group" aria-label="Simulation de rôle">
      <span class="role-sim-label">Rôle simulé</span>
      <div class="role-sim-btns">
        <button type="button" class="role-sim-btn ${role === ROLE_HABITANT ? 'on' : ''}" data-sim-role="${ROLE_HABITANT}">Habitant</button>
        <button type="button" class="role-sim-btn ${role === ROLE_ADMIN_KAPAN ? 'on' : ''}" data-sim-role="${ROLE_ADMIN_KAPAN}">Administrateur de Kapan</button>
      </div>
      <p class="role-sim-hint">Change les boutons dans le téléphone — pas l’arbre gauche</p>
    </div>
  `
}

function applyRoleSwitch(nextRole) {
  const wasMenu = isMenuScreen(currentId)
  const parent = parentForMenuScreen(currentId, getMenuContext()?.parent)
  clearMenuContext()
  setRole(nextRole)
  if (wasMenu && parent && SCREENS[parent]) {
    go(parent, { push: false })
    return
  }
  if (!canAccessManageRoute(currentId)) {
    toast('Accès refusé pour ce rôle (simulé)')
    go('mairie-accueil', { push: false })
    return
  }
  render()
}

function render({ focusActive = false, resetNavScroll = false } = {}) {
  const prevScroll = document.querySelector('.proto-scroll')
  if (prevScroll && !resetNavScroll) savedNavScroll = prevScroll.scrollTop

  const screen = SCREENS[currentId]
  const theme = themeFor(currentId)
  const app = document.getElementById('app')
  const role = getRole()
  app.innerHTML = `
    <div class="shell">
      <aside class="proto-nav">
        <header class="proto-brand">
          <strong>Ma Ville</strong>
          <span class="proto-tag">Wireframe · build 1001-i · events-bo</span>
        </header>
        <p class="proto-hint">Navigation du prototype (≠ nav dans le téléphone)</p>
        <div class="nav-tabs" role="tablist" aria-label="Côté prototype">
          ${buildTabs(navTab)}
        </div>
        <div class="proto-scroll">${buildTree(currentId, navTab)}</div>
        <footer class="proto-meta">
          <span>${Object.keys(SCREENS).length} écrans</span>
          <span>390 px</span>
          <span>${isAdminRole(role) ? 'Admin Kapan' : 'Habitant'}</span>
        </footer>
      </aside>
      <main class="stage">
        ${roleSimulatorHtml()}
        <div class="stage-label">
          <span>${screen.side === 'admin' ? 'Admin' : 'Utilisateur'} · ${screen.group}${
            theme !== 'neutral' ? ` · ${theme}` : ''
          } · ${roleLabel(role)}</span>
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
    const openMenu = e.target.closest('[data-open-menu]')
    if (openMenu) {
      e.preventDefault()
      setMenuContext({
        type: openMenu.dataset.openMenu,
        contentId: openMenu.dataset.contentId,
        parent: openMenu.dataset.menuParent || currentId,
        participantId: openMenu.dataset.participantId,
        section: openMenu.dataset.section || undefined,
      })
      go('content-menu')
      return
    }
    const openEvent = e.target.closest('[data-open-event]')
    if (openEvent) {
      e.preventDefault()
      setOpenEventId(openEvent.dataset.openEvent)
      go('evenement-details')
      return
    }
    const openComments = e.target.closest('[data-open-comments]')
    if (openComments) {
      e.preventDefault()
      setCommentContext({
        contentId: openComments.dataset.openComments,
        parent: currentId,
        section: openComments.dataset.section || undefined,
      })
      go('infos-commentaires')
      return
    }
    const openReact = e.target.closest('[data-open-reactions]')
    if (openReact) {
      e.preventDefault()
      setReactContext({
        contentId: openReact.dataset.openReactions,
        parent: currentId,
        section: openReact.dataset.section || undefined,
      })
      go('infos-reactions')
      return
    }
    const openSignal = e.target.closest('[data-open-signal]')
    if (openSignal) {
      e.preventDefault()
      setOpenSignalId(openSignal.dataset.openSignal)
      go('signalement-conversation')
      return
    }
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
    if (chip && chip.closest('.chips') && !chip.closest('.lifecycle-bar')) {
      e.preventDefault()
      if (chip.dataset.sim) {
        handleSim(chip.dataset.sim)
        return
      }
      chip.parentElement.querySelectorAll('.chip').forEach((c) => c.classList.remove('on'))
      chip.classList.add('on')
      return
    }
    const t = e.target.closest('[data-go], [data-back], [data-sim]')
    if (!t) return
    e.preventDefault()
    if (t.hasAttribute('data-back')) {
      back()
      return
    }
    if (t.dataset.go) {
      const target = resolveScreenId(t.dataset.go)
      const menu = getMenuContext()
      const sectionFromEl = t.dataset.section
      if (target === 'infos-commentaires' && !getCommentContext()?.contentId && menu?.contentId) {
        setCommentContext({
          contentId: menu.contentId,
          parent: menu.parent || currentId,
          section: sectionFromEl || menu.section || undefined,
        })
      } else if (target === 'infos-commentaires' && sectionFromEl) {
        const prev = getCommentContext() || {}
        setCommentContext({ ...prev, section: sectionFromEl, parent: prev.parent || currentId })
      }
      if (target === 'infos-reactions' && menu?.contentId) {
        setReactContext({
          contentId: menu.contentId,
          parent: menu.parent || currentId,
          section: sectionFromEl || menu.section || undefined,
        })
      } else if (target === 'infos-reactions' && sectionFromEl) {
        setReactContext({
          contentId: t.dataset.openReactions || getCommentContext()?.contentId,
          parent: currentId,
          section: sectionFromEl,
        })
      }
      if (target === 'infos-partage' && sectionFromEl) {
        setCommentContext({
          ...(getCommentContext() || {}),
          section: sectionFromEl,
          parent: currentId,
        })
      }
      if (target === 'evenement-form' || target === 'evenement-gerer') {
        if (menu?.contentId && menu.type === 'event') {
          setEditEventId(menu.contentId)
          setFormStep(1)
        }
      }
      const isRootJump =
        ROOTS.has(target) && t.closest('.phone-footer, .header-right, .phone-header')
      if (isRootJump) {
        go(target, { push: false, resetStack: true })
      } else {
        go(target)
      }
      return
    }
    if (t.dataset.sim) {
      handleSim(t.dataset.sim)
      if (t.dataset.sim === 'rdv-annuler') {
        const card = t.closest('.rdv-en-cours')
        if (card) card.remove()
      }
    }
  })
}

document.getElementById('app').addEventListener('click', (e) => {
  const simRole = e.target.closest('[data-sim-role]')
  if (simRole) {
    e.preventDefault()
    applyRoleSwitch(simRole.dataset.simRole)
    return
  }
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
    go(nav.dataset.nav, { push: false, resetStack: true })
  }
})

function resolveScreenId(id) {
  if (id === 'infos-citoyen') return 'infos-feed'
  if (id === 'admin-contenus') return 'admin-home'
  if (id === 'admin-fiche-edit') return 'fiche-annuaire-form'
  if (id === 'admin-bo-mairie') return 'admin-mairie'
  if (id === 'admin-bo-evenements-creer') return 'evenement-form'
  if (id === 'evenement-gerer') return 'evenement-form'
  if (id === 'admin-evenement-form') return 'evenement-form'
  if (id === 'evenements-gerer-liste') return 'admin-evenements'
  if (id === 'admin-bo-annuaire-form') return 'fiche-annuaire-form'
  if (id === 'page-signalement' || (id && id.startsWith('dir-signalement'))) return 'signalements'
  if (id === 'signalement-statut') return 'signalement-conversation'
  return id
}

const startId = resolveScreenId(location.hash.slice(1))
go(SCREENS[startId] ? startId : 'ville-bienvenue', { push: false })

window.addEventListener('hashchange', () => {
  const raw = location.hash.slice(1)
  const id = resolveScreenId(raw)
  if (raw && raw !== id && SCREENS[id]) {
    history.replaceState(null, '', `#${id}`)
  }
  if (SCREENS[id] && id !== currentId) go(id, { push: false })
})
