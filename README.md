# Beatmakerz

Plateforme web de vente d''instrumentales construite avec [Next.js](https://nextjs.org/).

## Scripts

- `npm run dev` : demarre le serveur de developpement.
- `npm run build` : compile l'application pour la production.
- `npm run start` : lance l'application compilee.
- `npm run lint` : execute ESLint selon la configuration du projet.
- `npm run typecheck` : verifie les types TypeScript sans generer de fichiers.

## Prerequis

- Node.js 18 ou superieur
- npm 10 ou superieur

## Installation

```bash
npm install
```

## Lancement en developpement

```bash
npm run dev
```

## Configuration Stripe

1. Copier le fichier `.env.example` en `.env.local`.
2. Renseigner `STRIPE_SECRET_KEY` et `STRIPE_WEBHOOK_SECRET` avec les cles testes depuis le dashboard Stripe.
3. Definir `APP_URL` et `NEXT_PUBLIC_APP_URL` avec l'URL de votre application (ex: `http://localhost:3000`).
4. Renseigner les differentes variables `NEXT_PUBLIC_STRIPE_LOOKUP_*` avec les lookup keys des tarifs Stripe associes a chaque offre et cycle de facturation.
5. Definir `NEXT_PUBLIC_STRIPE_PRICE_BEAT` si toutes les prods utilisent le meme tarif (par exemple `price_...`).
6. Relancer le serveur Next.js pour que les nouvelles variables soient prises en compte.

### Webhooks en local

Pour recevoir les webhooks Stripe en local, utilisez la CLI Stripe :

```bash
stripe listen --forward-to http://localhost:3000/api/stripe/webhook
```

Pensez a mettre a jour `STRIPE_WEBHOOK_SECRET` avec la valeur retournee par la commande ci-dessus.
## Checkout integre

- Navigue vers `/web/abonnements` et clique sur `S'abonner` pour un plan afin d'ouvrir le checkout integre.
- Tu peux aussi ouvrir directement `/checkout?lookupKey=TON_LOOKUP_KEY` pour tester un tarif precis (`mode=payment` par defaut, ajoute `&mode=subscription` pour un abonnement).
- Stripe redirigera vers `/return?session_id=...` une fois le paiement termine. Cette page affiche le statut et permet de revenir aux abonnements.
- Pour reprendre un paiement interrompu, conserve le `session_id` et ouvre `/checkout?session_id=...`.






