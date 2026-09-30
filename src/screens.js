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
  modalShell,
  tbd,
  emptyState,
  loadingState,
  errorState,
} from './components.js'

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
  const vieLocale = [
    { label: 'Éducation', go: 'dir-education' },
    { label: 'Économie', go: 'dir-economie' },
    { label: 'Cinéma & Théâtres', go: 'dir-cinemas' },
    { label: 'Patrimoine', go: 'dir-patrimoine' },
    { label: 'Aide sociale', go: 'dir-aide-sociale' },
    { label: 'Associations', go: 'dir-associations' },
    { label: 'Restaurants', go: 'dir-restaurants' },
    { label: 'Transports', go: 'dir-transports' },
    { label: 'Bibliothèques', go: 'dir-bibliotheques' },
    { label: 'Santé', go: 'sante-accueil' },
    { label: 'Sécurité', go: 'dir-securite' },
    { label: 'Tourisme', go: 'dir-tourisme' },
    { label: 'Météo', go: 'page-meteo' },
    { label: 'Signalement', go: 'page-signalement' },
  ]
  return wrap(
    `
    <section class="hero-block">
      ${photo('Photo couverture Kapan…', 'hero')}
      <div class="overlay-badges">
        <span class="badge">22°C Ensoleillé</span>
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
      ${[
        ['Ma mairie', 'mairie-accueil'],
        ['Infos citoyen', 'infos-citoyen'],
        ['Événements', 'evenements-liste'],
        ['Petites annonces', 'annonces-liste'],
        ['Offres d’emploi', 'emplois-liste'],
      ]
        .map(
          ([label, go]) => `
        <button class="hit tile" data-go="${go}">
          ${photo('Photo…')}
          <span>${label}</span>
        </button>`
        )
        .join('')}
    </div>
    <h2 class="sec">Communautés</h2>
    ${[
      ['Groupes', 'communautes-groupes'],
      ['Clubs', 'communautes-clubs'],
      ['Mes rencontres', 'communautes-rencontres'],
    ]
      .map(
        ([label, go]) => `
      <button class="hit row-link" data-go="${go}">
        <span class="ico-box"></span>
        <span><strong>${label}</strong><br/><span class="meta">Texte…</span></span>
        <span>›</span>
      </button>`
      )
      .join('')}
    <h2 class="sec">Vie locale à Kapan</h2>
    <div class="grid-3">
      ${vieLocale
        .map(
          (it) => `
        <button class="hit icon-tile" data-go="${it.go}">
          <span class="ico-box"></span>
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

function mairieAccueil() {
  return wrap(
    `
    ${photo('Photo mairie…', 'hero')}
    <div class="overlay-badges"><span class="badge">22°C — Ensoleillé</span></div>
    <div class="detail-head">
      <strong>Ma mairie — Kapan</strong>
      ${text('Présentation courte…')}
    </div>
    <div class="members-row">
      <div class="avatars">${avatar(3)}</div>
      <span>3649 membres</span>
      <button class="hit btn" data-sim="inviter">+ Inviter</button>
    </div>
    <div class="tabs">
      <button class="hit tab on" type="button">Publications</button>
      <button class="hit tab" data-go="evenements-liste">Événements</button>
      <button class="hit tab" type="button">Informations</button>
    </div>
    <div class="grid-2">
      ${[
        ['Présentation de la ville', 'mairie-presentation'],
        ['Maire & Conseil municipal', 'mairie-conseil'],
        ['Infos Mairie', 'mairie-infos'],
        ['Plan de la ville', 'mairie-plan'],
      ]
        .map(
          ([l, g]) => `
        <button class="hit tile" data-go="${g}">
          <span class="ico-box"></span>
          <span>${l}</span>
        </button>`
        )
        .join('')}
    </div>
    <section class="card">
      <h2 class="sec">Horaires & Démarches rapides</h2>
      ${text('Horaires d’ouverture…')}
      <div class="row-actions">
        <button class="hit btn" data-sim="appeler">Contacter</button>
        <button class="hit btn primary" data-go="mairie-rdv">Prendre RDV</button>
      </div>
    </section>
    `,
    {
      header: phoneHeader({ title: 'Ma mairie', backTo: 'accueil-kapan' }),
      footer: phoneFooter('mairie'),
    }
  )
}

function mairieRdv() {
  return wrap(
    `
    <article class="card">
      <strong>Mes rendez-vous en cours</strong>
      <p>Renouvellement de passeport</p>
      <span class="badge">Confirmé</span>
      <p class="meta">Date / heure…</p>
      ${tbd('Confirmer / Annuler RDV — À préciser')}
    </article>
    <label class="field">
      <span>Motif de rendez-vous</span>
      <select>
        <option>État civil & Affaires citoyennes</option>
        <option>À préciser</option>
      </select>
    </label>
    <h2 class="sec">Calendrier — Mai 2026</h2>
    <div class="calendar">
      ${Array.from({ length: 31 }, (_, i) => {
        const d = i + 1
        const cls = d === 27 ? 'on' : d % 7 === 0 ? 'closed' : ''
        return `<button class="hit cal-day ${cls}" type="button">${d}</button>`
      }).join('')}
    </div>
    <h2 class="sec">Horaires disponibles — 27 mai</h2>
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
    `,
    {
      header: phoneHeader({ title: 'Prendre rendez-vous', backTo: 'mairie-accueil', showCity: true }),
      footer: phoneFooter('mairie'),
    }
  )
}

function mairieRdvSuite() {
  return wrap(
    `
    <h2 class="sec">Confirmation RDV</h2>
    <article class="card">
      <strong>Récapitulatif</strong>
      ${text('Motif · date · créneau sélectionnés…')}
    </article>
    ${tbd('Confirmer / Annuler RDV — workflow À préciser')}
    <div class="row-actions">
      <button class="hit btn" data-back>Retour</button>
      <button class="hit btn primary" data-sim="rdv">Confirmer (simulé)</button>
    </div>
    <button class="hit btn block" data-sim="rdv-annuler">Annuler un RDV (simulé — À préciser)</button>
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
    <article class="card post-card">
      ${photo('Photo paysage…', 'wide')}
      <strong>À propos de la ville de KAPAN</strong>
      ${text('Texte de présentation…')}
      <div class="post-actions">
        <button class="hit btn" data-go="infos-reactions">♡ J’aime</button>
        <button class="hit btn" data-go="infos-commentaires">💬 Commenter</button>
        <button class="hit btn" data-go="infos-partage">↗ Partager</button>
      </div>
    </article>
    <article class="card post-card">
      <div class="photo-grid">${photo('Photo…')}${photo('Photo…')}${photo('+5')}</div>
      <strong>Kapan, entre ville et nature</strong>
      ${text('Texte…')}
      <div class="post-actions">
        <button class="hit btn" data-go="infos-reactions">♡ J’aime</button>
        <button class="hit btn" data-go="infos-commentaires">💬 Commenter</button>
        <button class="hit btn" data-go="infos-partage">↗ Partager</button>
      </div>
    </article>
    `,
    {
      header: phoneHeader({ title: 'Présentation de la ville', backTo: 'mairie-accueil' }),
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
    <article class="card post-card">
      <header class="post-head">
        <span class="avatar"></span>
        <div><strong>Mairie de Kapan</strong><div class="meta">Publication · …</div></div>
      </header>
      ${text('Contenu type publication…')}
      ${photo('Photo…', 'wide')}
      <div class="post-actions">
        <button class="hit btn" data-go="infos-reactions">♡ J’aime</button>
        <button class="hit btn" data-go="infos-commentaires">💬 Commenter</button>
        <button class="hit btn" data-go="infos-partage">↗ Partager</button>
      </div>
    </article>
    <button class="hit row-link" data-go="mairie-accueil"><span>Retour Ma mairie</span><span>›</span></button>
    `,
    {
      header: phoneHeader({ title, backTo: 'mairie-accueil' }),
      footer: phoneFooter('mairie'),
    }
  )
}

/* ——— Social / contenus ——— */

function infosCitoyen() {
  return wrap(
    `
    <h2 class="sec">Infos citoyen</h2>
    ${tbd('Lien Infos citoyen ↔ Infos Feed — à clarifier')}
    ${text('Point d’entrée citoyen (structure)…')}
    <button class="hit btn primary block" data-go="infos-feed">Ouvrir Infos Feed</button>
    <button class="hit row-link" data-go="evenements-liste"><span>Événements liés</span><span>›</span></button>
    <button class="hit row-link" data-go="mairie-infos"><span>Infos Mairie</span><span>›</span></button>
    `,
    {
      header: phoneHeader({ title: 'Infos citoyen', backTo: 'accueil-kapan' }),
      footer: phoneFooter('infos'),
    }
  )
}

function infosFeed() {
  return wrap(
    `
    <div class="compose">
      <span class="avatar"></span>
      <button class="hit compose-input" data-sim="publier">Commencer une publication</button>
    </div>
    <div class="row-actions">
      <button class="hit btn" data-sim="publier">Vidéo</button>
      <button class="hit btn" data-sim="publier">Photo</button>
    </div>
    <p class="meta">Classer par : Récents ▾</p>
    ${postCard({
      author: 'Maire de Kapan',
      role: 'Mairie',
      body: 'Texte de la publication…',
    })}
    ${postCard({
      author: 'Délégué local',
      role: 'Membre',
      body: 'Autre publication…',
      multi: true,
    })}
    `,
    {
      header: phoneHeader({ title: 'Infos Feed', backTo: 'accueil-kapan' }),
      footer: phoneFooter('infos'),
    }
  )
}

function infosReactions() {
  return wrap(
    `
    <div class="tabs">
      <button class="hit tab on" type="button">Tous (166)</button>
      <button class="hit tab" type="button">J’aime (120)</button>
      <button class="hit tab" type="button">J’adore (46)</button>
    </div>
    ${['Marie Dupont', 'Anahit S.', 'Rupen D.']
      .map(
        (n) => `
      <div class="row-link static">
        <span class="avatar"></span>
        <span><strong>${n}</strong><br/><span class="meta">Membre</span></span>
        <button class="hit btn" data-sim="suivre">Suivre</button>
      </div>`
      )
      .join('')}
    `,
    {
      header: phoneHeader({ title: 'Réactions', backTo: 'infos-feed' }),
      footer: phoneFooter('infos'),
    }
  )
}

function infosCommentaires() {
  return wrap(
    `
    <h2 class="sec">Commentaires (2)</h2>
    <article class="card">
      <div class="post-head">
        <span class="avatar"></span>
        <div><strong>Marie Dupont</strong><div class="meta">Membre · 1 h</div></div>
      </div>
      ${text('Commentaire…')}
      <div class="row-actions">
        <button class="hit linkish" type="button">J’adore</button>
        <button class="hit linkish" type="button">Répondre</button>
      </div>
      <div class="reply">
        <span class="avatar"></span>
        ${text('Réponse…')}
      </div>
    </article>
    <div class="composer-bar">
      <span class="avatar"></span>
      <input type="text" placeholder="Écrire un commentaire…" />
      <button class="hit btn primary" data-sim="commentaire">Envoyer</button>
    </div>
    `,
    {
      header: phoneHeader({ title: 'Commentaires', backTo: 'infos-feed' }),
      footer: phoneFooter('infos'),
    }
  )
}

function infosPartage() {
  return wrap(
    `${photo('Fond feed…', 'dim')}`,
    {
      header: phoneHeader({ title: 'Infos Feed', backTo: 'infos-feed' }),
      footer: phoneFooter('infos'),
      overlay: modalShell(
        'Partager la publication',
        `
        ${search('Rechercher des destinataires…')}
        <div class="h-scroll">${avatar(5)}</div>
        ${[
          'Envoyer dans une conversation',
          'Copier le lien',
          'Partager dans une autre application',
          'Partager sur mon profil',
        ]
          .map((l) => `<button class="hit row-link" data-sim="partage"><span>${l}</span><span>›</span></button>`)
          .join('')}
        `,
        `<button class="hit btn primary block" data-sim="partage">Envoyer aux destinataires sélectionnés</button>`
      ),
    }
  )
}

function evenementsListe() {
  return wrap(
    `
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
    <h2 class="sec">Jeudi 26 Juin <span class="badge">3 événements</span></h2>
    ${['Atelier Créatif de Kapan', 'Festival de Musique de Kapan', 'Randonnée Montagne Syunik']
      .map(
        (title) => `
      <article class="card">
        ${photo('Photo événement…', 'wide')}
        <span class="badge">Catégorie…</span>
        <strong>${title}</strong>
        <p class="meta">16:30 – 18:30 · Lieu… · places restantes…</p>
        <button class="hit btn primary" data-go="evenement-details">Voir les détails</button>
      </article>`
      )
      .join('')}
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
    ${photo('Photo événement…', 'hero')}
    <span class="badge">Artistique / Créatif</span>
    <strong class="block-title">Atelier Créatif de Kapan</strong>
    <div class="meta-grid">
      <div><span class="meta">Date</span><br/>JUN 26</div>
      <div><span class="meta">Heure</span><br/>16:30–18:30</div>
      <div><span class="meta">Lieu</span><br/>Centre Culturel…</div>
    </div>
    ${text('Description de l’événement…')}
    <button class="hit row-link" data-go="messages"><span>Centre de Messagerie</span><span>›</span></button>
    <div class="post-actions">
      <button class="hit btn" data-go="infos-reactions">♡ 128</button>
      <button class="hit btn" data-go="infos-commentaires">💬 18</button>
      <button class="hit btn" data-go="infos-partage">↗ 13</button>
    </div>
    <button class="hit btn block" data-sim="participation">Annuler la participation (simulé)</button>
    <h2 class="sec">Organisateurs</h2>
    <div class="row-link static">
      <span class="avatar"></span>
      <span>Mairie de Kapan</span>
      <button class="hit icon-btn" data-sim="appeler">☎</button>
      <button class="hit icon-btn" data-sim="message">💬</button>
    </div>
    <h2 class="sec">Plus d’informations</h2>
    <button class="hit row-link" data-go="evenement-participants">
      <span>Participants ${avatar(3)} +8</span><span>›</span>
    </button>
    <button class="hit row-link" type="button"><span>Validations des participants</span><span>›</span></button>
    <button class="hit row-link" type="button"><span>Critères de participation</span><span>›</span></button>
    <button class="hit row-link" type="button"><span>Conditions de participation</span><span>›</span></button>
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
  return wrap(
    `
    <div class="alert-box">
      <strong>En cas d’urgence</strong>
      ${text('Appelez immédiatement…')}
      ${photo('Illustration…')}
    </div>
    <h2 class="sec">Numéros principaux</h2>
    ${[
      ['Ambulance / SAMU', 'Aide médicale urgente', '103'],
      ['Police', 'Pour toute situation d’urgence', '102'],
      ['Pompiers', 'Incendies, accidents, secours', '101'],
      ['Urgences européennes', 'Numéro unique UE', '112'],
    ]
      .map(
        ([l, d, n]) => `
      <article class="card rowish">
        <span class="ico-box"></span>
        <div class="grow">
          <strong>${l}</strong>
          <p class="meta">${d}</p>
        </div>
        <button class="hit btn primary" data-sim="appeler:${n}">${n}</button>
      </article>`
      )
      .join('')}
    ${tbd('Autres numéros locaux éventuels — À préciser')}
    <div class="notice">
      <strong>Restez en sécurité</strong>
      ${text('N’utilisez ces numéros qu’en cas de réelle urgence.')}
    </div>
    <button class="hit row-link" data-go="sante-urgences"><span>Urgences Santé (détail)</span><span>›</span></button>
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

/* ——— Vie locale directory (modèle Santé) ——— */

/** Accueil rubrique: banner + exactly 4 cats + search/filters + Autour de vous (+ useful if known) */
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
} = {}) {
  // Always exactly 4 subcategory blocks
  const four = [...cats]
  while (four.length < 4) four.push({ label: title, tbd: true, go: 'a-preciser' })
  const blocks = four.slice(0, 4)
  const filterChips = filters || ['Tous', ...blocks.map((c) => c.label.split(' ')[0]), 'Ouverts'].slice(0, 4)
  const mixed =
    around ||
    blocks.map((c, i) => ({
      title: `Fiche ${c.label}…`,
      meta: `${c.label} · distance…`,
      badge: i === 0 ? 'Ouvert' : '…',
      go: c.tbd ? 'a-preciser' : c.go || 'dir-liste',
      ficheGo: 'dir-fiche',
    }))

  return wrap(
    `
    <div class="banner-box">
      ${photo('Bannière…')}
      <strong>${bannerTitle || title}</strong>
      ${text(bannerText)}
    </div>
    <div class="grid-4">
      ${blocks
        .map(
          (c) => `
        <button class="hit icon-tile" data-go="${c.go || 'a-preciser'}" title="${c.label}">
          <span class="ico-box round"></span>
          <span>${c.label}${c.tbd ? ' *' : ''}</span>
          ${c.tbd ? '<span class="meta">À préciser</span>' : ''}
        </button>`
        )
        .join('')}
    </div>
    ${search(searchPh || `Rechercher dans ${title}…`)}
    ${chips(filterChips)}
    <h2 class="sec">Autour de vous</h2>
    <p class="meta">Liste mixte des 4 sous-catégories</p>
    ${mixed
      .map(
        (item) =>
          listCard({
            title: item.title,
            meta: item.meta,
            badge: item.badge || 'Ouvert',
            actions: [
              { label: 'Détails', go: item.ficheGo || item.go || 'dir-fiche', primary: true },
              { label: 'Appeler', sim: 'appeler' },
            ],
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

/** Sous-page: no banner, no 4 blocks — search, filters, cards */
function rubriqueListe(title, parentId, { tbdLabel = false } = {}) {
  return wrap(
    `
    ${tbdLabel ? tbd(`Sous-catégorie « ${title} » — À préciser`) : ''}
    ${search(`Rechercher dans ${title}…`)}
    ${chips(['Tous', 'Ouverts', 'À proximité'])}
    ${listCard({
      title: `${title} — fiche A…`,
      meta: 'Adresse · distance…',
      badge: 'Ouvert',
      actions: [
        { label: 'Détails', go: 'dir-fiche', primary: true },
        { label: 'Appeler', sim: 'appeler' },
      ],
    })}
    ${listCard({
      title: `${title} — fiche B…`,
      meta: 'Adresse · …',
      badge: 'Fermé',
      actions: [
        { label: 'Détails', go: 'dir-fiche', primary: true },
        { label: 'Appeler', sim: 'appeler' },
      ],
    })}
    ${emptyState('Aucun résultat (état vide)')}
    `,
    {
      header: phoneHeader({ title, backTo: parentId }),
      footer: phoneFooter('menu'),
    }
  )
}

function vieLocaleHub() {
  const cats = [
    ['Santé', 'sante-accueil'],
    ['Tourisme', 'dir-tourisme'],
    ['Cinémas & Théâtres', 'dir-cinemas'],
    ['Éducation', 'dir-education'],
    ['Économie', 'dir-economie'],
    ['Patrimoine', 'dir-patrimoine'],
    ['Aide sociale', 'dir-aide-sociale'],
    ['Associations', 'dir-associations'],
    ['Restaurants', 'dir-restaurants'],
    ['Transports', 'dir-transports'],
    ['Bibliothèques', 'dir-bibliotheques'],
    ['Sécurité', 'dir-securite'],
    ['Météo', 'page-meteo'],
    ['Signalement', 'page-signalement'],
    ['N° Urgence', 'urgence-numeros'],
  ]
  return wrap(
    `
    <h2 class="sec">Vie locale</h2>
    ${text('Même modèle d’annuaire que Santé (4 sous-catégories)')}
    <div class="grid-3">
      ${cats
        .map(
          ([l, g]) => `
        <button class="hit icon-tile" data-go="${g}">
          <span class="ico-box"></span>
          <span>${l}</span>
        </button>`
        )
        .join('')}
    </div>
    `,
    {
      header: phoneHeader({ title: 'Vie locale', backTo: 'accueil-kapan' }),
      footer: phoneFooter('menu'),
    }
  )
}

function dirFiche(tab = 'infos') {
  return wrap(
    `
    ${photo('Photo…', 'hero')}
    <div class="detail-head">
      <strong>Fiche détail (modèle annuaire)</strong>
      <span class="badge">Statut…</span>
      <p class="meta">Catégorie · distance…</p>
    </div>
    <div class="row-actions">
      <button class="hit btn" data-sim="itineraire">Itinéraire</button>
      <button class="hit btn primary" data-sim="appeler">Appeler</button>
    </div>
    <div class="tabs">
      <button class="hit tab ${tab === 'infos' ? 'on' : ''}" data-go="dir-fiche">Informations</button>
      <button class="hit tab ${tab === 'horaires' ? 'on' : ''}" data-go="dir-fiche-horaires">Horaires</button>
    </div>
    ${
      tab === 'infos'
        ? `${text('Contact / adresse / à propos…')}${photo('Carte…', 'map')}${tbd('Champs spécifiques catégorie — À préciser')}`
        : `${['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']
            .map(
              (d) => `
          <div class="row-link static">
            <span>${d}</span>
            <span class="meta">Horaires… / À préciser</span>
          </div>`
            )
            .join('')}
          <button class="hit btn block" data-go="etat-horaires-manquants">État horaires manquants</button>`
    }
    `,
    {
      header: phoneHeader({ title: 'Fiche', backTo: 'vie-locale-hub' }),
      footer: phoneFooter('menu'),
    }
  )
}

/** Helper: 4 identical TBD cats named after the rubrique */
function fourTbd(name, parentId) {
  return [1, 2, 3, 4].map((n) => ({
    label: name,
    tbd: true,
    go: `${parentId}-cat${n}`,
  }))
}

function pageMeteo() {
  return wrap(
    `
    <div class="banner-box">
      <strong>Météo — Kapan</strong>
      <div class="big-num">22°C</div>
      ${text('Ensoleillé · conditions…')}
    </div>
    <h2 class="sec">Prévisions (structure)</h2>
    <div class="h-scroll">
      ${['Lun', 'Mar', 'Mer', 'Jeu', 'Ven']
        .map(
          (d) => `
        <div class="tile static" style="min-width:64px;flex-direction:column">
          <span>${d}</span>
          <span class="ico-box"></span>
          <span class="meta">…°</span>
        </div>`
        )
        .join('')}
    </div>
    ${tbd('Source météo / détails — À préciser')}
    `,
    {
      header: phoneHeader({ title: 'Météo', backTo: 'vie-locale-hub' }),
      footer: phoneFooter('menu'),
    }
  )
}

function pageSignalement() {
  return wrap(
    `
    <h2 class="sec">Signalement</h2>
    ${tbd('Contenu signalement — À préciser plus tard')}
    <label class="field"><span>Type</span>
      <select><option>À préciser</option></select>
    </label>
    <label class="field"><span>Description</span><textarea rows="3" placeholder="Texte…"></textarea></label>
    <div class="field">
      <span>Photo</span>
      ${photo('Slot photo…')}
      <button class="hit btn" data-sim="upload">Ajouter photo (simulé)</button>
    </div>
    <label class="field"><span>Localisation</span>
      <button class="hit btn block" data-sim="position">Partager position (simulé)</button>
    </label>
    <button class="hit btn primary block" data-sim="signalement">Envoyer (simulé — À préciser)</button>
    `,
    {
      header: phoneHeader({ title: 'Signalement', backTo: 'vie-locale-hub' }),
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
  'mairie-rdv': { title: 'Prendre rendez-vous', side: 'user', group: 'Ma mairie', render: mairieRdv },
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
  'mairie-conseil': {
    title: 'Maire & Conseil',
    side: 'user',
    group: 'Ma mairie',
    render: () => mairieStub('Maire & Conseil municipal', 'Contenu institutionnel — À préciser'),
  },
  'mairie-infos': {
    title: 'Infos Mairie',
    side: 'user',
    group: 'Ma mairie',
    render: () => mairieStub('Infos Mairie', 'Infos mairie — À préciser'),
  },
  'mairie-plan': {
    title: 'Plan de la ville',
    side: 'user',
    group: 'Ma mairie',
    render: () => mairieStub('Plan de la ville', 'Carte interactive — À préciser'),
  },

  'infos-citoyen': { title: 'Infos citoyen', side: 'user', group: 'Social / contenus', render: infosCitoyen },
  'infos-feed': { title: 'Infos Feed', side: 'user', group: 'Social / contenus', render: infosFeed },
  'infos-reactions': { title: 'Réactions (overlay)', side: 'user', group: 'Social / contenus', render: infosReactions },
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
      }),
  },
  'dir-tourisme-patrimoine': {
    title: 'Tourisme — Patrimoine',
    side: 'user',
    group: 'Vie locale',
    render: () => rubriqueListe('Patrimoine', 'dir-tourisme'),
  },
  'dir-tourisme-nature': {
    title: 'Tourisme — Nature',
    side: 'user',
    group: 'Vie locale',
    render: () => rubriqueListe('Nature', 'dir-tourisme'),
  },
  'dir-tourisme-culture': {
    title: 'Tourisme — Culture',
    side: 'user',
    group: 'Vie locale',
    render: () => rubriqueListe('Culture', 'dir-tourisme'),
  },
  'dir-tourisme-activites': {
    title: 'Tourisme — Activités',
    side: 'user',
    group: 'Vie locale',
    render: () => rubriqueListe('Activités', 'dir-tourisme'),
  },

  'dir-education': {
    title: 'Éducation',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      rubriqueAccueil({
        title: 'Éducation',
        bannerTitle: 'Éducation',
        searchPh: 'Rechercher un établissement…',
        cats: [
          { label: 'Écoles', go: 'dir-education-ecoles' },
          { label: 'Formations', go: 'dir-education-formations' },
          { label: 'Universités', go: 'dir-education-universites' },
          { label: 'Activités', go: 'dir-education-activites' },
        ],
      }),
  },
  'dir-education-ecoles': {
    title: 'Éducation — Écoles',
    side: 'user',
    group: 'Vie locale',
    render: () => rubriqueListe('Écoles', 'dir-education'),
  },
  'dir-education-formations': {
    title: 'Éducation — Formations',
    side: 'user',
    group: 'Vie locale',
    render: () => rubriqueListe('Formations', 'dir-education'),
  },
  'dir-education-universites': {
    title: 'Éducation — Universités',
    side: 'user',
    group: 'Vie locale',
    render: () => rubriqueListe('Universités', 'dir-education'),
  },
  'dir-education-activites': {
    title: 'Éducation — Activités',
    side: 'user',
    group: 'Vie locale',
    render: () => rubriqueListe('Activités', 'dir-education'),
  },

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
      }),
  },
  'dir-cinemas-cinemas': {
    title: 'Cinémas',
    side: 'user',
    group: 'Vie locale',
    render: () => rubriqueListe('Cinémas', 'dir-cinemas'),
  },
  'dir-cinemas-theatres': {
    title: 'Théâtres',
    side: 'user',
    group: 'Vie locale',
    render: () => rubriqueListe('Théâtres', 'dir-cinemas'),
  },
  'dir-cinemas-programmes': {
    title: 'Programmes',
    side: 'user',
    group: 'Vie locale',
    render: () => rubriqueListe('Programmes', 'dir-cinemas'),
  },
  'dir-cinemas-spectacles': {
    title: 'Spectacles',
    side: 'user',
    group: 'Vie locale',
    render: () => rubriqueListe('Spectacles', 'dir-cinemas'),
  },

  'dir-economie': {
    title: 'Économie',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      rubriqueAccueil({
        title: 'Économie',
        bannerTitle: 'Économie',
        cats: [
          { label: 'Commerces', go: 'dir-economie-commerces' },
          { label: 'Entreprises', go: 'dir-economie-entreprises' },
          { label: 'Services', go: 'dir-economie-services' },
          { label: 'Services', tbd: true, go: 'dir-economie-services2' },
        ],
      }),
  },
  'dir-economie-commerces': {
    title: 'Commerces',
    side: 'user',
    group: 'Vie locale',
    render: () => rubriqueListe('Commerces', 'dir-economie'),
  },
  'dir-economie-entreprises': {
    title: 'Entreprises',
    side: 'user',
    group: 'Vie locale',
    render: () => rubriqueListe('Entreprises', 'dir-economie'),
  },
  'dir-economie-services': {
    title: 'Services',
    side: 'user',
    group: 'Vie locale',
    render: () => rubriqueListe('Services', 'dir-economie'),
  },
  'dir-economie-services2': {
    title: 'Services (À préciser)',
    side: 'user',
    group: 'Vie locale',
    render: () => rubriqueListe('Services', 'dir-economie', { tbdLabel: true }),
  },

  'dir-aide-sociale': {
    title: 'Aide sociale',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      rubriqueAccueil({
        title: 'Aide sociale',
        bannerTitle: 'Aide sociale',
        cats: [
          { label: 'Familles', go: 'dir-aide-familles' },
          { label: 'Seniors', go: 'dir-aide-seniors' },
          { label: 'Handicap', go: 'dir-aide-handicap' },
          { label: 'Aide sociale', tbd: true, go: 'dir-aide-cat4' },
        ],
      }),
  },
  'dir-aide-familles': {
    title: 'Familles',
    side: 'user',
    group: 'Vie locale',
    render: () => rubriqueListe('Familles', 'dir-aide-sociale'),
  },
  'dir-aide-seniors': {
    title: 'Seniors',
    side: 'user',
    group: 'Vie locale',
    render: () => rubriqueListe('Seniors', 'dir-aide-sociale'),
  },
  'dir-aide-handicap': {
    title: 'Handicap',
    side: 'user',
    group: 'Vie locale',
    render: () => rubriqueListe('Handicap', 'dir-aide-sociale'),
  },
  'dir-aide-cat4': {
    title: 'Aide sociale (À préciser)',
    side: 'user',
    group: 'Vie locale',
    render: () => rubriqueListe('Aide sociale', 'dir-aide-sociale', { tbdLabel: true }),
  },

  'dir-patrimoine': {
    title: 'Patrimoine',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      rubriqueAccueil({
        title: 'Patrimoine',
        bannerTitle: 'Patrimoine',
        cats: fourTbd('Patrimoine', 'dir-patrimoine'),
      }),
  },
  'dir-patrimoine-cat1': {
    title: 'Patrimoine (1)',
    side: 'user',
    group: 'Vie locale',
    render: () => rubriqueListe('Patrimoine', 'dir-patrimoine', { tbdLabel: true }),
  },
  'dir-patrimoine-cat2': {
    title: 'Patrimoine (2)',
    side: 'user',
    group: 'Vie locale',
    render: () => rubriqueListe('Patrimoine', 'dir-patrimoine', { tbdLabel: true }),
  },
  'dir-patrimoine-cat3': {
    title: 'Patrimoine (3)',
    side: 'user',
    group: 'Vie locale',
    render: () => rubriqueListe('Patrimoine', 'dir-patrimoine', { tbdLabel: true }),
  },
  'dir-patrimoine-cat4': {
    title: 'Patrimoine (4)',
    side: 'user',
    group: 'Vie locale',
    render: () => rubriqueListe('Patrimoine', 'dir-patrimoine', { tbdLabel: true }),
  },

  'dir-associations': {
    title: 'Associations',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      rubriqueAccueil({
        title: 'Associations',
        bannerTitle: 'Associations',
        cats: fourTbd('Associations', 'dir-associations'),
      }),
  },
  'dir-associations-cat1': {
    title: 'Associations (1)',
    side: 'user',
    group: 'Vie locale',
    render: () => rubriqueListe('Associations', 'dir-associations', { tbdLabel: true }),
  },
  'dir-associations-cat2': {
    title: 'Associations (2)',
    side: 'user',
    group: 'Vie locale',
    render: () => rubriqueListe('Associations', 'dir-associations', { tbdLabel: true }),
  },
  'dir-associations-cat3': {
    title: 'Associations (3)',
    side: 'user',
    group: 'Vie locale',
    render: () => rubriqueListe('Associations', 'dir-associations', { tbdLabel: true }),
  },
  'dir-associations-cat4': {
    title: 'Associations (4)',
    side: 'user',
    group: 'Vie locale',
    render: () => rubriqueListe('Associations', 'dir-associations', { tbdLabel: true }),
  },

  'dir-restaurants': {
    title: 'Restaurants',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      rubriqueAccueil({
        title: 'Restaurants',
        bannerTitle: 'Restaurants',
        cats: fourTbd('Restaurants', 'dir-restaurants'),
      }),
  },
  'dir-restaurants-cat1': {
    title: 'Restaurants (1)',
    side: 'user',
    group: 'Vie locale',
    render: () => rubriqueListe('Restaurants', 'dir-restaurants', { tbdLabel: true }),
  },
  'dir-restaurants-cat2': {
    title: 'Restaurants (2)',
    side: 'user',
    group: 'Vie locale',
    render: () => rubriqueListe('Restaurants', 'dir-restaurants', { tbdLabel: true }),
  },
  'dir-restaurants-cat3': {
    title: 'Restaurants (3)',
    side: 'user',
    group: 'Vie locale',
    render: () => rubriqueListe('Restaurants', 'dir-restaurants', { tbdLabel: true }),
  },
  'dir-restaurants-cat4': {
    title: 'Restaurants (4)',
    side: 'user',
    group: 'Vie locale',
    render: () => rubriqueListe('Restaurants', 'dir-restaurants', { tbdLabel: true }),
  },

  'dir-transports': {
    title: 'Transports',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      rubriqueAccueil({
        title: 'Transports',
        bannerTitle: 'Transports',
        cats: fourTbd('Transports', 'dir-transports'),
      }),
  },
  'dir-transports-cat1': {
    title: 'Transports (1)',
    side: 'user',
    group: 'Vie locale',
    render: () => rubriqueListe('Transports', 'dir-transports', { tbdLabel: true }),
  },
  'dir-transports-cat2': {
    title: 'Transports (2)',
    side: 'user',
    group: 'Vie locale',
    render: () => rubriqueListe('Transports', 'dir-transports', { tbdLabel: true }),
  },
  'dir-transports-cat3': {
    title: 'Transports (3)',
    side: 'user',
    group: 'Vie locale',
    render: () => rubriqueListe('Transports', 'dir-transports', { tbdLabel: true }),
  },
  'dir-transports-cat4': {
    title: 'Transports (4)',
    side: 'user',
    group: 'Vie locale',
    render: () => rubriqueListe('Transports', 'dir-transports', { tbdLabel: true }),
  },

  'dir-bibliotheques': {
    title: 'Bibliothèques',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      rubriqueAccueil({
        title: 'Bibliothèques',
        bannerTitle: 'Bibliothèques',
        cats: fourTbd('Bibliothèques', 'dir-bibliotheques'),
      }),
  },
  'dir-bibliotheques-cat1': {
    title: 'Bibliothèques (1)',
    side: 'user',
    group: 'Vie locale',
    render: () => rubriqueListe('Bibliothèques', 'dir-bibliotheques', { tbdLabel: true }),
  },
  'dir-bibliotheques-cat2': {
    title: 'Bibliothèques (2)',
    side: 'user',
    group: 'Vie locale',
    render: () => rubriqueListe('Bibliothèques', 'dir-bibliotheques', { tbdLabel: true }),
  },
  'dir-bibliotheques-cat3': {
    title: 'Bibliothèques (3)',
    side: 'user',
    group: 'Vie locale',
    render: () => rubriqueListe('Bibliothèques', 'dir-bibliotheques', { tbdLabel: true }),
  },
  'dir-bibliotheques-cat4': {
    title: 'Bibliothèques (4)',
    side: 'user',
    group: 'Vie locale',
    render: () => rubriqueListe('Bibliothèques', 'dir-bibliotheques', { tbdLabel: true }),
  },

  'dir-securite': {
    title: 'Sécurité',
    side: 'user',
    group: 'Vie locale',
    render: () =>
      rubriqueAccueil({
        title: 'Sécurité',
        bannerTitle: 'Sécurité',
        cats: fourTbd('Sécurité', 'dir-securite'),
      }),
  },
  'dir-securite-cat1': {
    title: 'Sécurité (1)',
    side: 'user',
    group: 'Vie locale',
    render: () => rubriqueListe('Sécurité', 'dir-securite', { tbdLabel: true }),
  },
  'dir-securite-cat2': {
    title: 'Sécurité (2)',
    side: 'user',
    group: 'Vie locale',
    render: () => rubriqueListe('Sécurité', 'dir-securite', { tbdLabel: true }),
  },
  'dir-securite-cat3': {
    title: 'Sécurité (3)',
    side: 'user',
    group: 'Vie locale',
    render: () => rubriqueListe('Sécurité', 'dir-securite', { tbdLabel: true }),
  },
  'dir-securite-cat4': {
    title: 'Sécurité (4)',
    side: 'user',
    group: 'Vie locale',
    render: () => rubriqueListe('Sécurité', 'dir-securite', { tbdLabel: true }),
  },

  'dir-fiche': {
    title: 'Fiche — Informations',
    side: 'user',
    group: 'Vie locale',
    render: () => dirFiche('infos'),
  },
  'dir-fiche-horaires': {
    title: 'Fiche — Horaires',
    side: 'user',
    group: 'Vie locale',
    render: () => dirFiche('horaires'),
  },
  'page-meteo': { title: 'Météo', side: 'user', group: 'Vie locale', render: pageMeteo },
  'page-signalement': { title: 'Signalement', side: 'user', group: 'Vie locale', render: pageSignalement },
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

export const NAV = [
  {
    side: 'user',
    label: 'Côté utilisateur',
    groups: [
      {
        name: 'Entrée',
        ids: ['ville-bienvenue', 'ville-modale-choisir', 'ville-modale-confirmer', 'accueil-kapan'],
      },
      {
        name: 'Santé (annuaire modèle)',
        ids: [
          'sante-accueil',
          'sante-urgences',
          'sante-pharmacies',
          'sante-pharmacie-infos',
          'sante-pharmacie-horaires',
          'sante-hopitaux',
          'sante-hopital-details',
          'sante-hopital-horaires',
          'sante-ambulances',
        ],
      },
      {
        name: 'Ma mairie',
        ids: [
          'mairie-accueil',
          'mairie-rdv',
          'mairie-rdv-suite',
          'mairie-presentation',
          'mairie-conseil',
          'mairie-infos',
          'mairie-plan',
        ],
      },
      {
        name: 'Social / contenus',
        ids: [
          'infos-citoyen',
          'infos-feed',
          'infos-reactions',
          'infos-commentaires',
          'infos-partage',
          'evenements-liste',
          'evenement-details',
          'evenement-participants',
          'annonces-liste',
          'annonce-details',
          'annonces-filtres',
          'emplois-liste',
          'emploi-details',
          'urgence-numeros',
          'messages',
          'messages-maville',
          'messages-thread',
          'enregistrements',
          'menu-plus',
          'etats-hub',
          'etat-vide',
          'etat-chargement',
          'etat-erreur',
          'etat-horaires-manquants',
          'a-preciser',
        ],
      },
      {
        name: 'Vie locale',
        ids: [
          'vie-locale-hub',
          'dir-tourisme',
          'dir-education',
          'dir-cinemas',
          'dir-economie',
          'dir-aide-sociale',
          'dir-patrimoine',
          'dir-associations',
          'dir-restaurants',
          'dir-transports',
          'dir-bibliotheques',
          'dir-securite',
          'dir-fiche',
          'dir-fiche-horaires',
          'page-meteo',
          'page-signalement',
          'communautes-groupes',
          'communautes-clubs',
          'communautes-rencontres',
        ],
      },
    ],
  },
  {
    side: 'admin',
    label: 'Côté administrateur',
    groups: [
      {
        name: 'Admin',
        ids: ['admin-home', 'admin-contenus', 'admin-fiche-edit', 'admin-moderation', 'admin-stats'],
      },
    ],
  },
]
