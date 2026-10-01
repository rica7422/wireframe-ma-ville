/**
 * Signalements mailbox — not a directory.
 * Habitant = own reports · Admin Kapan = city inbox only.
 */

import { ADMIN_CITY, SIM_VIEWER_ID } from './demo-data.js'

export const SIGNAL_CATEGORIES = [
  'Voirie',
  'Éclairage',
  'Propreté',
  'Équipements publics',
  'Autre',
]

export const SIGNAL_STATUSES = ['Envoyé', 'En cours', 'Résolu', 'Clôturé']

/** Mutable demo store */
export const SIGNALEMENTS = {
  'sig-lampadaire': {
    id: 'sig-lampadaire',
    city: 'kapan',
    authorId: SIM_VIEWER_ID,
    authorName: 'Rica (vous)',
    subject: 'Lampadaire en panne',
    category: 'Éclairage',
    place: 'Rue de la Paix, face au n°12',
    status: 'En cours',
    unread: true,
    createdAt: '2026-09-28T10:00:00',
    updatedAt: '2026-09-30T16:20:00',
    messages: [
      {
        id: 'm1',
        kind: 'user',
        authorId: SIM_VIEWER_ID,
        authorLabel: 'Rica',
        body: 'Le lampadaire devant le 12 ne s’allume plus depuis 3 soirs.',
        photos: true,
        at: '28 sept. · 10:00',
      },
      {
        id: 'm2',
        kind: 'status',
        body: 'Statut passé à En cours',
        at: '29 sept. · 09:15',
      },
      {
        id: 'm3',
        kind: 'mairie',
        authorId: 'org-mairie-kapan',
        authorLabel: 'Mairie de Kapan',
        body: 'Merci. Une équipe de voirie passera cette semaine.',
        photos: false,
        at: '30 sept. · 16:20',
      },
    ],
  },
  'sig-dechets': {
    id: 'sig-dechets',
    city: 'kapan',
    authorId: SIM_VIEWER_ID,
    authorName: 'Rica (vous)',
    subject: 'Déchets abandonnés',
    category: 'Propreté',
    place: 'Parking place centrale',
    status: 'Envoyé',
    unread: false,
    createdAt: '2026-09-30T08:00:00',
    updatedAt: '2026-09-30T08:00:00',
    messages: [
      {
        id: 'm1',
        kind: 'user',
        authorId: SIM_VIEWER_ID,
        authorLabel: 'Rica',
        body: 'Sacs et cartons abandonnés près des containers depuis dimanche.',
        photos: true,
        at: '30 sept. · 08:00',
      },
    ],
  },
  'sig-banc': {
    id: 'sig-banc',
    city: 'kapan',
    authorId: SIM_VIEWER_ID,
    authorName: 'Rica (vous)',
    subject: 'Banc endommagé',
    category: 'Équipements publics',
    place: 'Parc municipal, allée sud',
    status: 'Résolu',
    unread: false,
    createdAt: '2026-09-10T14:00:00',
    updatedAt: '2026-09-20T11:00:00',
    messages: [
      {
        id: 'm1',
        kind: 'user',
        authorId: SIM_VIEWER_ID,
        authorLabel: 'Rica',
        body: 'Lattes cassées sur le banc près de la fontaine.',
        photos: false,
        at: '10 sept. · 14:00',
      },
      {
        id: 'm2',
        kind: 'status',
        body: 'Statut passé à En cours',
        at: '12 sept. · 10:00',
      },
      {
        id: 'm3',
        kind: 'mairie',
        authorId: 'org-mairie-kapan',
        authorLabel: 'Mairie de Kapan',
        body: 'Réparation planifiée.',
        photos: false,
        at: '15 sept. · 09:30',
      },
      {
        id: 'm4',
        kind: 'status',
        body: 'Statut passé à Résolu — Banc remplacé.',
        at: '20 sept. · 11:00',
      },
    ],
  },
  /** Other citizen — only visible to admin city inbox */
  'sig-autre-citoyen': {
    id: 'sig-autre-citoyen',
    city: 'kapan',
    authorId: 'user-other',
    authorName: 'Aram K.',
    subject: 'Nid-de-poule',
    category: 'Voirie',
    place: 'Avenue principale',
    status: 'Envoyé',
    unread: true,
    createdAt: '2026-09-29T12:00:00',
    updatedAt: '2026-09-29T12:00:00',
    messages: [
      {
        id: 'm1',
        kind: 'user',
        authorId: 'user-other',
        authorLabel: 'Aram K.',
        body: 'Gros trou dangereux devant le lycée.',
        photos: false,
        at: '29 sept. · 12:00',
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

export function listSignalementsForViewer({ admin, viewerId = SIM_VIEWER_ID, city = ADMIN_CITY }) {
  const all = Object.values(SIGNALEMENTS)
  let list
  if (admin) {
    list = all.filter((s) => s.city === city)
  } else {
    list = all.filter((s) => s.authorId === viewerId)
  }
  list.sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))
  const filter = getSignalFilter(admin)
  if (filter === 'En cours') list = list.filter((s) => s.status === 'En cours')
  else if (filter === 'Résolus') list = list.filter((s) => s.status === 'Résolu' || s.status === 'Clôturé')
  else if (filter === 'À traiter') list = list.filter((s) => s.status === 'Envoyé')
  return list
}

export function createSignalement({ subject, category, place, body }) {
  const id = `sig-${Date.now()}`
  const now = new Date().toISOString()
  SIGNALEMENTS[id] = {
    id,
    city: ADMIN_CITY,
    authorId: SIM_VIEWER_ID,
    authorName: 'Rica (vous)',
    subject,
    category,
    place,
    status: 'Envoyé',
    unread: false,
    createdAt: now,
    updatedAt: now,
    messages: [
      {
        id: 'm1',
        kind: 'user',
        authorId: SIM_VIEWER_ID,
        authorLabel: 'Rica',
        body,
        photos: false,
        at: 'À l’instant',
      },
    ],
  }
  openSignalId = id
  return SIGNALEMENTS[id]
}

export function appendSignalMessage(id, { kind, body, authorLabel }) {
  const s = SIGNALEMENTS[id]
  if (!s) return null
  s.messages.push({
    id: `m${s.messages.length + 1}`,
    kind,
    authorId: kind === 'mairie' ? 'org-mairie-kapan' : SIM_VIEWER_ID,
    authorLabel,
    body,
    photos: false,
    at: 'À l’instant',
  })
  s.updatedAt = new Date().toISOString()
  if (kind === 'mairie') s.unread = true
  return s
}

export function setSignalStatus(id, status, explanation = '') {
  const s = SIGNALEMENTS[id]
  if (!s) return null
  if (s.status === status) return s
  s.status = status
  s.updatedAt = new Date().toISOString()
  const note =
    status === 'Résolu' || status === 'Clôturé'
      ? `Statut passé à ${status} — ${explanation || '…'}`
      : `Statut passé à ${status}`
  s.messages.push({
    id: `m${s.messages.length + 1}`,
    kind: 'status',
    body: note,
    at: 'À l’instant',
  })
  return s
}

export function markSignalRead(id) {
  const s = SIGNALEMENTS[id]
  if (s) s.unread = false
}

export function statusTransitions(current) {
  const all = ['Envoyé', 'En cours', 'Résolu', 'Clôturé']
  return all.filter((s) => s !== current)
}

export function canReplyToSignal(status) {
  return status === 'Envoyé' || status === 'En cours'
}
