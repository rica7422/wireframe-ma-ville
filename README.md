# Wireframe Ma Ville

Prototype de structure navigable pour **Ma Ville** (MIASIN hors scope).  
Panneau gauche = navigation · téléphone 390 px = structure (pas un mockup hi‑fi).

## Lancer en local

```bash
npm install
npm run dev
```

Ouvre [http://127.0.0.1:4317](http://127.0.0.1:4317).

## Build / Vercel

```bash
npm run build
npx vercel deploy dist --prod --yes --project wireframe-ma-ville
```

Sans login CLI, un déploiement anonyme (`--temporary`) est possible ; **revendiquer** le Claim link puis renommer le projet en `wireframe-ma-ville` (Settings → General → Project Name) pour obtenir `https://wireframe-ma-ville.vercel.app`.
