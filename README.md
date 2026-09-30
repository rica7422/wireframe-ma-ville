# Ma Ville — wireframe interactif

Prototype de structure navigable pour **Ma Ville** (MIASIN hors scope).  
Panneau gauche = navigation · téléphone 390 px = structure (pas un mockup hi‑fi). Charte mairie : teal `#29676D`.

## Lancer en local

```bash
npm install
npm run dev
```

Ouvre [http://127.0.0.1:4317](http://127.0.0.1:4317).

- Port fixe : **4317** (`vite.config.js`)
- Actions Appeler / Itinéraire / Message → toast « simulé »
- Zones non définies → **À préciser**

## Contenu (Ma mairie)

- Accueil Publications / Événements / Informations + grille d’accès
- RDV : liste de motifs avec **›** (pas de bouton Continuer) → date / créneaux → confirmation
- Présentation type publications (photo, titre, J’aime / Commentaire / Partage, sheet options)
- Nouvelle publication + sheet Médias, Maire & Conseil, Infos Mairie (filtres), édition admin stub

## Partage durable (Vercel)

Les URLs anonymes Vercel expirent (~60 min) **sauf si vous les revendiquez**.

1. Ouvrir le **lien Claim** fourni après le déploiement (validité limitée).
2. Se connecter à Vercel et accepter le déploiement.
3. Dans Vercel : **Project Settings → General → Project Name** (ex. `ma-ville-wireframe`) pour changer le sous-domaine `*.vercel.app`.

```bash
npm run build
npx vercel deploy dist --yes
# récupérer claim URL dans la sortie / .vercel/anonymous.json
```

## Build

```bash
npm run build
npm run preview
```
