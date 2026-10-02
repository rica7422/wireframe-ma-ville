/**
 * Modération dossiers — contenus signalés (≠ signalements urbains Q/R).
 */

const STORE_KEY = 'ma-ville-mod-cases'
const OPEN_KEY = 'ma-ville-mod-case-open'
const FILTER_KEY = 'ma-ville-mod-filter'

const DEFAULT_CASES = [
  {
    id: 'mod-1',
    type: 'publication',
    title: 'Collecte des déchets — ton agressif',
    author: 'Arman Petrosyan',
    motif: 'Contenu inapproprié / abus',
    date: '28 sept. 2026',
    state: 'open',
    decision: null,
    decisionMotif: '',
    contentLabel: 'Publication citoyen',
    contentGo: 'infos-feed',
    masked: false,
    authorDeleted: false,
  },
  {
    id: 'mod-2',
    type: 'commentaire',
    title: 'Commentaire sous « Routes »',
    author: 'Liana Avetisyan',
    motif: 'Harcèlement',
    date: '30 sept. 2026',
    state: 'open',
    decision: null,
    decisionMotif: '',
    contentLabel: 'Commentaire',
    contentGo: 'infos-commentaires',
    masked: false,
    authorDeleted: false,
  },
  {
    id: 'mod-3',
    type: 'fiche',
    title: 'Pharmacie centrale — horaires erronés',
    author: 'Signalement habitant',
    motif: 'Erreur de fiche (info incorrecte)',
    date: '1 oct. 2026',
    state: 'open',
    decision: null,
    decisionMotif: '',
    contentLabel: 'Fiche annuaire',
    contentGo: 'sante-pharmacie-infos',
    masked: false,
    authorDeleted: false,
  },
  {
    id: 'mod-4',
    type: 'publication',
    title: 'Annonce spam (déjà traité)',
    author: 'Hovhannes Mkrtchyan',
    motif: 'Spam',
    date: '20 sept. 2026',
    state: 'resolved',
    decision: 'retirer',
    decisionMotif: 'Spam récurrent',
    contentLabel: 'Publication',
    contentGo: 'infos-feed',
    masked: false,
    authorDeleted: false,
  },
]

export const MOD_CASES = {}

function persist() {
  const raw = JSON.stringify(MOD_CASES)
  try {
    localStorage.setItem(STORE_KEY, raw)
  } catch {
    /* ignore */
  }
  try {
    sessionStorage.setItem(STORE_KEY, raw)
  } catch {
    /* ignore */
  }
}

function hydrate() {
  Object.keys(MOD_CASES).forEach((k) => delete MOD_CASES[k])
  try {
    const raw = sessionStorage.getItem(STORE_KEY) || localStorage.getItem(STORE_KEY)
    if (raw) {
      const saved = JSON.parse(raw)
      if (saved && typeof saved === 'object') {
        Object.assign(MOD_CASES, saved)
        return
      }
    }
  } catch {
    /* ignore */
  }
  DEFAULT_CASES.forEach((c) => {
    MOD_CASES[c.id] = { ...c }
  })
}

hydrate()

export function listModCases(filter = 'open') {
  const all = Object.values(MOD_CASES)
  if (filter === 'resolved' || filter === 'traites') {
    return all.filter((c) => c.state === 'resolved')
  }
  return all.filter((c) => c.state === 'open')
}

export function getModCase(id) {
  return MOD_CASES[id] || null
}

export function setOpenModCaseId(id) {
  try {
    if (id) sessionStorage.setItem(OPEN_KEY, id)
    else sessionStorage.removeItem(OPEN_KEY)
  } catch {
    /* ignore */
  }
}

export function getOpenModCaseId() {
  try {
    return sessionStorage.getItem(OPEN_KEY)
  } catch {
    return null
  }
}

export function setModFilter(f) {
  try {
    sessionStorage.setItem(FILTER_KEY, f || 'open')
  } catch {
    /* ignore */
  }
}

export function getModFilter() {
  try {
    return sessionStorage.getItem(FILTER_KEY) || 'open'
  } catch {
    return 'open'
  }
}

export function typeLabel(type) {
  return (
    {
      publication: 'Publication',
      commentaire: 'Commentaire',
      fiche: 'Fiche',
    }[type] || type
  )
}

export function decisionLabel(d) {
  return (
    {
      classer: 'Classé sans suite',
      masquer: 'Masqué',
      retirer: 'Retiré',
      retablir: 'Rétabli',
    }[d] || d || '—'
  )
}

export function decideModCase(id, decision, motif = '') {
  const c = MOD_CASES[id]
  if (!c) return null
  if ((decision === 'retirer' || decision === 'masquer') && !String(motif || '').trim()) {
    return { error: 'motif' }
  }
  if (decision === 'retablir') {
    if (c.authorDeleted) return { error: 'author-deleted' }
    if (!c.masked && c.decision !== 'masquer') return { error: 'not-masked' }
    c.masked = false
    c.decision = 'retablir'
    c.decisionMotif = motif || ''
    c.state = 'resolved'
    persist()
    return c
  }
  c.decision = decision
  c.decisionMotif = motif || ''
  c.state = 'resolved'
  if (decision === 'masquer') c.masked = true
  if (decision === 'retirer') c.masked = false
  if (decision === 'classer') c.masked = false
  persist()
  return c
}
