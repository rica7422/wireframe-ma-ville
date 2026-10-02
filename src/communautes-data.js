/**
 * Groupes & Clubs — rubriques distinctes, adhésion, publications démo.
 * Mes rencontres = hors moteur (ne pas inventer).
 */

const STORE_KEY = 'ma-ville-communautes-store'
const OPEN_KEY = 'ma-ville-communaute-open'
const TAB_KEY = 'ma-ville-communaute-tab'
const SEARCH_KEY = 'ma-ville-communaute-search'
const VIEWER = 'user-rica'

const DEFAULT = {
  groupes: [
    {
      id: 'grp-randonnee',
      kind: 'groupes',
      name: 'Randonneurs de Kapan',
      description: 'Sorties nature autour de Kapan et du Syunik.',
      membersCount: 48,
      access: 'open',
      publishRule: 'members',
      rules: 'Respectez le groupe et annulez à temps si vous ne venez pas.',
      admins: ['user-armen'],
      memberIds: ['user-rica', 'user-armen', 'user-lilit'],
      pendingIds: [],
      myState: 'member',
      posts: [
        {
          id: 'post-grp-1',
          authorId: 'user-armen',
          author: 'Armen Karapetyan',
          body: 'Dimanche 9 h — départ parking Vahanavank. Niveau facile.',
          at: '2026-10-01T10:00:00',
          reactions: 4,
          comments: 2,
        },
        {
          id: 'post-grp-2',
          authorId: 'user-rica',
          author: 'Rica',
          body: 'Merci pour la sortie de samedi — super ambiance.',
          at: '2026-09-28T18:20:00',
          reactions: 6,
          comments: 1,
        },
      ],
    },
    {
      id: 'grp-photo',
      kind: 'groupes',
      name: 'Photo urbaine Kapan',
      description: 'Partage de clichés et balades photo en ville.',
      membersCount: 22,
      access: 'validation',
      publishRule: 'members',
      rules: 'Pas de photos de personnes sans accord.',
      admins: ['user-hasmik'],
      memberIds: ['user-hasmik'],
      pendingIds: [],
      myState: 'none',
      posts: [
        {
          id: 'post-grp-3',
          authorId: 'user-hasmik',
          author: 'Hasmik Petrosyan',
          body: 'Concours du mois : façades du centre. Envoyez vos photos.',
          at: '2026-09-30T14:00:00',
          reactions: 3,
          comments: 0,
        },
      ],
    },
    {
      id: 'grp-lecture',
      kind: 'groupes',
      name: 'Club lecture Syunik',
      description: 'Un livre par mois, discussions en bibliothèque.',
      membersCount: 15,
      access: 'open',
      publishRule: 'admins',
      rules: 'Seuls les administrateurs publient l’agenda.',
      admins: ['user-anahit'],
      memberIds: ['user-anahit', 'user-lilit'],
      pendingIds: [],
      myState: 'none',
      posts: [
        {
          id: 'post-grp-4',
          authorId: 'user-anahit',
          author: 'Anahit Sargsyan',
          body: 'Octobre : « Les montagnes » — rencontre le 18.',
          at: '2026-09-27T09:00:00',
          reactions: 2,
          comments: 1,
        },
      ],
    },
  ],
  clubs: [
    {
      id: 'club-echecs',
      kind: 'clubs',
      name: 'Club d’échecs Kapan',
      description: 'Parties libres et tournois amicaux.',
      membersCount: 31,
      access: 'open',
      publishRule: 'members',
      rules: 'Fair-play · pas de paris.',
      admins: ['user-gurgen'],
      memberIds: ['user-rica', 'user-gurgen'],
      pendingIds: [],
      myState: 'member',
      posts: [
        {
          id: 'post-club-1',
          authorId: 'user-gurgen',
          author: 'Gurgen Hovhannisyan',
          body: 'Soirée blitz vendredi 19 h à la maison des jeunes.',
          at: '2026-10-01T16:30:00',
          reactions: 5,
          comments: 3,
        },
      ],
    },
    {
      id: 'club-theatre',
      kind: 'clubs',
      name: 'Théâtre amateur',
      description: 'Ateliers et petites scènes.',
      membersCount: 19,
      access: 'validation',
      publishRule: 'admins',
      rules: 'Publications réservées à l’équipe.',
      admins: ['user-lilit'],
      memberIds: ['user-lilit'],
      pendingIds: ['user-rica'],
      myState: 'pending',
      posts: [
        {
          id: 'post-club-2',
          authorId: 'user-lilit',
          author: 'Lilit Ameni',
          body: 'Casting lecture ouverte — mercredi 18 h.',
          at: '2026-09-29T11:00:00',
          reactions: 1,
          comments: 0,
        },
      ],
    },
    {
      id: 'club-velo',
      kind: 'clubs',
      name: 'Vélo urbain',
      description: 'Balades et entretien collectif.',
      membersCount: 27,
      access: 'open',
      publishRule: 'members',
      rules: 'Casque obligatoire sur les sorties.',
      admins: ['user-armen'],
      memberIds: ['user-armen', 'user-anahit'],
      pendingIds: [],
      myState: 'none',
      posts: [
        {
          id: 'post-club-3',
          authorId: 'user-armen',
          author: 'Armen Karapetyan',
          body: 'Balade du lac — départ 8 h samedi.',
          at: '2026-09-26T08:00:00',
          reactions: 7,
          comments: 2,
        },
      ],
    },
  ],
}

export const COMM_STORE = { groupes: [], clubs: [] }

function persist() {
  const raw = JSON.stringify(COMM_STORE)
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
      if (saved?.groupes?.length && saved?.clubs?.length) {
        COMM_STORE.groupes = saved.groupes
        COMM_STORE.clubs = saved.clubs
        return
      }
    }
  } catch {
    /* ignore */
  }
  COMM_STORE.groupes = JSON.parse(JSON.stringify(DEFAULT.groupes))
  COMM_STORE.clubs = JSON.parse(JSON.stringify(DEFAULT.clubs))
}

hydrate()

function syncMyState(c) {
  if (c.memberIds.includes(VIEWER)) c.myState = 'member'
  else if (c.pendingIds.includes(VIEWER)) c.myState = 'pending'
  else c.myState = 'none'
  c.membersCount = Math.max(c.memberIds.length, c.membersCount)
}

export function setCommunauteKindTab(kind, tab) {
  try {
    sessionStorage.setItem(`${TAB_KEY}-${kind}`, tab || 'decouvrir')
  } catch {
    /* ignore */
  }
}

export function getCommunauteKindTab(kind) {
  try {
    return sessionStorage.getItem(`${TAB_KEY}-${kind}`) || 'decouvrir'
  } catch {
    return 'decouvrir'
  }
}

export function setCommunauteSearch(kind, q) {
  try {
    sessionStorage.setItem(`${SEARCH_KEY}-${kind}`, q || '')
  } catch {
    /* ignore */
  }
}

export function getCommunauteSearch(kind) {
  try {
    return sessionStorage.getItem(`${SEARCH_KEY}-${kind}`) || ''
  } catch {
    return ''
  }
}

export function setOpenCommunauteId(id) {
  try {
    if (id) sessionStorage.setItem(OPEN_KEY, id)
    else sessionStorage.removeItem(OPEN_KEY)
  } catch {
    /* ignore */
  }
}

export function getOpenCommunauteId() {
  try {
    return sessionStorage.getItem(OPEN_KEY)
  } catch {
    return null
  }
}

export function listCommunautes(kind, { tab = 'decouvrir', query = '' } = {}) {
  const all = kind === 'clubs' ? COMM_STORE.clubs : COMM_STORE.groupes
  all.forEach(syncMyState)
  const q = (query || '').trim().toLowerCase()
  let list = [...all]
  if (tab === 'mes') list = list.filter((c) => c.myState === 'member' || c.myState === 'pending')
  if (q) {
    list = list.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.description || '').toLowerCase().includes(q)
    )
  }
  return list
}

export function getCommunaute(id) {
  const c =
    COMM_STORE.groupes.find((x) => x.id === id) || COMM_STORE.clubs.find((x) => x.id === id) || null
  if (c) syncMyState(c)
  return c
}

export function isCommunauteAdmin(c, userId = VIEWER) {
  return !!c && (c.admins || []).includes(userId)
}

export function canPublish(c, userId = VIEWER) {
  if (!c) return false
  if (isCommunauteAdmin(c, userId)) return true
  if (c.publishRule === 'admins') return false
  return (c.memberIds || []).includes(userId)
}

export function joinCommunaute(id) {
  const c = getCommunaute(id)
  if (!c) return null
  if (c.myState === 'member') return c
  if (c.access === 'open') {
    c.pendingIds = c.pendingIds.filter((x) => x !== VIEWER)
    if (!c.memberIds.includes(VIEWER)) {
      c.memberIds.push(VIEWER)
      c.membersCount += 1
    }
  } else {
    if (!c.pendingIds.includes(VIEWER) && !c.memberIds.includes(VIEWER)) {
      c.pendingIds.push(VIEWER)
    }
  }
  syncMyState(c)
  persist()
  return c
}

export function cancelJoinRequest(id) {
  const c = getCommunaute(id)
  if (!c) return null
  c.pendingIds = c.pendingIds.filter((x) => x !== VIEWER)
  syncMyState(c)
  persist()
  return c
}

export function leaveCommunaute(id) {
  const c = getCommunaute(id)
  if (!c) return null
  const was = c.memberIds.includes(VIEWER)
  c.memberIds = c.memberIds.filter((x) => x !== VIEWER)
  c.pendingIds = c.pendingIds.filter((x) => x !== VIEWER)
  if (was) c.membersCount = Math.max(0, c.membersCount - 1)
  syncMyState(c)
  persist()
  return c
}

export function acceptJoin(id, userId) {
  const c = getCommunaute(id)
  if (!c || !isCommunauteAdmin(c)) return { error: 'forbidden' }
  c.pendingIds = c.pendingIds.filter((x) => x !== userId)
  if (!c.memberIds.includes(userId)) {
    c.memberIds.push(userId)
    c.membersCount += 1
  }
  syncMyState(c)
  persist()
  return c
}

export function refuseJoin(id, userId) {
  const c = getCommunaute(id)
  if (!c || !isCommunauteAdmin(c)) return { error: 'forbidden' }
  c.pendingIds = c.pendingIds.filter((x) => x !== userId)
  persist()
  return c
}

export function removeMember(id, userId) {
  const c = getCommunaute(id)
  if (!c || !isCommunauteAdmin(c)) return { error: 'forbidden' }
  if ((c.admins || []).includes(userId)) return { error: 'admin' }
  const was = c.memberIds.includes(userId)
  c.memberIds = c.memberIds.filter((x) => x !== userId)
  if (was) c.membersCount = Math.max(0, c.membersCount - 1)
  persist()
  return c
}

export function createCommunautePost(id, body) {
  const c = getCommunaute(id)
  if (!c) return null
  if (!canPublish(c)) return { error: 'forbidden' }
  const text = (body || '').trim()
  if (!text) return { error: 'empty' }
  const post = {
    id: `post-${Date.now()}`,
    authorId: VIEWER,
    author: 'Rica',
    body: text,
    at: new Date().toISOString(),
    reactions: 0,
    comments: 0,
  }
  c.posts = [post, ...(c.posts || [])]
  persist()
  return post
}

export function deleteCommunautePost(id, postId) {
  const c = getCommunaute(id)
  if (!c) return null
  const post = (c.posts || []).find((p) => p.id === postId)
  if (!post) return null
  if (post.authorId !== VIEWER && !isCommunauteAdmin(c)) return { error: 'forbidden' }
  c.posts = c.posts.filter((p) => p.id !== postId)
  persist()
  return { ok: true }
}

export function reactCommunautePost(id, postId) {
  const c = getCommunaute(id)
  if (!c) return null
  const post = (c.posts || []).find((p) => p.id === postId)
  if (!post) return null
  post.reactions = (post.reactions || 0) + 1
  persist()
  return post
}

export function accessLabel(access) {
  return access === 'validation' ? 'Sur validation' : 'Accès ouvert'
}

export function myStateLabel(state) {
  return (
    {
      member: 'Membre',
      pending: 'Demande en attente',
      none: '',
    }[state] || ''
  )
}

export function kindLabel(kind) {
  return kind === 'clubs' ? 'Clubs' : 'Groupes'
}

export function mesTabLabel(kind) {
  return kind === 'clubs' ? 'Mes clubs' : 'Mes groupes'
}
