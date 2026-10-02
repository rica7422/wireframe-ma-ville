/**
 * Mes rencontres — invitations privées (TÀT / collectif, physique / en ligne).
 * Mot : Organisateur. Admin municipal = ses rencontres seulement.
 * Réutilise messagerie pour cartes / salon (pas de 2e messagerie).
 */

const STORE_KEY = 'ma-ville-rencontres-store'
const OPEN_KEY = 'ma-ville-rencontre-open'
const TAB_KEY = 'ma-ville-rencontre-tab'
const FILTER_KEY = 'ma-ville-rencontre-filter'
const TEMP_KEY = 'ma-ville-rencontre-temp'
const SEARCH_KEY = 'ma-ville-rencontre-search'
const DRAFT_KEY = 'ma-ville-rencontre-draft'
const VIEWER = 'user-rica'

export const RENC_CONTACTS = [
  { id: 'user-anahit', name: 'Anahit Sargsyan' },
  { id: 'user-armen', name: 'Armen Karapetyan' },
  { id: 'user-lilit', name: 'Lilit Ameni' },
  { id: 'user-gurgen', name: 'Gurgen Hovhannisyan' },
  { id: 'user-hasmik', name: 'Hasmik Petrosyan' },
]

function contactName(id) {
  return RENC_CONTACTS.find((c) => c.id === id)?.name || id
}

const DEFAULT = {
  rencontres: [
    {
      id: 'renc-1',
      context: 'maville',
      city: 'Kapan',
      organizerId: 'user-lilit',
      organizerName: 'Lilit Ameni',
      title: 'Café au centre',
      mode: 'physical',
      kind: 'tat',
      date: '2026-10-08',
      time: '16:30',
      placeName: 'Café Central',
      address: '1 place centrale, Kapan',
      link: '',
      description: 'Un café pour parler du prochain atelier.',
      photo: null,
      status: 'active',
      cancelMotif: '',
      conversationId: 'msg-maville-lilit',
      salonId: null,
      guests: [{ userId: VIEWER, name: 'Rica', response: 'pending' }],
      history: [{ at: '2026-10-01T10:00:00', text: 'Invitation envoyée' }],
      counterProposal: null,
    },
    {
      id: 'renc-2',
      context: 'maville',
      city: 'Kapan',
      organizerId: VIEWER,
      organizerName: 'Rica',
      title: 'Balade Vahanavank',
      mode: 'physical',
      kind: 'tat',
      date: '2026-10-12',
      time: '09:00',
      placeName: 'Parking Vahanavank',
      address: 'Route de Vahanavank, Kapan',
      link: '',
      description: 'Petite marche matinale.',
      photo: null,
      status: 'active',
      cancelMotif: '',
      conversationId: 'msg-maville-gurgen',
      salonId: null,
      guests: [{ userId: 'user-gurgen', name: 'Gurgen Hovhannisyan', response: 'accepted' }],
      history: [{ at: '2026-09-28T12:00:00', text: 'Invitation envoyée' }],
      counterProposal: null,
    },
    {
      id: 'renc-3',
      context: 'miasin',
      city: null,
      organizerId: VIEWER,
      organizerName: 'Rica',
      title: 'Appel projet MIASIN',
      mode: 'online',
      kind: 'tat',
      date: '2026-10-05',
      time: '19:00',
      placeName: '',
      address: '',
      link: '',
      description: 'Point rapide en ligne.',
      photo: null,
      status: 'active',
      cancelMotif: '',
      conversationId: 'msg-miasin-anahit',
      salonId: null,
      guests: [{ userId: 'user-anahit', name: 'Anahit Sargsyan', response: 'pending' }],
      history: [{ at: '2026-10-02T08:00:00', text: 'Invitation envoyée' }],
      counterProposal: null,
    },
    {
      id: 'renc-4',
      context: 'maville',
      city: 'Kapan',
      organizerId: VIEWER,
      organizerName: 'Rica',
      title: 'Soirée jeux',
      mode: 'physical',
      kind: 'collectif',
      date: '2026-10-18',
      time: '20:00',
      placeName: 'Maison des jeunes',
      address: '3 av. de la Culture, Kapan',
      link: '',
      description: 'Jeux de société — venez nombreux.',
      photo: null,
      status: 'active',
      cancelMotif: '',
      conversationId: null,
      salonId: 'salon-renc-4',
      guests: [
        { userId: 'user-armen', name: 'Armen Karapetyan', response: 'accepted' },
        { userId: 'user-lilit', name: 'Lilit Ameni', response: 'pending' },
        { userId: 'user-hasmik', name: 'Hasmik Petrosyan', response: 'refused' },
      ],
      history: [{ at: '2026-09-30T15:00:00', text: 'Invitations envoyées' }],
      counterProposal: null,
    },
    {
      id: 'renc-5',
      context: 'maville',
      city: 'Kapan',
      organizerId: 'user-armen',
      organizerName: 'Armen Karapetyan',
      title: 'Déjeuner marché',
      mode: 'physical',
      kind: 'collectif',
      date: '2026-10-10',
      time: '12:30',
      placeName: 'Marché central',
      address: 'Place du Marché, Kapan',
      link: '',
      description: 'Déjeuner entre amis.',
      photo: null,
      status: 'active',
      cancelMotif: '',
      conversationId: null,
      salonId: 'salon-renc-5',
      guests: [
        { userId: VIEWER, name: 'Rica', response: 'accepted' },
        { userId: 'user-lilit', name: 'Lilit Ameni', response: 'accepted' },
        { userId: 'user-gurgen', name: 'Gurgen Hovhannisyan', response: 'pending' },
      ],
      history: [{ at: '2026-09-29T09:00:00', text: 'Invitations envoyées' }],
      counterProposal: null,
    },
    {
      id: 'renc-6',
      context: 'maville',
      city: 'Kapan',
      organizerId: VIEWER,
      organizerName: 'Rica',
      title: 'Brouillon pique-nique',
      mode: 'physical',
      kind: 'collectif',
      date: '2026-10-25',
      time: '13:00',
      placeName: 'Parc municipal',
      address: 'Parc municipal, Kapan',
      link: '',
      description: '',
      photo: null,
      status: 'draft',
      cancelMotif: '',
      conversationId: null,
      salonId: null,
      guests: [
        { userId: 'user-anahit', name: 'Anahit Sargsyan', response: 'pending' },
        { userId: 'user-armen', name: 'Armen Karapetyan', response: 'pending' },
      ],
      history: [],
      counterProposal: null,
    },
    {
      id: 'renc-7',
      context: 'maville',
      city: 'Kapan',
      organizerId: 'user-hasmik',
      organizerName: 'Hasmik Petrosyan',
      title: 'Expo photo (passée)',
      mode: 'physical',
      kind: 'tat',
      date: '2026-09-01',
      time: '17:00',
      placeName: 'Galerie',
      address: 'Centre, Kapan',
      link: '',
      description: 'Visite.',
      photo: null,
      status: 'active',
      cancelMotif: '',
      conversationId: null,
      salonId: null,
      guests: [{ userId: VIEWER, name: 'Rica', response: 'accepted' }],
      history: [],
      counterProposal: null,
    },
    {
      id: 'renc-8',
      context: 'maville',
      city: 'Kapan',
      organizerId: VIEWER,
      organizerName: 'Rica',
      title: 'Ciné annulé',
      mode: 'physical',
      kind: 'tat',
      date: '2026-10-20',
      time: '21:00',
      placeName: 'Cinéma municipal',
      address: 'Kapan',
      link: '',
      description: '',
      photo: null,
      status: 'cancelled',
      cancelMotif: 'Indisponibilité',
      conversationId: 'msg-maville-lilit',
      salonId: null,
      guests: [{ userId: 'user-lilit', name: 'Lilit Ameni', response: 'pending' }],
      history: [{ at: '2026-10-01T18:00:00', text: 'Rencontre annulée' }],
      counterProposal: null,
    },
  ],
}

export const RENC_STORE = { rencontres: [] }

function persist() {
  const raw = JSON.stringify(RENC_STORE)
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
  try {
    const raw = sessionStorage.getItem(STORE_KEY) || localStorage.getItem(STORE_KEY)
    if (raw) {
      const saved = JSON.parse(raw)
      if (saved?.rencontres?.length) {
        RENC_STORE.rencontres = saved.rencontres
        return
      }
    }
  } catch {
    /* ignore */
  }
  RENC_STORE.rencontres = JSON.parse(JSON.stringify(DEFAULT.rencontres))
}

hydrate()

export function getRencViewer() {
  return VIEWER
}

export function setRencTab(tab) {
  try {
    sessionStorage.setItem(TAB_KEY, tab === 'envoyees' ? 'envoyees' : 'recues')
  } catch {
    /* ignore */
  }
}

export function getRencTab() {
  try {
    return sessionStorage.getItem(TAB_KEY) || 'recues'
  } catch {
    return 'recues'
  }
}

export function setRencFilter(f) {
  try {
    sessionStorage.setItem(FILTER_KEY, f || 'toutes')
  } catch {
    /* ignore */
  }
}

export function getRencFilter() {
  try {
    return sessionStorage.getItem(FILTER_KEY) || 'toutes'
  } catch {
    return 'toutes'
  }
}

export function setRencTemp(t) {
  try {
    sessionStorage.setItem(TEMP_KEY, t || 'avenir')
  } catch {
    /* ignore */
  }
}

export function getRencTemp() {
  try {
    return sessionStorage.getItem(TEMP_KEY) || 'avenir'
  } catch {
    return 'avenir'
  }
}

export function setRencSearch(q) {
  try {
    sessionStorage.setItem(SEARCH_KEY, q || '')
  } catch {
    /* ignore */
  }
}

export function getRencSearch() {
  try {
    return sessionStorage.getItem(SEARCH_KEY) || ''
  } catch {
    return ''
  }
}

export function setOpenRencontreId(id) {
  try {
    if (id) sessionStorage.setItem(OPEN_KEY, id)
    else sessionStorage.removeItem(OPEN_KEY)
  } catch {
    /* ignore */
  }
}

export function getOpenRencontreId() {
  try {
    return sessionStorage.getItem(OPEN_KEY)
  } catch {
    return null
  }
}

export function getDraft() {
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function setDraft(d) {
  try {
    if (d) sessionStorage.setItem(DRAFT_KEY, JSON.stringify(d))
    else sessionStorage.removeItem(DRAFT_KEY)
  } catch {
    /* ignore */
  }
}

export function getRencontre(id) {
  return RENC_STORE.rencontres.find((r) => r.id === id) || null
}

export function isOrganizer(r, userId = VIEWER) {
  return !!r && r.organizerId === userId
}

export function myGuest(r, userId = VIEWER) {
  return r?.guests?.find((g) => g.userId === userId) || null
}

export function isParticipant(r, userId = VIEWER) {
  return isOrganizer(r, userId) || !!myGuest(r, userId)
}

function isPast(r) {
  if (!r?.date) return false
  const t = `${r.date}T${r.time || '00:00'}`
  return new Date(t).getTime() < Date.now()
}

export function temporalBucket(r) {
  if (r.status === 'cancelled') return 'annulees'
  if (r.status === 'draft') return 'brouillons'
  if (isPast(r)) return 'passees'
  return 'avenir'
}

export function responseLabel(resp, { asOrganizer = false, guestName = '' } = {}) {
  const map = {
    pending: asOrganizer
      ? `En attente de la réponse de ${guestName || 'l’invité'}`
      : 'En attente de votre réponse',
    accepted: asOrganizer
      ? `${guestName || 'L’invité'} a accepté`
      : 'Vous avez accepté',
    refused: asOrganizer ? `${guestName || 'L’invité'} a refusé` : 'Vous avez refusé',
    withdrawn: 'Vous avez retiré votre participation',
    proposed: asOrganizer ? 'Nouvelle proposition reçue' : 'Votre proposition attend une réponse',
    reconfirm: 'En attente de confirmation',
  }
  return map[resp] || resp
}

export function collectiveSummary(r) {
  const g = r.guests || []
  const a = g.filter((x) => x.response === 'accepted' || x.response === 'reconfirm').length
  const ref = g.filter((x) => x.response === 'refused' || x.response === 'withdrawn').length
  const p = g.filter((x) => x.response === 'pending' || x.response === 'proposed').length
  return `${a} acceptation${a > 1 ? 's' : ''} · ${ref} refus · ${p} en attente`
}

function matchesResponseFilter(r, filter, tab, userId = VIEWER) {
  if (filter === 'toutes') return true
  if (r.status === 'draft') return false
  if (tab === 'recues') {
    const g = myGuest(r, userId)
    if (!g) return false
    if (filter === 'attente') return g.response === 'pending' || g.response === 'proposed' || g.response === 'reconfirm'
    if (filter === 'acceptees') return g.response === 'accepted'
    if (filter === 'refusees') return g.response === 'refused' || g.response === 'withdrawn'
  } else {
    if (!isOrganizer(r, userId)) return false
    const g = r.guests || []
    if (r.kind === 'tat') {
      const one = g[0]
      if (!one) return filter === 'attente'
      if (filter === 'attente') return one.response === 'pending' || one.response === 'proposed' || one.response === 'reconfirm'
      if (filter === 'acceptees') return one.response === 'accepted'
      if (filter === 'refusees') return one.response === 'refused' || one.response === 'withdrawn'
    } else {
      // collectif: au moins une réponse du type
      if (filter === 'attente') return g.some((x) => x.response === 'pending' || x.response === 'proposed' || x.response === 'reconfirm')
      if (filter === 'acceptees') return g.some((x) => x.response === 'accepted')
      if (filter === 'refusees') return g.some((x) => x.response === 'refused' || x.response === 'withdrawn')
    }
  }
  return true
}

export function listRencontres({
  tab = 'recues',
  filter = 'toutes',
  temp = 'avenir',
  query = '',
  userId = VIEWER,
} = {}) {
  const q = (query || '').trim().toLowerCase()
  return RENC_STORE.rencontres
    .filter((r) => {
      if (isOrganizer(r, userId) && r.hiddenForOrganizer) return false
      const g = myGuest(r, userId)
      if (g?.hidden) return false
      return true
    })
    .filter((r) => {
      if (tab === 'recues') return !!myGuest(r, userId) && r.status !== 'draft'
      // envoyees
      return isOrganizer(r, userId)
    })
    .filter((r) => {
      if (temp === 'brouillons') return r.status === 'draft'
      if (temp === 'annulees') return r.status === 'cancelled'
      if (temp === 'passees') return temporalBucket(r) === 'passees'
      // avenir default — exclude past/cancelled/draft unless filter drafts via temp
      return temporalBucket(r) === 'avenir'
    })
    .filter((r) => matchesResponseFilter(r, filter, tab, userId))
    .filter((r) => {
      if (!q) return true
      const names = [r.title, r.organizerName, r.placeName, r.address, ...(r.guests || []).map((g) => g.name)]
        .join(' ')
        .toLowerCase()
      return names.includes(q)
    })
    .sort((a, b) => (`${a.date}T${a.time}` > `${b.date}T${b.time}` ? 1 : -1))
}

export function listDrafts(userId = VIEWER) {
  return RENC_STORE.rencontres.filter((r) => r.status === 'draft' && r.organizerId === userId)
}

export function startCreateDraft({ context = 'maville', prefillGuestId = null } = {}) {
  const draft = {
    step: 1,
    context,
    city: context === 'maville' ? 'Kapan' : null,
    guestIds: prefillGuestId ? [prefillGuestId] : [],
    title: '',
    mode: 'physical',
    date: '',
    time: '',
    placeName: '',
    address: '',
    link: '',
    description: '',
    photo: null,
  }
  setDraft(draft)
  return draft
}

export function createRencontreFromDraft(draft, { asDraft = false } = {}) {
  if (!draft?.guestIds?.length) return { error: 'guests' }
  if (!asDraft) {
    if (!draft.title?.trim()) return { error: 'title' }
    if (!draft.date || !draft.time) return { error: 'datetime' }
    const when = new Date(`${draft.date}T${draft.time}`)
    if (Number.isNaN(when.getTime()) || when.getTime() < Date.now()) return { error: 'past' }
    if (draft.mode === 'physical' && !(draft.address || '').trim()) return { error: 'address' }
  }
  const kind = draft.guestIds.length === 1 ? 'tat' : 'collectif'
  const id = `renc-${Date.now()}`
  const guests = draft.guestIds.map((uid) => ({
    userId: uid,
    name: contactName(uid),
    response: 'pending',
  }))
  const r = {
    id,
    context: draft.context === 'miasin' ? 'miasin' : 'maville',
    city: draft.context === 'maville' ? draft.city || 'Kapan' : null,
    organizerId: VIEWER,
    organizerName: 'Rica',
    title: (draft.title || '').trim() || 'Sans titre',
    mode: draft.mode === 'online' ? 'online' : 'physical',
    kind,
    date: draft.date || '',
    time: draft.time || '',
    placeName: draft.placeName || '',
    address: draft.address || '',
    link: draft.link || '',
    description: draft.description || '',
    photo: draft.photo || null,
    status: asDraft ? 'draft' : 'active',
    cancelMotif: '',
    conversationId: kind === 'tat' ? null : null,
    salonId: kind === 'collectif' && !asDraft ? `salon-${id}` : null,
    guests,
    history: asDraft ? [] : [{ at: new Date().toISOString(), text: 'Invitations envoyées' }],
    counterProposal: null,
  }
  RENC_STORE.rencontres.unshift(r)
  persist()
  if (!asDraft) setDraft(null)
  setOpenRencontreId(id)
  return r
}

export function updateRencontre(id, patch, { important = false } = {}) {
  const r = getRencontre(id)
  if (!r || !isOrganizer(r)) return { error: 'forbidden' }
  Object.assign(r, patch)
  if (important && r.status === 'active') {
    r.guests.forEach((g) => {
      if (g.response === 'accepted') g.response = 'reconfirm'
    })
    r.history.push({
      at: new Date().toISOString(),
      text: 'Modification importante — confirmation demandée aux personnes ayant accepté',
    })
  } else {
    r.history.push({ at: new Date().toISOString(), text: 'Présentation mise à jour' })
  }
  persist()
  return r
}

export function setGuestResponse(id, response, userId = VIEWER) {
  const r = getRencontre(id)
  if (!r || r.status !== 'active') return { error: 'unavailable' }
  if (isOrganizer(r, userId)) return { error: 'organizer' }
  const g = myGuest(r, userId)
  if (!g) return { error: 'forbidden' }
  g.response = response
  r.counterProposal = response === 'proposed' ? r.counterProposal : response === 'pending' ? null : r.counterProposal
  if (response !== 'proposed') {
    /* keep or clear */
  }
  r.history.push({ at: new Date().toISOString(), text: `${g.name} · ${response}` })
  persist()
  return r
}

export function submitCounterProposal(id, { date, time, placeName, address, message }) {
  const r = getRencontre(id)
  if (!r || r.kind !== 'tat' || r.status !== 'active') return { error: 'unavailable' }
  const g = myGuest(r)
  if (!g || g.response !== 'pending') return { error: 'forbidden' }
  if (!date && !time && !placeName && !address) return { error: 'empty' }
  r.counterProposal = {
    fromId: VIEWER,
    fromName: 'Rica',
    date: date || r.date,
    time: time || r.time,
    placeName: placeName || r.placeName,
    address: address || r.address,
    message: message || '',
    status: 'pending',
  }
  g.response = 'proposed'
  r.history.push({ at: new Date().toISOString(), text: 'Contre-proposition envoyée' })
  persist()
  return r
}

export function resolveCounterProposal(id, accept) {
  const r = getRencontre(id)
  if (!r || !isOrganizer(r) || !r.counterProposal || r.counterProposal.status !== 'pending') {
    return { error: 'unavailable' }
  }
  const g = r.guests[0]
  if (accept) {
    r.date = r.counterProposal.date
    r.time = r.counterProposal.time
    r.placeName = r.counterProposal.placeName
    r.address = r.counterProposal.address
    r.counterProposal.status = 'accepted'
    if (g) g.response = 'accepted'
    r.history.push({ at: new Date().toISOString(), text: 'Contre-proposition acceptée' })
  } else {
    r.counterProposal.status = 'refused'
    if (g) g.response = 'pending'
    r.history.push({ at: new Date().toISOString(), text: 'Contre-proposition refusée — invitation de nouveau en attente' })
  }
  persist()
  return r
}

export function addGuests(id, userIds) {
  const r = getRencontre(id)
  if (!r || !isOrganizer(r) || r.kind !== 'collectif') return { error: 'forbidden' }
  let added = 0
  userIds.forEach((uid) => {
    if (uid === VIEWER) return
    if (r.guests.some((g) => g.userId === uid)) return
    r.guests.push({ userId: uid, name: contactName(uid), response: 'pending' })
    added += 1
  })
  if (added) r.history.push({ at: new Date().toISOString(), text: `${added} invitation(s) ajoutée(s)` })
  persist()
  return r
}

export function removeGuest(id, userId) {
  const r = getRencontre(id)
  if (!r || !isOrganizer(r) || r.kind !== 'collectif') return { error: 'forbidden' }
  r.guests = r.guests.filter((g) => g.userId !== userId)
  r.history.push({ at: new Date().toISOString(), text: `Invité retiré · ${contactName(userId)}` })
  persist()
  return r
}

export function cancelRencontre(id, motif = '') {
  const r = getRencontre(id)
  if (!r || !isOrganizer(r)) return { error: 'forbidden' }
  r.status = 'cancelled'
  r.cancelMotif = motif || ''
  r.history.push({ at: new Date().toISOString(), text: 'Rencontre annulée' })
  persist()
  return r
}

export function deleteDraft(id) {
  const r = getRencontre(id)
  if (!r || r.status !== 'draft' || !isOrganizer(r)) return { error: 'forbidden' }
  RENC_STORE.rencontres = RENC_STORE.rencontres.filter((x) => x.id !== id)
  persist()
  return { ok: true }
}

export function removeFromMyList(id, userId = VIEWER) {
  const r = getRencontre(id)
  if (!r) return { error: 'missing' }
  const bucket = temporalBucket(r)
  if (bucket !== 'passees' && bucket !== 'annulees') return { error: 'not_eligible' }
  if (isOrganizer(r, userId)) {
    r.hiddenForOrganizer = true
  } else {
    const g = myGuest(r, userId)
    if (!g) return { error: 'forbidden' }
    g.hidden = true
  }
  persist()
  return r
}

export function formatWhen(r) {
  if (!r?.date) return 'Date à préciser'
  try {
    const d = new Date(`${r.date}T${r.time || '12:00'}`)
    return d.toLocaleString('fr-FR', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return `${r.date} · ${r.time}`
  }
}

export function placeLabel(r) {
  if (r.mode === 'online') return 'Rencontre en ligne'
  const bits = [r.placeName, r.address, r.city].filter(Boolean)
  return bits.join(' · ') || 'Lieu à préciser'
}

export function connectionHint(r) {
  if (r.mode !== 'online') return ''
  if (r.link) return r.link
  return 'Les informations de connexion seront partagées dans la discussion'
}

export { contactName }
