/**
 * Signalements — Q&A private forum (no En cours / Résolu / Clôturé).
 * Read state (Envoyé | Vu) ≠ reply state (En attente | Avec réponse).
 */

import { ADMIN_CITY, SIM_VIEWER_ID } from './demo-data.js'

export const SIGNAL_CATEGORIES = [
  'Voirie',
  'Éclairage',
  'Propreté',
  'Équipements publics',
  'Autre',
]

/** Mutable demo store — shared object for habitant + admin */
export const SIGNALEMENTS = {
  /** 1. Envoyé · En attente · not yet opened by mairie */
  'sig-lampadaire': {
    id: 'sig-lampadaire',
    city: 'kapan',
    authorId: SIM_VIEWER_ID,
    authorName: 'Rica (vous)',
    subject: 'Lampadaire en panne',
    category: 'Éclairage',
    place: 'Rue de la Paix, face au n°12',
    readByMairie: false,
    userHasSeenLastMairie: true,
    createdAt: '2026-09-28T10:00:00',
    updatedAt: '2026-09-28T10:00:00',
    messages: [
      {
        id: 'm1',
        kind: 'user',
        authorId: SIM_VIEWER_ID,
        authorLabel: 'Vous',
        body: 'Le lampadaire devant le 12 ne s’allume plus depuis 3 soirs.',
        photos: true,
        at: '28 sept. · 10:00',
        readByMairie: false,
      },
    ],
  },
  /** 2. Vu · En attente (opened by admin, no reply yet) */
  'sig-dechets': {
    id: 'sig-dechets',
    city: 'kapan',
    authorId: SIM_VIEWER_ID,
    authorName: 'Rica (vous)',
    subject: 'Déchets rue Andranik',
    category: 'Propreté',
    place: 'Rue Andranik, près des containers',
    readByMairie: true,
    userHasSeenLastMairie: true,
    createdAt: '2026-09-29T08:00:00',
    updatedAt: '2026-09-29T11:00:00',
    messages: [
      {
        id: 'm1',
        kind: 'user',
        authorId: SIM_VIEWER_ID,
        authorLabel: 'Vous',
        body: 'Sacs et cartons abandonnés rue Andranik depuis dimanche.',
        photos: true,
        at: '29 sept. · 08:00',
        readByMairie: true,
      },
    ],
  },
  /** 3. Vu · Avec réponse · official reply · user can reply */
  'sig-banc': {
    id: 'sig-banc',
    city: 'kapan',
    authorId: SIM_VIEWER_ID,
    authorName: 'Rica (vous)',
    subject: 'Banc endommagé',
    category: 'Équipements publics',
    place: 'Parc municipal, allée sud',
    readByMairie: true,
    userHasSeenLastMairie: false,
    createdAt: '2026-09-10T14:00:00',
    updatedAt: '2026-09-20T11:00:00',
    messages: [
      {
        id: 'm1',
        kind: 'user',
        authorId: SIM_VIEWER_ID,
        authorLabel: 'Vous',
        body: 'Lattes cassées sur le banc près de la fontaine.',
        photos: false,
        at: '10 sept. · 14:00',
        readByMairie: true,
      },
      {
        id: 'm2',
        kind: 'mairie',
        authorId: 'org-mairie-kapan',
        authorLabel: 'Mairie de Kapan',
        body: 'Merci pour le signalement. Le banc a été remplacé ce matin.',
        photos: false,
        at: '20 sept. · 11:00',
      },
    ],
  },
}

let activeFilterHabitant = 'Tous'
let activeFilterAdmin = 'Tous'
let openSignalId = null

export function getSignalFilter(admin) {
  return admin ? activeFilterAdmin : activeFilterHabitant
}

export function setSignalFilter(admin, value) {
  if (admin) activeFilterAdmin = value
  else activeFilterHabitant = value
}

export function getOpenSignalId() {
  return openSignalId
}

export function setOpenSignalId(id) {
  openSignalId = id
}

export function getSignalement(id) {
  return SIGNALEMENTS[id] || null
}

export function lastMessage(s) {
  if (!s?.messages?.length) return null
  return s.messages[s.messages.length - 1]
}

/** Envoyé | Vu par la mairie */
export function readLabel(s) {
  return s.readByMairie ? 'Vu par la mairie' : 'Envoyé'
}

/**
 * En attente de réponse = no mairie reply, OR user wrote after last mairie reply
 * Avec réponse = last message is mairie
 */
export function replyLabel(s) {
  const last = lastMessage(s)
  if (!last) return 'En attente de réponse'
  if (last.kind === 'mairie') return 'Avec réponse'
  return 'En attente de réponse'
}

export function hasMairieReply(s) {
  return (s.messages || []).some((m) => m.kind === 'mairie')
}

/** Habitant: Nouvelle réponse if last mairie msg not seen */
export function isNewMairieReply(s) {
  const last = lastMessage(s)
  return last?.kind === 'mairie' && !s.userHasSeenLastMairie
}

/** Admin: unread if last user message not read by team */
export function isUnreadForMairie(s) {
  const last = lastMessage(s)
  if (!last || last.kind !== 'user') return false
  return last.readByMairie === false
}

export function listSignalementsForViewer({ admin, viewerId = SIM_VIEWER_ID, city = ADMIN_CITY }) {
  let list = Object.values(SIGNALEMENTS).filter((s) =>
    admin ? s.city === city : s.authorId === viewerId
  )
  list.sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))
  const filter = getSignalFilter(admin)

  if (admin) {
    if (filter === 'Non lus') list = list.filter(isUnreadForMairie)
    else if (filter === 'À répondre') list = list.filter((s) => lastMessage(s)?.kind === 'user')
    else if (filter === 'Répondus') list = list.filter((s) => lastMessage(s)?.kind === 'mairie')
  } else {
    if (filter === 'En attente de réponse') list = list.filter((s) => replyLabel(s) === 'En attente de réponse')
    else if (filter === 'Avec réponse') list = list.filter((s) => replyLabel(s) === 'Avec réponse')
  }
  return list
}

export function createSignalement({ subject, place, body, category = '' }) {
  const id = `sig-${Date.now()}`
  const now = new Date().toISOString()
  SIGNALEMENTS[id] = {
    id,
    city: ADMIN_CITY,
    authorId: SIM_VIEWER_ID,
    authorName: 'Rica (vous)',
    subject: subject || 'Nouveau signalement',
    category: category || '',
    place: place || 'Lieu…',
    readByMairie: false,
    userHasSeenLastMairie: true,
    createdAt: now,
    updatedAt: now,
    messages: [
      {
        id: 'm1',
        kind: 'user',
        authorId: SIM_VIEWER_ID,
        authorLabel: 'Vous',
        body: body || 'Description…',
        photos: false,
        at: 'À l’instant',
        readByMairie: false,
      },
    ],
  }
  openSignalId = id
  return SIGNALEMENTS[id]
}

/** Admin opens thread → mark user messages read + readByMairie */
export function openAsMairie(id) {
  const s = SIGNALEMENTS[id]
  if (!s) return null
  s.readByMairie = true
  s.messages.forEach((m) => {
    if (m.kind === 'user') m.readByMairie = true
  })
  return s
}

/** Habitant opens thread → clear Nouvelle réponse */
export function openAsHabitant(id) {
  const s = SIGNALEMENTS[id]
  if (!s) return null
  s.userHasSeenLastMairie = true
  return s
}

export function appendUserReply(id, body) {
  const s = SIGNALEMENTS[id]
  if (!s || !hasMairieReply(s)) return null
  s.messages.push({
    id: `m${s.messages.length + 1}`,
    kind: 'user',
    authorId: SIM_VIEWER_ID,
    authorLabel: 'Vous',
    body,
    photos: false,
    at: 'À l’instant',
    readByMairie: false,
  })
  s.updatedAt = new Date().toISOString()
  s.userHasSeenLastMairie = true
  return s
}

export function appendMairieReply(id, body) {
  const s = SIGNALEMENTS[id]
  if (!s) return null
  s.readByMairie = true
  s.messages.forEach((m) => {
    if (m.kind === 'user') m.readByMairie = true
  })
  s.messages.push({
    id: `m${s.messages.length + 1}`,
    kind: 'mairie',
    authorId: 'org-mairie-kapan',
    authorLabel: 'Mairie de Kapan',
    body,
    photos: false,
    at: 'À l’instant',
  })
  s.updatedAt = new Date().toISOString()
  s.userHasSeenLastMairie = false
  return s
}

/** @deprecated status circuit removed — kept as no-ops for old imports */
export function setSignalStatus() {
  return null
}
export function statusTransitions() {
  return []
}
export function canReplyToSignal() {
  return false
}
export function markSignalRead(id) {
  return openAsHabitant(id)
}
export function appendSignalMessage(id, { kind, body }) {
  if (kind === 'mairie') return appendMairieReply(id, body)
  return appendUserReply(id, body)
}
