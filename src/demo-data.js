/**
 * Demo content with stable ids — permissions use these, not display names.
 * Ville gérée par le simulateur admin : kapan.
 */

export const SIM_VIEWER_ID = 'user-rica'
export const ADMIN_CITY = 'kapan'

export const PUBLICATIONS = {
  'pub-mairie-1': {
    id: 'pub-mairie-1',
    type: 'publication',
    kind: 'official',
    city: 'kapan',
    authorId: 'org-mairie-kapan',
    authorLabel: 'Mairie de Kapan',
    state: 'published',
    reactionCount: 12,
    body: 'Informations et actualités de votre mairie.',
  },
  'pub-mairie-2': {
    id: 'pub-mairie-2',
    type: 'publication',
    kind: 'official',
    city: 'kapan',
    authorId: 'org-mairie-kapan',
    authorLabel: 'Mairie de Kapan',
    state: 'published',
    reactionCount: 0,
    body: 'Rappel — démarches en mairie et horaires d’accueil.',
    multi: true,
  },
  'pub-citoyen-own': {
    id: 'pub-citoyen-own',
    type: 'publication',
    kind: 'citizen',
    city: 'kapan',
    authorId: 'user-rica',
    authorLabel: 'Arman Petrosyan',
    state: 'published',
    reactionCount: 128,
    body: 'Collecte des déchets verts renforcée ce week-end…',
  },
  'pub-citoyen-other': {
    id: 'pub-citoyen-other',
    type: 'publication',
    kind: 'citizen',
    city: 'kapan',
    authorId: 'user-liana',
    authorLabel: 'Liana Avetisyan',
    state: 'published',
    reactionCount: 86,
    body: 'Marché du samedi — producteurs locaux…',
  },
  'pub-citoyen-other-0': {
    id: 'pub-citoyen-other-0',
    type: 'publication',
    kind: 'citizen',
    city: 'kapan',
    authorId: 'user-hov',
    authorLabel: 'Hovhannes Mkrtchyan',
    state: 'published',
    reactionCount: 0,
    body: 'Retour en images du festival…',
  },
  'pub-mairie-feed': {
    id: 'pub-mairie-feed',
    type: 'publication',
    kind: 'official',
    city: 'kapan',
    authorId: 'org-mairie-kapan',
    authorLabel: 'Mairie de Kapan',
    state: 'published',
    reactionCount: 64,
    body: 'Replay du conseil municipal…',
  },
}

export const DIRECTORIES = {
  'dir-pharmacie-centrale': {
    id: 'dir-pharmacie-centrale',
    type: 'directory',
    city: 'kapan',
    title: 'Pharmacie centrale',
    state: 'published', // published | draft | unpublished
    phone: true,
    place: true,
    reportedErrors: true,
  },
  'dir-pharmacie-draft': {
    id: 'dir-pharmacie-draft',
    type: 'directory',
    city: 'kapan',
    title: 'Pharmacie (brouillon équipe)',
    state: 'draft',
    phone: true,
    place: true,
    reportedErrors: false,
  },
  'dir-pharmacie-unpublished': {
    id: 'dir-pharmacie-unpublished',
    type: 'directory',
    city: 'kapan',
    title: 'Ancienne pharmacie',
    state: 'unpublished',
    phone: false,
    place: true,
    reportedErrors: false,
  },
}

export const EVENTS = {
  'evt-atelier': {
    id: 'evt-atelier',
    type: 'event',
    city: 'kapan',
    title: 'Atelier créatif',
    state: 'published', // draft | published | cancelled | ended
    inscriptionsOpen: true,
    full: false,
    reactionCount: 10,
    orgId: 'org-mairie-kapan',
  },
}

/** Personal inscription status for simulated viewer — exclusive */
export const EVENT_INSCRIPTIONS = {
  'evt-atelier': 'none', // none | pending | confirmed | refused
}

export const PARTICIPANTS = {
  'part-rouben': {
    id: 'part-rouben',
    eventId: 'evt-atelier',
    userId: 'user-rouben',
    name: 'Rouben Sirunyan',
    status: 'confirmed', // pending | confirmed | refused
  },
  'part-lilit': {
    id: 'part-lilit',
    eventId: 'evt-atelier',
    userId: 'user-lilit',
    name: 'Lilit Ameni',
    status: 'pending',
  },
}

export function getPublication(id) {
  return PUBLICATIONS[id] || null
}

export function getDirectory(id) {
  return DIRECTORIES[id] || null
}

export function getEvent(id) {
  return EVENTS[id] || null
}

export function getParticipant(id) {
  return PARTICIPANTS[id] || null
}
