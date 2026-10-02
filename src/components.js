/** Shared wireframe building blocks */

export function photo(label = 'Photo…', cls = '') {
  return `<div class="slot-photo ${cls}" aria-hidden="true"><span>${label}</span></div>`
}

export function text(label = 'Texte…', cls = '') {
  return `<div class="slot-text ${cls}"><span>${label}</span></div>`
}

export function avatar(n = 1) {
  return Array.from({ length: n }, () => `<span class="avatar"></span>`).join('')
}

export function statusBar() {
  return `<div class="status-bar"><span>9:41</span><span>●●● Wi‑Fi</span></div>`
}

export function appChromeBar() {
  return `
    <div class="app-chrome" role="navigation" aria-label="Accueils">
      <button type="button" class="hit app-chrome-btn" data-sim="miasin" title="Accueil MIASIN">
        <span class="ico-svg ico-miasin" aria-hidden="true">◎</span>
        <span>MIASIN</span>
      </button>
      <button type="button" class="hit app-chrome-btn" data-go="accueil-kapan" title="Accueil Ma Ville">
        <span class="ico-svg" aria-hidden="true">⌂</span>
        <span>Ma Ville</span>
      </button>
    </div>`
}

/**
 * chrome: 'full' | 'form' | 'panel'
 * full = sticky MIASIN|Ma Ville + page header (Retour·title·pageMenu)
 * form = page header only (no app chrome, typically no footer at call site)
 * panel = local Retour/Fermer + title only (no app chrome)
 * NEVER put Accueil icons in the page header row.
 * showHome / showMiasin are deprecated and ignored (compat).
 */
export function phoneHeader({
  title = '',
  showBack = true,
  showCity = false,
  city = 'Kapan',
  backTo = null, // ignored for nav — data-back
  extraRight = '', // page ⋯ only
  chrome = 'full',
  closeLabel = '←', // panel can use ✕ via closeIcon
  closeIcon = false,
  showHome = true, // deprecated — ignored
  showMiasin = true, // deprecated — ignored
} = {}) {
  void backTo
  void closeLabel
  void showHome
  void showMiasin
  const backBtn = showBack
    ? `<button class="hit icon-btn" data-back title="${closeIcon ? 'Fermer' : 'Retour'}">${closeIcon ? '✕' : '←'}</button>`
    : `<span class="icon-btn ghost"></span>`
  const mid = showCity
    ? `<button class="hit city-pill" data-go="ville-modale-choisir">🇦🇲 ${city} ▾</button>`
    : `<div class="phone-title">${title}</div>`
  const pageRow = `
    <div class="phone-header">
      <div class="phone-header-row">
        ${backBtn}
        ${mid}
        <div class="header-right">${extraRight || ''}</div>
      </div>
    </div>`
  if (chrome === 'panel' || chrome === 'form') {
    return `${statusBar()}${pageRow}`
  }
  return `${statusBar()}${appChromeBar()}${pageRow}`
}

/** Provisional contextual footer — draft, always clickable */
export function phoneFooter(active = 'accueil') {
  const items = [
    { id: 'accueil', label: 'Accueil', go: 'accueil-kapan' },
    { id: 'mairie', label: 'Ma mairie', go: 'mairie-accueil' },
    { id: 'infos', label: 'Infos', go: 'infos-feed' },
    { id: 'messages', label: 'Messages', go: 'messages' },
    { id: 'menu', label: 'Menu', go: 'menu-plus' },
  ]
  return `
    <nav class="phone-footer" aria-label="Navigation Ma Ville (provisoire)">
      ${items
        .map(
          (it) => `
        <button class="hit footer-item ${active === it.id ? 'active' : ''}" data-go="${it.go}">
          <span class="footer-icon"></span>
          <span>${it.label}</span>
        </button>`
        )
        .join('')}
    </nav>
  `
}

export function chips(list, active = 0) {
  return `<div class="chips">${list
    .map((c, i) => `<button class="hit chip ${i === active ? 'on' : ''}" type="button">${c}</button>`)
    .join('')}</div>`
}

export function search(placeholder = 'Rechercher…') {
  return `<label class="search"><span class="search-ico">⌕</span><input type="search" placeholder="${placeholder}" /></label>`
}

export function listCard({
  title,
  meta = '',
  badge = '',
  actions = [],
  withPhoto = true,
} = {}) {
  return `
    <article class="card list-card">
      ${withPhoto ? photo('Photo…', 'thumb') : ''}
      <div class="card-body">
        <div class="card-top">
          <strong>${title}</strong>
          ${badge ? `<span class="badge">${badge}</span>` : ''}
        </div>
        ${meta ? `<p class="meta">${meta}</p>` : ''}
        ${
          actions.length
            ? `<div class="row-actions">${actions
                .map((a) =>
                  a.sim
                    ? `<button class="hit btn ${a.primary ? 'primary' : ''}" data-sim="${a.sim}">${a.label}</button>`
                    : `<button class="hit btn ${a.primary ? 'primary' : ''}" data-go="${a.go}">${a.label}</button>`
                )
                .join('')}</div>`
            : ''
        }
      </div>
    </article>
  `
}

/** Shared reaction row — identical on every social card */
export function socialActions({
  likes = '128',
  comments = '18',
  shares = '12',
  contentId = null,
  reactGo = 'infos-reactions',
  commentGo = 'infos-commentaires',
  shareGo = 'infos-partage',
  reactors = 'Rupen D. et 32 autres',
  section = null,
} = {}) {
  const sectionAttr = section ? ` data-section="${section}"` : ''
  const commentAttrs = contentId
    ? `data-open-comments="${contentId}"${sectionAttr}`
    : `data-go="${commentGo}"${sectionAttr}`
  const reactAttrs = contentId
    ? `data-open-reactions="${contentId}"${sectionAttr}`
    : `data-go="${reactGo}"${sectionAttr}`
  return `
    <div class="post-social">
      <button class="hit linkish social-reactors" ${reactAttrs} type="button">
        <span class="react-badges" aria-hidden="true"><span class="rb like">👍</span><span class="rb love">♥</span></span>
        <span class="meta">${reactors}</span>
      </button>
    </div>
    <div class="post-actions">
      <button class="hit btn" ${reactAttrs}>♡ ${likes}</button>
      <button class="hit btn" ${commentAttrs}>💬 ${comments}</button>
      <button class="hit btn" data-go="${shareGo}"${sectionAttr}>↗ ${shares}</button>
    </div>
  `
}

/** Infos Mairie feed card — photo + category + title + author + excerpt + social */
export function infoFeedCard({
  title = 'Titre…',
  cat = 'Catégorie',
  author = 'Admin Kapan',
  excerpt = 'Extrait…',
  detailGo = 'mairie-infos-detail',
  optionsGo = 'mairie-infos-apropos',
  contentId = null,
} = {}) {
  return `
    <article class="card info-feed-card">
      <button class="hit info-feed-top" data-go="${detailGo}" type="button">
        <div class="slot-photo thumb with-badge">
          <span>Photo…</span>
          <span class="badge abs">${cat}</span>
        </div>
        <div class="grow">
          <strong>${title}</strong>
          <p class="meta accent-text">${author}</p>
          ${text(excerpt)}
        </div>
      </button>
      <div class="pub-title-row">
        <span class="meta">⋯</span>
        <button class="hit icon-btn" data-go="${optionsGo}" title="À propos" aria-label="À propos">⋯</button>
      </div>
      ${socialActions({ contentId })}
    </article>
  `
}

export function sheetOption(label, { go, sim, toggle = false, on = false, danger = false } = {}) {
  const attrs = go ? `data-go="${go}"` : sim ? `data-sim="${sim}"` : 'type="button"'
  const dangerCls = danger ? ' danger' : ''
  return `
    <button class="hit sheet-option${dangerCls}" ${attrs}>
      <span class="sheet-ico"></span>
      <span class="grow">${label}</span>
      ${
        toggle
          ? `<span class="toggle ${on ? 'on' : ''}" aria-hidden="true"></span>`
          : `<span class="meta">›</span>`
      }
    </button>
  `
}

/** Map permission action objects → sheetOption HTML, with separators before manage/danger. */
export function sheetActions(actions = []) {
  let seenManage = false
  let seenDanger = false
  return actions
    .map((a) => {
      let sep = ''
      if ((a.section === 'manage' || a.section === 'danger') && !seenManage && !seenDanger) {
        if (a.section === 'manage') seenManage = true
        if (a.section === 'danger') seenDanger = true
        sep = `<div class="sheet-sep" aria-hidden="true"></div>`
      } else if (a.section === 'danger' && !seenDanger) {
        seenDanger = true
        sep = `<div class="sheet-sep" aria-hidden="true"></div>`
      } else if (a.section === 'manage' && !seenManage) {
        seenManage = true
        sep = `<div class="sheet-sep" aria-hidden="true"></div>`
      }
      return (
        sep +
        sheetOption(a.label, {
          go: a.go,
          sim: a.sim,
          toggle: a.toggle,
          on: a.on,
          danger: a.danger,
        })
      )
    })
    .join('')
}

function optionsButtonAttrs({
  contentId = null,
  menuType = 'publication',
  menuParent = null,
  participantId = null,
  optionsGo = null,
  section = null,
} = {}) {
  if (contentId || participantId) {
    const parts = [
      `data-open-menu="${menuType}"`,
      contentId ? `data-content-id="${contentId}"` : '',
      participantId ? `data-participant-id="${participantId}"` : '',
      menuParent ? `data-menu-parent="${menuParent}"` : '',
      section ? `data-section="${section}"` : '',
    ].filter(Boolean)
    return parts.join(' ')
  }
  if (optionsGo) return `data-go="${optionsGo}"`
  return 'type="button"'
}

export function postCard({
  author = 'Auteur…',
  role = 'Rôle…',
  body = 'Texte…',
  multi = false,
  media = null,
  time = 'il y a 2 h',
  identified = 0,
  optionsGo = null,
  contentId = null,
  menuType = 'publication',
  menuParent = null,
  likes,
  comments,
  shares,
  section = null,
} = {}) {
  const kind = media || (multi ? 'multi' : 'photo')
  let mediaBlock = ''
  if (kind === 'none' || kind === 'text') {
    mediaBlock = ''
  } else if (kind === 'multi') {
    mediaBlock = `<div class="photo-grid">${photo('Photo…')}${photo('Photo…')}${photo('Photo…')}${photo('+12')}</div>`
  } else if (kind === 'video') {
    mediaBlock = `<div class="slot-photo wide video-slot"><span>▶ Vidéo…</span></div>`
  } else {
    mediaBlock = photo('Photo…', 'wide')
  }
  const opts = optionsButtonAttrs({ contentId, menuType, menuParent, optionsGo, section })
  return `
    <article class="card post-card" ${contentId ? `data-content-id="${contentId}"` : ''}>
      <header class="post-head">
        <span class="avatar"></span>
        <div class="grow">
          <strong>${author}</strong>
          <div class="meta"><span class="role-pill">${role}</span> · ${time}</div>
        </div>
        <button class="hit icon-btn" ${opts} title="Options" aria-label="Options">⋯</button>
      </header>
      ${text(body)}
      <div class="post-meta-links">
        <button class="hit linkish" type="button">… Plus</button>
        <button class="hit linkish" type="button">🌐 Traduire</button>
      </div>
      ${
        identified
          ? `<button class="hit identified-row" type="button">${avatar(Math.min(identified, 4))}<span class="meta">${identified} identifiés</span></button>`
          : ''
      }
      ${mediaBlock}
      ${socialActions({ likes, comments, shares, contentId, section })}
    </article>
  `
}

/** Infos Feed post — all media variants (text / photo / multi / video) */
export function feedPostCard(opts = {}) {
  return postCard({
    menuParent: opts.menuParent || 'infos-feed',
    ...opts,
  })
}

/** Publication-style card (Présentation, Infos Mairie, etc.) */
export function publicationCard({
  title = 'Titre…',
  body = 'Texte…',
  multi = false,
  optionsGo = null,
  contentId = null,
  menuType = 'publication',
  menuParent = 'mairie-presentation',
  section = null,
} = {}) {
  const opts = optionsButtonAttrs({
    contentId,
    menuType,
    menuParent,
    optionsGo: optionsGo || (contentId ? null : 'mairie-presentation-options'),
    section,
  })
  return `
    <article class="card post-card publication-card" ${contentId ? `data-content-id="${contentId}"` : ''}>
      ${
        multi
          ? `<div class="photo-grid">${photo('Photo…')}${photo('Photo…')}${photo('Photo…')}${photo('+5')}</div>`
          : photo('Photo…', 'wide')
      }
      <div class="pub-title-row">
        <strong>${title}</strong>
        <button class="hit icon-btn" ${opts} title="Plus d’options" aria-label="Plus d’options">⋯</button>
      </div>
      ${text(body)}
      <button class="hit linkish" type="button">Plus</button>
      ${socialActions({ contentId, section })}
    </article>
  `
}

export function modalShell(title, body, footer = '', { center = false } = {}) {
  return `
    <div class="modal-layer${center ? ' confirm-modal' : ''}">
      <div class="modal-sheet${center ? ' center-card' : ''}">
        ${center ? '' : '<div class="modal-handle" aria-hidden="true"></div>'}
        <header class="modal-head">
          <strong>${title}</strong>
          <button class="hit icon-btn" data-back title="Fermer" aria-label="Fermer">✕</button>
        </header>
        <div class="modal-body">${body}</div>
        ${footer ? `<footer class="modal-foot">${footer}</footer>` : ''}
      </div>
    </div>
  `
}

export function tbd(label = 'À préciser') {
  return `<div class="tbd">${label}</div>`
}

export function emptyState(msg = 'Aucun contenu pour le moment') {
  return `<div class="empty">${msg}</div>`
}

export function loadingState(msg = 'Chargement…') {
  return `<div class="state-box loading"><div class="spinner"></div><p>${msg}</p></div>`
}

export function errorState(msg = 'Une erreur est survenue') {
  return `<div class="state-box error"><strong>Erreur</strong><p>${msg}</p>
    <button class="hit btn" data-back>Réessayer</button></div>`
}

/** Shared event list — dedicated Événements + Ma mairie Événements tab */
export function evenementsListeBody({
  events = [],
  detailsGo = 'evenement-details',
} = {}) {
  const list = events.length
    ? events
    : [
        {
          id: 'evt-atelier',
          title: 'Atelier créatif',
          when: 'JUIN 16',
          time: '15:30',
          countdown: '5 jours restants',
          lieu: 'Centre culturel · Kapan',
          tags: ['Artistique / Créatif', 'Payant'],
          limited: true,
        },
      ]
  return `
    <div class="events-toolbar">
      <div class="chips filter-chips">
        <button class="hit chip on" type="button">Populaires</button>
        <button class="hit chip" type="button">Près de moi ▾</button>
        <button class="hit chip" type="button">Bientôt</button>
        <button class="hit chip" type="button">Prix</button>
      </div>
      <div class="events-month">
        <strong class="period-label">Juin 2026 ▾</strong>
      </div>
      <div class="events-week-filter">
        <button class="hit chip on" type="button">Cette semaine ▾</button>
      </div>
      <div class="h-scroll dates" role="listbox" aria-label="Jours">
        ${[14, 15, 16, 17, 18, 19, 20]
          .map(
            (d) =>
              `<button class="hit cal-day ${d === 16 ? 'on' : ''}" type="button">${d}</button>`
          )
          .join('')}
      </div>
    </div>
    <div class="events-list">
      ${list
        .map((ev) => {
          const openAttr = ev.id
            ? `data-open-event="${ev.id}"`
            : `data-go="${detailsGo}"`
          const placesBadge = ev.limited
            ? `<span class="badge event-places">Places limitées</span>`
            : ''
          const when = (ev.when || '').trim()
          const whenParts = when.split(/\s+/)
          return `
        <article class="card event-card" data-event-id="${ev.id || ''}">
          <button class="hit event-card-hit" ${openAttr} type="button" aria-label="Voir ${ev.title}">
            <div class="event-photo-wrap">
              ${photo('Photo événement…', 'wide')}
              ${placesBadge}
            </div>
            <div class="event-card-body">
              <div class="event-date-block">
                <span class="meta">${whenParts[0] || ''}</span>
                <strong>${whenParts[1] || ''}</strong>
              </div>
              <div class="event-card-main">
                <strong class="event-title">${ev.title}</strong>
                <p class="meta event-when">${ev.time || ''}${ev.countdown ? ` · ${ev.countdown}` : ''}</p>
                <p class="meta event-lieu">📍 ${ev.lieu || ''}</p>
                <div class="chips event-tags">
                  ${(ev.tags || []).map((t) => `<span class="badge">${t}</span>`).join('')}
                </div>
              </div>
            </div>
          </button>
          <button class="hit btn primary block" ${openAttr}>Voir les détails</button>
        </article>`
        })
        .join('')}
    </div>
  `
}
