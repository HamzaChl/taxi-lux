# Endpoint des tarifs mobiles

Le projet React utilise Vite. La fonction Vercel `api/pricing.ts` est accessible
publiquement via la réécriture `/wp-json/taxilux/v1/pricing` → `/api/pricing`.
Les réécritures existantes et les autres fonctions API sont conservées.

Modifier les tarifs mobiles dans **`config/mobile-pricing.ts`**, y compris
`updatedAt` lors d'un changement. Conserver les nombres sans guillemets et
le champ obligatoire `hourlyRate`. La prise en charge (2,60 € jour / 4,60 € nuit)
et le tarif kilométrique (2,30 €/km, aucun kilomètre inclus) reprennent ceux du
calculateur web dans `src/constants/pricing.ts`. L'endpoint mobile ne facture
pas d'attente (`hourlyRate: 0`) et ne définit aucun minimum de course.
Les deux tranches ont le même tarif ; le seuil de 35 km reste présent pour
conserver le format attendu par l'application.

Chaque modification nécessite un **redéploiement du site Vercel**, mais aucune
nouvelle publication de l'application mobile. Aucun compte, secret ni base de
données n'est requis pour cet endpoint. GET renvoie le JSON, OPTIONS renvoie
204 pour le prévol CORS, les autres méthodes renvoient 405. Les réponses
interdisent le cache navigateur et CDN ; le cache mobile existant peut encore
conserver les anciennes valeurs pendant cinq minutes.

## Vérification locale

```sh
npm run build
npm run lint
vercel dev --listen 3100
# Dans un autre terminal :
node scripts/check-pricing.mjs
```

Utiliser `vercel dev` pour tester la fonction et la réécriture : `npm run dev`
seul sert le frontend Vite.
Le script vérifie les valeurs exactes configurées ; adapter ces valeurs
de référence lors d'une future modification des tarifs.

## Déploiement (à effectuer manuellement)

1. Inclure les nouveaux fichiers et `vercel.json` dans le commit du projet.
2. Déployer via le workflow Git connecté à Vercel, ou exécuter `vercel --prod`
   depuis ce projet déjà lié à Vercel.
3. Vérifier la réponse sur le domaine de production :

```sh
curl -i https://taxi-lux.be/wp-json/taxilux/v1/pricing
node scripts/check-pricing.mjs https://taxi-lux.be
```

Attendu : HTTP 200, `Content-Type: application/json`, `Cache-Control: no-store`
et le JSON défini dans la configuration. Aucun déploiement n'est lancé par
le script de vérification.
