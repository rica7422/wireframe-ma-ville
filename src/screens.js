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
  modalShell,
  evenementsListeBody,
  tbd,
  emptyState,
  loadingState,
  errorState,
} from './components.js'
import { colorFor } from './theme.js'

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
      header: phoneHeader({ title: 'Accueil', showCity: true }),
      footer: phoneFooter('accueil'),
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
      header: phoneHeader({ title: 'Confirmer', showCity: true }),
      footer: phoneFooter('accueil'),
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
    { label: 'Signalement', go: 'page-signalement', section: 'signalement' },
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
        <h1>Kapan</h1>
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
      header: phoneHeader({ showCity: true, city: 'Kapan' }),
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
      },
      {
        title: 'Pharmacie centrale',
        meta: 'Pharmacies · 1,2 km',
        badge: 'Ouvert',
        go: 'sante-pharmacie-infos',
      },
      {
        title: 'SAMU Kapan',
        meta: 'Ambulance · …',
        badge: 'Disponible',
        go: 'sante-ambulances',
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
  return wrap(
    `
    ${search('Rechercher une pharmacie…')}
    ${chips(['Toutes', 'Ouvertes', 'En garde', 'À proximité'])}
    ${listCard({
      title: 'Pharmacie centrale',
      meta: 'Rue Principale · 1,2 km',
      badge: 'En garde 24h/24',
      actions: [
        { label: 'Détails', go: 'sante-pharmacie-infos', primary: true },
        { label: 'Appeler', sim: 'appeler' },
      ],
    })}
    ${listCard({
      title: 'Pharmacie du Parc',
      meta: 'Avenue Verte · 2,1 km',
      badge: 'Ouvert',
      actions: [
        { label: 'Détails', go: 'sante-pharmacie-infos', primary: true },
        { label: 'Appeler', sim: 'appeler' },
      ],
    })}
    `,
    {
      header: phoneHeader({ title: 'Pharmacies', backTo: 'sante-accueil' }),
      footer: phoneFooter('menu'),
    }
  )
}

function pharmacieDetails(tab = 'infos') {
  const tabs = `
    <div class="tabs">
      <button class="hit tab ${tab === 'infos' ? 'on' : ''}" data-go="sante-pharmacie-infos">Informations</button>
      <button class="hit tab ${tab === 'horaires' ? 'on' : ''}" data-go="sante-pharmacie-horaires">Horaires</button>
    </div>`
  const infos = `
    <h2 class="sec">Contact</h2>
    <p class="meta">Tél. · Adresse · Site web</p>
    ${text('Coordonnées…')}
    <h2 class="sec">Adresse</h2>
    ${text('Adresse complète…')}
    ${photo('Carte (emplacement)…', 'map')}
    <h2 class="sec">À propos</h2>
    ${text('Description…')}
  `
  const horaires = `
    <h2 class="sec">Horaires</h2>
    ${['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']
      .map(
        (d) => `
      <div class="row-link static">
        <span>${d}</span>
        <span class="meta">${d === 'Dimanche' ? 'Fermé / À préciser' : '08:00 – 20:00'}</span>
      </div>`
      )
      .join('')}
    ${tbd('Horaires manquants éventuels — À préciser')}
  `
  return wrap(
    `
    ${photo('Photo façade…', 'hero')}
    <div class="detail-head">
      <strong>Pharmacie centrale</strong>
      <span class="badge">Ouvert 24h/24</span>
      <p class="meta">Pharmacie · 1,2 km</p>
    </div>
    <div class="row-actions">
      <button class="hit btn" data-sim="itineraire">Itinéraire</button>
      <button class="hit btn primary" data-sim="appeler">Appeler</button>
    </div>
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
  return wrap(
    `
    ${search('Rechercher un hôpital…')}
    ${chips(['Toutes', 'Ouvertes', 'Urgences', 'À proximité'])}
    ${listCard({
      title: 'Grand Hôpital de Kapan',
      meta: 'Urgences · 1,5 km',
      badge: 'Ouvert',
      actions: [
        { label: 'Détails', go: 'sante-hopital-details', primary: true },
        { label: 'Appeler', sim: 'appeler' },
      ],
    })}
    ${listCard({
      title: 'Urgence 24 — Hôpital',
      meta: 'Urgences · 2,0 km',
      badge: '24h/24',
      actions: [
        { label: 'Détails', go: 'sante-hopital-details', primary: true },
        { label: 'Appeler', sim: 'appeler' },
      ],
    })}
    `,
    {
      header: phoneHeader({ title: 'Hôpitaux', backTo: 'sante-accueil' }),
      footer: phoneFooter('menu'),
    }
  )
}

function santeHopitalDetails(tab = 'infos') {
  const tabs = `
    <div class="tabs">
      <button class="hit tab ${tab === 'infos' ? 'on' : ''}" data-go="sante-hopital-details">Informations</button>
      <button class="hit tab ${tab === 'horaires' ? 'on' : ''}" data-go="sante-hopital-horaires">Horaires</button>
    </div>`
  const infos = `
    <h2 class="sec">Contact</h2>
    ${text('Coordonnées…')}
    <h2 class="sec">Adresse</h2>
    ${photo('Carte…', 'map')}
    <h2 class="sec">À propos</h2>
    ${text('Description…')}
  `
  const horaires = `
    <h2 class="sec">Horaires</h2>
    ${['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']
      .map(
        (d) => `
      <div class="row-link static">
        <span>${d}</span>
        <span class="meta">${d === 'Dimanche' ? 'À préciser' : 'Ouvert…'}</span>
      </div>`
      )
      .join('')}
    ${tbd('Horaires manquants éventuels — À préciser')}
    <button class="hit btn block" data-go="etat-horaires-manquants">Voir état « horaires manquants »</button>
  `
  return wrap(
    `
    ${photo('Photo hôpital…', 'hero')}
    <div class="detail-head">
      <strong>Grand Hôpital de Kapan</strong>
      <span class="badge">Ouvert</span>
      <p class="meta">Hôpital · 1,5 km</p>
    </div>
    <div class="row-actions">
      <button class="hit btn" data-sim="itineraire">Itinéraire</button>
      <button class="hit btn primary" data-sim="appeler">Appeler</button>
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

function mairieShellTop() {
  return `
    ${photo('Photo de la mairie…', 'hero')}
    <div class="overlay-badges"><span class="badge">☀ 14° / 4°</span></div>
    <div class="detail-head">
      <strong>Kapan · Arménie</strong>
      ${text('Présentation courte de la mairie…')}
    </div>
    <div class="members-row">
      <button class="hit members-hit" data-go="mairie-communaute" type="button">
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

function mairieHeader(title = 'Ma mairie', backTo = 'accueil-kapan') {
  /* Exactly 3 icons: Retour · Accueil Ma Ville · MIASIN (no ⋯ in header) */
  return phoneHeader({ title, backTo })
}

function mairieAccueil() {
  return wrap(
    `
    ${mairieShellTop()}
    ${search('Effectuer une recherche…')}
    ${mairieAccesGrid()}
    ${mairieTabs('publications')}
    ${postCard({
      author: 'Mairie de Kapan',
      role: 'Publication',
      body: 'Informations et actualités de votre mairie.',
      optionsGo: 'mairie-presentation-options',
    })}
    ${postCard({
      author: 'Mairie de Kapan',
      role: 'Publication',
      body: 'Rappel — démarches en mairie et horaires d’accueil.',
      multi: true,
      optionsGo: 'mairie-presentation-options',
    })}
    <button class="hit btn block" data-go="mairie-nouvelle-publication">+ Nouvelle publication</button>
    <button class="hit row-link" data-go="mairie-menu"><span>Menu Ma mairie</span><span>›</span></button>
    <button class="hit btn primary block" data-go="mairie-rdv">Prendre rendez-vous</button>
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
    ${search('Effectuer une recherche…')}
    ${mairieAccesGrid()}
    ${mairieTabs('evenements')}
    ${evenementsListeBody({ detailsGo: 'evenement-details' })}
    <button class="hit btn primary block" data-go="mairie-rdv">Prendre rendez-vous</button>
    `,
    {
      header: mairieHeader(),
      footer: phoneFooter('mairie'),
    }
  )
}

function mairieMenu() {
  return wrap(`${photo('Fond Ma mairie…', 'dim')}`, {
    header: mairieHeader(),
    footer: phoneFooter('mairie'),
    overlay: modalShell(
      'Menu de Ma Mairie',
      `
      ${sheetOption('Partager Ma Mairie', { sim: 'partage' })}
      ${sheetOption('Notification de Ma Mairie', { toggle: true, on: true })}
      ${sheetOption('Discussions', { go: 'messages' })}
      ${sheetOption('Quitter Ma Mairie', { sim: 'quitter' })}
      `
    ),
  })
}

const MAIRIE_MOTIFS = [
  'État civil',
  'Carte d’identité / Passeport',
  'Mariage',
  'Urbanisme / permis',
  'Logement',
  'Scolarité',
  'Audience avec le maire',
  'Cérémonie / salle',
  'Démarches sociales',
  'Autre',
]

/** Wireframe: always show one fictional RDV en cours (Annuler hides the block) */
const MAIRIE_RDV_EN_COURS = {
  motif: 'Carte d’identité / Passeport',
  when: '12 juin 2026 · 10:00',
}

function mairieRdvEnCoursBlock(rdv) {
  if (!rdv) return ''
  return `
    <section class="rdv-section">
      <h2 class="sec">Rendez-vous en cours</h2>
      <article class="card rdv-en-cours">
        <p class="meta">${rdv.when}</p>
        <p><strong>Motif</strong> · ${rdv.motif}</p>
        <button class="hit btn block" data-sim="rdv-annuler">Annuler le rendez-vous</button>
      </article>
    </section>
  `
}

function mairieRdvDateSlots() {
  return `
    <h2 class="sec">Choisir une date</h2>
    <p class="meta">Mai 2026</p>
    <div class="calendar">
      ${Array.from({ length: 31 }, (_, i) => {
        const d = i + 1
        const cls = d === 27 ? 'on' : d % 7 === 0 ? 'closed' : ''
        return `<button class="hit cal-day ${cls}" type="button">${d}</button>`
      }).join('')}
    </div>
    <h2 class="sec">Créneaux disponibles — 27 mai</h2>
    <p class="meta">MATINÉE</p>
    <div class="chips">
      ${['09:00', '09:30', '10:00', '11:00']
        .map((t, i) => `<button class="hit chip ${i === 1 ? 'on' : ''}" type="button">${t}</button>`)
        .join('')}
    </div>
    <p class="meta">APRÈS-MIDI</p>
    <div class="chips">
      ${['14:00', '14:30', '15:00', '16:00']
        .map((t) => `<button class="hit chip" type="button">${t}</button>`)
        .join('')}
    </div>
    <button class="hit btn primary block" data-go="mairie-rdv-suite">Continuer</button>
  `
}

function mairieRdv() {
  const selected = 'Carte d’identité / Passeport'
  return wrap(
    `
    ${mairieRdvEnCoursBlock(MAIRIE_RDV_EN_COURS)}
    <hr class="section-sep" aria-hidden="true" />
    <section class="rdv-section">
      <h2 class="sec">Nouveau rendez-vous</h2>
      <label class="field motif-field">
        <span>Motif de rendez-vous</span>
        <div class="motif-select" data-motif-select>
          <button class="hit motif-trigger" type="button" data-motif-toggle aria-expanded="false">
            <span class="motif-value">${selected}</span>
            <span class="motif-chev" aria-hidden="true">▼</span>
          </button>
          <div class="motif-dropdown" hidden>
            ${MAIRIE_MOTIFS.map(
              (m) => `
            <button class="hit motif-option ${m === selected ? 'on' : ''}" type="button" data-motif-pick="${m}">
              ${m}
            </button>`
            ).join('')}
          </div>
        </div>
      </label>
      <p class="meta">Un seul motif par rendez-vous</p>
      ${mairieRdvDateSlots()}
    </section>
    `,
    {
      header: phoneHeader({ title: 'Prendre rendez-vous', backTo: 'mairie-accueil', showCity: true }),
      footer: phoneFooter('mairie'),
    }
  )
}

function mairieRdvCreneau() {
  // Date & créneaux live on the RDV screen (below motif dropdown)
  return mairieRdv()
}

function mairieRdvSuite() {
  return wrap(
    `
    <h2 class="sec">Confirmation RDV</h2>
    <article class="card">
      <strong>Récapitulatif</strong>
      <p><strong>Motif</strong> · Carte d’identité / Passeport</p>
      <p><strong>Date</strong> · 27 mai 2026</p>
      <p><strong>Créneau</strong> · 09:30</p>
      <p class="meta">Un motif par rendez-vous · valeurs illustratives</p>
    </article>
    <div class="row-actions">
      <button class="hit btn" data-go="mairie-rdv">Retour</button>
      <button class="hit btn primary" data-sim="rdv">Confirmer (simulé)</button>
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
      optionsGo: 'mairie-presentation-options',
    })}
    ${publicationCard({
      title: 'Kapan, entre ville et nature',
      body: 'Texte…',
      multi: true,
      optionsGo: 'mairie-presentation-options',
    })}
    `,
    {
      header: phoneHeader({ title: 'Présentation de la ville', backTo: 'mairie-accueil' }),
      footer: phoneFooter('mairie'),
    }
  )
}

function mairiePresentationOptions() {
  return wrap(`${photo('Fond présentation…', 'dim')}`, {
    header: phoneHeader({ title: 'Présentation de la ville', backTo: 'mairie-presentation' }),
    footer: phoneFooter('mairie'),
    overlay: modalShell(
      'Plus d’options',
      `
      ${sheetOption('Afficher la liste des réactions', { go: 'infos-reactions' })}
      ${sheetOption('Modifier la publication', { go: 'mairie-nouvelle-publication' })}
      ${sheetOption('Partager la publication', { go: 'infos-partage' })}
      ${sheetOption('Supprimer la publication', { sim: 'supprimer' })}
      `
    ),
  })
}

function mairieNouvellePublication() {
  return wrap(
    `
    <div class="compose-area">
      ${text('Dire quelque chose…')}
    </div>
    <h2 class="sec">Médias ajoutés</h2>
    <div class="photo-grid media-added">
      ${photo('Photo…')}${photo('Photo…')}${photo('Photo…')}${photo('Photo…')}
    </div>
    <div class="row-link static">
      <span>Activer les commentaires</span>
      <span class="toggle on" aria-hidden="true"></span>
    </div>
    <h2 class="sec">Ajouter à la publication</h2>
    <button class="hit media-add-btn" data-go="mairie-medias-sheet">
      <span class="ico-box round"></span>
      <span>Médias</span>
    </button>
    <button class="hit btn primary block" data-sim="publier">Publier (simulé)</button>
    `,
    {
      header: phoneHeader({ title: 'Nouvelle publication', backTo: 'mairie-accueil' }),
      footer: phoneFooter('mairie'),
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
      header: phoneHeader({ title: 'Nouvelle publication', backTo: 'mairie-nouvelle-publication' }),
      footer: phoneFooter('mairie'),
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
      header: phoneHeader({ title: 'Maire & Conseil municipal', backTo: 'mairie-conseil' }),
      footer: phoneFooter('mairie'),
    }
  )
}

function mairieInfos() {
  const items = [
    { title: 'Construction et réhabilitation de routes', cat: 'Transports', excerpt: 'Extrait de l’info mairie…' },
    {
      title: 'L’éducation, une priorité pour la ville de Kapan',
      cat: 'Éducation',
      excerpt: 'Extrait de l’info mairie…',
    },
    { title: 'Dynamiser l’économie locale de Kapan', cat: 'Économie', excerpt: 'Extrait de l’info mairie…' },
  ]
  return wrap(
    `
    <div class="chips filter-chips">
      <button class="hit chip on" type="button">À la une</button>
      <button class="hit chip" type="button">Administration municipale</button>
      <button class="hit chip" type="button">Culture</button>
    </div>
    ${items.map((it) => infoFeedCard(it)).join('')}
    `,
    {
      header: phoneHeader({ title: 'Infos Mairie', backTo: 'mairie-accueil' }),
      footer: phoneFooter('mairie'),
    }
  )
}

function mairieInfosDetail() {
  return wrap(
    `
    ${photo('Photo info mairie…', 'wide')}
    <div class="pub-title-row">
      <strong>Construction et réhabilitation de routes</strong>
      <button class="hit icon-btn" data-go="mairie-infos-apropos" title="À propos">⋯</button>
    </div>
    <p class="meta accent-text">Admin Kapan · <span class="badge">Transports</span></p>
    ${text('Corps complet de l’information mairie…')}
    ${socialActions()}
    `,
    {
      header: phoneHeader({ title: 'Infos Mairie', backTo: 'mairie-infos' }),
      footer: phoneFooter('mairie'),
    }
  )
}

function mairieInfosApropos() {
  return wrap(`${photo('Fond info…', 'dim')}`, {
    header: phoneHeader({ title: 'Infos Mairie', backTo: 'mairie-infos-detail' }),
    footer: phoneFooter('mairie'),
    overlay: modalShell(
      'À propos',
      `
      ${sheetOption('Afficher la liste des réactions', { go: 'infos-reactions' })}
      ${sheetOption('Partager la publication', { go: 'infos-partage' })}
      `
    ),
  })
}

function mairieCommunaute() {
  return wrap(
    `
    ${mairieShellTop()}
    <button class="hit row-link" type="button"><span>Membres</span><span class="meta">426K ›</span></button>
    <button class="hit row-link" type="button"><span>Galeries</span><span class="meta">85 ›</span></button>
    <h2 class="sec">Règles de la Communauté</h2>
    <article class="card">
      <strong>Pas de harcèlement</strong>
      ${text('Règle — texte…')}
    </article>
    <article class="card">
      <strong>Soyez aimable</strong>
      ${text('Règle — texte…')}
    </article>
    <h2 class="sec">Publications</h2>
    <p class="meta">Seuls les administrateurs peuvent publier dans ce club.</p>
    <h2 class="sec">Historique</h2>
    <article class="card">
      <p><strong>Créé le</strong> · 18 avril 2024</p>
      <p><strong>Dernière modification</strong> · 30 mai 2024</p>
    </article>
    <h2 class="sec">Administrateurs & Modérateurs</h2>
    ${['Lilit Ameni · Administrateur', 'Rouben Sirunyan · Modérateur', 'Yester Sullivan · Administrateur']
      .map(
        (n) => `
      <div class="row-link static">
        <span class="avatar"></span>
        <span>${n}</span>
      </div>`
      )
      .join('')}
    `,
    {
      header: phoneHeader({ title: 'Ma mairie', backTo: 'mairie-accueil' }),
      footer: phoneFooter('mairie'),
    }
  )
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
      header: mairieHeader('Ma mairie', 'mairie-accueil'),
      footer: phoneFooter('mairie'),
    }
  )
}

function mairiePlanMenu() {
  return wrap(`${photo('Fond carte…', 'dim')}`, {
    header: phoneHeader({ title: 'Plan de la ville', backTo: 'mairie-plan' }),
    footer: phoneFooter('mairie'),
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

    ${feedPostCard({
      author: 'Arman Petrosyan',
      role: 'Mairie',
      time: 'il y a 2 h',
      body: 'Collecte des déchets verts renforcée ce week-end dans les quartiers sud et centre. Merci de sortir vos bacs avant 7 h.',
      media: 'none',
      identified: 0,
      likes: '128',
      comments: '18',
      shares: '12',
      optionsGo: 'infos-post-options',
    })}

    ${feedPostCard({
      author: 'Liana Avetisyan',
      role: 'Délégué',
      time: 'il y a 5 h',
      body: 'Marché du samedi — producteurs locaux sur la place centrale dès 8 h. Venez nombreux !',
      media: 'photo',
      identified: 5,
      likes: '86',
      comments: '24',
      shares: '9',
      optionsGo: 'infos-post-options-other',
    })}

    ${feedPostCard({
      author: 'Hovhannes Mkrtchyan',
      role: 'Membre',
      time: 'il y a 1 j',
      body: 'Retour en images du festival de musique au parc municipal.',
      media: 'multi',
      identified: 12,
      likes: '210',
      comments: '41',
      shares: '33',
      optionsGo: 'infos-post-options-other',
    })}

    ${feedPostCard({
      author: 'Mairie de Kapan',
      role: 'Mairie',
      time: 'il y a 2 j',
      body: 'Replay du conseil municipal du 24 septembre — points budgétaires et travaux voirie.',
      media: 'video',
      identified: 3,
      likes: '64',
      comments: '11',
      shares: '27',
      optionsGo: 'infos-post-options',
    })}
    `,
    {
      header: phoneHeader({ title: 'Infos Feed', backTo: 'accueil-kapan' }),
      footer: phoneFooter('infos'),
    }
  )
}

function infosPostOptions(own = true) {
  return wrap(`${photo('Fond feed…', 'dim')}`, {
    header: phoneHeader({ title: 'Infos Feed', backTo: 'infos-feed' }),
    footer: phoneFooter('infos'),
    overlay: modalShell(
      'Options de la publication',
      own
        ? `
        ${sheetOption('Modifier', { sim: 'modifier' })}
        ${sheetOption('Supprimer', { sim: 'supprimer' })}
        `
        : `
        ${sheetOption('Signaler', { sim: 'signaler' })}
        ${sheetOption('Masquer la publication', { sim: 'masquer' })}
        `
    ),
  })
}

function infosReactions() {
  const people = [
    { name: 'Anahit Mkrtchyan', role: 'Membre', react: '♥', follow: false },
    { name: 'Armen Sargsyan', role: 'Mairie de Kapan', react: '♥', follow: true },
    { name: 'Hasmik Gevorgyan', role: 'Délégué', react: '👍', follow: false },
    { name: 'Gurgen Khachatryan', role: 'Membre', react: '♥', follow: false },
    { name: 'Syuzanna Vardanyan', role: 'Membre', react: '👍', follow: true },
  ]
  return wrap(
    `
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
      header: phoneHeader({ title: 'Réactions', backTo: 'infos-feed' }),
      footer: phoneFooter('infos'),
    }
  )
}

function infosAjouterAmi() {
  return wrap(`${photo('Fond réactions…', 'dim')}`, {
    header: phoneHeader({ title: 'Réactions', backTo: 'infos-reactions' }),
    footer: phoneFooter('infos'),
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
  return wrap(
    `
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
      header: phoneHeader({ title: 'Commentaires', backTo: 'infos-feed' }),
      footer: phoneFooter('infos'),
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
    header: phoneHeader({ title: 'Infos Feed', backTo: 'infos-feed' }),
    footer: phoneFooter('infos'),
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

function evenementsListe() {
  return wrap(
    `
    ${evenementsListeBody()}
    `,
    {
      header: phoneHeader({ title: 'Événements', backTo: 'accueil-kapan' }),
      footer: phoneFooter('menu'),
    }
  )
}

function evenementDetails() {
  return wrap(
    `
    <div class="event-detail">
      <div class="event-photo-wrap">
        ${photo('Photo événement…', 'hero')}
        <span class="badge event-places">Places limitées</span>
      </div>
      <div class="event-detail-head">
        <strong class="block-title">Atelier créatif</strong>
        <p class="meta event-lieu">📍 Centre culturel · Kapan</p>
      </div>
      <div class="meta-grid meta-grid-4">
        <div class="meta-cell"><span class="meta">Date</span><strong>Ven. 16 juin 2026</strong></div>
        <div class="meta-cell"><span class="meta">Heure</span><strong>15:30</strong></div>
        <div class="meta-cell"><span class="meta">Catégorie</span><strong>Artistique</strong></div>
        <div class="meta-cell"><span class="meta">Prix</span><strong>20 €</strong></div>
      </div>
      ${text('Description de l’atelier créatif…')}
      <div class="stats-row">
        <span class="stat-cell"><strong>12</strong><span class="meta">Participants</span></span>
        <span class="stat-cell"><strong>10</strong><span class="meta">Billets restants</span></span>
        <span class="stat-cell"><strong>5</strong><span class="meta">Jours restants</span></span>
      </div>
      <p class="meta places-note">Nombre de places · 20</p>
      <button class="hit btn primary block" data-sim="participation">Participer</button>
      ${socialActions()}
      <h2 class="sec">Hobbies concernés</h2>
      <div class="h-scroll hobbies">
        ${['Beatboxing', 'Chant', 'Saxophone', 'Violon', 'Piano']
          .map(
            (h) => `
          <div class="hobby-chip"><span class="avatar"></span><span class="meta">${h}</span></div>`
          )
          .join('')}
      </div>
      <button class="hit row-link" data-go="messages"><span>Centre de Messagerie</span><span>›</span></button>
      <h2 class="sec">Organisateurs</h2>
      ${['Lilit Ameni · Administrateur', 'Rouben Sirunyan · Créateur', 'Aris Margaryan · Organisateur']
        .map(
          (n) => `
        <div class="row-link static orga-row">
          <span class="avatar"></span>
          <span class="grow truncate">${n}</span>
          <button class="hit icon-btn" data-sim="message" title="Message">💬</button>
          <button class="hit icon-btn" data-sim="appeler" title="Appeler">☎</button>
        </div>`
        )
        .join('')}
      <h2 class="sec">Plus d’informations</h2>
      <button class="hit row-link" data-go="evenement-participants">
        <span>Participants · 12</span><span>›</span>
      </button>
      <button class="hit row-link" type="button"><span>Validations des participants · 2</span><span>›</span></button>
      <button class="hit row-link" type="button"><span>Critères de participation</span><span>›</span></button>
      <button class="hit row-link" type="button"><span>Conditions de participation</span><span>›</span></button>
    </div>
    `,
    {
      header: phoneHeader({ title: 'Détails', backTo: 'evenements-liste' }),
      footer: phoneFooter('menu'),
    }
  )
}

function evenementParticipants() {
  return wrap(
    `
    <div class="banner-box">
      <span class="badge">Artistique / Créatif</span>
      <strong>Atelier Créatif de Kapan</strong>
      <p class="meta">JUN 26 · 16:30–18:30</p>
    </div>
    <h2 class="sec">Participants <span class="badge">11 inscrits</span></h2>
    ${search('Rechercher un membre…')}
    ${['Marie Dupont', 'Anahit S.', 'Rupen D.', 'Karen A.']
      .map(
        (n, i) => `
      <div class="row-link static">
        <span class="avatar"></span>
        <span><strong>${n}</strong><br/><span class="meta">Actif(ve) il y a 1h</span>
        ${i === 0 ? '<span class="badge">Nouveau</span>' : ''}</span>
        <button class="hit icon-btn" data-sim="message">💬</button>
      </div>`
      )
      .join('')}
    <button class="hit btn primary block" data-sim="message-groupe">Envoyer un message groupé</button>
    `,
    {
      header: phoneHeader({ title: 'Liste des participants', backTo: 'evenement-details' }),
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
    <div class="h-scroll thumbs">${photo('1')}${photo('2')}${photo('3')}${photo('4')}</div>
    <strong class="block-title">Appartement lumineux — 3 pièces</strong>
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
    <h2 class="sec">Annonces similaires</h2>
    <div class="h-scroll">${photo('Photo…')}${photo('Photo…')}${photo('Photo…')}</div>
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
      header: phoneHeader({ title: 'Petites annonces', backTo: 'annonces-liste' }),
      footer: phoneFooter('menu'),
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

function emploisListe() {
  return wrap(
    `
    ${search('Rechercher une offre…')}
    ${chips(['Toutes', 'CDI', 'CDD', 'Stage', 'À préciser'])}
    ${[
      ['Chargé(e) de communication', 'Mairie de Kapan'],
      ['Infirmier(ère)', 'Hôpital de Kapan'],
    ]
      .map(
        ([title, org]) => `
      <article class="card">
        <strong>${title}</strong>
        <p class="meta">${org} · Kapan · Publié récemment</p>
        ${tbd('Salaire / type — À préciser si non fourni')}
        <button class="hit btn primary" data-go="emploi-details">Voir les détails</button>
      </article>`
      )
      .join('')}
    `,
    {
      header: phoneHeader({ title: 'Offres d’emploi', backTo: 'accueil-kapan' }),
      footer: phoneFooter('menu'),
    }
  )
}

function emploiDetails() {
  return wrap(
    `
    <strong class="block-title">Chargé(e) de communication</strong>
    <p class="meta">Mairie de Kapan · Kapan</p>
    <span class="badge">CDI</span>
    <h2 class="sec">Description</h2>
    ${text('Texte de l’offre…')}
    <h2 class="sec">Profil recherché</h2>
    ${text('Critères…')}
    ${tbd('Candidature en ligne — À préciser')}
    <button class="hit btn primary block" data-sim="message">Envoyer un message (simulé)</button>
    <button class="hit btn block" data-sim="appeler">Appeler (simulé)</button>
    `,
    {
      header: phoneHeader({ title: 'Détail offre', backTo: 'emplois-liste' }),
      footer: phoneFooter('menu'),
    }
  )
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
  const isMiasin = tab === 'miasin'
  const list = isMiasin
    ? ['Conversation MIASIN', 'Support plateforme', 'Contact global']
    : ['Conversation mairie', 'Groupe événement', 'Annonce — message']
  return wrap(
    `
    <div class="tabs">
      <button class="hit tab ${isMiasin ? 'on' : ''}" data-go="messages">MIASIN</button>
      <button class="hit tab ${!isMiasin ? 'on' : ''}" data-go="messages-maville">Ma Ville</button>
    </div>
    ${search('Rechercher une conversation…')}
    ${list
      .map(
        (t) => `
      <button class="hit row-link" data-go="messages-thread">
        <span class="avatar"></span>
        <span><strong>${t}</strong><br/><span class="meta">Dernier message…</span></span>
        <span class="meta">12:04</span>
      </button>`
      )
      .join('')}
    ${emptyState('État vide possible si aucune conversation')}
    ${tbd('Emplacement définitif Messages — À préciser (footer provisoire)')}
    `,
    {
      header: phoneHeader({ title: 'Messages', backTo: 'accueil-kapan' }),
      footer: phoneFooter('messages'),
    }
  )
}

function messagesThread() {
  return wrap(
    `
    <div class="chat">
      <div class="bubble in">${text('Message reçu…')}</div>
      <div class="bubble out">${text('Message envoyé…')}</div>
      <div class="bubble in">${text('…')}</div>
    </div>
    <div class="composer-bar">
      <input type="text" placeholder="Écrire un message…" />
      <button class="hit btn primary" data-sim="message">Envoyer</button>
    </div>
    `,
    {
      header: phoneHeader({ title: 'Conversation', backTo: 'messages' }),
      footer: phoneFooter('messages'),
    }
  )
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
      title: 'Lieu enregistré…',
      meta: 'Annuaire · …',
      badge: 'Sauvé',
      actions: [{ label: 'Ouvrir', go: 'dir-fiche', primary: true }],
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
    }))
  const defaultActions = (item) =>
    aroundActions
      ? aroundActions(item)
      : [
          { label: 'Détails', go: item.ficheGo || 'dir-fiche', primary: true },
          { label: 'Appeler', sim: 'appeler' },
        ]

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

/** Sous-page: no banner, no cat blocks — search, filters, cards → fiche */
function rubriqueListe(title, parentId, { ficheGo = 'dir-fiche', filters = null, proposition = false, cardActions = null } = {}) {
  const actions = (go) =>
    cardActions
      ? cardActions(go)
      : [
          { label: 'Détails', go, primary: true },
          { label: 'Appeler', sim: 'appeler' },
        ]
  return wrap(
    `
    ${proposition ? tbd('Sous-page proposition — À valider') : ''}
    ${search(`Rechercher dans ${title}…`)}
    ${chips(filters || ['Tous', 'Ouverts', 'À proximité', 'Enregistrés'])}
    ${listCard({
      title: `${title} — fiche A…`,
      meta: 'Adresse · distance…',
      badge: '…',
      actions: actions(ficheGo),
    })}
    ${listCard({
      title: `${title} — fiche B…`,
      meta: 'Adresse · …',
      badge: '…',
      actions: actions(ficheGo),
    })}
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
    ['Signalement', 'page-signalement'],
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
function dirFiche(tab = 'infos', { title = 'Fiche détail…', category = 'Catégorie', noHours = false, backTo = 'vie-locale-hub', idInfos = 'dir-fiche', idHoraires = 'dir-fiche-horaires' } = {}) {
  const statusBox = noHours
    ? `<div class="notice"><strong>Pas d’horaire d’ouverture</strong>${text('À vérifier sur place')}</div>`
    : `<div class="notice"><strong>Ouvert</strong>${text('Aujourd’hui : horaires…')}</div>`

  const horairesBody = noHours
    ? `<h2 class="sec">Horaires d’ouverture</h2>
       <div class="notice"><strong>Pas d’horaire d’ouverture exact</strong>${text('À vérifier sur place')}</div>`
    : `<h2 class="sec">Horaires d’ouverture</h2>
       ${['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']
         .map(
           (d) => `
         <div class="row-link static">
           <span>${d}</span>
           <span class="meta">${d === 'Dimanche' ? 'Fermé' : '08:00 – …'}</span>
         </div>`
         )
         .join('')}`

  return wrap(
    `
    ${photo('Photo…', 'hero')}
    <div class="detail-head">
      <strong>${title}</strong>
      ${noHours ? '' : '<span class="badge">Ouvert</span>'}
      <p class="meta">${category} · distance…</p>
    </div>
    ${statusBox}
    <div class="row-actions">
      <button class="hit btn" data-sim="itineraire">Itinéraire</button>
      <button class="hit btn primary" data-sim="appeler">Appeler</button>
    </div>
    <div class="tabs">
      <button class="hit tab ${tab === 'infos' ? 'on' : ''}" data-go="${idInfos}">Informations</button>
      <button class="hit tab ${tab === 'horaires' ? 'on' : ''}" data-go="${idHoraires}">Horaires</button>
    </div>
    ${
      tab === 'infos'
        ? `${text('Contact / adresse / à propos…')}${photo('Carte…', 'map')}`
        : horairesBody
    }
    `,
    {
      header: phoneHeader({ title: 'Détails', backTo }),
      footer: phoneFooter('menu'),
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

function pageSignalement() {
  return rubriqueAccueil({
    title: 'Signalement',
    bannerTitle: 'Signalement',
    bannerText: 'Annuaire de services / contacts (pas un formulaire de ticket)',
    searchPh: 'Rechercher un service…',
    filters: ['Tous', 'Ouverts', 'À proximité', 'Enregistrés'],
    proposition: true,
    cats: [
      { label: 'Voirie', go: 'dir-signalement-voirie', ficheGo: 'dir-signalement-voirie-fiche-infos' },
      { label: 'Éclairage', go: 'dir-signalement-eclairage', ficheGo: 'dir-signalement-eclairage-fiche-infos' },
      { label: 'Propreté', go: 'dir-signalement-proprete', ficheGo: 'dir-signalement-proprete-fiche-infos' },
      { label: 'Équipements', go: 'dir-signalement-equipements', ficheGo: 'dir-signalement-equipements-fiche-infos' },
    ],
  })
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
    ${tbd('Horaires non renseignés — À préciser')}
    ${emptyState('Aucun horaire disponible pour cet établissement')}
    <button class="hit btn block" data-back>Retour</button>
    `,
    {
      header: phoneHeader({ title: 'Horaires manquants', backTo: 'etats-hub' }),
      footer: phoneFooter('menu'),
    }
  )
}

function communautesStub(title) {
  return wrap(
    `
    <h2 class="sec">${title}</h2>
    ${tbd('Fil de publications / détail — structure minimale')}
    <div class="compose">
      <span class="avatar"></span>
      <button class="hit compose-input" data-sim="publier">Commencer une publication</button>
    </div>
    ${postCard({ author: 'Membre…', role: title, body: 'Publication…' })}
    ${postCard({ author: 'Autre membre…', role: title, body: 'Publication…', multi: true })}
    <button class="hit btn primary block" data-sim="publier">Créer une publication (simulé)</button>
    <button class="hit row-link" data-go="etat-vide"><span>État vide du fil</span><span>›</span></button>
    `,
    {
      header: phoneHeader({ title, backTo: 'accueil-kapan' }),
      footer: phoneFooter('menu'),
    }
  )
}

/* ——— Admin ——— */

function adminHome() {
  return wrap(
    `
    <h2 class="sec">Espace administrateur</h2>
    ${tbd('Rôles & permissions — À préciser')}
    <button class="hit row-link" data-go="admin-contenus">
      <span><strong>Gestion contenus / fiches</strong><br/><span class="meta">Liste + édition (coquille)</span></span>
      <span>›</span>
    </button>
    <button class="hit row-link" data-go="admin-moderation">
      <span><strong>Modération</strong><br/><span class="meta">À préciser</span></span>
      <span>›</span>
    </button>
    <button class="hit row-link" data-go="admin-stats">
      <span><strong>Statistiques</strong><br/><span class="meta">À préciser</span></span>
      <span>›</span>
    </button>
    ${tbd('Autres workflows back-office — À préciser (ne pas inventer)')}
    <button class="hit btn block" data-go="accueil-kapan">Basculer vue utilisateur</button>
    `,
    {
      header: phoneHeader({
        title: 'Admin',
        showBack: false,
      }),
    }
  )
}

function adminContenus() {
  return wrap(
    `
    <div class="row-actions">
      <button class="hit btn primary" data-go="admin-fiche-edit">+ Nouvelle fiche</button>
      <button class="hit btn" data-sim="filtre-admin">Filtrer</button>
    </div>
    ${search('Rechercher un contenu…')}
    ${chips(['Tous', 'Santé', 'Mairie', 'Annonces', 'À préciser'])}
    ${['Pharmacie centrale', 'Hôpital de Kapan', 'Annonce mairie #12']
      .map(
        (t) => `
      <button class="hit row-link" data-go="admin-fiche-edit">
        <span><strong>${t}</strong><br/><span class="meta">Statut… · modifié…</span></span>
        <span>›</span>
      </button>`
      )
      .join('')}
    <h2 class="sec">État vide</h2>
    ${emptyState('Aucun contenu à gérer')}
    ${tbd('Colonnes / workflow publication — À préciser')}
    `,
    {
      header: phoneHeader({ title: 'Gestion contenus', backTo: 'admin-home' }),
    }
  )
}

function adminFicheEdit() {
  return wrap(
    `
    <h2 class="sec">Édition fiche (coquille)</h2>
    <label class="field"><span>Titre</span><input type="text" placeholder="Texte…" value="Pharmacie centrale" /></label>
    <label class="field"><span>Catégorie</span>
      <select><option>Santé / Pharmacies</option><option>À préciser</option></select>
    </label>
    <label class="field"><span>Statut</span>
      <select><option>Brouillon</option><option>Publié</option><option>À préciser</option></select>
    </label>
    <label class="field"><span>Description</span><textarea rows="3" placeholder="Texte…"></textarea></label>
    <div class="field">
      <span>Photo</span>
      ${photo('Slot photo…')}
      <button class="hit btn" data-sim="upload">Ajouter photo (simulé)</button>
    </div>
    <label class="field"><span>Horaires</span><input type="text" placeholder="À préciser" /></label>
    ${tbd('Champs métier manquants — À préciser')}
    <div class="row-actions">
      <button class="hit btn" data-back>Annuler</button>
      <button class="hit btn primary" data-sim="sauver">Enregistrer (simulé)</button>
    </div>
    <button class="hit btn block" data-sim="publier-admin">Publier (simulé — À préciser)</button>
    `,
    {
      header: phoneHeader({ title: 'Éditer fiche', backTo: 'admin-contenus' }),
    }
  )
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
  'mairie-nouvelle-publication': {
    title: 'Nouvelle publication',
    side: 'user',
    group: 'Ma mairie',
    render: mairieNouvellePublication,
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
  'mairie-communaute': {
    title: 'Communauté infos',
    side: 'user',
    group: 'Ma mairie',
    render: mairieCommunaute,
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
  'evenement-participants': {
    title: 'Événement — Participants',
    side: 'user',
    group: 'Social / contenus',
    render: evenementParticipants,
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
  'emploi-details': {
    title: 'Offre — Détail',
    side: 'user',
    group: 'Social / contenus',
    render: emploiDetails,
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
          { title: 'Monastère de Vahanavank', meta: 'Patrimoine · 0,8 km', badge: 'Ouvert', ficheGo: 'dir-tourisme-fiche-infos' },
          { title: 'Parc / Nature…', meta: 'Nature · …', badge: '…', ficheGo: 'dir-nature-fiche-infos' },
          { title: 'Activité…', meta: 'Activités · …', badge: '…', ficheGo: 'dir-activites-fiche-infos' },
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
    render: () => rubriqueListe('Culture', 'dir-tourisme', { ficheGo: 'dir-tourisme-fiche-infos' }),
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
    render: () => rubriqueListe('Écoles', 'dir-education', { ficheGo: 'dir-education-ecoles-fiche-infos' }),
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
        ficheGo: 'dir-education-ecoles-fiche-infos',
        filters: ['Tous', 'Ouverts', 'À proximité', 'Enregistrés'],
        proposition: true,
      }),
  },
  'dir-economie-entreprises': {
    title: 'Entreprises — À valider',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      rubriqueListe('Entreprises', 'dir-economie', {
        ficheGo: 'dir-education-formations-fiche-infos',
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
        ficheGo: 'dir-education-universites-fiche-infos',
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
        ficheGo: 'dir-education-activites-fiche-infos',
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
        ficheGo: 'dir-cinemas-cinemas-fiche-infos',
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
        ficheGo: 'dir-cinemas-theatres-fiche-infos',
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
        ficheGo: 'dir-cinemas-programmes-fiche-infos',
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
        ficheGo: 'dir-cinemas-spectacles-fiche-infos',
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
        ficheGo: 'dir-economie-commerces-fiche-infos',
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
        ficheGo: 'dir-economie-entreprises-fiche-infos',
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
        ficheGo: 'dir-economie-artisans-fiche-infos',
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
        ficheGo: 'dir-economie-services-fiche-infos',
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
    render: () => rubriqueListe('Banques', 'dir-banques', { filters: ['Tous', 'Ouverts', 'À proximité', 'Enregistrés'], proposition: true }),
  },
  'dir-banques-assurances': {
    title: 'Assurances — À valider',
    side: 'user',
    group: 'Vie locale',
    render: () => rubriqueListe('Assurances', 'dir-banques', { filters: ['Tous', 'Ouverts', 'À proximité', 'Enregistrés'], proposition: true }),
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
    render: () => rubriqueListe('Change', 'dir-banques', { filters: ['Tous', 'Ouverts', 'À proximité', 'Enregistrés'], proposition: true }),
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
        ficheGo: 'dir-aide-familles-fiche-infos',
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
        ficheGo: 'dir-aide-seniors-fiche-infos',
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
        ficheGo: 'dir-aide-handicap-fiche-infos',
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
        ficheGo: 'dir-aide-accompagnement-fiche-infos',
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
        ficheGo: 'dir-associations-solidarite-fiche-infos',
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
        ficheGo: 'dir-associations-culture-fiche-infos',
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
        ficheGo: 'dir-associations-sport-fiche-infos',
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
        ficheGo: 'dir-associations-environnement-fiche-infos',
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
        ficheGo: 'dir-banques-banques-fiche-infos',
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
        ficheGo: 'dir-banques-assurances-fiche-infos',
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
        ficheGo: 'dir-banques-change-fiche-infos',
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
        ficheGo: 'dir-transports-bus-fiche-infos',
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
        ficheGo: 'dir-transports-taxis-fiche-infos',
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
        ficheGo: 'dir-transports-gares-fiche-infos',
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
        ficheGo: 'dir-transports-location-fiche-infos',
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
        ficheGo: 'dir-bibliotheques-bibliotheques-fiche-infos',
        filters: ['Tous', 'Ouverts', 'À proximité', 'Enregistrés'],
        proposition: true,
      }),
  },

  /* —— Signalement (annuaire) —— */
  'page-signalement': { title: 'Signalement — À valider', side: 'user', group: 'Vie locale', render: pageSignalement },
  'dir-signalement-voirie': {
    title: 'Voirie — À valider',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      rubriqueListe('Voirie', 'page-signalement', {
        ficheGo: 'dir-bibliotheques-mediatheques-fiche-infos',
        filters: ['Tous', 'Ouverts', 'À proximité', 'Enregistrés'],
        proposition: true,
      }),
  },
  'dir-signalement-eclairage': {
    title: 'Éclairage — À valider',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      rubriqueListe('Éclairage', 'page-signalement', {
        ficheGo: 'dir-bibliotheques-universitaires-fiche-infos',
        filters: ['Tous', 'Ouverts', 'À proximité', 'Enregistrés'],
        proposition: true,
      }),
  },
  'dir-signalement-proprete': {
    title: 'Propreté — À valider',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      rubriqueListe('Propreté', 'page-signalement', {
        ficheGo: 'dir-bibliotheques-salles-de-lecture-fiche-infos',
        filters: ['Tous', 'Ouverts', 'À proximité', 'Enregistrés'],
        proposition: true,
      }),
  },
  'dir-signalement-equipements': {
    title: 'Équipements — À valider',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      rubriqueListe('Équipements', 'page-signalement', {
        ficheGo: 'dir-permanences-administratives-fiche-infos',
        filters: ['Tous', 'Ouverts', 'À proximité', 'Enregistrés'],
        proposition: true,
      }),
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
  'dir-signalement-eclairage-fiche-infos': {
    title: 'Éclairage — Détail',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      dirFiche('infos', {
        title: 'Éclairage — fiche…',
        category: 'Éclairage',
        backTo: 'dir-signalement-eclairage',
        idInfos: 'dir-signalement-eclairage-fiche-infos',
        idHoraires: 'dir-signalement-eclairage-fiche-horaires',
      }),
  },
  'dir-signalement-eclairage-fiche-horaires': {
    title: 'Éclairage — Horaires',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      dirFiche('horaires', {
        title: 'Éclairage — fiche…',
        category: 'Éclairage',
        backTo: 'dir-signalement-eclairage',
        idInfos: 'dir-signalement-eclairage-fiche-infos',
        idHoraires: 'dir-signalement-eclairage-fiche-horaires',
      }),
  },
  'dir-signalement-equipements-fiche-infos': {
    title: 'Équipements — Détail',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      dirFiche('infos', {
        title: 'Équipements — fiche…',
        category: 'Équipements',
        backTo: 'dir-signalement-equipements',
        idInfos: 'dir-signalement-equipements-fiche-infos',
        idHoraires: 'dir-signalement-equipements-fiche-horaires',
      }),
  },
  'dir-signalement-equipements-fiche-horaires': {
    title: 'Équipements — Horaires',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      dirFiche('horaires', {
        title: 'Équipements — fiche…',
        category: 'Équipements',
        backTo: 'dir-signalement-equipements',
        idInfos: 'dir-signalement-equipements-fiche-infos',
        idHoraires: 'dir-signalement-equipements-fiche-horaires',
      }),
  },
  'dir-signalement-proprete-fiche-infos': {
    title: 'Propreté — Détail',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      dirFiche('infos', {
        title: 'Propreté — fiche…',
        category: 'Propreté',
        backTo: 'dir-signalement-proprete',
        idInfos: 'dir-signalement-proprete-fiche-infos',
        idHoraires: 'dir-signalement-proprete-fiche-horaires',
      }),
  },
  'dir-signalement-proprete-fiche-horaires': {
    title: 'Propreté — Horaires',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      dirFiche('horaires', {
        title: 'Propreté — fiche…',
        category: 'Propreté',
        backTo: 'dir-signalement-proprete',
        idInfos: 'dir-signalement-proprete-fiche-infos',
        idHoraires: 'dir-signalement-proprete-fiche-horaires',
      }),
  },
  'dir-signalement-voirie-fiche-infos': {
    title: 'Voirie — Détail',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      dirFiche('infos', {
        title: 'Voirie — fiche…',
        category: 'Voirie',
        backTo: 'dir-signalement-voirie',
        idInfos: 'dir-signalement-voirie-fiche-infos',
        idHoraires: 'dir-signalement-voirie-fiche-horaires',
      }),
  },
  'dir-signalement-voirie-fiche-horaires': {
    title: 'Voirie — Horaires',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      dirFiche('horaires', {
        title: 'Voirie — fiche…',
        category: 'Voirie',
        backTo: 'dir-signalement-voirie',
        idInfos: 'dir-signalement-voirie-fiche-infos',
        idHoraires: 'dir-signalement-voirie-fiche-horaires',
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
    render: () => communautesStub('Groupes'),
  },
  'communautes-clubs': {
    title: 'Clubs',
    side: 'user',
    group: 'Vie locale',
    render: () => communautesStub('Clubs'),
  },
  'communautes-rencontres': {
    title: 'Mes rencontres',
    side: 'user',
    group: 'Vie locale',
    render: () => communautesStub('Mes rencontres'),
  },


  'admin-home': { title: 'Admin — Accueil', side: 'admin', group: 'Admin', render: adminHome },
  'admin-contenus': {
    title: 'Gestion contenus / fiches',
    side: 'admin',
    group: 'Admin',
    render: adminContenus,
  },
  'admin-fiche-edit': {
    title: 'Édition fiche (shell)',
    side: 'admin',
    group: 'Admin',
    render: adminFicheEdit,
  },
  'admin-moderation': {
    title: 'Modération',
    side: 'admin',
    group: 'Admin',
    render: () => adminStub('Modération'),
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
            id: 'mairie-accueil',
            label: 'Ma mairie',
            children: [
              { id: 'mairie-menu', label: 'Menu Ma mairie' },
              { id: 'mairie-accueil-evenements', label: 'Événements (onglet)' },
              {
                id: 'mairie-rdv',
                label: 'Prendre rendez-vous',
                children: [{ id: 'mairie-rdv-suite', label: 'Confirmation' }],
              },
              {
                id: 'mairie-presentation',
                label: 'Présentation de la ville',
                children: [{ id: 'mairie-presentation-options', label: 'Plus d’options' }],
              },
              {
                id: 'mairie-nouvelle-publication',
                label: 'Nouvelle publication',
                children: [{ id: 'mairie-medias-sheet', label: 'Médias (sheet)' }],
              },
              {
                id: 'mairie-conseil',
                label: 'Maire & Conseil',
                children: [{ id: 'mairie-conseil-edit', label: 'Édition admin' }],
              },
              {
                id: 'mairie-infos',
                label: 'Infos Mairie',
                children: [
                  { id: 'mairie-infos-detail', label: 'Détail' },
                  { id: 'mairie-infos-apropos', label: 'À propos (sheet)' },
                ],
              },
              { id: 'mairie-communaute', label: 'Communauté infos' },
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
            label: 'Infos Feed',
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
                children: [{ id: 'evenement-participants', label: 'Participants' }],
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
            children: [{ id: 'emploi-details', label: 'Détail offre' }],
          },
          { id: 'urgence-numeros', label: 'N° Urgence' },
          {
            id: 'messages',
            label: 'Messages',
            children: [
              { id: 'messages-maville', label: 'Ma Ville' },
              { id: 'messages-thread', label: 'Conversation' },
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
          {
            id: 'vie-locale-hub',
            label: 'Vie locale',
            children: [
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
                      { id: 'dir-tourisme-fiche-infos', label: 'Détail' },
                      { id: 'dir-tourisme-fiche-horaires', label: 'Horaires' },
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
                id: 'dir-cinemas',
                label: 'Cinémas & Théâtres',
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
                    children: [{ id: 'dir-cinemas-programme-semaine', label: 'Programme semaine' }],
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
                label: 'Bibliothèques',
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
                id: 'page-signalement',
                label: 'Signalement',
                children: [
                  {
                    id: 'dir-signalement-voirie',
                    label: 'Voirie',
                    children: [
                      { id: 'dir-signalement-voirie-fiche-infos', label: 'Détail' },
                      { id: 'dir-signalement-voirie-fiche-horaires', label: 'Horaires' },
                    ],
                  },
                  {
                    id: 'dir-signalement-eclairage',
                    label: 'Éclairage',
                    children: [
                      { id: 'dir-signalement-eclairage-fiche-infos', label: 'Détail' },
                      { id: 'dir-signalement-eclairage-fiche-horaires', label: 'Horaires' },
                    ],
                  },
                  {
                    id: 'dir-signalement-proprete',
                    label: 'Propreté',
                    children: [
                      { id: 'dir-signalement-proprete-fiche-infos', label: 'Détail' },
                      { id: 'dir-signalement-proprete-fiche-horaires', label: 'Horaires' },
                    ],
                  },
                  {
                    id: 'dir-signalement-equipements',
                    label: 'Équipements',
                    children: [
                      { id: 'dir-signalement-equipements-fiche-infos', label: 'Détail' },
                      { id: 'dir-signalement-equipements-fiche-horaires', label: 'Horaires' },
                    ],
                  },
                ],
              },
              {
                id: 'page-meteo',
                label: 'Météo',
                children: [
                  {
                    id: 'meteo-maintenant',
                    label: 'Maintenant',
                    children: [{ label: 'Conditions actuelles détaillées' }],
                  },
                  {
                    id: 'meteo-aujourdhui',
                    label: 'Aujourd’hui',
                    children: [{ label: 'Prévisions horaires + filtres de période' }],
                  },
                  {
                    id: 'meteo-demain',
                    label: 'Demain',
                    children: [{ label: 'Prévisions horaires + filtres de période' }],
                  },
                  {
                    id: 'meteo-7jours',
                    label: '7 jours',
                    children: [{ id: 'meteo-jour', label: 'Jour choisi' }],
                  },
                ],
              },
              { id: 'dir-restaurants', label: 'Restaurants' },
              { id: 'dir-patrimoine', label: 'Patrimoine' },
              { id: 'communautes-groupes', label: 'Groupes' },
              { id: 'communautes-clubs', label: 'Clubs' },
              { id: 'communautes-rencontres', label: 'Rencontres' },
            ],
          },
        ],
      },
    ],
  },
  admin: {
    tab: 'Administrateur',
    roots: [
      {
        id: 'admin-home',
        label: 'Accueil admin',
        children: [
          {
            id: 'admin-contenus',
            label: 'Gestion contenus',
            children: [{ id: 'admin-fiche-edit', label: 'Éditer fiche' }],
          },
          { id: 'admin-moderation', label: 'Modération' },
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

