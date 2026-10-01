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

/**
 * Permanent in-phone header — icons only:
 * Retour · (title/city) · Accueil Ma Ville · Accueil MIASIN (simulé)
 * No duplicate text « Retour ».
 */
export function phoneHeader({
  title = '',
  showBack = true,
  showCity = false,
  city = 'Kapan',
  backTo = null,
  extraRight = '',
  showHome = true,
  showMiasin = true,
} = {}) {
  // Always history-back; `backTo` kept for API compat but ignored on the button.
  const backAttr = 'data-back'
  return `
    ${statusBar()}
    <div class="phone-header">
      <div class="phone-header-row">
        ${
          showBack
            ? `<button class="hit icon-btn" ${backAttr} title="Retour" aria-label="Retour">
                <span class="ico-svg" aria-hidden="true">←</span>
              </button>`
            : `<span class="icon-btn ghost"></span>`
        }
        ${
          showCity
            ? `<button class="hit city-pill" data-go="ville-modale-choisir" title="Changer de ville">🇦🇲 ${city} ▾</button>`
            : `<div class="phone-title">${title}</div>`
        }
        <div class="header-right">
          ${extraRight}
          ${
            showHome
              ? `<button class="hit icon-btn" data-go="accueil-kapan" title="Accueil Ma Ville" aria-label="Accueil Ma Ville">
                <span class="ico-svg" aria-hidden="true">⌂</span>
              </button>`
              : ''
          }
          ${
            showMiasin
              ? `<button class="hit icon-btn" data-sim="miasin" title="Accueil MIASIN (simulé)" aria-label="Accueil MIASIN">
                <span class="ico-svg ico-miasin" aria-hidden="true">◎</span>
              </button>`
              : ''
          }
        </div>
      </div>
    </div>
  `
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
} = {}) {
  const commentAttrs = contentId
    ? `data-open-comments="${contentId}"`
    : `data-go="${commentGo}"`
  const reactAttrs = contentId
    ? `data-open-reactions="${contentId}"`
    : `data-go="${reactGo}"`
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
      <button class="hit btn" data-go="${shareGo}">↗ ${shares}</button>
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
} = {}) {
  if (contentId || participantId) {
    const parts = [
      `data-open-menu="${menuType}"`,
      contentId ? `data-content-id="${contentId}"` : '',
      participantId ? `data-participant-id="${participantId}"` : '',
      menuParent ? `data-menu-parent="${menuParent}"` : '',
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
  const opts = optionsButtonAttrs({ contentId, menuType, menuParent, optionsGo })
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
      ${socialActions({ likes, comments, shares, contentId })}
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
} = {}) {
  const opts = optionsButtonAttrs({
    contentId,
    menuType,
    menuParent,
    optionsGo: optionsGo || (contentId ? null : 'mairie-presentation-options'),
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
      ${socialActions({ contentId })}
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
  events = [
    {
      title: 'Atelier Créatif',
      when: 'JUIN 26',
      time: '15:30',
      countdown: '12 jours restants',
      lieu: 'Centre culturel · Kapan',
      tags: ['Artistique / Créatif', 'Gratuit'],
    },
    {
      title: 'Soirée dansante',
      when: 'JUIN 28',
      time: '20:00',
      countdown: '14 jours restants',
      lieu: 'Salle municipale · Kapan',
      tags: ['Social / Lifestyle', 'Gratuit'],
    },
    {
      title: 'Conseil municipal (public)',
      when: 'JUIL 02',
      time: '18:30',
      countdown: '18 jours restants',
      lieu: 'Hôtel de ville · Kapan',
      tags: ['Institutionnel', 'Gratuit'],
    },
  ],
  detailsGo = 'evenement-details',
} = {}) {
  return `
    <div class="events-toolbar">
      <div class="chips filter-chips">
        <button class="hit chip on" type="button">Populaires</button>
        <button class="hit chip" type="button">Près de moi ▾</button>
        <button class="hit chip" type="button">Bientôt</button>
        <button class="hit chip" type="button">Prix du ticket</button>
      </div>
      <div class="events-month">
        <strong class="period-label">Avril 2026 ▾</strong>
      </div>
      <div class="events-week-filter">
        <button class="hit chip on" type="button">Cette semaine ▾</button>
      </div>
      <div class="h-scroll dates" role="listbox" aria-label="Jours">
        ${[21, 22, 23, 24, 25, 26, 27]
          .map(
            (d) =>
              `<button class="hit cal-day ${d === 26 ? 'on' : ''}" type="button">${d}</button>`
          )
          .join('')}
      </div>
    </div>
    <div class="events-list">
      ${events
        .map(
          (ev) => `
        <article class="card event-card">
          <button class="hit event-card-hit" data-go="${detailsGo}" type="button" aria-label="Voir ${ev.title}">
            <div class="event-photo-wrap">
              ${photo('Photo événement…', 'wide')}
              <span class="badge event-places">Places limitées</span>
            </div>
            <div class="event-card-body">
              <div class="event-date-block">
                <span class="meta">${ev.when.split(' ')[0]}</span>
                <strong>${ev.when.split(' ')[1] || ''}</strong>
              </div>
              <div class="event-card-main">
                <strong class="event-title">${ev.title}</strong>
                <p class="meta event-when">${ev.time} · ${ev.countdown}</p>
                <p class="meta event-lieu">📍 ${ev.lieu}</p>
                <div class="chips event-tags">
                  ${(ev.tags || []).map((t) => `<span class="badge">${t}</span>`).join('')}
                </div>
              </div>
            </div>
          </button>
          <button class="hit btn primary block" data-go="${detailsGo}">Voir les détails</button>
        </article>`
        )
        .join('')}
    </div>
  `
}
