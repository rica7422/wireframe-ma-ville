/**
 * RDV mairie — motifs, dispos, bookings.
 */

const STORE_KEY = 'ma-ville-rdv-store'
const PICK_KEY = 'ma-ville-rdv-pick'
const EDIT_MOTIF_KEY = 'ma-ville-rdv-motif-edit'
const TAB_KEY = 'ma-ville-rdv-admin-tab'

const DEFAULT = {
  motifs: [
    { id: 'motif-etat-civil', label: 'État civil', duration: 20, active: true },
    { id: 'motif-cni', label: 'Carte d’identité / Passeport', duration: 30, active: true },
    { id: 'motif-mariage', label: 'Mariage', duration: 45, active: true },
    { id: 'motif-urbanisme', label: 'Urbanisme / permis', duration: 30, active: true },
    { id: 'motif-logement', label: 'Logement', duration: 25, active: true },
    { id: 'motif-scolarite', label: 'Scolarité', duration: 20, active: true },
    { id: 'motif-maire', label: 'Audience avec le maire', duration: 40, active: true },
    { id: 'motif-salle', label: 'Cérémonie / salle', duration: 30, active: true },
    { id: 'motif-social', label: 'Démarches sociales', duration: 25, active: true },
    { id: 'motif-autre', label: 'Autre', duration: 15, active: true },
  ],
  dispos: {
    // weekday 1=Mon … 5=Fri
    1: ['09:00', '09:30', '10:00', '11:00', '14:00', '14:30', '15:00', '16:00'],
    2: ['09:00', '09:30', '10:00', '11:00', '14:00', '14:30', '15:00', '16:00'],
    3: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
    4: ['09:00', '09:30', '10:00', '11:00', '14:00', '14:30', '15:00', '16:00'],
    5: ['09:00', '09:30', '10:00', '11:00', '14:00', '15:00'],
  },
  indispos: [
    { id: 'ind-1', date: '2026-05-01', label: 'Férié · 1er mai' },
    { id: 'ind-2', date: '2026-05-28', label: 'Formation agents' },
  ],
  bookings: [
    {
      id: 'rdv-demo-1',
      motifId: 'motif-cni',
      slot: '2026-06-12T10:00',
      slotLabel: '12 juin 2026 · 10:00',
      user: 'Lilit A.',
      userId: 'user-lilit',
      status: 'confirmed',
      cancelMotif: '',
    },
  ],
}

export const RDV_STORE = {
  motifs: [],
  dispos: {},
  indispos: [],
  bookings: [],
}

function persist() {
  try {
    sessionStorage.setItem(STORE_KEY, JSON.stringify(RDV_STORE))
  } catch {
    /* ignore */
  }
}

function hydrate() {
  try {
    const raw = sessionStorage.getItem(STORE_KEY)
    if (raw) {
      const saved = JSON.parse(raw)
      if (saved?.motifs) {
        RDV_STORE.motifs = saved.motifs
        RDV_STORE.dispos = saved.dispos || { ...DEFAULT.dispos }
        RDV_STORE.indispos = saved.indispos || [...DEFAULT.indispos]
        RDV_STORE.bookings = saved.bookings || []
        return
      }
    }
  } catch {
    /* ignore */
  }
  RDV_STORE.motifs = DEFAULT.motifs.map((m) => ({ ...m }))
  RDV_STORE.dispos = JSON.parse(JSON.stringify(DEFAULT.dispos))
  RDV_STORE.indispos = DEFAULT.indispos.map((i) => ({ ...i }))
  RDV_STORE.bookings = DEFAULT.bookings.map((b) => ({ ...b }))
}

hydrate()

export function listMotifs({ activeOnly = false } = {}) {
  return RDV_STORE.motifs.filter((m) => (activeOnly ? m.active : true))
}

export function getMotif(id) {
  return RDV_STORE.motifs.find((m) => m.id === id) || null
}

export function upsertMotif(motif) {
  const i = RDV_STORE.motifs.findIndex((m) => m.id === motif.id)
  if (i >= 0) RDV_STORE.motifs[i] = { ...RDV_STORE.motifs[i], ...motif }
  else RDV_STORE.motifs.push(motif)
  persist()
  return motif
}

export function deactivateMotif(id) {
  const m = getMotif(id)
  if (!m) return null
  const hasBookings = RDV_STORE.bookings.some(
    (b) => b.motifId === id && (b.status === 'confirmed' || b.status === 'pending')
  )
  if (hasBookings || true) {
    // never hard-delete — deactivate
    m.active = false
    persist()
    return { deactivated: true, motif: m }
  }
}

export function setDispoSlots(weekday, slots) {
  RDV_STORE.dispos[String(weekday)] = [...slots]
  persist()
}

export function getDispoSlots(weekday) {
  return RDV_STORE.dispos[String(weekday)] || []
}

export function listIndispos() {
  return RDV_STORE.indispos
}

export function listBookings() {
  return [...RDV_STORE.bookings].sort((a, b) => (a.slot > b.slot ? 1 : -1))
}

export function listUserBookings(userId = 'user-rica') {
  return RDV_STORE.bookings.filter(
    (b) => b.userId === userId && (b.status === 'confirmed' || b.status === 'pending')
  )
}

export function getBooking(id) {
  return RDV_STORE.bookings.find((b) => b.id === id) || null
}

export function createBooking({ motifId, slot, slotLabel, user = 'Rica', userId = 'user-rica' }) {
  const id = `rdv-${Date.now()}`
  const b = {
    id,
    motifId,
    slot,
    slotLabel,
    user,
    userId,
    status: 'confirmed',
    cancelMotif: '',
  }
  RDV_STORE.bookings.push(b)
  persist()
  return b
}

export function updateBooking(id, patch) {
  const b = getBooking(id)
  if (!b) return null
  Object.assign(b, patch)
  persist()
  return b
}

export function statusLabel(s) {
  return (
    {
      confirmed: 'Confirmé',
      cancelled: 'Annulé',
      done: 'Effectué',
      absent: 'Absent',
      pending: 'En attente',
    }[s] || s
  )
}

export function setRdvPick(pick) {
  try {
    sessionStorage.setItem(PICK_KEY, JSON.stringify(pick || {}))
  } catch {
    /* ignore */
  }
}

export function getRdvPick() {
  try {
    const raw = sessionStorage.getItem(PICK_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

export function setEditMotifId(id) {
  try {
    if (id) sessionStorage.setItem(EDIT_MOTIF_KEY, id)
    else sessionStorage.removeItem(EDIT_MOTIF_KEY)
  } catch {
    /* ignore */
  }
}

export function getEditMotifId() {
  try {
    return sessionStorage.getItem(EDIT_MOTIF_KEY)
  } catch {
    return null
  }
}

export function setAdminRdvTab(tab) {
  try {
    sessionStorage.setItem(TAB_KEY, tab || 'rdv')
  } catch {
    /* ignore */
  }
}

export function getAdminRdvTab() {
  try {
    return sessionStorage.getItem(TAB_KEY) || 'rdv'
  } catch {
    return 'rdv'
  }
}

/** Demo calendar: May 2026 — weekday for day number */
export function weekdayForMay2026(day) {
  // 1 May 2026 = Friday
  const wd = ((day - 1) + 5) % 7 // 0=Sun … 6=Sat
  return wd === 0 ? 7 : wd
}

export function slotsForMayDay(day) {
  const wd = weekdayForMay2026(day)
  if (wd > 5) return []
  const date = `2026-05-${String(day).padStart(2, '0')}`
  if (RDV_STORE.indispos.some((i) => i.date === date)) return []
  return getDispoSlots(wd)
}
