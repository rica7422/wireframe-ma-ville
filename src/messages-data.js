/**
 * Messagerie MIASIN / Ma Ville — conversations distinctes, store démo.
 * Pas d'envoi réel. PJ = prévisualisation locale (blob URL session).
 */

const STORE_KEY = 'ma-ville-msg-store'
const OPEN_KEY = 'ma-ville-msg-open'
const TAB_KEY = 'ma-ville-msg-tab'
const SEARCH_KEY = 'ma-ville-msg-search'
const REPLY_KEY = 'ma-ville-msg-reply'
const EDIT_KEY = 'ma-ville-msg-edit'
const ATTACH_KEY = 'ma-ville-msg-attach'
const VIEWER = 'user-rica'

export const MSG_CONTACTS = [
  { id: 'user-anahit', name: 'Anahit Sargsyan' },
  { id: 'user-armen', name: 'Armen Karapetyan' },
  { id: 'user-lilit', name: 'Lilit Ameni' },
  { id: 'user-gurgen', name: 'Gurgen Hovhannisyan' },
  { id: 'user-hasmik', name: 'Hasmik Petrosyan' },
  { id: 'org-mairie-kapan', name: 'Mairie de Kapan' },
]

const DEFAULT = {
  conversations: [
    {
      id: 'msg-miasin-anahit',
      context: 'miasin',
      city: null,
      peerId: 'user-anahit',
      peerName: 'Anahit Sargsyan',
      participants: [VIEWER, 'user-anahit'],
      updatedAt: '2026-10-02T08:12:00',
      messages: [
        {
          id: 'm1',
          from: 'user-anahit',
          text: 'Salut Rica, tu viens à Dilijan ce week-end ?',
          at: '2026-10-01T18:02:00',
          readBy: [VIEWER],
          reactions: { '👍': ['user-rica'] },
        },
        {
          id: 'm2',
          from: VIEWER,
          text: 'Oui, j’arrive samedi matin.',
          at: '2026-10-01T18:10:00',
          readBy: [VIEWER, 'user-anahit'],
          edited: true,
        },
        {
          id: 'm3',
          from: 'user-anahit',
          text: 'Parfait — je t’envoie le plan.',
          at: '2026-10-02T08:12:00',
          readBy: [],
          attachment: { kind: 'file', name: 'plan-dilijan.pdf', local: true },
        },
      ],
    },
    {
      id: 'msg-miasin-armen',
      context: 'miasin',
      city: null,
      peerId: 'user-armen',
      peerName: 'Armen Karapetyan',
      participants: [VIEWER, 'user-armen'],
      updatedAt: '2026-09-30T21:40:00',
      messages: [
        {
          id: 'm4',
          from: 'user-armen',
          text: 'Tu as vu la nouvelle version MIASIN ?',
          at: '2026-09-30T21:40:00',
          readBy: [VIEWER],
        },
        {
          id: 'm5',
          from: VIEWER,
          text: 'Pas encore, je regarde ce soir.',
          at: '2026-09-30T21:42:00',
          readBy: [VIEWER],
          deletedForEveryone: true,
        },
      ],
    },
    {
      id: 'msg-maville-lilit',
      context: 'maville',
      city: 'Kapan',
      peerId: 'user-lilit',
      peerName: 'Lilit Ameni',
      participants: [VIEWER, 'user-lilit'],
      updatedAt: '2026-10-02T09:05:00',
      messages: [
        {
          id: 'm6',
          from: 'user-lilit',
          text: 'L’atelier créatif a encore des places ?',
          at: '2026-10-02T09:00:00',
          readBy: [],
        },
        {
          id: 'm7',
          from: VIEWER,
          text: 'Oui, il reste des places — je t’inscris ?',
          at: '2026-10-02T09:05:00',
          readBy: [VIEWER],
          replyTo: 'm6',
        },
      ],
    },
    {
      id: 'msg-maville-mairie',
      context: 'maville',
      city: 'Kapan',
      peerId: 'org-mairie-kapan',
      peerName: 'Mairie de Kapan',
      participants: [VIEWER, 'org-mairie-kapan'],
      updatedAt: '2026-09-28T11:20:00',
      messages: [
        {
          id: 'm8',
          from: 'org-mairie-kapan',
          text: 'Votre rendez-vous CNI est confirmé le 12 juin.',
          at: '2026-09-28T11:20:00',
          readBy: [VIEWER],
        },
      ],
    },
    {
      id: 'msg-maville-gurgen',
      context: 'maville',
      city: 'Kapan',
      peerId: 'user-gurgen',
      peerName: 'Gurgen Hovhannisyan',
      participants: [VIEWER, 'user-gurgen'],
      updatedAt: '2026-09-25T16:00:00',
      messages: [
        {
          id: 'm9',
          from: VIEWER,
          text: 'On se voit au marché demain ?',
          at: '2026-09-25T16:00:00',
          readBy: [VIEWER],
        },
      ],
    },
  ],
}

export const MSG_STORE = { conversations: [] }

function persist() {
  const raw = JSON.stringify(MSG_STORE)
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
      if (saved?.conversations?.length) {
        MSG_STORE.conversations = saved.conversations
        return
      }
    }
  } catch {
    /* ignore */
  }
  MSG_STORE.conversations = JSON.parse(JSON.stringify(DEFAULT.conversations))
}

hydrate()

export function getMsgViewerId() {
  return VIEWER
}

export function setMsgTab(tab) {
  try {
    sessionStorage.setItem(TAB_KEY, tab === 'maville' ? 'maville' : 'miasin')
  } catch {
    /* ignore */
  }
}

export function getMsgTab() {
  try {
    return sessionStorage.getItem(TAB_KEY) || 'miasin'
  } catch {
    return 'miasin'
  }
}

export function setOpenConversationId(id) {
  try {
    if (id) sessionStorage.setItem(OPEN_KEY, id)
    else sessionStorage.removeItem(OPEN_KEY)
  } catch {
    /* ignore */
  }
}

export function getOpenConversationId() {
  try {
    return sessionStorage.getItem(OPEN_KEY)
  } catch {
    return null
  }
}

export function setMsgSearch(q) {
  try {
    sessionStorage.setItem(SEARCH_KEY, q || '')
  } catch {
    /* ignore */
  }
}

export function getMsgSearch() {
  try {
    return sessionStorage.getItem(SEARCH_KEY) || ''
  } catch {
    return ''
  }
}

export function setReplyTo(msgId) {
  try {
    if (msgId) sessionStorage.setItem(REPLY_KEY, msgId)
    else sessionStorage.removeItem(REPLY_KEY)
  } catch {
    /* ignore */
  }
}

export function getReplyTo() {
  try {
    return sessionStorage.getItem(REPLY_KEY)
  } catch {
    return null
  }
}

export function setEditMsgId(id) {
  try {
    if (id) sessionStorage.setItem(EDIT_KEY, id)
    else sessionStorage.removeItem(EDIT_KEY)
  } catch {
    /* ignore */
  }
}

export function getEditMsgId() {
  try {
    return sessionStorage.getItem(EDIT_KEY)
  } catch {
    return null
  }
}

export function setPendingAttach(att) {
  try {
    if (att) sessionStorage.setItem(ATTACH_KEY, JSON.stringify(att))
    else sessionStorage.removeItem(ATTACH_KEY)
  } catch {
    /* ignore */
  }
}

export function getPendingAttach() {
  try {
    const raw = sessionStorage.getItem(ATTACH_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function getConversation(id) {
  return MSG_STORE.conversations.find((c) => c.id === id) || null
}

function visibleMessages(conv, viewerId = VIEWER) {
  return (conv.messages || []).filter((m) => !(m.deletedForMe || []).includes(viewerId))
}

export function lastVisibleMessage(conv, viewerId = VIEWER) {
  const list = visibleMessages(conv, viewerId)
  return list[list.length - 1] || null
}

export function unreadCount(conv, viewerId = VIEWER) {
  return visibleMessages(conv, viewerId).filter(
    (m) => m.from !== viewerId && !(m.readBy || []).includes(viewerId) && !m.deletedForEveryone
  ).length
}

export function listConversations(context, { query = '', viewerId = VIEWER } = {}) {
  const q = (query || '').trim().toLowerCase()
  return MSG_STORE.conversations
    .filter((c) => c.context === context)
    .filter((c) => c.participants.includes(viewerId))
    .filter((c) => {
      if (!q) return true
      const last = lastVisibleMessage(c, viewerId)
      return (
        (c.peerName || '').toLowerCase().includes(q) ||
        (last?.text || '').toLowerCase().includes(q) ||
        (c.city || '').toLowerCase().includes(q)
      )
    })
    .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))
}

export function findDm(peerId, context) {
  return (
    MSG_STORE.conversations.find(
      (c) => c.context === context && c.peerId === peerId && c.participants.includes(VIEWER)
    ) || null
  )
}

export function openOrCreateDm(peerId, context) {
  const existing = findDm(peerId, context)
  if (existing) {
    setOpenConversationId(existing.id)
    return existing
  }
  const contact = MSG_CONTACTS.find((c) => c.id === peerId)
  const id = `msg-${context}-${peerId}-${Date.now()}`
  const conv = {
    id,
    context,
    city: context === 'maville' ? 'Kapan' : null,
    peerId,
    peerName: contact?.name || 'Contact',
    participants: [VIEWER, peerId],
    updatedAt: new Date().toISOString(),
    messages: [],
  }
  MSG_STORE.conversations.push(conv)
  persist()
  setOpenConversationId(id)
  return conv
}

export function markConversationRead(id, viewerId = VIEWER) {
  const c = getConversation(id)
  if (!c) return null
  visibleMessages(c, viewerId).forEach((m) => {
    if (m.from !== viewerId) {
      m.readBy = Array.from(new Set([...(m.readBy || []), viewerId]))
    }
  })
  persist()
  return c
}

export function sendMessage(convId, { text = '', attachment = null, replyTo = null } = {}) {
  const c = getConversation(convId)
  if (!c) return null
  const body = (text || '').trim()
  if (!body && !attachment) return { error: 'empty' }
  const msg = {
    id: `m-${Date.now()}`,
    from: VIEWER,
    text: body,
    at: new Date().toISOString(),
    readBy: [VIEWER],
    replyTo: replyTo || undefined,
    attachment: attachment || undefined,
  }
  c.messages.push(msg)
  c.updatedAt = msg.at
  persist()
  setReplyTo(null)
  setPendingAttach(null)
  return msg
}

export function editMessage(convId, msgId, text) {
  const c = getConversation(convId)
  if (!c) return null
  const m = c.messages.find((x) => x.id === msgId)
  if (!m || m.from !== VIEWER || m.deletedForEveryone) return { error: 'forbidden' }
  m.text = (text || '').trim()
  m.edited = true
  c.updatedAt = new Date().toISOString()
  persist()
  setEditMsgId(null)
  return m
}

export function deleteMessageForMe(convId, msgId, viewerId = VIEWER) {
  const c = getConversation(convId)
  if (!c) return null
  const m = c.messages.find((x) => x.id === msgId)
  if (!m) return null
  m.deletedForMe = Array.from(new Set([...(m.deletedForMe || []), viewerId]))
  persist()
  return m
}

export function deleteMessageForEveryone(convId, msgId) {
  const c = getConversation(convId)
  if (!c) return null
  const m = c.messages.find((x) => x.id === msgId)
  if (!m || m.from !== VIEWER) return { error: 'forbidden' }
  m.deletedForEveryone = true
  m.text = ''
  m.attachment = null
  persist()
  return m
}

export function reactToMessage(convId, msgId, emoji) {
  const c = getConversation(convId)
  if (!c) return null
  const m = c.messages.find((x) => x.id === msgId)
  if (!m || m.deletedForEveryone) return null
  m.reactions = m.reactions || {}
  // remove viewer from all, then toggle
  Object.keys(m.reactions).forEach((k) => {
    m.reactions[k] = (m.reactions[k] || []).filter((u) => u !== VIEWER)
    if (!m.reactions[k].length) delete m.reactions[k]
  })
  if (emoji) {
    m.reactions[emoji] = [...(m.reactions[emoji] || []), VIEWER]
  }
  persist()
  return m
}

export function getMessage(convId, msgId) {
  const c = getConversation(convId)
  return c?.messages?.find((m) => m.id === msgId) || null
}

export function formatMsgTime(iso) {
  if (!iso) return ''
  try {
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) return iso
    return d.toLocaleString('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return iso
  }
}

export function contactName(id) {
  return MSG_CONTACTS.find((c) => c.id === id)?.name || id
}
