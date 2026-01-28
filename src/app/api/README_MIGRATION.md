# Routes API Next.js - SUPPRIMÉES

## ⚠️ Ces routes ont été supprimées lors de la migration backend-first

**Date:** 2026-01-28

### Raisons de la suppression

Toutes les routes API Next.js de ce dossier ont été supprimées car:

1. **Sécurité:** Elles accédaient directement à MongoDB depuis le frontend
2. **Architecture:** Elles dupliquaient la logique du backend NestJS
3. **Maintenabilité:** Code dupliqué entre Next.js et NestJS
4. **Secrets exposés:** Risque d'exposition de credentials

---

## 📋 Routes supprimées et leurs remplacements

### Admin

| Ancien (Next.js) | Nouveau (Backend NestJS) |
|------------------|-------------------------|
| `POST /api/admin/beats` | `POST https://api.beatmakerz.fr/admin/beats` |
| `PUT /api/admin/beats/[id]` | `PUT https://api.beatmakerz.fr/admin/beats/:id` |
| `DELETE /api/admin/beats/[id]` | `DELETE https://api.beatmakerz.fr/admin/beats/:id` |
| `POST /api/admin/upload` | `POST https://api.beatmakerz.fr/files/upload` |

### Beats

| Ancien (Next.js) | Nouveau (Backend NestJS) |
|------------------|-------------------------|
| `GET /api/beats` | `GET https://api.beatmakerz.fr/beats` |

**Note:** Le backend supporte filtrage, pagination et recherche serveur.

### Checkout

| Ancien (Next.js) | Nouveau (Backend NestJS) |
|------------------|-------------------------|
| `POST /api/checkout/session` | `POST https://api.beatmakerz.fr/checkout/session` |

**Amélioration:** Le backend crée automatiquement une commande "pending" avant la session Stripe.

### Orders

| Ancien (Next.js) | Nouveau (Backend NestJS) |
|------------------|-------------------------|
| `GET /api/orders/[orderId]/download/[beatId]` | `GET https://api.beatmakerz.fr/orders/:orderId/download/:beatId` |

**Amélioration:** Le backend génère des URLs signées temporaires (10min).

### Stripe

| Ancien (Next.js) | Nouveau (Backend NestJS) |
|------------------|-------------------------|
| `POST /api/stripe/create-checkout-session` | `POST https://api.beatmakerz.fr/checkout/session` |
| `POST /api/stripe/create-embedded-checkout` | ❌ Non implémenté (utiliser checkout normal) |
| `POST /api/stripe/create-portal-session` | `POST https://api.beatmakerz.fr/stripe/portal` |
| `GET /api/stripe/session-status` | ❌ Utiliser Stripe client SDK |
| `POST /api/stripe/webhook` | `POST https://api.beatmakerz.fr/webhooks/stripe` |

**Amélioration webhook:**
- Vérification de signature Stripe
- Déduplication des événements
- Traitement complet (emails, PDF, downloads)

---

## 🔄 Migration des appels

### Avant (Route API Next.js)

```typescript
// ❌ Appelait une route Next.js qui accédait à MongoDB
const response = await fetch('/api/beats');
const beats = await response.json();
```

### Après (Backend API)

```typescript
// ✅ Appelle directement le backend NestJS
import { fetchBeats } from '@/lib/beats.service';

const response = await fetchBeats({
  query: 'trap',
  limit: 12,
});
```

---

## 🛡️ Bénéfices de la migration

### Sécurité

- ✅ Secrets jamais exposés au client
- ✅ Authentification JWT robuste
- ✅ Validation serveur systématique
- ✅ CORS configuré correctement

### Architecture

- ✅ Logique métier centralisée dans le backend
- ✅ Pas de duplication de code
- ✅ Backend testable unitairement
- ✅ Frontend simple (UI seulement)

### Performance

- ✅ Pagination serveur
- ✅ Filtrage côté base de données
- ✅ Cache possible (Redis)
- ✅ Moins de données transférées

---

## 📚 Documentation

- API Backend: `BACKEND_API_DOCUMENTATION.md`
- Guide de migration: `MIGRATION_GUIDE.md`
- Sécurité: `SECURITY_MIGRATION.md`

---

## 🚨 Important

**NE PAS recréer ces routes !**

Si vous avez besoin d'une nouvelle fonctionnalité:
1. Implémenter dans le backend NestJS
2. Créer un service frontend qui appelle le backend
3. Utiliser `AuthService.authenticatedFetch()` pour les routes protégées

---

**Cette migration a été effectuée pour améliorer la sécurité et la maintenabilité du projet.**
