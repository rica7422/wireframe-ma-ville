/**
 * Annuaires BO — rubriques Vie locale + fiches demo.
 */

const FICHE_CTX_KEY = 'ma-ville-fiche-ctx'
const OPEN_DIR_KEY = 'ma-ville-dir-fiche-open'
const RUBRIQUE_KEY = 'ma-ville-annuaire-rubrique'
const PUB_EDIT_KEY = 'ma-ville-pub-edit'
const PUB_STORE_KEY = 'ma-ville-admin-pubs'

/** Demo list-row fiches (user annuaire) — not in BO rubriques */
const DIR_DEMO_FICHES = {}

export const ANN_RUBRIQUES = [
  {
    id: 'sante',
    label: 'Santé',
    go: 'admin-annuaire-sante',
    meta: 'Pharmacies, hôpitaux…',
    sousCats: [
      { label: 'Pharmacies', go: 'admin-annuaire-pharmacies' },
      { label: 'Hôpitaux', go: 'sante-hopitaux' },
    ],
    fiches: [],
  },
  {
    id: 'education',
    label: 'Éducation',
    meta: 'Écoles, formations…',
    sousCats: [
      { label: 'Écoles', id: 'ecoles' },
      { label: 'Formations', id: 'formations' },
      { label: 'Universités', id: 'universites' },
      { label: 'Activités', id: 'activites' },
    ],
    fiches: [
      {
        id: 'fiche-ecole-1',
        title: 'École primaire N°1',
        sousCat: 'Écoles',
        status: 'Publié',
        address: '12 rue de l’École, Kapan',
        phone: '+374 285 20 110',
        hours: '08:00 – 17:00',
        description: 'École primaire municipale.',
        hasPhone: true,
        hasPlace: true,
      },
      {
        id: 'fiche-formation-1',
        title: 'Centre de formation professionnelle',
        sousCat: 'Formations',
        status: 'Brouillon',
        address: '3 av. de la Culture, Kapan',
        phone: '',
        hours: 'Sur rendez-vous',
        description: 'Formations adultes.',
        hasPhone: false,
        hasPlace: true,
      },
    ],
  },
  {
    id: 'tourisme',
    label: 'Tourisme',
    meta: 'Patrimoine, nature…',
    sousCats: [
      { label: 'Patrimoine', id: 'patrimoine' },
      { label: 'Nature', id: 'nature' },
      { label: 'Culture', id: 'culture' },
      { label: 'Activités', id: 'activites' },
    ],
    fiches: [
      {
        id: 'fiche-vahanavank',
        title: 'Monastère de Vahanavank',
        sousCat: 'Patrimoine',
        status: 'Publié',
        address: 'Vahanavank, Kapan',
        phone: '',
        hours: '09:00 – 18:00',
        description: 'Site monastique du Xe siècle.',
        hasPhone: false,
        hasPlace: true,
      },
    ],
  },
  {
    id: 'economie',
    label: 'Économie',
    meta: 'Entreprises, commerces…',
    sousCats: [
      { label: 'Entreprises', id: 'entreprises' },
      { label: 'Commerces', id: 'commerces' },
    ],
    fiches: [
      {
        id: 'fiche-commerce-1',
        title: 'Marché central',
        sousCat: 'Commerces',
        status: 'Publié',
        address: 'Place du Marché, Kapan',
        phone: '+374 285 22 010',
        hours: '07:00 – 14:00',
        description: 'Produits locaux.',
        hasPhone: true,
        hasPlace: true,
      },
    ],
  },
  {
    id: 'cinemas',
    label: 'Cinéma & Théâtres',
    meta: 'Salles, spectacles…',
    sousCats: [
      { label: 'Cinémas', id: 'cinemas' },
      { label: 'Théâtres', id: 'theatres' },
    ],
    fiches: [
      {
        id: 'fiche-cinema-1',
        title: 'Cinéma municipal',
        sousCat: 'Cinémas',
        status: 'Publié',
        address: '5 rue des Arts, Kapan',
        phone: '+374 285 33 100',
        hours: 'Selon programme',
        description: 'Salle municipale.',
        hasPhone: true,
        hasPlace: true,
      },
    ],
  },
  {
    id: 'aide',
    label: 'Aide sociale',
    meta: 'Services sociaux…',
    sousCats: [{ label: 'Services sociaux', id: 'services' }],
    fiches: [
      {
        id: 'fiche-aide-1',
        title: 'Centre social',
        sousCat: 'Services sociaux',
        status: 'Publié',
        address: 'Hôtel de ville · annexe B',
        phone: '+374 285 10 200',
        hours: '09:00 – 17:00',
        description: 'Accueil social.',
        hasPhone: true,
        hasPlace: true,
      },
    ],
  },
  {
    id: 'associations',
    label: 'Associations',
    meta: 'Clubs, collectifs…',
    sousCats: [{ label: 'Associations', id: 'assoc' }],
    fiches: [
      {
        id: 'fiche-assoc-1',
        title: 'Association culturelle Syunik',
        sousCat: 'Associations',
        status: 'Publié',
        address: 'Maison des associations, Kapan',
        phone: '+374 285 44 010',
        hours: 'Sur rendez-vous',
        description: 'Culture et patrimoine.',
        hasPhone: true,
        hasPlace: true,
      },
    ],
  },
  {
    id: 'banques',
    label: 'Banques & Assurances',
    meta: 'Agences…',
    sousCats: [
      { label: 'Banques', id: 'banques' },
      { label: 'Assurances', id: 'assurances' },
    ],
    fiches: [
      {
        id: 'fiche-banque-1',
        title: 'Agence bancaire centre',
        sousCat: 'Banques',
        status: 'Publié',
        address: '1 place centrale, Kapan',
        phone: '+374 285 55 100',
        hours: '09:30 – 16:30',
        description: 'Agence ouverte en semaine.',
        hasPhone: true,
        hasPlace: true,
      },
    ],
  },
  {
    id: 'restaurants',
    label: 'Restaurants',
    meta: 'Restauration…',
    sousCats: [{ label: 'Restaurants', id: 'restos' }],
    fiches: [
      {
        id: 'fiche-resto-1',
        title: 'Restaurant Syunik',
        sousCat: 'Restaurants',
        status: 'Publié',
        address: '8 rue de la Gare, Kapan',
        phone: '+374 285 66 200',
        hours: '12:00 – 22:00',
        description: 'Cuisine arménienne.',
        hasPhone: true,
        hasPlace: true,
      },
    ],
  },
  {
    id: 'transports',
    label: 'Transports',
    meta: 'Gares, lignes…',
    sousCats: [
      { label: 'Gares', id: 'gares' },
      { label: 'Lignes', id: 'lignes' },
    ],
    fiches: [
      {
        id: 'fiche-gare-1',
        title: 'Gare routière de Kapan',
        sousCat: 'Gares',
        status: 'Publié',
        address: 'Avenue de la Gare, Kapan',
        phone: '+374 285 70 010',
        hours: '06:00 – 22:00',
        description: 'Départs régionaux.',
        hasPhone: true,
        hasPlace: true,
      },
    ],
  },
  {
    id: 'bibliotheques',
    label: 'Bibliothèque',
    meta: 'Médiathèques…',
    sousCats: [{ label: 'Médiathèques', id: 'media' }],
    fiches: [
      {
        id: 'fiche-biblio-1',
        title: 'Bibliothèque municipale',
        sousCat: 'Médiathèques',
        status: 'Publié',
        address: 'Centre culturel, Kapan',
        phone: '+374 285 80 110',
        hours: '10:00 – 18:00',
        description: 'Lecture et médiathèque.',
        hasPhone: true,
        hasPlace: true,
      },
    ],
  },
  {
    id: 'permanences',
    label: 'Permanences',
    meta: 'Guichets…',
    sousCats: [{ label: 'Guichets', id: 'guichets' }],
    fiches: [
      {
        id: 'fiche-perm-1',
        title: 'Permanence CAF',
        sousCat: 'Guichets',
        status: 'Publié',
        address: 'Hôtel de ville · guichet 3',
        phone: '',
        hours: 'Mardi 9:00 – 12:00',
        description: 'Permanence hebdomadaire.',
        hasPhone: false,
        hasPlace: true,
      },
    ],
  },
  {
    id: 'securite',
    label: 'Sécurité',
    meta: 'Commissariats…',
    sousCats: [{ label: 'Commissariats', id: 'comm' }],
    fiches: [
      {
        id: 'fiche-police-1',
        title: 'Commissariat de Kapan',
        sousCat: 'Commissariats',
        status: 'Publié',
        address: 'Rue de la Police, Kapan',
        phone: '102',
        hours: '24h/24',
        description: 'Accueil public.',
        hasPhone: true,
        hasPlace: true,
      },
    ],
  },
  {
    id: 'patrimoine',
    label: 'Patrimoine',
    meta: 'Sites…',
    sousCats: [{ label: 'Sites', id: 'sites' }],
    fiches: [
      {
        id: 'fiche-pat-1',
        title: 'Centre historique',
        sousCat: 'Sites',
        status: 'Publié',
        address: 'Vieille ville, Kapan',
        phone: '',
        hours: 'Libre accès',
        description: 'Parcours patrimonial.',
        hasPhone: false,
        hasPlace: true,
      },
    ],
  },
]

const PHARMACIE_FICHES = [
  {
    id: 'dir-pharmacie-centrale',
    title: 'Pharmacie centrale',
    sousCat: 'Pharmacies',
    status: 'Publié',
    address: '1 place centrale, Kapan',
    phone: '+374 285 12 345',
    hours: '08:00 – 20:00 · Ouvert 24h/24 urgences',
    description: 'Pharmacie principale du centre-ville.',
    hasPhone: true,
    hasPlace: true,
  },
  {
    id: 'dir-pharmacie-parc',
    title: 'Pharmacie du Parc',
    sousCat: 'Pharmacies',
    status: 'Publié',
    address: 'Parc municipal, Kapan',
    phone: '+374 285 12 400',
    hours: '09:00 – 19:00',
    description: 'Pharmacie de proximité.',
    hasPhone: true,
    hasPlace: true,
  },
  {
    id: 'dir-pharmacie-nuit',
    title: 'Pharmacie de nuit',
    sousCat: 'Pharmacies',
    status: 'Publié',
    address: 'Avenue de la Nuit, Kapan',
    phone: '+374 285 12 500',
    hours: '22:00 – 08:00',
    description: 'Service de garde.',
    hasPhone: true,
    hasPlace: true,
  },
]

const HOPITAL_FICHES = [
  {
    id: 'dir-hopital-grand',
    title: 'Grand Hôpital de Kapan',
    sousCat: 'Hôpitaux',
    status: 'Publié',
    address: 'Grand Hôpital de Kapan · quartier centre',
    phone: '103',
    hours: 'Urgences 24h/24 · Accueil selon planning',
    description:
      'Établissement hospitalier de référence à Kapan. Urgences 24h/24. Consultations selon planning interne.',
    hasPhone: true,
    hasPlace: false,
    listBackTo: 'sante-hopitaux',
  },
  {
    id: 'dir-hopital-urgence24',
    title: 'Urgence 24 — Hôpital',
    sousCat: 'Hôpitaux',
    status: 'Publié',
    address: 'Urgence 24 · sud de Kapan',
    phone: '103',
    hours: '24h/24',
    description: 'Pôle urgences dédié. Accueil permanent.',
    hasPhone: true,
    hasPlace: false,
    listBackTo: 'sante-hopitaux',
  },
]

const ANN_STORE_KEY = 'ma-ville-annuaire-store'
const CUSTOM_RUB_KEY = 'ma-ville-custom-rubriques'

/** Mutable pharmacie list (persisted overlays) */
export const PHARMACIE_STORE = PHARMACIE_FICHES.map((f) => ({ ...f }))

function persistAnnuaire() {
  const payload = {
    rubriques: ANN_RUBRIQUES.map((r) => ({
      id: r.id,
      fiches: r.fiches,
      label: r.label,
      meta: r.meta,
      sousCats: r.sousCats,
      custom: r.custom || false,
    })),
    pharmacies: PHARMACIE_STORE,
  }
  const raw = JSON.stringify(payload)
  try {
    localStorage.setItem(ANN_STORE_KEY, raw)
  } catch {
    /* ignore */
  }
  try {
    sessionStorage.setItem(ANN_STORE_KEY, raw)
  } catch {
    /* ignore */
  }
}

function hydrateAnnuaire() {
  try {
    const raw = sessionStorage.getItem(ANN_STORE_KEY) || localStorage.getItem(ANN_STORE_KEY)
    if (!raw) return
    const saved = JSON.parse(raw)
    if (saved?.rubriques?.length) {
      saved.rubriques.forEach((sr) => {
        const existing = ANN_RUBRIQUES.find((r) => r.id === sr.id)
        if (existing) {
          if (Array.isArray(sr.fiches)) existing.fiches = sr.fiches
        } else if (sr.custom) {
          ANN_RUBRIQUES.push({
            id: sr.id,
            label: sr.label || 'Rubrique',
            meta: sr.meta || 'Ajoutée (admin)',
            sousCats: sr.sousCats || [{ label: 'Général', id: 'general' }],
            fiches: sr.fiches || [],
            custom: true,
          })
        }
      })
    }
    if (saved?.pharmacies?.length) {
      PHARMACIE_STORE.length = 0
      saved.pharmacies.forEach((p) => PHARMACIE_STORE.push(p))
    }
  } catch {
    /* ignore */
  }
}

hydrateAnnuaire()

export function getRubrique(id) {
  return ANN_RUBRIQUES.find((r) => r.id === id) || null
}

export function listRubriques() {
  return ANN_RUBRIQUES
}

export function addCustomRubrique(label) {
  const id = `rub-${Date.now()}`
  const rub = {
    id,
    label: label || 'Nouvelle rubrique',
    meta: 'Ajoutée (admin)',
    sousCats: [{ label: 'Général', id: 'general' }],
    fiches: [],
    custom: true,
  }
  ANN_RUBRIQUES.push(rub)
  persistAnnuaire()
  return rub
}

export function removeCustomRubrique(id) {
  const i = ANN_RUBRIQUES.findIndex((r) => r.id === id && r.custom)
  if (i < 0) return { error: 'not_custom' }
  ANN_RUBRIQUES.splice(i, 1)
  persistAnnuaire()
  return { ok: true }
}

export function getFiche(id) {
  if (!id) return null
  for (const r of ANN_RUBRIQUES) {
    const f = r.fiches.find((x) => x.id === id)
    if (f) return { ...f, rubriqueId: r.id, rubriqueLabel: r.label }
  }
  const p = PHARMACIE_STORE.find((x) => x.id === id)
  if (p) return { ...p, rubriqueId: 'sante', rubriqueLabel: 'Santé' }
  const h = HOPITAL_FICHES.find((x) => x.id === id)
  if (h) return { ...h, rubriqueId: 'sante', rubriqueLabel: 'Santé' }
  const demo = DIR_DEMO_FICHES[id]
  if (demo) return { ...demo }
  return null
}

export function setOpenDirFicheId(id) {
  try {
    if (id) sessionStorage.setItem(OPEN_DIR_KEY, id)
    else sessionStorage.removeItem(OPEN_DIR_KEY)
  } catch {
    /* ignore */
  }
}

export function getOpenDirFicheId() {
  try {
    return sessionStorage.getItem(OPEN_DIR_KEY)
  } catch {
    return null
  }
}

/**
 * Ensure a list-row demo fiche exists (stable id). Used by annuaire list → détail.
 */
export function ensureDemoFiche(partial) {
  if (!partial?.id) return null
  const existing = getFiche(partial.id)
  if (existing && !DIR_DEMO_FICHES[partial.id]) return existing
  const phone = (partial.phone || existing?.phone || '').trim()
  const address = (partial.address || existing?.address || '').trim()
  const next = {
    id: partial.id,
    title: partial.title || existing?.title || 'Fiche…',
    sousCat: partial.sousCat || partial.category || existing?.sousCat || 'Catégorie',
    status: partial.status || existing?.status || 'Publié',
    address: address || 'Adresse · Kapan',
    phone,
    hours: partial.hours || existing?.hours || '08:00 – 18:00',
    description: partial.description || existing?.description || '',
    hasPhone: partial.hasPhone ?? existing?.hasPhone ?? Boolean(phone && phone.length >= 3),
    hasPlace: partial.hasPlace ?? existing?.hasPlace ?? true,
    listBackTo: partial.listBackTo || existing?.listBackTo || null,
    rubriqueId: partial.rubriqueId || existing?.rubriqueId || null,
    rubriqueLabel: partial.rubriqueLabel || existing?.rubriqueLabel || null,
  }
  if (!existing || DIR_DEMO_FICHES[partial.id]) {
    DIR_DEMO_FICHES[partial.id] = next
  }
  return getFiche(partial.id)
}

/** Two list rows for a rubrique sous-cat — distinct ids, shared detail screen id (ficheGo). */
export function listRowsForRubrique(title, ficheGo, { parentId = null, known = null } = {}) {
  const base = String(ficheGo || 'dir-fiche')
    .replace(/-fiche-infos$/, '')
    .replace(/-infos$/, '')
    .replace(/-horaires$/, '')
  const presets = known || [
    {
      id: `${base}-a`,
      title: `${title} — fiche A…`,
      meta: 'Adresse · distance…',
      badge: 'Ouvert',
      address: `12 rue ${title}, Kapan`,
      phone: '+374 285 20 100',
      hours: '08:00 – 18:00',
      description: `Présentation de ${title} — fiche A.`,
    },
    {
      id: `${base}-b`,
      title: `${title} — fiche B…`,
      meta: 'Adresse · …',
      badge: '…',
      address: `8 av. ${title}, Kapan`,
      phone: '+374 285 20 200',
      hours: '09:00 – 17:00',
      description: `Présentation de ${title} — fiche B.`,
    },
  ]
  return presets.map((row) => {
    ensureDemoFiche({
      ...row,
      sousCat: title,
      category: title,
      listBackTo: parentId,
    })
    return {
      id: row.id,
      title: row.title,
      meta: row.meta || `${title} · distance…`,
      badge: row.badge || 'Ouvert',
      ficheGo,
    }
  })
}

export function upsertFiche({ id, rubriqueId, title, address, phone, hours, description, status, sousCat }) {
  const rid = rubriqueId || getAnnuaireRubriqueId() || 'education'
  const phoneClean = (phone || '').trim()
  const addressClean = (address || '').trim()
  const payload = {
    id: id || `fiche-${Date.now()}`,
    title: (title || '').trim() || 'Sans titre',
    sousCat: sousCat || 'Général',
    status: status || 'Brouillon',
    address: addressClean,
    phone: phoneClean,
    hours: (hours || '').trim(),
    description: (description || '').trim(),
    hasPhone: Boolean(phoneClean && phoneClean.length >= 6),
    hasPlace: Boolean(addressClean && !addressClean.endsWith('…')),
  }

  if (rid === 'sante' || rid === 'pharmacies') {
    const i = PHARMACIE_STORE.findIndex((f) => f.id === payload.id)
    if (i >= 0) PHARMACIE_STORE[i] = { ...PHARMACIE_STORE[i], ...payload }
    else PHARMACIE_STORE.push({ ...payload, sousCat: 'Pharmacies' })
    persistAnnuaire()
    setFicheContext({ mode: 'edit', id: payload.id, backTo: 'admin-annuaire-pharmacies' })
    return getFiche(payload.id)
  }

  let rub = getRubrique(rid)
  if (!rub) {
    rub = getRubrique('education')
  }
  const i = rub.fiches.findIndex((f) => f.id === payload.id)
  if (i >= 0) rub.fiches[i] = { ...rub.fiches[i], ...payload }
  else rub.fiches.push(payload)
  persistAnnuaire()
  setFicheContext({ mode: 'edit', id: payload.id, backTo: 'admin-annuaire-rubrique' })
  return getFiche(payload.id)
}

export function listPharmacieFiches() {
  return PHARMACIE_STORE.filter((f) => f.status !== 'Non publié')
}

export function setAnnuaireRubriqueId(id) {
  try {
    sessionStorage.setItem(RUBRIQUE_KEY, id || '')
  } catch {
    /* ignore */
  }
}

export function getAnnuaireRubriqueId() {
  try {
    return sessionStorage.getItem(RUBRIQUE_KEY) || 'education'
  } catch {
    return 'education'
  }
}

export function setFicheContext(ctx) {
  try {
    if (ctx) sessionStorage.setItem(FICHE_CTX_KEY, JSON.stringify(ctx))
    else sessionStorage.removeItem(FICHE_CTX_KEY)
  } catch {
    /* ignore */
  }
}

export function getFicheContext() {
  try {
    const raw = sessionStorage.getItem(FICHE_CTX_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

/** Publications BO store */
const DEFAULT_PUBS = [
  {
    id: 'admin-pub-horaires',
    title: 'Horaires d’accueil',
    body: 'Rappel — démarches en mairie et horaires d’accueil.',
    state: 'draft',
    authorLabel: 'Mairie de Kapan',
  },
  {
    id: 'admin-pub-routes',
    title: 'Routes',
    body: 'Travaux et circulation — informations mairie.',
    state: 'published',
    authorLabel: 'Mairie de Kapan',
  },
  {
    id: 'admin-pub-conseil',
    title: 'Conseil municipal',
    body: 'Compte-rendu du conseil municipal.',
    state: 'archived',
    authorLabel: 'Mairie de Kapan',
  },
]

export const ADMIN_PUBS = {}

function persistPubs() {
  const raw = JSON.stringify(ADMIN_PUBS)
  try {
    localStorage.setItem(PUB_STORE_KEY, raw)
  } catch {
    /* ignore */
  }
  try {
    sessionStorage.setItem(PUB_STORE_KEY, raw)
  } catch {
    /* ignore */
  }
}

function hydratePubs() {
  Object.keys(ADMIN_PUBS).forEach((k) => delete ADMIN_PUBS[k])
  try {
    const raw = sessionStorage.getItem(PUB_STORE_KEY) || localStorage.getItem(PUB_STORE_KEY)
    if (raw) {
      Object.assign(ADMIN_PUBS, JSON.parse(raw))
      return
    }
  } catch {
    /* ignore */
  }
  DEFAULT_PUBS.forEach((p) => {
    ADMIN_PUBS[p.id] = { ...p }
  })
}

hydratePubs()

export function listAdminPubs() {
  return Object.values(ADMIN_PUBS)
}

export function getAdminPub(id) {
  return ADMIN_PUBS[id] || null
}

export function createEmptyPub() {
  const id = `admin-pub-${Date.now()}`
  ADMIN_PUBS[id] = {
    id,
    title: '',
    body: '',
    state: 'draft',
    authorLabel: 'Mairie de Kapan',
  }
  persistPubs()
  setPubEditId(id)
  return ADMIN_PUBS[id]
}

export function updateAdminPub(id, patch) {
  const p = ADMIN_PUBS[id]
  if (!p) return null
  Object.assign(p, patch)
  persistPubs()
  return p
}

export function setPubEditId(id) {
  try {
    if (id) sessionStorage.setItem(PUB_EDIT_KEY, id)
    else sessionStorage.removeItem(PUB_EDIT_KEY)
  } catch {
    /* ignore */
  }
}

export function getPubEditId() {
  try {
    return sessionStorage.getItem(PUB_EDIT_KEY)
  } catch {
    return null
  }
}

export function pubStateLabel(s) {
  return { draft: 'brouillon', published: 'publié', archived: 'archivé' }[s] || s
}
