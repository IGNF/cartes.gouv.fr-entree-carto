# Intégrer l'authentification OIDC et le service de documents

Ce guide concerne `authentification-vue-oidc` **0.1.0** et le service de documents personnels de l'entrée cartographique.

Les exemples sont en JavaScript ESM et Vue 3 avec `<script setup>`.
L'alias `@/` des exemples désigne le dossier `src/` du projet.

## Sommaire

- [Intégrer l'authentification OIDC et le service de documents](#intégrer-lauthentification-oidc-et-le-service-de-documents)
  - [Sommaire](#sommaire)
  - [1. Responsabilités et prérequis](#1-responsabilités-et-prérequis)
  - [2. Configuration publique](#2-configuration-publique)
  - [3. Initialiser l'application](#3-initialiser-lapplication)
    - [Routes et retour de connexion (optionnel)](#routes-et-retour-de-connexion-optionnel)
    - [Callback silencieux statique (optionnel)](#callback-silencieux-statique-optionnel)
  - [4. Utiliser l'authentification dans les composants](#4-utiliser-lauthentification-dans-les-composants)
    - [Écouter les événements d'authentification](#écouter-les-événements-dauthentification)
  - [5. Initialiser la synchronisation des documents](#5-initialiser-la-synchronisation-des-documents)
  - [6. Utiliser le service dans les composants](#6-utiliser-le-service-dans-les-composants)
    - [Récupérer l'instance et afficher le cache réactif](#récupérer-linstance-et-afficher-le-cache-réactif)
    - [Charger explicitement une catégorie](#charger-explicitement-une-catégorie)
    - [Enregistrer un document](#enregistrer-un-document)
    - [Principales méthodes métier](#principales-méthodes-métier)
    - [Requêtes authentifiées et erreurs](#requêtes-authentifiées-et-erreurs)
    - [Événements sur les documents](#événements-sur-les-documents)
  - [7. Stockage et inspection en debug](#7-stockage-et-inspection-en-debug)
  - [8. Vérification avant livraison](#8-vérification-avant-livraison)
  - [9. Diagnostic rapide](#9-diagnostic-rapide)

## 1. Responsabilités et prérequis

| Élément | Responsabilité |
| --- | --- |
| Bibliothèque `authentification-vue-oidc` | Session OIDC, profil, tokens, renouvellement, connexion et déconnexion |
| `createAuthOptions()` | Adaptation de la configuration publique de l'application aux options OIDC |
| Plugin local `createServices()` | Création et injection d'une instance de `Service` |
| `Service` et ses mixins | Requêtes vers l'espace personnel et manipulation des documents |
| Store Pinia `service` | Documents réactifs et booléen `authentificated` |
| `useServiceSyncDocuments()` | Coordination entre session OIDC et chargement/vidage des documents |

Le service de documents personnels **ne fait pas partie du paquet OIDC** : l'importer depuis
ce projet ne suffit pas à le rendre disponible dans une autre application.

Pour le réutiliser ailleurs, reprendre son plugin, ses mixins, `ServiceError`, le store
et les contrats du bus d'événements, en adaptant les alias et les dépendances.

Prérequis :

- Vue >= 3.4, Pinia et, pour les exemples de navigation, Vue Router >= 4.
- Un client OIDC de type **SPA publique**, Authorization Code + PKCE, sans secret.
- Un fournisseur et une API accessibles depuis le navigateur, avec CORS adapté.
- Des URL HTTPS ; HTTP est accepté sur localhost par la bibliothèque.
- Les URI exactes de connexion, de déconnexion et de renouvellement silencieux
  autorisées dans le client du fournisseur IAM.
- Le fournisseur doit autoriser son écran de session silencieuse en iframe depuis
  l'application. CSP et blocage des cookies tiers peuvent empêcher ce mécanisme.

Installation du paquet fourni :

```bash
npm install ./authentification-vue-oidc-0.1.0.tgz
```

ou

```bash
npm install authentification-vue-oidc@0.1.0
```

Le paquet utilise le client OIDC `oidc-client-ts`.

## 2. Configuration publique

Le module [authentification-options.js](../src/config/authentification-options.js) exporte `createAuthOptions()`.
Il retourne les options à transmettre à `createAuth`.
Il n'installe aucun plugin et ne réalise aucune requête documentaire.

Exemple de variables dans `env/.env.development-local` :

```dotenv
IAM_DISABLE="0"
IAM_URL="https://sso.example.org"
IAM_REALM="mon-realm"
IAM_CLIENT_ID="mon-client-public"
IAM_ENTREPOT_API_URL="https://api.example.org/api"
IAM_REDIRECT_URI=""
IAM_POST_LOGOUT_REDIRECT_URI=""
IAM_SILENT_REDIRECT_URI=""
IAM_SCOPE="openid,profile,email"
IAM_STORAGE="memory"
IAM_DEBUG="false"
```

| Variable | Règle appliquée par `createAuthOptions()` |
| --- | --- |
| `IAM_AUTHORITY` | Issuer complet, prioritaire sur `IAM_URL` + `IAM_REALM` |
| `IAM_URL`, `IAM_REALM` | Construisent l'issuer `IAM_URL/realms/IAM_REALM` |
| `IAM_CLIENT_ID` | Identifiant public requis |
| `IAM_ENTREPOT_API_URL` | Base du service de documents et seule base autorisée à recevoir le **Bearer** |
| `IAM_REDIRECT_URI` | Si vide : origine + `BASE_URL` + `login` |
| `IAM_POST_LOGOUT_REDIRECT_URI` | Si vide : accueil sous `BASE_URL` |
| `IAM_SILENT_REDIRECT_URI` | Si vide : origine + `BASE_URL` + `silent-renew.html` |
| `IAM_SCOPE` | Défaut `openid profile email` ; les virgules sont converties en espaces |
| `IAM_STORAGE` | `memory` par défaut, ou `session` pour le stockage OIDC dans l'onglet |
| `IAM_DEBUG` | La chaîne `true` active les diagnostics OIDC et l'instantané documentaire de debug |
| `IAM_DISABLE` | `1` désactive la restauration silencieuse au démarrage ; le masquage des actions reste une responsabilité UI |

Les variables sont publiques. 
Ne jamais fournir `IAM_CLIENT_SECRET`, même vide,
ni placer un secret dans un fichier de configuration exposé au navigateur.
Le helper de la bibliothèque rejette les clés `IAM_*` contenant `secret`.

Le projet expose déjà `IAM_` dans `envPrefix` de Vite et utilise un plugin de configuration runtime.

Exemple pour une application servie sous `https://cartes.example.org/explorer/` :

| Usage | URI à autoriser dans IAM |
| --- | --- |
| Connexion | `https://cartes.example.org/explorer/login` |
| Déconnexion | `https://cartes.example.org/explorer/` |
| Renouvellement silencieux | `https://cartes.example.org/explorer/silent-renew.html` |

`BASE_URL` est le chemin de déploiement Vite.
Le définir via la configuration de build du projet ; une variable d'environnement serveur non exposée au navigateur
ne suffit pas à changer les URL d'un bundle déjà construit.

## 3. Initialiser l'application

Dans [main.ts](../src/main.ts), l'ordre important est le suivant :

1. Installer Pinia et le bus avant les services qui les consomment.
2. Installer `createAuth(createAuthOptions())` : l'initialisation OIDC commence ici.
3. Créer et installer le service documentaire avec `createAuthFetch()`.
4. Enregistrer le guard officiel, installer le routeur, attendre `router.isReady()`.
5. Monter le composant racine qui démarre la synchronisation documentaire.

Extrait d'intégration, à ajouter aux autres plugins de l'application :

```javascript
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createAuth, createAuthFetch, createAuthGuard } from 'authentification-vue-oidc';
import { createAuthOptions } from '@/config/authentification-options.js';
import { createServices } from '@/plugins/Services.js';
import { createBusEvent } from '@/plugins/BusEvent.js';
import App from '@/App.vue';
import router from '@/router/index';

const app = createApp(App);
app.use(createPinia());
app.use(createBusEvent());

const authOptions = createAuthOptions();
app.use(createAuth(authOptions));
app.use(createServices({ fetcher: createAuthFetch() }));

router.beforeEach(createAuthGuard());
app.use(router);
await router.isReady();
app.mount('#app');
```

Conserver les autres plugins requis par votre application, par exemple DSFR, logger et notifications.

`createAuth()` retourne un plugin *opaque*, pas l'API d'authentification.

Utiliser `useAuth()` **après installation**, dans `setup()` ou dans du code externe.

### Routes et retour de connexion (optionnel)

La bibliothèque traite elle-même le callback `code`/`state` et nettoie l'URL.
Ne pas échanger le code, vérifier le state ou renouveler les tokens dans les vues.
La route `/login` du projet est marquée `meta.isAuthCallback: true`.

Le guard officiel consomme la destination `returnTo` enregistrée par `login()`.
Il reste donc utile même si la carte est publique. Une route exigeant une session
peut définir `meta.requiresAuth: true` ; les routes publiques restent accessibles.
Les rôles front-end ne remplacent jamais les contrôles d'autorisation de l'API.

Le serveur HTTP doit servir la SPA pour `/login` sous `BASE_URL` sans perdre la query string. 

Les vues [Login.vue](../src/views/Login.vue) et
[Logout.vue](../src/views/Logout.vue) délèguent à la bibliothèque et conservent les
points d'entrée historiques ; les boutons UI peuvent appeler les actions directement.

### Callback silencieux statique (optionnel)

Distribuer [silent-renew.html](../public/silent-renew.html) et [silent-renew.js](../public/silent-renew.js) sous le même `BASE_URL`.
Le HTML charge `./silent-renew.js`, avec un chemin relatif. 

Le script relaie :

```javascript
window.parent.postMessage(
  { source: 'oidc-client', url: window.location.href, keepOpen: false },
  window.location.origin,
);
```

## 4. Utiliser l'authentification dans les composants

```js
<script setup>
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useAuth } from 'authentification-vue-oidc';

const route = useRoute();
const { user, status, isAuthenticated, login, logout } = useAuth();
const pending = ref(false);
const message = ref('');
const disabled = computed(() => pending.value ||
  ['initializing', 'authenticating'].includes(status.value));

async function changeSession() {
  pending.value = true;
  message.value = '';
  try {
    if (isAuthenticated.value) {
      await logout();
    } else {
      await login({ returnTo: route.fullPath });
    }
  } catch {
    message.value = 'Impossible de terminer cette action.';
  } finally {
    pending.value = false;
  }
}
</script>

<template>
  <p v-if="isAuthenticated">{{ user?.name || user?.email }}</p>
  <button type="button" :disabled="disabled" @click="changeSession">
    {{ isAuthenticated ? 'Se déconnecter' : 'Se connecter' }}
  </button>
  <p v-if="message" role="alert">{{ message }}</p>
</template>
```

(Dans l'application, réutiliser les composants DSFR à la place du bouton natif de cet exemple minimal.)

| API de `useAuth()` | Usage |
| --- | --- |
| `isAuthenticated` | Ref readonly indiquant la session ; utiliser `.value` dans le script |
| `status` | Ref readonly ; notamment `initializing`, `unauthenticated`, `authenticating`, `authenticated`, `error` |
| `user` | Ref readonly : `sub`, `name`, `email`, `roles`, `claims` ; peut valoir `null` |
| `error` | Ref readonly contenant la dernière `AuthError`, ou `null` |
| `login({ returnTo })` | Lance la redirection de connexion et mémorise la destination |
| `logout()` | Lance la déconnexion avec `postLogoutRedirectUri` configurée |
| `getAccessToken()` | Retourne une promesse de token valide, avec renouvellement géré par la bibliothèque |
| `hasRole(role)` | Indication UI ; l'API doit toujours contrôler les droits |
| `on(event, handler)` | Abonnement ; retourne une fonction de désabonnement |

Pour `login`, utiliser `route.fullPath` sans ajouter `BASE_URL` : Vue Router gère
déjà ce préfixe. Le retour doit rester sur la même origine.

Note :
> Le profil OIDC n'utilise pas directement les anciens champs `first_name` / `last_name` de l'API documentaire ; les informations complémentaires peuvent se trouver dans `user.claims`.

Avec la version **0.1.0**, préférer `logout()` sans surcharge `returnTo` :
cette surcharge est normalisée en chemin relatif. `postLogoutRedirectUri` doit, elle,
être une URI absolue autorisée par IAM.

### Écouter les événements d'authentification

```javascript
import { onUnmounted } from 'vue';
import { useAuth } from 'authentification-vue-oidc';

const auth = useAuth();
const unsubscribe = auth.on('sessionExpired', () => {
  console.warn('La session a expiré. Une nouvelle connexion peut être nécessaire.');
});
onUnmounted(unsubscribe);
```

Autres événements : `login`, `logout`, `tokenRefreshed`, `error`.

## 5. Initialiser la synchronisation des documents

[App.vue](../src/App.vue) est le point d'intégration racine, stable entre les routes.
Il appelle [useServiceSyncDocuments](../src/services/ServiceSyncDocuments.js) une seule fois, depuis `setup()`, après installation des plugins :

```javascript
import { inject } from 'vue';
import { useAuth } from 'authentification-vue-oidc';
import { useServiceStore } from '@/stores/serviceStore';
import { useServiceSyncDocuments } from '@/services/ServiceSyncDocuments';

const service = inject('services');
const emitter = inject('emitter');
if (!service || !emitter) throw new Error('Missing document services');

useServiceSyncDocuments(useAuth(), service, useServiceStore(), emitter, () => {
  console.warn("Certains documents de l'espace personnel ne sont pas disponibles.");
});
```

`useServiceSyncDocuments` est un composable.
Son watcher observe `isAuthenticated` et l'identifiant `user` :

- Il s'exécute immédiatement, y compris si la session est déjà restaurée avant montage.
- Il met à jour le miroir `store.authentificated`, puis remet les documents à zéro.
- Si la session a un sujet authentifié, il charge les documents.
- Une déconnexion ou un changement de compte vide le cache avant tout rechargement.
- Un simple changement de profil avec le même `user` ne recharge pas les documents.
- Une réponse devenue obsolète ne publie plus d'événement ni de notification.

Note:
> Ne pas l'appeler dans chaque composant : cela multiplierait les chargements et les resets.

Le store garde exactement `documents` et `authentificated`. Ce dernier est un
miroir pour les composants métier, jamais une preuve d'autorisation côté serveur.

## 6. Utiliser le service dans les composants

### Récupérer l'instance et afficher le cache réactif

```js
<script setup>
import { computed, inject } from 'vue';
import { useAuth } from 'authentification-vue-oidc';

const service = inject('services');
if (!service) throw new Error('Missing document service');
const { isAuthenticated } = useAuth();
const drawings = computed(() => service.documents.drawing || []);
</script>

<template>
  <ul v-if="isAuthenticated">
    <li v-for="document in drawings" :key="document._id">{{ document.name }}</li>
  </ul>
</template>
```

`inject('services')` retourne directement l'instance de `Service`.

En revanche, `useServices()` exporté par [Services.js](../src/plugins/Services.js) retourne le **plugin**, dont la propriété `instance` est le service. Ne pas confondre les deux.

`documents` est défini dans le constructeur du service, avec la même référence réactive que `useServiceStore().documents`.

`resetDocuments()` renouvelle cette référence des deux côtés.

Les catégories sont `drawing`, `import`, `compute`, `service` et `carte`.

Au démarrage, `documents` vaut `{}` ; une catégorie absente n'est pas encore chargée, contrairement à un tableau vide qui représente une catégorie chargée vide.
Une catégorie en échec peut rester absente.

### Charger explicitement une catégorie

La synchronisation racine gère le chargement initial.

Pour un rafraîchissement demandé par l'utilisateur, appeler par exemple :

```javascript
async function refreshDrawings() {
  if (!isAuthenticated.value) return;
  try {
    await service.getDocumentsByLabel('drawing');
  } catch {
    console.warn('Impossible de recharger les croquis.');
  }
}
```

`getDocuments()` retourne le résultat de **`Promise.allSettled`**, dans l'ordre de `service.labels`, pas directement l'objet documentaire du store.

Inspecter chaque résultat : la promesse globale peut se résoudre même si certaines catégories ont échoué. Le callback d'erreur signale aussi les échecs partiels.

### Enregistrer un document

Extrait à placer dans un composant ayant injecté `service` et appelé `useAuth` :

```javascript
async function saveDrawing() {
  if (!isAuthenticated.value || !Array.isArray(service.documents.drawing)) return;
  try {
    const result = await service.setDocument({
      type: 'drawing',
      name: 'Mon croquis',
      description: 'Croquis de démonstration',
      format: 'kml',
      target: 'internal',
      content: '<kml xmlns="http://www.opengis.net/kml/2.2"><Document /></kml>',
    });
    console.info('Document enregistré', result.uuid, result.action);
  } catch {
    console.warn("Impossible d'enregistrer le croquis.");
  }
}
```

Le service construit le `FormData`, envoie la requête et met à jour le tableau des documents. 

Ne pas définir manuellement le `Content-Type`.

Le résultat contient notamment `uuid` et `action`.

**Attention à la confidentialité** :
> La creation d'un document ajoute `url_public=true` à la
création. Tous les documents ont un partage public.

### Principales méthodes métier

| Méthode | Utilisation / limite |
| --- | --- |
| `getDocuments()` | Charge les cinq catégories avec résultats `allSettled` |
| `getDocumentsByLabel(label)` | Charge et trie une catégorie, avec pagination |
| `find(uuid)` | Recherche dans le cache, retourne un document ou `null` |
| `getDocumentById(uuid)` | Recharge les métadonnées d'un document déjà présent dans le cache |
| `getFileById(uuid)` | Télécharge le fichier ; JSON ou texte selon le Content-Type traité |
| `getDrawing(uuid)` | Lecture d'un croquis via `getFileById` |
| `getImport(uuid)`, `getService(uuid)` | Lecture adaptée aux labels et au document déjà chargé ; une URL externe peut être retournée |
| `getCompute(uuid)`, `getCartes(uuid)` | Lecture du contenu avec les contrôles métier associés |
| `setDocument(options)` | Création et ajout au cache de la catégorie cible |
| `updateGeometryDocument(options)` | Modification du contenu |
| `updateMetadataDocument(options)`, `updateLabelsDocument(options)` | Modification des métadonnées ou labels |
| `renameDocument(options)`, `sharingDocument(options)` | Renommage ou changement de partage |
| `deleteDocument(options)` | Suppression distante et mise à jour du cache |
| `resetDocuments()` | Vidage local et invalidation de réponses d'une génération précédente ; aucune suppression serveur |

Pour les champs exacts des objets de modification et de suppression, se reporter
aux méthodes de [ServiceSetDocuments.js](../src/services/ServiceSetDocuments.js).

Les adaptations de lecture sont dans [ServiceGetDocuments.js](../src/services/ServiceGetDocuments.js)
et les requêtes/pagination dans [ServiceDocuments.js](../src/services/ServiceDocuments.js).

### Requêtes authentifiées et erreurs

`createAuthFetch()` ajoute un token courant seulement aux bases autorisées par `apiBaseUrls`.
Sur une réponse 401, il tente un renouvellement puis une seule nouvelle requête. 

Ne pas ajouter un deuxième mécanisme de refresh/retry dans le service. Les URL hors base autorisée ne reçoivent pas automatiquement de token.

Le fetch par défaut de `new Service()` est le fetch natif.

Les erreurs métier passent par [ServiceError](../src/services/ServiceError.js) et
peuvent exposer `type`, `status` et `code`. Une suppression distante peut donner
`DOC_DELETED_REMOTELY` avec un statut 404. Ne pas afficher de cause technique brute
ou de token dans l'UI. Un 403 ne signifie pas nécessairement que la session est
terminée : l'utilisateur peut simplement ne pas disposer du droit attendu.

### Événements sur les documents

Le bus local (`emitter`) fournit `addEventListener` et `dispatchEvent`.
Ses événements doivent être déclarés dans le registre du projet.
Les abonnements `addEventListener` sont à créer dans `setup()` : le plugin les installe au montage et les retire au démontage.

- `service:documents:completed` : une catégorie est chargée ; payload direct
  `{ label, data, total }`.
- `service:documents:loaded` : chargement global terminé ; payload
  `{ detail: resultats }`, émis par `useServiceSyncDocuments`.

Les événements `document:saved`, `document:updated` et `document:deleted` utilisés par l'UI sont émis par les actions applicatives.

## 7. Stockage et inspection en debug

- Les documents et `authentificated` restent en mémoire dans Pinia.
- `Service.documents` ne contient aucun état d'authentification propre au service.
- Le stockage OIDC appartient exclusivement à la bibliothèque, selon `IAM_STORAGE`.
- `saveStore()` ne persiste pas le store Pinia complet et ne sauvegarde rien sur le serveur.

Avec `IAM_DEBUG=true`, `saveStore()` écrit uniquement les documents dans `sessionStorage` sous la clé **`service:documents:debug`**. Consulter les outils du navigateur : **Application > Session Storage > origine de l'application**.

## 8. Vérification avant livraison

1. Vérifier l'issuer, le client public et les trois URI autorisées côté IAM.
2. Vérifier CORS et l'accès à la configuration de découverte depuis le navigateur.
3. Ouvrir l'application sans session : carte publique et action de connexion accessibles.
4. Se connecter : retour à la destination demandée, profil OIDC visible, documents chargés.
5. Vérifier que les requêtes vers l'API Entrepôt portent le Bearer et pas les autres URL.
6. Créer/lire/modifier/supprimer un document de test en vérifiant ses règles de partage.
7. Vérifier une expiration ou un échec de renouvellement, sans boucle de connexion.
8. Se déconnecter puis connecter un autre compte : aucun document de l'ancien compte ne reste visible.
9. Tester un `BASE_URL` non racine, y compris le callback HTML et son script.
10. Désactiver le debug et vérifier l'absence d'ancien instantané documentaire.

Commandes du projet :

```sh
npm run test:unit -- --run tests/test/services/Authentication.spec.js tests/test/services/Service.spec.js
npm run test:e2e -- tests/e2e/06-authentification.spec.ts --project=chromium
npm run lint
npm run build-only -- --mode development-local
```

Les tests OIDC Chromium utilisent un fournisseur et une API simulés ; ils ne valident pas les réglages du client IAM réel, sa CSP, les cookies tiers, les CORS de production ou les droits sur l'espace personnel d'un compte réel.

Une recette sur l'environnement cible reste nécessaire.

## 9. Diagnostic rapide

| Symptôme | Vérifications prioritaires |
| --- | --- |
| `NOT_INSTALLED` | `useAuth()` ou un helper est appelé avant `app.use(createAuth(...))` |
| `CONFIG_INVALID` | Issuer/client/URI invalides, origine différente, secret configuré ou schéma non HTTPS |
| Retour de connexion bloqué | URI IAM exacte, routage SPA de `/login`, présence du guard, absence de traitement concurrent du code |
| Restauration silencieuse impossible | URI statique, script relatif, query string conservée, CSP du fournisseur et cookies tiers |
| Session présente mais API sans Bearer | Fetch officiel injecté, `apiBaseUrls` aligné avec `service.api` |
| Documents absents | Synchroniseur monté une seule fois, `user.sub` disponible, catégories et résultats `allSettled` inspectés |
| UI figée après changement de compte | Ancienne référence documentaire conservée hors d'un `computed` |
| Snapshot debug absent | `IAM_DEBUG=true`, exécution de `saveStore()`, bon onglet/origine et stockage disponible |
| Déconnexion revient chez le fournisseur | Utiliser `logout()` et une `IAM_POST_LOGOUT_REDIRECT_URI` absolue autorisée |

Références :

- Le README, la documentation API et les déclarations de types sont
fournis dans l'[archive OIDC 0.1.0](../authentification-vue-oidc-0.1.0.tgz).

- Voir aussi le [README de l'application](../README.md#authentification-oidc).
