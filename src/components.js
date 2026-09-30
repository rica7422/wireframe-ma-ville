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
} = {}) {
  const backAttr = backTo ? `data-go="${backTo}"` : 'data-back'
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
          <button class="hit icon-btn" data-go="accueil-kapan" title="Accueil Ma Ville" aria-label="Accueil Ma Ville">
            <span class="ico-svg" aria-hidden="true">⌂</span>
          </button>
          <button class="hit icon-btn" data-sim="miasin" title="Accueil MIASIN (simulé)" aria-label="Accueil MIASIN">
            <span class="ico-svg ico-miasin" aria-hidden="true">◎</span>
          </button>
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
  likes = '200',
  comments = '15',
  shares = '200',
  reactGo = 'infos-reactions',
  commentGo = 'infos-commentaires',
  shareGo = 'infos-partage',
} = {}) {
  return `
    <div class="post-social">
      <span class="meta">${avatar(2)} Rupen D. et 32 autres</span>
    </div>
    <div class="post-actions">
      <button class="hit btn" data-go="${reactGo}">♡ J’aime · ${likes}</button>
      <button class="hit btn" data-go="${commentGo}">💬 Commentaire · ${comments}</button>
      <button class="hit btn" data-go="${shareGo}">↗ Partage · ${shares}</button>
    </div>
  `
}

export function sheetOption(label, { go, sim, toggle = false, on = false } = {}) {
  const attrs = go ? `data-go="${go}"` : sim ? `data-sim="${sim}"` : 'type="button"'
  return `
    <button class="hit sheet-option" ${attrs}>
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

export function postCard({
  author = 'Auteur…',
  role = 'Rôle…',
  body = 'Texte…',
  multi = false,
  optionsGo = null,
} = {}) {
  return `
    <article class="card post-card">
      <header class="post-head">
        <span class="avatar"></span>
        <div>
          <strong>${author}</strong>
          <div class="meta">${role} · il y a 2 h</div>
        </div>
        <button class="hit icon-btn" ${optionsGo ? `data-go="${optionsGo}"` : 'type="button"'}>⋯</button>
      </header>
      ${text(body)}
      ${
        multi
          ? `<div class="photo-grid">${photo('Photo…')}${photo('Photo…')}${photo('Photo…')}${photo('+N')}</div>`
          : photo('Photo…', 'wide')
      }
      ${socialActions()}
    </article>
  `
}

/** Publication-style card (Présentation, Infos Mairie, etc.) */
export function publicationCard({
  title = 'Titre…',
  body = 'Texte…',
  multi = false,
  optionsGo = 'mairie-presentation-options',
} = {}) {
  return `
    <article class="card post-card publication-card">
      ${
        multi
          ? `<div class="photo-grid">${photo('Photo…')}${photo('Photo…')}${photo('Photo…')}${photo('+5')}</div>`
          : photo('Photo…', 'wide')
      }
      <div class="pub-title-row">
        <strong>${title}</strong>
        <button class="hit icon-btn" data-go="${optionsGo}" title="Plus d’options" aria-label="Plus d’options">⋯</button>
      </div>
      ${text(body)}
      <button class="hit linkish" type="button">Plus</button>
      ${socialActions()}
    </article>
  `
}

export function modalShell(title, body, footer = '') {
  return `
    <div class="modal-layer">
      <div class="modal-sheet">
        <div class="modal-handle" aria-hidden="true"></div>
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

/** Shared event list block — Événements section + Ma mairie Événements */
export function evenementsListeBody({
  titles = ['Atelier Créatif de Kapan', 'Festival de Musique de Kapan', 'Randonnée Montagne Syunik'],
  detailsGo = 'evenement-details',
} = {}) {
  return `
    ${search('Rechercher un événement…')}
    ${chips(['Tous', 'Populaire', 'Près de moi', 'Les plus proches'])}
    <div class="row-link static">
      <strong>Juin 2026</strong>
      <div class="chips">
        <button class="hit chip" type="button">Toute période</button>
        <button class="hit chip on" type="button">Cette semaine</button>
      </div>
    </div>
    <div class="h-scroll dates">
      ${[22, 23, 24, 25, 26, 27, 28]
        .map(
          (d) =>
            `<button class="hit cal-day ${d === 26 ? 'on' : ''}" type="button">${d}</button>`
        )
        .join('')}
    </div>
    <h2 class="sec">Jeudi 26 Juin <span class="badge">${titles.length} événements</span></h2>
    ${titles
      .map(
        (title) => `
      <article class="card">
        ${photo('Photo événement…', 'wide')}
        <span class="badge">Catégorie…</span>
        <strong>${title}</strong>
        <p class="meta">16:30 – 18:30 · Lieu… · places restantes…</p>
        <button class="hit btn primary" data-go="${detailsGo}">Voir les détails</button>
      </article>`
      )
      .join('')}
  `
}
