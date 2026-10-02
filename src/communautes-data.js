/**
 * Groupes & Clubs — même produit, couleurs distinctes.
 * Structure maquette 1001-n : actualités, invitations, suggestions, création, admin communauté.
 * Admin municipal ≠ admin de la communauté.
 */

const STORE_KEY = 'ma-ville-communautes-store-v2'
const OPEN_KEY = 'ma-ville-communaute-open'
const TAB_KEY = 'ma-ville-communaute-tab'
const SEARCH_KEY = 'ma-ville-communaute-search'
const FILTER_KEY = 'ma-ville-communaute-filter'
const VIEW_KEY = 'ma-ville-communaute-view'
const CREATE_KEY = 'ma-ville-communaute-create'
const ROLE_PICK_KEY = 'ma-ville-communaute-role-pick'
const VIEWER = 'user-rica'

export const COMM_CATEGORIES = [
  { id: 'hobbies', label: 'Hobbies', icon: '🎯' },
  { id: 'sport', label: 'Sport', icon: '⚽' },
  { id: 'culture', label: 'Culture', icon: '🎭' },
  { id: 'famille', label: 'Famille', icon: '👨‍👩‍👧' },
  { id: 'voyage', label: 'Voyage', icon: '✈️' },
  { id: 'nature', label: 'Nature', icon: '🌿' },
  { id: 'photo', label: 'Photo', icon: '📷' },
  { id: 'lecture', label: 'Lecture', icon: '📚' },
]

function cat(id) {
  return COMM_CATEGORIES.find((c) => c.id === id) || COMM_CATEGORIES[0]
}

const DEFAULT = {
  groupes: [
    {
      id: 'grp-randonnee',
      kind: 'groupes',
      name: 'Randonneurs de Kapan',
      description: 'Sorties nature autour de Kapan et du Syunik. Niveau débutant bienvenu.',
      categoryId: 'nature',
      privacy: 'public',
      access: 'open',
      inviteWho: 'member',
      autoValidateMembers: true,
      autoApprovePosts: true,
      membersCount: 48,
      createdAt: '2026-04-18',
      updatedAt: '2026-09-30',
      createdAgo: 'Créé il y a 5 mois',
      creatorId: 'user-armen',
      creatorName: 'Armen Karapetyan',
      admins: ['user-rica', 'user-armen'],
      moderators: ['user-lilit'],
      memberIds: ['user-rica', 'user-armen', 'user-lilit', 'user-anahit'],
      pendingIds: [],
      friendsIn: ['Anahit', 'Lilit', 'Gurgen'],
      galleryCount: 12,
      pendingApprovals: 0,
      reportedCount: 0,
      rulesCount: 2,
      rulesText: 'Respectez le groupe et annulez à temps si vous ne venez pas.',
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
      events: [{ id: 'evt-atelier', title: 'Atelier créatif (lié)', when: '16 juin' }],
      popular: true,
    },
    {
      id: 'grp-photo',
      kind: 'groupes',
      name: 'Photo urbaine Kapan',
      description: 'Partage de clichés et balades photo en ville.',
      categoryId: 'photo',
      privacy: 'public',
      access: 'validation',
      inviteWho: 'admin',
      autoValidateMembers: false,
      autoApprovePosts: true,
      membersCount: 22,
      createdAt: '2026-06-01',
      updatedAt: '2026-09-30',
      createdAgo: 'Créé il y a 4 mois',
      creatorId: 'user-hasmik',
      creatorName: 'Hasmik Petrosyan',
      admins: ['user-hasmik'],
      moderators: [],
      memberIds: ['user-hasmik'],
      pendingIds: [],
      friendsIn: ['Hasmik'],
      galleryCount: 40,
      pendingApprovals: 1,
      reportedCount: 0,
      rulesCount: 1,
      rulesText: 'Pas de photos de personnes sans accord.',
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
      events: [],
      popular: true,
      suggestForViewer: true,
    },
    {
      id: 'grp-lecture',
      kind: 'groupes',
      name: 'Club lecture Syunik',
      description: 'Un livre par mois, discussions en bibliothèque.',
      categoryId: 'lecture',
      privacy: 'private',
      access: 'validation',
      inviteWho: 'member',
      autoValidateMembers: false,
      autoApprovePosts: false,
      membersCount: 15,
      createdAt: '2026-03-10',
      updatedAt: '2026-09-27',
      createdAgo: 'Créé il y a 6 mois',
      creatorId: 'user-anahit',
      creatorName: 'Anahit Sargsyan',
      admins: ['user-anahit'],
      moderators: [],
      memberIds: ['user-anahit', 'user-lilit'],
      pendingIds: [],
      friendsIn: ['Anahit', 'Lilit'],
      galleryCount: 3,
      pendingApprovals: 2,
      reportedCount: 0,
      rulesCount: 3,
      rulesText: 'Seuls les administrateurs publient l’agenda.',
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
      events: [],
      popular: false,
      invitationForViewer: {
        fromId: 'user-anahit',
        fromName: 'Anahit Sargsyan',
        adminName: 'Anahit Sargsyan',
        status: 'pending',
      },
    },
  ],
  clubs: [
    {
      id: 'club-echecs',
      kind: 'clubs',
      name: 'Club d’échecs Kapan',
      description: 'Parties libres et tournois amicaux à la maison des jeunes.',
      categoryId: 'hobbies',
      privacy: 'public',
      access: 'open',
      inviteWho: 'member',
      autoValidateMembers: true,
      autoApprovePosts: true,
      membersCount: 31,
      createdAt: '2026-02-01',
      updatedAt: '2026-10-01',
      createdAgo: 'Créé il y a 8 mois',
      creatorId: 'user-gurgen',
      creatorName: 'Gurgen Hovhannisyan',
      admins: ['user-rica', 'user-gurgen'],
      moderators: ['user-armen'],
      memberIds: ['user-rica', 'user-gurgen', 'user-armen'],
      pendingIds: [],
      friendsIn: ['Gurgen', 'Armen'],
      galleryCount: 8,
      pendingApprovals: 0,
      reportedCount: 1,
      rulesCount: 2,
      rulesText: 'Fair-play · pas de paris.',
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
      events: [],
      popular: true,
    },
    {
      id: 'club-theatre',
      kind: 'clubs',
      name: 'Théâtre amateur',
      description: 'Ateliers et petites scènes.',
      categoryId: 'culture',
      privacy: 'private',
      access: 'validation',
      inviteWho: 'admin',
      autoValidateMembers: false,
      autoApprovePosts: false,
      membersCount: 19,
      createdAt: '2026-05-12',
      updatedAt: '2026-09-29',
      createdAgo: 'Créé il y a 4 mois',
      creatorId: 'user-lilit',
      creatorName: 'Lilit Ameni',
      admins: ['user-lilit'],
      moderators: [],
      memberIds: ['user-lilit'],
      pendingIds: ['user-rica'],
      friendsIn: ['Lilit'],
      galleryCount: 5,
      pendingApprovals: 5,
      reportedCount: 0,
      rulesCount: 3,
      rulesText: 'Publications réservées à l’équipe.',
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
      events: [],
      popular: false,
    },
    {
      id: 'club-velo',
      kind: 'clubs',
      name: 'Vélo urbain',
      description: 'Balades et entretien collectif.',
      categoryId: 'sport',
      privacy: 'public',
      access: 'open',
      inviteWho: 'member',
      autoValidateMembers: true,
      autoApprovePosts: true,
      membersCount: 27,
      createdAt: '2026-07-01',
      updatedAt: '2026-09-26',
      createdAgo: 'Créé il y a 3 mois',
      creatorId: 'user-armen',
      creatorName: 'Armen Karapetyan',
      admins: ['user-armen'],
      moderators: [],
      memberIds: ['user-armen', 'user-anahit'],
      pendingIds: [],
      friendsIn: ['Armen', 'Anahit'],
      galleryCount: 15,
      pendingApprovals: 0,
      reportedCount: 0,
      rulesCount: 1,
      rulesText: 'Casque obligatoire sur les sorties.',
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
      events: [],
      popular: true,
      suggestForViewer: true,
      invitationForViewer: {
        fromId: 'user-armen',
        fromName: 'Armen Karapetyan',
        adminName: 'Armen Karapetyan',
        status: 'pending',
      },
    },
  ],
  ignoredSuggestions: [],
  memberMeta: {
    'user-rica': { name: 'Rica', since: 'Membre depuis 2 sem.' },
    'user-armen': { name: 'Armen Karapetyan', since: 'Membre depuis 3 mois' },
    'user-lilit': { name: 'Lilit Ameni', since: 'Membre depuis 1 j' },
    'user-anahit': { name: 'Anahit Sargsyan', since: 'Membre depuis 1 mois' },
    'user-gurgen': { name: 'Gurgen Hovhannisyan', since: 'Membre depuis 5 mois' },
    'user-hasmik': { name: 'Hasmik Petrosyan', since: 'Membre depuis 4 mois' },
  },
}

export const COMM_STORE = {
  groupes: [],
  clubs: [],
  ignoredSuggestions: [],
  memberMeta: {},
}

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
      if (saved?.groupes?.length && saved?.clubs?.length && saved.groupes[0]?.categoryId) {
        COMM_STORE.groupes = saved.groupes
        COMM_STORE.clubs = saved.clubs
        COMM_STORE.ignoredSuggestions = saved.ignoredSuggestions || []
        COMM_STORE.memberMeta = saved.memberMeta || DEFAULT.memberMeta
        return
      }
    }
  } catch {
    /* ignore */
  }
  COMM_STORE.groupes = JSON.parse(JSON.stringify(DEFAULT.groupes))
  COMM_STORE.clubs = JSON.parse(JSON.stringify(DEFAULT.clubs))
  COMM_STORE.ignoredSuggestions = []
  COMM_STORE.memberMeta = { ...DEFAULT.memberMeta }
}

hydrate()

export function getViewerId() {
  return VIEWER
}

function syncMyState(c) {
  if (!c) return c
  if ((c.memberIds || []).includes(VIEWER)) c.myState = 'member'
  else if ((c.pendingIds || []).includes(VIEWER)) c.myState = 'pending'
  else if (c.invitationForViewer?.status === 'pending') c.myState = 'invited'
  else c.myState = 'none'
  c.membersCount = Math.max((c.memberIds || []).length, c.membersCount || 0)
  c.category = cat(c.categoryId)
  return c
}

export function setCommunauteKindTab(kind, tab) {
  try {
    sessionStorage.setItem(`${TAB_KEY}-${kind}`, tab || 'actualites')
  } catch {
    /* ignore */
  }
}

export function getCommunauteKindTab(kind) {
  try {
    return sessionStorage.getItem(`${TAB_KEY}-${kind}`) || 'actualites'
  } catch {
    return 'actualites'
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

export function setCommunauteFilter(kind, filter) {
  try {
    sessionStorage.setItem(`${FILTER_KEY}-${kind}`, filter || 'populaire')
  } catch {
    /* ignore */
  }
}

export function getCommunauteFilter(kind) {
  try {
    return sessionStorage.getItem(`${FILTER_KEY}-${kind}`) || 'populaire'
  } catch {
    return 'populaire'
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

export function setCommunautePageView(view) {
  try {
    sessionStorage.setItem(VIEW_KEY, view || 'publications')
  } catch {
    /* ignore */
  }
}

export function getCommunautePageView() {
  try {
    return sessionStorage.getItem(VIEW_KEY) || 'publications'
  } catch {
    return 'publications'
  }
}

export function getCreateDraft() {
  try {
    const raw = sessionStorage.getItem(CREATE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function setCreateDraft(draft) {
  try {
    if (draft) sessionStorage.setItem(CREATE_KEY, JSON.stringify(draft))
    else sessionStorage.removeItem(CREATE_KEY)
  } catch {
    /* ignore */
  }
}

export function setRolePick(role) {
  try {
    if (role) sessionStorage.setItem(ROLE_PICK_KEY, role)
    else sessionStorage.removeItem(ROLE_PICK_KEY)
  } catch {
    /* ignore */
  }
}

export function getRolePick() {
  try {
    return sessionStorage.getItem(ROLE_PICK_KEY)
  } catch {
    return null
  }
}

export function listAll(kind) {
  const all = kind === 'clubs' ? COMM_STORE.clubs : COMM_STORE.groupes
  all.forEach(syncMyState)
  return all
}

export function listCommunautes(kind, { tab = 'actualites', query = '', filter = 'populaire' } = {}) {
  let list = listAll(kind)
  const q = (query || '').trim().toLowerCase()
  const ignored = new Set(COMM_STORE.ignoredSuggestions || [])

  if (tab === 'mes') {
    list = list.filter((c) => c.myState === 'member')
  } else if (tab === 'invitations') {
    list = list.filter((c) => c.invitationForViewer?.status === 'pending' && c.myState !== 'member')
  } else if (tab === 'suggestions') {
    list = list.filter(
      (c) =>
        c.suggestForViewer &&
        c.myState !== 'member' &&
        c.myState !== 'pending' &&
        !ignored.has(c.id)
    )
  } else {
    // actualites — communities with posts (feed cards)
    list = list.filter((c) => (c.posts || []).length > 0)
  }

  if (q) {
    list = list.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.description || '').toLowerCase().includes(q) ||
        (c.category?.label || '').toLowerCase().includes(q)
    )
  }

  if (filter === 'populaire') {
    list = [...list].sort((a, b) => Number(!!b.popular) - Number(!!a.popular) || b.membersCount - a.membersCount)
  } else if (filter && filter.startsWith('cat:')) {
    const cid = filter.slice(4)
    list = list.filter((c) => c.categoryId === cid)
  }

  return list
}

export function feedPosts(kind, { query = '', filter = 'populaire' } = {}) {
  const communities = listCommunautes(kind, { tab: 'actualites', query, filter })
  const items = []
  communities.forEach((c) => {
    ;(c.posts || []).forEach((p) => {
      items.push({ ...p, community: c })
    })
  })
  return items.sort((a, b) => (a.at < b.at ? 1 : -1))
}

export function getCommunaute(id) {
  const c =
    COMM_STORE.groupes.find((x) => x.id === id) || COMM_STORE.clubs.find((x) => x.id === id) || null
  return syncMyState(c)
}

export function isCommunauteAdmin(c, userId = VIEWER) {
  return !!c && (c.admins || []).includes(userId)
}

export function isCommunauteModo(c, userId = VIEWER) {
  return !!c && ((c.moderators || []).includes(userId) || isCommunauteAdmin(c, userId))
}

export function canPublish(c, userId = VIEWER) {
  if (!c) return false
  if (isCommunauteAdmin(c, userId) || isCommunauteModo(c, userId)) return true
  if (!c.autoApprovePosts && !isCommunauteAdmin(c, userId)) {
    // members can still compose; posts go pending — for wireframe allow publish if member
  }
  return (c.memberIds || []).includes(userId)
}

export function canInvite(c, userId = VIEWER) {
  if (!c || c.myState !== 'member') return false
  if (isCommunauteAdmin(c, userId)) return true
  return c.inviteWho === 'member'
}

export function joinCommunaute(id) {
  const c = getCommunaute(id)
  if (!c) return null
  if (c.myState === 'member') return c
  if (c.access === 'open' || c.autoValidateMembers) {
    c.pendingIds = (c.pendingIds || []).filter((x) => x !== VIEWER)
    if (!c.memberIds.includes(VIEWER)) {
      c.memberIds.push(VIEWER)
      c.membersCount += 1
    }
    if (c.invitationForViewer) c.invitationForViewer.status = 'accepted'
  } else {
    if (!c.pendingIds.includes(VIEWER) && !c.memberIds.includes(VIEWER)) c.pendingIds.push(VIEWER)
  }
  syncMyState(c)
  persist()
  return c
}

export function cancelJoinRequest(id) {
  const c = getCommunaute(id)
  if (!c) return null
  c.pendingIds = (c.pendingIds || []).filter((x) => x !== VIEWER)
  syncMyState(c)
  persist()
  return c
}

export function leaveCommunaute(id) {
  const c = getCommunaute(id)
  if (!c) return null
  const was = c.memberIds.includes(VIEWER)
  c.memberIds = c.memberIds.filter((x) => x !== VIEWER)
  c.pendingIds = (c.pendingIds || []).filter((x) => x !== VIEWER)
  c.admins = (c.admins || []).filter((x) => x !== VIEWER)
  c.moderators = (c.moderators || []).filter((x) => x !== VIEWER)
  if (was) c.membersCount = Math.max(0, c.membersCount - 1)
  syncMyState(c)
  persist()
  return c
}

export function acceptInvitation(id) {
  const c = getCommunaute(id)
  if (!c?.invitationForViewer || c.invitationForViewer.status !== 'pending') return null
  if (!c.memberIds.includes(VIEWER)) {
    c.memberIds.push(VIEWER)
    c.membersCount += 1
  }
  c.pendingIds = (c.pendingIds || []).filter((x) => x !== VIEWER)
  c.invitationForViewer.status = 'accepted'
  syncMyState(c)
  persist()
  return c
}

export function ignoreInvitation(id) {
  const c = getCommunaute(id)
  if (!c?.invitationForViewer) return null
  c.invitationForViewer.status = 'ignored'
  syncMyState(c)
  persist()
  return c
}

export function ignoreSuggestion(id) {
  if (!COMM_STORE.ignoredSuggestions.includes(id)) COMM_STORE.ignoredSuggestions.push(id)
  persist()
  return true
}

export function acceptJoin(id, userId) {
  const c = getCommunaute(id)
  if (!c || !isCommunauteModo(c)) return { error: 'forbidden' }
  c.pendingIds = (c.pendingIds || []).filter((x) => x !== userId)
  if (!c.memberIds.includes(userId)) {
    c.memberIds.push(userId)
    c.membersCount += 1
  }
  persist()
  return c
}

export function refuseJoin(id, userId) {
  const c = getCommunaute(id)
  if (!c || !isCommunauteModo(c)) return { error: 'forbidden' }
  c.pendingIds = (c.pendingIds || []).filter((x) => x !== userId)
  persist()
  return c
}

export function removeMember(id, userId) {
  const c = getCommunaute(id)
  if (!c || !isCommunauteAdmin(c)) return { error: 'forbidden' }
  if ((c.admins || []).includes(userId)) return { error: 'admin' }
  const was = c.memberIds.includes(userId)
  c.memberIds = c.memberIds.filter((x) => x !== userId)
  c.moderators = (c.moderators || []).filter((x) => x !== userId)
  if (was) c.membersCount = Math.max(0, c.membersCount - 1)
  persist()
  return c
}

export function updateSettings(id, patch) {
  const c = getCommunaute(id)
  if (!c || !isCommunauteAdmin(c)) return { error: 'forbidden' }
  Object.assign(c, patch)
  c.updatedAt = new Date().toISOString().slice(0, 10)
  persist()
  return c
}

export function assignRole(id, userId, role) {
  const c = getCommunaute(id)
  if (!c || !isCommunauteAdmin(c)) return { error: 'forbidden' }
  if (!c.memberIds.includes(userId)) return { error: 'not_member' }
  c.admins = (c.admins || []).filter((x) => x !== userId)
  c.moderators = (c.moderators || []).filter((x) => x !== userId)
  if (role === 'admin') c.admins.push(userId)
  else if (role === 'modo') c.moderators.push(userId)
  persist()
  return c
}

export function leaveAdminRole(id) {
  const c = getCommunaute(id)
  if (!c || !isCommunauteAdmin(c)) return { error: 'forbidden' }
  if ((c.admins || []).length <= 1) return { error: 'last_admin' }
  c.admins = c.admins.filter((x) => x !== VIEWER)
  persist()
  return c
}

export function dissolveCommunaute(id) {
  const c = getCommunaute(id)
  if (!c || !isCommunauteAdmin(c)) return { error: 'forbidden' }
  const list = c.kind === 'clubs' ? COMM_STORE.clubs : COMM_STORE.groupes
  const i = list.findIndex((x) => x.id === id)
  if (i >= 0) list.splice(i, 1)
  persist()
  return { ok: true, kind: c.kind }
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
    pending: !c.autoApprovePosts && !isCommunauteAdmin(c),
  }
  c.posts = [post, ...(c.posts || [])]
  if (post.pending) c.pendingApprovals = (c.pendingApprovals || 0) + 1
  persist()
  return post
}

export function deleteCommunautePost(id, postId) {
  const c = getCommunaute(id)
  if (!c) return null
  const post = (c.posts || []).find((p) => p.id === postId)
  if (!post) return null
  if (post.authorId !== VIEWER && !isCommunauteModo(c)) return { error: 'forbidden' }
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

export function createCommunauteFromDraft(draft) {
  if (!draft?.name?.trim()) return { error: 'name' }
  const kind = draft.kind === 'clubs' ? 'clubs' : 'groupes'
  const id = `${kind === 'clubs' ? 'club' : 'grp'}-${Date.now()}`
  const c = {
    id,
    kind,
    name: draft.name.trim(),
    description: (draft.description || '').trim() || 'Aucune description',
    categoryId: draft.categoryId || 'hobbies',
    privacy: draft.privacy === 'private' ? 'private' : 'public',
    access: draft.autoValidateMembers === false ? 'validation' : 'open',
    inviteWho: draft.inviteWho === 'admin' ? 'admin' : 'member',
    autoValidateMembers: draft.autoValidateMembers !== false,
    autoApprovePosts: draft.autoApprovePosts !== false,
    membersCount: 1,
    createdAt: new Date().toISOString().slice(0, 10),
    updatedAt: new Date().toISOString().slice(0, 10),
    createdAgo: 'Créé à l’instant',
    creatorId: VIEWER,
    creatorName: 'Rica',
    admins: [VIEWER],
    moderators: [],
    memberIds: [VIEWER],
    pendingIds: [],
    friendsIn: [],
    galleryCount: 0,
    pendingApprovals: 0,
    reportedCount: 0,
    rulesCount: 0,
    rulesText: '',
    posts: [],
    events: [],
    popular: false,
    profilePhoto: draft.profilePhoto || null,
    coverPhoto: draft.coverPhoto || null,
  }
  if (kind === 'clubs') COMM_STORE.clubs.unshift(c)
  else COMM_STORE.groupes.unshift(c)
  persist()
  setCreateDraft(null)
  setOpenCommunauteId(id)
  return c
}

export function startCreateDraft(kind) {
  const draft = {
    kind: kind === 'clubs' ? 'clubs' : 'groupes',
    step: 1,
    name: '',
    categoryId: 'hobbies',
    description: '',
    profilePhoto: null,
    coverPhoto: null,
    privacy: 'public',
    inviteWho: 'member',
    autoValidateMembers: true,
    autoApprovePosts: true,
  }
  setCreateDraft(draft)
  return draft
}

export function memberDisplay(userId) {
  return COMM_STORE.memberMeta[userId] || { name: userId, since: 'Membre' }
}

export function roleHolders(c) {
  if (!c) return []
  const rows = []
  ;(c.admins || []).forEach((id) => {
    rows.push({ userId: id, name: memberDisplay(id).name, role: 'Administrateur' })
  })
  ;(c.moderators || []).forEach((id) => {
    rows.push({ userId: id, name: memberDisplay(id).name, role: 'Modérateur' })
  })
  return rows
}

export function accessLabel(c) {
  if (!c) return ''
  if (c.privacy === 'private') return 'Privé'
  return c.access === 'validation' ? 'Public · sur validation' : 'Public'
}

export function myStateLabel(state) {
  return (
    {
      member: 'Membre',
      pending: 'Demande en attente',
      invited: 'Invitation',
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

export function privacyLabel(p) {
  return p === 'private' ? 'Privé' : 'Public'
}
