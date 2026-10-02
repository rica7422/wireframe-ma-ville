import {
  photo,
  text,
  avatar,
  phoneHeader,
  phoneFooter,
  chips,
  search,
  listCard,
  postCard,
  feedPostCard,
  publicationCard,
  infoFeedCard,
  socialActions,
  sheetOption,
  sheetActions,
  modalShell,
  evenementsListeBody,
  tbd,
  emptyState,
  loadingState,
  errorState,
} from './components.js'
import { colorFor } from './theme.js'
import { isAdminRole } from './role.js'
import { getMenuContext, setMenuContext } from './menu-context.js'
import {
  publicationMenuActions,
  directoryMenuActions,
  eventMenuActions,
  participantMenuActions,
  annonceMenuActions,
  offreMenuActions,
  eventInscriptionUi,
  isHidden,
} from './permissions.js'
import {
  getPublication,
  getDirectory,
  getEvent,
  getParticipant,
  SIM_VIEWER_ID,
} from './demo-data.js'
import { getCommentContext, getReactContext } from './content-context.js'
import {
  SIGNAL_CATEGORIES,
  listSignalementsForViewer,
  getSignalement,
  getOpenSignalId,
  getSignalFilter,
  lastMessage,
  readLabel,
  replyLabel,
  isNewMairieReply,
  isUnreadForMairie,
  openAsMairie,
  openAsHabitant,
  hasMairieReply,
} from './signalements-data.js'
import {
  getEvent as getEventFull,
  getFormEvent,
  listPublicEvents,
  listMyParticipations,
  listMyCreations,
  listPendingValidation,
  listAdminManaged,
  placesLabel,
  isLimited,
  getEditEventId,
  getOpenEventId,
  getListTab,
  getMesSub,
  getFormStep,
  publicationLabel,
  revisionLabel,
} from './events-data.js'
import {
  listModCases,
  getModCase,
  getOpenModCaseId,
  getModFilter,
  typeLabel as modTypeLabel,
  decisionLabel as modDecisionLabel,
} from './moderation-data.js'
import {
  listMotifs,
  getMotif,
  listBookings,
  listUserBookings,
  listIndispos,
  getDispoSlots,
  getRdvPick,
  getEditMotifId,
  getAdminRdvTab,
  getDispoEditWeekday,
  statusLabel as rdvStatusLabel,
  slotsForMayDay,
  weekdayForMay2026,
} from './rdv-data.js'
import {
  ANN_RUBRIQUES,
  getRubrique,
  getFiche,
  getFicheContext,
  getAnnuaireRubriqueId,
  getOpenDirFicheId,
  listRowsForRubrique,
  ensureDemoFiche,
  listPharmacieFiches,
  listAdminPubs,
  getAdminPub,
  getPubEditId,
  pubStateLabel,
} from './annuaire-data.js'
import {
  EMPLOI_CATEGORIES,
  EMPLOI_SECTORS,
  EMPLOI_CONTRACTS,
  EMPLOI_TIMES,
  EMPLOI_MODES,
  listPublicOffres,
  listAdminOffres,
  listSimilarOffres,
  getOffre,
  getOpenOffreId,
  setOpenOffreId,
  getEditOffreId,
  getEmploiFormStep,
  getEmploiCategory,
  setEmploiCategory,
  getEmploiSearch,
  getEmploiQuick,
  getEmploiFilters,
  getAdminOffreTab,
  countActiveFilters,
  categoryLabel,
  modeLabel,
  stateLabel,
  formatSalary,
  formatPubDate,
  mailtoForOffre,
} from './emplois-data.js'
import {
  listRencontres,
  listDrafts,
  getRencontre,
  getOpenRencontreId,
  getRencTab,
  getRencFilter,
  getRencTemp,
  getRencSearch,
  getDraft,
  RENC_CONTACTS,
  formatWhen,
  placeLabel,
  connectionHint,
  responseLabel,
  collectiveSummary,
  isOrganizer,
  myGuest,
  temporalBucket,
  getRencViewer,
} from './rencontres-data.js'
import {
  listConversations,
  getConversation,
  getOpenConversationId,
  getMsgTab,
  setMsgTab,
  getMsgSearch,
  unreadCount,
  lastVisibleMessage,
  formatMsgTime,
  getReplyTo,
  getEditMsgId,
  getPendingAttach,
  getMessage,
  MSG_CONTACTS,
  getMsgViewerId,
} from './messages-data.js'
import {
  listCommunautes,
  feedPosts,
  getCommunaute,
  getOpenCommunauteId,
  getCommunauteKindTab,
  getCommunauteSearch,
  getCommunauteFilter,
  getCommunautePageView,
  getCreateDraft,
  getRolePick,
  accessLabel,
  myStateLabel,
  kindLabel,
  mesTabLabel,
  canPublish,
  canInvite,
  isCommunauteAdmin,
  isCommunauteModo,
  COMM_CATEGORIES,
  roleHolders,
  memberDisplay,
  privacyLabel,
  getViewerId,
} from './communautes-data.js'

/** Screen registry: id → { title, group, render(state) } */

function wrap(body, { header, footer, overlay = '' } = {}) {
  return `
    <div class="phone-screen">
      ${header || ''}
      <div class="phone-scroll">${body}</div>
      ${footer || ''}
      ${overlay}
    </div>
  `
}

/* ——— Entrée ——— */

function bienvenue() {
  return wrap(
    `
    <section class="hero-block">
      ${photo('Photo couverture…', 'hero')}
      <div class="hero-caption">
        <div class="brand-line">ma ville</div>
        <h1>Bienvenue</h1>
        ${text('Explorez votre ville…')}
      </div>
    </section>
    ${search('Trouver une ville…')}
    <h2 class="sec">Villes populaires</h2>
    <div class="h-scroll">
      ${['Erevan', 'Gyumri', 'Dilijan'].map((c) => `
        <button class="hit city-card" data-go="ville-modale-confirmer">
          ${photo('Photo…')}
          <span>${c}</span>
        </button>`).join('')}
    </div>
    <h2 class="sec">Villes récemment entrées</h2>
    ${['Kapan, Arménie', 'Sisian, Arménie'].map((c) => `
      <button class="hit row-link" data-go="ville-modale-confirmer">
        <span class="flag">🇦🇲</span>
        <span>${c}</span>
        <span>›</span>
      </button>`).join('')}
    <h2 class="sec">Villes choisies</h2>
    <div class="row-link static">
      <span class="flag">🇦🇲</span>
      <span>Kapan, Arménie</span>
      <button class="hit btn primary" data-go="ville-modale-confirmer">Rejoindre</button>
    </div>
    <h2 class="sec">Toutes les villes</h2>
    ${['Erevan', 'Gyumri', 'Vanadzor', 'Kapan'].map((c) => `
      <div class="row-link static">
        <span class="flag">🇦🇲</span>
        <span>${c}, Arménie</span>
        <button class="hit btn" data-go="ville-modale-confirmer">+</button>
      </div>`).join('')}
    `,
    {
      header: phoneHeader({
        title: 'Choisir une ville',
        showBack: true,
        backTo: null,
      }),
    }
  )
}

function modaleChoisir() {
  return wrap(
    `
    ${photo('Fond accueil (atténué)…', 'dim')}
    `,
    {
      header: phoneHeader({ title: 'Accueil', chrome: 'panel' }),
      footer: '',
      overlay: modalShell(
        'Choisir une ville',
        `
        ${search('Rechercher une ville…')}
        <button class="hit row-link" data-go="ville-modale-confirmer">
          <span class="flag">🇦🇲</span>
          <span>Kapan, Arménie</span>
          <span class="badge">Active</span>
        </button>
        ${['Erevan', 'Gyumri', 'Dilijan'].map((c) => `
          <button class="hit row-link" data-go="ville-modale-confirmer">
            <span class="flag">🇦🇲</span>
            <span>${c}, Arménie</span>
            <span>›</span>
          </button>`).join('')}
        `,
        `<button class="hit btn primary block" data-go="ville-bienvenue">Découvrir d’autres villes</button>`
      ),
    }
  )
}

function modaleConfirmer() {
  return wrap(
    `${photo('Fond…', 'dim')}`,
    {
      header: phoneHeader({ title: 'Confirmer', chrome: 'panel' }),
      footer: '',
      overlay: modalShell(
        'Confirmer la ville',
        `
        <div class="confirm-city">
          ${photo('Photo ville…', 'roundish')}
          <strong>Kapan, Arménie</strong>
          ${text('Description courte de la ville…')}
        </div>
        `,
        `
        <button class="hit btn block" data-back>Annuler</button>
        <button class="hit btn primary block" data-go="accueil-kapan">Confirmer ce choix</button>
        `
      ),
    }
  )
}

function accueilKapan() {
  const rapide = [
    { label: 'Ma mairie', go: 'mairie-accueil', section: 'mairie' },
    { label: 'Infos citoyen', go: 'infos-feed', section: 'infos' },
    { label: 'Événements', go: 'evenements-liste', section: 'evenements' },
    { label: 'Petites annonces', go: 'annonces-liste', section: 'annonces' },
    { label: 'Offres d’emploi', go: 'emplois-liste', section: 'emplois' },
  ]
  const communautes = [
    { label: 'Groupes', go: 'communautes-groupes', section: 'groupes' },
    { label: 'Clubs', go: 'communautes-clubs', section: 'clubs' },
    { label: 'Mes rencontres', go: 'communautes-rencontres', section: 'rencontres' },
  ]
  const vieLocale = [
    { label: 'Éducation', go: 'dir-education', section: 'education' },
    { label: 'Économie', go: 'dir-economie', section: 'economie' },
    { label: 'Cinéma & Théâtres', go: 'dir-cinemas', section: 'cinemas' },
    { label: 'Patrimoine', go: 'dir-patrimoine', section: 'patrimoine' },
    { label: 'Aide sociale', go: 'dir-aide-sociale', section: 'aide' },
    { label: 'Associations', go: 'dir-associations', section: 'associations' },
    { label: 'Banques & Assurances', go: 'dir-banques', section: 'banques' },
    { label: 'Restaurants', go: 'dir-restaurants', section: 'restaurants' },
    { label: 'Transports', go: 'dir-transports', section: 'transports' },
    { label: 'Bibliothèque', go: 'dir-bibliotheques', section: 'bibliotheques' },
    { label: 'Permanences', go: 'dir-permanences', section: 'permanences' },
    { label: 'Santé', go: 'sante-accueil', section: 'sante' },
    { label: 'Sécurité', go: 'dir-securite', section: 'securite' },
    { label: 'Tourisme', go: 'dir-tourisme', section: 'tourisme' },
    { label: 'Météo', go: 'page-meteo', section: 'meteo' },
  ]
  const hex = (s) => colorFor(s)

  return wrap(
    `
    <section class="hero-block">
      ${photo('Photo couverture Kapan…', 'hero')}
      <div class="overlay-badges">
        <span class="badge" style="--accent:#CA8A04;border-color:#CA8A04;color:#CA8A04;background:color-mix(in srgb,#CA8A04 12%,#fff)">22°C Ensoleillé</span>
      </div>
      <div class="hero-caption">
        <div class="identity-row">
          <div class="identity-main">
            <h1>Kapan — Arménie</h1>
          </div>
          <button class="hit icon-btn" data-go="ville-modale-choisir" title="Options ville" aria-label="Options ville">⋯</button>
        </div>
        ${text('Courte présentation de la ville…')}
      </div>
    </section>
    <div class="members-row">
      <div class="avatars">${avatar(4)}</div>
      <span>Rejoignez 300+ membres</span>
      <button class="hit btn primary" data-sim="inviter">Inviter</button>
    </div>
    <h2 class="sec">Accès rapides</h2>
    <div class="grid-2">
      ${rapide
        .map(
          (it) => `
        <button class="hit tile" data-go="${it.go}" style="--section:${hex(it.section)}">
          ${photo('Photo…')}
          <span style="color:${hex(it.section)}">${it.label}</span>
        </button>`
        )
        .join('')}
    </div>
    <h2 class="sec">Communautés</h2>
    ${communautes
      .map(
        (it) => `
      <button class="hit row-link" data-go="${it.go}">
        <span class="ico-box" style="--section:${hex(it.section)}"></span>
        <span><strong style="color:${hex(it.section)}">${it.label}</strong><br/><span class="meta">Texte…</span></span>
        <span>›</span>
      </button>`
      )
      .join('')}
    <h2 class="sec">Vie locale à Kapan</h2>
    <div class="grid-3">
      ${vieLocale
        .map(
          (it) => `
        <button class="hit icon-tile" data-go="${it.go}" style="--section:${hex(it.section)}">
          <span class="ico-box" style="--section:${hex(it.section)}"></span>
          <span>${it.label}</span>
        </button>`
        )
        .join('')}
    </div>
    <section class="urgence-box">
      <h2 class="sec">Contacts d’urgence</h2>
      <button class="hit row-link" data-go="urgence-numeros">
        <span>N° Urgence</span><span>›</span>
      </button>
      <button class="hit btn block" data-sim="appeler:103">Hôpital · 103 — Appeler</button>
      <button class="hit btn block" data-sim="appeler:102">Police · 102 — Appeler</button>
    </section>
    `,
    {
      header: phoneHeader({ title: 'Accueil', showBack: false }),
      footer: phoneFooter('accueil'),
    }
  )
}

/* ——— Santé ——— */

function santeAccueil() {
  return rubriqueAccueil({
    title: 'Santé',
    bannerTitle: 'Votre santé, notre priorité',
    bannerText: 'Des services de santé proches de vous',
    searchPh: 'Rechercher un service de santé…',
    filters: ['Tous', 'Hôpitaux', 'Pharmacies', 'Ouverts'],
    cats: [
      { label: 'Urgences', go: 'sante-urgences' },
      { label: 'Pharmacies', go: 'sante-pharmacies' },
      { label: 'Hôpitaux', go: 'sante-hopitaux' },
      { label: 'Ambulance', go: 'sante-ambulances' },
    ],
    around: [
      {
        title: 'Centre médical de Kapan',
        meta: 'Hôpitaux · 0,8 km',
        badge: 'Ouvert',
        go: 'sante-hopital-details',
        ficheGo: 'sante-hopital-details',
        openFiche: 'dir-hopital-grand',
      },
      {
        title: 'Pharmacie centrale',
        meta: 'Pharmacies · 1,2 km',
        badge: 'Ouvert',
        go: 'sante-pharmacie-infos',
        ficheGo: 'sante-pharmacie-infos',
        openFiche: 'dir-pharmacie-centrale',
      },
      {
        title: 'SAMU Kapan',
        meta: 'Ambulance · …',
        badge: 'Disponible',
        go: 'sante-ambulances',
        ficheGo: 'sante-ambulances',
      },
    ],
    useful: [
      { label: 'Pharmacie de garde aujourd’hui', meta: 'Voir la pharmacie de garde…', go: 'sante-pharmacies' },
      { label: 'Permanence médicale Week-end', meta: 'Texte…', go: 'sante-urgences' },
    ],
  })
}

function santeUrgences() {
  return wrap(
    `
    <div class="alert-box">
      <strong>En cas d’urgence vitale</strong>
      ${text('Appelez immédiatement l’un des numéros d’urgence…')}
    </div>
    ${[
      ['Urgences (Européen)', '112'],
      ['Ambulance SAMU', '103'],
      ['Sapeurs-Pompiers', '101'],
    ]
      .map(
        ([label, num]) => `
      <article class="card">
        <strong>${label}</strong>
        <div class="big-num">${num}</div>
        <button class="hit btn primary block" data-sim="appeler:${num}">Appeler le ${num}</button>
      </article>`
      )
      .join('')}
    <div class="card">
      <strong>Partager ma position</strong>
      ${tbd('Géolocalisation — À préciser')}
      <button class="hit btn block" data-sim="position">Partager (simulé)</button>
    </div>
    `,
    {
      header: phoneHeader({ title: 'Urgences', backTo: 'sante-accueil' }),
      footer: phoneFooter('menu'),
    }
  )
}

function santePharmacies() {
  const rows = [
    {
      id: 'dir-pharmacie-centrale',
      title: 'Pharmacie centrale',
      meta: 'Rue Principale · 1,2 km',
      badge: 'En garde 24h/24',
    },
    {
      id: 'dir-pharmacie-parc',
      title: 'Pharmacie du Parc',
      meta: 'Avenue Verte · 2,1 km',
      badge: 'Ouvert',
    },
  ]
  return wrap(
    `
    ${search('Rechercher une pharmacie…')}
    ${chips(['Toutes', 'Ouvertes', 'En garde', 'À proximité'])}
    ${rows
      .map((row) =>
        listCard({
          title: row.title,
          meta: row.meta,
          badge: row.badge,
          actions: [
            { label: 'Détails', go: 'sante-pharmacie-infos', openFiche: row.id, primary: true },
            { label: 'Appeler', sim: 'appeler' },
          ],
        })
      )
      .join('')}
    `,
    {
      header: phoneHeader({ title: 'Pharmacies', backTo: 'sante-accueil' }),
      footer: phoneFooter('menu'),
    }
  )
}

function dirUnavailable(title = 'Cette fiche n’est plus disponible') {
  return wrap(
    `
    <div class="menu-unavailable">
      <strong>${title}</strong>
      <p class="meta">La fiche n’est pas publiée ou a été retirée. Accessible uniquement à l’équipe.</p>
      <button class="hit btn primary" data-go="sante-pharmacies" type="button">Retour aux pharmacies</button>
    </div>
    `,
    {
      header: phoneHeader({ title: 'Fiche', backTo: 'sante-pharmacies' }),
      footer: phoneFooter('menu'),
    }
  )
}

function pharmacieDetails(tab = 'infos', contentId = null) {
  const id = contentId || getOpenDirFicheId() || 'dir-pharmacie-centrale'
  const dir = getDirectory(id)
  const fiche = getFiche(id)
  if (!fiche && !dir) {
    return dirUnavailable('Cette pharmacie n’est plus disponible')
  }
  if (dir && dir.state !== 'published' && !isAdminRole()) {
    return dirUnavailable()
  }
  const hasPhone = fiche?.hasPhone ?? dir?.phone
  const hasPlace = fiche?.hasPlace ?? dir?.place
  const tabs = `
    <div class="tabs">
      <button class="hit tab ${tab === 'infos' ? 'on' : ''}" data-go="sante-pharmacie-infos">Informations</button>
      <button class="hit tab ${tab === 'horaires' ? 'on' : ''}" data-go="sante-pharmacie-horaires">Horaires</button>
    </div>`
  const infos = `
    <h2 class="sec">Contact</h2>
    <p class="meta">${fiche?.phone ? `Tél. ${fiche.phone}` : 'Pas de téléphone'}${fiche?.address ? ` · ${fiche.address}` : ''}</p>
    <h2 class="sec">Adresse</h2>
    ${text(fiche?.address || 'Adresse non renseignée')}
    ${photo('Carte (emplacement)…', 'map')}
    <h2 class="sec">À propos</h2>
    ${text(fiche?.description || 'Description non renseignée')}
  `
  const horaires = `
    <h2 class="sec">Horaires</h2>
    <p class="meta">${fiche?.hours || 'Horaires à préciser'}</p>
    ${['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']
      .map(
        (d) => `
      <div class="row-link static">
        <span>${d}</span>
        <span class="meta">${d === 'Dimanche' ? 'Fermé / À préciser' : fiche?.hours || '08:00 – 20:00'}</span>
      </div>`
      )
      .join('')}
  `
  const adminEdit = isAdminRole()
    ? `<button class="hit btn block outline admin-shortcut" data-sim="fiche-edit:${id}" type="button">Modifier cette fiche</button>`
    : ''
  const stateBadge =
    dir && dir.state !== 'published'
      ? `<span class="badge">${dir.state === 'draft' ? 'Brouillon' : 'Non publiée'}</span>`
      : `<span class="badge">${id === 'dir-pharmacie-centrale' ? 'Ouvert 24h/24' : 'Ouvert'}</span>`
  const actions = `
    <div class="row-actions">
      ${hasPlace ? `<button class="hit btn" data-sim="itineraire">Itinéraire</button>` : ''}
      ${hasPhone ? `<button class="hit btn primary" data-sim="appeler:${escapeAttr(fiche?.phone || '')}">Appeler</button>` : ''}
    </div>`
  return wrap(
    `
    ${photo('Photo façade…', 'hero')}
    <div class="detail-head">
      <div class="event-title-row">
        <strong>${fiche?.title || dir?.title || 'Pharmacie'}</strong>
        <button class="hit icon-btn" data-open-menu="directory" data-content-id="${id}" data-menu-parent="sante-pharmacie-infos" title="Plus d’options" aria-label="Plus d’options">⋯</button>
      </div>
      ${stateBadge}
      <p class="meta">Pharmacie · distance…</p>
    </div>
    ${actions}
    ${adminEdit}
    ${tabs}
    ${tab === 'infos' ? infos : horaires}
    `,
    {
      header: phoneHeader({
        title: 'Détails',
        backTo: 'sante-pharmacies',
      }),
      footer: phoneFooter('menu'),
    }
  )
}

function santeHopitaux() {
  const rows = [
    {
      id: 'dir-hopital-grand',
      title: 'Grand Hôpital de Kapan',
      meta: 'Urgences · 1,5 km',
      badge: 'Ouvert',
    },
    {
      id: 'dir-hopital-urgence24',
      title: 'Urgence 24 — Hôpital',
      meta: 'Urgences · 2,0 km',
      badge: '24h/24',
    },
  ]
  return wrap(
    `
    ${search('Rechercher un hôpital…')}
    ${chips(['Toutes', 'Ouvertes', 'Urgences', 'À proximité'])}
    ${rows
      .map((row) =>
        listCard({
          title: row.title,
          meta: row.meta,
          badge: row.badge,
          actions: [
            { label: 'Détails', go: 'sante-hopital-details', openFiche: row.id, primary: true },
            { label: 'Appeler', sim: 'appeler' },
          ],
        })
      )
      .join('')}
    `,
    {
      header: phoneHeader({ title: 'Hôpitaux', backTo: 'sante-accueil' }),
      footer: phoneFooter('menu'),
    }
  )
}

function santeHopitalDetails(tab = 'infos') {
  const id = getOpenDirFicheId() || 'dir-hopital-grand'
  const fiche = getFiche(id) || getFiche('dir-hopital-grand')
  const tabs = `
    <div class="tabs">
      <button class="hit tab ${tab === 'infos' ? 'on' : ''}" data-go="sante-hopital-details">Informations</button>
      <button class="hit tab ${tab === 'horaires' ? 'on' : ''}" data-go="sante-hopital-horaires">Horaires</button>
    </div>`
  const infos = `
    <h2 class="sec">Contact</h2>
    <p class="meta">${fiche?.phone ? `Tél. urgences · ${fiche.phone}` : 'Tél. standard · À préciser'}</p>
    <h2 class="sec">Adresse</h2>
    <p>${fiche?.address || 'Adresse à préciser'}</p>
    <p class="meta">${fiche?.hasPlace ? '' : 'Adresse complète non publiée — itinéraire indisponible'}</p>
    ${photo('Plan de situation…', 'map')}
    <h2 class="sec">À propos</h2>
    <p>${fiche?.description || 'Établissement hospitalier.'}</p>
  `
  const horaires = `
    <h2 class="sec">Horaires</h2>
    <p class="meta">${fiche?.hours || 'Horaires à confirmer'}</p>
    ${['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']
      .map(
        (d) => `
      <div class="row-link static">
        <span>${d}</span>
        <span class="meta">${d === 'Dimanche' ? 'Urgences seulement' : 'Accueil · horaires à confirmer'}</span>
      </div>`
      )
      .join('')}
    <div class="notice"><strong>Horaires manquants</strong><p class="meta">Les plages exactes d’accueil ne sont pas encore publiées.</p></div>
    <button class="hit btn block" data-go="etat-horaires-manquants">Voir état « horaires manquants »</button>
  `
  return wrap(
    `
    ${photo('Photo hôpital…', 'hero')}
    <div class="detail-head">
      <strong>${fiche?.title || 'Hôpital'}</strong>
      <span class="badge">Ouvert</span>
      <p class="meta">Hôpital · distance…</p>
    </div>
    <div class="row-actions">
      <button class="hit btn primary" data-sim="appeler:${escapeAttr(fiche?.phone || '103')}" type="button">Appeler urgences</button>
    </div>
    ${tabs}
    ${tab === 'infos' ? infos : horaires}
    `,
    {
      header: phoneHeader({ title: 'Détails', backTo: 'sante-hopitaux' }),
      footer: phoneFooter('menu'),
    }
  )
}

function santeAmbulances() {
  return wrap(
    `
    <div class="banner-box">
      ${photo('Illustration ambulance…')}
      <strong>Besoin d’une ambulance ?</strong>
      <button class="hit btn primary block" data-sim="appeler:103">Appeler le 103</button>
    </div>
    ${listCard({
      title: 'SAMU KAPAN',
      meta: 'Service d’urgence · 24h/24',
      badge: 'Disponible',
      actions: [{ label: 'Appeler', sim: 'appeler', primary: true }],
    })}
    ${listCard({
      title: 'Ambulance Croix Rouge',
      meta: 'Transport sanitaire',
      badge: 'À préciser',
      actions: [{ label: 'Appeler', sim: 'appeler', primary: true }],
    })}
    <div class="alert-box">${text('Rappel : en urgence vitale, composer le 103 / 112…')}</div>
    `,
    {
      header: phoneHeader({ title: 'Ambulances', backTo: 'sante-accueil' }),
      footer: phoneFooter('menu'),
    }
  )
}

/* ——— Ma mairie ——— */

function lifecycleBar(active = 'brouillon') {
  const steps = [
    { id: 'brouillon', label: 'Brouillon' },
    { id: 'preview', label: 'Prévisualiser' },
    { id: 'publier', label: 'Publier' },
  ]
  return `
    <div class="lifecycle-bar" aria-label="Cycle de vie">
      ${steps
        .map(
          (s) =>
            `<span class="chip ${active === s.id ? 'on' : ''}">${s.label}</span>`
        )
        .join('')}
    </div>
  `
}

function mairieAdminGerShortcut() {
  if (!isAdminRole()) return ''
  return `<button class="hit btn block outline admin-shortcut" data-go="mairie-gerer-page" type="button">Gérer la page</button>`
}

function mairieShellTop() {
  return `
    ${photo('Photo de la mairie…', 'hero')}
    <div class="overlay-badges"><span class="badge">☀ 14° / 4°</span></div>
    <div class="detail-head">
      <div class="identity-row">
        <div class="identity-main">
          <strong>Kapan — Arménie</strong>
        </div>
        <button class="hit icon-btn" data-go="mairie-menu" title="Menu Ma mairie" aria-label="Menu Ma mairie">⋯</button>
      </div>
      ${text('Présentation courte de la mairie…')}
    </div>
    <div class="members-row">
      <button class="hit members-hit" data-go="mairie-apropos-communaute" type="button">
        <div class="avatars">${avatar(3)}</div>
        <span>3649 membres</span>
      </button>
      <button class="hit btn" data-sim="inviter">+ Inviter</button>
    </div>
  `
}

function mairieAccesGrid() {
  /* Same sous-catégorie cards as Vie locale / Santé (rubriqueAccueil) */
  return sousCatGrid([
    { label: 'Présentation de la ville', go: 'mairie-presentation' },
    { label: 'Maire & Conseil municipal', go: 'mairie-conseil' },
    { label: 'Infos Mairie', go: 'mairie-infos' },
    { label: 'Plan de la ville', go: 'mairie-plan' },
  ])
}

function mairieTabs(active = 'publications') {
  return `
    <div class="tabs">
      <button class="hit tab ${active === 'publications' ? 'on' : ''}" data-go="mairie-accueil">Publications</button>
      <button class="hit tab ${active === 'evenements' ? 'on' : ''}" data-go="mairie-accueil-evenements">Événements</button>
    </div>
  `
}

function mairieHeader(title = 'Ma mairie') {
  return phoneHeader({
    title,
    chrome: 'full',
  })
}

function mairieComposer() {
  return `
    <div class="compose-card">
      <div class="compose">
        <span class="avatar"></span>
        <button class="hit compose-input" data-go="mairie-nouvelle-publication" type="button">Commencer une publication</button>
      </div>
      <div class="row-actions compose-media">
        <button class="hit btn" data-go="mairie-nouvelle-publication" type="button">▶ Vidéo</button>
        <button class="hit btn" data-go="mairie-medias-sheet" type="button">🖼 Photo</button>
      </div>
    </div>
  `
}

function mairieSearchHit() {
  return `<button class="hit search search-hit" data-go="mairie-recherche" type="button"><span class="search-ico">⌕</span><span class="compose-input">Effectuer une recherche…</span></button>`
}

function mairieServicesCitoyens() {
  /* Citizen services row — RDV + Signalements (not a 5th sous-cat card) */
  return `
    <div class="mairie-services">
      <button class="hit btn primary block" data-go="mairie-rdv" type="button">Prendre rendez-vous</button>
      <button class="hit btn primary block" data-go="signalements" type="button">Signalements</button>
    </div>`
}

function mairieAccueil() {
  const admin = isAdminRole()
  return wrap(
    `
    ${mairieShellTop()}
    ${mairieSearchHit()}
    ${mairieAccesGrid()}
    ${mairieServicesCitoyens()}
    ${mairieAdminGerShortcut()}
    ${mairieTabs('publications')}
    ${admin ? mairieComposer() : ''}
    ${postCard({
      author: 'Mairie de Kapan',
      role: 'Publication',
      body: 'Informations et actualités de votre mairie.',
      contentId: 'pub-mairie-1',
      menuParent: 'mairie-accueil',
      section: 'mairie',
    })}
    ${postCard({
      author: 'Mairie de Kapan',
      role: 'Publication',
      body: 'Rappel — démarches en mairie et horaires d’accueil.',
      multi: true,
      contentId: 'pub-mairie-2',
      menuParent: 'mairie-accueil',
      section: 'mairie',
    })}
    `,
    {
      header: mairieHeader(),
      footer: phoneFooter('mairie'),
    }
  )
}

function mairieAccueilEvenements() {
  return wrap(
    `
    ${mairieShellTop()}
    ${mairieSearchHit()}
    ${mairieAccesGrid()}
    ${mairieServicesCitoyens()}
    ${mairieAdminGerShortcut()}
    ${mairieTabs('evenements')}
    ${evenementsListeBody({ events: listPublicEvents().map(mapEventCard) })}
    `,
    {
      header: mairieHeader(),
      footer: phoneFooter('mairie'),
    }
  )
}

function mairieRecherche() {
  return wrap(
    `
    ${search('Effectuer une recherche…')}
    <h2 class="sec">Résultats exemples</h2>
    <button class="hit row-link" data-go="mairie-presentation" type="button">
      <span class="ico-box"></span>
      <span><strong>Publication · Horaires d’accueil</strong><br/><span class="meta">Publications</span></span>
      <span>›</span>
    </button>
    <button class="hit row-link" data-go="evenement-details" type="button">
      <span class="ico-box"></span>
      <span><strong>Atelier créatif</strong><br/><span class="meta">Événements · 16 juin</span></span>
      <span>›</span>
    </button>
    <button class="hit row-link" data-go="mairie-plan" type="button">
      <span class="ico-box"></span>
      <span><strong>Hôtel de ville</strong><br/><span class="meta">Lieux · Plan de la ville</span></span>
      <span>›</span>
    </button>
    <button class="hit row-link" data-go="mairie-conseil" type="button">
      <span class="ico-box"></span>
      <span><strong>Maire & Conseil municipal</strong><br/><span class="meta">Services</span></span>
      <span>›</span>
    </button>
    <button class="hit row-link" data-go="mairie-rdv" type="button">
      <span class="ico-box"></span>
      <span><strong>Prendre rendez-vous</strong><br/><span class="meta">Démarches</span></span>
      <span>›</span>
    </button>
    `,
    {
      header: phoneHeader({ title: 'Recherche', backTo: 'mairie-accueil' }),
      footer: phoneFooter('mairie'),
    }
  )
}

function mairieMenu() {
  const admin = isAdminRole()
  return wrap(`${photo('Fond Ma mairie…', 'dim')}`, {
    header: phoneHeader({ title: 'Menu Ma mairie', chrome: 'panel', closeIcon: true }),
    footer: '',
    overlay: modalShell(
      'Menu de Ma Mairie',
      `
      ${sheetOption('Partager Ma Mairie', { sim: 'partage' })}
      ${sheetOption('Notification de Ma Mairie', { toggle: true, on: true })}
      ${sheetOption('Discussions', { go: 'messages' })}
      ${admin ? sheetOption('Gérer la page', { go: 'mairie-gerer-page' }) : ''}
      ${sheetOption('Quitter Ma Mairie', { sim: 'quitter' })}
      `
    ),
  })
}

const MAIRIE_MOTIFS = [] // replaced by rdv-data listMotifs

function mairieRdvEnCoursBlock(bookings) {
  if (!bookings?.length) return ''
  return `
    <section class="rdv-section">
      <h2 class="sec">Rendez-vous en cours</h2>
      ${bookings
        .map((rdv) => {
          const motif = getMotif(rdv.motifId)
          return `
      <article class="card rdv-en-cours" data-rdv-id="${rdv.id}">
        <p class="meta">${rdv.slotLabel}</p>
        <p><strong>Motif</strong> · ${motif?.label || rdv.motifId}</p>
        <div class="row-actions">
          <button class="hit btn" data-sim="rdv-move:${rdv.id}" type="button">Déplacer</button>
          <button class="hit btn" data-sim="rdv-annuler:${rdv.id}" type="button">Annuler</button>
        </div>
      </article>`
        })
        .join('')}
    </section>
  `
}

function mairieRdvDateSlots(pick = {}) {
  const day = pick.day || 27
  const slots = slotsForMayDay(day, { excludeBookingId: pick.moveId || null })
  const morning = slots.filter((t) => Number(t.split(':')[0]) < 12)
  const afternoon = slots.filter((t) => Number(t.split(':')[0]) >= 12)
  const selectedSlot = pick.slot || morning[0] || afternoon[0] || ''
  return `
    <h2 class="sec">Choisir une date</h2>
    <p class="meta">Mai 2026${pick.moveId ? ' · déplacement en cours' : ''}</p>
    <div class="calendar">
      ${Array.from({ length: 31 }, (_, i) => {
        const d = i + 1
        const wd = weekdayForMay2026(d)
        const closed = wd > 5 || slotsForMayDay(d, { excludeBookingId: pick.moveId || null }).length === 0
        const cls = d === day ? 'on' : closed ? 'closed' : ''
        return `<button class="hit cal-day ${cls}" type="button" data-sim="rdv-pick-day:${d}">${d}</button>`
      }).join('')}
    </div>
    <h2 class="sec">Créneaux disponibles — ${day} mai</h2>
    ${
      slots.length
        ? `
    <p class="meta">MATINÉE</p>
    <div class="chips">
      ${
        morning.length
          ? morning
              .map(
                (t) =>
                  `<button class="hit chip ${t === selectedSlot ? 'on' : ''}" type="button" data-sim="rdv-pick-slot:${t}">${t}</button>`
              )
              .join('')
          : '<span class="meta">Aucun</span>'
      }
    </div>
    <p class="meta">APRÈS-MIDI</p>
    <div class="chips">
      ${
        afternoon.length
          ? afternoon
              .map(
                (t) =>
                  `<button class="hit chip ${t === selectedSlot ? 'on' : ''}" type="button" data-sim="rdv-pick-slot:${t}">${t}</button>`
              )
              .join('')
          : '<span class="meta">Aucun</span>'
      }
    </div>
    <button class="hit btn primary block" data-go="mairie-rdv-suite">${pick.moveId ? 'Continuer le déplacement' : 'Continuer'}</button>`
        : `<p class="meta">Aucun créneau ce jour (week-end, indisponibilité ou complet).</p>`
    }
  `
}

function mairieRdv() {
  const motifs = listMotifs({ activeOnly: true })
  const pick = getRdvPick()
  const selectedId = pick.motifId || motifs[0]?.id
  const selected = getMotif(selectedId)
  const mine = listUserBookings('user-rica')
  return wrap(
    `
    ${mairieRdvEnCoursBlock(mine)}
    <hr class="section-sep" aria-hidden="true" />
    <section class="rdv-section">
      <h2 class="sec">Nouveau rendez-vous</h2>
      <label class="field motif-field">
        <span>Motif de rendez-vous</span>
        <div class="motif-select" data-motif-select>
          <button class="hit motif-trigger" type="button" data-motif-toggle aria-expanded="false">
            <span class="motif-value" data-motif-id="${selectedId || ''}">${selected?.label || 'Choisir…'}</span>
            <span class="motif-chev" aria-hidden="true">▼</span>
          </button>
          <div class="motif-dropdown" hidden>
            ${motifs
              .map(
                (m) => `
            <button class="hit motif-option ${m.id === selectedId ? 'on' : ''}" type="button" data-motif-pick="${m.id}" data-motif-label="${m.label}">
              ${m.label} · ${m.duration} min
            </button>`
              )
              .join('')}
          </div>
        </div>
      </label>
      <p class="meta">Un seul motif par rendez-vous · durée ${selected?.duration || '—'} min</p>
      ${mairieRdvDateSlots(pick)}
    </section>
    `,
    {
      header: phoneHeader({ title: 'Prendre rendez-vous', backTo: 'mairie-accueil' }),
      footer: phoneFooter('mairie'),
    }
  )
}

function mairieRdvCreneau() {
  return mairieRdv()
}

function mairieRdvSuite() {
  const pick = getRdvPick()
  const motifs = listMotifs({ activeOnly: true })
  const motif = getMotif(pick.motifId) || motifs[0]
  const day = pick.day || 27
  const slot = pick.slot || '09:30'
  return wrap(
    `
    <h2 class="sec">Confirmation RDV</h2>
    <article class="card">
      <strong>Récapitulatif</strong>
      <p><strong>Motif</strong> · ${motif?.label || '—'}</p>
      <p><strong>Date</strong> · ${day} mai 2026</p>
      <p><strong>Créneau</strong> · ${slot}</p>
      <p class="meta">Durée ${motif?.duration || '—'} min · Mairie de Kapan</p>
    </article>
    <div class="row-actions">
      <button class="hit btn" data-go="mairie-rdv">Retour</button>
      <button class="hit btn primary" data-sim="rdv-confirm" type="button">${pick.moveId ? 'Confirmer le déplacement' : 'Confirmer'}</button>
    </div>
    `,
    {
      header: phoneHeader({ title: 'Confirmer le RDV', backTo: 'mairie-rdv' }),
      footer: phoneFooter('mairie'),
    }
  )
}

function mairiePresentation() {
  return wrap(
    `
    ${publicationCard({
      title: 'À propos de la ville de KAPAN',
      body: 'Texte de présentation de la ville…',
      contentId: 'pub-mairie-1',
      menuParent: 'mairie-presentation',
      section: 'mairie',
    })}
    ${publicationCard({
      title: 'Kapan, entre ville et nature',
      body: 'Texte…',
      multi: true,
      contentId: 'pub-mairie-2',
      menuParent: 'mairie-presentation',
      section: 'mairie',
    })}
    `,
    {
      header: phoneHeader({ title: 'Présentation de la ville', backTo: 'mairie-accueil' }),
      footer: phoneFooter('mairie'),
    }
  )
}

/** Legacy nav leaves → open content-menu with forced context */
function openContentMenuAlias(type, contentId, parent, participantId) {
  setMenuContext({ type, contentId, parent, participantId })
  return contentMenu()
}

function mairiePresentationOptions() {
  return openContentMenuAlias('publication', 'pub-mairie-1', 'mairie-presentation')
}

function mairiePubOptionsHabitant() {
  return openContentMenuAlias('publication', 'pub-mairie-1', 'mairie-accueil')
}

function mairiePubOptionsAdmin() {
  return openContentMenuAlias('publication', 'pub-mairie-1', 'mairie-accueil')
}

function contentMenuTitle(ctx) {
  if (!ctx) return 'Plus d’options'
  if (ctx.type === 'publication') {
    const p = getPublication(ctx.contentId)
    return p?.authorLabel ? `Publication · ${p.authorLabel}` : 'Publication'
  }
  if (ctx.type === 'directory') {
    return getDirectory(ctx.contentId)?.title || 'Fiche'
  }
  if (ctx.type === 'event') {
    return getEvent(ctx.contentId)?.title || 'Événement'
  }
  if (ctx.type === 'participant') {
    return getParticipant(ctx.participantId)?.name || 'Participant'
  }
  if (ctx.type === 'annonce') return 'Annonce'
  if (ctx.type === 'offre') return 'Offre'
  return 'Plus d’options'
}

function contentMenuActions(ctx) {
  if (!ctx) return []
  switch (ctx.type) {
    case 'publication':
      return publicationMenuActions(ctx.contentId)
    case 'directory':
      return directoryMenuActions(ctx.contentId)
    case 'event':
      return eventMenuActions(ctx.contentId)
    case 'participant':
      return participantMenuActions(ctx.participantId)
    case 'annonce':
      return annonceMenuActions({ official: true })
    case 'offre':
      return offreMenuActions(ctx.contentId)
    default:
      return []
  }
}

function contentMenu() {
  const ctx = getMenuContext() || { type: 'publication', contentId: 'pub-mairie-1', parent: 'mairie-accueil' }
  const parent = ctx.parent || 'mairie-accueil'
  const actions = contentMenuActions(ctx)
  const dimLabel =
    ctx.type === 'directory'
      ? 'Fond fiche…'
      : ctx.type === 'event'
        ? 'Détail événement…'
        : ctx.type === 'participant'
          ? 'Liste participants…'
          : 'Fond publication…'
  return wrap(`${photo(dimLabel, 'dim')}<p class="meta menu-parent-hint">← ${parent}</p>`, {
    header: phoneHeader({ title: contentMenuTitle(ctx), chrome: 'panel' }),
    footer: '',
    overlay: modalShell('Plus d’options', sheetActions(actions)),
  })
}

function menuConfirmShell({ title, body, confirmSim, confirmLabel = 'Confirmer', backTo }) {
  void backTo
  return wrap(`${photo('Fond…', 'dim')}`, {
    header: phoneHeader({ title, chrome: 'panel' }),
    footer: '',
    overlay: modalShell(
      title,
      `<p>${body}</p>`,
      `
      <div class="row-actions confirm-actions">
        <button class="hit btn" data-back type="button">Annuler</button>
        <button class="hit btn primary" data-sim="${confirmSim}" type="button">${confirmLabel}</button>
      </div>
      `,
      { center: true }
    ),
  })
}

function menuConfirmDeletePub() {
  const id = getMenuContext()?.contentId || 'pub-mairie-1'
  const p = getPublication(id)
  return menuConfirmShell({
    title: 'Supprimer la publication',
    body: `Supprimer « ${p?.body?.slice(0, 48) || id}… » ? Cette action retire la publication de la démo. Annuler = aucun changement.`,
    confirmSim: 'supprimer',
    confirmLabel: 'Supprimer',
    backTo: 'mairie-accueil',
  })
}

function menuConfirmDeleteDir() {
  const id = getMenuContext()?.contentId || 'dir-pharmacie-centrale'
  const d = getDirectory(id)
  return menuConfirmShell({
    title: 'Supprimer la fiche',
    body: `Supprimer la fiche « ${d?.title || id} » ? Elle ne sera plus consultable. Annuler = aucun changement.`,
    confirmSim: 'supprimer',
    confirmLabel: 'Supprimer',
    backTo: 'sante-pharmacie-infos',
  })
}

function menuConfirmDeleteEvt() {
  const id = getMenuContext()?.contentId || 'evt-atelier'
  const e = getEvent(id)
  return menuConfirmShell({
    title: 'Supprimer l’événement',
    body: `Supprimer « ${e?.title || id} » (brouillon) ? L’événement disparaît de la liste. Annuler = aucun changement.`,
    confirmSim: 'supprimer',
    confirmLabel: 'Supprimer',
    backTo: 'evenement-details',
  })
}

function menuConfirmCancelEvt() {
  const id = getMenuContext()?.contentId || 'evt-atelier'
  const e = getEvent(id)
  return menuConfirmShell({
    title: 'Annuler l’événement',
    body: `Annuler « ${e?.title || id} » ? La fiche est conservée, les inscrits sont notifiés (simulé). Annuler = aucun changement.`,
    confirmSim: 'cancel-evt',
    confirmLabel: 'Annuler l’événement',
    backTo: 'evenement-details',
  })
}

function menuModeratePub() {
  const id = getMenuContext()?.contentId || 'pub-citoyen-other'
  const p = getPublication(id)
  return wrap(`${photo('Fond feed…', 'dim')}`, {
    header: phoneHeader({ title: 'Modérer', chrome: 'panel' }),
    footer: '',
    overlay: modalShell(
      'Modérer la publication',
      `
      <p class="meta">Post de ${p?.authorLabel || 'citoyen'} — l’admin ne réécrit pas le texte.</p>
      ${sheetOption('Masquer publiquement', { sim: 'moderer-masquer' })}
      ${sheetOption('Retirer avec motif', { sim: 'moderer-retirer', danger: true })}
      ${sheetOption('Signalements (simulé)', { sim: 'signalement' })}
      `
    ),
  })
}

function menuSignalFicheInfo() {
  return wrap(`${photo('Fond fiche…', 'dim')}`, {
    header: phoneHeader({
      title: 'Signaler info',
      chrome: 'panel',
    }),
    footer: '',
    overlay: modalShell(
      'Signaler info incorrecte',
      `
      <p class="meta">Le signalement ne modifie pas la fiche.</p>
      ${sheetOption('Horaires', { sim: 'signal-info' })}
      ${sheetOption('Adresse', { sim: 'signal-info' })}
      ${sheetOption('Téléphone', { sim: 'signal-info' })}
      ${sheetOption('Description', { sim: 'signal-info' })}
      ${sheetOption('Autre', { sim: 'signal-info' })}
      `
    ),
  })
}

function mairieGererPage() {
  return wrap(
    `
    <div class="form-card">
      <h2 class="sec">Gérer la page Ma mairie</h2>
      <p class="meta">Mairie de Kapan · formulaire partagé app / back-office</p>
      <div class="field">
        <span>Photo de couverture</span>
        ${photo('Couverture…', 'wide')}
        <button class="hit btn" data-sim="upload" type="button">Uploader (simulé)</button>
      </div>
      <label class="field"><span>Titre</span><input type="text" value="Mairie de Kapan" /></label>
      <label class="field"><span>Présentation</span><textarea rows="4" placeholder="Présentation de la mairie…">Présentation courte de la mairie…</textarea></label>
      ${lifecycleBar('brouillon')}
      <div class="row-actions">
        <button class="hit btn" data-sim="brouillon" type="button">Brouillon</button>
        <button class="hit btn" data-go="mairie-accueil" type="button">Prévisualiser</button>
        <button class="hit btn primary" data-sim="publier" type="button">Publier</button>
      </div>
    </div>
    `,
    {
      header: phoneHeader({
        title: 'Gérer la page',
        backTo: 'mairie-accueil',
        chrome: 'form',
      }),
      footer: '',
    }
  )
}

function mairiePublicationForm({ mode = 'create' } = {}) {
  const editId = getPubEditId()
  const pub = editId ? getAdminPub(editId) : null
  const isEdit = mode === 'edit' || !!pub?.title
  const titleVal = pub?.title || ''
  const bodyVal = pub?.body || ''
  const backTo = 'admin-mairie'
  const formTitle = isEdit && titleVal ? 'Modifier la publication' : 'Nouvelle publication'
  return wrap(
    `
    <div class="form-card" data-pub-id="${pub?.id || ''}">
      <p class="meta">Mairie de Kapan · ${isEdit && titleVal ? 'édition' : 'création'}${pub?.id ? ` · ${pub.id}` : ''}</p>
      <label class="field"><span>Titre</span><input type="text" placeholder="Titre de la publication…" value="${escapeAttr(titleVal)}" data-field="pub-title" /></label>
      <label class="field"><span>Corps</span><textarea rows="5" placeholder="Corps de la publication…" data-field="pub-body">${escapeHtml(bodyVal)}</textarea></label>
      <h2 class="sec">Médias</h2>
      <div class="photo-grid media-added">
        ${photo('Photo…')}${photo('Photo…')}
      </div>
      <button class="hit media-add-btn" data-go="mairie-medias-sheet" type="button">
        <span class="ico-box round"></span>
        <span>Ajouter des médias</span>
      </button>
      <div class="row-link static">
        <span>Activer les commentaires</span>
        <span class="toggle on" aria-hidden="true"></span>
      </div>
      ${lifecycleBar(pub?.state === 'published' ? 'publie' : 'brouillon')}
      <div class="row-actions">
        <button class="hit btn" data-sim="pub-save-draft" type="button">Brouillon</button>
        <button class="hit btn" data-sim="pub-preview" type="button">Prévisualiser</button>
        <button class="hit btn primary" data-sim="pub-publish" type="button">Publier</button>
      </div>
    </div>
    `,
    {
      header: phoneHeader({ title: formTitle, backTo, chrome: 'form' }),
      footer: '',
    }
  )
}

function mairieNouvellePublication() {
  return mairiePublicationForm({ mode: 'create' })
}

function mairiePubEdit() {
  return mairiePublicationForm({ mode: 'edit' })
}

function mairiePubPreview() {
  const pub = getAdminPub(getPubEditId())
  return wrap(
    `
    <article class="card post-card">
      <div class="pub-title-row">
        <strong class="block-title">${pub?.title || 'Sans titre'}</strong>
        <span class="badge">Aperçu</span>
      </div>
      <p class="meta">Mairie de Kapan</p>
      ${text(pub?.body || 'Corps…')}
      ${photo('Média publication…', 'wide')}
    </article>
    ${lifecycleBar('preview')}
    <div class="row-actions">
      <button class="hit btn" data-go="mairie-pub-edit" type="button">Retour brouillon</button>
      <button class="hit btn primary" data-sim="pub-publish" type="button">Publier</button>
    </div>
    `,
    {
      header: phoneHeader({ title: 'Prévisualisation', backTo: 'mairie-nouvelle-publication', chrome: 'form' }),
      footer: '',
    }
  )
}

function mairieMediasSheet() {
  return wrap(
    `
    <div class="compose-area">
      ${text('Dire quelque chose…')}
    </div>
    `,
    {
      header: phoneHeader({ title: 'Nouvelle publication', chrome: 'panel' }),
      footer: '',
      overlay: modalShell(
        'Médias',
        `
        ${sheetOption('Ajouter des photos ou vidéos', { sim: 'media' })}
        ${sheetOption('Prendre une photo', { sim: 'media' })}
        ${sheetOption('Prendre une vidéo', { sim: 'media' })}
        `
      ),
    }
  )
}

function mairieConseil() {
  const person = (name, role, featured = false) => `
    <article class="card conseil-card ${featured ? 'featured' : ''}">
      <span class="avatar lg"></span>
      <div class="grow">
        <strong>${name}</strong>
        <div class="meta accent-text">${role}</div>
        ${featured ? text('Les membres du conseil municipal représentent les habitants…') : ''}
      </div>
    </article>
  `
  return wrap(
    `
    ${person('Gevorg Parsyan', 'Maire', true)}
    <h2 class="sec">Les adjoints au Maire</h2>
    ${person('Anush Mezhlumyan', '1er Adjoint')}
    ${person('Davros Nabavian', '2ème Adjoint')}
    ${person('Kohar Kinosyan', '3ème Adjoint')}
    <h2 class="sec">Les délégués et conseillers</h2>
    ${person('Vrtanes Gorgodian', 'Conseiller')}
    ${person('Sosi Hagopian', 'Conseillère')}
    ${person('Avids Minassian', 'Conseiller')}
    <button class="hit row-link" data-go="mairie-conseil-edit">
      <span>Modifier (admin)</span><span>›</span>
    </button>
    `,
    {
      header: phoneHeader({ title: 'Maire & Conseil municipal', backTo: 'mairie-accueil' }),
      footer: phoneFooter('mairie'),
    }
  )
}

function mairieConseilEdit() {
  const uploadSlot = (label) => `
    <p class="meta">${label}</p>
    <div class="upload-box">
      <span class="avatar lg upload-slot"></span>
      <p class="meta">Ajoutez une image · JPG / PNG · max 5 Mo</p>
    </div>
  `
  return wrap(
    `
    <div class="sec-row">
      <h2 class="sec">Informations du maire</h2>
      <button class="hit linkish" type="button">Modifier</button>
    </div>
    <div class="conseil-edit-head centerish">
      <span class="avatar lg"></span>
      <div>
        <strong>Gevorg PARSYAN</strong>
        <div class="meta accent-text">Maire</div>
      </div>
    </div>
    <label class="field"><span>Nom du maire</span><input type="text" placeholder="Nom du maire" value="Gevorg PARSYAN" /></label>
    <label class="field"><span>Biographie ou les mots du maire</span><textarea placeholder="Décrivez-vous…" rows="3"></textarea><span class="meta">0/100</span></label>
    <div class="sec-row">
      <h2 class="sec">Les adjoints au maire</h2>
      <button class="hit linkish" data-sim="enregistrer" type="button">Enregistrer</button>
    </div>
    <div class="row-link static">
      <span>Ajouter des adjoints au maire</span>
      <button class="hit icon-btn roundish" type="button" data-sim="ajouter">+</button>
    </div>
    <label class="field"><span>Nom</span><input type="text" value="Anush Mezhlumyan" /></label>
    ${uploadSlot('Photo de l’adjoint')}
    <label class="field"><span>Nom</span><input type="text" placeholder="2ème adjoint" /></label>
    ${uploadSlot('Photo de l’adjoint')}
    <div class="sec-row">
      <h2 class="sec">Les délégués & conseillers</h2>
      <button class="hit linkish" type="button">Modifier</button>
    </div>
    <div class="row-link static">
      <span>Ajouter des délégués & conseillers</span>
      <button class="hit icon-btn roundish" type="button" data-sim="ajouter">+</button>
    </div>
    <label class="field"><span>Nom</span><input type="text" placeholder="1er conseiller" /></label>
    ${uploadSlot('Photo du conseiller')}
    <label class="field"><span>Nom</span><input type="text" placeholder="2ème conseiller" /></label>
    ${uploadSlot('Photo du conseiller')}
    <button class="hit btn primary block" data-sim="enregistrer">Enregistrer (simulé)</button>
    `,
    {
      header: phoneHeader({ title: 'Maire & Conseil municipal', backTo: 'mairie-conseil', chrome: 'form' }),
      footer: '',
    }
  )
}

function mairieInfosInterior() {
  return mairieAproposCommunauteInterior()
}

function mairieInfosPratiqueInterior() {
  return `
    <h2 class="sec">Coordonnées</h2>
    <div class="row-link static"><span>Téléphone</span><span class="meta">+374 98 00 00 00</span></div>
    <div class="row-link static"><span>E-mail</span><span class="meta">contact@kapan.am</span></div>
    <h2 class="sec">Adresse</h2>
    ${text('1 place de la Mairie, Kapan')}
    ${photo('Carte mairie…', 'map')}
    <h2 class="sec">Horaires d’accueil</h2>
    ${['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi']
      .map(
        (d) => `
      <div class="row-link static">
        <span>${d}</span>
        <span class="meta">09:00 – 17:00</span>
      </div>`
      )
      .join('')}
    <div class="row-link static"><span>Samedi / Dimanche</span><span class="meta">Fermé</span></div>
    <h2 class="sec">Services municipaux</h2>
    ${['État civil', 'Urbanisme', 'Social', 'Éducation']
      .map(
        (s) => `
      <div class="row-link static"><span>${s}</span><span class="meta">›</span></div>`
      )
      .join('')}
    <h2 class="sec">Démarches</h2>
    <button class="hit btn primary block" data-go="mairie-rdv" type="button">Prendre rendez-vous</button>
    <button class="hit row-link" data-go="mairie-apropos-communaute" type="button">
      <span>À propos de la communauté</span><span>›</span>
    </button>
  `
}

function mairieAproposCommunauteInterior() {
  return `
    ${mairieShellTop()}
    <h2 class="sec">Informations</h2>
    <div class="communaute-links">
      <button class="hit row-link" type="button"><span>Membres</span><span class="meta">426K ›</span></button>
      <button class="hit row-link" type="button"><span>Galeries</span><span class="meta">85 ›</span></button>
    </div>
    <h2 class="sec">Règles de la Communauté de la ville de Kapan</h2>
    <article class="card rule-card">
      <strong>Pas de harcèlement</strong>
      ${text('Garantir la sécurité de tous — le harcèlement n’est pas toléré.')}
    </article>
    <article class="card rule-card">
      <strong>Soyez aimable</strong>
      ${text('Le respect mutuel crée un meilleur environnement pour tous.')}
    </article>
    <h2 class="sec">Publications</h2>
    <p class="meta pubs-note">Seuls les administrateurs peuvent publier dans ce club.</p>
    <h2 class="sec">Historique</h2>
    <article class="card history-card">
      <div class="history-row"><span class="meta">Créé le</span><strong>18 avril 2024</strong></div>
      <div class="history-row"><span class="meta">Dernière modification</span><strong class="accent-text">30 mai 2024</strong></div>
    </article>
    <h2 class="sec">Administrateurs & Modérateurs</h2>
    <div class="admin-list">
      ${[
        ['Lilit Ameni', 'Administrateur'],
        ['Rouben Sirunyan', 'Modérateur'],
        ['Yester Sullivan', 'Administrateur'],
      ]
        .map(
          ([name, role]) => `
      <div class="row-link static admin-row">
        <span class="avatar"></span>
        <span class="grow"><strong>${name}</strong><br/><span class="meta">${role}</span></span>
      </div>`
        )
        .join('')}
    </div>
  `
}

function mairieInfos() {
  return wrap(mairieInfosPratiqueInterior(), {
    header: phoneHeader({ title: 'Infos Mairie', backTo: 'mairie-accueil' }),
    footer: phoneFooter('mairie'),
  })
}

function mairieInfosDetail() {
  return wrap(
    `
    <article class="card post-card publication-detail">
      ${photo('Photo info mairie…', 'wide')}
      <div class="pub-title-row">
        <strong class="block-title">Construction et réhabilitation de routes</strong>
        <button class="hit icon-btn" data-go="mairie-infos-apropos" title="À propos">⋯</button>
      </div>
      <p class="meta accent-text">Admin Kapan · <span class="badge">Transports</span></p>
      ${text('Corps complet de l’information mairie…')}
      ${socialActions({ contentId: 'pub-mairie-1', section: 'mairie' })}
    </article>
    `,
    {
      header: phoneHeader({ title: 'Publication', backTo: 'mairie-accueil' }),
      footer: phoneFooter('mairie'),
    }
  )
}

function mairieInfosApropos() {
  return wrap(`${photo('Fond info…', 'dim')}`, {
    header: phoneHeader({ title: 'Publication', chrome: 'panel' }),
    footer: '',
    overlay: modalShell(
      'À propos',
      `
      ${sheetOption('Afficher la liste des réactions', { go: 'infos-reactions' })}
      ${sheetOption('Partager la publication', { go: 'infos-partage' })}
      `
    ),
  })
}

function mairieAproposCommunaute() {
  return wrap(mairieAproposCommunauteInterior(), {
    header: phoneHeader({ title: 'À propos de la communauté', backTo: 'mairie-infos' }),
    footer: phoneFooter('mairie'),
  })
}

function mairieCommunaute() {
  return mairieAproposCommunaute()
}

function mairiePlan() {
  return wrap(
    `
    ${mairieShellTop()}
    <div class="sec-row">
      <h2 class="sec">Plan de la ville</h2>
      <button class="hit linkish" data-sim="agrandir" type="button">Agrandir</button>
    </div>
    <div class="row-actions plan-search-row">
      ${search('Trouver un lieu…')}
      <button class="hit icon-btn" data-go="mairie-plan-menu" title="Menu de la carte">⋯</button>
    </div>
    ${photo('Carte de Kapan…', 'map hero')}
    <p class="meta">Repères municipaux · structure</p>
    `,
    {
      header: mairieHeader('Ma mairie'),
      footer: phoneFooter('mairie'),
    }
  )
}

function mairiePlanMenu() {
  return wrap(`${photo('Fond carte…', 'dim')}`, {
    header: phoneHeader({ title: 'Plan de la ville', chrome: 'panel' }),
    footer: '',
    overlay: modalShell(
      'Menu de la carte',
      `
      ${sheetOption('Paramètres', { go: 'mairie-plan-parametres' })}
      ${sheetOption('Me localiser', { sim: 'position' })}
      ${sheetOption('Aller à un endroit', { go: 'mairie-plan-aller' })}
      `
    ),
  })
}

function mairiePlanParametres() {
  return wrap(
    `
    <h2 class="sec">Paramètres de la carte</h2>
    <label class="field"><span>Distance maximale</span><input type="text" value="5 km" /></label>
    <div class="row-link static">
      <span>Partager ma position</span>
      <span class="toggle on" aria-hidden="true"></span>
    </div>
    <button class="hit btn primary block" data-go="mairie-plan">Enregistrer</button>
    `,
    {
      header: phoneHeader({ title: 'Paramètres', backTo: 'mairie-plan' }),
      footer: phoneFooter('mairie'),
    }
  )
}

function mairiePlanAller() {
  return wrap(
    `
    <h2 class="sec">Aller à un endroit</h2>
    ${search('Rechercher un lieu…')}
    ${photo('Carte…', 'map')}
    <h2 class="sec">Lieux récents</h2>
    ${['Hôtel de ville', 'Place centrale', 'Centre culturel']
      .map((l) => `<button class="hit row-link" type="button"><span>${l}</span><span>›</span></button>`)
      .join('')}
    <button class="hit btn primary block" data-go="mairie-plan">Valider</button>
    `,
    {
      header: phoneHeader({ title: 'Aller à un endroit', backTo: 'mairie-plan' }),
      footer: phoneFooter('mairie'),
    }
  )
}

function mairieStub(title, note) {
  return wrap(
    `
    <h2 class="sec">${title}</h2>
    ${tbd(note || 'Contenu — À préciser')}
    ${photo('Photo / document…', 'wide')}
    ${text('Texte…')}
    ${postCard({ author: 'Mairie de Kapan', role: 'Publication', body: 'Contenu type publication…' })}
    <button class="hit row-link" data-go="mairie-accueil"><span>Retour Ma mairie</span><span>›</span></button>
    `,
    {
      header: phoneHeader({ title, backTo: 'mairie-accueil' }),
      footer: phoneFooter('mairie'),
    }
  )
}

/* ——— Social / contenus ——— */

function infosFeed() {
  const posts = [
    {
      id: 'pub-citoyen-own',
      author: 'Arman Petrosyan',
      role: 'Mairie',
      time: 'il y a 2 h',
      body: 'Collecte des déchets verts renforcée ce week-end dans les quartiers sud et centre. Merci de sortir vos bacs avant 7 h.',
      media: 'none',
      identified: 0,
      likes: '128',
      comments: '18',
      shares: '12',
    },
    {
      id: 'pub-citoyen-other',
      author: 'Liana Avetisyan',
      role: 'Délégué',
      time: 'il y a 5 h',
      body: 'Marché du samedi — producteurs locaux sur la place centrale dès 8 h. Venez nombreux !',
      media: 'photo',
      identified: 5,
      likes: '86',
      comments: '24',
      shares: '9',
    },
    {
      id: 'pub-citoyen-other-0',
      author: 'Hovhannes Mkrtchyan',
      role: 'Membre',
      time: 'il y a 1 j',
      body: 'Retour en images du festival de musique au parc municipal.',
      media: 'multi',
      identified: 12,
      likes: '0',
      comments: '41',
      shares: '33',
    },
    {
      id: 'pub-mairie-feed',
      author: 'Mairie de Kapan',
      role: 'Mairie',
      time: 'il y a 2 j',
      body: 'Replay du conseil municipal du 24 septembre — points budgétaires et travaux voirie.',
      media: 'video',
      identified: 3,
      likes: '64',
      comments: '11',
      shares: '27',
    },
  ]
  const visible = posts.filter((p) => !isHidden(p.id))
  return wrap(
    `
    <div class="compose-card">
      <div class="compose">
        <span class="avatar"></span>
        <button class="hit compose-input" data-sim="publier" type="button">Commencer une publication</button>
      </div>
      <div class="row-actions compose-media">
        <button class="hit btn" data-sim="publier" type="button">▶ Vidéo</button>
        <button class="hit btn" data-sim="publier" type="button">🖼 Photo</button>
      </div>
    </div>
    <p class="meta sort-row">Classer par · <button class="hit linkish" type="button">Récent ▾</button></p>

    ${visible
      .map((p) =>
        feedPostCard({
          author: p.author,
          role: p.role,
          time: p.time,
          body: p.body,
          media: p.media,
          identified: p.identified,
          likes: p.likes,
          comments: p.comments,
          shares: p.shares,
          contentId: p.id,
          menuParent: 'infos-feed',
        })
      )
      .join('')}
    `,
    {
      header: phoneHeader({ title: 'Infos Feed', backTo: 'accueil-kapan' }),
      footer: phoneFooter('infos'),
    }
  )
}

function infosPostOptions(own = true) {
  const contentId = own ? 'pub-citoyen-own' : 'pub-citoyen-other'
  return openContentMenuAlias('publication', contentId, 'infos-feed')
}

function footerTabForParent(parent) {
  if (!parent) return 'infos'
  if (parent.includes('infos') || parent === 'infos-feed') return 'infos'
  if (parent.includes('mairie')) return 'mairie'
  if (parent.includes('message')) return 'messages'
  if (parent === 'accueil-kapan') return 'accueil'
  return 'menu'
}

function contentLabelFromId(id, ctx) {
  const pub = id && getPublication?.(id)
  const evt = id && getEvent?.(id)
  const dir = id && getDirectory?.(id)
  return (
    pub?.authorLabel ||
    pub?.body?.slice(0, 40) ||
    evt?.title ||
    dir?.title ||
    ctx?.label ||
    'Publication'
  )
}

function infosReactions() {
  const ctx = getReactContext()
  const id = ctx?.contentId
  const label = contentLabelFromId(id, ctx)
  const parent = ctx?.parent || 'infos-feed'
  const people = [
    { name: 'Anahit Mkrtchyan', role: 'Membre', react: '♥', follow: false },
    { name: 'Armen Sargsyan', role: 'Mairie de Kapan', react: '♥', follow: true },
    { name: 'Hasmik Gevorgyan', role: 'Délégué', react: '👍', follow: false },
    { name: 'Gurgen Khachatryan', role: 'Membre', react: '♥', follow: false },
    { name: 'Syuzanna Vardanyan', role: 'Membre', react: '👍', follow: true },
  ]
  return wrap(
    `
    <p class="meta content-bound-meta">Réactions · ${label}${id ? ` · ${id}` : ''}</p>
    <div class="tabs react-tabs">
      <button class="hit tab on" type="button">Tous (146)</button>
      <button class="hit tab" type="button">J’aime (128)</button>
      <button class="hit tab" type="button">J’adore (18)</button>
    </div>
    <div class="react-list">
      ${people
        .map(
          (p) => `
        <div class="react-row">
          <button class="hit react-person" data-go="${p.follow ? 'infos-feed' : 'infos-ajouter-ami'}" type="button">
            <span class="avatar-wrap">
              <span class="avatar"></span>
              <span class="react-badge" aria-hidden="true">${p.react}</span>
            </span>
            <span class="grow">
              <strong>${p.name}</strong>
              <span class="meta">${p.role}</span>
            </span>
          </button>
          <button class="hit btn ${p.follow ? '' : 'primary'}" data-go="${
            p.follow ? 'infos-feed' : 'infos-ajouter-ami'
          }" type="button">${p.follow ? 'Suivi' : 'Suivre'}</button>
        </div>`
        )
        .join('')}
    </div>
    `,
    {
      header: phoneHeader({ title: 'Réactions', chrome: 'panel' }),
      footer: '',
    }
  )
}

function infosAjouterAmi() {
  return wrap(`${photo('Fond réactions…', 'dim')}`, {
    header: phoneHeader({ title: 'Réactions', chrome: 'panel', closeIcon: true }),
    footer: '',
    overlay: `
      <div class="modal-layer">
        <div class="modal-sheet center-card">
          <header class="modal-head">
            <strong>Confirmation d’ajout</strong>
            <button class="hit icon-btn" data-back title="Fermer" aria-label="Fermer">✕</button>
          </header>
          <div class="modal-body add-friend-body">
            <div class="avatar-wrap lg-wrap">
              <span class="avatar lg"></span>
              <span class="react-badge" aria-hidden="true">♥</span>
            </div>
            <strong class="add-friend-q">Ajouter Anahit à vos amis ?</strong>
            ${text(
              'En ajoutant Anahit dans Ma Ville, elle sera également ajoutée à vos amis Miasin afin de garder vos contacts synchronisés.'
            )}
            <div class="sync-pill"><span>Ma Ville</span><span class="sync-ico">↻</span><span>Miasin</span></div>
          </div>
          <footer class="modal-foot add-friend-actions">
            <button class="hit btn" data-back type="button">Annuler</button>
            <button class="hit btn primary" data-sim="ami-ajoute" type="button">Ajouter aux amis</button>
          </footer>
        </div>
      </div>
    `,
  })
}

function infosCommentaires() {
  const ctx = getCommentContext()
  const id = ctx?.contentId
  const label = contentLabelFromId(id, ctx)
  const parent = ctx?.parent || 'infos-feed'
  return wrap(
    `
    <p class="meta content-bound-meta">Commentaires · ${label}${id ? ` · ${id}` : ''}</p>
    <h2 class="sec">Commentaires (2)</h2>
    <article class="card comment-thread">
      <div class="comment">
        <span class="avatar"></span>
        <div class="grow">
          <div class="comment-head">
            <strong>Armen Sargsyan</strong>
            <span class="role-pill">Maire de Kapan</span>
            <span class="meta">2 h</span>
          </div>
          <div class="comment-bubble">${text('Très bonne initiative, merci à l’équipe municipale !')}</div>
          <div class="row-actions comment-acts">
            <button class="hit linkish" type="button">♥ J’adore</button>
            <button class="hit linkish" type="button">↩ Répondre</button>
          </div>
        </div>
      </div>
      <div class="comment reply-indent">
        <span class="avatar"></span>
        <div class="grow">
          <div class="comment-head">
            <strong>Mairie de Kapan</strong>
            <span class="role-pill">Membre</span>
            <span class="meta">1 h</span>
          </div>
          <div class="comment-bubble">${text('Avec plaisir Armen ! Nos équipes font le maximum.')}</div>
          <div class="row-actions comment-acts">
            <button class="hit linkish" type="button">♥ J’adore</button>
            <button class="hit linkish" type="button">↩ Répondre</button>
          </div>
        </div>
      </div>
      <div class="comment">
        <span class="avatar"></span>
        <div class="grow">
          <div class="comment-head">
            <strong>Syuzanna Vardanyan</strong>
            <span class="role-pill">Conseiller</span>
            <span class="meta">30 m</span>
          </div>
          <div class="comment-bubble">${text('Est-ce que ça concerne aussi le quartier Nord @MairieDeKapan ?')}</div>
          <div class="row-actions comment-acts">
            <button class="hit linkish" type="button">♥ J’adore</button>
            <button class="hit linkish" type="button">↩ Répondre</button>
          </div>
        </div>
      </div>
    </article>
    <div class="composer-bar">
      <span class="avatar"></span>
      <div class="composer-field">
        <input type="text" placeholder="Écrire un commentaire…" />
        <button class="hit icon-btn" data-sim="emoji" type="button" title="Emoji">☺</button>
        <button class="hit icon-btn" data-sim="image" type="button" title="Image">🖼</button>
      </div>
      <button class="hit btn primary send-btn" data-sim="commentaire" type="button" title="Envoyer">➤</button>
    </div>
    `,
    {
      header: phoneHeader({ title: 'Commentaires', chrome: 'panel' }),
      footer: '',
    }
  )
}

function infosPartage() {
  const recents = [
    { name: 'Anahit', selected: true },
    { name: 'Armen', selected: false },
    { name: 'Hasmik', selected: true },
    { name: 'Gurgen', selected: false },
    { name: 'Syuzanna', selected: false },
  ]
  return wrap(`${photo('Fond feed…', 'dim')}`, {
    header: phoneHeader({ title: 'Partager', chrome: 'panel' }),
    footer: '',
    overlay: modalShell(
      'Partager la publication',
      `
      ${search('Rechercher des destinataires…')}
      <p class="meta section-label">Destinataires récents</p>
      <div class="h-scroll share-recents">
        ${recents
          .map(
            (r) => `
          <button class="hit share-avatar ${r.selected ? 'on' : ''}" data-sim="destinataire" type="button">
            <span class="avatar"></span>
            ${r.selected ? '<span class="check" aria-hidden="true">✓</span>' : ''}
            <span class="meta">${r.name}</span>
          </button>`
          )
          .join('')}
      </div>
      ${sheetOption('Envoyer dans une conversation', { sim: 'partage-conv' })}
      ${sheetOption('Copier le lien', { sim: 'partage-lien' })}
      ${sheetOption('Partager dans une autre application', { sim: 'partage-app' })}
      ${sheetOption('Partager sur mon profil', { sim: 'partage-profil' })}
      `,
      `<button class="hit btn primary block" data-sim="partage-envoyer" type="button">Envoyer aux destinataires sélectionnés</button>`
    ),
  })
}

function mapEventCard(e) {
  const rev = revisionLabel(e)
  return {
    id: e.id,
    title: e.title || 'Sans titre',
    when: e.dateShort || '',
    time: e.time || '',
    countdown: e.countdown || '',
    lieu: e.lieu || '',
    tags: [
      ...(e.tags || []),
      ...(rev ? [rev] : e.publication && e.publication !== 'published' ? [publicationLabel(e.publication)] : []),
    ],
    limited: isLimited(e),
  }
}

function evenementsListe() {
  const tab = getListTab()
  const admin = isAdminRole()
  const mesSub = getMesSub()
  let body = ''
  if (tab === 'mes') {
    const list =
      mesSub === 'creations' ? listMyCreations(SIM_VIEWER_ID) : listMyParticipations()
    body = `
      <div class="tabs sub-tabs">
        <button class="hit tab ${mesSub === 'participations' ? 'on' : ''}" data-sim="event-mes-sub:participations" type="button">Mes participations</button>
        <button class="hit tab ${mesSub === 'creations' ? 'on' : ''}" data-sim="event-mes-sub:creations" type="button">Mes créations</button>
      </div>
      ${
        list.length
          ? evenementsListeBody({ events: list.map(mapEventCard) })
          : emptyState(mesSub === 'creations' ? 'Aucune création pour le moment' : 'Aucune participation')
      }
    `
  } else {
    body = evenementsListeBody({ events: listPublicEvents().map(mapEventCard) })
  }
  return wrap(
    `
    <div class="tabs">
      <button class="hit tab ${tab === 'decouvrir' ? 'on' : ''}" data-sim="event-list-tab:decouvrir" type="button">Découvrir</button>
      <button class="hit tab ${tab === 'mes' ? 'on' : ''}" data-sim="event-list-tab:mes" type="button">Mes événements</button>
      <button class="hit tab" data-sim="event-create" type="button">Créer un événement</button>
    </div>
    ${
      admin
        ? `<button class="hit btn block outline" data-go="admin-evenements" type="button">Gérer les événements</button>`
        : ''
    }
    ${body}
    `,
    {
      header: phoneHeader({ title: 'Événements', backTo: 'accueil-kapan' }),
      footer: phoneFooter('menu'),
    }
  )
}

const EVENT_PARTICIPANTS = [
  { id: 'part-rouben', name: 'Rouben Sirunyan', since: 'Membre depuis 2 h' },
  { id: 'part-lilit', name: 'Lilit Ameni', since: 'Membre depuis 1 h' },
  { name: 'Aris Margaryan', since: 'Membre depuis 1 j' },
  { name: 'Hakob Hakobyan', since: 'Membre depuis 3 j' },
  { name: 'Anahit S.', since: 'Membre depuis 1 sem.' },
]

const EVENT_VALIDATION_PEOPLE = [
  { name: 'Lilit Ameni', joined: 'A rejoint il y a 4 mn' },
  { name: 'Rouben Sirunyan', joined: 'A rejoint il y a 1 h' },
  { name: 'Yester Sullivan', joined: 'A rejoint il y a 23 h' },
  { name: 'Lilit Ameni', joined: 'A rejoint il y a 1 j' },
  { name: 'Rouben Sirunyan', joined: 'A rejoint il y a 2 sem.' },
  { name: 'Yester Sullivan', joined: 'A rejoint il y a 4 mois' },
]

function renderInscriptionBlock(eventId = 'evt-atelier') {
  const ui = eventInscriptionUi(eventId)
  if (ui.kind === 'admin') {
    return `
      <button class="hit btn primary block" data-sim="event-edit:${eventId}" type="button">Gérer l’événement</button>
      <button class="hit btn block outline" data-go="evenement-validation" type="button">Gérer les inscriptions</button>
    `
  }
  if (ui.kind === 'join') {
    return `<button class="hit btn primary block" data-sim="${ui.sim}" type="button">${ui.label}</button>`
  }
  if (ui.kind === 'pending' || ui.kind === 'confirmed') {
    return `
      <section class="inscription-status">
        <h2 class="sec">Mon inscription</h2>
        <span class="badge">${ui.badge}</span>
        <button class="hit btn block outline" data-sim="${ui.sim}" type="button">${ui.cancelLabel}</button>
      </section>
    `
  }
  if (ui.kind === 'refused') {
    return `
      <section class="inscription-status">
        <h2 class="sec">Mon inscription</h2>
        <span class="badge">${ui.badge}</span>
        <p class="meta">${ui.explanation}</p>
      </section>
    `
  }
  if (ui.kind === 'full' || ui.kind === 'closed' || ui.kind === 'cancelled' || ui.kind === 'ended') {
    return `<p class="meta inscription-status"><strong>${ui.label}</strong></p>`
  }
  return ''
}

function evenementParticipantsBody() {
  const admin = isAdminRole()
  return `
    ${search('Rechercher un ami…')}
    <div class="participant-list">
      ${EVENT_PARTICIPANTS.map((p) => {
        const menuBtn = p.id
          ? `<button class="hit icon-btn" data-open-menu="participant" data-participant-id="${p.id}" data-menu-parent="evenement-participants" title="Plus d’options" aria-label="Plus d’options">⋯</button>`
          : `<button class="hit icon-btn" type="button" title="Plus d’options" aria-label="Plus d’options">⋯</button>`
        return `
        <div class="participant-row">
          <span class="avatar"></span>
          <div class="participant-meta grow">
            <strong>${p.name}</strong>
            <span class="meta">${p.since}</span>
            <span class="meta">5 ami(e)s en commun · 2 hobbies similaires</span>
          </div>
          <button class="hit action-circle" data-go="messages-thread" title="Message" aria-label="Message">💬</button>
          ${menuBtn}
        </div>`
      }).join('')}
    </div>
    ${
      admin
        ? `<button class="hit btn block outline" data-go="evenement-discussion">Envoyer un message groupé</button>`
        : `<p class="meta">Pas de diffusion collective pour les habitants.</p>`
    }
  `
}

function evenementDetails() {
  const admin = isAdminRole()
  const id = getOpenEventId() || getEditEventId() || 'evt-atelier'
  const e = getEventFull(id) || getEventFull('evt-atelier')
  if (!e) {
    return wrap(emptyState('Événement introuvable'), {
      header: phoneHeader({ title: 'Détails', backTo: 'evenements-liste' }),
      footer: phoneFooter('menu'),
    })
  }
  const places = placesLabel(e)
  const actions = renderInscriptionBlock(e.id)
  const plusInfos = `
      <h2 class="sec">Plus d’informations</h2>
      <div class="plus-infos">
        <button class="hit row-link" data-go="evenement-participants">
          <span>Participants · ${e.confirmedCount || 0}</span><span>›</span>
        </button>
        ${
          admin
            ? `<button class="hit row-link" data-go="evenement-validation">
          <span>Validations des participants · ${e.pendingCount || 0}</span><span>›</span>
        </button>`
            : ''
        }
        <button class="hit row-link" data-go="evenement-criteres">
          <span>Critères de participation</span><span>›</span>
        </button>
        <button class="hit row-link" data-go="evenement-conditions">
          <span>Conditions de participation</span><span>›</span>
        </button>
      </div>`

  return wrap(
    `
    <div class="event-detail" data-event-id="${e.id}">
      <div class="event-photo-wrap">
        ${photo('Photo événement…', 'hero')}
        ${isLimited(e) ? '<span class="badge event-places">Places limitées</span>' : ''}
      </div>
      <div class="event-detail-head">
        <div class="event-title-row">
          <strong class="block-title">${e.title || 'Sans titre'}</strong>
          <button class="hit icon-btn" data-open-menu="event" data-content-id="${e.id}" data-section="evenements" data-menu-parent="evenement-details" title="Plus d’options" aria-label="Plus d’options">⋯</button>
        </div>
        <p class="meta event-lieu">📍 ${e.lieuDetail || e.lieu || ''}</p>
        <p class="meta">${e.cityLabel || ''}</p>
      </div>
      <div class="meta-grid meta-grid-4">
        <div class="meta-cell"><span class="meta">Date</span><strong>${e.dateLabel || '—'}</strong></div>
        <div class="meta-cell"><span class="meta">Heure</span><strong>${e.time || '—'}</strong></div>
        <div class="meta-cell"><span class="meta">Catégorie</span><strong><span class="badge">${e.category || '—'}</span></strong></div>
        <div class="meta-cell"><span class="meta">Prix</span><strong>${e.price || '—'}</strong></div>
      </div>
      ${text(e.description || '')}
      <div class="stats-row">
        <span class="stat-cell"><strong>${e.confirmedCount || 0}</strong><span class="meta">Participants</span></span>
        ${
          places
            ? `<span class="stat-cell"><strong>${placesRestantesNum(e)}</strong><span class="meta">Places restantes</span></span>`
            : `<span class="stat-cell"><strong>—</strong><span class="meta">Places illimitées</span></span>`
        }
        <span class="stat-cell"><strong>${e.countdown ? e.countdown.split(' ')[0] : '—'}</strong><span class="meta">${e.countdown ? 'Jours restants' : '—'}</span></span>
      </div>
      ${
        isLimited(e)
          ? `<p class="places-note"><strong>Nombre de places · ${e.capacity}</strong></p>`
          : ''
      }
      ${actions}
      ${socialActions({
        likes: '200',
        comments: '15',
        shares: '200',
        reactors: `${e.reactionCount || 0} réactions`,
        contentId: e.id,
        section: 'evenements',
      })}
      ${
        e.hobbies?.length
          ? `<h2 class="sec">Hobbies concernés</h2>
      <div class="h-scroll hobbies">
        ${e.hobbies
          .map(
            (h) => `
          <div class="hobby-chip"><span class="avatar"></span><span class="meta">${h}</span></div>`
          )
          .join('')}
      </div>`
          : ''
      }
      <button class="hit row-link" data-go="evenement-discussion">
        <span>Centre de Messagerie</span><span>›</span>
      </button>
      <h2 class="sec">Organisateurs</h2>
      <div class="orga-row">
        <span class="avatar"></span>
        <button class="hit grow truncate orga-name" data-go="messages-thread" type="button">
          <strong>${e.orgLabel || 'Organisateur'}</strong><span class="meta"> · ${e.origin === 'municipal' ? 'Municipal' : 'Habitant'}</span>
        </button>
        <button class="hit icon-btn" data-go="messages-thread" title="Message" aria-label="Message">💬</button>
      </div>
      ${plusInfos}
    </div>
    `,
    {
      header: phoneHeader({ title: 'Détails', backTo: 'evenements-liste' }),
      footer: phoneFooter('menu'),
    }
  )
}

function placesRestantesNum(e) {
  if (e.capacity == null) return null
  return Math.max(0, e.capacity - (e.confirmedCount || 0))
}

function evenementForm() {
  const id = getEditEventId()
  const live = id ? getEventFull(id) : null
  const e = id ? getFormEvent(id) : null
  const isCreate = !live || (!live.title && !e?.title)
  const step = getFormStep() || 1
  const admin = isAdminRole()
  const municipal = live?.origin === 'municipal' || (admin && isCreate && live?.origin !== 'citizen')
  const pending = live?.publication === 'pending' || live?.revisionStatus === 'pending'
  const publishedCitizen = live?.publication === 'published' && live?.origin === 'citizen'
  const title = e?.title || ''
  const backTo = admin && !live?.origin?.includes?.('citizen') ? 'admin-evenements' : 'evenements-liste'
  const orgaLabel =
    e?.orgLabel || (municipal || (admin && live?.origin !== 'citizen') ? 'Mairie de Kapan' : 'Rica')
  const isFree = e?.isFree !== false && (!e?.price || e.price === 'Gratuit')
  const capacityUnlimited = e?.capacity == null

  const stepChip = (n, label) =>
    `<button class="hit chip ${step === n ? 'on' : ''}" data-sim="event-form-step:${n}" type="button">${n} · ${label}</button>`

  let fields = ''
  if (step === 1) {
    fields = `
      <label class="field"><span>Titre</span><input type="text" value="${escapeAttr(title)}" placeholder="Titre de l’événement" data-field="title" /></label>
      <label class="field"><span>Organisation</span><input type="text" value="${escapeAttr(orgaLabel)}" readonly data-field="orgLabel" /></label>
      <label class="field"><span>Ville</span><input type="text" value="${escapeAttr(e?.ville || 'Kapan')}" readonly data-field="ville" /></label>
      <label class="field"><span>Catégorie</span>
        <select data-field="category">
          ${['Culture', 'Artistique / Créatif', 'Social / Lifestyle', 'Institutionnel', 'Sport']
            .map(
              (c) =>
                `<option ${e?.category === c ? 'selected' : ''}>${c}</option>`
            )
            .join('')}
        </select>
      </label>
      <label class="field"><span>Description</span><textarea rows="4" placeholder="Décrivez l’événement…" data-field="description">${escapeHtml(e?.description || '')}</textarea></label>
      <label class="field"><span>Photo</span>
        <button class="hit btn block outline" data-sim="upload" type="button">Ajouter une photo (simulé)</button>
      </label>
    `
  } else if (step === 2) {
    fields = `
      <label class="field"><span>Date début</span><input type="text" value="${escapeAttr(e?.dateLabel || '')}" placeholder="ex. Vendredi 16 juin 2026" data-field="dateLabel" /></label>
      <label class="field"><span>Date fin (optionnel)</span><input type="text" value="${escapeAttr(e?.dateEndLabel || '')}" placeholder="ex. Dimanche 17 juin 2026" data-field="dateEndLabel" /></label>
      <label class="field"><span>Heure début</span><input type="text" value="${escapeAttr(e?.time || '')}" placeholder="15:30" data-field="time" /></label>
      <label class="field"><span>Heure fin</span><input type="text" value="${escapeAttr(e?.timeEnd || '')}" placeholder="17:30" data-field="timeEnd" /></label>
      <label class="field"><span>Lieu</span><input type="text" value="${escapeAttr(e?.lieu || '')}" placeholder="Lieu" data-field="lieu" /></label>
      <label class="field"><span>Prix</span>
        <select data-field="priceMode">
          <option value="free" ${isFree ? 'selected' : ''}>Gratuit</option>
          <option value="paid" ${!isFree ? 'selected' : ''}>Montant</option>
        </select>
      </label>
      <label class="field"><span>Montant (si payant)</span><input type="text" value="${escapeAttr(!isFree ? e?.price || '' : '')}" placeholder="ex. 20 €" data-field="priceAmount" ${isFree ? 'disabled' : ''} /></label>
    `
  } else {
    fields = `
      <label class="field"><span>Mode d’inscription</span>
        <select data-field="inscriptionMode">
          <option value="free" ${e?.inscriptionMode === 'free' ? 'selected' : ''}>Libre (sans inscription)</option>
          <option value="immediate" ${!e?.inscriptionMode || e?.inscriptionMode === 'immediate' ? 'selected' : ''}>Inscription immédiate</option>
          <option value="validation" ${e?.inscriptionMode === 'validation' ? 'selected' : ''}>À valider par l’orga</option>
        </select>
      </label>
      <label class="field"><span>Capacité</span>
        <select data-field="capacityMode">
          <option value="limited" ${!capacityUnlimited ? 'selected' : ''}>Nombre limité</option>
          <option value="unlimited" ${capacityUnlimited ? 'selected' : ''}>Illimité</option>
        </select>
      </label>
      <label class="field"><span>Nombre de places</span><input type="number" min="1" value="${e?.capacity != null ? e.capacity : ''}" placeholder="ex. 20" data-field="capacity" ${capacityUnlimited ? 'disabled' : ''} /></label>
      <label class="field"><span>Date limite d’inscription</span><input type="text" value="${escapeAttr(e?.inscriptionDeadline || '')}" placeholder="ex. Vendredi 10 juin 2026" data-field="inscriptionDeadline" /></label>
      <label class="field"><span>Conditions</span><textarea rows="3" placeholder="Conditions de participation…" data-field="conditions">${escapeHtml(e?.conditions || '')}</textarea></label>
    `
  }

  const navSteps =
    step < 3
      ? `
    <div class="row-actions form-step-nav">
      ${
        step > 1
          ? `<button class="hit btn" data-sim="event-form-prev" type="button">Précédent</button>`
          : `<span></span>`
      }
      <button class="hit btn primary" data-sim="event-form-next" type="button">Suivant</button>
    </div>`
      : `
    <div class="row-actions form-step-nav">
      <button class="hit btn" data-sim="event-form-prev" type="button">Précédent</button>
    </div>`

  const habitantCtas =
    step === 3
      ? `
    <p class="meta">${
      publishedCitizen
        ? 'Modification d’un événement publié · la version publique reste visible jusqu’à validation.'
        : 'Il sera visible après validation par la mairie.'
    }</p>
    ${
      live?.correctMotif
        ? `<div class="notice"><strong>Corrections demandées</strong><p class="meta">${escapeHtml(live.correctMotif)}</p></div>`
        : ''
    }
    ${
      live?.refuseMotif && live?.revisionStatus === 'refused'
        ? `<div class="notice"><strong>Révision refusée</strong><p class="meta">${escapeHtml(live.refuseMotif)}</p></div>`
        : ''
    }
    <div class="row-actions">
      <button class="hit btn" data-sim="event-save-draft" type="button">${publishedCitizen ? 'Enregistrer la révision' : 'Enregistrer brouillon'}</button>
      <button class="hit btn" data-sim="event-preview" type="button">Prévisualiser</button>
      <button class="hit btn primary" data-sim="event-submit-validation" type="button">${publishedCitizen ? 'Envoyer la révision' : 'Envoyer pour validation'}</button>
    </div>
    ${
      pending
        ? `<button class="hit btn block outline" data-sim="event-withdraw" type="button">${publishedCitizen ? 'Retirer la révision' : 'Retirer ma demande'}</button>`
        : ''
    }
  `
      : ''
  const adminCtas =
    step === 3
      ? `
    <div class="row-actions">
      <button class="hit btn" data-sim="event-save-draft" type="button">Brouillon</button>
      <button class="hit btn" data-sim="event-preview" type="button">Prévisualiser</button>
      <button class="hit btn primary" data-sim="event-publish" type="button">Publier</button>
    </div>
  `
      : ''

  const pubMeta = publishedCitizen
    ? ` · Publié${live?.revisionStatus ? ` · ${revisionLabel(live)}` : ''}`
    : live?.publication
      ? ` · ${publicationLabel(live.publication)}`
      : ''

  return wrap(
    `
    <div class="form-card" data-event-id="${live?.id || e?.id || ''}">
      <h2 class="sec">${isCreate || !title ? 'Créer un événement' : 'Modifier l’événement'}</h2>
      <p class="meta">${live?.id || e?.id || 'nouvel id'} · ${live?.origin === 'citizen' ? 'Habitant' : municipal ? 'Municipal' : '—'}${pubMeta}</p>
      ${
        !admin && !municipal
          ? `<p class="meta">Créez votre événement. Il sera visible dans l’agenda après validation par la mairie.</p>`
          : ''
      }
      <div class="chips form-steps">
        ${stepChip(1, 'Présentation')}
        ${stepChip(2, 'Pratique')}
        ${stepChip(3, 'Participation')}
      </div>
      ${fields}
      ${navSteps}
      ${admin && (municipal || live?.origin === 'municipal') ? adminCtas : habitantCtas}
    </div>
    `,
    {
      header: phoneHeader({
        title: isCreate || !title ? 'Créer' : 'Modifier',
        backTo,
        chrome: 'form',
      }),
      footer: '',
    }
  )
}

function escapeAttr(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
}

function escapeHtml(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

/** @deprecated alias — use evenementForm */
function evenementGerer() {
  return evenementForm()
}

function evenementOptions() {
  return openContentMenuAlias('event', 'evt-atelier', 'evenement-details')
}

function evenementParticipants() {
  return wrap(evenementParticipantsBody(), {
    header: phoneHeader({ title: 'Liste des participants', backTo: 'evenement-details' }),
    footer: phoneFooter('menu'),
  })
}

function evenementParticipantMenu() {
  return openContentMenuAlias('participant', null, 'evenement-participants', 'part-rouben')
}

function evenementSupprimerConfirm() {
  return wrap(evenementParticipantsBody(), {
    header: phoneHeader({ title: 'Liste des participants', chrome: 'panel' }),
    footer: '',
    overlay: modalShell(
      'Retirer de l’événement',
      `
      <p>Retirer Rouben Sirunyan de l’événement ? Le compte n’est pas supprimé. Annuler = aucun changement.</p>
      `,
      `
      <div class="row-actions confirm-actions">
        <button class="hit btn" data-back type="button">Annuler</button>
        <button class="hit btn primary" data-sim="supprimer" type="button">Retirer</button>
      </div>
      `,
      { center: true }
    ),
  })
}

function evenementSignaler() {
  return wrap(evenementParticipantsBody(), {
    header: phoneHeader({ title: 'Liste des participants', chrome: 'panel' }),
    footer: '',
    overlay: modalShell(
      'Signaler',
      `
      ${sheetOption('Contenu inapproprié', { sim: 'raison-inapproprie' })}
      ${sheetOption('Harcèlement', { sim: 'raison-harcelement' })}
      ${sheetOption('Fausse information', { sim: 'raison-faux' })}
      ${sheetOption('Autre', { sim: 'raison-autre' })}
      <label class="field"><span>Raison</span>
        <textarea rows="3" placeholder="Décrire ici les raisons"></textarea>
      </label>
      `,
      `<button class="hit btn primary block" data-sim="envoyer-signalement">Envoyer</button>`
    ),
  })
}

function evenementValidationTabs(active) {
  const tabs = [
    { id: 'evenement-validation', key: 'attente', label: 'En attente' },
    { id: 'evenement-validation-valide', key: 'valide', label: 'Validé' },
    { id: 'evenement-validation-refuse', key: 'refuse', label: 'Refusé' },
  ]
  return `
    <div class="tabs validation-tabs">
      ${tabs
        .map(
          (t) => `
        <button class="hit tab ${active === t.key ? 'on' : ''}" data-go="${t.id}" type="button">${t.label}</button>`
        )
        .join('')}
    </div>
  `
}

function evenementValidationRows(active) {
  return EVENT_VALIDATION_PEOPLE.map((p) => {
    let refuseGo = 'evenement-validation-refuse'
    let refuseSim = ''
    let refuseClass = ''
    let valideGo = 'evenement-validation-valide'
    let valideClass = ''

    if (active === 'attente') {
      refuseGo = 'evenement-validation-refuse'
      valideGo = 'evenement-validation-valide'
    } else if (active === 'valide') {
      refuseGo = 'evenement-validation-refuse'
      valideGo = null
      valideClass = 'on'
    } else {
      refuseGo = null
      refuseClass = 'on'
      valideGo = 'evenement-annuler-refus'
    }

    const refuseAttrs = refuseGo
      ? `data-go="${refuseGo}"`
      : refuseSim
        ? `data-sim="${refuseSim}"`
        : 'data-sim="deja-refuse"'
    const valideAttrs = valideGo ? `data-go="${valideGo}"` : 'data-sim="deja-valide"'

    return `
      <div class="validation-row">
        <span class="avatar"></span>
        <div class="participant-meta grow">
          <strong>${p.name}</strong>
          <span class="meta">${p.joined}</span>
        </div>
        <button class="hit action-circle" data-go="messages-thread" title="Message" aria-label="Message">💬</button>
        <button class="hit action-circle ${refuseClass}" ${refuseAttrs} title="Refuser" aria-label="Refuser">✕</button>
        <button class="hit action-circle ${valideClass}" ${valideAttrs} title="Valider" aria-label="Valider">✓</button>
      </div>`
  }).join('')
}

function evenementValidation(active = 'attente') {
  return wrap(
    `
    ${evenementValidationTabs(active)}
    <div class="validation-list">
      ${evenementValidationRows(active)}
    </div>
    `,
    {
      header: phoneHeader({ title: 'Validation des participants', backTo: 'evenement-details' }),
      footer: phoneFooter('menu'),
    }
  )
}

function evenementAnnulerRefus() {
  return wrap(
    `
    ${evenementValidationTabs('refuse')}
    <div class="validation-list">
      ${evenementValidationRows('refuse')}
    </div>
    `,
    {
      header: phoneHeader({ title: 'Validation des participants', chrome: 'panel' }),
      footer: '',
      overlay: modalShell(
        'Annuler le refus !',
        `
        <p>Êtes-vous sûr(e) de vouloir annuler le refus de participation pour Lilit Ameni ?</p>
        <label class="field"><span>Raisons</span>
          <textarea rows="4" placeholder="Décrire ici les raisons"></textarea>
        </label>
        `,
        `<button class="hit btn primary block" data-sim="enregistrer">Enregistrer</button>`,
        { center: true }
      ),
    }
  )
}

function evenementDiscussionBody() {
  const selected = ['Aris Margaryan', 'Hakob Hakobyan', 'Anahit S.']
  const others = ['Lilit Ameni', 'Rouben Sirunyan', 'Yester Sullivan']
  return `
    ${search('Rechercher un(e) participant(e)')}
    <h2 class="sec">Participant(e)s sélectionné(e)s</h2>
    <div class="selected-chips">
      ${selected
        .map(
          (n) => `
        <div class="person-chip">
          <span class="avatar sm"></span>
          <span>${n}</span>
          <button class="hit icon-btn chip-x" data-sim="retirer" title="Retirer" aria-label="Retirer">✕</button>
        </div>`
        )
        .join('')}
    </div>
    <div class="participant-list">
      ${others
        .map(
          (n) => `
        <button class="hit participant-row select-row" data-sim="select-participant" type="button">
          <span class="avatar"></span>
          <span class="grow"><strong>${n}</strong></span>
          <span class="meta">+</span>
        </button>`
        )
        .join('')}
    </div>
    <button class="hit btn primary block" data-go="evenement-groupe-modal">Ajouter</button>
  `
}

function evenementDiscussion() {
  return wrap(evenementDiscussionBody(), {
    header: phoneHeader({ title: 'Démarrer une discussion', backTo: 'evenement-participants' }),
    footer: phoneFooter('menu'),
  })
}

function evenementGroupeModal() {
  return wrap(evenementDiscussionBody(), {
    header: phoneHeader({ title: 'Démarrer une discussion', chrome: 'panel' }),
    footer: '',
    overlay: modalShell(
      'Groupe de discussion',
      `
      <p>Voulez-vous créer un groupe de discussion lié à l’événement « Atelier créatif » ou un autre groupe de discussion ?</p>
      `,
      `
      <div class="row-actions confirm-actions">
        <button class="hit btn" data-sim="autre-groupe" type="button">Autre groupe</button>
        <button class="hit btn primary" data-go="messages-thread" type="button">Lié à l’événement</button>
      </div>
      `,
      { center: true }
    ),
  })
}

function evenementCriteres() {
  return wrap(
    `
    <div class="criteria-list">
      <div class="criteria-row">
        <strong>Destiné à</strong>
        <span class="meta">Tout le monde</span>
      </div>
      <div class="criteria-row">
        <strong>Tranche d’âge</strong>
        <span class="meta">20 à 50 ans</span>
      </div>
      <div class="criteria-row">
        <strong>Pays spécifique</strong>
        <span class="meta">Seulement : France</span>
      </div>
    </div>
    `,
    {
      header: phoneHeader({ title: 'Critères de participation', backTo: 'evenement-details' }),
      footer: phoneFooter('menu'),
    }
  )
}

function evenementConditions() {
  return wrap(
    `
    <article class="card conditions-card">
      <h2 class="sec">Conditions de participation</h2>
      ${text(
        'En participant à cet événement, vous acceptez de respecter les consignes des organisateurs, d’arriver à l’heure indiquée et de ne pas céder votre place sans validation préalable.'
      )}
      ${text(
        'Les mineurs doivent être accompagnés. La mairie se réserve le droit de refuser l’accès en cas de non-respect des règles de sécurité ou de civilité.'
      )}
      <p class="meta">Structure wireframe — texte indicatif.</p>
    </article>
    `,
    {
      header: phoneHeader({ title: 'Conditions de participation', backTo: 'evenement-details' }),
      footer: phoneFooter('menu'),
    }
  )
}

function annoncesListe() {
  return wrap(
    `
    <div class="search-row">
      ${search('Rechercher une annonce…')}
      <button class="hit btn" data-go="annonces-filtres">Filtres</button>
    </div>
    ${chips(['Toutes', 'Immobilier', 'Véhicules', 'Maison', 'Services', 'À louer'])}
    <div class="notice">${text('Annonces publiées par la mairie')}</div>
    <div class="row-link static"><span>12 annonces</span><span class="meta">Plus récentes ▾</span></div>
    ${[
      ['Appartement lumineux — 3 pièces', '420 € / mois', 'Immobilier'],
      ['Vélo électrique', 'À préciser', 'Véhicules'],
    ]
      .map(
        ([title, price, cat]) => `
      <article class="card">
        ${photo('Photo annonce…', 'wide')}
        <span class="badge">${cat}</span>
        <strong>${title}</strong>
        <p class="meta">${price} · Centre-ville Kapan · Aujourd’hui</p>
        <button class="hit btn primary" data-go="annonce-details">Voir les détails</button>
      </article>`
      )
      .join('')}
    `,
    {
      header: phoneHeader({ title: 'Petites annonces', backTo: 'accueil-kapan' }),
      footer: phoneFooter('menu'),
    }
  )
}

function annonceDetails() {
  return wrap(
    `
    ${photo('Photo principale…', 'hero')}
    <div class="h-scroll thumbs">${photo('1', 'thumb')}${photo('2', 'thumb')}${photo('3', 'thumb')}${photo('4', 'thumb')}</div>
    <div class="event-title-row">
      <strong class="block-title">Appartement lumineux — 3 pièces</strong>
      <button class="hit icon-btn" data-open-menu="annonce" data-content-id="annonce-1" data-menu-parent="annonce-details" title="Plus d’options" aria-label="Plus d’options">⋯</button>
    </div>
    <p><strong>420 € / mois</strong> · <span class="badge">Annonce officielle</span></p>
    <p class="meta">Centre-ville Kapan</p>
    <h2 class="sec">Description</h2>
    ${text('Texte de l’annonce…')}
    <h2 class="sec">Caractéristiques</h2>
    <div class="grid-2">
      ${['Surface 65 m²', 'Pièces 3', 'Étage 2e / 4', 'Chauffage Collectif']
        .map((x) => `<div class="tile static"><span class="ico-box"></span><span>${x}</span></div>`)
        .join('')}
    </div>
    <p class="meta">● Disponible immédiatement</p>
    <div class="card">
      <strong>Mairie de Kapan</strong>
      <span class="badge">Identité vérifiée</span>
      <div class="row-actions">
        <button class="hit btn" data-sim="message">Envoyer un message</button>
        <button class="hit btn primary" data-sim="appeler">Appeler</button>
      </div>
    </div>
    <div class="sec-row">
      <h2 class="sec">Annonces similaires</h2>
      <button class="hit linkish" data-go="annonces-liste" type="button">Tout voir</button>
    </div>
    <div class="h-scroll similaires-rail">
      ${[
        ['Studio centre', '280 €'],
        ['T2 rénové', '350 €'],
        ['Maison jardin', '650 €'],
      ]
        .map(
          ([t, p]) => `
      <article class="card similaire-card">
        ${photo('Photo…', 'wide')}
        <strong>${t}</strong>
        <p class="meta">${p} · Kapan</p>
      </article>`
        )
        .join('')}
    </div>
    `,
    {
      header: phoneHeader({ title: 'Détails', backTo: 'annonces-liste' }),
      footer: phoneFooter('menu'),
    }
  )
}

function annoncesFiltres() {
  return wrap(
    `${photo('Liste atténuée…', 'dim')}`,
    {
      header: phoneHeader({ title: 'Filtres', chrome: 'panel' }),
      footer: '',
      overlay: modalShell(
        'Filtres et catégories',
        `
        ${chips(['Toutes', 'Immobilier', 'Véhicules', 'Maison', 'Services', 'À louer'])}
        <label class="field"><span>Localisation</span>
          <select><option>Kapan — Tous les quartiers</option></select>
        </label>
        <label class="field"><span>Fourchette de prix</span>
          <div class="row-actions">
            <input type="number" placeholder="Min" />
            <input type="number" placeholder="Max" />
          </div>
        </label>
        <p class="meta">État</p>
        ${chips(['Tout', 'Neuf', 'Très bon état', 'Bon état'])}
        <p class="meta">Date de publication</p>
        ${chips(['Toutes', '24 h', '7 jours', '30 jours'])}
        <p class="meta">Tri</p>
        ${chips(['Plus récentes', 'Prix croissant', 'Prix décroissant'])}
        `,
        `
        <button class="hit linkish" type="button">Réinitialiser</button>
        <button class="hit btn primary block" data-go="annonces-liste">Afficher les annonces</button>
        `
      ),
    }
  )
}

function offreCard(o) {
  const salary = formatSalary(o)
  const mode = modeLabel(o.mode)
  return `
    <article class="card offre-card" data-offre-id="${o.id}">
      ${o.logo ? photo('Logo…', 'thumb') : photo('Logo…', 'thumb')}
      <strong>${o.title}</strong>
      <p class="meta">${o.employer}</p>
      <p class="meta">${[o.city, o.location].filter(Boolean).join(' · ')}</p>
      <p class="meta">${[mode, o.contract, o.time].filter(Boolean).join(' · ')}</p>
      ${salary ? `<p class="meta">${salary}</p>` : ''}
      <p class="meta">${formatPubDate(o.publishedAt)}${o.deadline ? ` · Limite ${formatPubDate(o.deadline)}` : ''}</p>
      <button class="hit btn primary" data-open-offre="${o.id}" type="button">Voir l’offre</button>
    </article>`
}

function emploisQuickChips(active) {
  const items = [
    { id: 'toutes', label: 'Toutes' },
    { id: 'recentes', label: 'Récentes' },
    { id: 'proximite', label: 'À proximité' },
    { id: 'filtres', label: 'Filtres', go: 'emplois-filtres' },
  ]
  const n = countActiveFilters()
  return `<div class="chips">${items
    .map((it, i) => {
      const on = active === it.id || (it.id === 'filtres' && n > 0 && active === 'filtres')
      const label = it.id === 'filtres' && n ? `Filtres (${n})` : it.label
      if (it.go) {
        return `<button class="hit chip ${on ? 'on' : ''}" data-go="${it.go}" type="button">${label}</button>`
      }
      return `<button class="hit chip ${on || (!active && i === 0) ? 'on' : ''}" data-sim="offre-quick:${it.id}" type="button">${label}</button>`
    })
    .join('')}</div>`
}

function emploisAccueil() {
  const list = listPublicOffres({ quick: getEmploiQuick(), query: getEmploiSearch() })
  const admin = isAdminRole()
  return wrap(
    `
    <div class="banner-box">
      ${photo('Bannière emplois…')}
      <strong>Trouvez un emploi près de chez vous</strong>
      <p class="meta">Les opportunités professionnelles de votre ville</p>
    </div>
    ${sousCatGrid(EMPLOI_CATEGORIES.map((c) => ({ label: c.label, go: c.go })))}
    <label class="search"><span class="search-ico">⌕</span><input type="search" placeholder="Rechercher un poste ou un employeur" data-field="offre-search" data-sim-change="offre-search" value="${escapeAttr(
      getEmploiSearch()
    )}" /></label>
    ${getEmploiSearch() ? `<button class="hit linkish" data-sim="offre-search-clear" type="button">Effacer la recherche</button>` : ''}
    ${emploisQuickChips(getEmploiQuick())}
    ${admin ? `<button class="hit btn block outline admin-shortcut" data-sim="offre-create" type="button">Créer une offre</button>` : ''}
    <h2 class="sec">Offres publiées · ${list.length}</h2>
    ${list.length ? list.map(offreCard).join('') : emptyState('Aucune offre pour ces critères')}
    `,
    {
      header: phoneHeader({ title: 'Offres d’emploi', backTo: 'accueil-kapan' }),
      footer: phoneFooter('menu'),
    }
  )
}

function emploisCategorie(catId) {
  setEmploiCategory(catId)
  const label = categoryLabel(catId)
  const list = listPublicOffres({
    category: catId,
    quick: getEmploiQuick(),
    query: getEmploiSearch(),
  })
  return wrap(
    `
    <label class="search"><span class="search-ico">⌕</span><input type="search" placeholder="Rechercher un poste ou un employeur" data-field="offre-search" data-sim-change="offre-search" value="${escapeAttr(
      getEmploiSearch()
    )}" /></label>
    ${emploisQuickChips(getEmploiQuick())}
    <h2 class="sec">${label} · ${list.length}</h2>
    ${list.length ? list.map(offreCard).join('') : emptyState('Aucune offre dans cette catégorie')}
    `,
    {
      header: phoneHeader({ title: label, backTo: 'emplois-liste' }),
      footer: phoneFooter('menu'),
    }
  )
}

function emploisListe() {
  return emploisAccueil()
}

function emploisFiltres() {
  const f = getEmploiFilters()
  return wrap(`${photo('Liste atténuée…', 'dim')}`, {
    header: phoneHeader({ title: 'Filtres', chrome: 'panel', closeIcon: true }),
    footer: '',
    overlay: modalShell(
      'Filtres des offres',
      `
      <label class="field"><span>Secteur</span>
        <select data-field="filtre-secteur">
          <option value="">Tous</option>
          ${EMPLOI_SECTORS.map((s) => `<option ${f.sector === s ? 'selected' : ''}>${s}</option>`).join('')}
        </select>
      </label>
      <label class="field"><span>Contrat</span>
        <select data-field="filtre-contrat">
          <option value="">Tous</option>
          ${EMPLOI_CONTRACTS.map((s) => `<option ${f.contract === s ? 'selected' : ''}>${s}</option>`).join('')}
        </select>
      </label>
      <label class="field"><span>Temps</span>
        <select data-field="filtre-temps">
          <option value="">Tous</option>
          ${EMPLOI_TIMES.map((s) => `<option ${f.time === s ? 'selected' : ''}>${s}</option>`).join('')}
        </select>
      </label>
      <label class="field"><span>Mode</span>
        <select data-field="filtre-mode">
          <option value="">Tous</option>
          ${EMPLOI_MODES.map((m) => `<option value="${m.id}" ${f.mode === m.id ? 'selected' : ''}>${m.label}</option>`).join('')}
        </select>
      </label>
      <label class="field"><span>Expérience</span>
        <input type="text" placeholder="ex. 2 ans" data-field="filtre-experience" value="${escapeAttr(f.experience || '')}" />
      </label>
      <label class="field"><span>Publiée depuis</span>
        <input type="date" data-field="filtre-date" value="${escapeAttr(f.datePub || '')}" />
      </label>
      <label class="field"><span>Localisation</span>
        <input type="text" placeholder="Quartier, lieu…" data-field="filtre-loc" value="${escapeAttr(f.location || '')}" />
      </label>
      `,
      `
      <button class="hit linkish" data-sim="offre-filters-reset" type="button">Réinitialiser</button>
      <button class="hit btn primary block" data-sim="offre-filters-apply" type="button">Afficher les offres</button>
      `
    ),
  })
}

function emploiApplyBlock(o) {
  if (o.state === 'closed') {
    return `<div class="notice"><strong>Cette offre n’accepte plus de candidatures.</strong><p class="meta">L’offre est clôturée. La fiche reste consultable.</p></div>`
  }
  if (o.applyMethod === 'email') {
    return `
      <button class="hit btn primary block" data-sim="offre-apply-email:${o.id}" type="button">Candidater par courriel</button>
      <p class="meta">${o.applyEmail} · <button class="hit linkish" data-sim="offre-copy-email:${o.id}" type="button">Copier</button></p>`
  }
  if (o.applyMethod === 'url') {
    return `<button class="hit btn primary block" data-sim="offre-apply-url:${o.id}" type="button">Candidater sur le site</button>
      <p class="meta">Ouverture d’un lien externe (retour possible).</p>`
  }
  return `<button class="hit btn primary block" data-sim="offre-apply-modalites:${o.id}" type="button">Voir les modalités</button>`
}

function emploiDetails() {
  const id = getOpenOffreId() || 'offre-1'
  const o = getOffre(id)
  if (!o) {
    return wrap(
      `
      <div class="menu-unavailable">
        <strong>Cette offre n’est plus disponible</strong>
        <p class="meta">L’offre a été retirée. Les anciens liens restent sur cet écran.</p>
        <button class="hit btn primary" data-go="emplois-liste" type="button">Retour aux offres</button>
      </div>`,
      {
        header: phoneHeader({ title: 'Détails de l’offre', backTo: 'emplois-liste' }),
        footer: phoneFooter('menu'),
      }
    )
  }
  if (o.state === 'draft' && !isAdminRole()) {
    return wrap(
      `
      <div class="menu-unavailable">
        <strong>Cette offre n’est plus disponible</strong>
        <p class="meta">Brouillon — réservé à l’équipe municipale.</p>
        <button class="hit btn primary" data-go="emplois-liste" type="button">Retour aux offres</button>
      </div>`,
      {
        header: phoneHeader({ title: 'Détails de l’offre', backTo: 'emplois-liste' }),
        footer: phoneFooter('menu'),
      }
    )
  }
  const salary = formatSalary(o)
  const similar = listSimilarOffres(o.id)
  const admin = isAdminRole()
  return wrap(
    `
    ${o.logo ? photo('Logo employeur…', 'hero') : photo('Illustration poste…', 'hero')}
    <div class="event-title-row">
      <strong class="block-title">${o.title}</strong>
      <button class="hit icon-btn" data-open-menu="offre" data-content-id="${o.id}" data-menu-parent="emploi-details" title="Plus d’options" aria-label="Plus d’options">⋯</button>
    </div>
    <p class="meta">${o.employer}${o.city ? ` · ${o.city}` : ''}${o.location ? ` · ${o.location}` : ''}</p>
    <div class="chips">
      <span class="badge">${categoryLabel(o.category)}</span>
      <span class="badge">${o.contract}</span>
      <span class="badge">${o.time}</span>
      <span class="badge">${modeLabel(o.mode)}</span>
      <span class="badge">${stateLabel(o.state)}</span>
    </div>
    ${salary ? `<p><strong>${salary}</strong></p>` : ''}
    ${o.startDate ? `<p class="meta">Prise de poste · ${o.startDate}</p>` : ''}
    ${o.deadline ? `<p class="meta">Date limite · ${formatPubDate(o.deadline)}</p>` : ''}
    ${admin && o.state === 'draft' ? `<p class="meta">Brouillon · visible équipe seulement</p>` : ''}
    ${admin ? `<button class="hit btn block outline admin-shortcut" data-sim="offre-edit:${o.id}" type="button">Modifier cette offre</button>` : ''}
    ${o.presentation ? `<h2 class="sec">Présentation</h2><p>${o.presentation}</p>` : ''}
    ${o.missions ? `<h2 class="sec">Missions</h2><p>${o.missions}</p>` : ''}
    ${o.profile ? `<h2 class="sec">Profil</h2><p>${o.profile}</p>` : ''}
    ${
      o.skills || o.experience || o.education || o.languages
        ? `<h2 class="sec">Compléments</h2>
      <p class="meta">${[o.skills && `Compétences · ${o.skills}`, o.experience && `Expérience · ${o.experience}`, o.education && `Formation · ${o.education}`, o.languages && `Langues · ${o.languages}`]
        .filter(Boolean)
        .join(' · ')}</p>`
        : ''
    }
    ${o.conditions ? `<h2 class="sec">Conditions</h2><p>${o.conditions}</p>` : ''}
    <h2 class="sec" id="offre-modalites">Comment candidater</h2>
    ${
      o.applyMethod === 'modalites' && o.applyInstructions
        ? `<div class="card" id="offre-modalites-body"><p>${o.applyInstructions}</p>${
            o.applyDocs ? `<p class="meta">Documents · ${o.applyDocs}</p>` : ''
          }</div>`
        : o.applyDocs
          ? `<p class="meta">Documents · ${o.applyDocs}</p>`
          : `<p class="meta">${
              o.applyMethod === 'email'
                ? 'Candidature par courriel (ouvre votre messagerie — rien n’est envoyé automatiquement).'
                : o.applyMethod === 'url'
                  ? 'Candidature sur le site externe de l’employeur.'
                  : 'Modalités décrites ci-dessous.'
            }</p>`
    }
    ${emploiApplyBlock(o)}
    ${
      o.phone
        ? `<button class="hit btn block" data-sim="appeler:${escapeAttr(o.phone)}" type="button">Appeler ${o.phone}</button>
      <p class="meta">Appeler ≠ candidature.</p>`
        : ''
    }
    ${
      o.employerAbout
        ? `<h2 class="sec">À propos de l’employeur</h2><p>${o.employerAbout}</p>`
        : ''
    }
    ${
      o.economyFicheId
        ? `<button class="hit btn outline block" data-open-fiche="${o.economyFicheId}" data-go="dir-economie-entreprises-fiche-infos" type="button">Voir la fiche de l’employeur</button>`
        : ''
    }
    ${
      similar.length
        ? `<div class="sec-row"><h2 class="sec">Offres similaires</h2><button class="hit linkish" data-go="emplois-liste" type="button">Tout voir</button></div>
    <div class="h-scroll similaires-rail">${similar
      .map(
        (s) => `
      <article class="card similaire-card">
        ${photo('Photo…', 'wide')}
        <strong>${s.title}</strong>
        <p class="meta">${s.employer} · ${s.contract}</p>
        <button class="hit btn primary" data-open-offre="${s.id}" type="button">Voir</button>
      </article>`
      )
      .join('')}</div>`
        : ''
    }
    `,
    {
      header: phoneHeader({ title: 'Détails de l’offre', backTo: 'emplois-liste' }),
      footer: phoneFooter('menu'),
    }
  )
}

function emploiForm() {
  const id = getEditOffreId()
  const o = id ? getOffre(id) : null
  if (!o) {
    return wrap(emptyState('Aucune offre en cours d’édition'), {
      header: phoneHeader({ title: 'Offre', chrome: 'form', backTo: 'admin-offres' }),
      footer: '',
    })
  }
  const step = getEmploiFormStep() || 1
  const backAdmin = `<button class="hit linkish" data-go="admin-offres" type="button">Retour liste BO</button>`
  let body = ''
  if (step === 1) {
    body = `
      <h2 class="sec">1 · Employeur et poste</h2>
      <label class="field"><span>Employeur</span><input type="text" data-field="offre-employer" value="${escapeAttr(o.employer)}" /></label>
      <label class="field"><span>Intitulé</span><input type="text" data-field="offre-title" value="${escapeAttr(o.title)}" /></label>
      <label class="field"><span>Catégorie</span>
        <select data-field="offre-category">${EMPLOI_CATEGORIES.map(
          (c) => `<option value="${c.id}" ${o.category === c.id ? 'selected' : ''}>${c.label}</option>`
        ).join('')}</select>
      </label>
      <label class="field"><span>Secteur</span>
        <select data-field="offre-sector">${EMPLOI_SECTORS.map(
          (s) => `<option ${o.sector === s ? 'selected' : ''}>${s}</option>`
        ).join('')}</select>
      </label>
      <label class="field"><span>Ville</span><input type="text" data-field="offre-city" value="${escapeAttr(o.city)}" /></label>
      <label class="field"><span>Lieu du poste</span><input type="text" data-field="offre-location" value="${escapeAttr(o.location || '')}" placeholder="Adresse ou zone" /></label>
      <p class="meta">Logo facultatif · fiche Économie si liée (non forcée)</p>
    `
  } else if (step === 2) {
    body = `
      <h2 class="sec">2 · Description</h2>
      <label class="field"><span>Présentation</span><textarea rows="3" data-field="offre-presentation">${escapeAttr(o.presentation || '')}</textarea></label>
      <label class="field"><span>Missions</span><textarea rows="3" data-field="offre-missions">${escapeAttr(o.missions || '')}</textarea></label>
      <label class="field"><span>Profil</span><textarea rows="2" data-field="offre-profile">${escapeAttr(o.profile || '')}</textarea></label>
      <label class="field"><span>Compétences</span><input type="text" data-field="offre-skills" value="${escapeAttr(o.skills || '')}" /></label>
      <label class="field"><span>Expérience</span><input type="text" data-field="offre-experience" value="${escapeAttr(o.experience || '')}" /></label>
      <label class="field"><span>Formation / langues</span><input type="text" data-field="offre-education" value="${escapeAttr(
        [o.education, o.languages].filter(Boolean).join(' · ')
      )}" /></label>
    `
  } else if (step === 3) {
    body = `
      <h2 class="sec">3 · Conditions</h2>
      <label class="field"><span>Contrat</span>
        <select data-field="offre-contract">${EMPLOI_CONTRACTS.map(
          (c) => `<option ${o.contract === c ? 'selected' : ''}>${c}</option>`
        ).join('')}</select>
      </label>
      <label class="field"><span>Temps</span>
        <select data-field="offre-time">${EMPLOI_TIMES.map(
          (c) => `<option ${o.time === c ? 'selected' : ''}>${c}</option>`
        ).join('')}</select>
      </label>
      <label class="field"><span>Mode</span>
        <select data-field="offre-mode">${EMPLOI_MODES.map(
          (m) => `<option value="${m.id}" ${o.mode === m.id ? 'selected' : ''}>${m.label}</option>`
        ).join('')}</select>
      </label>
      <label class="field"><span>Rémunération (facultatif)</span><input type="text" data-field="offre-salary" value="${escapeAttr(
        o.salary?.amount || ''
      )}" placeholder="Montant ou fourchette" /></label>
      <label class="field"><span>Prise de poste</span><input type="text" data-field="offre-start" value="${escapeAttr(o.startDate || '')}" /></label>
      <label class="field"><span>Date limite</span><input type="date" data-field="offre-deadline" value="${escapeAttr(o.deadline || '')}" /></label>
    `
  } else {
    body = `
      <h2 class="sec">4 · Candidature</h2>
      <label class="field"><span>Méthode</span>
        <select data-field="offre-apply-method">
          <option value="email" ${o.applyMethod === 'email' ? 'selected' : ''}>Courriel</option>
          <option value="url" ${o.applyMethod === 'url' ? 'selected' : ''}>Site externe</option>
          <option value="modalites" ${o.applyMethod === 'modalites' ? 'selected' : ''}>Modalités</option>
        </select>
      </label>
      <label class="field"><span>Courriel</span><input type="email" data-field="offre-apply-email" value="${escapeAttr(o.applyEmail || '')}" /></label>
      <label class="field"><span>Lien</span><input type="url" data-field="offre-apply-url" value="${escapeAttr(o.applyUrl || '')}" placeholder="https://…" /></label>
      <label class="field"><span>Instructions</span><textarea rows="3" data-field="offre-apply-instructions">${escapeAttr(
        o.applyInstructions || ''
      )}</textarea></label>
      <label class="field"><span>Documents</span><input type="text" data-field="offre-docs" value="${escapeAttr(o.applyDocs || '')}" /></label>
      <label class="field"><span>Téléphone public</span><input type="text" data-field="offre-phone" value="${escapeAttr(o.phone || '')}" /></label>
      <label class="field"><span>Présentation employeur</span><textarea rows="2" data-field="offre-employer-about">${escapeAttr(
        o.employerAbout || ''
      )}</textarea></label>
      <div class="notice"><strong>Récap</strong><p class="meta">${o.title || 'Sans titre'} · ${o.employer || '—'} · ${categoryLabel(
        o.category
      )} · ${stateLabel(o.state)}</p></div>
    `
  }
  return wrap(
    `
    <div class="form-card" data-offre-id="${o.id}">
      ${backAdmin}
      <p class="meta">Étape ${step} / 4 · même formulaire public / BO</p>
      ${body}
      <div class="row-actions">
        ${step > 1 ? `<button class="hit btn" data-sim="offre-step:${step - 1}" type="button">Retour</button>` : ''}
        ${step < 4 ? `<button class="hit btn primary" data-sim="offre-step:${step + 1}" type="button">Continuer</button>` : ''}
      </div>
      <div class="row-actions">
        <button class="hit btn" data-sim="offre-save-draft" type="button">Brouillon</button>
        <button class="hit btn" data-sim="offre-preview:${o.id}" type="button">Prévisualiser</button>
        <button class="hit btn primary" data-sim="offre-publish:${o.id}" type="button">${
          o.state === 'published' ? 'Enregistrer' : 'Publier'
        }</button>
      </div>
    </div>
    `,
    {
      header: phoneHeader({
        title: o.state === 'draft' && !o.title ? 'Nouvelle offre' : 'Modifier l’offre',
        chrome: 'form',
        backTo: 'admin-offres',
      }),
      footer: '',
    }
  )
}

function emploiPreview() {
  const id = getEditOffreId() || getOpenOffreId()
  const o = getOffre(id)
  if (!o) {
    return wrap(emptyState('Offre introuvable'), {
      header: phoneHeader({ title: 'Prévisualisation', chrome: 'form', backTo: 'emploi-form' }),
      footer: '',
    })
  }
  setOpenOffreId(id)
  const salary = formatSalary(o)
  return wrap(
    `
    <div class="notice"><strong>Prévisualisation</strong><p class="meta">Aperçu · ${stateLabel(o.state)} · brouillon non public</p></div>
    ${o.logo ? photo('Logo…', 'hero') : photo('Illustration…', 'hero')}
    <strong class="block-title">${o.title || 'Sans titre'}</strong>
    <p class="meta">${o.employer || '—'} · ${o.city || ''}</p>
    <p class="meta">${[categoryLabel(o.category), o.contract, modeLabel(o.mode)].filter(Boolean).join(' · ')}</p>
    ${salary ? `<p><strong>${salary}</strong></p>` : ''}
    ${o.presentation ? `<h2 class="sec">Présentation</h2><p>${o.presentation}</p>` : ''}
    ${o.missions ? `<h2 class="sec">Missions</h2><p>${o.missions}</p>` : ''}
    <button class="hit btn primary block" data-sim="offre-edit:${o.id}" type="button">Retour au formulaire</button>
    `,
    {
      header: phoneHeader({ title: 'Prévisualisation', chrome: 'form', backTo: 'emploi-form' }),
      footer: '',
    }
  )
}

function emploiConfirmClose() {
  const id = getOpenOffreId() || getEditOffreId()
  const o = getOffre(id)
  return menuConfirmShell({
    title: 'Clôturer l’offre',
    body: `Clôturer « ${o?.title || 'cette offre'} » ? Elle n’acceptera plus de candidatures et sortira des listes ordinaires. La fiche restera accessible par lien.`,
    confirmSim: `offre-close:${id}`,
    confirmLabel: 'Clôturer',
  })
}

function emploiConfirmDelete() {
  const id = getOpenOffreId() || getEditOffreId()
  const o = getOffre(id)
  return menuConfirmShell({
    title: 'Supprimer l’offre',
    body: `Supprimer « ${o?.title || 'cette offre'} » ? Les anciens liens afficheront « Cette offre n’est plus disponible ».`,
    confirmSim: `offre-delete:${id}`,
    confirmLabel: 'Supprimer',
  })
}

function adminOffres() {
  const tab = getAdminOffreTab()
  const list = listAdminOffres({ tab })
  return wrap(
    `
    <h2 class="sec">Offres d’emploi</h2>
    <button class="hit btn primary block" data-sim="offre-create" type="button">+ Créer une offre</button>
    <div class="tabs">
      ${['toutes', 'brouillons', 'publiees', 'cloturees']
        .map((t) => {
          const labels = { toutes: 'Toutes', brouillons: 'Brouillons', publiees: 'Publiées', cloturees: 'Clôturées' }
          return `<button class="hit tab ${tab === t ? 'on' : ''}" data-sim="offre-admin-tab:${t}" type="button">${labels[t]}</button>`
        })
        .join('')}
    </div>
    ${list
      .map(
        (o) => `
      <button class="hit row-link" data-open-offre="${o.id}" type="button">
        <span>
          <strong>${o.title || 'Sans titre'}</strong><br/>
          <span class="meta">${o.employer || '—'} · ${o.city || ''} · ${categoryLabel(o.category)} · ${stateLabel(
            o.state
          )}${o.publishedAt ? ` · ${formatPubDate(o.publishedAt)}` : ''}</span>
        </span>
        <span>›</span>
      </button>
      <div class="row-actions">
        <button class="hit btn outline" data-sim="offre-edit:${o.id}" type="button">Modifier</button>
        ${
          o.state === 'draft'
            ? `<button class="hit btn primary" data-sim="offre-publish:${o.id}" type="button">Publier</button>`
            : o.state === 'published'
              ? `<button class="hit btn" data-sim="offre-close-confirm:${o.id}" type="button">Clôturer</button>`
              : ''
        }
      </div>`
      )
      .join('') || emptyState('Aucune offre')}
    `,
    {
      header: phoneHeader({ title: 'Offres', backTo: 'admin-home' }),
    }
  )
}

function adminOffreForm() {
  return emploiForm()
}

function urgenceNumeros() {
  // Single screen — NOT a directory (no 4 cats, no Autour de vous)
  return wrap(
    `
    <div class="banner-box">
      <div class="rowish" style="align-items:center;gap:12px">
        <div class="grow">
          <strong>En cas d’urgence</strong>
          ${text('Appelez immédiatement')}
        </div>
        ${photo('Sirène…', 'thumb')}
      </div>
    </div>
    <h2 class="sec">Numéros principaux</h2>
    ${[
      ['Urgence médicale', 'Aide médicale urgente', '15'],
      ['Police — Secours', 'Pour toute situation d’urgence', '17'],
      ['Pompiers', 'Incendies, accidents, secours', '18'],
      ['Urgence par SMS', 'Pour les personnes sourdes', '114'],
      ['Violence conjugale', 'Texte…', '3919'],
      ['Enfance en danger', 'Signalement et protection', '119'],
      ['Centre antipoison', 'En cas d’intoxication', '120'],
    ]
      .map(
        ([l, d, n]) => `
      <article class="card rowish">
        <span class="ico-box"></span>
        <div class="grow">
          <strong>${l}</strong>
          <p class="meta">${d}</p>
        </div>
        <button class="hit btn primary" data-sim="appeler:${n}" title="Appeler">☎ ${n}</button>
      </article>`
      )
      .join('')}
    <div class="notice">
      <strong>Restez en sécurité</strong>
      ${text('N’utilisez ces numéros qu’en cas de réelle urgence.')}
    </div>
    `,
    {
      header: phoneHeader({ title: 'N° Urgence', backTo: 'accueil-kapan' }),
      footer: phoneFooter('menu'),
    }
  )
}

function messages(tab = 'miasin') {
  const context = tab === 'maville' ? 'maville' : 'miasin'
  setMsgTab(context)
  const q = getMsgSearch()
  const list = listConversations(context, { query: q })
  return wrap(
    `
    <div class="tabs">
      <button class="hit tab ${context === 'miasin' ? 'on' : ''}" data-sim="msg-tab:miasin" type="button">Messages MIASIN</button>
      <button class="hit tab ${context === 'maville' ? 'on' : ''}" data-sim="msg-tab:maville" type="button">Messages Ma Ville</button>
    </div>
    ${
      context === 'maville'
        ? `<p class="meta msg-city-label">Ville active · Kapan</p>`
        : `<p class="meta msg-city-label">Réseau MIASIN · hors ville</p>`
    }
    <label class="field msg-search">
      <span class="visually-hidden">Rechercher</span>
      <input type="search" placeholder="Rechercher une conversation…" value="${escapeAttr(q)}" data-field="msg-search" data-sim-change="msg-search" />
    </label>
    <button class="hit btn primary block" data-sim="msg-new" type="button">Nouvelle conversation</button>
    ${
      list.length
        ? list
            .map((c) => {
              const last = lastVisibleMessage(c)
              const unread = unreadCount(c)
              const preview = last?.deletedForEveryone
                ? 'Message supprimé'
                : last?.attachment && !last?.text
                  ? `Pièce jointe · ${last.attachment.name || last.attachment.kind}`
                  : last?.text || 'Aucun message'
              return `
      <button class="hit row-link msg-row ${unread ? 'unread' : ''}" data-sim="msg-open:${c.id}" type="button">
        <span class="avatar"></span>
        <span class="grow">
          <strong>${c.peerName}</strong>
          ${context === 'maville' && c.city ? `<span class="meta"> · ${c.city}</span>` : ''}
          <br/><span class="meta">${escapeHtml(preview)}</span>
        </span>
        <span class="msg-meta-right">
          <span class="meta">${formatMsgTime(c.updatedAt)}</span>
          ${unread ? `<span class="badge unread-badge">${unread}</span>` : ''}
        </span>
      </button>`
            })
            .join('')
        : q
          ? emptyState('Aucun résultat pour cette recherche')
          : emptyState('Aucune conversation')
    }
    `,
    {
      header: phoneHeader({ title: 'Messages', backTo: 'accueil-kapan' }),
      footer: phoneFooter('messages'),
    }
  )
}

function messagesNouvelle() {
  const tab = getMsgTab()
  const context = tab === 'maville' ? 'maville' : 'miasin'
  const back = context === 'maville' ? 'messages-maville' : 'messages'
  return wrap(
    `
    <h2 class="sec">Nouvelle conversation</h2>
    <p class="meta">Contexte · ${context === 'maville' ? 'Ma Ville · Kapan' : 'MIASIN'}</p>
    <p class="meta">Choisissez un contact démo. Une conversation existante dans ce contexte sera réutilisée.</p>
    ${MSG_CONTACTS.map(
      (c) => `
    <button class="hit row-link" data-sim="msg-start:${c.id}" type="button">
      <span class="avatar"></span>
      <span><strong>${c.name}</strong><br/><span class="meta">${c.id}</span></span>
      <span>›</span>
    </button>`
    ).join('')}
    `,
    {
      header: phoneHeader({ title: 'Nouvelle conversation', chrome: 'panel', closeIcon: true }),
      footer: '',
    }
  )
}

function messagesThread() {
  const id = getOpenConversationId()
  const c = id ? getConversation(id) : null
  if (!c) {
    return wrap(emptyState('Conversation indisponible'), {
      header: phoneHeader({ title: 'Conversation', chrome: 'panel', closeIcon: true }),
      footer: '',
    })
  }
  const viewer = getMsgViewerId()
  const replyId = getReplyTo()
  const editId = getEditMsgId()
  const attach = getPendingAttach()
  const replyMsg = replyId ? getMessage(c.id, replyId) : null
  const backList = c.context === 'maville' ? 'messages-maville' : 'messages'
  const msgs = (c.messages || []).filter((m) => !(m.deletedForMe || []).includes(viewer))

  const bubbles = msgs.length
    ? msgs
        .map((m) => {
          const mine = m.from === viewer
          if (m.deletedForEveryone) {
            return `<div class="bubble ${mine ? 'out' : 'in'} deleted"><em>Message supprimé</em></div>`
          }
          const quoted = m.replyTo ? getMessage(c.id, m.replyTo) : null
          const quoteHtml = quoted
            ? `<div class="msg-quote">${
                quoted.deletedForEveryone
                  ? 'Message supprimé'
                  : escapeHtml(quoted.text || quoted.attachment?.name || '…')
              }</div>`
            : ''
          const att = m.attachment
            ? `<div class="msg-attach"><span class="meta">${
                m.attachment.kind === 'photo'
                  ? 'Photo'
                  : m.attachment.kind === 'video'
                    ? 'Vidéo'
                    : 'Fichier'
              } · ${escapeHtml(m.attachment.name)}</span>
              ${
                m.attachment.previewUrl
                  ? `<img class="msg-thumb" src="${escapeAttr(m.attachment.previewUrl)}" alt="" />`
                  : ''
              }</div>`
            : ''
          const reactions = m.reactions
            ? Object.entries(m.reactions)
                .map(([e, users]) => `<span class="msg-react">${e} ${users.length}</span>`)
                .join('')
            : ''
          return `
      <div class="bubble ${mine ? 'out' : 'in'}" data-msg-id="${m.id}">
        ${quoteHtml}
        <p>${escapeHtml(m.text || '')}</p>
        ${att}
        <p class="meta">${formatMsgTime(m.at)}${m.edited ? ' · Modifié' : ''}</p>
        ${reactions ? `<div class="msg-reacts">${reactions}</div>` : ''}
        <div class="msg-actions">
          <button class="hit linkish" data-sim="msg-reply:${m.id}" type="button">Répondre</button>
          <button class="hit linkish" data-sim="msg-react:${m.id}" type="button">Réagir</button>
          ${m.text ? `<button class="hit linkish" data-sim="msg-copy:${m.id}" type="button">Copier</button>` : ''}
          ${
            mine
              ? `<button class="hit linkish" data-sim="msg-edit:${m.id}" type="button">Modifier</button>
                 <button class="hit linkish" data-sim="msg-del-all:${m.id}" type="button">Supprimer pour tous</button>`
              : `<button class="hit linkish" data-sim="msg-report:${m.id}" type="button">Signaler</button>`
          }
          <button class="hit linkish" data-sim="msg-del-me:${m.id}" type="button">Supprimer pour moi</button>
        </div>
      </div>`
        })
        .join('')
    : emptyState('Aucun message pour l’instant')

  const editBlock =
    editId
      ? `
    <div class="notice">
      <strong>Modifier le message</strong>
      <label class="field"><textarea rows="2" data-field="msg-edit-text">${escapeHtml(
        getMessage(c.id, editId)?.text || ''
      )}</textarea></label>
      <div class="row-actions">
        <button class="hit btn" data-sim="msg-edit-cancel" type="button">Annuler</button>
        <button class="hit btn primary" data-sim="msg-edit-save:${editId}" type="button">Enregistrer les modifications</button>
      </div>
    </div>`
      : ''

  return wrap(
    `
    <div class="chat-head-meta">
      <p class="meta">${c.context === 'maville' ? `Ma Ville · ${c.city || 'Kapan'}` : 'MIASIN'}</p>
    </div>
    <div class="chat">${bubbles}</div>
    ${editBlock}
    ${
      replyMsg
        ? `<div class="msg-reply-bar">
        <span class="meta">Réponse à · ${
          replyMsg.deletedForEveryone ? 'Message supprimé' : escapeHtml(replyMsg.text || '…')
        }</span>
        <button class="hit linkish" data-sim="msg-reply-cancel" type="button">Annuler</button>
      </div>`
        : ''
    }
    ${
      attach
        ? `<div class="msg-attach-pending">
        <span class="meta">${attach.kind} · ${escapeHtml(attach.name)}</span>
        ${attach.previewUrl ? `<img class="msg-thumb" src="${escapeAttr(attach.previewUrl)}" alt="" />` : ''}
        <button class="hit linkish" data-sim="msg-attach-clear" type="button">Retirer la pièce</button>
      </div>`
        : ''
    }
    <div class="composer-bar chat-composer">
      <button class="hit icon-btn" data-sim="msg-attach-menu" type="button" title="Ajouter">＋</button>
      <input type="text" placeholder="Écrire un message…" data-field="msg-text" />
      <button class="hit btn primary" data-sim="msg-send" type="button">Envoyer</button>
    </div>
    `,
    {
      header: phoneHeader({
        title: c.peerName,
        chrome: 'panel',
        backTo: backList,
        extraRight: `<button class="hit icon-btn" data-sim="msg-thread-info" type="button" title="Infos">⋯</button>`,
      }),
      footer: '',
    }
  )
}

function messagesAttachSheet() {
  return wrap(`${photo('Fond…', 'dim')}`, {
    header: phoneHeader({ title: 'Ajouter', chrome: 'panel', closeIcon: true }),
    footer: '',
    overlay: modalShell(
      'Ajouter une pièce',
      `
      ${sheetOption('Photo', { sim: 'msg-attach:photo' })}
      ${sheetOption('Vidéo', { sim: 'msg-attach:video' })}
      ${sheetOption('Fichier', { sim: 'msg-attach:file' })}
      `,
      `<button class="hit btn block" data-back type="button">Fermer</button>`
    ),
  })
}

function messagesReactSheet() {
  const emojis = ['👍', '❤️', '😂', '😮', '😢']
  return wrap(`${photo('Fond…', 'dim')}`, {
    header: phoneHeader({ title: 'Réagir', chrome: 'panel', closeIcon: true }),
    footer: '',
    overlay: modalShell(
      'Réaction',
      `
      <div class="chips">
        ${emojis.map((e) => `<button class="hit chip" data-sim="msg-react-pick:${e}" type="button">${e}</button>`).join('')}
      </div>
      <button class="hit btn block outline" data-sim="msg-react-pick:" type="button">Retirer ma réaction</button>
      `,
      `<button class="hit btn block" data-back type="button">Fermer</button>`
    ),
  })
}

function communautesList(kind = 'groupes') {
  const tab = getCommunauteKindTab(kind)
  const q = getCommunauteSearch(kind)
  const filter = getCommunauteFilter(kind)
  const title = kindLabel(kind)
  const mes = mesTabLabel(kind)
  const unit = kind === 'clubs' ? 'club' : 'groupe'
  const list = listCommunautes(kind, { tab, query: q, filter })
  const posts = tab === 'actualites' ? feedPosts(kind, { query: q, filter }) : []
  const showCats = filter === 'categories' || (filter && filter.startsWith('cat:'))

  const tabs = `
    <div class="tabs h-scroll">
      <button class="hit tab ${tab === 'actualites' ? 'on' : ''}" data-sim="comm-tab:${kind}:actualites" type="button">Actualités</button>
      <button class="hit tab ${tab === 'mes' ? 'on' : ''}" data-sim="comm-tab:${kind}:mes" type="button">${mes}</button>
      <button class="hit tab ${tab === 'invitations' ? 'on' : ''}" data-sim="comm-tab:${kind}:invitations" type="button">Invitations</button>
      <button class="hit tab ${tab === 'suggestions' ? 'on' : ''}" data-sim="comm-tab:${kind}:suggestions" type="button">Suggestions</button>
    </div>`

  const filters = `
    <div class="chips filter-chips">
      <button class="hit chip ${filter === 'populaire' || !filter ? 'on' : ''}" data-sim="comm-filter:${kind}:populaire" type="button">🔥 Populaire</button>
      <button class="hit chip ${showCats ? 'on' : ''}" data-sim="comm-filter:${kind}:categories" type="button">Catégories ▾</button>
    </div>
    ${
      showCats
        ? `<div class="chips filter-chips cat-chip-row">
      ${COMM_CATEGORIES.map(
        (cat) => `
        <button class="hit chip ${filter === `cat:${cat.id}` ? 'on' : ''}" data-sim="comm-filter:${kind}:cat:${cat.id}" type="button">
          <span class="comm-cat-icon" aria-hidden="true">${cat.icon}</span> ${cat.label}
        </button>`
      ).join('')}
    </div>`
        : ''
    }`

  let body = ''
  if (tab === 'actualites') {
    body = posts.length
      ? posts
          .map((p) => {
            const c = p.community
            const cat = c.category || COMM_CATEGORIES.find((x) => x.id === c.categoryId)
            const join =
              c.myState === 'member'
                ? ''
                : c.myState === 'pending'
                  ? `<button class="hit btn outline" data-sim="comm-cancel-join:${c.id}" type="button">Annuler</button>`
                  : `<button class="hit btn outline" data-sim="comm-join:${c.id}" type="button">Rejoindre</button>`
            return `
      <article class="comm-feed-card">
        <div class="comm-feed-head">
          <button class="hit row-link bare" data-sim="comm-open:${c.id}" type="button">
            <span class="comm-cat-icon lg" aria-hidden="true">${cat?.icon || '🏷️'}</span>
            <span class="grow"><strong>${escapeHtml(c.name)}</strong></span>
          </button>
          ${join}
        </div>
        <div class="post-head">
          <span class="avatar"></span>
          <div class="grow">
            <strong>${escapeHtml(p.author)}</strong>
            <p class="meta">${formatMsgTime(p.at)} · ${escapeHtml(c.name)}</p>
          </div>
        </div>
        <p>${escapeHtml(p.body)}</p>
        ${socialActions({
          likes: String(p.reactions || 0),
          comments: String(p.comments || 0),
          shares: '0',
          contentId: p.id,
          section: c.kind,
        })}
      </article>`
          })
          .join('')
      : q
        ? emptyState('Aucun résultat')
        : emptyState(`Aucune actualité ${kind === 'clubs' ? 'de club' : 'de groupe'}`)
  } else if (tab === 'invitations') {
    body = list.length
      ? list
          .map((c) => {
            const cat = c.category || COMM_CATEGORIES.find((x) => x.id === c.categoryId)
            const inv = c.invitationForViewer || {}
            return `
      <article class="comm-feed-card">
        <button class="hit row-link bare" data-sim="comm-open:${c.id}" type="button">
          <span class="comm-cat-icon lg" aria-hidden="true">${cat?.icon || '🏷️'}</span>
          <span class="grow">
            <strong>${escapeHtml(c.name)}</strong>
            <br/><span class="meta">${c.membersCount} membres · ${accessLabel(c)}</span>
            <br/><span class="meta">Invité par ${escapeHtml(inv.fromName || '—')} · Admin ${escapeHtml(
              inv.adminName || inv.fromName || '—'
            )}</span>
          </span>
        </button>
        <div class="row-actions">
          <button class="hit btn outline" data-sim="comm-ignore-invite:${c.id}" type="button">Ignorer</button>
          <button class="hit btn primary" data-sim="comm-accept-invite:${c.id}" type="button">Accepter</button>
        </div>
      </article>`
          })
          .join('')
      : emptyState('Aucune invitation')
  } else if (tab === 'suggestions') {
    body = list.length
      ? list
          .map((c) => {
            const cat = c.category || COMM_CATEGORIES.find((x) => x.id === c.categoryId)
            return `
      <article class="comm-feed-card">
        <button class="hit row-link bare" data-sim="comm-open:${c.id}" type="button">
          <span class="comm-cat-icon lg" aria-hidden="true">${cat?.icon || '🏷️'}</span>
          <span class="grow">
            <strong>${escapeHtml(c.name)}</strong>
            <br/><span class="meta">${escapeHtml(c.description)}</span>
            <br/><span class="meta">${c.membersCount} membres · ${cat?.label || ''}</span>
          </span>
        </button>
        <div class="row-actions">
          <button class="hit btn outline" data-sim="comm-ignore-suggest:${c.id}" type="button">Ignorer</button>
          <button class="hit btn primary" data-sim="comm-join:${c.id}" type="button">Rejoindre</button>
        </div>
      </article>`
          })
          .join('')
      : emptyState('Aucune suggestion')
  } else {
    // mes
    body = list.length
      ? list
          .map((c) => {
            const cat = c.category || COMM_CATEGORIES.find((x) => x.id === c.categoryId)
            const friends = (c.friendsIn || []).slice(0, 4)
            return `
      <button class="hit row-link comm-card" data-sim="comm-open:${c.id}" type="button">
        <span class="comm-cat-icon lg" aria-hidden="true">${cat?.icon || '🏷️'}</span>
        <span class="grow">
          <strong>${escapeHtml(c.name)}</strong>
          <br/><span class="meta"><span class="comm-cat-icon sm">${cat?.icon || ''}</span> ${
            cat?.label || ''
          } · ${c.membersCount} membres</span>
          <br/><span class="meta">${escapeHtml(c.description)}</span>
          ${
            friends.length
              ? `<br/><span class="meta">${avatar(Math.min(friends.length, 3))} ${friends.length} ami(e)s</span>`
              : ''
          }
        </span>
        <span>›</span>
      </button>`
          })
          .join('')
      : q
        ? emptyState('Aucun résultat')
        : emptyState(kind === 'clubs' ? 'Aucune adhésion à un club' : 'Aucune adhésion à un groupe')
  }

  return wrap(
    `
    <div class="comm-list-head">
      <h2 class="sec">${title}</h2>
      <button class="hit icon-btn roundish" data-sim="comm-create-start:${kind}" type="button" title="Créer">+</button>
    </div>
    <label class="field">
      <input type="search" placeholder="Rechercher un ${unit}…" value="${escapeAttr(q)}" data-field="comm-search" data-sim-change="comm-search:${kind}" />
    </label>
    ${tabs}
    ${filters}
    ${body}
    `,
    {
      header: phoneHeader({ title, backTo: 'accueil-kapan' }),
      footer: phoneFooter('menu'),
    }
  )
}

function communauteActionButtons(c) {
  const unit = c.kind === 'clubs' ? 'le club' : 'le groupe'
  const inviteBtn = canInvite(c)
    ? `<button class="hit btn primary" data-sim="comm-invite:${c.id}" type="button">Inviter</button>`
    : ''
  if (c.myState === 'member') {
    return `
      <div class="row-actions">
        <button class="hit btn outline" data-sim="comm-leave-ask:${c.id}" type="button">Quitter ${unit}</button>
        ${inviteBtn}
      </div>`
  }
  if (c.myState === 'pending') {
    return `
      <div class="notice"><strong>Demande en attente</strong></div>
      <button class="hit btn outline block" data-sim="comm-cancel-join:${c.id}" type="button">Annuler ma demande</button>`
  }
  if (c.access === 'open' || c.autoValidateMembers) {
    return `<button class="hit btn primary block" data-sim="comm-join:${c.id}" type="button">Rejoindre</button>`
  }
  return `<button class="hit btn primary block" data-sim="comm-join:${c.id}" type="button">Demander à rejoindre</button>`
}

function communautePage(forcedView) {
  const id = getOpenCommunauteId()
  const c = id ? getCommunaute(id) : null
  if (!c) {
    return wrap(emptyState('Communauté indisponible'), {
      header: phoneHeader({ title: 'Communauté', backTo: 'accueil-kapan' }),
      footer: phoneFooter('menu'),
    })
  }
  const viewRaw = forcedView || getCommunautePageView() || 'publications'
  const view =
    viewRaw === 'fil' || viewRaw === 'publications'
      ? 'publications'
      : viewRaw === 'apropos' || viewRaw === 'informations'
        ? 'informations'
        : viewRaw === 'membres'
          ? 'informations'
          : viewRaw === 'evenements'
            ? 'evenements'
            : 'publications'
  const listBack = c.kind === 'clubs' ? 'communautes-clubs' : 'communautes-groupes'
  const headerTitle = kindLabel(c.kind)
  const admin = isCommunauteAdmin(c)
  const modo = isCommunauteModo(c)
  const publishOk = canPublish(c)
  const cat = c.category || COMM_CATEGORIES.find((x) => x.id === c.categoryId)
  const friends = c.friendsIn || []
  const unitLabel = c.kind === 'clubs' ? 'Club' : 'Groupe'

  const tabs = `
    <div class="tabs">
      <button class="hit tab ${view === 'publications' ? 'on' : ''}" data-sim="comm-view:publications" type="button">Publications</button>
      <button class="hit tab ${view === 'evenements' ? 'on' : ''}" data-sim="comm-view:evenements" type="button">Événements</button>
      <button class="hit tab ${view === 'informations' ? 'on' : ''}" data-sim="comm-view:informations" type="button">Informations</button>
    </div>`

  let body = ''
  if (view === 'evenements') {
    const evts = c.events || []
    body = evts.length
      ? evts
          .map(
            (e) => `
      <button class="hit row-link" data-sim="comm-open-event:${e.id}" type="button">
        <span class="grow">
          <strong>${escapeHtml(e.title)}</strong>
          <br/><span class="meta">${escapeHtml(e.when || '')} · lié à ${escapeHtml(c.name)}</span>
        </span>
        <span>›</span>
      </button>`
          )
          .join('')
      : emptyState('Aucun événement lié')
  } else if (view === 'informations') {
    const roles = roleHolders(c)
    body = `
      <h2 class="sec">Informations</h2>
      <button class="hit row-link" data-go="communaute-membres" type="button">
        <span class="grow"><strong>Membres</strong></span>
        <span class="meta">${c.membersCount}</span><span>›</span>
      </button>
      <button class="hit row-link" data-sim="comm-stub:galeries" type="button">
        <span class="grow"><strong>Galeries</strong></span>
        <span class="meta">${c.galleryCount || 0}</span><span>›</span>
      </button>
      ${
        modo
          ? `<button class="hit row-link" data-go="communaute-parametres" type="button">
        <span class="grow"><strong>Gestion du ${unitLabel}</strong></span>
        <span>›</span>
      </button>`
          : ''
      }
      ${
        modo
          ? `
      <h2 class="sec">Outils d’administration</h2>
      <button class="hit row-link" data-sim="comm-stub:approbations" type="button">
        <span class="grow"><strong>Approbations</strong></span>
        <span class="meta">${c.pendingApprovals || 0}</span><span>›</span>
      </button>
      <button class="hit row-link" data-sim="comm-stub:validations" type="button">
        <span class="grow"><strong>Validations des membres</strong></span>
        <span class="meta">${(c.pendingIds || []).length}</span><span>›</span>
      </button>
      <button class="hit row-link" data-sim="comm-stub:signales" type="button">
        <span class="grow"><strong>Contenus signalés</strong></span>
        <span class="meta">${c.reportedCount || 0}</span><span>›</span>
      </button>
      <button class="hit row-link" data-sim="comm-stub:regles" type="button">
        <span class="grow"><strong>Règles</strong></span>
        <span class="meta">${c.rulesCount || 0}</span><span>›</span>
      </button>`
          : ''
      }
      <h2 class="sec">Historique</h2>
      <div class="card soft-card">
        <p class="meta">Créé le : ${escapeHtml(c.createdAt || '—')}</p>
        <p class="meta">Dernière modification : ${escapeHtml(c.updatedAt || '—')}</p>
      </div>
      <h2 class="sec">Administrateurs &amp; Modérateurs</h2>
      ${
        roles.length
          ? roles
              .map(
                (r) => `
        <div class="row-link static">
          <span class="avatar"></span>
          <span class="grow"><strong>${escapeHtml(r.name)}</strong><br/><span class="meta">${escapeHtml(
            r.role
          )}</span></span>
        </div>`
              )
              .join('')
          : emptyState('Aucun rôle')
      }
    `
  } else {
    body = `
      ${
        publishOk
          ? `<div class="compose">
        <span class="avatar"></span>
        <button class="hit compose-input" data-go="communaute-composer" type="button">Commencer une publication</button>
      </div>`
          : c.myState === 'member'
            ? `<p class="meta">Publication réservée selon les règles du ${unitLabel.toLowerCase()}.</p>`
            : ''
      }
      ${(c.posts || [])
        .map(
          (p) => `
        <article class="card post-card" data-post-id="${p.id}">
          <div class="post-head">
            <span class="avatar"></span>
            <div class="grow">
              <strong>${escapeHtml(p.author)}</strong>
              <p class="meta">${formatMsgTime(p.at)}${p.pending ? ' · En attente' : ''}</p>
            </div>
            <button class="hit icon-btn" data-open-menu="publication" data-content-id="${p.id}" data-section="${
              c.kind
            }" data-menu-parent="communaute-page" title="Options">⋯</button>
          </div>
          <p>${escapeHtml(p.body)}</p>
          ${socialActions({
            likes: String(p.reactions || 0),
            comments: String(p.comments || 0),
            shares: '0',
            contentId: p.id,
            section: c.kind,
          })}
          <div class="row-actions">
            <button class="hit btn" data-sim="comm-react:${c.id}:${p.id}" type="button">Réagir</button>
            ${
              p.authorId === getViewerId() || modo
                ? `<button class="hit btn outline" data-sim="comm-del-post:${c.id}:${p.id}" type="button">Supprimer</button>`
                : ''
            }
          </div>
        </article>`
        )
        .join('') || emptyState('Aucune publication')}
    `
  }

  return wrap(
    `
    <div class="comm-cover">
      ${photo(c.coverPhoto ? `Couverture ${c.name}` : `Couverture ${c.name}…`, 'hero')}
      <span class="comm-cover-avatar" aria-hidden="true"></span>
    </div>
    <div class="comm-meta-row">
      <span class="meta">${escapeHtml(c.createdAgo || '')}</span>
      <span class="meta">${privacyLabel(c.privacy)} · ${accessLabel(c)}</span>
    </div>
    <div class="detail-head">
      <div class="identity-row">
        <div class="identity-main">
          <strong class="block-title">${escapeHtml(c.name)}</strong>
        </div>
        <button class="hit icon-btn" data-go="communaute-menu" type="button" title="Menu" aria-label="Menu">⋯</button>
      </div>
      <div class="comm-meta-row triple">
        <span class="meta"><span class="avatar tiny"></span> ${escapeHtml(c.creatorName || '')}</span>
        <span class="meta">${c.membersCount} membres</span>
        <span class="meta"><span class="comm-cat-icon sm">${cat?.icon || ''}</span> ${escapeHtml(
          cat?.label || ''
        )}</span>
      </div>
      <p>${escapeHtml(c.description)}</p>
      ${
        friends.length
          ? `<p class="meta">${avatar(Math.min(friends.length, 4))} ${friends.length} ami(e)s y sont membres</p>`
          : ''
      }
    </div>
    ${communauteActionButtons(c)}
    ${tabs}
    ${body}
    `,
    {
      header: phoneHeader({
        title: headerTitle,
        backTo: listBack,
      }),
      footer: phoneFooter('menu'),
    }
  )
}

function communauteMenu() {
  const c = getCommunaute(getOpenCommunauteId())
  if (!c) {
    return wrap(emptyState('Communauté indisponible'), {
      header: phoneHeader({ title: 'Menu', chrome: 'panel', closeIcon: true }),
      footer: '',
    })
  }
  const admin = isCommunauteAdmin(c)
  const publishOk = canPublish(c)
  const unit = c.kind === 'clubs' ? 'Club' : 'Groupe'
  let notifOn = true
  try {
    const raw = sessionStorage.getItem(`ma-ville-comm-notif-${c.id}`)
    if (raw === '0') notifOn = false
  } catch {
    /* ignore */
  }
  return wrap(`${photo(`Fond ${c.name}…`, 'dim')}`, {
    header: phoneHeader({ title: `Menu du ${unit}`, chrome: 'panel', closeIcon: true }),
    footer: '',
    overlay: modalShell(
      `Menu du ${unit}`,
      `
      ${admin ? sheetOption(`Modifier le ${unit}`, { go: 'communaute-parametres' }) : ''}
      ${publishOk ? sheetOption('Créer une publication', { go: 'communaute-composer' }) : ''}
      ${sheetOption('Rencontres', { go: 'communautes-rencontres' })}
      ${sheetOption('Salons', { sim: 'comm-stub:salons' })}
      ${sheetOption('Créer un événement', { sim: `comm-event-create:${c.id}` })}
      ${sheetOption(`Partager le ${unit}`, { sim: 'partage' })}
      ${sheetOption('Notifications', { sim: `comm-notif-toggle:${c.id}`, toggle: true, on: notifOn })}
      `
    ),
  })
}

function communauteParametres() {
  const c = getCommunaute(getOpenCommunauteId())
  if (!c || !isCommunauteAdmin(c)) {
    return wrap(emptyState('Paramètres réservés aux administrateurs de la communauté'), {
      header: phoneHeader({ title: 'Paramètres', chrome: 'form', backTo: 'communaute-page' }),
      footer: '',
    })
  }
  const unit = c.kind === 'clubs' ? 'Club' : 'Groupe'
  const roles = roleHolders(c)
  return wrap(
    `
    <h2 class="sec">Paramètres</h2>
    <label class="field"><span>Confidentialité</span>
      <select data-field="comm-privacy">
        <option value="public" ${c.privacy !== 'private' ? 'selected' : ''}>Public</option>
        <option value="private" ${c.privacy === 'private' ? 'selected' : ''}>Privé</option>
      </select>
    </label>
    <label class="field"><span>Invitations</span>
      <select data-field="comm-invite-who">
        <option value="member" ${c.inviteWho !== 'admin' ? 'selected' : ''}>Membre</option>
        <option value="admin" ${c.inviteWho === 'admin' ? 'selected' : ''}>Administrateur</option>
      </select>
      <span class="meta">Qui peut inviter de nouveaux membres.</span>
    </label>
    <label class="field row-between">
      <span>Validation automatique des nouveaux membres</span>
      <button class="hit toggle ${c.autoValidateMembers ? 'on' : ''}" data-sim="comm-toggle-field:autoValidateMembers" type="button" aria-pressed="${
        c.autoValidateMembers ? 'true' : 'false'
      }"></button>
    </label>
    <p class="meta">Valider automatiquement l’inscription d’une personne invitée.</p>
    <label class="field row-between">
      <span>Approbation automatique des publications</span>
      <button class="hit toggle ${c.autoApprovePosts ? 'on' : ''}" data-sim="comm-toggle-field:autoApprovePosts" type="button" aria-pressed="${
        c.autoApprovePosts ? 'true' : 'false'
      }"></button>
    </label>
    <p class="meta">Valider automatiquement les publications des membres.</p>
    <h2 class="sec">Rôles dans le ${unit}</h2>
    ${roles
      .map(
        (r) => `
      <div class="row-link static">
        <span class="avatar"></span>
        <span class="grow"><strong>${escapeHtml(r.name)}</strong><br/><span class="meta">${escapeHtml(
          r.role
        )}</span></span>
        <span class="meta">⋯</span>
      </div>`
      )
      .join('')}
    <p class="meta">Vous pouvez ajouter une personne qui aura un rôle pour administrer le ${unit}.</p>
    <button class="hit btn outline block" data-go="communaute-attribuer-role" type="button">Ajouter un rôle</button>
    <h2 class="sec">Autres</h2>
    <button class="hit row-link" data-sim="comm-dissolve:${c.id}" type="button">
      <span class="grow"><strong>Dissoudre ce ${unit}</strong></span>
    </button>
    <button class="hit row-link danger-text" data-sim="comm-leave-admin:${c.id}" type="button">
      <span class="grow"><strong>Quitter le rôle administrateur</strong></span>
    </button>
    <button class="hit btn primary block" data-sim="comm-settings-save" type="button">Terminer</button>
    `,
    {
      header: phoneHeader({
        title: `Paramètres du ${unit}`,
        chrome: 'form',
        backTo: 'communaute-page',
      }),
      footer: '',
    }
  )
}

function communauteAttribuerRole() {
  const c = getCommunaute(getOpenCommunauteId())
  if (!c || !isCommunauteAdmin(c)) {
    return wrap(emptyState('Action réservée aux administrateurs de la communauté'), {
      header: phoneHeader({ title: 'Attribuer un rôle', chrome: 'form', backTo: 'communaute-parametres' }),
      footer: '',
    })
  }
  const pick = getRolePick() || 'admin'
  const viewer = getViewerId()
  const candidates = (c.memberIds || []).filter((uid) => uid !== viewer)
  return wrap(
    `
    <h2 class="sec">Choisir un rôle</h2>
    <div class="chips filter-chips">
      <button class="hit chip ${pick === 'admin' ? 'on' : ''}" data-sim="comm-role-pick:admin" type="button">Administrateur</button>
      <button class="hit chip ${pick === 'modo' ? 'on' : ''}" data-sim="comm-role-pick:modo" type="button">Modérateur</button>
    </div>
    <h2 class="sec">Choisir un membre</h2>
    ${
      candidates.length
        ? candidates
            .map((uid) => {
              const m = memberDisplay(uid)
              return `
      <button class="hit row-link" data-sim="comm-assign-role:${c.id}:${uid}" type="button">
        <span class="avatar"></span>
        <span class="grow"><strong>${escapeHtml(m.name)}</strong><br/><span class="meta">${escapeHtml(
          m.since
        )}</span></span>
        <span>›</span>
      </button>`
            })
            .join('')
        : emptyState('Aucun autre membre')
    }
    `,
    {
      header: phoneHeader({
        title: 'Attribuer un rôle',
        chrome: 'form',
        backTo: 'communaute-parametres',
      }),
      footer: '',
    }
  )
}

function communauteMembres() {
  const c = getCommunaute(getOpenCommunauteId())
  if (!c) {
    return wrap(emptyState('Communauté indisponible'), {
      header: phoneHeader({ title: 'Membres', backTo: 'communaute-page' }),
      footer: phoneFooter('menu'),
    })
  }
  let q = ''
  try {
    q = sessionStorage.getItem('ma-ville-comm-member-search') || ''
  } catch {
    /* ignore */
  }
  const admin = isCommunauteAdmin(c)
  const viewer = getViewerId()
  const members = (c.memberIds || [])
    .map((uid) => ({ uid, ...memberDisplay(uid) }))
    .filter((m) => !q || m.name.toLowerCase().includes(q.toLowerCase()) || m.uid.includes(q))
  return wrap(
    `
    <label class="field">
      <input type="search" placeholder="Rechercher un membre…" value="${escapeAttr(q)}" data-field="comm-member-search" data-sim-change="comm-member-search" />
    </label>
    <p class="meta">${c.membersCount} membres</p>
    ${members
      .map((m) => {
        const isAdmin = (c.admins || []).includes(m.uid)
        const isModo = (c.moderators || []).includes(m.uid)
        const role = isAdmin ? 'Administrateur' : isModo ? 'Modérateur' : ''
        return `
      <div class="row-link static">
        <span class="avatar"></span>
        <span class="grow">
          <strong>${escapeHtml(m.uid === viewer ? `${m.name} (vous)` : m.name)}</strong>
          <br/><span class="meta">${escapeHtml(m.since)}${role ? ` · ${role}` : ''}</span>
        </span>
        ${
          m.uid !== viewer
            ? `<button class="hit icon-btn" data-sim="comm-member-msg:${m.uid}" type="button" title="Message">💬</button>`
            : ''
        }
        ${
          admin && m.uid !== viewer && !isAdmin
            ? `<button class="hit btn outline" data-sim="comm-remove:${c.id}:${m.uid}" type="button">Retirer</button>`
            : ''
        }
      </div>`
      })
      .join('') || emptyState('Aucun membre')}
    ${
      admin && (c.pendingIds || []).length
        ? `<h2 class="sec">Demandes</h2>
      ${c.pendingIds
        .map((uid) => {
          const m = memberDisplay(uid)
          return `
        <div class="row-actions">
          <span class="grow"><strong>${escapeHtml(m.name)}</strong></span>
          <button class="hit btn primary" data-sim="comm-accept:${c.id}:${uid}" type="button">Accepter</button>
          <button class="hit btn outline" data-sim="comm-refuse:${c.id}:${uid}" type="button">Refuser</button>
        </div>`
        })
        .join('')}`
        : ''
    }
    <button class="hit btn block" data-sim="comm-group-msg" type="button">Envoyer un message groupé</button>
    `,
    {
      header: phoneHeader({ title: 'Membres', backTo: 'communaute-page' }),
      footer: phoneFooter('menu'),
    }
  )
}

function communauteComposer() {
  const c = getCommunaute(getOpenCommunauteId())
  if (!c || !canPublish(c)) {
    return wrap(emptyState('Publication non autorisée'), {
      header: phoneHeader({ title: 'Publication', chrome: 'form' }),
      footer: '',
    })
  }
  return wrap(
    `
    <div class="form-card">
      <h2 class="sec">Nouvelle publication</h2>
      <p class="meta">${escapeHtml(c.name)} · ${kindLabel(c.kind)}</p>
      <label class="field"><span>Texte</span>
        <textarea rows="5" placeholder="Écrire une publication…" data-field="comm-post-body"></textarea>
      </label>
      <div class="row-actions">
        <button class="hit btn" data-go="communaute-page" type="button">Annuler</button>
        <button class="hit btn primary" data-sim="comm-publish" type="button">Publier</button>
      </div>
    </div>
    `,
    {
      header: phoneHeader({ title: 'Publier', chrome: 'form', backTo: 'communaute-page' }),
      footer: '',
    }
  )
}

function communauteCreate() {
  const draft = getCreateDraft()
  if (!draft) {
    return wrap(emptyState('Création non démarrée'), {
      header: phoneHeader({ title: 'Créer', chrome: 'form', closeIcon: true }),
      footer: '',
    })
  }
  const unit = draft.kind === 'clubs' ? 'Club' : 'Groupe'
  const step = draft.step || 1
  const cat = COMM_CATEGORIES.find((x) => x.id === draft.categoryId) || COMM_CATEGORIES[0]
  let body = ''
  if (step === 1) {
    body = `
      <h2 class="sec accent">À propos</h2>
      <label class="field"><span>Quel est le nom de votre ${unit} ?</span>
        <input type="text" value="${escapeAttr(draft.name || '')}" placeholder="Nom" data-field="comm-create-name" />
      </label>
      <label class="field"><span>De quel genre de ${unit} s’agit-il ?</span>
        <select data-field="comm-create-category">
          ${COMM_CATEGORIES.map(
            (c) =>
              `<option value="${c.id}" ${c.id === draft.categoryId ? 'selected' : ''}>${c.icon} ${c.label}</option>`
          ).join('')}
        </select>
      </label>
      <p class="meta"><span class="comm-cat-icon">${cat.icon}</span> ${escapeHtml(cat.label)}</p>
      <label class="field"><span>Description</span>
        <textarea rows="4" placeholder="Décrire le ${unit}" data-field="comm-create-desc">${escapeHtml(
          draft.description || ''
        )}</textarea>
      </label>
      <h2 class="sec">Importer une photo de profil</h2>
      <div class="row-actions">
        <button class="hit btn outline" data-sim="comm-create-photo:profile" type="button">${
          draft.profilePhoto ? '✓ Profil (aperçu local)' : '📷 Photo de profil'
        }</button>
        <span class="meta">Carrée 1:1 · JPG/PNG · max 5 Mo (simulé)</span>
      </div>
      <h2 class="sec">Importer une photo de couverture</h2>
      <div class="row-actions">
        <button class="hit btn outline" data-sim="comm-create-photo:cover" type="button">${
          draft.coverPhoto ? '✓ Couverture (aperçu local)' : '📷 Photo de couverture'
        }</button>
        <span class="meta">~375×148 · JPG/PNG · max 5 Mo (simulé)</span>
      </div>
      <button class="hit btn primary block" data-sim="comm-create-next" type="button">Suivant</button>
    `
  } else {
    body = `
      <h2 class="sec accent">Paramètres</h2>
      <label class="field"><span>Confidentialité</span>
        <select data-field="comm-create-privacy">
          <option value="public" ${draft.privacy !== 'private' ? 'selected' : ''}>Public</option>
          <option value="private" ${draft.privacy === 'private' ? 'selected' : ''}>Privé</option>
        </select>
      </label>
      <label class="field"><span>Invitations</span>
        <select data-field="comm-create-invite-who">
          <option value="member" ${draft.inviteWho !== 'admin' ? 'selected' : ''}>Membre</option>
          <option value="admin" ${draft.inviteWho === 'admin' ? 'selected' : ''}>Administrateur</option>
        </select>
      </label>
      <label class="field row-between">
        <span>Validation automatique des nouveaux membres</span>
        <button class="hit toggle ${draft.autoValidateMembers !== false ? 'on' : ''}" data-sim="comm-create-toggle:autoValidateMembers" type="button"></button>
      </label>
      <label class="field row-between">
        <span>Approbation automatique des publications</span>
        <button class="hit toggle ${draft.autoApprovePosts !== false ? 'on' : ''}" data-sim="comm-create-toggle:autoApprovePosts" type="button"></button>
      </label>
      <div class="row-actions">
        <button class="hit btn" data-sim="comm-create-prev" type="button">Précédent</button>
        <button class="hit btn primary" data-sim="comm-create-submit" type="button">Créer</button>
      </div>
    `
  }
  return wrap(body, {
    header: phoneHeader({
      title: `Créer un ${unit}`,
      chrome: 'form',
      closeIcon: true,
      backTo: draft.kind === 'clubs' ? 'communautes-clubs' : 'communautes-groupes',
    }),
    footer: '',
  })
}

function rencResponseIcon(resp) {
  const map = {
    pending: '○',
    accepted: '✓',
    refused: '✕',
    withdrawn: '⊖',
    proposed: '⇄',
    reconfirm: '⟳',
  }
  return map[resp] || '·'
}

function rencGuestStatusLabel(resp) {
  const map = {
    pending: 'En attente',
    accepted: 'Acceptée',
    refused: 'Refusée',
    withdrawn: 'Participation retirée',
    proposed: 'Autre date proposée',
    reconfirm: 'En attente de confirmation',
  }
  return map[resp] || resp
}

function rencCardStatus(r, tab) {
  if (r.status === 'cancelled') return { cls: 'cancelled', label: 'Annulée' }
  if (r.status === 'draft') return { cls: 'draft', label: 'Brouillon' }
  if (temporalBucket(r) === 'passees') return { cls: 'past', label: 'Passée' }
  if (tab === 'recues') {
    const g = myGuest(r)
    if (!g) return { cls: 'pending', label: '—' }
    return {
      cls: g.response,
      label: responseLabel(g.response),
      icon: rencResponseIcon(g.response),
    }
  }
  if (r.kind === 'collectif') {
    return { cls: 'collective', label: collectiveSummary(r) }
  }
  const one = (r.guests || [])[0]
  if (!one) return { cls: 'pending', label: 'En attente' }
  if (one.response === 'proposed') {
    return { cls: 'proposed', label: 'Nouvelle proposition reçue', icon: '⇄' }
  }
  return {
    cls: one.response,
    label: responseLabel(one.response, { asOrganizer: true, guestName: one.name }),
    icon: rencResponseIcon(one.response),
  }
}

function rencCardHtml(r, tab) {
  const org = isOrganizer(r)
  const status = rencCardStatus(r, tab)
  const other =
    r.kind === 'tat'
      ? org
        ? (r.guests || [])[0]
        : { name: r.organizerName }
      : null
  const lineWho =
    tab === 'recues'
      ? `Organisée par ${escapeHtml(r.organizerName)}`
      : r.kind === 'tat'
        ? `Invitation envoyée à ${escapeHtml(other?.name || '…')}`
        : `Organisateur · ${escapeHtml(r.organizerName)}${org ? ' (Vous)' : ''}`
  const pendingReceived =
    tab === 'recues' && r.status === 'active' && myGuest(r)?.response === 'pending'
  const guestCount = (r.guests || []).length
  return `
    <article class="renc-card" data-renc-id="${r.id}">
      <button class="hit renc-card-main" data-sim="renc-open:${r.id}" type="button">
        <span class="renc-avatar" aria-hidden="true"></span>
        <span class="renc-card-body">
          <span class="renc-card-top">
            <strong>${escapeHtml(r.title)}</strong>
            <span class="renc-chip ${status.cls}">${status.icon ? `${status.icon} ` : ''}${escapeHtml(
              status.label
            )}</span>
          </span>
          <span class="meta">${escapeHtml(formatWhen(r))}</span>
          <span class="meta">${escapeHtml(placeLabel(r))}</span>
          <span class="meta">${lineWho}</span>
          ${
            r.kind === 'collectif'
              ? `<span class="meta">${guestCount} invité${guestCount > 1 ? 's' : ''}${
                  org ? '' : ` · ${escapeHtml(responseLabel(myGuest(r)?.response || 'pending'))}`
                }</span>`
              : other
                ? `<span class="meta">${escapeHtml(other.name || '')}</span>`
                : ''
          }
        </span>
      </button>
      ${
        pendingReceived
          ? `<div class="row-actions renc-card-actions">
        <button class="hit btn outline" data-sim="renc-refuse:${r.id}" type="button">Refuser</button>
        <button class="hit btn primary" data-sim="renc-accept:${r.id}" type="button">Accepter</button>
      </div>`
          : ''
      }
    </article>`
}

/** Liste Mes rencontres */
function mesRencontres() {
  const tab = getRencTab()
  const filter = getRencFilter()
  const temp = getRencTemp()
  const q = getRencSearch()
  const list = listRencontres({ tab, filter, temp, query: q })
  const drafts = listDrafts()
  const filters = [
    { id: 'toutes', label: 'Toutes' },
    { id: 'attente', label: 'En attente' },
    { id: 'acceptees', label: 'Acceptées' },
    { id: 'refusees', label: 'Refusées' },
  ]
  const temps = [
    { id: 'avenir', label: 'À venir' },
    { id: 'passees', label: 'Passées' },
    { id: 'annulees', label: 'Annulées' },
  ]
  const emptyMsg = q
    ? 'Aucun résultat'
    : temp === 'annulees'
      ? 'Aucune rencontre annulée'
      : temp === 'passees'
        ? 'Aucune rencontre passée'
        : tab === 'recues'
          ? 'Aucune invitation reçue'
          : 'Aucune invitation envoyée'
  return wrap(
    `
    <button class="hit btn primary block" data-sim="renc-create" type="button">Créer une rencontre</button>
    <label class="search">
      <span class="search-ico">⌕</span>
      <input type="search" data-field="renc-search" data-sim-change="renc-search" placeholder="Rechercher une rencontre…" value="${escapeHtml(
        q
      )}" />
      ${
        q
          ? `<button class="hit icon-btn search-clear" data-sim="renc-search:clear" type="button" title="Effacer">✕</button>`
          : ''
      }
    </label>
    <div class="tabs">
      <button class="hit tab ${tab === 'recues' ? 'on' : ''}" data-sim="renc-tab:recues" type="button">Reçues</button>
      <button class="hit tab ${tab === 'envoyees' ? 'on' : ''}" data-sim="renc-tab:envoyees" type="button">Envoyées</button>
    </div>
    <div class="chips filter-chips">
      ${filters
        .map(
          (f) =>
            `<button class="hit chip ${filter === f.id ? 'on' : ''}" data-sim="renc-filter:${f.id}" type="button">${
              f.label
            }</button>`
        )
        .join('')}
    </div>
    <div class="chips filter-chips renc-temp-chips">
      ${temps
        .map(
          (t) =>
            `<button class="hit chip ${temp === t.id ? 'on' : ''}" data-sim="renc-temp:${t.id}" type="button">${
              t.label
            }</button>`
        )
        .join('')}
      <button class="hit chip ${temp === 'brouillons' ? 'on' : ''}" data-sim="renc-temp:brouillons" type="button">Brouillons${
        drafts.length ? ` (${drafts.length})` : ''
      }</button>
    </div>
    ${
      tab === 'envoyees' && filter !== 'toutes' && list.length
        ? `<p class="meta renc-filter-hint">Rencontres avec au moins une réponse de ce type</p>`
        : ''
    }
    <div class="renc-list">
      ${list.length ? list.map((r) => rencCardHtml(r, tab)).join('') : emptyState(emptyMsg)}
    </div>
    `,
    {
      header: phoneHeader({ title: 'Mes rencontres', backTo: 'accueil-kapan' }),
      footer: phoneFooter('menu'),
    }
  )
}

/** Alias route communautés-rencontres → mesRencontres */
function communautesRencontres() {
  return mesRencontres()
}

function rencGuestListHtml(r, { manage = false } = {}) {
  const guests = r.guests || []
  if (!guests.length) return emptyState('Aucun invité')
  return guests
    .map((g) => {
      const icon = rencResponseIcon(g.response)
      const label = rencGuestStatusLabel(g.response)
      return `
      <div class="renc-guest-row">
        <span class="avatar"></span>
        <div class="grow">
          <strong>${escapeHtml(g.name)}</strong>
          <p class="meta"><span class="renc-status-ico" aria-hidden="true">${icon}</span> ${escapeHtml(label)}</p>
        </div>
        ${
          manage
            ? `<button class="hit btn outline danger-text" data-sim="renc-remove-guest:${r.id}:${g.userId}" type="button">Retirer</button>`
            : ''
        }
      </div>`
    })
    .join('')
}

function rencOrgActions(r) {
  if (r.status === 'draft') {
    return `
      <button class="hit btn primary block" data-sim="renc-edit:${r.id}" type="button">Reprendre</button>
      <button class="hit btn outline block" data-sim="renc-delete-draft:${r.id}" type="button">Supprimer le brouillon</button>`
  }
  if (r.status === 'cancelled' || temporalBucket(r) === 'passees') {
    return `
      <button class="hit btn block" data-sim="renc-message:${r.id}" type="button">Conversation</button>
      <button class="hit btn outline block" data-sim="renc-remove-list:${r.id}" type="button">Retirer de ma liste</button>`
  }
  const counter =
    r.counterProposal?.status === 'pending'
      ? `
      <section class="renc-counter">
        <h2 class="sec">Contre-proposition</h2>
        <p class="meta">${escapeHtml(r.counterProposal.fromName)} propose :</p>
        <p><strong>${escapeHtml(r.counterProposal.date)} · ${escapeHtml(r.counterProposal.time)}</strong></p>
        <p class="meta">${escapeHtml(
          [r.counterProposal.placeName, r.counterProposal.address].filter(Boolean).join(' · ')
        )}</p>
        ${r.counterProposal.message ? `<p>${escapeHtml(r.counterProposal.message)}</p>` : ''}
        <div class="row-actions">
          <button class="hit btn outline" data-sim="renc-propose-refuse:${r.id}" type="button">Refuser</button>
          <button class="hit btn primary" data-sim="renc-propose-accept:${r.id}" type="button">Accepter</button>
        </div>
      </section>`
      : ''
  return `
    ${counter}
    <button class="hit btn primary block" data-sim="renc-edit:${r.id}" type="button">Modifier la rencontre</button>
    <button class="hit btn block" data-sim="renc-message:${r.id}" type="button">${
      r.kind === 'collectif' ? 'Ouvrir le salon' : 'Conversation'
    }</button>
    ${
      r.kind === 'collectif'
        ? `<button class="hit btn outline block" data-go="rencontre-guests" type="button">Gérer les invités</button>`
        : ''
    }`
}

function rencGuestActions(r) {
  const g = myGuest(r)
  if (!g || r.status !== 'active') {
    if (r.status === 'cancelled' || temporalBucket(r) === 'passees') {
      return `<button class="hit btn outline block" data-sim="renc-remove-list:${r.id}" type="button">Retirer de ma liste</button>`
    }
    return ''
  }
  if (g.response === 'pending' || g.response === 'reconfirm') {
    return `
      <div class="row-actions renc-detail-actions">
        <button class="hit btn outline" data-sim="renc-refuse:${r.id}" type="button">Refuser</button>
        <button class="hit btn primary" data-sim="renc-accept:${r.id}" type="button">Accepter</button>
      </div>
      ${
        r.kind === 'tat'
          ? `<button class="hit btn outline block" data-sim="renc-propose:${r.id}" type="button">Proposer autre date/lieu</button>`
          : ''
      }
      <button class="hit btn block" data-sim="renc-message:${r.id}" type="button">Conversation</button>`
  }
  if (g.response === 'proposed') {
    return `
      <p class="meta renc-chip proposed">⇄ Votre proposition attend une réponse</p>
      <button class="hit btn block" data-sim="renc-message:${r.id}" type="button">Conversation</button>`
  }
  if (g.response === 'accepted') {
    return `
      <p class="meta"><span class="renc-chip accepted">✓ Vous avez accepté</span></p>
      <button class="hit btn outline block" data-sim="renc-withdraw:${r.id}" type="button">Ne plus y aller</button>
      <button class="hit btn block" data-sim="renc-message:${r.id}" type="button">Conversation</button>`
  }
  if (g.response === 'refused' || g.response === 'withdrawn') {
    return `
      <p class="meta"><span class="renc-chip refused">${
        g.response === 'withdrawn' ? '⊖ Vous avez retiré votre participation' : '✕ Vous avez refusé'
      }</span></p>
      ${
        g.response === 'refused'
          ? `<button class="hit btn outline block" data-sim="renc-cancel-refuse:${r.id}" type="button">Annuler le refus</button>`
          : ''
      }
      <button class="hit btn block" data-sim="renc-message:${r.id}" type="button">Conversation</button>`
  }
  return `<button class="hit btn block" data-sim="renc-message:${r.id}" type="button">Conversation</button>`
}

function rencontreDetails() {
  const id = getOpenRencontreId()
  const r = getRencontre(id)
  if (!r) {
    return wrap(emptyState('Rencontre introuvable ou accès refusé'), {
      header: phoneHeader({ title: 'Détails', backTo: 'communautes-rencontres' }),
      footer: phoneFooter('menu'),
    })
  }
  const org = isOrganizer(r)
  const kindLabel = r.kind === 'tat' ? 'Tête-à-tête' : 'Collective'
  const modeLabel = r.mode === 'online' ? 'En ligne' : 'Sur place'
  const statusLine = org
    ? r.kind === 'collectif'
      ? collectiveSummary(r)
      : responseLabel((r.guests || [])[0]?.response || 'pending', {
          asOrganizer: true,
          guestName: (r.guests || [])[0]?.name,
        })
    : responseLabel(myGuest(r)?.response || 'pending')
  return wrap(
    `
    <div class="renc-detail" data-renc-id="${r.id}">
      ${r.photo ? photo('Photo rencontre…', 'hero') : photo('Pas de photo', 'hero dim')}
      <div class="detail-head">
        <div class="identity-row">
          <div class="identity-main">
            <strong class="block-title">${escapeHtml(r.title)}</strong>
          </div>
          <button class="hit icon-btn" data-go="rencontre-menu" type="button" title="Menu" aria-label="Menu">⋯</button>
        </div>
        <p class="meta">${kindLabel} · ${modeLabel}${
          r.status === 'cancelled' ? ' · Annulée' : r.status === 'draft' ? ' · Brouillon' : ''
        }</p>
        <p class="meta">${escapeHtml(formatWhen(r))}</p>
        <p class="meta">${escapeHtml(placeLabel(r))}</p>
        ${
          r.mode === 'online'
            ? `<p class="meta">${escapeHtml(connectionHint(r))}</p>`
            : r.address
              ? `<p class="meta">${escapeHtml(r.address)}</p>`
              : ''
        }
        ${r.description ? `<p>${escapeHtml(r.description)}</p>` : ''}
      </div>
      <div class="renc-org-row">
        <span class="avatar"></span>
        <div class="grow">
          <strong>${escapeHtml(r.organizerName)}${org ? ' · Vous' : ''}</strong>
          <p class="meta">Organisateur</p>
        </div>
        ${
          !org
            ? `<button class="hit btn outline" data-sim="renc-message:${r.id}" type="button">Écrire</button>`
            : ''
        }
      </div>
      <p class="meta renc-status-line"><span class="renc-chip">${escapeHtml(statusLine)}</span></p>
      ${r.cancelMotif ? `<p class="meta">Motif d’annulation · ${escapeHtml(r.cancelMotif)}</p>` : ''}
      ${org ? rencOrgActions(r) : rencGuestActions(r)}
      <h2 class="sec">Invités · ${(r.guests || []).length}</h2>
      ${rencGuestListHtml(r)}
      ${
        (r.history || []).length
          ? `<h2 class="sec">Historique</h2>
        <ul class="renc-history">${(r.history || [])
          .slice()
          .reverse()
          .slice(0, 6)
          .map((h) => `<li class="meta">${escapeHtml(h.text)}</li>`)
          .join('')}</ul>`
          : ''
      }
      <p class="meta">Simulé · pas de visio réelle · messagerie réutilisée</p>
    </div>
    `,
    {
      header: phoneHeader({
        title: 'Détails',
        backTo: 'communautes-rencontres',
      }),
      footer: phoneFooter('menu'),
    }
  )
}

function rencontreCreate() {
  const draft = getDraft() || {
    step: 1,
    context: 'maville',
    city: 'Kapan',
    guestIds: [],
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
  const step = Number(draft.step) || 1
  const selected = new Set(draft.guestIds || [])
  let body = ''
  if (step === 1) {
    body = `
      <h2 class="sec">Amis</h2>
      <p class="meta">Choisissez au moins une personne. 1 = tête-à-tête · plusieurs = collective.</p>
      <label class="search">
        <span class="search-ico">⌕</span>
        <input type="search" data-field="renc-friend-search" placeholder="Rechercher un ami…" />
      </label>
      <div class="renc-chips">
        ${[...selected]
          .map((id) => {
            const c = RENC_CONTACTS.find((x) => x.id === id)
            return `<button class="hit chip on" data-sim="renc-toggle-guest:${id}" type="button">${escapeHtml(
              c?.name || id
            )} ✕</button>`
          })
          .join('')}
      </div>
      <div class="renc-friend-list">
        ${RENC_CONTACTS.map((c) => {
          const on = selected.has(c.id)
          return `
          <button class="hit row-link ${on ? 'selected' : ''}" data-sim="renc-toggle-guest:${c.id}" type="button">
            <span class="avatar"></span>
            <span class="grow"><strong>${escapeHtml(c.name)}</strong></span>
            <span class="meta">${on ? '✓' : '+'}</span>
          </button>`
        }).join('')}
      </div>
      <button class="hit btn primary block" data-sim="renc-create-step:2" type="button" ${
        selected.size ? '' : 'disabled'
      }>Continuer</button>`
  } else if (step === 2) {
    const online = draft.mode === 'online'
    body = `
      <h2 class="sec">Informations</h2>
      <label class="field"><span>Titre *</span>
        <input data-field="renc-title" type="text" value="${escapeHtml(draft.title || '')}" placeholder="Titre de la rencontre" />
      </label>
      <fieldset class="field">
        <legend>Mode *</legend>
        <label class="radio-row"><input data-field="renc-mode" type="radio" name="renc-mode" value="physical" data-sim-change="renc-create-mode" ${
          !online ? 'checked' : ''
        } /> Sur place</label>
        <label class="radio-row"><input data-field="renc-mode" type="radio" name="renc-mode" value="online" data-sim-change="renc-create-mode" ${
          online ? 'checked' : ''
        } /> En ligne</label>
      </fieldset>
      <div class="row-2">
        <label class="field"><span>Date *</span>
          <input data-field="renc-date" type="date" value="${escapeHtml(draft.date || '')}" />
        </label>
        <label class="field"><span>Heure *</span>
          <input data-field="renc-time" type="time" value="${escapeHtml(draft.time || '')}" />
        </label>
      </div>
      ${
        online
          ? `<p class="meta">La rencontre se déroulera en ligne.</p>
        <label class="field"><span>Lien de connexion (facultatif)</span>
          <input data-field="renc-link" type="url" value="${escapeHtml(draft.link || '')}" placeholder="https://…" />
        </label>
        <p class="meta">Si vide : les informations de connexion seront partagées dans la discussion.</p>`
          : `<label class="field"><span>Nom du lieu (facultatif)</span>
          <input data-field="renc-placeName" type="text" value="${escapeHtml(draft.placeName || '')}" />
        </label>
        <label class="field"><span>Adresse *</span>
          <input data-field="renc-address" type="text" value="${escapeHtml(draft.address || '')}" placeholder="Adresse" />
        </label>
        <p class="meta">Ville · ${escapeHtml(draft.city || 'Kapan')}</p>`
      }
      <label class="field"><span>Description (facultatif)</span>
        <textarea data-field="renc-description" rows="3">${escapeHtml(draft.description || '')}</textarea>
      </label>
      <div class="field">
        <span>Photo (facultatif · JPG/PNG · 5 Mo · simulé)</span>
        ${
          draft.photo
            ? `<div class="renc-photo-preview">${photo('Aperçu…', 'thumb')}
            <div class="row-actions">
              <button class="hit btn outline" data-sim="renc-photo:replace" type="button">Remplacer</button>
              <button class="hit btn outline" data-sim="renc-photo:clear" type="button">Retirer</button>
            </div></div>`
            : `<button class="hit btn outline block" data-sim="renc-photo:add" type="button">Ajouter une photo</button>`
        }
      </div>
      <div class="row-actions">
        <button class="hit btn outline" data-sim="renc-create-step:1" type="button">Retour</button>
        <button class="hit btn primary" data-sim="renc-create-step:3" type="button">Continuer</button>
      </div>`
  } else {
    const guests = (draft.guestIds || [])
      .map((id) => RENC_CONTACTS.find((c) => c.id === id)?.name || id)
      .join(', ')
    const kind = (draft.guestIds || []).length > 1 ? 'Collective' : 'Tête-à-tête'
    body = `
      <h2 class="sec">Vérification</h2>
      <article class="renc-recap">
        <p><strong>${escapeHtml(draft.title || 'Sans titre')}</strong></p>
        <p class="meta">${kind} · ${draft.mode === 'online' ? 'En ligne' : 'Sur place'}</p>
        <p class="meta">${escapeHtml(draft.date || '—')} · ${escapeHtml(draft.time || '—')}</p>
        <p class="meta">${
          draft.mode === 'online'
            ? escapeHtml(draft.link || 'Connexion via la discussion')
            : escapeHtml([draft.placeName, draft.address, draft.city].filter(Boolean).join(' · ') || 'Lieu à préciser')
        }</p>
        <p class="meta">Invités · ${escapeHtml(guests)}</p>
        ${draft.description ? `<p>${escapeHtml(draft.description)}</p>` : ''}
      </article>
      <div class="row-actions">
        <button class="hit btn outline" data-sim="renc-create-step:2" type="button">Retour</button>
        <button class="hit btn primary" data-sim="renc-send" type="button">Envoyer les invitations</button>
      </div>
      <button class="hit btn outline block" data-sim="renc-save-draft" type="button">Enregistrer le brouillon</button>`
  }
  return wrap(
    `
    <div class="renc-steps meta">Étape ${step} / 3</div>
    ${body}
    `,
    {
      header: phoneHeader({
        title: 'Créer une rencontre',
        chrome: 'form',
        closeIcon: true,
        backTo: 'communautes-rencontres',
      }),
      footer: '',
    }
  )
}

function rencontreEdit() {
  const r = getRencontre(getOpenRencontreId())
  if (!r || !isOrganizer(r)) {
    return wrap(emptyState('Modification réservée à l’organisateur'), {
      header: phoneHeader({ title: 'Modifier', chrome: 'form', backTo: 'rencontre-details' }),
      footer: '',
    })
  }
  const online = r.mode === 'online'
  return wrap(
    `
    <h2 class="sec">Modifier la rencontre</h2>
    <p class="meta">Présentation (titre, description, photo) : conserve les réponses. Date, heure, adresse ou mode : les personnes ayant accepté devront confirmer à nouveau.</p>
    <label class="field"><span>Titre</span>
      <input data-field="renc-edit-title" type="text" value="${escapeHtml(r.title)}" />
    </label>
    <fieldset class="field">
      <legend>Mode</legend>
      <label class="radio-row"><input data-field="renc-edit-mode" type="radio" name="renc-edit-mode" value="physical" ${
        !online ? 'checked' : ''
      } /> Sur place</label>
      <label class="radio-row"><input data-field="renc-edit-mode" type="radio" name="renc-edit-mode" value="online" ${
        online ? 'checked' : ''
      } /> En ligne</label>
    </fieldset>
    <div class="row-2">
      <label class="field"><span>Date</span>
        <input data-field="renc-edit-date" type="date" value="${escapeHtml(r.date || '')}" />
      </label>
      <label class="field"><span>Heure</span>
        <input data-field="renc-edit-time" type="time" value="${escapeHtml(r.time || '')}" />
      </label>
    </div>
    <label class="field"><span>Nom du lieu</span>
      <input data-field="renc-edit-placeName" type="text" value="${escapeHtml(r.placeName || '')}" />
    </label>
    <label class="field"><span>Adresse</span>
      <input data-field="renc-edit-address" type="text" value="${escapeHtml(r.address || '')}" />
    </label>
    <label class="field"><span>Lien (en ligne)</span>
      <input data-field="renc-edit-link" type="url" value="${escapeHtml(r.link || '')}" />
    </label>
    <label class="field"><span>Description</span>
      <textarea data-field="renc-edit-description" rows="3">${escapeHtml(r.description || '')}</textarea>
    </label>
    <button class="hit btn primary block" data-sim="renc-edit-save:${r.id}" type="button">Enregistrer</button>
    `,
    {
      header: phoneHeader({ title: 'Modifier', chrome: 'form', backTo: 'rencontre-details' }),
      footer: '',
    }
  )
}

function rencontreGuests() {
  const r = getRencontre(getOpenRencontreId())
  if (!r || !isOrganizer(r) || r.kind !== 'collectif') {
    return wrap(emptyState('Gestion des invités réservée aux rencontres collectives de l’organisateur'), {
      header: phoneHeader({ title: 'Invités', chrome: 'form', backTo: 'rencontre-details' }),
      footer: '',
    })
  }
  const existing = new Set((r.guests || []).map((g) => g.userId))
  const addable = RENC_CONTACTS.filter((c) => !existing.has(c.id) && c.id !== getRencViewer())
  return wrap(
    `
    <h2 class="sec">Gérer les invités</h2>
    <p class="meta">${collectiveSummary(r)}</p>
    ${rencGuestListHtml(r, { manage: true })}
    <h2 class="sec">Ajouter</h2>
    ${
      addable.length
        ? addable
            .map(
              (c) => `
      <button class="hit row-link" data-sim="renc-add-guest:${r.id}:${c.id}" type="button">
        <span class="avatar"></span>
        <span class="grow"><strong>${escapeHtml(c.name)}</strong></span>
        <span class="meta">+</span>
      </button>`
            )
            .join('')
        : emptyState('Tous vos contacts sont déjà invités')
    }
    <p class="meta">Un tête-à-tête ne devient pas collectif ici — créez une nouvelle rencontre collective.</p>
    `,
    {
      header: phoneHeader({ title: 'Invités', chrome: 'form', backTo: 'rencontre-details' }),
      footer: '',
    }
  )
}

function rencontrePropose() {
  const r = getRencontre(getOpenRencontreId())
  const g = myGuest(r)
  if (!r || r.kind !== 'tat' || !g || g.response !== 'pending') {
    return wrap(emptyState('Contre-proposition disponible uniquement pour un TÀT en attente'), {
      header: phoneHeader({ title: 'Proposer', chrome: 'form', backTo: 'rencontre-details' }),
      footer: '',
    })
  }
  return wrap(
    `
    <h2 class="sec">Proposer une autre date / un autre lieu</h2>
    <p class="meta">Modifiez au moins un champ. Les infos actuelles restent jusqu’à réponse de l’organisateur.</p>
    <div class="row-2">
      <label class="field"><span>Date</span>
        <input data-field="renc-prop-date" type="date" value="${escapeHtml(r.date || '')}" />
      </label>
      <label class="field"><span>Heure</span>
        <input data-field="renc-prop-time" type="time" value="${escapeHtml(r.time || '')}" />
      </label>
    </div>
    <label class="field"><span>Nom du lieu</span>
      <input data-field="renc-prop-placeName" type="text" value="${escapeHtml(r.placeName || '')}" />
    </label>
    <label class="field"><span>Adresse</span>
      <input data-field="renc-prop-address" type="text" value="${escapeHtml(r.address || '')}" />
    </label>
    <label class="field"><span>Message</span>
      <textarea data-field="renc-prop-message" rows="3" placeholder="Message facultatif"></textarea>
    </label>
    <button class="hit btn primary block" data-sim="renc-propose-submit:${r.id}" type="button">Envoyer la proposition</button>
    `,
    {
      header: phoneHeader({ title: 'Contre-proposition', chrome: 'form', backTo: 'rencontre-details' }),
      footer: '',
    }
  )
}

function rencontreMenu() {
  const r = getRencontre(getOpenRencontreId())
  if (!r) {
    return wrap(emptyState('Rencontre indisponible'), {
      header: phoneHeader({ title: 'Menu', chrome: 'panel', closeIcon: true }),
      footer: '',
    })
  }
  const org = isOrganizer(r)
  const pastOrCancelled = r.status === 'cancelled' || temporalBucket(r) === 'passees'
  let options = ''
  if (org) {
    if (r.status === 'draft') {
      options = `
        ${sheetOption('Reprendre', { sim: `renc-edit:${r.id}` })}
        ${sheetOption('Supprimer le brouillon', { sim: `renc-delete-draft:${r.id}`, danger: true })}`
    } else if (pastOrCancelled) {
      options = `
        ${sheetOption('Conversation', { sim: `renc-message:${r.id}` })}
        ${sheetOption('Retirer de ma liste', { sim: `renc-remove-list:${r.id}` })}`
    } else {
      options = `
        ${sheetOption('Modifier', { sim: `renc-edit:${r.id}` })}
        ${r.kind === 'collectif' ? sheetOption('Gérer les invités', { go: 'rencontre-guests' }) : ''}
        ${sheetOption('Conversation', { sim: `renc-message:${r.id}` })}
        ${sheetOption('Annuler la rencontre', { sim: `renc-cancel:${r.id}`, danger: true })}`
    }
  } else {
    options = `
      ${sheetOption('Conversation', { sim: `renc-message:${r.id}` })}
      ${sheetOption('Profil organisateur', { sim: 'renc-stub:profil' })}
      ${sheetOption('Signaler', { sim: `renc-report:${r.id}`, danger: true })}
      ${pastOrCancelled ? sheetOption('Retirer de ma liste', { sim: `renc-remove-list:${r.id}` }) : ''}`
  }
  return wrap(`${photo(`Fond ${r.title}…`, 'dim')}`, {
    header: phoneHeader({ title: 'Options', chrome: 'panel', closeIcon: true }),
    footer: '',
    overlay: modalShell('Options de la rencontre', options),
  })
}

function communautesStub(title) {
  // legacy alias — Groupes/Clubs use communautesList
  if (title === 'Groupes') return communautesList('groupes')
  if (title === 'Clubs') return communautesList('clubs')
  return mesRencontres()
}

function enregistrements() {
  return wrap(
    `
    <div class="tabs">
      <button class="hit tab on" type="button">Tout</button>
      <button class="hit tab" type="button">Annonces</button>
      <button class="hit tab" type="button">Lieux</button>
      <button class="hit tab" type="button">À préciser</button>
    </div>
    ${tbd('Emplacement Enregistrements à fixer avant de figer le footer')}
    <h2 class="sec">Enregistrés (structure)</h2>
    ${listCard({
      title: 'Annonce enregistrée…',
      meta: 'Petites annonces · …',
      badge: 'Sauvé',
      actions: [{ label: 'Ouvrir', go: 'annonce-details', primary: true }],
    })}
    ${listCard({
      title: 'Marché central',
      meta: 'Économie · Commerces',
      badge: 'Sauvé',
      actions: [
        {
          label: 'Ouvrir',
          go: 'dir-economie-commerces-fiche-infos',
          openFiche: 'fiche-commerce-1',
          primary: true,
        },
      ],
    })}
    <h2 class="sec">État vide</h2>
    ${emptyState('Aucun enregistrement pour le moment')}
    <button class="hit row-link" data-go="etat-vide"><span>Démo état vide</span><span>›</span></button>
    <button class="hit row-link" data-go="etat-chargement"><span>Démo chargement</span><span>›</span></button>
    <button class="hit row-link" data-go="etat-erreur"><span>Démo erreur</span><span>›</span></button>
    `,
    {
      header: phoneHeader({ title: 'Enregistrements', backTo: 'accueil-kapan' }),
      footer: phoneFooter('menu'),
    }
  )
}

function menuPlus() {
  return wrap(
    `
    <h2 class="sec">Menu (provisoire)</h2>
    ${[
      ['Vie locale (hub)', 'vie-locale-hub'],
      ['Vie locale — Santé', 'sante-accueil'],
      ['Tourisme', 'dir-tourisme'],
      ['Cinémas & Théâtres', 'dir-cinemas'],
      ['Économie', 'dir-economie'],
      ['Banques & Assurances', 'dir-banques'],
      ['Permanences', 'dir-permanences'],
      ['Événements', 'evenements-liste'],
      ['Petites annonces', 'annonces-liste'],
      ['Offres d’emploi', 'emplois-liste'],
      ['N° Urgence', 'urgence-numeros'],
      ['Messages', 'messages'],
      ['Enregistrements', 'enregistrements'],
      ['États UI (démo)', 'etats-hub'],
    ]
      .map(
        ([l, g]) =>
          `<button class="hit row-link" data-go="${g}"><span>${l}</span><span>›</span></button>`
      )
      .join('')}
    ${tbd('Footer définitif — étude progressive')}
    `,
    {
      header: phoneHeader({ title: 'Menu', backTo: 'accueil-kapan' }),
      footer: phoneFooter('menu'),
    }
  )
}

/* ——— Vie locale directory (modèle Santé / maquettes validées) ——— */

/** Shared sous-catégorie cards — Santé / Vie locale / Ma mairie accès */
function sousCatGrid(cats, { proposition = false } = {}) {
  const n = cats.length
  const gridClass = n === 3 ? 'grid-3' : n >= 4 ? 'grid-4' : 'grid-2'
  return `
    <div class="${gridClass}">
      ${cats
        .map(
          (c) => `
        <button class="hit icon-tile" data-go="${c.go}" title="${c.label}"${
            c.section ? ` style="--section:${colorFor(c.section)}"` : ''
          }>
          <span class="ico-box round"${
            c.section ? ` style="--section:${colorFor(c.section)}"` : ''
          }></span>
          <span>${c.label}</span>
          ${proposition ? '<span class="meta">À valider</span>' : ''}
        </button>`
        )
        .join('')}
    </div>
  `
}

/** Accueil rubrique: banner + N cat blocks + search/filters + Autour de vous (+ useful if shown) */
function rubriqueAccueil({
  title,
  bannerTitle,
  bannerText = 'Texte…',
  searchPh,
  filters,
  cats,
  around = null,
  useful = [],
  back = 'vie-locale-hub',
  proposition = false,
  aroundActions = null,
} = {}) {
  const blocks = [...cats]
  const filterChips = filters || ['Tous', 'Ouverts', 'À proximité']
  const mixed =
    around ||
    blocks.map((c, i) => ({
      title: `Fiche ${c.label}…`,
      meta: `${c.label} · distance…`,
      badge: i === 0 ? 'Ouvert' : '…',
      ficheGo: c.ficheGo || 'dir-fiche',
      openFiche: c.openFiche || null,
    }))
  const defaultActions = (item) => {
    if (aroundActions) return aroundActions(item)
    const target = item.ficheGo || item.go || 'dir-fiche'
    const open = item.openFiche || null
    if (open) {
      ensureDemoFiche({
        id: open,
        title: item.title,
        sousCat: (item.meta || '').split('·')[0]?.trim() || 'Catégorie',
        description: `Présentation de ${item.title}.`,
      })
    }
    return [
      open
        ? { label: 'Détails', go: target, openFiche: open, primary: true }
        : { label: 'Détails', go: target, primary: true },
      { label: 'Appeler', sim: 'appeler' },
    ]
  }

  return wrap(
    `
    ${proposition ? tbd('Proposition — À valider') : ''}
    <div class="banner-box">
      ${photo('Bannière…')}
      <strong>${bannerTitle || title}</strong>
      ${text(bannerText)}
    </div>
    ${sousCatGrid(blocks, { proposition })}
    ${search(searchPh || `Rechercher dans ${title}…`)}
    ${chips(filterChips)}
    <h2 class="sec">Autour de vous</h2>
    <p class="meta">Liste mixte des sous-catégories</p>
    ${mixed
      .map(
        (item) =>
          listCard({
            title: item.title,
            meta: item.meta,
            badge: item.badge || 'Ouvert',
            actions: defaultActions(item),
          })
      )
      .join('')}
    ${
      useful.length
        ? `<h2 class="sec">Informations utiles</h2>
      ${useful
        .map(
          (u) => `
        <button class="hit row-link" data-go="${u.go}">
          <span class="ico-box"></span>
          <span><strong>${u.label}</strong><br/><span class="meta">${u.meta || 'Texte…'}</span></span>
          <span>›</span>
        </button>`
        )
        .join('')}`
        : ''
    }
    `,
    {
      header: phoneHeader({ title, backTo: back }),
      footer: phoneFooter('menu'),
    }
  )
}

/** Sous-page: no banner, no cat blocks — search, filters, cards → fiche (par id) */
function rubriqueListe(title, parentId, { ficheGo = 'dir-fiche', filters = null, proposition = false, cardActions = null, known = null } = {}) {
  const rows = listRowsForRubrique(title, ficheGo, { parentId, known })
  const actions = (item) =>
    cardActions
      ? cardActions(item)
      : [
          { label: 'Détails', go: item.ficheGo || ficheGo, openFiche: item.id, primary: true },
          { label: 'Appeler', sim: 'appeler' },
        ]
  return wrap(
    `
    ${proposition ? tbd('Sous-page proposition — À valider') : ''}
    ${search(`Rechercher dans ${title}…`)}
    ${chips(filters || ['Tous', 'Ouverts', 'À proximité', 'Enregistrés'])}
    ${rows
      .map((item) =>
        listCard({
          title: item.title,
          meta: item.meta,
          badge: item.badge,
          actions: actions(item),
        })
      )
      .join('')}
    `,
    {
      header: phoneHeader({ title, backTo: parentId }),
      footer: phoneFooter('menu'),
    }
  )
}

/** Rubrique without validated cats — no invented blocks */
function rubriqueNonValidee(title) {
  return wrap(
    `
    <div class="banner-box">
      ${photo('Bannière…')}
      <strong>${title}</strong>
      ${text('Structure annuaire — sous-catégories non validées')}
    </div>
    ${tbd('Sous-catégories / maquette — À préciser (ne pas inventer)')}
    `,
    {
      header: phoneHeader({ title, backTo: 'vie-locale-hub' }),
      footer: phoneFooter('menu'),
    }
  )
}

function vieLocaleHub() {
  const tile = (l, g) => `
        <button class="hit icon-tile" data-go="${g}" style="--section:${colorFor(g)}">
          <span class="ico-box" style="--section:${colorFor(g)}"></span>
          <span>${l}</span>
        </button>`
  const validated = [
    ['Santé', 'sante-accueil'],
    ['Tourisme', 'dir-tourisme'],
    ['Éducation', 'dir-education'],
    ['Cinémas & Théâtres', 'dir-cinemas'],
  ]
  const propositions = [
    ['Économie', 'dir-economie'],
    ['Aide sociale', 'dir-aide-sociale'],
    ['Associations', 'dir-associations'],
    ['Banques & Assurances', 'dir-banques'],
    ['Transports', 'dir-transports'],
    ['Bibliothèque', 'dir-bibliotheques'],
    ['Permanences', 'dir-permanences'],
    ['Sécurité', 'dir-securite'],
    ['Météo', 'page-meteo'],
  ]
  const other = [
    ['N° Urgence', 'urgence-numeros'],
    ['Restaurants', 'dir-restaurants'],
    ['Patrimoine (rubrique)', 'dir-patrimoine'],
  ]
  return wrap(
    `
    <h2 class="sec">Vie locale — validées</h2>
    <div class="grid-3">
      ${validated.map(([l, g]) => tile(l, g)).join('')}
    </div>
    <h2 class="sec">Propositions — À valider</h2>
    <div class="grid-3">
      ${propositions
        .map(
          ([l, g]) => `
        <button class="hit icon-tile" data-go="${g}" style="--section:${colorFor(g)}">
          <span class="ico-box" style="--section:${colorFor(g)}"></span>
          <span>${l}</span>
          <span class="meta">À valider</span>
        </button>`
        )
        .join('')}
    </div>
    <h2 class="sec">Autres</h2>
    <div class="grid-3">
      ${other.map(([l, g]) => tile(l, g)).join('')}
    </div>
    `,
    {
      header: phoneHeader({ title: 'Vie locale', backTo: 'accueil-kapan' }),
      footer: phoneFooter('menu'),
    }
  )
}

/**
 * Fiche détail — Infos / Horaires
 * noHours: Nature / Activités → « Pas d’horaire d’ouverture » (ne pas inventer)
 */
function dirFiche(tab = 'infos', { title = 'Fiche détail…', category = 'Catégorie', noHours = false, backTo = 'vie-locale-hub', idInfos = 'dir-fiche', idHoraires = 'dir-fiche-horaires', ficheId = null } = {}) {
  const openId = ficheId || getOpenDirFicheId()
  const fiche = openId ? getFiche(openId) : null
  const displayTitle = fiche?.title || title
  const displayCat = fiche?.sousCat || category
  const address = fiche?.address || '12 rue exemple, Kapan'
  const phone = fiche?.phone || ''
  const hours = fiche?.hours || (noHours ? '' : '08:00 – 18:00')
  const desc = fiche?.description || `Présentation de ${displayTitle}.`
  const hasPhone = fiche ? fiche.hasPhone && !!phone : !!phone
  const hasPlace = fiche ? fiche.hasPlace : true
  const resolvedBack = fiche?.listBackTo || backTo
  const resolvedId = fiche?.id || openId || null

  const statusBox = noHours
    ? `<div class="notice"><strong>Pas d’horaire d’ouverture</strong>${text('À vérifier sur place')}</div>`
    : `<div class="notice"><strong>Ouvert</strong>${text(hours ? `Aujourd’hui : ${hours}` : 'Horaires…')}</div>`

  const horairesBody = noHours
    ? `<h2 class="sec">Horaires d’ouverture</h2>
       <div class="notice"><strong>Pas d’horaire d’ouverture exact</strong>${text('À vérifier sur place')}</div>`
    : `<h2 class="sec">Horaires d’ouverture</h2>
       <p class="meta">${hours || 'Horaires à préciser'}</p>
       ${['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']
         .map(
           (d) => `
         <div class="row-link static">
           <span>${d}</span>
           <span class="meta">${d === 'Dimanche' ? 'Fermé' : hours || '08:00 – …'}</span>
         </div>`
         )
         .join('')}`

  const adminEdit = isAdminRole()
    ? `<button class="hit btn block outline admin-shortcut" data-sim="fiche-edit:${resolvedId || 'new'}" type="button">Modifier cette fiche</button>`
    : ''

  const actions = `
    <div class="row-actions">
      ${hasPlace ? `<button class="hit btn" data-sim="itineraire">Itinéraire</button>` : ''}
      ${hasPhone ? `<button class="hit btn primary" data-sim="appeler:${escapeAttr(phone)}">Appeler</button>` : ''}
    </div>`

  return wrap(
    `
    ${photo('Photo…', 'hero')}
    <div class="detail-head">
      <strong>${displayTitle}</strong>
      ${noHours ? '' : '<span class="badge">Ouvert</span>'}
      <p class="meta">${displayCat} · distance…</p>
    </div>
    ${statusBox}
    ${actions}
    ${adminEdit}
    <div class="tabs">
      <button class="hit tab ${tab === 'infos' ? 'on' : ''}" data-go="${idInfos}">Informations</button>
      <button class="hit tab ${tab === 'horaires' ? 'on' : ''}" data-go="${idHoraires}">Horaires</button>
    </div>
    ${
      tab === 'infos'
        ? `<h2 class="sec">Contact</h2>
           <p class="meta">${phone ? `Tél. ${phone}` : 'Pas de téléphone'} · ${address}</p>
           <h2 class="sec">Adresse</h2>
           ${text(address)}
           <h2 class="sec">À propos</h2>
           ${text(desc)}
           ${photo('Carte…', 'map')}`
        : horairesBody
    }
    `,
    {
      header: phoneHeader({ title: 'Détails', backTo: resolvedBack }),
      footer: phoneFooter('menu'),
    }
  )
}

function ficheAnnuaireForm() {
  const ctx = getFicheContext()
  const isCreate = !ctx || ctx.mode === 'create' || !ctx.id
  const fiche = !isCreate && ctx?.id ? getFiche(ctx.id) : null
  const name = isCreate ? '' : fiche?.title || ctx?.title || ''
  const address = isCreate ? '' : fiche?.address || ''
  const phone = isCreate ? '' : fiche?.phone || ''
  const hours = isCreate ? '' : fiche?.hours || ''
  const desc = isCreate ? '' : fiche?.description || ''
  const cat = fiche?.sousCat || ctx?.category || 'Santé / Pharmacies'
  const backTo = ctx?.backTo || 'admin-annuaire-rubrique'
  return wrap(
    `
    <div class="form-card" data-fiche-id="${fiche?.id || ''}">
      <h2 class="sec">${isCreate ? 'Nouvelle fiche' : 'Modifier la fiche'}</h2>
      <p class="meta">${isCreate ? 'Création · champs vides' : `${name} · édition`} · formulaire partagé</p>
      <label class="field"><span>Nom</span><input type="text" value="${escapeAttr(name)}" placeholder="Nom de la fiche" data-field="fiche-name" /></label>
      <label class="field"><span>Catégorie</span>
        <select data-field="fiche-category">
          ${['Santé / Pharmacies', 'Éducation', 'Tourisme', 'Économie', 'Associations', 'Restaurants', 'Transports', 'Autre']
            .map((c) => `<option ${c === cat || c.includes(cat) ? 'selected' : ''}>${c}</option>`)
            .join('')}
        </select>
      </label>
      <label class="field"><span>Adresse</span><input type="text" placeholder="Adresse…" value="${escapeAttr(address)}" data-field="fiche-address" /></label>
      <label class="field"><span>Téléphone</span><input type="text" placeholder="Tél…" value="${escapeAttr(phone)}" data-field="fiche-phone" /></label>
      <label class="field"><span>Horaires</span><input type="text" placeholder="Horaires…" value="${escapeAttr(hours)}" data-field="fiche-hours" /></label>
      <label class="field"><span>Description</span><textarea rows="3" placeholder="Description…" data-field="fiche-desc">${escapeHtml(desc)}</textarea></label>
      <div class="field">
        <span>Photo</span>
        ${photo('Photo fiche…')}
        <button class="hit btn" data-sim="upload" type="button">Ajouter photo (simulé)</button>
      </div>
      <label class="field"><span>Statut</span>
        <select data-field="fiche-status"><option>Brouillon</option><option ${!isCreate ? 'selected' : ''}>Publié</option></select>
      </label>
      ${lifecycleBar('brouillon')}
      <div class="row-actions">
        <button class="hit btn" data-sim="fiche-save-draft" type="button">Brouillon</button>
        <button class="hit btn" data-sim="fiche-preview" type="button">Prévisualiser</button>
        <button class="hit btn primary" data-sim="fiche-publish" type="button">Publier</button>
      </div>
    </div>
    `,
    {
      header: phoneHeader({
        title: isCreate ? 'Nouvelle fiche' : 'Modifier la fiche',
        backTo,
        chrome: 'form',
      }),
      footer: '',
    }
  )
}

function pageUtile(title, note, backTo) {
  return wrap(
    `
    <h2 class="sec">${title}</h2>
    ${tbd(note || 'Contenu — À préciser')}
    ${text('Texte…')}
    `,
    {
      header: phoneHeader({ title, backTo }),
      footer: phoneFooter('menu'),
    }
  )
}

/* ——— Météo (structure validée) ——— */

function meteoVal(val, { illustratif = true } = {}) {
  if (val == null || val === '' || val === 'Indisponible') {
    return `<span class="meta">Indisponible</span>`
  }
  return illustratif
    ? `<span>${val} <span class="meta">(illustratif)</span></span>`
    : `<span>${val}</span>`
}

function pageMeteo() {
  const ville = 'Kapan'
  return wrap(
    `
    <h1 class="block-title">Météo — ${ville}</h1>
    <div class="grid-4">
      ${[
        ['Maintenant', 'meteo-maintenant'],
        ['Aujourd’hui', 'meteo-aujourdhui'],
        ['Demain', 'meteo-demain'],
        ['7 jours', 'meteo-7jours'],
      ]
        .map(
          ([l, g]) => `
        <button class="hit icon-tile" data-go="${g}">
          <span class="ico-box round"></span>
          <span>${l}</span>
        </button>`
        )
        .join('')}
    </div>

    <section class="card">
      <h2 class="sec">Synthèse actuelle</h2>
      <p><strong>Condition</strong> · ${meteoVal('Ensoleillé')}</p>
      <p><strong>T°</strong> · ${meteoVal('22°C')} · ressentie ${meteoVal('21°C')}</p>
      <p class="meta">Min / max jour · ${meteoVal('14° / 24°')}</p>
      <p class="meta">Actualisé · ${meteoVal('aujourd’hui 07:00')}</p>
      <button class="hit btn primary block" data-go="meteo-maintenant">Voir les détails</button>
    </section>

    <section class="card">
      <h2 class="sec">Prochaines heures</h2>
      <p class="meta">Aperçu (illustratif)</p>
      ${['08:00', '11:00', '14:00']
        .map(
          (h) => `
        <div class="row-link static">
          <span>${h}</span>
          <span class="meta">Conditions… · ${meteoVal('…°')} · pluie ${meteoVal('…%')}</span>
        </div>`
        )
        .join('')}
      <button class="hit btn block" data-go="meteo-aujourdhui">Voir toute la journée</button>
    </section>

    <section class="card">
      <h2 class="sec">Aperçu prochains jours</h2>
      ${[
        ['Demain', 'meteo-demain', '15° / 23°'],
        ['Après-demain', 'meteo-jour', 'Indisponible'],
        ['J+3', 'meteo-jour', 'Indisponible'],
      ]
        .map(
          ([jour, go, mm]) => `
        <button class="hit row-link" data-go="${go}">
          <span><strong>${jour}</strong><br/><span class="meta">Conditions… · ${
            mm === 'Indisponible' ? meteoVal(null) : meteoVal(mm)
          }</span></span>
          <span>›</span>
        </button>`
        )
        .join('')}
      <button class="hit btn block" data-go="meteo-7jours">Voir les 7 jours</button>
    </section>
    `,
    {
      header: phoneHeader({ title: 'Météo', backTo: 'vie-locale-hub' }),
      footer: phoneFooter('menu'),
    }
  )
}

/** Modèle : Conditions actuelles (= détail Maintenant) */
function meteoMaintenant() {
  return wrap(
    `
    <h1 class="block-title">Maintenant</h1>
    <p class="meta">Kapan · Actualisé ${meteoVal('07:00')}</p>
    <div class="banner-box">
      <strong>Condition</strong>
      <div class="big-num">${meteoVal('22°C')}</div>
      <p>Ressentie ${meteoVal('21°C')}</p>
    </div>
    <h2 class="sec">Conditions détaillées</h2>
    <div class="row-link static"><span>Vent</span><span>${meteoVal('12 km/h')}</span></div>
    <div class="row-link static"><span>Humidité</span><span>${meteoVal('45 %')}</span></div>
    <div class="row-link static"><span>Précipitations</span><span>${meteoVal('0 %')}</span></div>
    <div class="row-link static"><span>Visibilité</span><span>${meteoVal(null)}</span></div>
    <h2 class="sec">Soleil</h2>
    <div class="row-link static"><span>Lever</span><span>${meteoVal('06:42')}</span></div>
    <div class="row-link static"><span>Coucher</span><span>${meteoVal('18:55')}</span></div>
    <button class="hit btn primary block" data-go="meteo-aujourdhui">Voir les prévisions d’aujourd’hui</button>
    `,
    {
      header: phoneHeader({ title: 'Maintenant', backTo: 'page-meteo' }),
      footer: phoneFooter('menu'),
    }
  )
}

/** Modèle : Prévisions d’une journée (Aujourd’hui / Demain / jour choisi) */
function meteoJournee(label, { backTo = 'page-meteo', dateLabel = null } = {}) {
  const title = dateLabel ? `Météo du ${dateLabel}` : label
  return wrap(
    `
    <h1 class="block-title">${title}</h1>
    <section class="card">
      <strong>Résumé du jour</strong>
      <p>Conditions… · min ${meteoVal('14°')} / max ${meteoVal('24°')}</p>
      <p class="meta">Actualisé · ${meteoVal('07:00')}</p>
    </section>
    <p class="meta">Filtres (filtrent la liste horaire — pas de changement de page)</p>
    ${chips(['Toute la journée', 'Matin', 'Après-midi', 'Soir'])}
    <h2 class="sec">Liste horaire</h2>
    <p class="meta">Non cliquable</p>
    ${['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00']
      .map(
        (h) => `
      <div class="row-link static">
        <span>${h}</span>
        <span class="meta">Cond.… · ${meteoVal('…°')} · pluie ${meteoVal('…%')} · vent ${meteoVal('…')}</span>
      </div>`
      )
      .join('')}
    ${
      backTo === 'meteo-7jours'
        ? `<button class="hit btn block" data-go="meteo-7jours">Retour à la liste 7 jours</button>`
        : ''
    }
    `,
    {
      header: phoneHeader({ title, backTo }),
      footer: phoneFooter('menu'),
    }
  )
}

/** Modèle : Liste des journées (7 jours) */
function meteo7Jours() {
  const days = [
    { label: 'Aujourd’hui', go: 'meteo-aujourdhui', mm: '14° / 24°' },
    { label: 'Demain', go: 'meteo-demain', mm: '15° / 23°' },
    { label: 'Jeu. 2 oct.', go: 'meteo-jour', mm: 'Indisponible' },
    { label: 'Ven. 3 oct.', go: 'meteo-jour', mm: 'Indisponible' },
    { label: 'Sam. 4 oct.', go: 'meteo-jour', mm: 'Indisponible' },
    { label: 'Dim. 5 oct.', go: 'meteo-jour', mm: 'Indisponible' },
    { label: 'Lun. 6 oct.', go: 'meteo-jour', mm: 'Indisponible' },
  ]
  return wrap(
    `
    <h1 class="block-title">7 jours</h1>
    <p class="meta">Kapan · Actualisé ${meteoVal('07:00')}</p>
    ${days
      .map(
        (d) => `
      <article class="card">
        <div class="row-link static">
          <span><strong>${d.label}</strong><br/>
            <span class="meta">Conditions… · ${
              d.mm === 'Indisponible' ? meteoVal(null) : meteoVal(d.mm)
            } · pluie ${meteoVal(d.mm === 'Indisponible' ? null : '…%')}</span>
          </span>
        </div>
        <button class="hit btn primary block" data-go="${d.go}">Voir la journée</button>
      </article>`
      )
      .join('')}
    `,
    {
      header: phoneHeader({ title: '7 jours', backTo: 'page-meteo' }),
      footer: phoneFooter('menu'),
    }
  )
}

function signalFilterChips(admin) {
  const filters = admin
    ? ['Tous', 'Non lus', 'À répondre', 'Répondus']
    : ['Tous', 'En attente de réponse', 'Avec réponse']
  const active = getSignalFilter(admin)
  return `<div class="chips">${filters
    .map(
      (f) =>
        `<button class="hit chip ${f === active ? 'on' : ''}" type="button" data-sim="signal-filter:${f}">${f}</button>`
    )
    .join('')}</div>`
}

function signalReadBadge(s) {
  return `<span class="badge signal-read-badge">${readLabel(s)}</span>`
}

function signalReplyBadge(s) {
  const label = replyLabel(s)
  const cls =
    label === 'Avec réponse' ? 'signal-reply-badge has-reply' : 'signal-reply-badge waiting'
  return `<span class="badge ${cls}">${label}</span>`
}

function signalementsInbox() {
  const admin = isAdminRole()
  const list = listSignalementsForViewer({ admin })
  const title = admin ? 'Signalements reçus' : 'Signalements'
  const intro = admin
    ? 'Boîte de la mairie de Kapan — échangez avec les habitants.'
    : 'Signalez un problème dans votre ville et échangez avec votre mairie.'

  const emptyRows =
    list.length === 0
      ? `
      ${emptyState(
        admin
          ? 'Aucun signalement pour cette ville.'
          : 'Vous n’avez pas encore envoyé de signalement.'
      )}
      ${
        admin
          ? ''
          : `<button class="hit btn primary block" data-go="signalement-nouveau" type="button">+ Nouveau signalement</button>`
      }`
      : ''

  const rows =
    list.length === 0
      ? emptyRows
      : list
          .map((s) => {
            const last = lastMessage(s)
            const preview = last
              ? `${last.authorLabel || ''} · ${last.body}`
              : ''
            const date = (last?.at || '').split(' · ')[0] || '…'
            const unreadHabitant = !admin && isNewMairieReply(s)
            const unreadAdmin = admin && isUnreadForMairie(s)
            const unread = unreadHabitant || unreadAdmin
            return `
        <button class="hit signal-row ${unread ? 'signal-unread' : ''}" type="button" data-open-signal="${s.id}">
          <div class="signal-row-top">
            ${signalReadBadge(s)}
            ${signalReplyBadge(s)}
            ${unreadHabitant ? '<span class="badge signal-new-reply">Nouvelle réponse</span>' : ''}
            ${unread ? '<span class="signal-dot" aria-label="Non lu"></span>' : ''}
          </div>
          <strong>${s.subject}</strong>
          ${admin ? `<p class="meta">${s.authorName} · ${s.place}</p>` : ''}
          <p class="meta signal-preview">${preview}</p>
          <span class="meta signal-date">${date}</span>
        </button>`
          })
          .join('')

  return wrap(
    `
    <h2 class="sec">${title}</h2>
    <p class="meta">${intro}</p>
    ${
      admin
        ? ''
        : `<button class="hit btn primary block" data-go="signalement-nouveau" type="button">+ Nouveau signalement</button>
    <h3 class="sec signal-section-label">Mes signalements envoyés</h3>`
    }
    ${signalFilterChips(admin)}
    <div class="signal-list">${rows}</div>
    `,
    {
      header: phoneHeader({ title, backTo: 'mairie-accueil' }),
      footer: phoneFooter('mairie'),
    }
  )
}

function signalementNouveau() {
  const uploadSlot = `
    <p class="meta">Photos (facultatif)</p>
    <div class="upload-box">
      <span class="avatar lg upload-slot"></span>
      <p class="meta">Ajoutez une image · JPG / PNG · max 5 Mo</p>
      <button class="hit btn" type="button" data-sim="upload">Choisir</button>
    </div>
  `
  return wrap(
    `
    <h2 class="sec">Nouveau signalement</h2>
    <label class="field"><span>Objet *</span><input type="text" placeholder="Objet du signalement" /></label>
    <label class="field"><span>Lieu *</span><input type="text" placeholder="Adresse ou lieu précis" /></label>
    <label class="field"><span>Description *</span><textarea placeholder="Décrivez le problème…" rows="4"></textarea></label>
    ${uploadSlot}
    <label class="field"><span>Catégorie (facultatif)</span>
      <select>
        <option value="">— Aucune —</option>
        ${SIGNAL_CATEGORIES.map((c) => `<option>${c}</option>`).join('')}
      </select>
    </label>
    <div class="row-actions">
      <button class="hit btn block" type="button" data-back>Annuler</button>
      <button class="hit btn primary block" type="button" data-sim="signal-create">Envoyer le signalement</button>
    </div>
    `,
    {
      header: phoneHeader({ title: 'Nouveau', backTo: 'signalements', chrome: 'form' }),
      footer: '',
    }
  )
}

function signalementConversation() {
  const admin = isAdminRole()
  const id = getOpenSignalId()
  let s = id ? getSignalement(id) : null
  if (!s) {
    return wrap(
      `
      ${emptyState('Aucun signalement sélectionné.')}
      <button class="hit btn primary block" data-go="signalements" type="button">Retour aux signalements</button>
      `,
      {
        header: phoneHeader({ title: 'Signalement', backTo: 'signalements' }),
        footer: phoneFooter('mairie'),
      }
    )
  }

  if (admin) openAsMairie(s.id)
  else openAsHabitant(s.id)
  s = getSignalement(s.id)

  const first = s.messages.find((m) => m.kind === 'user') || s.messages[0]
  const rest = s.messages.filter((m) => m !== first)

  const thread = rest
    .map((m) => {
      const side = m.kind === 'mairie' ? 'in' : 'out'
      const label = m.kind === 'mairie' ? 'Mairie de Kapan' : m.authorLabel || 'Vous'
      return `
        <div class="bubble ${side}">
          <span class="meta">${label}</span><br/>
          ${m.body}
          ${m.photos ? `<div class="meta">Photo jointe</div>` : ''}
          <div class="meta">${m.at || ''}</div>
        </div>`
    })
    .join('')

  let composer = ''
  if (admin) {
    composer = `
    <div class="composer-bar">
      <input type="text" placeholder="Répondre à l’habitant…" />
      <button class="hit btn primary" type="button" data-sim="signal-reply-mairie:${s.id}">Envoyer la réponse</button>
    </div>`
  } else if (!hasMairieReply(s)) {
    composer = `
    <p class="meta signal-waiting">Votre signalement est en attente d’une réponse de la mairie.</p>`
  } else {
    composer = `
    <div class="composer-bar">
      <input type="text" placeholder="Votre réponse…" />
      <button class="hit btn primary" type="button" data-sim="signal-reply-user:${s.id}">Envoyer ma réponse</button>
    </div>`
  }

  return wrap(
    `
    <div class="signal-first">
      <strong>${s.subject}</strong>
      <p class="meta">${s.authorName} · ${first?.at || ''}</p>
      <p class="meta"><strong>Lieu</strong> · ${s.place}</p>
      ${s.category ? `<span class="badge">${s.category}</span>` : ''}
      <div class="signal-conv-meta">
        ${signalReadBadge(s)}
        ${signalReplyBadge(s)}
      </div>
      <p>${first?.body || ''}</p>
      ${first?.photos ? `<div class="upload-box"><span class="avatar lg upload-slot"></span><p class="meta">Photo jointe</p></div>` : ''}
    </div>
    <div class="chat signal-thread">${thread}</div>
    ${composer}
    `,
    {
      header: phoneHeader({
        title: s.subject,
        backTo: 'signalements',
      }),
      footer: phoneFooter('mairie'),
    }
  )
}

/** Distributeur ATM — horaires = accessibilité ; Appeler seulement si contact */
function ficheDistributeur(tab = 'infos') {
  return wrap(
    `
    ${tbd('Proposition Banques — À valider')}
    ${photo('Photo distributeur…', 'hero')}
    <div class="detail-head">
      <strong>Distributeur…</strong>
      <p class="meta">Distributeurs · distance…</p>
    </div>
    <div class="notice"><strong>Accessibilité</strong>${text('Horaires d’accès au lieu… (≠ horaires banque)')}</div>
    <div class="row-actions">
      <button class="hit btn" data-sim="itineraire">Itinéraire</button>
      <button class="hit btn" type="button" title="Uniquement si contact renseigné">Appeler (si contact)</button>
    </div>
    ${tbd('Contact assistance — afficher Appeler seulement s’il est renseigné')}
    <div class="tabs">
      <button class="hit tab ${tab === 'infos' ? 'on' : ''}" data-go="dir-banques-distributeur-infos">Informations</button>
      <button class="hit tab ${tab === 'horaires' ? 'on' : ''}" data-go="dir-banques-distributeur-horaires">Accessibilité</button>
    </div>
    ${
      tab === 'infos'
        ? `${text('Adresse / organisme…')}${photo('Carte…', 'map')}`
        : `<h2 class="sec">Accessibilité</h2>${text('Disponible… · accès PMR… · À préciser')}`
    }
    `,
    {
      header: phoneHeader({ title: 'Détails', backTo: 'dir-banques-distributeurs' }),
      footer: phoneFooter('menu'),
    }
  )
}

function pageAPreciser() {
  return wrap(
    `
    <h2 class="sec">À préciser</h2>
    ${tbd('Destination / contenu non défini — ne pas inventer')}
    <button class="hit btn block" data-back>Retour</button>
    `,
    {
      header: phoneHeader({ title: 'À préciser', backTo: 'accueil-kapan' }),
      footer: phoneFooter('menu'),
    }
  )
}

function etatsHub() {
  return wrap(
    `
    <h2 class="sec">États UI (démo structure)</h2>
    <button class="hit row-link" data-go="etat-vide"><span>Vide</span><span>›</span></button>
    <button class="hit row-link" data-go="etat-chargement"><span>Chargement</span><span>›</span></button>
    <button class="hit row-link" data-go="etat-erreur"><span>Erreur</span><span>›</span></button>
    <button class="hit row-link" data-go="etat-horaires-manquants"><span>Horaires manquants</span><span>›</span></button>
    `,
    {
      header: phoneHeader({ title: 'États UI', backTo: 'menu-plus' }),
      footer: phoneFooter('menu'),
    }
  )
}

function etatVide() {
  return wrap(`${emptyState('Aucun contenu pour le moment')}<button class="hit btn block" data-back>Retour</button>`, {
    header: phoneHeader({ title: 'État vide', backTo: 'etats-hub' }),
    footer: phoneFooter('menu'),
  })
}

function etatChargement() {
  return wrap(`${loadingState('Chargement des fiches…')}<button class="hit btn block" data-back>Retour</button>`, {
    header: phoneHeader({ title: 'Chargement', backTo: 'etats-hub' }),
    footer: phoneFooter('menu'),
  })
}

function etatErreur() {
  return wrap(`${errorState('Impossible de charger — structure')}`, {
    header: phoneHeader({ title: 'Erreur', backTo: 'etats-hub' }),
    footer: phoneFooter('menu'),
  })
}

function etatHorairesManquants() {
  return wrap(
    `
    <h2 class="sec">Horaires</h2>
    <div class="notice"><strong>Aucun horaire renseigné</strong><p class="meta">Les plages exactes ne sont pas encore publiées.</p></div>
    ${emptyState('Aucun horaire disponible pour cet établissement')}
    <button class="hit btn block" data-back>Retour</button>
    `,
    {
      header: phoneHeader({ title: 'Horaires manquants', backTo: 'etats-hub' }),
      footer: phoneFooter('menu'),
    }
  )
}

/* ——— Admin ——— */

function adminHome() {
  const pendingEvents = listPendingValidation().length
  const signalUnread = listSignalementsForViewer({ admin: true }).filter(isUnreadForMairie).length
  const dash = [
    { label: 'Brouillons', meta: 'Publications & fiches en cours', count: 3, go: 'admin-mairie' },
    {
      label: 'Événements à valider',
      meta: 'Propositions habitantes',
      count: pendingEvents,
      go: 'evenements-a-valider',
    },
    { label: 'Inscriptions à valider', meta: 'Participants · file d’attente', count: 2, go: 'evenement-validation' },
    { label: 'RDV du jour', meta: 'Accueil mairie', count: 1, go: 'admin-rdv' },
    {
      label: 'Signalements',
      meta: 'Q/R non lus',
      count: signalUnread,
      go: 'signalements',
    },
  ]
  return wrap(
    `
    <h2 class="sec">Tableau de bord</h2>
    <p class="meta">Mairie de Kapan · espace administrateur</p>
    <div class="dash-grid">
      ${dash
        .map(
          (d) => `
        <button class="hit dash-card" data-go="${d.go}" type="button">
          <span><strong>${d.label}</strong><br/><span class="meta">${d.meta}</span></span>
          <span class="dash-count">${d.count}</span>
        </button>`
        )
        .join('')}
    </div>
    <h2 class="sec">Rubriques</h2>
    <button class="hit row-link" data-go="admin-mairie" type="button">
      <span><strong>Ma mairie</strong><br/><span class="meta">Page & publications</span></span><span>›</span>
    </button>
    <button class="hit row-link" data-go="admin-evenements" type="button">
      <span><strong>Événements</strong><br/><span class="meta">Liste & création</span></span><span>›</span>
    </button>
    <button class="hit row-link" data-go="admin-annonces" type="button">
      <span><strong>Annonces</strong><br/><span class="meta">Liste séparée</span></span><span>›</span>
    </button>
    <button class="hit row-link" data-go="admin-offres" type="button">
      <span><strong>Offres d’emploi</strong><br/><span class="meta">Liste séparée</span></span><span>›</span>
    </button>
    <button class="hit row-link" data-go="admin-annuaires" type="button">
      <span><strong>Annuaires</strong><br/><span class="meta">Vie locale → fiches</span></span><span>›</span>
    </button>
    <button class="hit row-link" data-go="admin-rdv" type="button">
      <span><strong>Rendez-vous</strong></span><span>›</span>
    </button>
    <button class="hit row-link" data-go="signalements" type="button">
      <span><strong>Signalements reçus</strong><br/><span class="meta">Boîte Q/R · ≠ modération</span></span><span>›</span>
    </button>
    <button class="hit row-link" data-go="admin-moderation" type="button">
      <span><strong>Modération</strong></span><span>›</span>
    </button>
    <button class="hit row-link" data-go="admin-equipe" type="button">
      <span><strong>Équipe et permissions</strong></span><span>›</span>
    </button>
    <button class="hit row-link" data-go="admin-stats" type="button">
      <span><strong>Statistiques</strong><br/><span class="meta">Secondaire</span></span><span>›</span>
    </button>
    <button class="hit btn block" data-go="accueil-kapan" type="button">Basculer vue utilisateur</button>
    `,
    {
      header: phoneHeader({
        title: 'Tableau de bord',
        showBack: false,
      }),
    }
  )
}

function adminMairie() {
  const pubs = listAdminPubs()
  return wrap(
    `
    <h2 class="sec">Ma mairie</h2>
    <button class="hit btn primary block" data-go="mairie-gerer-page" type="button">Gérer la page</button>
    <h2 class="sec">Publications</h2>
    <button class="hit btn block" data-sim="pub-create" type="button">+ Créer une publication</button>
    ${pubs
      .map(
        (p) => `
      <button class="hit row-link" data-sim="pub-edit:${p.id}" type="button">
        <span><strong>${p.title || 'Sans titre'}</strong><br/><span class="meta">Mairie de Kapan · ${pubStateLabel(p.state)}</span></span>
        <span>›</span>
      </button>`
      )
      .join('')}
    `,
    {
      header: phoneHeader({ title: 'Ma mairie', backTo: 'admin-home' }),
    }
  )
}

function adminEvenements() {
  const managed = listAdminManaged()
  const pending = listPendingValidation().length
  return wrap(
    `
    <h2 class="sec">Événements</h2>
    <button class="hit btn primary block" data-sim="event-create-municipal" type="button">+ Créer un événement</button>
    <button class="hit row-link" data-go="evenements-a-valider" type="button">
      <span><strong>Événements à valider</strong><br/><span class="meta">${pending} en attente · propositions habitantes</span></span><span>›</span>
    </button>
    ${managed
      .map((e) => {
        const label = e.title || 'Sans titre'
        return `
      <button class="hit row-link" data-sim="event-edit:${e.id}" type="button">
        <span><strong>${label}</strong><br/><span class="meta">${publicationLabel(e.publication)} · ${e.origin === 'citizen' ? 'Habitant' : 'Municipal'}</span></span>
        <span class="badge">${publicationLabel(e.publication)}</span>
      </button>`
      })
      .join('')}
    `,
    {
      header: phoneHeader({ title: 'Événements', backTo: 'admin-home' }),
    }
  )
}

function evenementsAValider() {
  const list = listPendingValidation()
  return wrap(
    `
    <h2 class="sec">Événements à valider</h2>
    <p class="meta">Propositions habitantes · révisions publiées · distinct des inscriptions</p>
    ${
      list.length
        ? list
            .map((e) => {
              const view = e.pendingRevision ? { ...e, ...e.pendingRevision } : e
              const isRev = e.revisionStatus === 'pending'
              return `
      <article class="card">
        <strong>${view.title || 'Sans titre'}</strong>
        <p class="meta">${e.orgLabel || 'Habitant'} · ${view.dateLabel || 'Date à préciser'} · ${view.lieu || 'Lieu…'}</p>
        <p class="meta">${isRev ? 'Révision d’un événement publié · version publique inchangée' : 'Nouvelle proposition'}</p>
        ${text(view.description || '')}
        <div class="row-actions">
          <button class="hit btn primary" data-sim="event-approve:${e.id}" type="button">Approuver</button>
          <button class="hit btn" data-sim="event-correct-ask:${e.id}" type="button">Demander corrections</button>
          <button class="hit btn outline" data-sim="event-refuse-ask:${e.id}" type="button">Refuser</button>
        </div>
      </article>`
            })
            .join('')
        : emptyState('Aucun événement en attente')
    }
    `,
    {
      header: phoneHeader({ title: 'À valider', backTo: 'admin-evenements' }),
    }
  )
}

function evenementValidationMotif({ mode = 'refuse', eventId } = {}) {
  const e = getEventFull(eventId)
  const title = mode === 'refuse' ? 'Refuser l’événement' : 'Demander des corrections'
  const sim = mode === 'refuse' ? `event-refuse-confirm:${eventId}` : `event-correct-confirm:${eventId}`
  return wrap(
    `
    <div class="form-card">
      <h2 class="sec">${title}</h2>
      <p class="meta">${e?.title || eventId} · ${e?.orgLabel || 'Habitant'}</p>
      <label class="field"><span>Motif (obligatoire)</span>
        <textarea rows="4" placeholder="Indiquez le motif…" data-field="motif"></textarea>
      </label>
      <div class="row-actions">
        <button class="hit btn" data-go="evenements-a-valider" type="button">Annuler</button>
        <button class="hit btn primary" data-sim="${sim}" type="button">Confirmer</button>
      </div>
    </div>
    `,
    {
      header: phoneHeader({ title: 'Motif', backTo: 'evenements-a-valider', chrome: 'form' }),
      footer: '',
    }
  )
}

function adminAnnonces() {
  return wrap(
    `
    <h2 class="sec">Annonces</h2>
    <button class="hit btn primary block" data-go="admin-annonce-form" type="button">+ Nouvelle annonce</button>
    ${['Appartement 3 pièces — publié', 'Vélo électrique — brouillon']
      .map(
        (t) => `
      <button class="hit row-link" data-go="annonce-details" type="button">
        <span><strong>${t}</strong></span><span>›</span>
      </button>`
      )
      .join('')}
    `,
    {
      header: phoneHeader({ title: 'Annonces', backTo: 'admin-home' }),
    }
  )
}

function adminAnnonceForm() {
  return wrap(
    `
    <div class="form-card">
      <h2 class="sec">Nouvelle annonce</h2>
      <label class="field"><span>Titre</span><input type="text" placeholder="Titre de l’annonce" /></label>
      <label class="field"><span>Prix</span><input type="text" placeholder="ex. 450 €" /></label>
      <label class="field"><span>Description</span><textarea rows="3" placeholder="Détails…"></textarea></label>
      <div class="row-actions">
        <button class="hit btn" data-sim="event-save-draft" type="button">Brouillon</button>
        <button class="hit btn primary" data-sim="publier-admin" type="button">Publier</button>
      </div>
    </div>
    `,
    {
      header: phoneHeader({ title: 'Annonce', backTo: 'admin-annonces', chrome: 'form' }),
      footer: '',
    }
  )
}

function adminAnnuaires() {
  const custom = ANN_RUBRIQUES.filter((r) => r.custom)
  return wrap(
    `
    <h2 class="sec">Annuaires · Vie locale</h2>
    <p class="meta">Gestion admin de toutes les rubriques (≠ hub public)</p>
    ${ANN_RUBRIQUES.map((r) => {
      if (r.id === 'sante') {
        return `
    <button class="hit row-link" data-go="admin-annuaire-sante" type="button">
      <span><strong>${r.label}</strong><br/><span class="meta">${r.meta}</span></span><span>›</span>
    </button>`
      }
      return `
    <button class="hit row-link" data-sim="annuaire-rubrique:${r.id}" type="button">
      <span><strong>${r.label}</strong>${r.custom ? ' · ajoutée' : ''}<br/><span class="meta">${r.meta}</span></span><span>›</span>
    </button>`
    }).join('')}
    <div class="form-card" style="margin-top:12px">
      <h2 class="sec">Autres rubriques</h2>
      <p class="meta">Ajouter ou retirer une rubrique Vie locale. Météo et Urgences restent hors annuaire.</p>
      <label class="field"><span>Nom de la rubrique</span><input type="text" placeholder="ex. Sport" data-field="rubrique-label" /></label>
      <button class="hit btn primary block" data-sim="rubrique-add" type="button">Ajouter une rubrique</button>
      ${
        custom.length
          ? custom
              .map(
                (r) => `
      <div class="row-actions" style="margin-top:8px">
        <span class="meta grow">${r.label}</span>
        <button class="hit btn outline" data-sim="rubrique-remove:${r.id}" type="button">Retirer</button>
      </div>`
              )
              .join('')
          : `<p class="meta">Aucune rubrique ajoutée pour l’instant.</p>`
      }
    </div>
    `,
    {
      header: phoneHeader({ title: 'Annuaires', backTo: 'admin-home' }),
    }
  )
}

function adminAnnuaireRubrique() {
  const rid = getAnnuaireRubriqueId()
  const rub = getRubrique(rid) || getRubrique('education')
  return wrap(
    `
    <h2 class="sec">${rub.label}</h2>
    <p class="meta">Sous-catégories · fiches demo · gestion admin</p>
    <h2 class="sec">Sous-catégories</h2>
    ${(rub.sousCats || [])
      .map(
        (s) => `
    <div class="row-link static">
      <span><strong>${s.label}</strong></span>
      <span class="meta">sous-cat</span>
    </div>`
      )
      .join('')}
    <h2 class="sec">Fiches</h2>
    <button class="hit btn primary block" data-sim="fiche-create:${rub.id}" type="button">+ Nouvelle fiche</button>
    ${(rub.fiches || [])
      .map(
        (f) => `
    <button class="hit row-link" data-sim="fiche-edit:${f.id}" type="button">
      <span><strong>${f.title}</strong><br/><span class="meta">${f.sousCat} · ${f.status}</span></span><span>›</span>
    </button>`
      )
      .join('') || emptyState('Aucune fiche')}
    `,
    {
      header: phoneHeader({ title: rub.label, backTo: 'admin-annuaires' }),
    }
  )
}

function adminAnnuaireSante() {
  return wrap(
    `
    <h2 class="sec">Santé</h2>
    <button class="hit row-link" data-go="admin-annuaire-pharmacies" type="button">
      <span><strong>Pharmacies</strong></span><span>›</span>
    </button>
    <button class="hit row-link" data-go="sante-hopitaux" type="button">
      <span><strong>Hôpitaux</strong></span><span>›</span>
    </button>
    `,
    {
      header: phoneHeader({ title: 'Santé', backTo: 'admin-annuaires' }),
    }
  )
}

function adminAnnuairePharmacies() {
  const fiches = listPharmacieFiches()
  return wrap(
    `
    <h2 class="sec">Pharmacies</h2>
    <button class="hit btn primary block" data-sim="fiche-create:sante" type="button">+ Nouvelle fiche</button>
    ${fiches
      .map(
        (f) => `
      <button class="hit row-link" data-sim="fiche-edit:${f.id}" type="button">
        <span><strong>${f.title}</strong><br/><span class="meta">${f.status}</span></span><span>›</span>
      </button>`
      )
      .join('')}
    `,
    {
      header: phoneHeader({ title: 'Pharmacies', backTo: 'admin-annuaire-sante' }),
    }
  )
}

function adminRdv() {
  const tab = getAdminRdvTab()
  const tabs = [
    { id: 'rdv', label: 'RDV' },
    { id: 'motifs', label: 'Motifs' },
    { id: 'dispos', label: 'Dispos' },
    { id: 'indispos', label: 'Indispos' },
  ]
  const tabBar = `
    <div class="tabs">
      ${tabs
        .map(
          (t) =>
            `<button class="hit tab ${tab === t.id ? 'on' : ''}" data-sim="rdv-admin-tab:${t.id}" type="button">${t.label}</button>`
        )
        .join('')}
    </div>`

  let body = ''
  if (tab === 'motifs') {
    const motifs = listMotifs()
    const editId = getEditMotifId()
    const edit = editId ? getMotif(editId) : null
    body = `
      <button class="hit btn primary block" data-sim="rdv-motif-create" type="button">+ Nouveau motif</button>
      ${motifs
        .map(
          (m) => `
        <button class="hit row-link" data-sim="rdv-motif-edit:${m.id}" type="button">
          <span><strong>${m.label}</strong><br/><span class="meta">${m.duration} min · ${m.active ? 'Actif' : 'Inactif'}</span></span>
          <span>›</span>
        </button>`
        )
        .join('')}
      ${
        edit
          ? `
      <div class="form-card" style="margin-top:12px">
        <h2 class="sec">Modifier le motif</h2>
        <label class="field"><span>Libellé</span><input type="text" value="${escapeAttr(edit.label)}" data-field="motif-label" /></label>
        <label class="field"><span>Durée (min)</span><input type="number" value="${edit.duration}" data-field="motif-duration" /></label>
        <label class="field"><span>Actif</span>
          <select data-field="motif-active"><option value="1" ${edit.active ? 'selected' : ''}>Oui</option><option value="0" ${!edit.active ? 'selected' : ''}>Non</option></select>
        </label>
        <div class="row-actions">
          <button class="hit btn" data-sim="rdv-motif-deactivate:${edit.id}" type="button">Désactiver</button>
          <button class="hit btn primary" data-sim="rdv-motif-save:${edit.id}" type="button">Enregistrer</button>
        </div>
      </div>`
          : ''
      }`
  } else if (tab === 'dispos') {
    const days = [
      [1, 'Lundi'],
      [2, 'Mardi'],
      [3, 'Mercredi'],
      [4, 'Jeudi'],
      [5, 'Vendredi'],
    ]
    const editWd = getDispoEditWeekday()
    body = `
      <p class="meta">Créneaux par jour · modifier sans effacer les RDV pris</p>
      ${days
        .map(([wd, label]) => {
          const slots = getDispoSlots(wd)
          if (editWd === wd) {
            return `
        <article class="form-card">
          <strong>${label} · modifier</strong>
          <label class="field"><span>Créneaux (HH:MM séparés par espace ou virgule)</span>
            <textarea rows="3" data-field="dispo-slots">${slots.join(' ')}</textarea>
          </label>
          <div class="row-actions">
            <button class="hit btn" data-sim="rdv-dispo-cancel" type="button">Annuler</button>
            <button class="hit btn primary" data-sim="rdv-dispo-save:${wd}" type="button">Enregistrer</button>
          </div>
        </article>`
          }
          return `
        <article class="card">
          <strong>${label}</strong>
          <p class="meta">${slots.join(' · ') || 'Aucun'}</p>
          <button class="hit btn" data-sim="rdv-dispo-edit:${wd}" type="button">Modifier les créneaux</button>
        </article>`
        })
        .join('')}`
  } else if (tab === 'indispos') {
    body = `
      <p class="meta">Jours / plages indisponibles</p>
      ${listIndispos()
        .map(
          (i) => `
        <div class="row-link static">
          <span><strong>${i.date}</strong><br/><span class="meta">${i.label}</span></span>
        </div>`
        )
        .join('')}`
  } else {
    const bookings = listBookings()
    body = bookings
      .map((b) => {
        const motif = getMotif(b.motifId)
        return `
      <article class="card" data-rdv-id="${b.id}">
        <p class="meta">${b.slotLabel} · ${rdvStatusLabel(b.status)}</p>
        <p><strong>Motif</strong> · ${motif?.label || b.motifId}</p>
        <p class="meta">Habitant · ${b.user}</p>
        <div class="row-actions">
          ${b.status === 'pending' ? `<button class="hit btn primary" data-sim="rdv-admin-confirm:${b.id}" type="button">Confirmer</button>` : ''}
          <button class="hit btn" data-sim="rdv-admin-move:${b.id}" type="button">Déplacer</button>
          <button class="hit btn" data-sim="rdv-admin-cancel-ask:${b.id}" type="button">Annuler</button>
          <button class="hit btn outline" data-sim="rdv-admin-done:${b.id}" type="button">Effectué</button>
          <button class="hit btn outline" data-sim="rdv-admin-absent:${b.id}" type="button">Absent</button>
        </div>
      </article>`
      })
      .join('')
  }

  return wrap(
    `
    <h2 class="sec">Rendez-vous</h2>
    ${tabBar}
    ${body}
    `,
    {
      header: phoneHeader({ title: 'Rendez-vous', backTo: 'admin-home' }),
    }
  )
}

function adminModeration() {
  const filter = getModFilter()
  const cases = listModCases(filter)
  return wrap(
    `
    <h2 class="sec">Modération</h2>
    <p class="meta">Contenus signalés — distinct de la boîte quartier (Signalements).</p>
    <div class="tabs">
      <button class="hit tab ${filter === 'open' ? 'on' : ''}" data-sim="mod-filter:open" type="button">À traiter</button>
      <button class="hit tab ${filter === 'resolved' ? 'on' : ''}" data-sim="mod-filter:resolved" type="button">Traités</button>
    </div>
    ${
      cases.length
        ? cases
            .map(
              (c) => `
    <button class="hit row-link" data-open-mod-case="${c.id}" type="button">
      <span><strong>${c.title}</strong><br/><span class="meta">${modTypeLabel(c.type)} · ${c.author} · ${c.date}</span></span>
      <span class="badge">${c.state === 'open' ? 'À traiter' : 'Traité'}</span>
    </button>`
            )
            .join('')
        : emptyState(filter === 'open' ? 'Aucun dossier à traiter' : 'Aucun dossier traité')
    }
    <button class="hit row-link" data-go="signalements" type="button">
      <span><strong>Signalements quartier</strong><br/><span class="meta">Boîte mairie · Voirie, éclairage…</span></span><span>›</span>
    </button>
    `,
    {
      header: phoneHeader({ title: 'Modération', backTo: 'admin-home' }),
    }
  )
}

function moderationCase() {
  const id = getOpenModCaseId()
  const c = getModCase(id)
  if (!c) {
    return wrap(
      `
      ${emptyState('Dossier introuvable')}
      <button class="hit btn block" data-go="admin-moderation" type="button">Retour</button>
      `,
      { header: phoneHeader({ title: 'Dossier', backTo: 'admin-moderation' }) }
    )
  }
  const ficheBtn =
    c.type === 'fiche'
      ? `<button class="hit btn block" data-sim="mod-open-fiche:${c.id}" type="button">Ouvrir le formulaire fiche</button>`
      : ''
  const retablir =
    c.masked && !c.authorDeleted
      ? `<button class="hit btn" data-sim="mod-decide:retablir:${c.id}" type="button">Rétablir</button>`
      : c.authorDeleted
        ? `<p class="meta">Rétablir indisponible — contenu supprimé par l’auteur</p>`
        : ''
  return wrap(
    `
    <div class="form-card">
      <h2 class="sec">Dossier de modération</h2>
      <p class="meta">${c.id} · ${c.state === 'open' ? 'À traiter' : 'Traité'}</p>
      <div class="row-link static"><span>Type</span><span>${modTypeLabel(c.type)}</span></div>
      <div class="row-link static"><span>Titre</span><span>${c.title}</span></div>
      <div class="row-link static"><span>Auteur</span><span>${c.author}</span></div>
      <div class="row-link static"><span>Motif</span><span>${c.motif}</span></div>
      <div class="row-link static"><span>Date</span><span>${c.date}</span></div>
      <div class="row-link static"><span>État</span><span>${c.state === 'open' ? 'Ouvert' : `Résolu · ${modDecisionLabel(c.decision)}`}</span></div>
      ${c.decisionMotif ? `<p class="meta">Motif décision · ${c.decisionMotif}</p>` : ''}
      <button class="hit row-link" data-go="${c.contentGo}" type="button">
        <span><strong>Contenu concerné</strong><br/><span class="meta">${c.contentLabel}</span></span><span>›</span>
      </button>
      ${ficheBtn}
      ${
        c.state === 'open'
          ? `
      <h2 class="sec">Décision</h2>
      <label class="field"><span>Motif (requis pour masquer / retirer)</span>
        <textarea rows="3" placeholder="Motif de la décision…" data-field="mod-motif"></textarea>
      </label>
      <div class="row-actions">
        <button class="hit btn" data-sim="mod-decide:classer:${c.id}" type="button">Classer sans suite</button>
        <button class="hit btn" data-sim="mod-decide:masquer:${c.id}" type="button">Masquer</button>
        <button class="hit btn outline" data-sim="mod-decide:retirer:${c.id}" type="button">Retirer</button>
      </div>`
          : `<div class="row-actions">${retablir}</div>`
      }
    </div>
    `,
    {
      header: phoneHeader({ title: 'Dossier', backTo: 'admin-moderation' }),
    }
  )
}

function adminRdvCancelMotif() {
  const id = (typeof sessionStorage !== 'undefined' && sessionStorage.getItem('ma-ville-rdv-cancel-id')) || ''
  return wrap(
    `
    <div class="form-card">
      <h2 class="sec">Annuler le rendez-vous</h2>
      <label class="field"><span>Motif</span><textarea rows="3" data-field="rdv-cancel-motif" placeholder="Motif d’annulation…"></textarea></label>
      <div class="row-actions">
        <button class="hit btn" data-go="admin-rdv" type="button">Retour</button>
        <button class="hit btn primary" data-sim="rdv-admin-cancel-confirm:${id}" type="button">Confirmer l’annulation</button>
      </div>
    </div>
    `,
    {
      header: phoneHeader({ title: 'Annuler RDV', backTo: 'admin-rdv', chrome: 'form' }),
      footer: '',
    }
  )
}

function adminEquipe() {
  return wrap(
    `
    <h2 class="sec">Équipe et permissions</h2>
    ${[
      ['Rica Rakotoson', 'Administrateur de Kapan'],
      ['Lilit Ameni', 'Gestionnaire · Événements'],
      ['Rouben Sirunyan', 'Modérateur'],
    ]
      .map(
        ([name, role]) => `
      <div class="row-link static admin-row">
        <span class="avatar"></span>
        <span class="grow"><strong>${name}</strong><br/><span class="meta">${role}</span></span>
      </div>`
      )
      .join('')}
    <button class="hit btn block" data-sim="ajouter" type="button">Inviter un agent</button>
    `,
    {
      header: phoneHeader({ title: 'Équipe', backTo: 'admin-home' }),
    }
  )
}

function adminContenus() {
  return adminHome()
}

function adminFicheEdit() {
  return ficheAnnuaireForm()
}

function adminStub(title) {
  return wrap(
    `
    <h2 class="sec">${title}</h2>
    ${tbd('Workflow non défini — À préciser')}
    ${text('Pas de parcours inventé. Structure minimale uniquement.')}
    ${emptyState('Aucun élément')}
    <button class="hit btn block" data-go="admin-home">Retour admin</button>
    `,
    {
      header: phoneHeader({ title, backTo: 'admin-home' }),
    }
  )
}

export const SCREENS = {
  'ville-bienvenue': { title: 'Bienvenue / Choisir une ville', side: 'user', group: 'Entrée', render: bienvenue },
  'ville-modale-choisir': { title: 'Modale Choisir une ville', side: 'user', group: 'Entrée', render: modaleChoisir },
  'ville-modale-confirmer': { title: 'Modale Confirmer la ville', side: 'user', group: 'Entrée', render: modaleConfirmer },
  'accueil-kapan': { title: 'Accueil Kapan', side: 'user', group: 'Entrée', render: accueilKapan },

  'sante-accueil': { title: 'Accueil Santé', side: 'user', group: 'Santé', render: santeAccueil },
  'sante-urgences': { title: 'Urgences', side: 'user', group: 'Santé', render: santeUrgences },
  'sante-pharmacies': { title: 'Pharmacies', side: 'user', group: 'Santé', render: santePharmacies },
  'sante-pharmacie-infos': {
    title: 'Pharmacie — Informations',
    side: 'user',
    group: 'Santé',
    render: () => pharmacieDetails('infos'),
  },
  'sante-pharmacie-horaires': {
    title: 'Pharmacie — Horaires',
    side: 'user',
    group: 'Santé',
    render: () => pharmacieDetails('horaires'),
  },
  'sante-hopitaux': { title: 'Hôpitaux', side: 'user', group: 'Santé', render: santeHopitaux },
  'sante-hopital-details': {
    title: 'Hôpital — Informations',
    side: 'user',
    group: 'Santé',
    render: () => santeHopitalDetails('infos'),
  },
  'sante-hopital-horaires': {
    title: 'Hôpital — Horaires',
    side: 'user',
    group: 'Santé',
    render: () => santeHopitalDetails('horaires'),
  },
  'sante-ambulances': { title: 'Ambulances', side: 'user', group: 'Santé', render: santeAmbulances },

  'mairie-accueil': { title: 'Accueil Ma mairie', side: 'user', group: 'Ma mairie', render: mairieAccueil },
  'mairie-accueil-evenements': {
    title: 'Ma mairie — Événements',
    side: 'user',
    group: 'Ma mairie',
    render: mairieAccueilEvenements,
  },
  'mairie-menu': { title: 'Menu Ma mairie', side: 'user', group: 'Ma mairie', render: mairieMenu },
  'mairie-recherche': {
    title: 'Recherche Ma mairie',
    side: 'user',
    group: 'Ma mairie',
    render: mairieRecherche,
  },
  'mairie-rdv': { title: 'Prendre rendez-vous', side: 'user', group: 'Ma mairie', render: mairieRdv },
  'mairie-rdv-creneau': {
    title: 'RDV — Date & créneau',
    side: 'user',
    group: 'Ma mairie',
    render: mairieRdvCreneau,
  },
  'mairie-rdv-suite': {
    title: 'RDV — Confirmation',
    side: 'user',
    group: 'Ma mairie',
    render: mairieRdvSuite,
  },
  'mairie-presentation': {
    title: 'Présentation de la ville',
    side: 'user',
    group: 'Ma mairie',
    render: mairiePresentation,
  },
  'mairie-presentation-options': {
    title: 'Présentation — Options',
    side: 'user',
    group: 'Ma mairie',
    render: mairiePresentationOptions,
  },
  'mairie-pub-options-habitant': {
    title: 'Publication — Options habitant',
    side: 'user',
    group: 'Ma mairie',
    render: mairiePubOptionsHabitant,
  },
  'mairie-pub-options-admin': {
    title: 'Publication — Options admin',
    side: 'user',
    group: 'Ma mairie',
    render: mairiePubOptionsAdmin,
  },
  'content-menu': {
    title: 'Menu contenu (⋯)',
    side: 'user',
    group: 'Menus',
    render: contentMenu,
  },
  'menu-confirm-delete-pub': {
    title: 'Confirmer — Supprimer publication',
    side: 'user',
    group: 'Menus',
    render: menuConfirmDeletePub,
  },
  'menu-confirm-delete-dir': {
    title: 'Confirmer — Supprimer fiche',
    side: 'user',
    group: 'Menus',
    render: menuConfirmDeleteDir,
  },
  'menu-confirm-delete-evt': {
    title: 'Confirmer — Supprimer événement',
    side: 'user',
    group: 'Menus',
    render: menuConfirmDeleteEvt,
  },
  'menu-confirm-cancel-evt': {
    title: 'Confirmer — Annuler événement',
    side: 'user',
    group: 'Menus',
    render: menuConfirmCancelEvt,
  },
  'menu-moderate-pub': {
    title: 'Modérer publication',
    side: 'user',
    group: 'Menus',
    render: menuModeratePub,
  },
  'menu-signal-fiche-info': {
    title: 'Signaler info incorrecte',
    side: 'user',
    group: 'Menus',
    render: menuSignalFicheInfo,
  },
  'sante-pharmacie-unpublished': {
    title: 'Pharmacie — Non publiée',
    side: 'user',
    group: 'Santé',
    render: () => pharmacieDetails('infos', 'dir-pharmacie-unpublished'),
  },
  'mairie-gerer-page': {
    title: 'Gérer la page Ma mairie',
    side: 'user',
    group: 'Ma mairie',
    render: mairieGererPage,
  },
  'mairie-nouvelle-publication': {
    title: 'Nouvelle publication',
    side: 'user',
    group: 'Ma mairie',
    render: mairieNouvellePublication,
  },
  'mairie-pub-edit': {
    title: 'Modifier publication',
    side: 'user',
    group: 'Ma mairie',
    render: mairiePubEdit,
  },
  'mairie-pub-preview': {
    title: 'Prévisualisation publication',
    side: 'user',
    group: 'Ma mairie',
    render: mairiePubPreview,
  },
  'mairie-medias-sheet': {
    title: 'Médias (sheet)',
    side: 'user',
    group: 'Ma mairie',
    render: mairieMediasSheet,
  },
  'mairie-conseil': {
    title: 'Maire & Conseil',
    side: 'user',
    group: 'Ma mairie',
    render: mairieConseil,
  },
  'mairie-conseil-edit': {
    title: 'Conseil — Édition (admin)',
    side: 'user',
    group: 'Ma mairie',
    render: mairieConseilEdit,
  },
  'mairie-infos': {
    title: 'Infos Mairie',
    side: 'user',
    group: 'Ma mairie',
    render: mairieInfos,
  },
  'mairie-infos-detail': {
    title: 'Infos Mairie — Détail',
    side: 'user',
    group: 'Ma mairie',
    render: mairieInfosDetail,
  },
  'mairie-infos-apropos': {
    title: 'Infos Mairie — À propos',
    side: 'user',
    group: 'Ma mairie',
    render: mairieInfosApropos,
  },
  'mairie-apropos-communaute': {
    title: 'À propos de la communauté',
    side: 'user',
    group: 'Ma mairie',
    render: mairieAproposCommunaute,
  },
  'mairie-communaute': {
    title: 'Communauté infos',
    side: 'user',
    group: 'Ma mairie',
    render: mairieCommunaute,
  },
  'fiche-annuaire-form': {
    title: 'Fiche annuaire — Formulaire',
    side: 'user',
    group: 'Ma mairie',
    render: ficheAnnuaireForm,
  },
  'mairie-plan': {
    title: 'Plan de la ville',
    side: 'user',
    group: 'Ma mairie',
    render: mairiePlan,
  },
  'mairie-plan-menu': {
    title: 'Plan — Menu carte',
    side: 'user',
    group: 'Ma mairie',
    render: mairiePlanMenu,
  },
  'mairie-plan-parametres': {
    title: 'Plan — Paramètres',
    side: 'user',
    group: 'Ma mairie',
    render: mairiePlanParametres,
  },
  'mairie-plan-aller': {
    title: 'Plan — Aller à un endroit',
    side: 'user',
    group: 'Ma mairie',
    render: mairiePlanAller,
  },

  'infos-feed': { title: 'Infos Feed', side: 'user', group: 'Social / contenus', render: infosFeed },
  'infos-post-options': {
    title: 'Publication — Options',
    side: 'user',
    group: 'Social / contenus',
    render: () => infosPostOptions(true),
  },
  'infos-post-options-other': {
    title: 'Publication — Signaler',
    side: 'user',
    group: 'Social / contenus',
    render: () => infosPostOptions(false),
  },
  'infos-reactions': { title: 'Réactions', side: 'user', group: 'Social / contenus', render: infosReactions },
  'infos-ajouter-ami': {
    title: 'Ajouter ami',
    side: 'user',
    group: 'Social / contenus',
    render: infosAjouterAmi,
  },
  'infos-commentaires': {
    title: 'Commentaires',
    side: 'user',
    group: 'Social / contenus',
    render: infosCommentaires,
  },
  'infos-partage': { title: 'Partage', side: 'user', group: 'Social / contenus', render: infosPartage },
  'evenements-liste': { title: 'Événements — Liste', side: 'user', group: 'Social / contenus', render: evenementsListe },
  'evenement-details': {
    title: 'Événement — Détail',
    side: 'user',
    group: 'Social / contenus',
    render: evenementDetails,
  },
  'evenement-form': {
    title: 'Événement — Formulaire',
    side: 'user',
    group: 'Social / contenus',
    render: evenementForm,
  },
  'evenement-gerer': {
    title: 'Événement — Gérer',
    side: 'user',
    group: 'Social / contenus',
    render: evenementForm,
  },
  'evenements-a-valider': {
    title: 'Événements à valider',
    side: 'admin',
    group: 'Admin',
    render: evenementsAValider,
  },
  'evenement-validation-motif': {
    title: 'Motif validation',
    side: 'admin',
    group: 'Admin',
    render: () => {
      const mode = sessionStorage.getItem('ma-ville-evt-motif-mode') || 'refuse'
      const eventId = sessionStorage.getItem('ma-ville-evt-motif-id') || ''
      return evenementValidationMotif({ mode, eventId })
    },
  },
  'evenement-options': {
    title: 'Événement — Options',
    side: 'user',
    group: 'Social / contenus',
    render: evenementOptions,
  },
  'evenement-participants': {
    title: 'Événement — Participants',
    side: 'user',
    group: 'Social / contenus',
    render: evenementParticipants,
  },
  'evenement-participant-menu': {
    title: 'Participant — Menu',
    side: 'user',
    group: 'Social / contenus',
    render: evenementParticipantMenu,
  },
  'evenement-supprimer-confirm': {
    title: 'Participant — Supprimer',
    side: 'user',
    group: 'Social / contenus',
    render: evenementSupprimerConfirm,
  },
  'evenement-signaler': {
    title: 'Participant — Signaler',
    side: 'user',
    group: 'Social / contenus',
    render: evenementSignaler,
  },
  'evenement-discussion': {
    title: 'Événement — Discussion',
    side: 'user',
    group: 'Social / contenus',
    render: evenementDiscussion,
  },
  'evenement-groupe-modal': {
    title: 'Discussion — Groupe',
    side: 'user',
    group: 'Social / contenus',
    render: evenementGroupeModal,
  },
  'evenement-validation': {
    title: 'Validation — En attente',
    side: 'user',
    group: 'Social / contenus',
    render: () => evenementValidation('attente'),
  },
  'evenement-validation-valide': {
    title: 'Validation — Validé',
    side: 'user',
    group: 'Social / contenus',
    render: () => evenementValidation('valide'),
  },
  'evenement-validation-refuse': {
    title: 'Validation — Refusé',
    side: 'user',
    group: 'Social / contenus',
    render: () => evenementValidation('refuse'),
  },
  'evenement-annuler-refus': {
    title: 'Validation — Annuler le refus',
    side: 'user',
    group: 'Social / contenus',
    render: evenementAnnulerRefus,
  },
  'evenement-criteres': {
    title: 'Événement — Critères',
    side: 'user',
    group: 'Social / contenus',
    render: evenementCriteres,
  },
  'evenement-conditions': {
    title: 'Événement — Conditions',
    side: 'user',
    group: 'Social / contenus',
    render: evenementConditions,
  },
  'annonces-liste': {
    title: 'Petites annonces — Liste',
    side: 'user',
    group: 'Social / contenus',
    render: annoncesListe,
  },
  'annonce-details': {
    title: 'Annonce — Détail',
    side: 'user',
    group: 'Social / contenus',
    render: annonceDetails,
  },
  'annonces-filtres': {
    title: 'Annonces — Filtres',
    side: 'user',
    group: 'Social / contenus',
    render: annoncesFiltres,
  },
  'emplois-liste': { title: 'Offres d’emploi', side: 'user', group: 'Social / contenus', render: emploisListe },
  'emplois-cat-emplois': {
    title: 'Emplois',
    side: 'user',
    group: 'Social / contenus',
    render: () => emploisCategorie('emplois'),
  },
  'emplois-cat-temporaires': {
    title: 'Emplois temporaires',
    side: 'user',
    group: 'Social / contenus',
    render: () => emploisCategorie('temporaires'),
  },
  'emplois-cat-stages': {
    title: 'Stages',
    side: 'user',
    group: 'Social / contenus',
    render: () => emploisCategorie('stages'),
  },
  'emplois-cat-alternance': {
    title: 'Alternance',
    side: 'user',
    group: 'Social / contenus',
    render: () => emploisCategorie('alternance'),
  },
  'emplois-filtres': {
    title: 'Offres — Filtres',
    side: 'user',
    group: 'Social / contenus',
    render: emploisFiltres,
  },
  'emploi-details': {
    title: 'Offre — Détail',
    side: 'user',
    group: 'Social / contenus',
    render: emploiDetails,
  },
  'emploi-form': {
    title: 'Offre — Formulaire',
    side: 'user',
    group: 'Social / contenus',
    render: emploiForm,
  },
  'emploi-preview': {
    title: 'Offre — Prévisualisation',
    side: 'user',
    group: 'Social / contenus',
    render: emploiPreview,
  },
  'emploi-confirm-close': {
    title: 'Offre — Clôturer',
    side: 'user',
    group: 'Social / contenus',
    render: emploiConfirmClose,
  },
  'emploi-confirm-delete': {
    title: 'Offre — Supprimer',
    side: 'user',
    group: 'Social / contenus',
    render: emploiConfirmDelete,
  },
  'urgence-numeros': { title: 'N° Urgence', side: 'user', group: 'Social / contenus', render: urgenceNumeros },
  messages: {
    title: 'Messages — MIASIN',
    side: 'user',
    group: 'Social / contenus',
    render: () => messages('miasin'),
  },
  'messages-maville': {
    title: 'Messages — Ma Ville',
    side: 'user',
    group: 'Social / contenus',
    render: () => messages('maville'),
  },
  'messages-thread': {
    title: 'Messages — Conversation',
    side: 'user',
    group: 'Social / contenus',
    render: messagesThread,
  },
  'messages-nouvelle': {
    title: 'Nouvelle conversation',
    side: 'user',
    group: 'Social / contenus',
    render: messagesNouvelle,
  },
  'messages-attach': {
    title: 'Ajouter une pièce',
    side: 'user',
    group: 'Social / contenus',
    render: messagesAttachSheet,
  },
  'messages-react': {
    title: 'Réagir',
    side: 'user',
    group: 'Social / contenus',
    render: messagesReactSheet,
  },
  enregistrements: { title: 'Enregistrements', side: 'user', group: 'Social / contenus', render: enregistrements },
  'menu-plus': { title: 'Menu (+)', side: 'user', group: 'Social / contenus', render: menuPlus },
  'etats-hub': { title: 'États UI (démo)', side: 'user', group: 'Social / contenus', render: etatsHub },
  'etat-vide': { title: 'État vide', side: 'user', group: 'Social / contenus', render: etatVide },
  'etat-chargement': { title: 'État chargement', side: 'user', group: 'Social / contenus', render: etatChargement },
  'etat-erreur': { title: 'État erreur', side: 'user', group: 'Social / contenus', render: etatErreur },
  'etat-horaires-manquants': {
    title: 'Horaires manquants',
    side: 'user',
    group: 'Social / contenus',
    render: etatHorairesManquants,
  },
  'a-preciser': { title: 'À préciser', side: 'user', group: 'Social / contenus', render: pageAPreciser },


  'vie-locale-hub': { title: 'Vie locale — Hub', side: 'user', group: 'Vie locale', render: vieLocaleHub },

  /* —— Tourisme (validé) —— */
  'dir-tourisme': {
    title: 'Tourisme',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      rubriqueAccueil({
        title: 'Tourisme',
        bannerTitle: 'Découvrez notre ville',
        bannerText: 'Patrimoine, nature et lieux à visiter',
        searchPh: 'Rechercher un lieu…',
        filters: ['Tous', 'Ouverts', 'Randonnées', 'À proximité'],
        cats: [
          { label: 'Patrimoine', go: 'dir-tourisme-patrimoine' },
          { label: 'Nature', go: 'dir-tourisme-nature' },
          { label: 'Culture', go: 'dir-tourisme-culture' },
          { label: 'Activités', go: 'dir-tourisme-activites' },
        ],
        around: [
          {
            title: 'Monastère de Vahanavank',
            meta: 'Patrimoine · 0,8 km',
            badge: 'Ouvert',
            ficheGo: 'dir-tourisme-fiche-infos',
            openFiche: 'fiche-vahanavank',
          },
          {
            title: 'Parc / Nature…',
            meta: 'Nature · …',
            badge: '…',
            ficheGo: 'dir-nature-fiche-infos',
            openFiche: 'dir-nature-a',
          },
          {
            title: 'Activité…',
            meta: 'Activités · …',
            badge: '…',
            ficheGo: 'dir-activites-fiche-infos',
            openFiche: 'dir-activites-a',
          },
        ],
        useful: [
          { label: 'Plan touristique', meta: 'Voir les lieux à visiter…', go: 'dir-tourisme-plan' },
          { label: 'Événements culturels', meta: 'Activités et rendez-vous locaux', go: 'evenements-liste' },
        ],
      }),
  },
  'dir-tourisme-patrimoine': {
    title: 'Patrimoine',
    side: 'user',
    group: 'Vie locale',
    render: () => rubriqueListe('Patrimoine', 'dir-tourisme', { ficheGo: 'dir-tourisme-fiche-infos' }),
  },
  'dir-tourisme-nature': {
    title: 'Nature',
    side: 'user',
    group: 'Vie locale',
    render: () => rubriqueListe('Nature', 'dir-tourisme', { ficheGo: 'dir-nature-fiche-infos' }),
  },
  'dir-tourisme-culture': {
    title: 'Culture',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      rubriqueListe('Culture', 'dir-tourisme', {
        ficheGo: 'dir-tourisme-culture-fiche-infos',
      }),
  },
  'dir-tourisme-activites': {
    title: 'Activités',
    side: 'user',
    group: 'Vie locale',
    render: () => rubriqueListe('Activités', 'dir-tourisme', { ficheGo: 'dir-activites-fiche-infos' }),
  },
  'dir-tourisme-fiche-infos': {
    title: 'Tourisme fiche — Infos',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      dirFiche('infos', {
        title: 'Monastère de Vahanavank',
        category: 'Patrimoine',
        noHours: false,
        backTo: 'dir-tourisme-patrimoine',
        idInfos: 'dir-tourisme-fiche-infos',
        idHoraires: 'dir-tourisme-fiche-horaires',
      }),
  },
  'dir-tourisme-fiche-horaires': {
    title: 'Tourisme fiche — Horaires',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      dirFiche('horaires', {
        title: 'Monastère de Vahanavank',
        category: 'Patrimoine',
        noHours: false,
        backTo: 'dir-tourisme-patrimoine',
        idInfos: 'dir-tourisme-fiche-infos',
        idHoraires: 'dir-tourisme-fiche-horaires',
      }),
  },
  'dir-tourisme-culture-fiche-infos': {
    title: 'Culture fiche — Infos',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      dirFiche('infos', {
        title: 'Lieu culturel…',
        category: 'Culture',
        noHours: false,
        backTo: 'dir-tourisme-culture',
        idInfos: 'dir-tourisme-culture-fiche-infos',
        idHoraires: 'dir-tourisme-culture-fiche-horaires',
      }),
  },
  'dir-tourisme-culture-fiche-horaires': {
    title: 'Culture fiche — Horaires',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      dirFiche('horaires', {
        title: 'Lieu culturel…',
        category: 'Culture',
        noHours: false,
        backTo: 'dir-tourisme-culture',
        idInfos: 'dir-tourisme-culture-fiche-infos',
        idHoraires: 'dir-tourisme-culture-fiche-horaires',
      }),
  },
  'dir-nature-fiche-infos': {
    title: 'Nature fiche — Infos',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      dirFiche('infos', {
        title: 'Parc de la ville',
        category: 'Nature',
        noHours: true,
        backTo: 'dir-tourisme-nature',
        idInfos: 'dir-nature-fiche-infos',
        idHoraires: 'dir-nature-fiche-horaires',
      }),
  },
  'dir-nature-fiche-horaires': {
    title: 'Nature fiche — Horaires',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      dirFiche('horaires', {
        title: 'Parc de la ville',
        category: 'Nature',
        noHours: true,
        backTo: 'dir-tourisme-nature',
        idInfos: 'dir-nature-fiche-infos',
        idHoraires: 'dir-nature-fiche-horaires',
      }),
  },
  'dir-activites-fiche-infos': {
    title: 'Activités fiche — Infos',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      dirFiche('infos', {
        title: 'Activité…',
        category: 'Activités',
        noHours: true,
        backTo: 'dir-tourisme-activites',
        idInfos: 'dir-activites-fiche-infos',
        idHoraires: 'dir-activites-fiche-horaires',
      }),
  },
  'dir-activites-fiche-horaires': {
    title: 'Activités fiche — Horaires',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      dirFiche('horaires', {
        title: 'Activité…',
        category: 'Activités',
        noHours: true,
        backTo: 'dir-tourisme-activites',
        idInfos: 'dir-activites-fiche-infos',
        idHoraires: 'dir-activites-fiche-horaires',
      }),
  },
  'dir-tourisme-plan': {
    title: 'Plan touristique',
    side: 'user',
    group: 'Vie locale',
    render: () => pageUtile('Plan touristique', 'Contenu plan — À préciser', 'dir-tourisme'),
  },

  /* —— Éducation (validé) —— */
  'dir-education': {
    title: 'Éducation',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      rubriqueAccueil({
        title: 'Éducation',
        bannerTitle: 'L’éducation, une priorité',
        bannerText: 'Des établissements proches de vous',
        searchPh: 'Rechercher un établissement…',
        filters: ['Tous', 'Public', 'Privé', 'À proximité'],
        cats: [
          { label: 'Écoles', go: 'dir-education-ecoles' },
          { label: 'Formations', go: 'dir-education-formations' },
          { label: 'Universités', go: 'dir-education-universites' },
          { label: 'Activités', go: 'dir-education-activites' },
        ],
        useful: [
          { label: 'Inscriptions en cours', meta: 'Périodes d’inscription…', go: 'dir-education-inscriptions' },
          { label: 'Calendrier scolaire', meta: 'Dates importantes…', go: 'dir-education-calendrier' },
        ],
      }),
  },
  'dir-education-ecoles': {
    title: 'Écoles',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      rubriqueListe('Écoles', 'dir-education', {
        ficheGo: 'dir-education-ecoles-fiche-infos',
        known: [
          {
            id: 'fiche-ecole-1',
            title: 'École primaire N°1',
            meta: 'Écoles · 0,5 km',
            badge: 'Ouvert',
            address: '12 rue de l’École, Kapan',
            phone: '+374 285 20 110',
            hours: '08:00 – 17:00',
            description: 'École primaire municipale.',
          },
          {
            id: 'dir-education-ecoles-b',
            title: 'Collège de Kapan',
            meta: 'Écoles · 1,1 km',
            badge: 'Ouvert',
            address: '5 rue des Collèges, Kapan',
            phone: '+374 285 20 120',
            hours: '08:00 – 17:30',
            description: 'Collège public.',
          },
        ],
      }),
  },
  'dir-education-formations': {
    title: 'Formations',
    side: 'user',
    group: 'Vie locale',
    render: () => rubriqueListe('Formations', 'dir-education', { ficheGo: 'dir-education-formations-fiche-infos' }),
  },
  'dir-education-universites': {
    title: 'Universités',
    side: 'user',
    group: 'Vie locale',
    render: () => rubriqueListe('Universités', 'dir-education', { ficheGo: 'dir-education-universites-fiche-infos' }),
  },
  'dir-education-activites': {
    title: 'Activités (Éducation)',
    side: 'user',
    group: 'Vie locale',
    render: () => rubriqueListe('Activités', 'dir-education', { ficheGo: 'dir-education-activites-fiche-infos' }),
  },
  'dir-education-inscriptions': {
    title: 'Inscriptions',
    side: 'user',
    group: 'Vie locale',
    render: () => pageUtile('Inscriptions en cours', 'Détail inscriptions — À préciser', 'dir-education'),
  },
  'dir-education-calendrier': {
    title: 'Calendrier scolaire',
    side: 'user',
    group: 'Vie locale',
    render: () => pageUtile('Calendrier scolaire', 'Dates — À préciser', 'dir-education'),
  },

  /* —— Cinémas & Théâtres (validé) —— */
  'dir-cinemas': {
    title: 'Cinémas & Théâtres',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      rubriqueAccueil({
        title: 'Cinémas & Théâtres',
        bannerTitle: 'La culture, au cœur de la ville',
        bannerText: 'Salles, programmes et spectacles',
        searchPh: 'Rechercher une salle, spectacle…',
        filters: ['Tous', 'Cinémas', 'Théâtres', 'Salles'],
        cats: [
          { label: 'Cinémas', go: 'dir-cinemas-cinemas' },
          { label: 'Théâtres', go: 'dir-cinemas-theatres' },
          { label: 'Programmes', go: 'dir-cinemas-programmes' },
          { label: 'Spectacles', go: 'dir-cinemas-spectacles' },
        ],
        useful: [
          { label: 'Programme de la semaine', meta: 'Films et spectacles…', go: 'dir-cinemas-programme-semaine' },
          { label: 'Événements à venir', meta: 'Spectacles, festivals…', go: 'evenements-liste' },
        ],
      }),
  },
  'dir-cinemas-cinemas': {
    title: 'Cinémas',
    side: 'user',
    group: 'Vie locale',
    render: () => rubriqueListe('Cinémas', 'dir-cinemas', { ficheGo: 'dir-cinemas-cinemas-fiche-infos' }),
  },
  'dir-cinemas-theatres': {
    title: 'Théâtres',
    side: 'user',
    group: 'Vie locale',
    render: () => rubriqueListe('Théâtres', 'dir-cinemas', { ficheGo: 'dir-cinemas-theatres-fiche-infos' }),
  },
  'dir-cinemas-programmes': {
    title: 'Programmes',
    side: 'user',
    group: 'Vie locale',
    render: () => rubriqueListe('Programmes', 'dir-cinemas', { ficheGo: 'dir-cinemas-programmes-fiche-infos' }),
  },
  'dir-cinemas-spectacles': {
    title: 'Spectacles',
    side: 'user',
    group: 'Vie locale',
    render: () => rubriqueListe('Spectacles', 'dir-cinemas', { ficheGo: 'dir-cinemas-spectacles-fiche-infos' }),
  },
  'dir-cinemas-programme-semaine': {
    title: 'Programme de la semaine',
    side: 'user',
    group: 'Vie locale',
    render: () => pageUtile('Programme de la semaine', 'Contenu — À préciser', 'dir-cinemas'),
  },

  /* —— Économie (proposition : + Artisans) —— */
  'dir-economie': {
    title: 'Économie — À valider',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      rubriqueAccueil({
        title: 'Économie',
        bannerTitle: 'L’économie près de chez vous',
        bannerText: 'Commerces, entreprises, artisans et services',
        searchPh: 'Rechercher un acteur local…',
        filters: ['Tous', 'Ouverts', 'À proximité', 'Enregistrés'],
        proposition: true,
        cats: [
          { label: 'Commerces', go: 'dir-economie-commerces' },
          { label: 'Entreprises', go: 'dir-economie-entreprises' },
          { label: 'Artisans', go: 'dir-economie-artisans' },
          { label: 'Services', go: 'dir-economie-services' }
        ],
        useful: [
          { label: 'Actualités économiques', meta: 'Vie économique…', go: 'dir-economie-actus' },
          { label: 'Marchés locaux', meta: 'Jours et lieux…', go: 'dir-economie-marches' },
        ],
      }),
  },
  'dir-economie-commerces': {
    title: 'Commerces — À valider',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      rubriqueListe('Commerces', 'dir-economie', {
        ficheGo: 'dir-economie-commerces-fiche-infos',
        filters: ['Tous', 'Ouverts', 'À proximité', 'Enregistrés'],
        proposition: true,
        known: [
          {
            id: 'fiche-commerce-1',
            title: 'Marché central',
            meta: 'Commerces · Place du Marché',
            badge: 'Ouvert',
            address: 'Place du Marché, Kapan',
            phone: '+374 285 22 010',
            hours: '07:00 – 14:00',
            description: 'Marché municipal.',
          },
          {
            id: 'dir-economie-commerces-b',
            title: 'Épicerie du centre',
            meta: 'Commerces · 0,4 km',
            badge: 'Ouvert',
            address: '4 rue du Commerce, Kapan',
            phone: '+374 285 22 020',
            hours: '08:00 – 20:00',
            description: 'Épicerie de proximité.',
          },
        ],
      }),
  },
  'dir-economie-entreprises': {
    title: 'Entreprises — À valider',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      rubriqueListe('Entreprises', 'dir-economie', {
        ficheGo: 'dir-economie-entreprises-fiche-infos',
        filters: ['Tous', 'Ouverts', 'À proximité', 'Enregistrés'],
        proposition: true,
      }),
  },
  'dir-economie-artisans': {
    title: 'Artisans — À valider',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      rubriqueListe('Artisans', 'dir-economie', {
        ficheGo: 'dir-economie-artisans-fiche-infos',
        filters: ['Tous', 'Ouverts', 'À proximité', 'Enregistrés'],
        proposition: true,
      }),
  },
  'dir-economie-services': {
    title: 'Services — À valider',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      rubriqueListe('Services', 'dir-economie', {
        ficheGo: 'dir-economie-services-fiche-infos',
        filters: ['Tous', 'Ouverts', 'À proximité', 'Enregistrés'],
        proposition: true,
      }),
  },
  'dir-economie-actus': {
    title: 'Actualités économiques',
    side: 'user',
    group: 'Vie locale',
    render: () => pageUtile('Actualités économiques', 'Contenu — À préciser', 'dir-economie'),
  },
  'dir-economie-marches': {
    title: 'Marchés locaux',
    side: 'user',
    group: 'Vie locale',
    render: () => pageUtile('Marchés locaux', 'Contenu — À préciser', 'dir-economie'),
  },

  /* —— Aide sociale —— */
  'dir-aide-sociale': {
    title: 'Aide sociale — À valider',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      rubriqueAccueil({
        title: 'Aide sociale',
        bannerTitle: 'Aide sociale',
        bannerText: 'Familles, seniors, handicap, accompagnement',
        searchPh: 'Rechercher…',
        filters: ['Tous', 'Ouverts', 'À proximité', 'Enregistrés'],
        proposition: true,
        cats: [
          { label: 'Familles', go: 'dir-aide-familles' },
          { label: 'Seniors', go: 'dir-aide-seniors' },
          { label: 'Handicap', go: 'dir-aide-handicap' },
          { label: 'Accompagnement', go: 'dir-aide-accompagnement' }
        ],
      }),
  },
  'dir-aide-familles': {
    title: 'Familles — À valider',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      rubriqueListe('Familles', 'dir-aide-sociale', {
        ficheGo: 'dir-aide-familles-fiche-infos',
        filters: ['Tous', 'Ouverts', 'À proximité', 'Enregistrés'],
        proposition: true,
      }),
  },
  'dir-aide-seniors': {
    title: 'Seniors — À valider',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      rubriqueListe('Seniors', 'dir-aide-sociale', {
        ficheGo: 'dir-aide-seniors-fiche-infos',
        filters: ['Tous', 'Ouverts', 'À proximité', 'Enregistrés'],
        proposition: true,
      }),
  },
  'dir-aide-handicap': {
    title: 'Handicap — À valider',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      rubriqueListe('Handicap', 'dir-aide-sociale', {
        ficheGo: 'dir-aide-handicap-fiche-infos',
        filters: ['Tous', 'Ouverts', 'À proximité', 'Enregistrés'],
        proposition: true,
      }),
  },
  'dir-aide-accompagnement': {
    title: 'Accompagnement — À valider',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      rubriqueListe('Accompagnement', 'dir-aide-sociale', {
        ficheGo: 'dir-aide-accompagnement-fiche-infos',
        filters: ['Tous', 'Ouverts', 'À proximité', 'Enregistrés'],
        proposition: true,
      }),
  },

  /* —— Associations —— */
  'dir-associations': {
    title: 'Associations — À valider',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      rubriqueAccueil({
        title: 'Associations',
        bannerTitle: 'Associations',
        bannerText: 'Solidarité, culture, sport, environnement (≠ Clubs MIASIN)',
        searchPh: 'Rechercher une association…',
        filters: ['Tous', 'À proximité', 'Enregistrés'],
        proposition: true,
        cats: [
          { label: 'Solidarité', go: 'dir-associations-solidarite' },
          { label: 'Culture', go: 'dir-associations-culture' },
          { label: 'Sport', go: 'dir-associations-sport' },
          { label: 'Environnement', go: 'dir-associations-environnement' }
        ],
      }),
  },
  'dir-associations-solidarite': {
    title: 'Solidarité — À valider',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      rubriqueListe('Solidarité', 'dir-associations', {
        ficheGo: 'dir-associations-solidarite-fiche-infos',
        filters: ['Tous', 'À proximité', 'Enregistrés'],
        proposition: true,
      }),
  },
  'dir-associations-culture': {
    title: 'Culture — À valider',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      rubriqueListe('Culture', 'dir-associations', {
        ficheGo: 'dir-associations-culture-fiche-infos',
        filters: ['Tous', 'À proximité', 'Enregistrés'],
        proposition: true,
      }),
  },
  'dir-associations-sport': {
    title: 'Sport — À valider',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      rubriqueListe('Sport', 'dir-associations', {
        ficheGo: 'dir-associations-sport-fiche-infos',
        filters: ['Tous', 'À proximité', 'Enregistrés'],
        proposition: true,
      }),
  },
  'dir-associations-environnement': {
    title: 'Environnement — À valider',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      rubriqueListe('Environnement', 'dir-associations', {
        ficheGo: 'dir-associations-environnement-fiche-infos',
        filters: ['Tous', 'À proximité', 'Enregistrés'],
        proposition: true,
      }),
  },

  /* —— Banques & Assurances —— */
  'dir-banques': {
    title: 'Banques & Assurances — À valider',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      rubriqueAccueil({
        title: 'Banques & Assurances',
        bannerTitle: 'Banques & Assurances',
        bannerText: 'Banques, assurances, distributeurs, change',
        searchPh: 'Rechercher…',
        filters: ['Tous', 'Ouverts', 'À proximité', 'Enregistrés'],
        proposition: true,
        cats: [
          { label: 'Banques', go: 'dir-banques-banques' },
          { label: 'Assurances', go: 'dir-banques-assurances' },
          { label: 'Distributeurs', go: 'dir-banques-distributeurs' },
          { label: 'Change', go: 'dir-banques-change' }
        ],
      }),
  },
  'dir-banques-banques': {
    title: 'Banques — À valider',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      rubriqueListe('Banques', 'dir-banques', {
        ficheGo: 'dir-banques-banques-fiche-infos',
        filters: ['Tous', 'Ouverts', 'À proximité', 'Enregistrés'],
        proposition: true,
      }),
  },
  'dir-banques-assurances': {
    title: 'Assurances — À valider',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      rubriqueListe('Assurances', 'dir-banques', {
        ficheGo: 'dir-banques-assurances-fiche-infos',
        filters: ['Tous', 'Ouverts', 'À proximité', 'Enregistrés'],
        proposition: true,
      }),
  },
  'dir-banques-distributeurs': {
    title: 'Distributeurs — À valider',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      rubriqueListe('Distributeurs', 'dir-banques', {
        ficheGo: 'dir-banques-distributeur-infos',
        filters: ['Tous', 'Ouverts', 'À proximité', 'Enregistrés'],
        proposition: true,
      }),
  },
  'dir-banques-change': {
    title: 'Change — À valider',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      rubriqueListe('Change', 'dir-banques', {
        ficheGo: 'dir-banques-change-fiche-infos',
        filters: ['Tous', 'Ouverts', 'À proximité', 'Enregistrés'],
        proposition: true,
      }),
  },
  'dir-banques-distributeur-infos': {
    title: 'Distributeur — Infos',
    side: 'user',
    group: 'Vie locale',
    render: () => ficheDistributeur('infos'),
  },
  'dir-banques-distributeur-horaires': {
    title: 'Distributeur — Accessibilité',
    side: 'user',
    group: 'Vie locale',
    render: () => ficheDistributeur('horaires'),
  },

  /* —— Transports —— */
  'dir-transports': {
    title: 'Transports — À valider',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      rubriqueAccueil({
        title: 'Transports',
        bannerTitle: 'Transports',
        bannerText: 'Bus, taxis, gares, location — fiche lieu/service (pas horaires de départ)',
        searchPh: 'Rechercher…',
        filters: ['Tous', 'Ouverts', 'À proximité', 'Enregistrés'],
        proposition: true,
        cats: [
          { label: 'Bus', go: 'dir-transports-bus' },
          { label: 'Taxis', go: 'dir-transports-taxis' },
          { label: 'Gares', go: 'dir-transports-gares' },
          { label: 'Location', go: 'dir-transports-location' }
        ],
      }),
  },
  'dir-transports-bus': {
    title: 'Bus — À valider',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      rubriqueListe('Bus', 'dir-transports', {
        ficheGo: 'dir-transports-bus-fiche-infos',
        filters: ['Tous', 'Ouverts', 'À proximité', 'Enregistrés'],
        proposition: true,
      }),
  },
  'dir-transports-taxis': {
    title: 'Taxis — À valider',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      rubriqueListe('Taxis', 'dir-transports', {
        ficheGo: 'dir-transports-taxis-fiche-infos',
        filters: ['Tous', 'Ouverts', 'À proximité', 'Enregistrés'],
        proposition: true,
      }),
  },
  'dir-transports-gares': {
    title: 'Gares — À valider',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      rubriqueListe('Gares', 'dir-transports', {
        ficheGo: 'dir-transports-gares-fiche-infos',
        filters: ['Tous', 'Ouverts', 'À proximité', 'Enregistrés'],
        proposition: true,
      }),
  },
  'dir-transports-location': {
    title: 'Location — À valider',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      rubriqueListe('Location', 'dir-transports', {
        ficheGo: 'dir-transports-location-fiche-infos',
        filters: ['Tous', 'Ouverts', 'À proximité', 'Enregistrés'],
        proposition: true,
      }),
  },

  /* —— Bibliothèque —— */
  'dir-bibliotheques': {
    title: 'Bibliothèque — À valider',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      rubriqueAccueil({
        title: 'Bibliothèque',
        bannerTitle: 'Bibliothèque',
        bannerText: 'Bibliothèques, médiathèques, universitaires, salles de lecture (pas de catalogue)',
        searchPh: 'Rechercher un lieu…',
        filters: ['Toutes', 'Ouvertes', 'À proximité', 'Enregistrées'],
        proposition: true,
        cats: [
          { label: 'Bibliothèques', go: 'dir-bibliotheques-bibliotheques' },
          { label: 'Médiathèques', go: 'dir-bibliotheques-mediatheques' },
          { label: 'Universitaires', go: 'dir-bibliotheques-universitaires' },
          { label: 'Salles de lecture', go: 'dir-bibliotheques-salles-de-lecture' }
        ],
      }),
  },
  'dir-bibliotheques-bibliotheques': {
    title: 'Bibliothèques — À valider',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      rubriqueListe('Bibliothèques', 'dir-bibliotheques', {
        ficheGo: 'dir-bibliotheques-bibliotheques-fiche-infos',
        filters: ['Toutes', 'Ouvertes', 'À proximité', 'Enregistrées'],
        proposition: true,
      }),
  },
  'dir-bibliotheques-mediatheques': {
    title: 'Médiathèques — À valider',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      rubriqueListe('Médiathèques', 'dir-bibliotheques', {
        ficheGo: 'dir-bibliotheques-mediatheques-fiche-infos',
        filters: ['Toutes', 'Ouvertes', 'À proximité', 'Enregistrées'],
        proposition: true,
      }),
  },
  'dir-bibliotheques-universitaires': {
    title: 'Universitaires — À valider',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      rubriqueListe('Universitaires', 'dir-bibliotheques', {
        ficheGo: 'dir-bibliotheques-universitaires-fiche-infos',
        filters: ['Toutes', 'Ouvertes', 'À proximité', 'Enregistrées'],
        proposition: true,
      }),
  },
  'dir-bibliotheques-salles-de-lecture': {
    title: 'Salles de lecture — À valider',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      rubriqueListe('Salles de lecture', 'dir-bibliotheques', {
        ficheGo: 'dir-bibliotheques-salles-de-lecture-fiche-infos',
        filters: ['Toutes', 'Ouvertes', 'À proximité', 'Enregistrées'],
        proposition: true,
      }),
  },

  /* —— Permanences —— */
  'dir-permanences': {
    title: 'Permanences — À valider',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      rubriqueAccueil({
        title: 'Permanences',
        bannerTitle: 'Permanences',
        bannerText: 'Administratives, sociales, juridiques, médicales',
        searchPh: 'Rechercher une permanence…',
        filters: ['Toutes', 'Aujourd’hui', 'Cette semaine', 'À proximité'],
        proposition: true,
        cats: [
          { label: 'Administratives', go: 'dir-permanences-administratives' },
          { label: 'Sociales', go: 'dir-permanences-sociales' },
          { label: 'Juridiques', go: 'dir-permanences-juridiques' },
          { label: 'Médicales', go: 'dir-permanences-medicales' }
        ],
      }),
  },
  'dir-permanences-administratives': {
    title: 'Administratives — À valider',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      rubriqueListe('Administratives', 'dir-permanences', {
        ficheGo: 'dir-permanences-administratives-fiche-infos',
        filters: ['Toutes', 'Aujourd’hui', 'Cette semaine', 'À proximité'],
        proposition: true,
      }),
  },
  'dir-permanences-sociales': {
    title: 'Sociales — À valider',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      rubriqueListe('Sociales', 'dir-permanences', {
        ficheGo: 'dir-permanences-sociales-fiche-infos',
        filters: ['Toutes', 'Aujourd’hui', 'Cette semaine', 'À proximité'],
        proposition: true,
      }),
  },
  'dir-permanences-juridiques': {
    title: 'Juridiques — À valider',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      rubriqueListe('Juridiques', 'dir-permanences', {
        ficheGo: 'dir-permanences-juridiques-fiche-infos',
        filters: ['Toutes', 'Aujourd’hui', 'Cette semaine', 'À proximité'],
        proposition: true,
      }),
  },
  'dir-permanences-medicales': {
    title: 'Médicales — À valider',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      rubriqueListe('Médicales', 'dir-permanences', {
        ficheGo: 'dir-permanences-medicales-fiche-infos',
        filters: ['Toutes', 'Aujourd’hui', 'Cette semaine', 'À proximité'],
        proposition: true,
      }),
  },

  /* —— Sécurité —— */
  'dir-securite': {
    title: 'Sécurité — À valider',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      rubriqueAccueil({
        title: 'Sécurité',
        bannerTitle: 'Sécurité',
        bannerText: 'Police, secours, prévention, assistance (≠ N° Urgence ≠ Signalement)',
        searchPh: 'Rechercher…',
        filters: ['Tous', 'Ouverts', 'À proximité', 'Enregistrés'],
        proposition: true,
        cats: [
          { label: 'Police', go: 'dir-securite-police' },
          { label: 'Secours', go: 'dir-securite-secours' },
          { label: 'Prévention', go: 'dir-securite-prevention' },
          { label: 'Assistance', go: 'dir-securite-assistance' }
        ],
      }),
  },
  'dir-securite-police': {
    title: 'Police — À valider',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      rubriqueListe('Police', 'dir-securite', {
        ficheGo: 'dir-securite-police-fiche-infos',
        filters: ['Tous', 'Ouverts', 'À proximité', 'Enregistrés'],
        proposition: true,
      }),
  },
  'dir-securite-secours': {
    title: 'Secours — À valider',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      rubriqueListe('Secours', 'dir-securite', {
        ficheGo: 'dir-securite-secours-fiche-infos',
        filters: ['Tous', 'Ouverts', 'À proximité', 'Enregistrés'],
        proposition: true,
      }),
  },
  'dir-securite-prevention': {
    title: 'Prévention — À valider',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      rubriqueListe('Prévention', 'dir-securite', {
        ficheGo: 'dir-securite-prevention-fiche-infos',
        filters: ['Tous', 'Ouverts', 'À proximité', 'Enregistrés'],
        proposition: true,
      }),
  },
  'dir-securite-assistance': {
    title: 'Assistance — À valider',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      rubriqueListe('Assistance', 'dir-securite', {
        ficheGo: 'dir-securite-assistance-fiche-infos',
        filters: ['Tous', 'Ouverts', 'À proximité', 'Enregistrés'],
        proposition: true,
      }),
  },

  /* —— Signalements (Q&A privé · service Ma mairie) —— */
  signalements: {
    title: 'Signalements',
    side: 'user',
    group: 'Ma mairie',
    render: signalementsInbox,
  },
  'signalement-nouveau': {
    title: 'Nouveau signalement',
    side: 'user',
    group: 'Ma mairie',
    render: signalementNouveau,
  },
  'signalement-conversation': {
    title: 'Conversation signalement',
    side: 'user',
    group: 'Ma mairie',
    render: signalementConversation,
  },

  /* —— Météo (accueil synthèse + 4 destinations + 3 modèles) —— */
  'page-meteo': {
    title: 'Météo — Accueil',
    side: 'user',
    group: 'Vie locale',
    render: pageMeteo,
  },
  'meteo-maintenant': {
    title: 'Météo — Maintenant',
    side: 'user',
    group: 'Vie locale',
    render: meteoMaintenant,
  },
  'meteo-aujourdhui': {
    title: 'Météo — Aujourd’hui',
    side: 'user',
    group: 'Vie locale',
    render: () => meteoJournee('Aujourd’hui'),
  },
  'meteo-demain': {
    title: 'Météo — Demain',
    side: 'user',
    group: 'Vie locale',
    render: () => meteoJournee('Demain'),
  },
  'meteo-7jours': {
    title: 'Météo — 7 jours',
    side: 'user',
    group: 'Vie locale',
    render: meteo7Jours,
  },
  'meteo-jour': {
    title: 'Météo — Jour choisi',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      meteoJournee('Jour', {
        backTo: 'meteo-7jours',
        dateLabel: '2 octobre',
      }),
  },

  'dir-restaurants': {
    title: 'Restaurants',
    side: 'user',
    group: 'Vie locale',
    render: () => rubriqueNonValidee('Restaurants'),
  },
  'dir-patrimoine': {
    title: 'Patrimoine (rubrique)',
    side: 'user',
    group: 'Vie locale',
    render: () => rubriqueNonValidee('Patrimoine'),
  },

  'dir-aide-accompagnement-fiche-infos': {
    title: 'Accompagnement — Détail',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      dirFiche('infos', {
        title: 'Accompagnement — fiche…',
        category: 'Accompagnement',
        backTo: 'dir-aide-accompagnement',
        idInfos: 'dir-aide-accompagnement-fiche-infos',
        idHoraires: 'dir-aide-accompagnement-fiche-horaires',
      }),
  },
  'dir-aide-accompagnement-fiche-horaires': {
    title: 'Accompagnement — Horaires',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      dirFiche('horaires', {
        title: 'Accompagnement — fiche…',
        category: 'Accompagnement',
        backTo: 'dir-aide-accompagnement',
        idInfos: 'dir-aide-accompagnement-fiche-infos',
        idHoraires: 'dir-aide-accompagnement-fiche-horaires',
      }),
  },
  'dir-aide-familles-fiche-infos': {
    title: 'Familles — Détail',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      dirFiche('infos', {
        title: 'Familles — fiche…',
        category: 'Familles',
        backTo: 'dir-aide-familles',
        idInfos: 'dir-aide-familles-fiche-infos',
        idHoraires: 'dir-aide-familles-fiche-horaires',
      }),
  },
  'dir-aide-familles-fiche-horaires': {
    title: 'Familles — Horaires',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      dirFiche('horaires', {
        title: 'Familles — fiche…',
        category: 'Familles',
        backTo: 'dir-aide-familles',
        idInfos: 'dir-aide-familles-fiche-infos',
        idHoraires: 'dir-aide-familles-fiche-horaires',
      }),
  },
  'dir-aide-handicap-fiche-infos': {
    title: 'Handicap — Détail',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      dirFiche('infos', {
        title: 'Handicap — fiche…',
        category: 'Handicap',
        backTo: 'dir-aide-handicap',
        idInfos: 'dir-aide-handicap-fiche-infos',
        idHoraires: 'dir-aide-handicap-fiche-horaires',
      }),
  },
  'dir-aide-handicap-fiche-horaires': {
    title: 'Handicap — Horaires',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      dirFiche('horaires', {
        title: 'Handicap — fiche…',
        category: 'Handicap',
        backTo: 'dir-aide-handicap',
        idInfos: 'dir-aide-handicap-fiche-infos',
        idHoraires: 'dir-aide-handicap-fiche-horaires',
      }),
  },
  'dir-aide-seniors-fiche-infos': {
    title: 'Seniors — Détail',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      dirFiche('infos', {
        title: 'Seniors — fiche…',
        category: 'Seniors',
        backTo: 'dir-aide-seniors',
        idInfos: 'dir-aide-seniors-fiche-infos',
        idHoraires: 'dir-aide-seniors-fiche-horaires',
      }),
  },
  'dir-aide-seniors-fiche-horaires': {
    title: 'Seniors — Horaires',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      dirFiche('horaires', {
        title: 'Seniors — fiche…',
        category: 'Seniors',
        backTo: 'dir-aide-seniors',
        idInfos: 'dir-aide-seniors-fiche-infos',
        idHoraires: 'dir-aide-seniors-fiche-horaires',
      }),
  },
  'dir-associations-culture-fiche-infos': {
    title: 'Culture — Détail',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      dirFiche('infos', {
        title: 'Culture — fiche…',
        category: 'Culture',
        backTo: 'dir-associations-culture',
        idInfos: 'dir-associations-culture-fiche-infos',
        idHoraires: 'dir-associations-culture-fiche-horaires',
      }),
  },
  'dir-associations-culture-fiche-horaires': {
    title: 'Culture — Horaires',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      dirFiche('horaires', {
        title: 'Culture — fiche…',
        category: 'Culture',
        backTo: 'dir-associations-culture',
        idInfos: 'dir-associations-culture-fiche-infos',
        idHoraires: 'dir-associations-culture-fiche-horaires',
      }),
  },
  'dir-associations-environnement-fiche-infos': {
    title: 'Environnement — Détail',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      dirFiche('infos', {
        title: 'Environnement — fiche…',
        category: 'Environnement',
        backTo: 'dir-associations-environnement',
        idInfos: 'dir-associations-environnement-fiche-infos',
        idHoraires: 'dir-associations-environnement-fiche-horaires',
      }),
  },
  'dir-associations-environnement-fiche-horaires': {
    title: 'Environnement — Horaires',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      dirFiche('horaires', {
        title: 'Environnement — fiche…',
        category: 'Environnement',
        backTo: 'dir-associations-environnement',
        idInfos: 'dir-associations-environnement-fiche-infos',
        idHoraires: 'dir-associations-environnement-fiche-horaires',
      }),
  },
  'dir-associations-solidarite-fiche-infos': {
    title: 'Solidarité — Détail',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      dirFiche('infos', {
        title: 'Solidarité — fiche…',
        category: 'Solidarité',
        backTo: 'dir-associations-solidarite',
        idInfos: 'dir-associations-solidarite-fiche-infos',
        idHoraires: 'dir-associations-solidarite-fiche-horaires',
      }),
  },
  'dir-associations-solidarite-fiche-horaires': {
    title: 'Solidarité — Horaires',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      dirFiche('horaires', {
        title: 'Solidarité — fiche…',
        category: 'Solidarité',
        backTo: 'dir-associations-solidarite',
        idInfos: 'dir-associations-solidarite-fiche-infos',
        idHoraires: 'dir-associations-solidarite-fiche-horaires',
      }),
  },
  'dir-associations-sport-fiche-infos': {
    title: 'Sport — Détail',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      dirFiche('infos', {
        title: 'Sport — fiche…',
        category: 'Sport',
        backTo: 'dir-associations-sport',
        idInfos: 'dir-associations-sport-fiche-infos',
        idHoraires: 'dir-associations-sport-fiche-horaires',
      }),
  },
  'dir-associations-sport-fiche-horaires': {
    title: 'Sport — Horaires',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      dirFiche('horaires', {
        title: 'Sport — fiche…',
        category: 'Sport',
        backTo: 'dir-associations-sport',
        idInfos: 'dir-associations-sport-fiche-infos',
        idHoraires: 'dir-associations-sport-fiche-horaires',
      }),
  },
  'dir-banques-assurances-fiche-infos': {
    title: 'Assurances — Détail',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      dirFiche('infos', {
        title: 'Assurances — fiche…',
        category: 'Assurances',
        backTo: 'dir-banques-assurances',
        idInfos: 'dir-banques-assurances-fiche-infos',
        idHoraires: 'dir-banques-assurances-fiche-horaires',
      }),
  },
  'dir-banques-assurances-fiche-horaires': {
    title: 'Assurances — Horaires',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      dirFiche('horaires', {
        title: 'Assurances — fiche…',
        category: 'Assurances',
        backTo: 'dir-banques-assurances',
        idInfos: 'dir-banques-assurances-fiche-infos',
        idHoraires: 'dir-banques-assurances-fiche-horaires',
      }),
  },
  'dir-banques-banques-fiche-infos': {
    title: 'Banques — Détail',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      dirFiche('infos', {
        title: 'Banques — fiche…',
        category: 'Banques',
        backTo: 'dir-banques-banques',
        idInfos: 'dir-banques-banques-fiche-infos',
        idHoraires: 'dir-banques-banques-fiche-horaires',
      }),
  },
  'dir-banques-banques-fiche-horaires': {
    title: 'Banques — Horaires',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      dirFiche('horaires', {
        title: 'Banques — fiche…',
        category: 'Banques',
        backTo: 'dir-banques-banques',
        idInfos: 'dir-banques-banques-fiche-infos',
        idHoraires: 'dir-banques-banques-fiche-horaires',
      }),
  },
  'dir-banques-change-fiche-infos': {
    title: 'Change — Détail',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      dirFiche('infos', {
        title: 'Change — fiche…',
        category: 'Change',
        backTo: 'dir-banques-change',
        idInfos: 'dir-banques-change-fiche-infos',
        idHoraires: 'dir-banques-change-fiche-horaires',
      }),
  },
  'dir-banques-change-fiche-horaires': {
    title: 'Change — Horaires',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      dirFiche('horaires', {
        title: 'Change — fiche…',
        category: 'Change',
        backTo: 'dir-banques-change',
        idInfos: 'dir-banques-change-fiche-infos',
        idHoraires: 'dir-banques-change-fiche-horaires',
      }),
  },
  'dir-bibliotheques-bibliotheques-fiche-infos': {
    title: 'Bibliothèques — Détail',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      dirFiche('infos', {
        title: 'Bibliothèques — fiche…',
        category: 'Bibliothèques',
        backTo: 'dir-bibliotheques-bibliotheques',
        idInfos: 'dir-bibliotheques-bibliotheques-fiche-infos',
        idHoraires: 'dir-bibliotheques-bibliotheques-fiche-horaires',
      }),
  },
  'dir-bibliotheques-bibliotheques-fiche-horaires': {
    title: 'Bibliothèques — Horaires',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      dirFiche('horaires', {
        title: 'Bibliothèques — fiche…',
        category: 'Bibliothèques',
        backTo: 'dir-bibliotheques-bibliotheques',
        idInfos: 'dir-bibliotheques-bibliotheques-fiche-infos',
        idHoraires: 'dir-bibliotheques-bibliotheques-fiche-horaires',
      }),
  },
  'dir-bibliotheques-mediatheques-fiche-infos': {
    title: 'Médiathèques — Détail',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      dirFiche('infos', {
        title: 'Médiathèques — fiche…',
        category: 'Médiathèques',
        backTo: 'dir-bibliotheques-mediatheques',
        idInfos: 'dir-bibliotheques-mediatheques-fiche-infos',
        idHoraires: 'dir-bibliotheques-mediatheques-fiche-horaires',
      }),
  },
  'dir-bibliotheques-mediatheques-fiche-horaires': {
    title: 'Médiathèques — Horaires',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      dirFiche('horaires', {
        title: 'Médiathèques — fiche…',
        category: 'Médiathèques',
        backTo: 'dir-bibliotheques-mediatheques',
        idInfos: 'dir-bibliotheques-mediatheques-fiche-infos',
        idHoraires: 'dir-bibliotheques-mediatheques-fiche-horaires',
      }),
  },
  'dir-bibliotheques-salles-de-lecture-fiche-infos': {
    title: 'Salles de lecture — Détail',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      dirFiche('infos', {
        title: 'Salles de lecture — fiche…',
        category: 'Salles de lecture',
        backTo: 'dir-bibliotheques-salles-de-lecture',
        idInfos: 'dir-bibliotheques-salles-de-lecture-fiche-infos',
        idHoraires: 'dir-bibliotheques-salles-de-lecture-fiche-horaires',
      }),
  },
  'dir-bibliotheques-salles-de-lecture-fiche-horaires': {
    title: 'Salles de lecture — Horaires',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      dirFiche('horaires', {
        title: 'Salles de lecture — fiche…',
        category: 'Salles de lecture',
        backTo: 'dir-bibliotheques-salles-de-lecture',
        idInfos: 'dir-bibliotheques-salles-de-lecture-fiche-infos',
        idHoraires: 'dir-bibliotheques-salles-de-lecture-fiche-horaires',
      }),
  },
  'dir-bibliotheques-universitaires-fiche-infos': {
    title: 'Universitaires — Détail',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      dirFiche('infos', {
        title: 'Universitaires — fiche…',
        category: 'Universitaires',
        backTo: 'dir-bibliotheques-universitaires',
        idInfos: 'dir-bibliotheques-universitaires-fiche-infos',
        idHoraires: 'dir-bibliotheques-universitaires-fiche-horaires',
      }),
  },
  'dir-bibliotheques-universitaires-fiche-horaires': {
    title: 'Universitaires — Horaires',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      dirFiche('horaires', {
        title: 'Universitaires — fiche…',
        category: 'Universitaires',
        backTo: 'dir-bibliotheques-universitaires',
        idInfos: 'dir-bibliotheques-universitaires-fiche-infos',
        idHoraires: 'dir-bibliotheques-universitaires-fiche-horaires',
      }),
  },
  'dir-cinemas-cinemas-fiche-infos': {
    title: 'Cinémas — Détail',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      dirFiche('infos', {
        title: 'Cinémas — fiche…',
        category: 'Cinémas',
        backTo: 'dir-cinemas-cinemas',
        idInfos: 'dir-cinemas-cinemas-fiche-infos',
        idHoraires: 'dir-cinemas-cinemas-fiche-horaires',
      }),
  },
  'dir-cinemas-cinemas-fiche-horaires': {
    title: 'Cinémas — Horaires',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      dirFiche('horaires', {
        title: 'Cinémas — fiche…',
        category: 'Cinémas',
        backTo: 'dir-cinemas-cinemas',
        idInfos: 'dir-cinemas-cinemas-fiche-infos',
        idHoraires: 'dir-cinemas-cinemas-fiche-horaires',
      }),
  },
  'dir-cinemas-programmes-fiche-infos': {
    title: 'Programmes — Détail',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      dirFiche('infos', {
        title: 'Programmes — fiche…',
        category: 'Programmes',
        backTo: 'dir-cinemas-programmes',
        idInfos: 'dir-cinemas-programmes-fiche-infos',
        idHoraires: 'dir-cinemas-programmes-fiche-horaires',
      }),
  },
  'dir-cinemas-programmes-fiche-horaires': {
    title: 'Programmes — Horaires',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      dirFiche('horaires', {
        title: 'Programmes — fiche…',
        category: 'Programmes',
        backTo: 'dir-cinemas-programmes',
        idInfos: 'dir-cinemas-programmes-fiche-infos',
        idHoraires: 'dir-cinemas-programmes-fiche-horaires',
      }),
  },
  'dir-cinemas-spectacles-fiche-infos': {
    title: 'Spectacles — Détail',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      dirFiche('infos', {
        title: 'Spectacles — fiche…',
        category: 'Spectacles',
        backTo: 'dir-cinemas-spectacles',
        idInfos: 'dir-cinemas-spectacles-fiche-infos',
        idHoraires: 'dir-cinemas-spectacles-fiche-horaires',
      }),
  },
  'dir-cinemas-spectacles-fiche-horaires': {
    title: 'Spectacles — Horaires',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      dirFiche('horaires', {
        title: 'Spectacles — fiche…',
        category: 'Spectacles',
        backTo: 'dir-cinemas-spectacles',
        idInfos: 'dir-cinemas-spectacles-fiche-infos',
        idHoraires: 'dir-cinemas-spectacles-fiche-horaires',
      }),
  },
  'dir-cinemas-theatres-fiche-infos': {
    title: 'Théâtres — Détail',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      dirFiche('infos', {
        title: 'Théâtres — fiche…',
        category: 'Théâtres',
        backTo: 'dir-cinemas-theatres',
        idInfos: 'dir-cinemas-theatres-fiche-infos',
        idHoraires: 'dir-cinemas-theatres-fiche-horaires',
      }),
  },
  'dir-cinemas-theatres-fiche-horaires': {
    title: 'Théâtres — Horaires',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      dirFiche('horaires', {
        title: 'Théâtres — fiche…',
        category: 'Théâtres',
        backTo: 'dir-cinemas-theatres',
        idInfos: 'dir-cinemas-theatres-fiche-infos',
        idHoraires: 'dir-cinemas-theatres-fiche-horaires',
      }),
  },
  'dir-economie-artisans-fiche-infos': {
    title: 'Artisans — Détail',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      dirFiche('infos', {
        title: 'Artisans — fiche…',
        category: 'Artisans',
        backTo: 'dir-economie-artisans',
        idInfos: 'dir-economie-artisans-fiche-infos',
        idHoraires: 'dir-economie-artisans-fiche-horaires',
      }),
  },
  'dir-economie-artisans-fiche-horaires': {
    title: 'Artisans — Horaires',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      dirFiche('horaires', {
        title: 'Artisans — fiche…',
        category: 'Artisans',
        backTo: 'dir-economie-artisans',
        idInfos: 'dir-economie-artisans-fiche-infos',
        idHoraires: 'dir-economie-artisans-fiche-horaires',
      }),
  },
  'dir-economie-commerces-fiche-infos': {
    title: 'Commerces — Détail',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      dirFiche('infos', {
        title: 'Commerces — fiche…',
        category: 'Commerces',
        backTo: 'dir-economie-commerces',
        idInfos: 'dir-economie-commerces-fiche-infos',
        idHoraires: 'dir-economie-commerces-fiche-horaires',
      }),
  },
  'dir-economie-commerces-fiche-horaires': {
    title: 'Commerces — Horaires',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      dirFiche('horaires', {
        title: 'Commerces — fiche…',
        category: 'Commerces',
        backTo: 'dir-economie-commerces',
        idInfos: 'dir-economie-commerces-fiche-infos',
        idHoraires: 'dir-economie-commerces-fiche-horaires',
      }),
  },
  'dir-economie-entreprises-fiche-infos': {
    title: 'Entreprises — Détail',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      dirFiche('infos', {
        title: 'Entreprises — fiche…',
        category: 'Entreprises',
        backTo: 'dir-economie-entreprises',
        idInfos: 'dir-economie-entreprises-fiche-infos',
        idHoraires: 'dir-economie-entreprises-fiche-horaires',
      }),
  },
  'dir-economie-entreprises-fiche-horaires': {
    title: 'Entreprises — Horaires',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      dirFiche('horaires', {
        title: 'Entreprises — fiche…',
        category: 'Entreprises',
        backTo: 'dir-economie-entreprises',
        idInfos: 'dir-economie-entreprises-fiche-infos',
        idHoraires: 'dir-economie-entreprises-fiche-horaires',
      }),
  },
  'dir-economie-services-fiche-infos': {
    title: 'Services — Détail',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      dirFiche('infos', {
        title: 'Services — fiche…',
        category: 'Services',
        backTo: 'dir-economie-services',
        idInfos: 'dir-economie-services-fiche-infos',
        idHoraires: 'dir-economie-services-fiche-horaires',
      }),
  },
  'dir-economie-services-fiche-horaires': {
    title: 'Services — Horaires',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      dirFiche('horaires', {
        title: 'Services — fiche…',
        category: 'Services',
        backTo: 'dir-economie-services',
        idInfos: 'dir-economie-services-fiche-infos',
        idHoraires: 'dir-economie-services-fiche-horaires',
      }),
  },
  'dir-education-activites-fiche-infos': {
    title: 'Activités — Détail',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      dirFiche('infos', {
        title: 'Activités — fiche…',
        category: 'Activités',
        backTo: 'dir-education-activites',
        idInfos: 'dir-education-activites-fiche-infos',
        idHoraires: 'dir-education-activites-fiche-horaires',
      }),
  },
  'dir-education-activites-fiche-horaires': {
    title: 'Activités — Horaires',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      dirFiche('horaires', {
        title: 'Activités — fiche…',
        category: 'Activités',
        backTo: 'dir-education-activites',
        idInfos: 'dir-education-activites-fiche-infos',
        idHoraires: 'dir-education-activites-fiche-horaires',
      }),
  },
  'dir-education-ecoles-fiche-infos': {
    title: 'Écoles — Détail',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      dirFiche('infos', {
        title: 'Écoles — fiche…',
        category: 'Écoles',
        backTo: 'dir-education-ecoles',
        idInfos: 'dir-education-ecoles-fiche-infos',
        idHoraires: 'dir-education-ecoles-fiche-horaires',
      }),
  },
  'dir-education-ecoles-fiche-horaires': {
    title: 'Écoles — Horaires',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      dirFiche('horaires', {
        title: 'Écoles — fiche…',
        category: 'Écoles',
        backTo: 'dir-education-ecoles',
        idInfos: 'dir-education-ecoles-fiche-infos',
        idHoraires: 'dir-education-ecoles-fiche-horaires',
      }),
  },
  'dir-education-formations-fiche-infos': {
    title: 'Formations — Détail',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      dirFiche('infos', {
        title: 'Formations — fiche…',
        category: 'Formations',
        backTo: 'dir-education-formations',
        idInfos: 'dir-education-formations-fiche-infos',
        idHoraires: 'dir-education-formations-fiche-horaires',
      }),
  },
  'dir-education-formations-fiche-horaires': {
    title: 'Formations — Horaires',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      dirFiche('horaires', {
        title: 'Formations — fiche…',
        category: 'Formations',
        backTo: 'dir-education-formations',
        idInfos: 'dir-education-formations-fiche-infos',
        idHoraires: 'dir-education-formations-fiche-horaires',
      }),
  },
  'dir-education-universites-fiche-infos': {
    title: 'Universités — Détail',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      dirFiche('infos', {
        title: 'Universités — fiche…',
        category: 'Universités',
        backTo: 'dir-education-universites',
        idInfos: 'dir-education-universites-fiche-infos',
        idHoraires: 'dir-education-universites-fiche-horaires',
      }),
  },
  'dir-education-universites-fiche-horaires': {
    title: 'Universités — Horaires',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      dirFiche('horaires', {
        title: 'Universités — fiche…',
        category: 'Universités',
        backTo: 'dir-education-universites',
        idInfos: 'dir-education-universites-fiche-infos',
        idHoraires: 'dir-education-universites-fiche-horaires',
      }),
  },
  'dir-permanences-administratives-fiche-infos': {
    title: 'Administratives — Détail',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      dirFiche('infos', {
        title: 'Administratives — fiche…',
        category: 'Administratives',
        backTo: 'dir-permanences-administratives',
        idInfos: 'dir-permanences-administratives-fiche-infos',
        idHoraires: 'dir-permanences-administratives-fiche-horaires',
      }),
  },
  'dir-permanences-administratives-fiche-horaires': {
    title: 'Administratives — Horaires',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      dirFiche('horaires', {
        title: 'Administratives — fiche…',
        category: 'Administratives',
        backTo: 'dir-permanences-administratives',
        idInfos: 'dir-permanences-administratives-fiche-infos',
        idHoraires: 'dir-permanences-administratives-fiche-horaires',
      }),
  },
  'dir-permanences-juridiques-fiche-infos': {
    title: 'Juridiques — Détail',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      dirFiche('infos', {
        title: 'Juridiques — fiche…',
        category: 'Juridiques',
        backTo: 'dir-permanences-juridiques',
        idInfos: 'dir-permanences-juridiques-fiche-infos',
        idHoraires: 'dir-permanences-juridiques-fiche-horaires',
      }),
  },
  'dir-permanences-juridiques-fiche-horaires': {
    title: 'Juridiques — Horaires',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      dirFiche('horaires', {
        title: 'Juridiques — fiche…',
        category: 'Juridiques',
        backTo: 'dir-permanences-juridiques',
        idInfos: 'dir-permanences-juridiques-fiche-infos',
        idHoraires: 'dir-permanences-juridiques-fiche-horaires',
      }),
  },
  'dir-permanences-medicales-fiche-infos': {
    title: 'Médicales — Détail',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      dirFiche('infos', {
        title: 'Médicales — fiche…',
        category: 'Médicales',
        backTo: 'dir-permanences-medicales',
        idInfos: 'dir-permanences-medicales-fiche-infos',
        idHoraires: 'dir-permanences-medicales-fiche-horaires',
      }),
  },
  'dir-permanences-medicales-fiche-horaires': {
    title: 'Médicales — Horaires',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      dirFiche('horaires', {
        title: 'Médicales — fiche…',
        category: 'Médicales',
        backTo: 'dir-permanences-medicales',
        idInfos: 'dir-permanences-medicales-fiche-infos',
        idHoraires: 'dir-permanences-medicales-fiche-horaires',
      }),
  },
  'dir-permanences-sociales-fiche-infos': {
    title: 'Sociales — Détail',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      dirFiche('infos', {
        title: 'Sociales — fiche…',
        category: 'Sociales',
        backTo: 'dir-permanences-sociales',
        idInfos: 'dir-permanences-sociales-fiche-infos',
        idHoraires: 'dir-permanences-sociales-fiche-horaires',
      }),
  },
  'dir-permanences-sociales-fiche-horaires': {
    title: 'Sociales — Horaires',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      dirFiche('horaires', {
        title: 'Sociales — fiche…',
        category: 'Sociales',
        backTo: 'dir-permanences-sociales',
        idInfos: 'dir-permanences-sociales-fiche-infos',
        idHoraires: 'dir-permanences-sociales-fiche-horaires',
      }),
  },
  'dir-securite-assistance-fiche-infos': {
    title: 'Assistance — Détail',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      dirFiche('infos', {
        title: 'Assistance — fiche…',
        category: 'Assistance',
        backTo: 'dir-securite-assistance',
        idInfos: 'dir-securite-assistance-fiche-infos',
        idHoraires: 'dir-securite-assistance-fiche-horaires',
      }),
  },
  'dir-securite-assistance-fiche-horaires': {
    title: 'Assistance — Horaires',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      dirFiche('horaires', {
        title: 'Assistance — fiche…',
        category: 'Assistance',
        backTo: 'dir-securite-assistance',
        idInfos: 'dir-securite-assistance-fiche-infos',
        idHoraires: 'dir-securite-assistance-fiche-horaires',
      }),
  },
  'dir-securite-police-fiche-infos': {
    title: 'Police — Détail',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      dirFiche('infos', {
        title: 'Police — fiche…',
        category: 'Police',
        backTo: 'dir-securite-police',
        idInfos: 'dir-securite-police-fiche-infos',
        idHoraires: 'dir-securite-police-fiche-horaires',
      }),
  },
  'dir-securite-police-fiche-horaires': {
    title: 'Police — Horaires',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      dirFiche('horaires', {
        title: 'Police — fiche…',
        category: 'Police',
        backTo: 'dir-securite-police',
        idInfos: 'dir-securite-police-fiche-infos',
        idHoraires: 'dir-securite-police-fiche-horaires',
      }),
  },
  'dir-securite-prevention-fiche-infos': {
    title: 'Prévention — Détail',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      dirFiche('infos', {
        title: 'Prévention — fiche…',
        category: 'Prévention',
        backTo: 'dir-securite-prevention',
        idInfos: 'dir-securite-prevention-fiche-infos',
        idHoraires: 'dir-securite-prevention-fiche-horaires',
      }),
  },
  'dir-securite-prevention-fiche-horaires': {
    title: 'Prévention — Horaires',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      dirFiche('horaires', {
        title: 'Prévention — fiche…',
        category: 'Prévention',
        backTo: 'dir-securite-prevention',
        idInfos: 'dir-securite-prevention-fiche-infos',
        idHoraires: 'dir-securite-prevention-fiche-horaires',
      }),
  },
  'dir-securite-secours-fiche-infos': {
    title: 'Secours — Détail',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      dirFiche('infos', {
        title: 'Secours — fiche…',
        category: 'Secours',
        backTo: 'dir-securite-secours',
        idInfos: 'dir-securite-secours-fiche-infos',
        idHoraires: 'dir-securite-secours-fiche-horaires',
      }),
  },
  'dir-securite-secours-fiche-horaires': {
    title: 'Secours — Horaires',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      dirFiche('horaires', {
        title: 'Secours — fiche…',
        category: 'Secours',
        backTo: 'dir-securite-secours',
        idInfos: 'dir-securite-secours-fiche-infos',
        idHoraires: 'dir-securite-secours-fiche-horaires',
      }),
  },
  'dir-transports-bus-fiche-infos': {
    title: 'Bus — Détail',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      dirFiche('infos', {
        title: 'Bus — fiche…',
        category: 'Bus',
        backTo: 'dir-transports-bus',
        idInfos: 'dir-transports-bus-fiche-infos',
        idHoraires: 'dir-transports-bus-fiche-horaires',
      }),
  },
  'dir-transports-bus-fiche-horaires': {
    title: 'Bus — Horaires',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      dirFiche('horaires', {
        title: 'Bus — fiche…',
        category: 'Bus',
        backTo: 'dir-transports-bus',
        idInfos: 'dir-transports-bus-fiche-infos',
        idHoraires: 'dir-transports-bus-fiche-horaires',
      }),
  },
  'dir-transports-gares-fiche-infos': {
    title: 'Gares — Détail',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      dirFiche('infos', {
        title: 'Gares — fiche…',
        category: 'Gares',
        backTo: 'dir-transports-gares',
        idInfos: 'dir-transports-gares-fiche-infos',
        idHoraires: 'dir-transports-gares-fiche-horaires',
      }),
  },
  'dir-transports-gares-fiche-horaires': {
    title: 'Gares — Horaires',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      dirFiche('horaires', {
        title: 'Gares — fiche…',
        category: 'Gares',
        backTo: 'dir-transports-gares',
        idInfos: 'dir-transports-gares-fiche-infos',
        idHoraires: 'dir-transports-gares-fiche-horaires',
      }),
  },
  'dir-transports-location-fiche-infos': {
    title: 'Location — Détail',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      dirFiche('infos', {
        title: 'Location — fiche…',
        category: 'Location',
        backTo: 'dir-transports-location',
        idInfos: 'dir-transports-location-fiche-infos',
        idHoraires: 'dir-transports-location-fiche-horaires',
      }),
  },
  'dir-transports-location-fiche-horaires': {
    title: 'Location — Horaires',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      dirFiche('horaires', {
        title: 'Location — fiche…',
        category: 'Location',
        backTo: 'dir-transports-location',
        idInfos: 'dir-transports-location-fiche-infos',
        idHoraires: 'dir-transports-location-fiche-horaires',
      }),
  },
  'dir-transports-taxis-fiche-infos': {
    title: 'Taxis — Détail',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      dirFiche('infos', {
        title: 'Taxis — fiche…',
        category: 'Taxis',
        backTo: 'dir-transports-taxis',
        idInfos: 'dir-transports-taxis-fiche-infos',
        idHoraires: 'dir-transports-taxis-fiche-horaires',
      }),
  },
  'dir-transports-taxis-fiche-horaires': {
    title: 'Taxis — Horaires',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      dirFiche('horaires', {
        title: 'Taxis — fiche…',
        category: 'Taxis',
        backTo: 'dir-transports-taxis',
        idInfos: 'dir-transports-taxis-fiche-infos',
        idHoraires: 'dir-transports-taxis-fiche-horaires',
      }),
  },

  'dir-fiche': {
    title: 'Fiche — Informations',
    side: 'user',
    group: 'Vie locale',
    render: () => dirFiche('infos', { backTo: 'vie-locale-hub' }),
  },
  'dir-fiche-horaires': {
    title: 'Fiche — Horaires',
    side: 'user',
    group: 'Vie locale',
    render: () => dirFiche('horaires', { backTo: 'vie-locale-hub' }),
  },
  'communautes-groupes': {
    title: 'Groupes',
    side: 'user',
    group: 'Vie locale',
    render: () => communautesList('groupes'),
  },
  'communautes-clubs': {
    title: 'Clubs',
    side: 'user',
    group: 'Vie locale',
    render: () => communautesList('clubs'),
  },
  'communautes-rencontres': {
    title: 'Mes rencontres',
    side: 'user',
    group: 'Vie locale',
    render: mesRencontres,
  },
  'mes-rencontres': {
    title: 'Mes rencontres',
    side: 'user',
    group: 'Vie locale',
    render: mesRencontres,
  },
  'rencontre-details': {
    title: 'Rencontre — Détails',
    side: 'user',
    group: 'Vie locale',
    render: rencontreDetails,
  },
  'rencontre-create': {
    title: 'Créer une rencontre',
    side: 'user',
    group: 'Vie locale',
    render: rencontreCreate,
  },
  'rencontre-edit': {
    title: 'Modifier une rencontre',
    side: 'user',
    group: 'Vie locale',
    render: rencontreEdit,
  },
  'rencontre-guests': {
    title: 'Gérer les invités',
    side: 'user',
    group: 'Vie locale',
    render: rencontreGuests,
  },
  'rencontre-propose': {
    title: 'Contre-proposition',
    side: 'user',
    group: 'Vie locale',
    render: rencontrePropose,
  },
  'rencontre-menu': {
    title: 'Menu rencontre',
    side: 'user',
    group: 'Vie locale',
    render: rencontreMenu,
  },
  'communaute-page': {
    title: 'Communauté',
    side: 'user',
    group: 'Vie locale',
    render: () => communautePage('publications'),
  },
  'communaute-apropos': {
    title: 'Communauté — Informations',
    side: 'user',
    group: 'Vie locale',
    render: () => communautePage('informations'),
  },
  'communaute-evenements': {
    title: 'Communauté — Événements',
    side: 'user',
    group: 'Vie locale',
    render: () => communautePage('evenements'),
  },
  'communaute-menu': {
    title: 'Menu communauté',
    side: 'user',
    group: 'Vie locale',
    render: communauteMenu,
  },
  'communaute-parametres': {
    title: 'Paramètres communauté',
    side: 'user',
    group: 'Vie locale',
    render: communauteParametres,
  },
  'communaute-attribuer-role': {
    title: 'Attribuer un rôle',
    side: 'user',
    group: 'Vie locale',
    render: communauteAttribuerRole,
  },
  'communaute-membres': {
    title: 'Communauté — Membres',
    side: 'user',
    group: 'Vie locale',
    render: communauteMembres,
  },
  'communaute-composer': {
    title: 'Publier',
    side: 'user',
    group: 'Vie locale',
    render: communauteComposer,
  },
  'communaute-create': {
    title: 'Créer une communauté',
    side: 'user',
    group: 'Vie locale',
    render: communauteCreate,
  },

  'admin-home': { title: 'Admin — Tableau de bord', side: 'admin', group: 'Admin', render: adminHome },
  'admin-contenus': {
    title: 'Gestion contenus (redirige)',
    side: 'admin',
    group: 'Admin',
    render: adminContenus,
  },
  'admin-fiche-edit': {
    title: 'Édition fiche (redirige)',
    side: 'admin',
    group: 'Admin',
    render: adminFicheEdit,
  },
  'admin-mairie': {
    title: 'Admin — Ma mairie',
    side: 'admin',
    group: 'Admin',
    render: adminMairie,
  },
  'admin-mairie-page': {
    title: 'Admin — Gérer la page',
    side: 'admin',
    group: 'Admin',
    render: mairieGererPage,
  },
  'admin-mairie-pub-form': {
    title: 'Admin — Publication mairie',
    side: 'admin',
    group: 'Admin',
    render: mairieNouvellePublication,
  },
  'admin-evenements': {
    title: 'Admin — Événements',
    side: 'admin',
    group: 'Admin',
    render: adminEvenements,
  },
  'evenements-gerer-liste': {
    title: 'Admin — Gérer les événements',
    side: 'admin',
    group: 'Admin',
    render: adminEvenements,
  },
  'admin-evenement-form': {
    title: 'Admin — Formulaire événement',
    side: 'admin',
    group: 'Admin',
    render: evenementForm,
  },
  'admin-annonces': {
    title: 'Admin — Annonces',
    side: 'admin',
    group: 'Admin',
    render: adminAnnonces,
  },
  'admin-annonce-form': {
    title: 'Admin — Formulaire annonce',
    side: 'admin',
    group: 'Admin',
    render: adminAnnonceForm,
  },
  'admin-offres': {
    title: 'Admin — Offres',
    side: 'admin',
    group: 'Admin',
    render: adminOffres,
  },
  'admin-offre-form': {
    title: 'Admin — Formulaire offre',
    side: 'admin',
    group: 'Admin',
    render: emploiForm,
  },
  'admin-annuaires': {
    title: 'Admin — Annuaires',
    side: 'admin',
    group: 'Admin',
    render: adminAnnuaires,
  },
  'admin-annuaire-rubrique': {
    title: 'Admin — Rubrique annuaire',
    side: 'admin',
    group: 'Admin',
    render: adminAnnuaireRubrique,
  },
  'admin-annuaire-sante': {
    title: 'Admin — Annuaire Santé',
    side: 'admin',
    group: 'Admin',
    render: adminAnnuaireSante,
  },
  'admin-annuaire-pharmacies': {
    title: 'Admin — Pharmacies',
    side: 'admin',
    group: 'Admin',
    render: adminAnnuairePharmacies,
  },
  'admin-fiche-form': {
    title: 'Admin — Fiche annuaire',
    side: 'admin',
    group: 'Admin',
    render: ficheAnnuaireForm,
  },
  'admin-rdv': {
    title: 'Admin — RDV',
    side: 'admin',
    group: 'Admin',
    render: adminRdv,
  },
  'admin-rdv-cancel': {
    title: 'Admin — Annuler RDV',
    side: 'admin',
    group: 'Admin',
    render: adminRdvCancelMotif,
  },
  'admin-moderation': {
    title: 'Modération',
    side: 'admin',
    group: 'Admin',
    render: adminModeration,
  },
  'moderation-case': {
    title: 'Dossier de modération',
    side: 'admin',
    group: 'Admin',
    render: moderationCase,
  },
  'admin-equipe': {
    title: 'Équipe et permissions',
    side: 'admin',
    group: 'Admin',
    render: adminEquipe,
  },
  'admin-stats': {
    title: 'Statistiques',
    side: 'admin',
    group: 'Admin',
    render: () => adminStub('Statistiques'),
  },
}



/**
 * Left-panel prototype nav — hierarchical tree (tabs User | Admin).
 * Node: { id?, label, children? } — id = clickable screen; no id = label only.
 */
export const NAV_TREE = {
  user: {
    tab: 'Utilisateur',
    roots: [
      { id: 'ville-bienvenue', label: 'Bienvenue' },
      { id: 'ville-modale-choisir', label: 'Choisir une ville' },
      { id: 'ville-modale-confirmer', label: 'Confirmer la ville' },
      {
        id: 'accueil-kapan',
        label: 'Accueil Ma Ville',
        children: [
          {
            id: 'mairie-accueil',
            label: 'Ma mairie',
            children: [
              { id: 'mairie-menu', label: 'Menu ⋯' },
              { id: 'mairie-recherche', label: 'Recherche' },
              { id: 'mairie-accueil-evenements', label: 'Événements (onglet)' },
              { id: 'mairie-gerer-page', label: 'Gérer la page' },
              {
                id: 'mairie-rdv',
                label: 'Prendre rendez-vous',
                children: [
                  { id: 'mairie-rdv-suite', label: 'Confirmation' },
                ],
              },
              {
                id: 'signalements',
                label: 'Signalements',
                children: [
                  { id: 'signalement-nouveau', label: 'Nouveau' },
                  { id: 'signalement-conversation', label: 'Conversation' },
                ],
              },
              {
                id: 'mairie-presentation',
                label: 'Présentation de la ville',
                children: [
                  { id: 'mairie-presentation-options', label: 'Plus d’options' },
                ],
              },
              {
                id: 'mairie-nouvelle-publication',
                label: 'Nouvelle publication',
                children: [
                  { id: 'mairie-medias-sheet', label: 'Médias (sheet)' },
                  { id: 'mairie-pub-preview', label: 'Prévisualisation' },
                ],
              },
              { id: 'mairie-pub-edit', label: 'Modifier publication' },
              { id: 'mairie-pub-options-habitant', label: 'Options pub · habitant' },
              { id: 'mairie-pub-options-admin', label: 'Options pub · admin' },
              {
                label: 'Menus / permissions',
                children: [
                  { id: 'content-menu', label: 'content-menu' },
                  { id: 'menu-confirm-delete-pub', label: 'Confirm delete pub' },
                  { id: 'menu-confirm-delete-dir', label: 'Confirm delete fiche' },
                  { id: 'menu-confirm-delete-evt', label: 'Confirm delete evt' },
                  { id: 'menu-confirm-cancel-evt', label: 'Confirm cancel evt' },
                  { id: 'menu-moderate-pub', label: 'Modérer pub' },
                  { id: 'menu-signal-fiche-info', label: 'Signaler info fiche' },
                ],
              },
              {
                id: 'mairie-conseil',
                label: 'Maire & Conseil',
                children: [
                  { id: 'mairie-conseil-edit', label: 'Édition admin' },
                ],
              },
              {
                id: 'mairie-infos',
                label: 'Infos Mairie (pratiques)',
                children: [
                  { id: 'mairie-infos-detail', label: 'Publication détail' },
                  { id: 'mairie-infos-apropos', label: 'À propos (sheet)' },
                  { id: 'mairie-apropos-communaute', label: 'À propos communauté' },
                  { id: 'mairie-communaute', label: 'Communauté (alias)' },
                ],
              },
              { id: 'fiche-annuaire-form', label: 'Fiche annuaire (form)' },
              {
                id: 'mairie-plan',
                label: 'Plan de la ville',
                children: [
                  { id: 'mairie-plan-menu', label: 'Menu carte' },
                  { id: 'mairie-plan-parametres', label: 'Paramètres' },
                  { id: 'mairie-plan-aller', label: 'Aller à un endroit' },
                ],
              },
            ],
          },
          {
            id: 'infos-feed',
            label: 'Infos citoyen',
            children: [
              { id: 'infos-post-options', label: 'Options (propre)' },
              { id: 'infos-post-options-other', label: 'Options (autre)' },
              { id: 'infos-reactions', label: 'Réactions' },
              { id: 'infos-commentaires', label: 'Commentaires' },
              { id: 'infos-partage', label: 'Partage' },
              { id: 'infos-ajouter-ami', label: 'Ajouter ami' },
            ],
          },
          {
            id: 'evenements-liste',
            label: 'Événements',
            children: [
              {
                id: 'evenement-details',
                label: 'Détails',
                children: [
                  { id: 'evenement-form', label: 'Créer / modifier' },
                  { id: 'evenement-options', label: 'Options (⋯)' },
                  {
                    id: 'evenement-participants',
                    label: 'Participants',
                    children: [
                      { id: 'evenement-participant-menu', label: 'Menu participant' },
                      { id: 'evenement-supprimer-confirm', label: 'Supprimer (confirm)' },
                      { id: 'evenement-signaler', label: 'Signaler' },
                      {
                        id: 'evenement-discussion',
                        label: 'Discussion',
                        children: [
                          { id: 'evenement-groupe-modal', label: 'Groupe modal' },
                        ],
                      },
                    ],
                  },
                  {
                    id: 'evenement-validation',
                    label: 'Validation',
                    children: [
                      { id: 'evenement-validation-valide', label: 'Validé' },
                      { id: 'evenement-validation-refuse', label: 'Refusé' },
                      { id: 'evenement-annuler-refus', label: 'Annuler le refus' },
                    ],
                  },
                  { id: 'evenement-criteres', label: 'Critères' },
                  { id: 'evenement-conditions', label: 'Conditions' },
                ],
              },
            ],
          },
          {
            id: 'annonces-liste',
            label: 'Petites annonces',
            children: [
              { id: 'annonce-details', label: 'Détails' },
              { id: 'annonces-filtres', label: 'Filtres' },
            ],
          },
          {
            id: 'emplois-liste',
            label: 'Offres d’emploi',
            children: [
              { id: 'emplois-cat-emplois', label: 'Emplois' },
              { id: 'emplois-cat-temporaires', label: 'Emplois temporaires' },
              { id: 'emplois-cat-stages', label: 'Stages' },
              { id: 'emplois-cat-alternance', label: 'Alternance' },
              { id: 'emplois-filtres', label: 'Filtres' },
              { id: 'emploi-details', label: 'Détail offre' },
              { id: 'emploi-form', label: 'Formulaire' },
              { id: 'emploi-preview', label: 'Prévisualisation' },
            ],
          },
          { id: 'communautes-groupes', label: 'Groupes', children: [
            { id: 'communaute-page', label: 'Page communauté' },
            { id: 'communaute-evenements', label: 'Événements' },
            { id: 'communaute-apropos', label: 'Informations' },
            { id: 'communaute-menu', label: 'Menu ⋯' },
            { id: 'communaute-parametres', label: 'Paramètres' },
            { id: 'communaute-attribuer-role', label: 'Attribuer un rôle' },
            { id: 'communaute-membres', label: 'Membres' },
            { id: 'communaute-composer', label: 'Composer' },
            { id: 'communaute-create', label: 'Créer' },
          ] },
          { id: 'communautes-clubs', label: 'Clubs' },
          {
            id: 'communautes-rencontres',
            label: 'Mes rencontres',
            children: [
              { id: 'rencontre-details', label: 'Détails' },
              { id: 'rencontre-create', label: 'Créer' },
              { id: 'rencontre-edit', label: 'Modifier' },
              { id: 'rencontre-guests', label: 'Invités' },
              { id: 'rencontre-propose', label: 'Contre-proposition' },
              { id: 'rencontre-menu', label: 'Menu ⋯' },
            ],
          },
          {
            id: 'dir-education',
            label: 'Éducation',
            children: [
              {
                id: 'dir-education-ecoles',
                label: 'Écoles',
                children: [
                  { id: 'dir-education-ecoles-fiche-infos', label: 'Détail' },
                  { id: 'dir-education-ecoles-fiche-horaires', label: 'Horaires' },
                ],
              },
              {
                id: 'dir-education-formations',
                label: 'Formations',
                children: [
                  { id: 'dir-education-formations-fiche-infos', label: 'Détail' },
                  { id: 'dir-education-formations-fiche-horaires', label: 'Horaires' },
                ],
              },
              {
                id: 'dir-education-universites',
                label: 'Universités',
                children: [
                  { id: 'dir-education-universites-fiche-infos', label: 'Détail' },
                  { id: 'dir-education-universites-fiche-horaires', label: 'Horaires' },
                ],
              },
              {
                id: 'dir-education-activites',
                label: 'Activités',
                children: [
                  { id: 'dir-education-activites-fiche-infos', label: 'Détail' },
                  { id: 'dir-education-activites-fiche-horaires', label: 'Horaires' },
                ],
              },
              { id: 'dir-education-inscriptions', label: 'Inscriptions' },
              { id: 'dir-education-calendrier', label: 'Calendrier' },
            ],
          },
          {
            id: 'dir-economie',
            label: 'Économie',
            children: [
              {
                id: 'dir-economie-commerces',
                label: 'Commerces',
                children: [
                  { id: 'dir-economie-commerces-fiche-infos', label: 'Détail' },
                  { id: 'dir-economie-commerces-fiche-horaires', label: 'Horaires' },
                ],
              },
              {
                id: 'dir-economie-entreprises',
                label: 'Entreprises',
                children: [
                  { id: 'dir-economie-entreprises-fiche-infos', label: 'Détail' },
                  { id: 'dir-economie-entreprises-fiche-horaires', label: 'Horaires' },
                ],
              },
              {
                id: 'dir-economie-artisans',
                label: 'Artisans',
                children: [
                  { id: 'dir-economie-artisans-fiche-infos', label: 'Détail' },
                  { id: 'dir-economie-artisans-fiche-horaires', label: 'Horaires' },
                ],
              },
              {
                id: 'dir-economie-services',
                label: 'Services',
                children: [
                  { id: 'dir-economie-services-fiche-infos', label: 'Détail' },
                  { id: 'dir-economie-services-fiche-horaires', label: 'Horaires' },
                ],
              },
              { id: 'dir-economie-actus', label: 'Actus' },
              { id: 'dir-economie-marches', label: 'Marchés' },
            ],
          },
          {
            id: 'dir-cinemas',
            label: 'Cinéma & Théâtres',
            children: [
              {
                id: 'dir-cinemas-cinemas',
                label: 'Cinémas',
                children: [
                  { id: 'dir-cinemas-cinemas-fiche-infos', label: 'Détail' },
                  { id: 'dir-cinemas-cinemas-fiche-horaires', label: 'Horaires' },
                ],
              },
              {
                id: 'dir-cinemas-theatres',
                label: 'Théâtres',
                children: [
                  { id: 'dir-cinemas-theatres-fiche-infos', label: 'Détail' },
                  { id: 'dir-cinemas-theatres-fiche-horaires', label: 'Horaires' },
                ],
              },
              {
                id: 'dir-cinemas-programmes',
                label: 'Programmes',
                children: [
                  { id: 'dir-cinemas-programme-semaine', label: 'Programme semaine' },
                ],
              },
              {
                id: 'dir-cinemas-spectacles',
                label: 'Spectacles',
                children: [
                  { id: 'dir-cinemas-spectacles-fiche-infos', label: 'Détail' },
                  { id: 'dir-cinemas-spectacles-fiche-horaires', label: 'Horaires' },
                ],
              },
            ],
          },
          { id: 'dir-patrimoine', label: 'Patrimoine' },
          {
            id: 'dir-aide-sociale',
            label: 'Aide sociale',
            children: [
              {
                id: 'dir-aide-familles',
                label: 'Familles',
                children: [
                  { id: 'dir-aide-familles-fiche-infos', label: 'Détail' },
                  { id: 'dir-aide-familles-fiche-horaires', label: 'Horaires' },
                ],
              },
              {
                id: 'dir-aide-seniors',
                label: 'Seniors',
                children: [
                  { id: 'dir-aide-seniors-fiche-infos', label: 'Détail' },
                  { id: 'dir-aide-seniors-fiche-horaires', label: 'Horaires' },
                ],
              },
              {
                id: 'dir-aide-handicap',
                label: 'Handicap',
                children: [
                  { id: 'dir-aide-handicap-fiche-infos', label: 'Détail' },
                  { id: 'dir-aide-handicap-fiche-horaires', label: 'Horaires' },
                ],
              },
              {
                id: 'dir-aide-accompagnement',
                label: 'Accompagnement',
                children: [
                  { id: 'dir-aide-accompagnement-fiche-infos', label: 'Détail' },
                  { id: 'dir-aide-accompagnement-fiche-horaires', label: 'Horaires' },
                ],
              },
            ],
          },
          {
            id: 'dir-associations',
            label: 'Associations',
            children: [
              {
                id: 'dir-associations-solidarite',
                label: 'Solidarité',
                children: [
                  { id: 'dir-associations-solidarite-fiche-infos', label: 'Détail' },
                  { id: 'dir-associations-solidarite-fiche-horaires', label: 'Horaires' },
                ],
              },
              {
                id: 'dir-associations-culture',
                label: 'Culture',
                children: [
                  { id: 'dir-associations-culture-fiche-infos', label: 'Détail' },
                  { id: 'dir-associations-culture-fiche-horaires', label: 'Horaires' },
                ],
              },
              {
                id: 'dir-associations-sport',
                label: 'Sport',
                children: [
                  { id: 'dir-associations-sport-fiche-infos', label: 'Détail' },
                  { id: 'dir-associations-sport-fiche-horaires', label: 'Horaires' },
                ],
              },
              {
                id: 'dir-associations-environnement',
                label: 'Environnement',
                children: [
                  { id: 'dir-associations-environnement-fiche-infos', label: 'Détail' },
                  { id: 'dir-associations-environnement-fiche-horaires', label: 'Horaires' },
                ],
              },
            ],
          },
          {
            id: 'dir-banques',
            label: 'Banques & Assurances',
            children: [
              {
                id: 'dir-banques-banques',
                label: 'Banques',
                children: [
                  { id: 'dir-banques-banques-fiche-infos', label: 'Détail' },
                  { id: 'dir-banques-banques-fiche-horaires', label: 'Horaires' },
                ],
              },
              {
                id: 'dir-banques-assurances',
                label: 'Assurances',
                children: [
                  { id: 'dir-banques-assurances-fiche-infos', label: 'Détail' },
                  { id: 'dir-banques-assurances-fiche-horaires', label: 'Horaires' },
                ],
              },
              {
                id: 'dir-banques-distributeurs',
                label: 'Distributeurs',
                children: [
                  { id: 'dir-banques-distributeur-infos', label: 'Détail' },
                  { id: 'dir-banques-distributeur-horaires', label: 'Horaires' },
                ],
              },
              {
                id: 'dir-banques-change',
                label: 'Change',
                children: [
                  { id: 'dir-banques-change-fiche-infos', label: 'Détail' },
                  { id: 'dir-banques-change-fiche-horaires', label: 'Horaires' },
                ],
              },
            ],
          },
          { id: 'dir-restaurants', label: 'Restaurants' },
          {
            id: 'dir-transports',
            label: 'Transports',
            children: [
              {
                id: 'dir-transports-bus',
                label: 'Bus',
                children: [
                  { id: 'dir-transports-bus-fiche-infos', label: 'Détail' },
                  { id: 'dir-transports-bus-fiche-horaires', label: 'Horaires' },
                ],
              },
              {
                id: 'dir-transports-taxis',
                label: 'Taxis',
                children: [
                  { id: 'dir-transports-taxis-fiche-infos', label: 'Détail' },
                  { id: 'dir-transports-taxis-fiche-horaires', label: 'Horaires' },
                ],
              },
              {
                id: 'dir-transports-gares',
                label: 'Gares',
                children: [
                  { id: 'dir-transports-gares-fiche-infos', label: 'Détail' },
                  { id: 'dir-transports-gares-fiche-horaires', label: 'Horaires' },
                ],
              },
              {
                id: 'dir-transports-location',
                label: 'Location',
                children: [
                  { id: 'dir-transports-location-fiche-infos', label: 'Détail' },
                  { id: 'dir-transports-location-fiche-horaires', label: 'Horaires' },
                ],
              },
            ],
          },
          {
            id: 'dir-bibliotheques',
            label: 'Bibliothèque',
            children: [
              {
                id: 'dir-bibliotheques-bibliotheques',
                label: 'Bibliothèques',
                children: [
                  { id: 'dir-bibliotheques-bibliotheques-fiche-infos', label: 'Détail' },
                  { id: 'dir-bibliotheques-bibliotheques-fiche-horaires', label: 'Horaires' },
                ],
              },
              {
                id: 'dir-bibliotheques-mediatheques',
                label: 'Médiathèques',
                children: [
                  { id: 'dir-bibliotheques-mediatheques-fiche-infos', label: 'Détail' },
                  { id: 'dir-bibliotheques-mediatheques-fiche-horaires', label: 'Horaires' },
                ],
              },
              {
                id: 'dir-bibliotheques-universitaires',
                label: 'Universitaires',
                children: [
                  { id: 'dir-bibliotheques-universitaires-fiche-infos', label: 'Détail' },
                  { id: 'dir-bibliotheques-universitaires-fiche-horaires', label: 'Horaires' },
                ],
              },
              {
                id: 'dir-bibliotheques-salles-de-lecture',
                label: 'Salles de lecture',
                children: [
                  { id: 'dir-bibliotheques-salles-de-lecture-fiche-infos', label: 'Détail' },
                  { id: 'dir-bibliotheques-salles-de-lecture-fiche-horaires', label: 'Horaires' },
                ],
              },
            ],
          },
          {
            id: 'dir-permanences',
            label: 'Permanences',
            children: [
              {
                id: 'dir-permanences-administratives',
                label: 'Administratives',
                children: [
                  { id: 'dir-permanences-administratives-fiche-infos', label: 'Détail' },
                  { id: 'dir-permanences-administratives-fiche-horaires', label: 'Horaires' },
                ],
              },
              {
                id: 'dir-permanences-sociales',
                label: 'Sociales',
                children: [
                  { id: 'dir-permanences-sociales-fiche-infos', label: 'Détail' },
                  { id: 'dir-permanences-sociales-fiche-horaires', label: 'Horaires' },
                ],
              },
              {
                id: 'dir-permanences-juridiques',
                label: 'Juridiques',
                children: [
                  { id: 'dir-permanences-juridiques-fiche-infos', label: 'Détail' },
                  { id: 'dir-permanences-juridiques-fiche-horaires', label: 'Horaires' },
                ],
              },
              {
                id: 'dir-permanences-medicales',
                label: 'Médicales',
                children: [
                  { id: 'dir-permanences-medicales-fiche-infos', label: 'Détail' },
                  { id: 'dir-permanences-medicales-fiche-horaires', label: 'Horaires' },
                ],
              },
            ],
          },
          {
            id: 'sante-accueil',
            label: 'Santé',
            children: [
              { id: 'sante-urgences', label: 'Urgences' },
              {
                id: 'sante-pharmacies',
                label: 'Pharmacies',
                children: [
                  { id: 'sante-pharmacie-infos', label: 'Informations' },
                  { id: 'sante-pharmacie-horaires', label: 'Horaires' },
                  { id: 'sante-pharmacie-unpublished', label: 'Fiche non publiée' },
                ],
              },
              {
                id: 'sante-hopitaux',
                label: 'Hôpitaux',
                children: [
                  { id: 'sante-hopital-details', label: 'Informations' },
                  { id: 'sante-hopital-horaires', label: 'Horaires' },
                ],
              },
              { id: 'sante-ambulances', label: 'Ambulances' },
            ],
          },
          {
            id: 'dir-securite',
            label: 'Sécurité',
            children: [
              {
                id: 'dir-securite-police',
                label: 'Police',
                children: [
                  { id: 'dir-securite-police-fiche-infos', label: 'Détail' },
                  { id: 'dir-securite-police-fiche-horaires', label: 'Horaires' },
                ],
              },
              {
                id: 'dir-securite-secours',
                label: 'Secours',
                children: [
                  { id: 'dir-securite-secours-fiche-infos', label: 'Détail' },
                  { id: 'dir-securite-secours-fiche-horaires', label: 'Horaires' },
                ],
              },
              {
                id: 'dir-securite-prevention',
                label: 'Prévention',
                children: [
                  { id: 'dir-securite-prevention-fiche-infos', label: 'Détail' },
                  { id: 'dir-securite-prevention-fiche-horaires', label: 'Horaires' },
                ],
              },
              {
                id: 'dir-securite-assistance',
                label: 'Assistance',
                children: [
                  { id: 'dir-securite-assistance-fiche-infos', label: 'Détail' },
                  { id: 'dir-securite-assistance-fiche-horaires', label: 'Horaires' },
                ],
              },
            ],
          },
          {
            id: 'dir-tourisme',
            label: 'Tourisme',
            children: [
              {
                id: 'dir-tourisme-patrimoine',
                label: 'Patrimoine',
                children: [
                  { id: 'dir-tourisme-fiche-infos', label: 'Détail' },
                  { id: 'dir-tourisme-fiche-horaires', label: 'Horaires' },
                ],
              },
              {
                id: 'dir-tourisme-nature',
                label: 'Nature',
                children: [
                  { id: 'dir-nature-fiche-infos', label: 'Détail' },
                  { id: 'dir-nature-fiche-horaires', label: 'Horaires' },
                ],
              },
              {
                id: 'dir-tourisme-culture',
                label: 'Culture',
                children: [
                  { id: 'dir-tourisme-culture-fiche-infos', label: 'Détail' },
                  { id: 'dir-tourisme-culture-fiche-horaires', label: 'Horaires' },
                ],
              },
              {
                id: 'dir-tourisme-activites',
                label: 'Activités',
                children: [
                  { id: 'dir-activites-fiche-infos', label: 'Détail' },
                  { id: 'dir-activites-fiche-horaires', label: 'Horaires' },
                ],
              },
              { id: 'dir-tourisme-plan', label: 'Plan touristique' },
            ],
          },
          {
            id: 'page-meteo',
            label: 'Météo',
            children: [
              {
                id: 'meteo-maintenant',
                label: 'Maintenant',
                children: [
                  { label: 'Conditions actuelles détaillées' },
                ],
              },
              {
                id: 'meteo-aujourdhui',
                label: 'Aujourd’hui',
                children: [
                  { label: 'Prévisions horaires + filtres de période' },
                ],
              },
              {
                id: 'meteo-demain',
                label: 'Demain',
                children: [
                  { label: 'Prévisions horaires + filtres de période' },
                ],
              },
              {
                id: 'meteo-7jours',
                label: '7 jours',
                children: [
                  { id: 'meteo-jour', label: 'Jour choisi' },
                ],
              },
            ],
          },
          { id: 'urgence-numeros', label: 'N° Urgence' },
          {
            id: 'messages',
            label: 'Messages',
            children: [
              { id: 'messages-maville', label: 'Ma Ville' },
              { id: 'messages-nouvelle', label: 'Nouvelle conversation' },
              { id: 'messages-thread', label: 'Conversation' },
              { id: 'messages-attach', label: 'Ajouter pièce' },
              { id: 'messages-react', label: 'Réagir' },
            ],
          },
          { id: 'enregistrements', label: 'Enregistrements' },
          {
            id: 'menu-plus',
            label: 'Menu',
            children: [
              {
                id: 'etats-hub',
                label: 'États UI',
                children: [
                  { id: 'etat-vide', label: 'Vide' },
                  { id: 'etat-chargement', label: 'Chargement' },
                  { id: 'etat-erreur', label: 'Erreur' },
                  { id: 'etat-horaires-manquants', label: 'Horaires manquants' },
                ],
              },
              { id: 'a-preciser', label: 'À préciser' },
            ],
          },
          { id: 'vie-locale-hub', label: 'Vie locale (hub)' },
        ],
      },
    ],
  },
  admin: {
    tab: 'Administrateur',
    roots: [
      {
        id: 'admin-home',
        label: 'Tableau de bord',
        children: [
          {
            id: 'admin-mairie',
            label: 'Ma mairie',
            children: [
              { id: 'admin-mairie-page', label: 'Gérer la page' },
              { id: 'admin-mairie-pub-form', label: 'Formulaire publication' },
              { id: 'signalements', label: 'Signalements reçus' },
            ],
          },
          {
            id: 'admin-evenements',
            label: 'Événements',
            children: [
              { id: 'admin-evenement-form', label: 'Créer / modifier' },
              { id: 'evenements-a-valider', label: 'À valider' },
            ],
          },
          {
            id: 'admin-annonces',
            label: 'Annonces',
            children: [{ id: 'admin-annonce-form', label: 'Formulaire' }],
          },
          {
            id: 'admin-offres',
            label: 'Offres',
            children: [
              { id: 'admin-offre-form', label: 'Formulaire' },
              { id: 'emploi-preview', label: 'Prévisualisation' },
            ],
          },
          {
            id: 'admin-annuaires',
            label: 'Annuaires',
            children: [
              {
                id: 'admin-annuaire-sante',
                label: 'Santé',
                children: [
                  {
                    id: 'admin-annuaire-pharmacies',
                    label: 'Pharmacies',
                    children: [{ id: 'admin-fiche-form', label: 'Fiche formulaire' }],
                  },
                ],
              },
              { id: 'admin-annuaire-rubrique', label: 'Autres rubriques (admin)' },
            ],
          },
          { id: 'admin-rdv', label: 'Rendez-vous' },
          { id: 'admin-moderation', label: 'Modération' },
          { id: 'admin-equipe', label: 'Équipe et permissions' },
          { id: 'admin-stats', label: 'Statistiques' },
        ],
      },
    ],
  },
}

/** Flat list of screen ids per side (for tab auto-select). */
export function navIdsForSide(side) {
  const ids = []
  const walk = (nodes) => {
    for (const n of nodes || []) {
      if (n.id) ids.push(n.id)
      if (n.children) walk(n.children)
    }
  }
  walk(NAV_TREE[side]?.roots)
  return ids
}

