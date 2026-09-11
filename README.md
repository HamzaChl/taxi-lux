# Taxi Lux

Base front-end React + TypeScript construite avec Vite, React Router, Tailwind CSS et Radix UI.

## Démarrage

```bash
npm install
npm run dev
```

## Scripts

- `npm run dev` — serveur de développement
- `npm run build` — vérification TypeScript et build de production
- `npm run lint` — analyse ESLint
- `npm run preview` — aperçu local du build

## Déploiement Vercel

Importez le dépôt dans Vercel. Le preset Vite est détecté automatiquement et `vercel.json` redirige les routes vers l’application React.

### Variables d’environnement

Ajoutez ces variables dans les environnements Preview et Production du projet Vercel :

```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
SMTP_HOST=mail.infomaniak.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=info@taxi-lux.be
SMTP_PASS=...
COMPANY_EMAIL=info@taxi-lux.be
SEND_CUSTOMER_MAIL=true
```

`VITE_PAYMENTS_API_URL` doit rester vide lorsque les fonctions et le frontend sont déployés dans le même projet Vercel.

### Webhook Stripe

Créez un webhook dans le Dashboard Stripe avec cette URL :

```text
https://taxi-lux.be/api/stripe/webhook
```

Sélectionnez l’événement `payment_intent.succeeded`, puis copiez le secret de signature généré dans `STRIPE_WEBHOOK_SECRET`.

### E-mails

Les fonctions Vercel utilisent Nodemailer avec le serveur SMTP Infomaniak. Le mot de passe SMTP doit être enregistré uniquement dans les variables d’environnement Vercel.

### Tests avant production

Utilisez d’abord les clés Stripe `pk_test_...` et `sk_test_...`, ainsi que le secret du webhook de test. Effectuez un paiement complet et vérifiez la réception des e-mails avant de remplacer les clés de test par les clés Live.
