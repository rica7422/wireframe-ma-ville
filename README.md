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

- **Côté utilisateur** : entrée (choix de ville), accueil Kapan, Santé (modèle annuaire), Ma mairie, social/contenus, Vie locale (hub + Tourisme/Cinémas structurés), états UI
- **Côté administrateur** : coquilles (home, liste contenus, édition) — workflows non inventés
- ~70 écrans navigables (structure only)

## Qui peut voir le wireframe ?

| Mode | Visibilité |
|---|---|
| `npm run dev` sur **ton PC** | Toi seul (localhost) |
| Serveur démarré dans cet environnement cloud | Lien partagé dans la session agent |
| Repo cloné par un collègue | Chacun lance en local chez soi |

Ce n’est **pas** un site public hébergé : il faut lancer le serveur localement (ou déployer ailleurs si tu le souhaites plus tard).

## Build

```bash
npm run build
npm run preview
```
