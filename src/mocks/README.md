# Mocks HTTP (MSW)

Ce dossier utilise [MSW (Mock Service Worker)](https://mswjs.io/docs/) pour intercepter les appels HTTP vers l'IAM (SSO Keycloak) et l'API entrepôt, et renvoyer des réponses simulées.

## Fichiers

- [handlers.js](./handlers.js) — définit les scénarios de réponses (`success_data`, `success_nodata`, `error`...)
- [browser.js](./browser.js) — configure le `worker` MSW en fonction du scénario choisi
- [../main.ts](../main.ts) — active le worker au démarrage si `VITE_HTTP_MOCK_REQUEST=1`

## Activation

Dans le fichier d'environnement utilisé (ex. `env/.env.development`) :

```env
# mock (orienté dev)
VITE_HTTP_MOCK_REQUEST="1"
# success_nodata|success_data|error|error_quota
VITE_HTTP_MOCK_REQUEST_SCENARIO="success_data"
```

- `VITE_HTTP_MOCK_REQUEST="1"` → active MSW au lancement (`main.ts` importe dynamiquement `./mocks/browser`)
- `VITE_HTTP_MOCK_REQUEST="0"` → mocks désactivés (valeur par défaut dans tous les fichiers `env/.env.*`)
- `VITE_HTTP_MOCK_REQUEST_SCENARIO` → sélectionne le jeu de handlers exporté dans `handlers.js` (`success_data`, `success_nodata`, `error`, `error_quota`)

## Lancer le projet avec les mocks

```sh
npm run dev
```

(mode `development-local`, cf. `package.json`), après avoir mis `VITE_HTTP_MOCK_REQUEST="1"` dans le fichier env correspondant (ex. `env/.env.development-local`).

Les requêtes interceptées incluent : obtention du token SSO, `/users/me`, `/users/me/documents` (avec filtrage par `labels`), etc. Les requêtes vers `data.geopf.fr` et `acwg.cartes.gouv.fr` restent volontairement non interceptées (whitelisting dans `main.ts`).

## Ajouter/modifier un scénario

Dans `handlers.js`, chaque scénario est un tableau de handlers `http.get/post(...)` construit à partir du tableau `success` (token + `/users/me`), complété par des routes spécifiques (ex. `/users/me/documents`). Pour ajouter un cas, il suffit d'ajouter une nouvelle entrée à l'objet exporté `handlers` ou d'étendre un scénario existant avec `.concat(...)`.

## Données statiques associées

Le dossier [`public/mocks/`](../../public/mocks) contient des fichiers de données (GeoJSON, KML, GPX, JSON) utilisés comme fixtures pour simuler des documents utilisateur (croquis, itinéraires, profils altimétriques, etc.), référencés par les handlers dans les réponses simulées.

## Tests Playwright

Les tests E2E doivent privilégier ces données locales/mocks plutôt que des appels réseau externes instables en CI (cf. `.github/instructions/playwright-test.instructions.md`).
