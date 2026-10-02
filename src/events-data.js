/**
 * Shared événements — one object, one id.
 * Create = new id · Edit = selected object · never open Atelier for every Créer.
 */

import { ADMIN_CITY, SIM_VIEWER_ID, EVENTS } from './demo-data.js'

/** Mutable store — also mirrored into demo-data EVENTS for permissions */
export const EVENT_STORE = {
  'evt-atelier': {
    id: 'evt-atelier',
    city: 'kapan',
    title: 'Atelier créatif',
    origin: 'municipal', // municipal | citizen
    orgId: 'org-mairie-kapan',
    orgLabel: 'Mairie de Kapan',
    authorId: 'org-mairie-kapan',
    publication: 'published', // draft | pending | to_correct | refused | published
    runState: 'upcoming', // upcoming | ongoing | ended | cancelled
    inscriptionMode: 'immediate', // free | immediate | validation
    capacity: 20,
    confirmedCount: 12,
    pendingCount: 2,
    inscriptionsOpen: true,
    price: '20 €',
    isFree: false,
    category: 'Artistique / Créatif',
    dateLabel: 'Vendredi 16 juin 2026',
    dateEndLabel: '',
    dateShort: 'JUIN 16',
    time: '15:30',
    timeEnd: '17:30',
    countdown: '5 jours restants',
    lieu: 'Centre culturel · Kapan',
    lieuDetail: 'Centre culturel, salle A',
    cityLabel: 'Kapan, Arménie',
    ville: 'Kapan',
    description:
      'Parfois, les mots ne suffisent pas à exprimer ce qui nous habite. Cet atelier créatif vous invite à explorer d’autres langages.',
    inscriptionDeadline: '',
    conditions: '',
    reactionCount: 10,
    hobbies: ['Beatboxing', 'Chant', 'Saxophone', 'Violon', 'Piano'],
    tags: ['Artistique / Créatif', 'Payant'],
  },
  'evt-soiree': {
    id: 'evt-soiree',
    city: 'kapan',
    title: 'Soirée dansante',
    origin: 'municipal',
    orgId: 'org-mairie-kapan',
    orgLabel: 'Mairie de Kapan',
    authorId: 'org-mairie-kapan',
    publication: 'published',
    runState: 'upcoming',
    inscriptionMode: 'immediate',
    capacity: 80,
    confirmedCount: 24,
    pendingCount: 0,
    inscriptionsOpen: true,
    price: 'Gratuit',
    isFree: true,
    category: 'Social / Lifestyle',
    dateLabel: 'Dimanche 28 juin 2026',
    dateEndLabel: '',
    dateShort: 'JUIN 28',
    time: '20:00',
    timeEnd: '23:00',
    countdown: '17 jours restants',
    lieu: 'Salle municipale · Kapan',
    lieuDetail: 'Salle municipale',
    cityLabel: 'Kapan, Arménie',
    ville: 'Kapan',
    description: 'Soirée dansante ouverte à tous.',
    inscriptionDeadline: 'Dimanche 21 juin 2026',
    conditions: '',
    reactionCount: 4,
    tags: ['Social / Lifestyle', 'Gratuit'],
  },
  'evt-conseil': {
    id: 'evt-conseil',
    city: 'kapan',
    title: 'Conseil municipal (public)',
    origin: 'municipal',
    orgId: 'org-mairie-kapan',
    orgLabel: 'Mairie de Kapan',
    authorId: 'org-mairie-kapan',
    publication: 'published',
    runState: 'upcoming',
    inscriptionMode: 'free',
    capacity: null, // unlimited
    confirmedCount: 0,
    pendingCount: 0,
    inscriptionsOpen: true,
    price: 'Gratuit',
    isFree: true,
    category: 'Institutionnel',
    dateLabel: 'Jeudi 2 juillet 2026',
    dateEndLabel: '',
    dateShort: 'JUIL 02',
    time: '18:30',
    timeEnd: '21:00',
    countdown: '21 jours restants',
    lieu: 'Hôtel de ville · Kapan',
    lieuDetail: 'Salle du conseil',
    cityLabel: 'Kapan, Arménie',
    ville: 'Kapan',
    description: 'Séance publique du conseil municipal.',
    inscriptionDeadline: '',
    conditions: 'Entrée libre · places assises limitées',
    reactionCount: 0,
    tags: ['Institutionnel', 'Gratuit'],
  },
  'evt-marche-draft': {
    id: 'evt-marche-draft',
    city: 'kapan',
    title: 'Marché de Noël',
    origin: 'municipal',
    orgId: 'org-mairie-kapan',
    orgLabel: 'Mairie de Kapan',
    authorId: 'org-mairie-kapan',
    publication: 'draft',
    runState: 'upcoming',
    inscriptionMode: 'free',
    capacity: null,
    confirmedCount: 0,
    pendingCount: 0,
    inscriptionsOpen: false,
    price: 'Gratuit',
    isFree: true,
    category: 'Culture',
    dateLabel: 'Samedi 12 décembre 2026',
    dateEndLabel: 'Dimanche 13 décembre 2026',
    dateShort: 'DÉC 12',
    time: '10:00',
    timeEnd: '18:00',
    countdown: '',
    lieu: 'Place centrale · Kapan',
    lieuDetail: 'Place centrale',
    cityLabel: 'Kapan, Arménie',
    ville: 'Kapan',
    description: 'Brouillon — marché de Noël.',
    inscriptionDeadline: '',
    conditions: '',
    reactionCount: 0,
    tags: ['Culture', 'Gratuit'],
  },
  /** Habitant event awaiting mairie validation */
  'evt-citoyen-pending': {
    id: 'evt-citoyen-pending',
    city: 'kapan',
    title: 'Atelier photo amateur',
    origin: 'citizen',
    orgId: SIM_VIEWER_ID,
    orgLabel: 'Rica',
    authorId: SIM_VIEWER_ID,
    publication: 'pending',
    runState: 'upcoming',
    inscriptionMode: 'validation',
    capacity: 15,
    confirmedCount: 0,
    pendingCount: 0,
    inscriptionsOpen: false,
    price: 'Gratuit',
    isFree: true,
    category: 'Artistique / Créatif',
    dateLabel: 'Samedi 18 juillet 2026',
    dateEndLabel: '',
    dateShort: 'JUIL 18',
    time: '14:00',
    timeEnd: '17:00',
    countdown: '',
    lieu: 'Parc municipal · Kapan',
    lieuDetail: 'Allée sud',
    cityLabel: 'Kapan, Arménie',
    ville: 'Kapan',
    description: 'Atelier photo pour débutants — en attente de validation mairie.',
    inscriptionDeadline: 'Vendredi 17 juillet 2026',
    conditions: 'Apporter son appareil photo.',
    reactionCount: 0,
    tags: ['Artistique / Créatif', 'Gratuit'],
  },
}

const EDIT_KEY = 'ma-ville-event-edit'
const OPEN_KEY = 'ma-ville-event-open'
const TAB_KEY = 'ma-ville-event-list-tab'
const MES_SUB_KEY = 'ma-ville-event-mes-sub'
const FORM_STEP_KEY = 'ma-ville-event-form-step'
const STORE_KEY = 'ma-ville-event-store'

function persistStore() {
  try {
    sessionStorage.setItem(STORE_KEY, JSON.stringify(EVENT_STORE))
  } catch {
    /* ignore */
  }
}

function hydrateStore() {
  try {
    const raw = sessionStorage.getItem(STORE_KEY)
    if (!raw) return
    const saved = JSON.parse(raw)
    if (saved && typeof saved === 'object') {
      // merge saved over defaults (keeps new ids + mutations)
      Object.keys(saved).forEach((id) => {
        EVENT_STORE[id] = saved[id]
      })
    }
  } catch {
    /* ignore */
  }
}

hydrateStore()

export function getEvent(id) {
  return EVENT_STORE[id] || null
}

export function setOpenEventId(id) {
  try {
    if (id) sessionStorage.setItem(OPEN_KEY, id)
    else sessionStorage.removeItem(OPEN_KEY)
  } catch {
    /* ignore */
  }
}

export function getOpenEventId() {
  try {
    return sessionStorage.getItem(OPEN_KEY)
  } catch {
    return null
  }
}

export function publicationLabel(pub) {
  return (
    {
      draft: 'Brouillon',
      pending: 'En attente',
      to_correct: 'À corriger',
      refused: 'Refusé',
      published: 'Publié',
    }[pub] || pub
  )
}

export function setMesSub(sub) {
  try {
    sessionStorage.setItem(MES_SUB_KEY, sub)
  } catch {
    /* ignore */
  }
}

export function getMesSub() {
  try {
    return sessionStorage.getItem(MES_SUB_KEY) || 'participations'
  } catch {
    return 'participations'
  }
}

export function listPublicEvents() {
  return Object.values(EVENT_STORE)
    .filter((e) => e.publication === 'published' && e.runState !== 'cancelled')
    .sort((a, b) => (a.dateShort > b.dateShort ? 1 : -1))
}

export function listMyParticipations() {
  // demo: atelier as potential participation target
  return Object.values(EVENT_STORE).filter((e) => e.id === 'evt-atelier' && e.publication === 'published')
}

export function listMyCreations(viewerId = SIM_VIEWER_ID) {
  return Object.values(EVENT_STORE).filter((e) => e.authorId === viewerId)
}

export function listPendingValidation() {
  return Object.values(EVENT_STORE).filter((e) => e.publication === 'pending')
}

export function listAdminManaged() {
  return Object.values(EVENT_STORE).filter((e) => e.city === ADMIN_CITY)
}

export function placesRestantes(e) {
  if (e.capacity == null) return null
  return Math.max(0, e.capacity - (e.confirmedCount || 0))
}

export function placesLabel(e) {
  const left = placesRestantes(e)
  if (left == null) return null
  return `${left} place${left > 1 ? 's' : ''} restante${left > 1 ? 's' : ''}`
}

export function isLimited(e) {
  return e.capacity != null
}

export function setEditEventId(id) {
  try {
    if (id) sessionStorage.setItem(EDIT_KEY, id)
    else sessionStorage.removeItem(EDIT_KEY)
  } catch {
    /* ignore */
  }
}

export function getEditEventId() {
  try {
    return sessionStorage.getItem(EDIT_KEY)
  } catch {
    return null
  }
}

export function setListTab(tab) {
  try {
    sessionStorage.setItem(TAB_KEY, tab)
  } catch {
    /* ignore */
  }
}

export function getListTab() {
  try {
    return sessionStorage.getItem(TAB_KEY) || 'decouvrir'
  } catch {
    return 'decouvrir'
  }
}

export function setFormStep(step) {
  try {
    sessionStorage.setItem(FORM_STEP_KEY, String(step))
  } catch {
    /* ignore */
  }
}

export function getFormStep() {
  try {
    return Number(sessionStorage.getItem(FORM_STEP_KEY) || '1')
  } catch {
    return 1
  }
}

/** Create empty draft — new id, not Atelier */
export function createEmptyEvent({ origin = 'citizen', authorId = SIM_VIEWER_ID, orgLabel = 'Rica' } = {}) {
  const id = `evt-${Date.now()}`
  EVENT_STORE[id] = {
    id,
    city: ADMIN_CITY,
    title: '',
    origin,
    orgId: authorId,
    orgLabel: origin === 'municipal' ? 'Mairie de Kapan' : orgLabel,
    authorId,
    publication: 'draft',
    runState: 'upcoming',
    inscriptionMode: 'immediate',
    capacity: 20,
    confirmedCount: 0,
    pendingCount: 0,
    inscriptionsOpen: true,
    price: 'Gratuit',
    isFree: true,
    category: 'Culture',
    dateLabel: '',
    dateEndLabel: '',
    dateShort: '',
    time: '',
    timeEnd: '',
    countdown: '',
    lieu: '',
    lieuDetail: '',
    cityLabel: 'Kapan, Arménie',
    ville: 'Kapan',
    description: '',
    inscriptionDeadline: '',
    conditions: '',
    reactionCount: 0,
    tags: [],
  }
  setEditEventId(id)
  setFormStep(1)
  syncDemoEvent(id)
  persistStore()
  return EVENT_STORE[id]
}

export function updateEvent(id, patch) {
  const e = EVENT_STORE[id]
  if (!e) return null
  Object.assign(e, patch)
  syncDemoEvent(id)
  persistStore()
  return e
}

export function submitForValidation(id) {
  const e = EVENT_STORE[id]
  if (!e) return null
  e.publication = 'pending'
  syncDemoEvent(id)
  persistStore()
  return e
}

export function approveEvent(id) {
  const e = EVENT_STORE[id]
  if (!e) return null
  e.publication = 'published'
  e.inscriptionsOpen = true
  // keep citizen origin — do not make municipal
  syncDemoEvent(id)
  persistStore()
  return e
}

export function refuseEvent(id, motif = '') {
  const e = EVENT_STORE[id]
  if (!e) return null
  e.publication = 'refused'
  e.refuseMotif = motif
  syncDemoEvent(id)
  persistStore()
  return e
}

export function requestCorrections(id, motif = '') {
  const e = EVENT_STORE[id]
  if (!e) return null
  e.publication = 'to_correct'
  e.correctMotif = motif
  syncDemoEvent(id)
  persistStore()
  return e
}

export function publishEvent(id) {
  const e = EVENT_STORE[id]
  if (!e) return null
  e.publication = 'published'
  e.inscriptionsOpen = true
  syncDemoEvent(id)
  persistStore()
  return e
}

export function cancelEvent(id, motif = '') {
  const e = EVENT_STORE[id]
  if (!e) return null
  e.runState = 'cancelled'
  e.cancelMotif = motif
  syncDemoEvent(id)
  persistStore()
  return e
}

export function withdrawValidationRequest(id) {
  const e = EVENT_STORE[id]
  if (!e) return null
  e.publication = 'draft'
  syncDemoEvent(id)
  persistStore()
  return e
}

/** Sync thin demo-data EVENTS for permissions menus */
export function syncDemoEvent(id) {
  const e = EVENT_STORE[id]
  if (!e) return null
  const thin = {
    id: e.id,
    type: 'event',
    city: e.city,
    title: e.title || 'Événement',
    state:
      e.runState === 'cancelled'
        ? 'cancelled'
        : e.runState === 'ended'
          ? 'ended'
          : e.publication === 'published'
            ? 'published'
            : 'draft',
    inscriptionsOpen: e.inscriptionsOpen,
    full: e.capacity != null && placesRestantes(e) === 0,
    reactionCount: e.reactionCount || 0,
    orgId: e.orgId,
  }
  EVENTS[id] = thin
  return thin
}

function syncAllDemoEvents() {
  Object.keys(EVENT_STORE).forEach(syncDemoEvent)
}

/** Seed permissions EVENTS from store */
syncAllDemoEvents()
