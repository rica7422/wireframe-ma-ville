# Ma Ville — wireframe interactif (local)

Prototype de structure navigable pour **Ma Ville** (MIASIN hors scope).  
Panneau gauche = navigation du prototype · téléphone 390 px = structure (pas un mockup hi‑fi).

## Lancer en local

```bash
npm install
npm run dev
```

Ouvre [http://127.0.0.1:4317](http://127.0.0.1:4317) dans Chrome.

- Port fixe : **4317** (`vite.config.js`)
- Clics dans le téléphone et dans le panneau gauche naviguent entre les écrans
- Actions Appeler / Itinéraire / Message → toast « simulé »
- Zones non définies → libellé **À préciser**

## Contenu

- **Côté utilisateur** : entrée (choix de ville), accueil Kapan, Santé (modèle annuaire), Ma mairie, social/contenus, Vie locale (hub + rubriques), **Météo** (accueil synthèse + Maintenant / Aujourd’hui / Demain / 7 jours), états UI
- **Côté administrateur** : coquilles (home, liste contenus, édition) — workflows non inventés
- Écrans navigables (structure only) ; valeurs météo illustratives ou **Indisponible**

## Qui peut voir le wireframe ?

| Mode | Visibilité |
|---|---|
| `npm run dev` | Localhost (toi seul) |
| Tunnel trycloudflare | Partage temporaire tant que la VM tourne |
| Build static + Vercel/Cloudflare claim | Lien partageable durable (PC éteint) |

```bash
npm run build
# puis déployer dist/ (ex. vercel deploy dist --temporary, puis claim)
```

## Build

```bash
npm run build
npm run preview
```
