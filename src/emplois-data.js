/**
 * Offres d’emploi — store partagé public + BO.
 * États : draft | published | closed. Candidature = mailto / URL / modalités (jamais « envoyée »).
 */

const STORE_KEY = 'ma-ville-emploi-store'
const OPEN_KEY = 'ma-ville-emploi-open'
const EDIT_KEY = 'ma-ville-emploi-edit'
const FORM_STEP_KEY = 'ma-ville-emploi-form-step'
const CAT_KEY = 'ma-ville-emploi-cat'
const SEARCH_KEY = 'ma-ville-emploi-search'
const QUICK_KEY = 'ma-ville-emploi-quick'
const FILTERS_KEY = 'ma-ville-emploi-filters'
const ADMIN_TAB_KEY = 'ma-ville-emploi-admin-tab'

export const EMPLOI_CATEGORIES = [
  { id: 'emplois', label: 'Emplois', go: 'emplois-cat-emplois' },
  { id: 'temporaires', label: 'Emplois temporaires', go: 'emplois-cat-temporaires' },
  { id: 'stages', label: 'Stages', go: 'emplois-cat-stages' },
  { id: 'alternance', label: 'Alternance', go: 'emplois-cat-alternance' },
]

export const EMPLOI_SECTORS = [
  'Administration',
  'Santé',
  'Éducation',
  'Commerce',
  'Technique',
  'Culture',
  'Autre',
]

export const EMPLOI_CONTRACTS = ['CDI', 'CDD', 'Stage', 'Alternance', 'Intérim', 'Vacation']
export const EMPLOI_TIMES = ['Temps plein', 'Temps partiel', 'Horaires variables']
export const EMPLOI_MODES = [
  { id: 'sur_place', label: 'Sur place' },
  { id: 'hybride', label: 'Hybride' },
  { id: 'distance', label: 'À distance' },
]

const DEFAULT_OFFRES = {
  'offre-1': {
    id: 'offre-1',
    title: 'Chargé(e) de communication',
    employer: 'Mairie de Kapan',
    city: 'Kapan',
    location: 'Hôtel de ville · Centre',
    category: 'emplois',
    sector: 'Administration',
    contract: 'CDI',
    time: 'Temps plein',
    mode: 'sur_place',
    salary: { amount: 'Selon grille municipale', currency: 'AMD', period: 'mois', netBrut: 'brut' },
    publishedAt: '2026-09-28',
    deadline: '2026-11-15',
    startDate: 'Dès que possible',
    state: 'published',
    presentation:
      'La mairie de Kapan recherche un(e) chargé(e) de communication pour valoriser les actions municipales auprès des habitants.',
    missions:
      'Rédaction des contenus officiels, gestion des réseaux de la ville, relations presse, appui aux événements municipaux.',
    profile: 'Bac+3 communication · 2 ans d’expérience · Arménien et français · sens du service public.',
    skills: 'Rédaction, réseaux sociaux, PAO',
    experience: '2 ans',
    education: 'Bac+3',
    languages: 'Arménien, français',
    conditions: 'Poste basé à Kapan · Déplacements ponctuels · Horaires de bureau.',
    applyMethod: 'email',
    applyEmail: 'recrutement@mairie-kapan.example',
    applyUrl: '',
    applyInstructions: '',
    applyDocs: 'CV + lettre de motivation',
    phone: '+374 285 20 000',
    employerAbout: 'Collectivité territoriale de Kapan — diffusion d’offres pour ses services.',
    economyFicheId: null,
    logo: false,
  },
  'offre-2': {
    id: 'offre-2',
    title: 'Infirmier(ère) de consultation',
    employer: 'Grand Hôpital de Kapan',
    city: 'Kapan',
    location: 'Pôle consultations',
    category: 'emplois',
    sector: 'Santé',
    contract: 'CDI',
    time: 'Temps plein',
    mode: 'sur_place',
    salary: { amount: '180 000 – 220 000', currency: 'AMD', period: 'mois', netBrut: 'brut' },
    publishedAt: '2026-09-30',
    deadline: '2026-10-20',
    startDate: 'Novembre 2026',
    state: 'published',
    presentation: 'Renforcement de l’équipe de consultations ambulatoires.',
    missions: 'Accueil des patients, soins techniques, coordination avec les médecins.',
    profile: 'Diplôme d’État infirmier · Expérience hôpital appréciée.',
    skills: 'Soins, relation patient',
    experience: '1 an',
    education: 'Diplôme infirmier',
    languages: 'Arménien',
    conditions: 'Travail en équipe · Week-ends selon planning.',
    applyMethod: 'url',
    applyEmail: '',
    applyUrl: 'https://example.com/carrieres/hopital-kapan',
    applyInstructions: '',
    applyDocs: 'CV',
    phone: '103',
    employerAbout: 'Établissement hospitalier de référence à Kapan.',
    economyFicheId: null,
    logo: true,
  },
  'offre-3': {
    id: 'offre-3',
    title: 'Agent d’accueil saisonnier — été',
    employer: 'Office de tourisme de Kapan',
    city: 'Kapan',
    location: 'Bureau d’accueil · Place centrale',
    category: 'temporaires',
    sector: 'Culture',
    contract: 'CDD',
    time: 'Temps plein',
    mode: 'sur_place',
    salary: null,
    publishedAt: '2026-09-20',
    deadline: '2026-10-05',
    startDate: 'Juin 2027',
    state: 'closed',
    presentation: 'Accueil des visiteurs pendant la haute saison touristique.',
    missions: 'Information, orientation, vente de plans et tickets.',
    profile: 'Sens du contact · Langues un plus.',
    skills: 'Accueil',
    experience: 'Débutant accepté',
    education: '',
    languages: 'Arménien, anglais apprécié',
    conditions: 'Contrat saisonnier · Week-ends inclus.',
    applyMethod: 'modalites',
    applyEmail: '',
    applyUrl: '',
    applyInstructions:
      'Dépôt du dossier à l’Office de tourisme (Place centrale) du lundi au vendredi, 9h–17h. Documents : CV + pièce d’identité.',
    applyDocs: 'CV + pièce d’identité',
    phone: '+374 285 22 100',
    employerAbout: 'Structure municipale d’accueil touristique.',
    economyFicheId: null,
    logo: false,
  },
  'offre-4': {
    id: 'offre-4',
    title: 'Stage — assistant(e) archives municipales',
    employer: 'Mairie de Kapan',
    city: 'Kapan',
    location: 'Service archives',
    category: 'stages',
    sector: 'Administration',
    contract: 'Stage',
    time: 'Temps plein',
    mode: 'hybride',
    salary: { amount: 'Gratification légale', currency: 'AMD', period: 'mois', netBrut: '' },
    publishedAt: '2026-10-01',
    deadline: null,
    startDate: 'À convenir',
    state: 'published',
    presentation: 'Stage de 3 à 6 mois pour découvrir le traitement documentaire municipal.',
    missions: 'Classement, inventaire, numérisation légère, accueil ponctuel des lecteurs.',
    profile: 'Étudiant(e) en archivistique, histoire ou administration.',
    skills: 'Rigueur, bureautique',
    experience: 'Stage',
    education: 'Bac+2 minimum',
    languages: 'Arménien',
    conditions: 'Convention de stage obligatoire · 2 jours télétravail possibles.',
    applyMethod: 'email',
    applyEmail: 'stages@mairie-kapan.example',
    applyUrl: '',
    applyInstructions: '',
    applyDocs: 'CV + convention de stage',
    phone: '',
    employerAbout: 'Service archives de la mairie de Kapan.',
    economyFicheId: null,
    logo: false,
  },
  'offre-5': {
    id: 'offre-5',
    title: 'Alternance — développeur(se) web junior',
    employer: 'Atelier Numérique Kapan',
    city: 'Kapan',
    location: 'Zone d’activité · Nord',
    category: 'alternance',
    sector: 'Technique',
    contract: 'Alternance',
    time: 'Temps plein',
    mode: 'hybride',
    salary: { amount: 'Selon grille alternance', currency: 'AMD', period: 'mois', netBrut: 'brut' },
    publishedAt: '2026-09-25',
    deadline: '2026-12-01',
    startDate: 'Janvier 2027',
    state: 'published',
    presentation: 'Entreprise locale cherche un(e) alternant(e) pour ses projets web municipaux et PME.',
    missions: 'Intégration front, maintenance, appui aux clients.',
    profile: 'Formation informatique en alternance · Portfolio apprécié.',
    skills: 'HTML/CSS/JS',
    experience: 'Débutant',
    education: 'BTS / Licence pro',
    languages: 'Arménien, anglais technique',
    conditions: 'Rythme 3j entreprise / 2j école.',
    applyMethod: 'url',
    applyEmail: '',
    applyUrl: 'https://example.com/atelier-numerique/alternance',
    applyInstructions: '',
    applyDocs: 'CV + lettre',
    phone: '+374 285 33 010',
    employerAbout: 'PME numérique basée à Kapan (diffusion via la mairie).',
    economyFicheId: null,
    logo: true,
  },
  'offre-6': {
    id: 'offre-6',
    title: 'Brouillon — Animateur(trice) centre culturel (intitulé très long pour tester l’en-tête et la carte)',
    employer: 'Maison de la Culture',
    city: 'Kapan',
    location: 'Centre culturel',
    category: 'emplois',
    sector: 'Culture',
    contract: 'CDD',
    time: 'Temps partiel',
    mode: 'sur_place',
    salary: null,
    publishedAt: null,
    deadline: null,
    startDate: '',
    state: 'draft',
    presentation: 'Brouillon incomplet — description à compléter.',
    missions: '',
    profile: '',
    skills: '',
    experience: '',
    education: '',
    languages: '',
    conditions: '',
    applyMethod: 'email',
    applyEmail: 'culture@kapan.example',
    applyUrl: '',
    applyInstructions: '',
    applyDocs: '',
    phone: '',
    employerAbout: '',
    economyFicheId: null,
    logo: false,
  },
  'offre-7': {
    id: 'offre-7',
    title: 'Commis de cuisine — limite dépassée',
    employer: 'Restaurant du Parc',
    city: 'Kapan',
    location: 'Parc municipal',
    category: 'temporaires',
    sector: 'Commerce',
    contract: 'CDD',
    time: 'Temps plein',
    mode: 'sur_place',
    salary: { amount: '120 000', currency: 'AMD', period: 'mois', netBrut: 'net' },
    publishedAt: '2026-08-01',
    deadline: '2026-09-01',
    startDate: 'Immédiat',
    state: 'published',
    presentation: 'Offre dont la date limite est dépassée — doit se clôturer au chargement.',
    missions: 'Préparation froide, plonge.',
    profile: 'Expérience restauration.',
    skills: '',
    experience: '6 mois',
    education: '',
    languages: 'Arménien',
    conditions: 'Horaires coupés.',
    applyMethod: 'modalites',
    applyEmail: '',
    applyUrl: '',
    applyInstructions: 'Se présenter sur place avec CV, 10h–12h.',
    applyDocs: 'CV',
    phone: '+374 285 44 200',
    employerAbout: 'Restaurant local.',
    economyFicheId: null,
    logo: false,
  },
}

export const OFFRE_STORE = {}

function persistStore() {
  const raw = JSON.stringify(OFFRE_STORE)
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

function hydrateStore() {
  Object.keys(OFFRE_STORE).forEach((k) => delete OFFRE_STORE[k])
  try {
    const raw = sessionStorage.getItem(STORE_KEY) || localStorage.getItem(STORE_KEY)
    if (raw) {
      const saved = JSON.parse(raw)
      if (saved && typeof saved === 'object') {
        Object.assign(OFFRE_STORE, saved)
        return
      }
    }
  } catch {
    /* ignore */
  }
  Object.assign(
    OFFRE_STORE,
    Object.fromEntries(Object.entries(DEFAULT_OFFRES).map(([k, v]) => [k, { ...v }]))
  )
}

hydrateStore()

function endOfDeadlineDay(iso) {
  if (!iso) return null
  const d = new Date(`${iso}T23:59:59`)
  return Number.isNaN(d.getTime()) ? null : d
}

/** Recalcule les clôtures par date limite (fuseau navigateur — démo). */
export function refreshOffreStates() {
  const now = new Date()
  let changed = false
  Object.values(OFFRE_STORE).forEach((o) => {
    if (o.state !== 'published' || !o.deadline) return
    const end = endOfDeadlineDay(o.deadline)
    if (end && now > end) {
      o.state = 'closed'
      changed = true
    }
  })
  if (changed) persistStore()
}

refreshOffreStates()

export function getOffre(id) {
  refreshOffreStates()
  return OFFRE_STORE[id] || null
}

export function setOpenOffreId(id) {
  try {
    if (id) sessionStorage.setItem(OPEN_KEY, id)
    else sessionStorage.removeItem(OPEN_KEY)
  } catch {
    /* ignore */
  }
}

export function getOpenOffreId() {
  try {
    return sessionStorage.getItem(OPEN_KEY)
  } catch {
    return null
  }
}

export function setEditOffreId(id) {
  try {
    if (id) sessionStorage.setItem(EDIT_KEY, id)
    else sessionStorage.removeItem(EDIT_KEY)
  } catch {
    /* ignore */
  }
}

export function getEditOffreId() {
  try {
    return sessionStorage.getItem(EDIT_KEY)
  } catch {
    return null
  }
}

export function setEmploiFormStep(step) {
  try {
    sessionStorage.setItem(FORM_STEP_KEY, String(step))
  } catch {
    /* ignore */
  }
}

export function getEmploiFormStep() {
  try {
    return Number(sessionStorage.getItem(FORM_STEP_KEY) || '1')
  } catch {
    return 1
  }
}

export function setEmploiCategory(cat) {
  try {
    sessionStorage.setItem(CAT_KEY, cat || '')
  } catch {
    /* ignore */
  }
}

export function getEmploiCategory() {
  try {
    return sessionStorage.getItem(CAT_KEY) || ''
  } catch {
    return ''
  }
}

export function setEmploiSearch(q) {
  try {
    sessionStorage.setItem(SEARCH_KEY, q || '')
  } catch {
    /* ignore */
  }
}

export function getEmploiSearch() {
  try {
    return sessionStorage.getItem(SEARCH_KEY) || ''
  } catch {
    return ''
  }
}

export function setEmploiQuick(q) {
  try {
    sessionStorage.setItem(QUICK_KEY, q || 'toutes')
  } catch {
    /* ignore */
  }
}

export function getEmploiQuick() {
  try {
    return sessionStorage.getItem(QUICK_KEY) || 'toutes'
  } catch {
    return 'toutes'
  }
}

export function setEmploiFilters(f) {
  try {
    if (f) sessionStorage.setItem(FILTERS_KEY, JSON.stringify(f))
    else sessionStorage.removeItem(FILTERS_KEY)
  } catch {
    /* ignore */
  }
}

export function getEmploiFilters() {
  try {
    const raw = sessionStorage.getItem(FILTERS_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

export function clearEmploiSecondaryFilters() {
  setEmploiFilters({})
  setEmploiQuick('toutes')
}

export function setAdminOffreTab(tab) {
  try {
    sessionStorage.setItem(ADMIN_TAB_KEY, tab || 'toutes')
  } catch {
    /* ignore */
  }
}

export function getAdminOffreTab() {
  try {
    return sessionStorage.getItem(ADMIN_TAB_KEY) || 'toutes'
  } catch {
    return 'toutes'
  }
}

export function categoryLabel(id) {
  return EMPLOI_CATEGORIES.find((c) => c.id === id)?.label || id || 'Emploi'
}

export function modeLabel(id) {
  return EMPLOI_MODES.find((m) => m.id === id)?.label || id || ''
}

export function stateLabel(state) {
  return (
    {
      draft: 'Brouillon',
      published: 'Publiée',
      closed: 'Clôturée',
    }[state] || state
  )
}

export function formatSalary(o) {
  const s = o?.salary
  if (!s || !s.amount) return ''
  const bits = [s.amount]
  if (s.currency) bits.push(s.currency)
  if (s.period) bits.push(`/ ${s.period}`)
  if (s.netBrut) bits.push(`· ${s.netBrut}`)
  return bits.join(' ')
}

export function formatPubDate(iso) {
  if (!iso) return ''
  try {
    const d = new Date(`${iso}T12:00:00`)
    return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
  } catch {
    return iso
  }
}

function matchesFilters(o, filters = {}) {
  if (filters.sector && o.sector !== filters.sector) return false
  if (filters.contract && o.contract !== filters.contract) return false
  if (filters.time && o.time !== filters.time) return false
  if (filters.mode && o.mode !== filters.mode) return false
  if (filters.experience && (o.experience || '') !== filters.experience) return false
  if (filters.datePub && o.publishedAt && o.publishedAt < filters.datePub) return false
  if (filters.location) {
    const loc = `${o.location || ''} ${o.city || ''}`.toLowerCase()
    if (!loc.includes(String(filters.location).toLowerCase())) return false
  }
  return true
}

function matchesSearch(o, q) {
  if (!q) return true
  const hay = `${o.title} ${o.employer}`.toLowerCase()
  return hay.includes(q.toLowerCase())
}

/** Liste publique : publiées + ouvertes (non clôturées). */
export function listPublicOffres({ category = '', query = '', quick = 'toutes', filters = null } = {}) {
  refreshOffreStates()
  const f = filters || getEmploiFilters()
  const q = query != null ? query : getEmploiSearch()
  const qk = quick || getEmploiQuick()
  let list = Object.values(OFFRE_STORE).filter((o) => o.state === 'published')
  if (category) list = list.filter((o) => o.category === category)
  list = list.filter((o) => matchesSearch(o, q) && matchesFilters(o, f))
  if (qk === 'recentes') {
    list = [...list].sort((a, b) => String(b.publishedAt || '').localeCompare(String(a.publishedAt || '')))
  } else if (qk === 'proximite') {
    // Pas de distance inventée — ordre stable par ville puis date
    list = [...list].sort((a, b) => {
      const c = String(a.city).localeCompare(String(b.city))
      if (c) return c
      return String(b.publishedAt || '').localeCompare(String(a.publishedAt || ''))
    })
  } else {
    list = [...list].sort((a, b) => String(b.publishedAt || '').localeCompare(String(a.publishedAt || '')))
  }
  return list
}

export function listAdminOffres({ tab = 'toutes', query = '' } = {}) {
  refreshOffreStates()
  let list = Object.values(OFFRE_STORE)
  if (tab === 'brouillons') list = list.filter((o) => o.state === 'draft')
  else if (tab === 'publiees') list = list.filter((o) => o.state === 'published')
  else if (tab === 'cloturees') list = list.filter((o) => o.state === 'closed')
  if (query) list = list.filter((o) => matchesSearch(o, query))
  return list.sort((a, b) => String(b.publishedAt || b.id).localeCompare(String(a.publishedAt || a.id)))
}

export function listSimilarOffres(id, { limit = 3 } = {}) {
  const cur = getOffre(id)
  if (!cur) return []
  return listPublicOffres({ category: cur.category })
    .filter((o) => o.id !== id && o.city === cur.city)
    .filter((o) => o.sector === cur.sector || o.category === cur.category)
    .slice(0, limit)
}

export function countActiveFilters(filters = getEmploiFilters()) {
  return Object.values(filters || {}).filter((v) => v != null && String(v).trim() !== '').length
}

export function createEmptyOffre() {
  const id = `offre-${Date.now()}`
  const o = {
    id,
    title: '',
    employer: '',
    city: 'Kapan',
    location: '',
    category: 'emplois',
    sector: 'Administration',
    contract: 'CDI',
    time: 'Temps plein',
    mode: 'sur_place',
    salary: null,
    publishedAt: null,
    deadline: null,
    startDate: '',
    state: 'draft',
    presentation: '',
    missions: '',
    profile: '',
    skills: '',
    experience: '',
    education: '',
    languages: '',
    conditions: '',
    applyMethod: 'email',
    applyEmail: '',
    applyUrl: '',
    applyInstructions: '',
    applyDocs: '',
    phone: '',
    employerAbout: '',
    economyFicheId: null,
    logo: false,
  }
  OFFRE_STORE[id] = o
  persistStore()
  setEditOffreId(id)
  setEmploiFormStep(1)
  return o
}

export function updateOffre(id, patch = {}) {
  const o = OFFRE_STORE[id]
  if (!o) return null
  Object.assign(o, patch)
  if (patch.salary === null) o.salary = null
  persistStore()
  return o
}

export function publishOffre(id) {
  const o = OFFRE_STORE[id]
  if (!o) return { error: 'missing' }
  const err = validateForPublish(o)
  if (err) return { error: err }
  o.state = 'published'
  if (!o.publishedAt) {
    const d = new Date()
    o.publishedAt = d.toISOString().slice(0, 10)
  }
  persistStore()
  return { ok: true, offre: o }
}

export function closeOffre(id) {
  const o = OFFRE_STORE[id]
  if (!o) return { error: 'missing' }
  o.state = 'closed'
  persistStore()
  return { ok: true, offre: o }
}

export function deleteOffre(id) {
  if (!OFFRE_STORE[id]) return { error: 'missing' }
  delete OFFRE_STORE[id]
  persistStore()
  if (getOpenOffreId() === id) setOpenOffreId(null)
  if (getEditOffreId() === id) setEditOffreId(null)
  return { ok: true }
}

export function validateForPublish(o) {
  if (!o.employer?.trim()) return 'Indiquez l’employeur.'
  if (!o.title?.trim()) return 'Indiquez l’intitulé du poste.'
  if (!o.category) return 'Choisissez une catégorie.'
  if (!o.presentation?.trim() && !o.missions?.trim()) return 'Ajoutez une présentation ou des missions.'
  if (!o.city?.trim()) return 'Indiquez la ville.'
  if (!o.mode) return 'Indiquez le mode de travail.'
  if ((o.mode === 'sur_place' || o.mode === 'hybride') && !o.location?.trim()) {
    return 'Indiquez le lieu du poste (sur place / hybride).'
  }
  if (o.applyMethod === 'email') {
    if (!o.applyEmail?.trim() || !o.applyEmail.includes('@')) return 'Courriel de candidature invalide.'
  } else if (o.applyMethod === 'url') {
    if (!o.applyUrl?.trim() || !/^https?:\/\//i.test(o.applyUrl)) return 'Lien de candidature invalide (http/https).'
  } else if (o.applyMethod === 'modalites') {
    if (!o.applyInstructions?.trim()) return 'Indiquez les modalités de candidature.'
  } else {
    return 'Choisissez une méthode de candidature.'
  }
  return null
}

export function mailtoForOffre(o) {
  if (!o?.applyEmail) return ''
  const subject = encodeURIComponent(`Candidature — ${o.title} — ${o.city || ''}`)
  return `mailto:${o.applyEmail}?subject=${subject}`
}
