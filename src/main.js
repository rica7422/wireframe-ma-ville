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
  getFormStep,
  setListTab,
  setMesSub,
  submitForValidation,
  publishEvent,
  withdrawValidationRequest,
  approveEvent,
  refuseEvent,
  requestCorrections,
  updateEvent,
  applyFormPatch,
  getEvent as getEventFull,
  getFormEvent,
} from './events-data.js'
import { SIM_VIEWER_ID } from './demo-data.js'
import {
  setOpenModCaseId,
  setModFilter,
  decideModCase,
  getModCase,
  createModerationCase,
} from './moderation-data.js'
import {
  setRdvPick,
  getRdvPick,
  createBooking,
  updateBooking,
  moveBooking,
  findNextFreeSlot,
  setAdminRdvTab,
  setEditMotifId,
  getEditMotifId,
  upsertMotif,
  deactivateMotif,
  getMotif,
  setDispoSlots,
  getDispoSlots,
  setDispoEditWeekday,
  getDispoEditWeekday,
  listMotifs,
} from './rdv-data.js'
import {
  setAnnuaireRubriqueId,
  setFicheContext,
  getFicheContext,
  getAnnuaireRubriqueId,
  upsertFiche,
  addCustomRubrique,
  removeCustomRubrique,
  createEmptyPub,
  setPubEditId,
  getPubEditId,
  updateAdminPub,
  getAdminPub,
} from './annuaire-data.js'
import {
  setMsgTab,
  getMsgTab,
  setOpenConversationId,
  getOpenConversationId,
  setMsgSearch,
  openOrCreateDm,
  markConversationRead,
  sendMessage,
  editMessage,
  deleteMessageForMe,
  deleteMessageForEveryone,
  reactToMessage,
  setReplyTo,
  getReplyTo,
  setEditMsgId,
  getEditMsgId,
  setPendingAttach,
  getPendingAttach,
  getMessage,
  getConversation,
} from './messages-data.js'
import {
  setCommunauteKindTab,
  setCommunauteSearch,
  setCommunauteFilter,
  setOpenCommunauteId,
  getOpenCommunauteId,
  setCommunautePageView,
  joinCommunaute,
  cancelJoinRequest,
  leaveCommunaute,
  acceptJoin,
  refuseJoin,
  removeMember,
  acceptInvitation,
  ignoreInvitation,
  ignoreSuggestion,
  updateSettings,
  assignRole,
  leaveAdminRole,
  dissolveCommunaute,
  createCommunautePost,
  deleteCommunautePost,
  reactCommunautePost,
  createCommunauteFromDraft,
  startCreateDraft,
  setCreateDraft,
  getCreateDraft,
  setRolePick,
  getRolePick,
  getCommunaute,
  isCommunauteAdmin,
} from './communautes-data.js'

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
  const orgLabel = val('orgLabel')
  if (orgLabel !== undefined) patch.orgLabel = orgLabel
  const ville = val('ville')
  if (ville !== undefined) {
    patch.ville = ville
    patch.cityLabel = `${ville}, Arménie`
  }
  const dateLabel = val('dateLabel')
  if (dateLabel !== undefined) patch.dateLabel = dateLabel
  const dateEndLabel = val('dateEndLabel')
  if (dateEndLabel !== undefined) patch.dateEndLabel = dateEndLabel
  const time = val('time')
  if (time !== undefined) patch.time = time
  const timeEnd = val('timeEnd')
  if (timeEnd !== undefined) patch.timeEnd = timeEnd
  const lieu = val('lieu')
  if (lieu !== undefined) {
    patch.lieu = lieu
    patch.lieuDetail = lieu
  }
  const priceMode = val('priceMode')
  if (priceMode !== undefined) {
    if (priceMode === 'free') {
      patch.isFree = true
      patch.price = 'Gratuit'
    } else {
      patch.isFree = false
      const amount = val('priceAmount')
      patch.price = amount || 'Payant'
    }
  } else {
    const price = val('price')
    if (price !== undefined) patch.price = price
  }
  const inscriptionMode = val('inscriptionMode')
  if (inscriptionMode !== undefined) patch.inscriptionMode = inscriptionMode
  const capacityMode = val('capacityMode')
  if (capacityMode === 'unlimited') {
    patch.capacity = null
  } else {
    const capacityRaw = val('capacity')
    if (capacityRaw !== undefined) {
      const t = String(capacityRaw).trim()
      patch.capacity = t === '' ? null : Number(t) || null
    }
  }
  const inscriptionDeadline = val('inscriptionDeadline')
  if (inscriptionDeadline !== undefined) patch.inscriptionDeadline = inscriptionDeadline
  const conditions = val('conditions')
  if (conditions !== undefined) patch.conditions = conditions
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

function readField(name) {
  const el = document.querySelector(`[data-field="${name}"]`)
  return el ? el.value : ''
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
  const parts = String(kind).split(':')
  const action = parts[0]
  const arg = parts.slice(1).join(':')

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
    const id = getEditEventId()
    if (id) applyFormPatch(id, readEventFormFields())
    setFormStep(Number(arg) || 1)
    render()
    return
  }
  if (action === 'event-form-next') {
    const id = getEditEventId()
    if (id) applyFormPatch(id, readEventFormFields())
    const step = getFormStep() || 1
    setFormStep(Math.min(3, step + 1))
    render()
    return
  }
  if (action === 'event-form-prev') {
    const id = getEditEventId()
    if (id) applyFormPatch(id, readEventFormFields())
    const step = getFormStep() || 1
    setFormStep(Math.max(1, step - 1))
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
      const cur = getEventFull(id)
      if (cur?.publication === 'published' && cur.origin === 'citizen') {
        applyFormPatch(id, readEventFormFields())
        toast('Révision enregistrée · version publique inchangée')
      } else {
        updateEvent(id, { publication: 'draft', ...readEventFormFields() })
        toast('Brouillon enregistré')
      }
    } else toast('Brouillon enregistré (simulé)')
    render()
    return
  }
  if (action === 'event-preview') {
    const id = getEditEventId()
    if (id) {
      applyFormPatch(id, readEventFormFields())
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
    applyFormPatch(id, readEventFormFields())
    const e = getFormEvent(id) || getEventFull(id)
    if (e && !e.title) {
      applyFormPatch(id, { title: 'Nouvel événement (brouillon)' })
    }
    const before = getEventFull(id)
    submitForValidation(id)
    toast(
      before?.publication === 'published'
        ? 'Révision envoyée · agenda public inchangé'
        : 'Envoyé pour validation mairie'
    )
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
    const before = getEventFull(arg)
    const e = approveEvent(arg)
    toast(
      e
        ? before?.revisionStatus === 'pending'
          ? 'Révision approuvée · agenda mis à jour'
          : `Approuvé · reste ${e.origin === 'citizen' ? 'habitant' : 'municipal'}`
        : 'Approuvé'
    )
    render()
    return
  }
  if (action === 'event-refuse-ask' && arg) {
    if (!isAdminRole()) {
      toast('Accès refusé pour ce rôle (simulé)')
      return
    }
    sessionStorage.setItem('ma-ville-evt-motif-mode', 'refuse')
    sessionStorage.setItem('ma-ville-evt-motif-id', arg)
    go('evenement-validation-motif')
    return
  }
  if (action === 'event-correct-ask' && arg) {
    if (!isAdminRole()) {
      toast('Accès refusé pour ce rôle (simulé)')
      return
    }
    sessionStorage.setItem('ma-ville-evt-motif-mode', 'correct')
    sessionStorage.setItem('ma-ville-evt-motif-id', arg)
    go('evenement-validation-motif')
    return
  }
  if (action === 'event-refuse-confirm' && arg) {
    if (!isAdminRole()) {
      toast('Accès refusé pour ce rôle (simulé)')
      return
    }
    const motif = readField('motif').trim()
    if (!motif) {
      toast('Motif obligatoire')
      return
    }
    refuseEvent(arg, motif)
    toast('Événement refusé')
    go('evenements-a-valider', { push: false })
    return
  }
  if (action === 'event-correct-confirm' && arg) {
    if (!isAdminRole()) {
      toast('Accès refusé pour ce rôle (simulé)')
      return
    }
    const motif = readField('motif').trim()
    if (!motif) {
      toast('Motif obligatoire')
      return
    }
    requestCorrections(arg, motif)
    toast('Corrections demandées')
    go('evenements-a-valider', { push: false })
    return
  }
  if (action === 'event-refuse' && arg) {
    sessionStorage.setItem('ma-ville-evt-motif-mode', 'refuse')
    sessionStorage.setItem('ma-ville-evt-motif-id', arg)
    go('evenement-validation-motif')
    return
  }
  if (action === 'event-correct' && arg) {
    sessionStorage.setItem('ma-ville-evt-motif-mode', 'correct')
    sessionStorage.setItem('ma-ville-evt-motif-id', arg)
    go('evenement-validation-motif')
    return
  }
  if (action === 'supprimer' || action === 'delete-confirm') {
    const fromParticipants = (getMenuContext()?.parent || parentForMenuScreen(currentId) || '') === 'evenement-participants' || currentId === 'evenement-supprimer-confirm'
    toast(fromParticipants ? 'Retiré de l’événement (simulé)' : 'Suppression (simulée)')
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

  // ——— Modération ———
  if (action === 'mod-filter' && arg) {
    setModFilter(arg)
    render()
    return
  }
  if (action === 'mod-decide') {
    // kind = mod-decide:decision:id
    const parts = String(kind).split(':')
    const decision = parts[1]
    const caseId = parts[2]
    if (!isAdminRole()) {
      toast('Accès refusé pour ce rôle (simulé)')
      return
    }
    const motif = readField('mod-motif')
    const res = decideModCase(caseId, decision, motif)
    if (res?.error === 'motif') {
      toast('Motif obligatoire pour masquer / retirer')
      return
    }
    if (res?.error === 'author-deleted') {
      toast('Impossible de rétablir — contenu supprimé par l’auteur')
      return
    }
    toast(
      decision === 'classer'
        ? 'Classé sans suite'
        : decision === 'masquer'
          ? 'Contenu masqué'
          : decision === 'retirer'
            ? 'Contenu retiré'
            : decision === 'retablir'
              ? 'Contenu rétabli'
              : 'Décision enregistrée'
    )
    render()
    return
  }
  if (action === 'mod-open-fiche' && arg) {
    setFicheContext({
      mode: 'edit',
      id: 'dir-pharmacie-centrale',
      title: 'Pharmacie centrale',
      backTo: 'moderation-case',
    })
    go('fiche-annuaire-form')
    return
  }

  // ——— Annuaires / fiches ———
  if (action === 'annuaire-rubrique' && arg) {
    setAnnuaireRubriqueId(arg)
    go('admin-annuaire-rubrique')
    return
  }
  if (action === 'fiche-create') {
    const rubriqueId = arg || getAnnuaireRubriqueId() || 'education'
    setFicheContext({
      mode: 'create',
      id: null,
      title: '',
      rubriqueId,
      backTo: arg === 'sante' ? 'admin-annuaire-pharmacies' : 'admin-annuaire-rubrique',
    })
    go('fiche-annuaire-form')
    return
  }
  if (action === 'fiche-edit' && arg) {
    setFicheContext({
      mode: 'edit',
      id: arg === 'new' ? null : arg,
      title: arg === 'new' ? '' : undefined,
      rubriqueId: getAnnuaireRubriqueId(),
      backTo: currentId,
    })
    go('fiche-annuaire-form')
    return
  }
  if (action === 'fiche-save-draft' || action === 'fiche-publish' || action === 'fiche-preview') {
    const ctx = getFicheContext() || {}
    const status =
      action === 'fiche-publish' ? 'Publié' : action === 'fiche-save-draft' ? 'Brouillon' : undefined
    const saved = upsertFiche({
      id: ctx.id || null,
      rubriqueId: ctx.rubriqueId || getAnnuaireRubriqueId(),
      title: readField('fiche-name'),
      address: readField('fiche-address'),
      phone: readField('fiche-phone'),
      hours: readField('fiche-hours'),
      description: readField('fiche-desc'),
      sousCat: readField('fiche-category') || ctx.category || 'Général',
      status: status || readField('fiche-status') || 'Brouillon',
    })
    toast(
      action === 'fiche-publish'
        ? 'Fiche publiée'
        : action === 'fiche-preview'
          ? 'Prévisualisation fiche'
          : 'Brouillon fiche enregistré'
    )
    if (action === 'fiche-preview' && saved?.id) {
      setFicheContext({ ...ctx, mode: 'edit', id: saved.id })
      go('sante-pharmacie-infos')
    } else render()
    return
  }
  if (action === 'rubrique-add') {
    if (!isAdminRole()) {
      toast('Accès refusé pour ce rôle (simulé)')
      return
    }
    const label = readField('rubrique-label').trim() || 'Nouvelle rubrique'
    const rub = addCustomRubrique(label)
    toast(`Rubrique « ${rub.label} » ajoutée`)
    setAnnuaireRubriqueId(rub.id)
    go('admin-annuaire-rubrique')
    return
  }
  if (action === 'rubrique-remove' && arg) {
    if (!isAdminRole()) {
      toast('Accès refusé pour ce rôle (simulé)')
      return
    }
    const res = removeCustomRubrique(arg)
    toast(res?.error ? 'Rubrique native — non retirée' : 'Rubrique retirée')
    render()
    return
  }

  // ——— Publications BO ———
  if (action === 'pub-create') {
    createEmptyPub()
    go('mairie-nouvelle-publication')
    return
  }
  if (action === 'pub-edit' && arg) {
    setPubEditId(arg)
    go('mairie-pub-edit')
    return
  }
  if (action === 'pub-save-draft') {
    const id = getPubEditId()
    if (id) {
      updateAdminPub(id, {
        title: readField('pub-title') || getAdminPub(id)?.title || '',
        body: readField('pub-body') || '',
        state: 'draft',
      })
    }
    toast('Brouillon publication · Mairie de Kapan')
    render()
    return
  }
  if (action === 'pub-preview') {
    const id = getPubEditId()
    if (id) {
      updateAdminPub(id, {
        title: readField('pub-title') || getAdminPub(id)?.title || '',
        body: readField('pub-body') || '',
      })
    }
    go('mairie-pub-preview')
    return
  }
  if (action === 'pub-publish') {
    const id = getPubEditId()
    if (id) {
      updateAdminPub(id, {
        title: readField('pub-title') || getAdminPub(id)?.title || 'Publication',
        body: readField('pub-body') || '',
        state: 'published',
        authorLabel: 'Mairie de Kapan',
      })
    }
    toast('Publié au nom de la Mairie de Kapan')
    go('admin-mairie', { push: false })
    return
  }

  // ——— RDV ———
  if (action === 'rdv-pick-day' && arg) {
    const pick = getRdvPick()
    const day = Number(arg)
    setRdvPick({ ...pick, day, slot: undefined })
    render()
    return
  }
  if (action === 'rdv-pick-slot' && arg) {
    const pick = getRdvPick()
    setRdvPick({ ...pick, slot: arg })
    render()
    return
  }
  if (action === 'rdv-confirm') {
    const pick = getRdvPick()
    const motifs = listMotifs({ activeOnly: true })
    const motifId = pick.motifId || motifs[0]?.id
    const day = pick.day || 27
    const slot = pick.slot || '09:30'
    const slotIso = `2026-05-${String(day).padStart(2, '0')}T${slot}`
    const slotLabel = `${day} mai 2026 · ${slot}`
    if (pick.moveId) {
      const moved = moveBooking(pick.moveId, { slot: slotIso, slotLabel, motifId })
      if (moved?.error === 'slot_taken') {
        toast('Créneau déjà pris — choisissez un autre')
        return
      }
      setRdvPick({ motifId, day, slot, moveId: undefined })
      toast('Rendez-vous déplacé · notification simulée')
      go('mairie-rdv', { push: false })
      return
    }
    const created = createBooking({
      motifId,
      slot: slotIso,
      slotLabel,
      user: 'Rica',
      userId: 'user-rica',
    })
    if (created?.error === 'slot_taken') {
      toast('Créneau déjà pris — choisissez un autre')
      return
    }
    setRdvPick({ motifId })
    toast('Rendez-vous confirmé · notification simulée')
    go('mairie-rdv', { push: false })
    return
  }
  if (action === 'rdv-annuler' && arg) {
    updateBooking(arg, { status: 'cancelled', cancelMotif: 'Annulé par l’habitant' })
    toast('Rendez-vous annulé · créneau libéré · notification simulée')
    render()
    return
  }
  if (action === 'rdv-annuler') {
    toast('Rendez-vous annulé (simulé)')
    render()
    return
  }
  if (action === 'rdv-move' && arg) {
    const pick = getRdvPick()
    setRdvPick({ ...pick, moveId: arg, slot: undefined })
    toast('Choisissez un nouveau créneau puis confirmez')
    go('mairie-rdv')
    return
  }
  if (action === 'rdv-admin-tab' && arg) {
    setAdminRdvTab(arg)
    render()
    return
  }
  if (action === 'rdv-motif-create') {
    const id = `motif-${Date.now()}`
    upsertMotif({ id, label: 'Nouveau motif', duration: 20, active: true })
    setEditMotifId(id)
    toast('Motif créé')
    setAdminRdvTab('motifs')
    render()
    return
  }
  if (action === 'rdv-motif-edit' && arg) {
    setEditMotifId(arg)
    setAdminRdvTab('motifs')
    render()
    return
  }
  if (action === 'rdv-motif-save' && arg) {
    upsertMotif({
      id: arg,
      label: readField('motif-label') || getMotif(arg)?.label,
      duration: Number(readField('motif-duration')) || 20,
      active: readField('motif-active') !== '0',
    })
    toast('Motif enregistré')
    render()
    return
  }
  if (action === 'rdv-motif-deactivate' && arg) {
    deactivateMotif(arg)
    toast('Motif désactivé (pas de suppression)')
    render()
    return
  }
  if (action === 'rdv-dispo-edit' && arg) {
    setDispoEditWeekday(arg)
    setAdminRdvTab('dispos')
    render()
    return
  }
  if (action === 'rdv-dispo-save' && arg) {
    const raw = readField('dispo-slots') || ''
    const slots = raw
      .split(/[\s,;·]+/)
      .map((s) => s.trim())
      .filter((s) => /^\d{1,2}:\d{2}$/.test(s))
      .sort()
    setDispoSlots(arg, slots)
    setDispoEditWeekday(null)
    toast('Créneaux enregistrés · RDV existants conservés · notif simulée')
    render()
    return
  }
  if (action === 'rdv-dispo-cancel') {
    setDispoEditWeekday(null)
    render()
    return
  }
  if (action === 'rdv-admin-confirm' && arg) {
    updateBooking(arg, { status: 'confirmed' })
    toast('RDV confirmé · notification simulée')
    render()
    return
  }
  if (action === 'rdv-admin-move' && arg) {
    const next = findNextFreeSlot(arg)
    if (!next) {
      toast('Aucun créneau libre trouvé')
      return
    }
    moveBooking(arg, { slot: next.slot, slotLabel: next.slotLabel })
    toast(`RDV déplacé → ${next.slotLabel} · notification simulée`)
    render()
    return
  }
  if (action === 'rdv-admin-cancel-ask' && arg) {
    sessionStorage.setItem('ma-ville-rdv-cancel-id', arg)
    go('admin-rdv-cancel')
    return
  }
  if (action === 'rdv-admin-cancel-confirm' && arg) {
    const motif = readField('rdv-cancel-motif').trim() || 'Annulé par la mairie'
    updateBooking(arg, { status: 'cancelled', cancelMotif: motif })
    toast('RDV annulé · notification simulée')
    go('admin-rdv', { push: false })
    return
  }
  if (action === 'rdv-admin-done' && arg) {
    updateBooking(arg, { status: 'done' })
    toast('Marqué effectué')
    render()
    return
  }
  if (action === 'rdv-admin-absent' && arg) {
    updateBooking(arg, { status: 'absent' })
    toast('Marqué absent')
    render()
    return
  }

  // ——— Messagerie ———
  if (action === 'msg-tab' && arg) {
    setMsgTab(arg)
    go(arg === 'maville' ? 'messages-maville' : 'messages', { push: false })
    return
  }
  if (action === 'msg-search') {
    setMsgSearch(readField('msg-search'))
    render()
    return
  }
  if (action === 'msg-new') {
    go('messages-nouvelle')
    return
  }
  if (action === 'msg-start' && arg) {
    const tab = getMsgTab()
    openOrCreateDm(arg, tab === 'maville' ? 'maville' : 'miasin')
    go('messages-thread')
    return
  }
  if (action === 'msg-open' && arg) {
    setOpenConversationId(arg)
    markConversationRead(arg)
    go('messages-thread')
    return
  }
  if (action === 'msg-send' || action === 'message') {
    const id = getOpenConversationId()
    if (!id) {
      toast('Aucune conversation ouverte')
      return
    }
    const text = readField('msg-text')
    const attach = getPendingAttach()
    const replyTo = getReplyTo()
    const res = sendMessage(id, { text, attachment: attach, replyTo })
    if (res?.error === 'empty') {
      toast('Écrivez un message ou ajoutez une pièce')
      return
    }
    render()
    return
  }
  if (action === 'msg-reply' && arg) {
    setReplyTo(arg)
    render()
    return
  }
  if (action === 'msg-reply-cancel') {
    setReplyTo(null)
    render()
    return
  }
  if (action === 'msg-edit' && arg) {
    setEditMsgId(arg)
    render()
    return
  }
  if (action === 'msg-edit-cancel') {
    setEditMsgId(null)
    render()
    return
  }
  if (action === 'msg-edit-save' && arg) {
    const id = getOpenConversationId()
    const res = editMessage(id, arg, readField('msg-edit-text'))
    if (res?.error) toast('Modification non autorisée')
    else toast('Message modifié')
    render()
    return
  }
  if (action === 'msg-del-me' && arg) {
    deleteMessageForMe(getOpenConversationId(), arg)
    render()
    return
  }
  if (action === 'msg-del-all' && arg) {
    if (!confirm('Supprimer ce message pour tout le monde ?')) return
    const res = deleteMessageForEveryone(getOpenConversationId(), arg)
    if (res?.error) toast('Seul l’auteur peut supprimer pour tous')
    render()
    return
  }
  if (action === 'msg-copy' && arg) {
    const m = getMessage(getOpenConversationId(), arg)
    if (m?.text && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(m.text).catch(() => {})
    }
    toast(m?.text ? 'Texte copié' : 'Rien à copier')
    return
  }
  if (action === 'msg-react' && arg) {
    sessionStorage.setItem('ma-ville-msg-react-target', arg)
    go('messages-react')
    return
  }
  if (action === 'msg-react-pick') {
    const target = sessionStorage.getItem('ma-ville-msg-react-target')
    const emoji = arg || ''
    if (target) reactToMessage(getOpenConversationId(), target, emoji)
    go('messages-thread', { push: false })
    return
  }
  if (action === 'msg-report' && arg) {
    const conv = getConversation(getOpenConversationId())
    const m = getMessage(getOpenConversationId(), arg)
    createModerationCase({
      type: 'message',
      title: `Message signalé · ${conv?.peerName || 'conversation'}`,
      author: m?.from || 'Inconnu',
      motif: 'Signalement depuis messagerie',
      contentLabel: m?.deletedForEveryone ? 'Message supprimé' : (m?.text || 'Pièce jointe').slice(0, 120),
      contentGo: 'admin-moderation',
    })
    toast('Signalement transmis à la modération (dossier créé)')
    return
  }
  if (action === 'msg-attach-menu') {
    go('messages-attach')
    return
  }
  if (action === 'msg-attach' && arg) {
    const kind = arg
    const name =
      kind === 'photo' ? 'photo-demo.jpg' : kind === 'video' ? 'video-demo.mp4' : 'document-demo.pdf'
    // Local preview only — no upload. Photos get a placeholder data URL strip.
    const previewUrl =
      kind === 'photo'
        ? 'data:image/svg+xml,' +
          encodeURIComponent(
            `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="80"><rect fill="#cbd5e1" width="120" height="80"/><text x="12" y="44" fill="#334155" font-size="12">Aperçu local</text></svg>`
          )
        : null
    setPendingAttach({ kind, name, local: true, previewUrl })
    toast(
      kind === 'photo'
        ? 'Photo prête (aperçu local — non envoyée à un serveur)'
        : kind === 'video'
          ? 'Vidéo prête (aperçu local — lecture limitée)'
          : 'Fichier prêt (nom local uniquement)'
    )
    go('messages-thread', { push: false })
    return
  }
  if (action === 'msg-attach-clear') {
    setPendingAttach(null)
    render()
    return
  }
  if (action === 'msg-thread-info') {
    const c = getConversation(getOpenConversationId())
    toast(c ? `${c.peerName} · ${c.context === 'maville' ? 'Ma Ville · ' + (c.city || 'Kapan') : 'MIASIN'}` : 'Conversation')
    return
  }

  // ——— Groupes / Clubs ———
  if (action === 'comm-tab' && arg) {
    const [kind, tab] = String(arg).split(':')
    setCommunauteKindTab(kind, tab)
    go(kind === 'clubs' ? 'communautes-clubs' : 'communautes-groupes', { push: false })
    return
  }
  if (action === 'comm-search' && arg) {
    setCommunauteSearch(arg, readField('comm-search'))
    render()
    return
  }
  if (action === 'comm-filter' && arg) {
    const parts = String(arg).split(':')
    const kind = parts[0]
    const filter = parts.slice(1).join(':')
    setCommunauteFilter(kind, filter)
    go(kind === 'clubs' ? 'communautes-clubs' : 'communautes-groupes', { push: false })
    return
  }
  if (action === 'comm-open' && arg) {
    setOpenCommunauteId(arg)
    setCommunautePageView('publications')
    go('communaute-page')
    return
  }
  if (action === 'comm-view' && arg) {
    const view =
      arg === 'apropos' || arg === 'informations'
        ? 'informations'
        : arg === 'membres'
          ? 'informations'
          : arg === 'evenements'
            ? 'evenements'
            : 'publications'
    setCommunautePageView(view)
    const screen =
      view === 'informations'
        ? 'communaute-apropos'
        : view === 'evenements'
          ? 'communaute-evenements'
          : 'communaute-page'
    go(screen, { push: false })
    return
  }
  if (action === 'comm-join' && arg) {
    const c = joinCommunaute(arg)
    toast(
      c?.myState === 'pending'
        ? 'Demande envoyée'
        : c?.myState === 'member'
          ? 'Vous avez rejoint'
          : 'Adhésion mise à jour'
    )
    render()
    return
  }
  if (action === 'comm-cancel-join' && arg) {
    cancelJoinRequest(arg)
    toast('Demande annulée')
    render()
    return
  }
  if (action === 'comm-leave-ask' && arg) {
    if (!confirm('Quitter cette communauté ?')) return
    leaveCommunaute(arg)
    toast('Vous avez quitté')
    render()
    return
  }
  if (action === 'comm-accept-invite' && arg) {
    acceptInvitation(arg)
    toast('Invitation acceptée')
    render()
    return
  }
  if (action === 'comm-ignore-invite' && arg) {
    ignoreInvitation(arg)
    toast('Invitation ignorée')
    render()
    return
  }
  if (action === 'comm-ignore-suggest' && arg) {
    ignoreSuggestion(arg)
    toast('Suggestion ignorée')
    render()
    return
  }
  if (action === 'comm-accept' && arg) {
    const [cid, uid] = String(arg).split(':')
    const res = acceptJoin(cid, uid)
    toast(res?.error ? 'Action réservée aux modos/admins communauté' : 'Demande acceptée')
    render()
    return
  }
  if (action === 'comm-refuse' && arg) {
    const [cid, uid] = String(arg).split(':')
    const res = refuseJoin(cid, uid)
    toast(res?.error ? 'Action réservée aux modos/admins communauté' : 'Demande refusée')
    render()
    return
  }
  if (action === 'comm-remove' && arg) {
    const [cid, uid] = String(arg).split(':')
    if (!confirm('Retirer ce membre ?')) return
    const res = removeMember(cid, uid)
    toast(res?.error ? 'Retrait non autorisé' : 'Membre retiré')
    render()
    return
  }
  if (action === 'comm-publish') {
    const id = getOpenCommunauteId()
    const res = createCommunautePost(id, readField('comm-post-body'))
    if (res?.error === 'forbidden') {
      toast('Publication non autorisée')
      return
    }
    if (res?.error === 'empty') {
      toast('Écrivez un texte')
      return
    }
    toast(res?.pending ? 'Publication en attente d’approbation' : 'Publication ajoutée')
    go('communaute-page', { push: false })
    return
  }
  if (action === 'comm-del-post' && arg) {
    const [cid, pid] = String(arg).split(':')
    if (!confirm('Supprimer cette publication ?')) return
    const res = deleteCommunautePost(cid, pid)
    toast(res?.error ? 'Suppression non autorisée' : 'Publication supprimée')
    render()
    return
  }
  if (action === 'comm-react' && arg) {
    const [cid, pid] = String(arg).split(':')
    reactCommunautePost(cid, pid)
    render()
    return
  }
  if (action === 'comm-invite' && arg) {
    toast('Invitation simulée (local)')
    return
  }
  if (action === 'comm-stub') {
    toast(arg ? `Ébauche · ${arg}` : 'Ébauche')
    return
  }
  if (action === 'comm-notif-toggle' && arg) {
    try {
      const key = `ma-ville-comm-notif-${arg}`
      const cur = sessionStorage.getItem(key)
      sessionStorage.setItem(key, cur === '0' ? '1' : '0')
    } catch {
      /* ignore */
    }
    toast('Notifications mises à jour')
    render()
    return
  }
  if (action === 'comm-event-create' && arg) {
    const c = getCommunaute(arg)
    createEmptyEvent({ origin: 'citizen', authorId: SIM_VIEWER_ID, orgLabel: 'Rica' })
    toast(c ? `Événement · contexte ${c.name}` : 'Création d’événement')
    go('evenement-form')
    return
  }
  if (action === 'comm-open-event' && arg) {
    setOpenEventId(arg)
    go('evenement-details')
    return
  }
  if (action === 'comm-member-search') {
    try {
      sessionStorage.setItem('ma-ville-comm-member-search', readField('comm-member-search') || '')
    } catch {
      /* ignore */
    }
    render()
    return
  }
  if (action === 'comm-member-msg' && arg) {
    setMsgTab('maville')
    openOrCreateDm(arg, 'maville')
    go('messages-thread')
    return
  }
  if (action === 'comm-group-msg') {
    toast('Message groupé simulé (local)')
    return
  }
  if (action === 'comm-toggle-field' && arg) {
    const id = getOpenCommunauteId()
    const c = getCommunaute(id)
    if (!c || !isCommunauteAdmin(c)) {
      toast('Réservé aux admins de la communauté')
      return
    }
    const patch = {}
    if (arg === 'autoValidateMembers') {
      patch.autoValidateMembers = !c.autoValidateMembers
      patch.access = patch.autoValidateMembers ? 'open' : 'validation'
    } else if (arg === 'autoApprovePosts') {
      patch.autoApprovePosts = !c.autoApprovePosts
    } else return
    updateSettings(id, patch)
    render()
    return
  }
  if (action === 'comm-settings-save') {
    const id = getOpenCommunauteId()
    const c = getCommunaute(id)
    if (!c || !isCommunauteAdmin(c)) {
      toast('Réservé aux admins de la communauté')
      return
    }
    const privacy = readField('comm-privacy') || c.privacy
    const inviteWho = readField('comm-invite-who') || c.inviteWho
    updateSettings(id, {
      privacy: privacy === 'private' ? 'private' : 'public',
      inviteWho: inviteWho === 'admin' ? 'admin' : 'member',
    })
    toast('Paramètres enregistrés')
    go('communaute-page', { push: false })
    return
  }
  if (action === 'comm-role-pick' && arg) {
    setRolePick(arg === 'modo' ? 'modo' : 'admin')
    render()
    return
  }
  if (action === 'comm-assign-role' && arg) {
    const [cid, uid] = String(arg).split(':')
    const role = getRolePick() || 'admin'
    const res = assignRole(cid, uid, role)
    if (res?.error) {
      toast('Attribution impossible')
      return
    }
    toast(role === 'modo' ? 'Modérateur ajouté' : 'Administrateur ajouté')
    go('communaute-parametres', { push: false })
    return
  }
  if (action === 'comm-dissolve' && arg) {
    if (!confirm('Dissoudre cette communauté ? Action irréversible (prototype).')) return
    const res = dissolveCommunaute(arg)
    if (res?.error) {
      toast('Dissolution non autorisée')
      return
    }
    toast('Communauté dissoute')
    go(res.kind === 'clubs' ? 'communautes-clubs' : 'communautes-groupes', { push: false })
    return
  }
  if (action === 'comm-leave-admin' && arg) {
    if (!confirm('Quitter le rôle administrateur ?')) return
    const res = leaveAdminRole(arg)
    if (res?.error === 'last_admin') {
      toast('Impossible : dernier administrateur')
      return
    }
    if (res?.error) {
      toast('Action non autorisée')
      return
    }
    toast('Rôle administrateur quitté')
    go('communaute-page', { push: false })
    return
  }
  if (action === 'comm-create-start' && arg) {
    startCreateDraft(arg)
    go('communaute-create')
    return
  }
  if (action === 'comm-create-photo' && arg) {
    const draft = getCreateDraft()
    if (!draft) return
    if (arg === 'profile') draft.profilePhoto = 'local-profile'
    else draft.coverPhoto = 'local-cover'
    setCreateDraft(draft)
    toast('Aperçu local (simulé)')
    render()
    return
  }
  if (action === 'comm-create-toggle' && arg) {
    const draft = getCreateDraft()
    if (!draft) return
    if (arg === 'autoValidateMembers') draft.autoValidateMembers = draft.autoValidateMembers === false
    else if (arg === 'autoApprovePosts') draft.autoApprovePosts = draft.autoApprovePosts === false
    setCreateDraft(draft)
    render()
    return
  }
  if (action === 'comm-create-next') {
    const draft = getCreateDraft()
    if (!draft) return
    draft.name = readField('comm-create-name') || draft.name
    draft.categoryId = readField('comm-create-category') || draft.categoryId
    draft.description = readField('comm-create-desc') || draft.description
    if (!draft.name?.trim()) {
      toast('Indiquez un nom')
      return
    }
    draft.step = 2
    setCreateDraft(draft)
    render()
    return
  }
  if (action === 'comm-create-prev') {
    const draft = getCreateDraft()
    if (!draft) return
    draft.privacy = readField('comm-create-privacy') || draft.privacy
    draft.inviteWho = readField('comm-create-invite-who') || draft.inviteWho
    draft.step = 1
    setCreateDraft(draft)
    render()
    return
  }
  if (action === 'comm-create-submit') {
    const draft = getCreateDraft()
    if (!draft) return
    draft.privacy = readField('comm-create-privacy') || draft.privacy
    draft.inviteWho = readField('comm-create-invite-who') || draft.inviteWho
    const res = createCommunauteFromDraft(draft)
    if (res?.error) {
      toast('Création impossible')
      return
    }
    toast(`${res.kind === 'clubs' ? 'Club' : 'Groupe'} créé`)
    setCommunautePageView('publications')
    go('communaute-page', { push: false })
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
    rdv: 'Rendez-vous — utilisez Confirmer',
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
          <span class="proto-tag">Wireframe · build 1001-n · groupes-clubs-maquette</span>
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
    const openMod = e.target.closest('[data-open-mod-case]')
    if (openMod) {
      e.preventDefault()
      setOpenModCaseId(openMod.dataset.openModCase)
      go('moderation-case')
      return
    }
    const day = e.target.closest('.cal-day')
    if (day && day.closest('.calendar') && !day.classList.contains('closed')) {
      e.preventDefault()
      if (day.dataset.sim) {
        handleSim(day.dataset.sim)
        return
      }
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
      const label = motifPick.dataset.motifLabel || motifPick.dataset.motifPick
      const motifId = motifPick.dataset.motifPick
      if (value) {
        value.textContent = label
        value.dataset.motifId = motifId
      }
      const pick = getRdvPick()
      setRdvPick({ ...pick, motifId })
      box.querySelectorAll('[data-motif-pick]').forEach((o) => o.classList.remove('on'))
      motifPick.classList.add('on')
      box.classList.remove('open')
      const trigger = box.querySelector('[data-motif-toggle]')
      if (trigger) trigger.setAttribute('aria-expanded', 'false')
      const menu = box.querySelector('.motif-dropdown')
      if (menu) menu.hidden = true
      render()
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

  phone.addEventListener('change', (e) => {
    const el = e.target.closest('[data-sim-change]')
    if (!el) return
    handleSim(el.dataset.simChange)
  })
  phone.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter') return
    const el = e.target.closest('[data-sim-change]')
    if (!el) return
    e.preventDefault()
    handleSim(el.dataset.simChange)
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
