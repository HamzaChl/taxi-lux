# TAXI-LUX

Site React, TypeScript et Vite, déployable sur Vercel.

## Démarrage

```bash
npm install
npm run dev
```

`npm run build` vérifie TypeScript et génère le site de production.

## Adresses et carte

L’autocomplétion des adresses utilise Photon et les données OpenStreetMap, sans clé API. Elle démarre après trois caractères, avec une attente de 600 ms, et limite les résultats à la Belgique, aux Pays-Bas et au Luxembourg. Bruxelles sert de préférence géographique, sans exclure les autres villes du Benelux. Les adresses affichent la rue, le numéro, le code postal et la ville lorsque ces données sont disponibles.

Les requêtes utilisent le serveur public Photon de Komoot. Celui-ci limite les usages intensifs et ne garantit pas sa disponibilité ; pour un trafic élevé, prévoir une instance dédiée ou un fournisseur avec engagement de service.

La carte utilise React Leaflet avec les tuiles OpenStreetMap. Les itinéraires et distances sont calculés par OSRM.

## Déploiement

Le frontend et les fonctions API sont hébergés dans le même projet Vercel. Les variables SMTP et Stripe doivent être configurées dans les paramètres d’environnement Vercel. Ne jamais exposer `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` ou `SMTP_PASS` dans le frontend.
