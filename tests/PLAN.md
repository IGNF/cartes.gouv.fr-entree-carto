# Plan de tests — cartes.gouv.fr (entree-carto)

## Vue d'ensemble

Ce document décrit le plan de tests de la webapp **cartes.gouv.fr (entree-carto)**,
organisé en deux grandes catégories :

- **Tests unitaires** — via [Vitest](https://vitest.dev/) + [Vue Test Utils](https://test-utils.vuejs.org/)
- **Tests de rendu (E2E)** — via [Playwright](https://playwright.dev/)

Les tests sont regroupés par domaine fonctionnel.

---

## Arborescence cible

```
tests/
├── PLAN.md                   ← ce document
├── README.md
├── test/                     ← tests unitaires (Vitest)
│   ├── vitest.setup.js
│   ├── features/
│   │   ├── permalink.spec.js
│   │   ├── share.spec.js
│   │   ├── layer.spec.js
│   │   ├── style.spec.js
│   │   ├── loader.spec.js
│   │   ├── cityinfo.spec.js
│   │   └── events.spec.js
│   ├── composables/
│   │   ├── urlParams.spec.js
│   │   ├── useAuthentication.spec.js
│   │   ├── useModals.spec.js
│   │   ├── controls.spec.js
│   │   ├── printUtils.spec.js
│   │   └── searchInArray.spec.js
│   ├── stores/
│   │   ├── mapStore.spec.js
│   │   ├── appStore.spec.js
│   │   ├── dataStore.spec.js
│   │   ├── serviceStore.spec.js
│   │   └── domStore.spec.js
│   └── services/
│       ├── ServiceDocuments.spec.js
│       ├── ServiceEncrypt.spec.js
│       └── ServiceUsers.spec.js
└── e2e/                      ← tests E2E / rendu (Playwright)
    ├── MainPage.ts            ← Page Object Model
    ├── 01-carte.spec.ts
    ├── 02-navigation.spec.ts
    ├── 03-permalink.spec.ts
    ├── 04-catalogue.spec.ts
    ├── 05-espace-personnel.spec.ts
    ├── 06-authentification.spec.ts
    ├── 07-outils.spec.ts
    ├── 08-impression.spec.ts
    └── 09-partage.spec.ts
```

---

## 1. Tests unitaires (Vitest)

### 1.1 Groupe — Permalien & Partage (`features/`)

Fichiers sources : `src/features/permalink.js`, `src/features/share.js`, `src/composables/urlParams.js`

#### `permalink.spec.js`
| # | Cas de test | Description |
|---|-------------|-------------|
| U-PL-01 | `addPermalink` — ajoute le paramètre `permalink=yes` | Vérifie que l'URL est mise à jour correctement |
| U-PL-02 | `removePermalink` — supprime le paramètre `permalink` | Vérifie le nettoyage de l'URL (avec et sans autres paramètres) |
| U-PL-03 | `getLayersFromPermalink` — couche WMTS Géoportail | Parse les paramètres d'une couche WMTS et met à jour le store |
| U-PL-04 | `getLayersFromPermalink` — couche WMS | Parse les paramètres d'une couche WMS |
| U-PL-05 | `getLayersFromPermalink` — couche vecteur (GeoJSON) | Parse les paramètres d'une couche vecteur interne |
| U-PL-06 | `getLayersFromPermalink` — couche Mapbox | Parse les paramètres d'un style Mapbox |
| U-PL-07 | `getLayersFromPermalink` — données de l'espace personnel | Gestion des documents personnels dans l'URL |
| U-PL-08 | `getLayersFromPermalink` — URL invalide / malformée | Aucun crash, comportement dégradé gracieux |

#### `share.spec.js`
| # | Cas de test | Description |
|---|-------------|-------------|
| U-SH-01 | `toShare` — conversion document interne vers URL | Vérifie la structure de l'URL générée |
| U-SH-02 | `toShare` — document externe (public_url) | Vérifie la gestion des URLs publiques |
| U-SH-03 | `fromShare` — URL vers objet document (type service) | Reconstruction correcte du document |
| U-SH-04 | `fromShare` — URL vers objet document (type import/vecteur) | Reconstruction pour les types vecteur |
| U-SH-05 | `fromShare` — URL vers objet document (type mapbox) | Reconstruction pour les styles Mapbox |
| U-SH-06 | `fromShare` — paramètres opacity / visible / grayscale | Vérification des paramètres de rendu |
| U-SH-07 | `toShare` — document non défini | Retourne `undefined` sans erreur |
| U-SH-08 | Cycle aller-retour document → URL → document | Idempotence de la sérialisation |

#### `urlParams.spec.js`
| # | Cas de test | Description |
|---|-------------|-------------|
| U-UP-01 | Paramètre `c` (centre) | Conversion lon/lat → coordonnées map |
| U-UP-02 | Paramètre `z` (zoom) | Parsing du niveau de zoom |
| U-UP-03 | Paramètre `l` (layers) | Décodage de la liste de couches |
| U-UP-04 | Paramètre `d` (données personnelles) | Décodage des données de l'espace personnel |
| U-UP-05 | Paramètre `permalink=yes` | Détection du mode permalien |
| U-UP-06 | URL sans paramètre | Valeurs par défaut renvoyées |
| U-UP-07 | URL complète multi-paramètres | Parsing combiné correct |

---

### 1.2 Groupe — Couches cartographiques (`features/`)

Fichier source : `src/features/layer.js`

#### `layer.spec.js`
| # | Cas de test | Description |
|---|-------------|-------------|
| U-LY-01 | Création couche vecteur GeoJSON (URL externe) | Vérifie source et options |
| U-LY-02 | Création couche vecteur GPX | Vérifie format et source |
| U-LY-03 | Création couche vecteur KML | Vérifie format et source |
| U-LY-04 | Création couche WMTS Géoportail | Vérifie la configuration de la grille |
| U-LY-05 | Création couche WMS | Vérifie l'URL et les paramètres WMS |
| U-LY-06 | Création couche Mapbox | Vérifie l'application du style |
| U-LY-07 | Identifiant interne `bookmark:[type]-[format]:UUID` | Vérification du format d'ID |
| U-LY-08 | Gestion d'erreur de téléchargement (featuresloaderror) | Source marquée en erreur |

#### `style.spec.js`
| # | Cas de test | Description |
|---|-------------|-------------|
| U-ST-01 | `DEFAULT_STYLE` est bien une instance `ol/style/Style` | Vérification du type |
| U-ST-02 | Style par défaut contient stroke, fill, icon, text | Vérification des propriétés |

---

### 1.3 Groupe — Composables utilitaires

Fichiers sources : `src/composables/`

#### `useModals.spec.js`
| # | Cas de test | Description |
|---|-------------|-------------|
| U-MD-01 | `open(name)` — modal apparaît dans l'état | `isOpen('x')` retourne `true` |
| U-MD-02 | `close(name)` — modal disparaît de l'état | `isOpen('x')` retourne `false` |
| U-MD-03 | Plusieurs modales indépendantes | Ouverture / fermeture sans interférence |
| U-MD-04 | `isOpen` sur modal non ouverte | Retourne `false` |

#### `controls.spec.js`
| # | Cas de test | Description |
|---|-------------|-------------|
| U-CT-01 | `useControls` contient les contrôles attendus | Catalog, LayerSwitcher, MeasureLength… |
| U-CT-02 | Chaque contrôle possède `id`, `active`, `default` | Vérification de la structure |

#### `printUtils.spec.js`
| # | Cas de test | Description |
|---|-------------|-------------|
| U-PR-01 | `computeScaleCoeff` — contenant plus large | Ajustement par hauteur |
| U-PR-02 | `computeScaleCoeff` — contenant plus haut | Ajustement par largeur |
| U-PR-03 | `computeScaleCoeff` — même ratio | Coefficient = 1 |
| U-PR-04 | `getMapImgParams` — retourne les propriétés attendues | `img`, `format`, positions et dimensions |

#### `searchInArray.spec.js`
| # | Cas de test | Description |
|---|-------------|-------------|
| U-SA-01 | Recherche avec correspondance | Retourne les éléments correspondants |
| U-SA-02 | Recherche sans correspondance | Retourne un tableau vide |
| U-SA-03 | Recherche insensible à la casse | Correspondance correcte |

---

### 1.4 Groupe — Authentification (`composables/`)

Fichier source : `src/composables/useAuthentication.js`

#### `useAuthentication.spec.js`
| # | Cas de test | Description |
|---|-------------|-------------|
| U-AU-01 | `checkSessionKeyCloak` — session active détectée | `onLogin` appelé, `authenticated = true` |
| U-AU-02 | `checkSessionKeyCloak` — aucune session | Reste non authentifié |
| U-AU-03 | `checkSessionKeyCloak` — déjà tenté (flag session) | Ne re-tente pas le check SSO |
| U-AU-04 | `checkSessionKeyCloak` — exception (mode navigation privée) | Drapeau positionné, aucun crash |
| U-AU-05 | `IAM_CHECK_SSO_DISABLE=1` | Le check SSO est court-circuité |
| U-AU-06 | `cleanAutoSSOAttemptedFlag` | Supprime l'entrée sessionStorage |
| U-AU-07 | Service non injecté | Lève une `Error` explicite |

---

### 1.5 Groupe — Stores Pinia

Fichiers sources : `src/stores/`

#### `mapStore.spec.js`
| # | Cas de test | Description |
|---|-------------|-------------|
| U-MS-01 | État initial du store | Centre, zoom, couches par défaut |
| U-MS-02 | Mutation du centre de la carte | Valeur reflétée dans le store |
| U-MS-03 | Mutation du niveau de zoom | Valeur correcte après mutation |
| U-MS-04 | Ajout d'une couche au store | Liste de couches mise à jour |
| U-MS-05 | Suppression d'une couche du store | Couche absente de la liste |
| U-MS-06 | `getMap()` retourne la référence carte | Null si non initialisée |

#### `serviceStore.spec.js`
| # | Cas de test | Description |
|---|-------------|-------------|
| U-SS-01 | Persistance dans localStorage via pinia-plugin-store | Vérification de la clé `service` |
| U-SS-02 | `getService()` retourne le service courant | |
| U-SS-03 | État `authenticated` à `true` après connexion | |
| U-SS-04 | Documents de l'espace personnel (import, carte, croquis…) | Structure correcte |

#### `appStore.spec.js` / `dataStore.spec.js` / `domStore.spec.js`
| # | Cas de test | Description |
|---|-------------|-------------|
| U-AS-01 | État initial de appStore | Valeurs par défaut |
| U-DS-01 | Lecture/écriture dataStore | Données correctement stockées |
| U-DO-01 | État initial de domStore | Références DOM nulles |

---

### 1.6 Groupe — Services

Fichiers sources : `src/services/`

#### `ServiceDocuments.spec.js`
| # | Cas de test | Description |
|---|-------------|-------------|
| U-SD-01 | `getDocuments` — retour nominal (mock API) | Liste de documents parsée correctement |
| U-SD-02 | `getDocuments` — erreur 401 | `ServiceError` levée avec bon code |
| U-SD-03 | `setDocuments` — enregistrement d'un document | Payload envoyé conforme |
| U-SD-04 | `deleteDocument` — suppression nominale | Appel DELETE effectué sur le bon endpoint |

#### `ServiceEncrypt.spec.js`
| # | Cas de test | Description |
|---|-------------|-------------|
| U-SE-01 | Chiffrement d'une chaîne | Résultat différent de l'entrée |
| U-SE-02 | Déchiffrement — cycle aller-retour | Données originales récupérées |

---

### 1.7 Groupe — Chargeur cartographique (`features/loader.js`)

#### `loader.spec.js`
| # | Cas de test | Description |
|---|-------------|-------------|
| U-LO-01 | `loadstart` → classe `spinner` ajoutée au DOM | |
| U-LO-02 | `loadend` → classe `spinner` retirée (compteur = 0) | |
| U-LO-03 | Plusieurs `loadstart` successifs | Classe `spinner` maintenue jusqu'au dernier `loadend` |
| U-LO-04 | Fallback timeout (pas de `loadend`) | `spinner` retiré après délai |

---

### 1.8 Groupe — Informations communales (`features/cityinfo.js`)

#### `cityinfo.spec.js`
| # | Cas de test | Description |
|---|-------------|-------------|
| U-CI-01 | `getCityInfo` — retour nominal (mock fetch) | Structure de données correcte |
| U-CI-02 | `getCityInfo` — commune introuvable | Retourne `null` ou lève une erreur appropriée |
| U-CI-03 | Construction de l'URL WFS | Paramètres INSEE et typename corrects |

---

## 2. Tests de rendu / E2E (Playwright)

> **Convention :** les tests E2E utilisent des mocks MSW (`src/mocks/`) pour les appels API et des données de fixtures locales.  
> Un serveur de développement doit être démarré avant l'exécution (`vite preview` ou `vite dev`).

---

### 2.1 Groupe — Affichage de la carte

**Fichier :** `e2e/01-carte.spec.ts`

| # | Cas de test | Type | Description |
|---|-------------|------|-------------|
| E-CA-01 | Rendu initial de la carte | snapshot | La carte s'affiche avec le fond PLAN.IGN v2 |
| E-CA-02 | Fond de carte par défaut visible | visuel | Tuiles chargées, pas de zone vide |
| E-CA-03 | Contrôles présents dans le DOM | structurel | Zoom, géolocalisation, layerswitcher |
| E-CA-04 | Spinner de chargement masqué après initialisation | comportemental | Classe `spinner` absente après rendu |
| E-CA-05 | Rendu en mobile (viewport 375px) | snapshot | Interface adaptée (menu bas de page) |
| E-CA-06 | Rendu en desktop (viewport 1920px) | snapshot | Interface adaptée (menus latéraux) |

---

### 2.2 Groupe — Navigation et URL

**Fichier :** `e2e/02-navigation.spec.ts`

| # | Cas de test | Type | Description |
|---|-------------|------|-------------|
| E-NA-01 | Route `/` — page principale chargée | structurel | Composant `Main.vue` présent |
| E-NA-02 | Route `/embed` — vue intégrée | structurel | Pas de header ni de menu |
| E-NA-03 | Route `/plan` — affichage plan | structurel | Composant `Plan.vue` rendu |
| E-NA-04 | Route inconnue — redirection | comportemental | Redirection vers `/` ou page 404 |
| E-NA-05 | Paramètre `redirect` dans l'URL | comportemental | Redirection appliquée après auth |

---

### 2.3 Groupe — Permalien

**Fichier :** `e2e/03-permalink.spec.ts`

| # | Cas de test | Type | Description |
|---|-------------|------|-------------|
| E-PL-01 | Chargement d'un permalien WMTS | snapshot | Couche visible sur la carte |
| E-PL-02 | Chargement d'un permalien WMS | snapshot | Couche WMS visible |
| E-PL-03 | Chargement d'un permalien avec position (`c=`, `z=`) | comportemental | Carte centrée au bon endroit |
| E-PL-04 | Chargement d'un permalien avec données personnelles | snapshot | Couche vecteur (KML/GeoJSON) rendue |
| E-PL-05 | Chargement d'un permalien Mapbox | snapshot | Style Mapbox appliqué |
| E-PL-06 | Couche dans le gestionnaire de couches (ordre) | snapshot | Position dans la liste conforme à l'URL |
| E-PL-07 | Couche avec `visible=0` | snapshot | Couche présente mais masquée |
| E-PL-08 | Couche avec `opacity=0.5` | snapshot | Opacité rendue correctement |
| E-PL-09 | Couche avec `grayscale=1` | snapshot | Filtre N&B appliqué visuellement |
| E-PL-10 | Permalien invalide / paramètres corrompus | comportemental | Aucun crash, carte chargée par défaut |

---

### 2.4 Groupe — Catalogue de couches

**Fichier :** `e2e/04-catalogue.spec.ts`

| # | Cas de test | Type | Description |
|---|-------------|------|-------------|
| E-CL-01 | Ouverture du catalogue depuis le menu | snapshot | Panneau catalogue visible |
| E-CL-02 | Liste des couches chargée | structurel | Au moins une couche présente |
| E-CL-03 | Ajout d'une couche depuis le catalogue | snapshot | Couche apparaît sur la carte et dans le layerswitcher |
| E-CL-04 | Suppression d'une couche ajoutée | snapshot | Couche absente de la carte et du layerswitcher |
| E-CL-05 | Filtrage / recherche dans le catalogue | comportemental | Résultats filtrés en temps réel |
| E-CL-06 | Navigation par thématique | structurel | Sous-catégories affichées |
| E-CL-07 | Fermeture du catalogue | snapshot | Panneau masqué, carte au premier plan |

---

### 2.5 Groupe — Espace personnel (Bookmarks)

**Fichier :** `e2e/05-espace-personnel.spec.ts`

> Nécessite un utilisateur authentifié (mock IAM activé)

| # | Cas de test | Type | Description |
|---|-------------|------|-------------|
| E-EP-01 | Liste des documents personnels chargée | structurel | Documents affichés dans le menu favoris |
| E-EP-02 | Ajout d'un document (import GeoJSON) sur la carte | snapshot | Couche visible, entrée dans le layerswitcher |
| E-EP-03 | Ajout d'un document (import KML) | snapshot | Couche KML rendue |
| E-EP-04 | Ajout d'un document (import GPX) | snapshot | Couche GPX rendue |
| E-EP-05 | Ajout d'un document (croquis) | snapshot | Croquis visible sur la carte |
| E-EP-06 | Suppression d'un document de la carte | snapshot | Couche supprimée du layerswitcher |
| E-EP-07 | Synchronisation localStorage après ajout | comportemental | Clé `service` mise à jour dans localStorage |
| E-EP-08 | Sauvegarde d'une carte (modal ModalSave) | comportemental | Document sauvegardé, liste mise à jour |

---

### 2.6 Groupe — Authentification

**Fichier :** `e2e/06-authentification.spec.ts`

| # | Cas de test | Type | Description |
|---|-------------|------|-------------|
| E-AU-01 | Bouton "Se connecter" visible si non authentifié | structurel | Présent dans le header |
| E-AU-02 | Flux de connexion (mock IAM) | comportemental | Redirection vers `/login`, retour avec session |
| E-AU-03 | Nom d'utilisateur affiché après connexion | structurel | Header mis à jour |
| E-AU-04 | Bouton "Se déconnecter" fonctionnel | comportemental | Session supprimée, état réinitialisé |
| E-AU-05 | Check SSO automatique au chargement | comportemental | Session détectée sans action utilisateur |
| E-AU-06 | Session expirée (401 API) | comportemental | Redirection vers `/logout?from=authInvalid` |
| E-AU-07 | Mode navigation privée (SSO bloqué) | comportemental | Pas de crash, bouton connexion disponible |

---

### 2.7 Groupe — Outils cartographiques

**Fichier :** `e2e/07-outils.spec.ts`

| # | Cas de test | Type | Description |
|---|-------------|------|-------------|
| E-OT-01 | Outil de mesure de longueur | snapshot | Résultat de mesure affiché sur la carte |
| E-OT-02 | Outil de mesure de surface | snapshot | Résultat de mesure affiché |
| E-OT-03 | Outil de dessin (croquis) | snapshot | Géométrie tracée visible |
| E-OT-04 | Outil d'import de fichier | comportemental | Fichier chargé, couche ajoutée |
| E-OT-05 | Outil de calcul d'itinéraire | snapshot | Trace d'itinéraire visible |
| E-OT-06 | Outil isocourbe | snapshot | Zone isochrone/isodistance visible |
| E-OT-07 | Moteur de recherche — géocodage | comportemental | Résultat positionné sur la carte |
| E-OT-08 | Géolocalisation | comportemental | Centrage sur position (mock géoloc) |
| E-OT-09 | Vue d'ensemble (minimap) | snapshot | Minimap affichée et synchronisée |
| E-OT-10 | Fermeture/réouverture d'un outil | snapshot | État préservé ou réinitialisé selon spec |

---

### 2.8 Groupe — Impression / Export PDF

**Fichier :** `e2e/08-impression.spec.ts`

| # | Cas de test | Type | Description |
|---|-------------|------|-------------|
| E-IM-01 | Ouverture du panneau impression | snapshot | Formulaire d'impression visible |
| E-IM-02 | Prévisualisation avant impression | snapshot | Aperçu carte et légende |
| E-IM-03 | Génération PDF — fichier téléchargé | comportemental | Fichier `.pdf` reçu (nom attendu) |
| E-IM-04 | Impression avec plusieurs couches | snapshot | Toutes les couches visibles dans le PDF |

---

### 2.9 Groupe — Partage

**Fichier :** `e2e/09-partage.spec.ts`

| # | Cas de test | Type | Description |
|---|-------------|------|-------------|
| E-SH-01 | Génération de l'URL de partage | comportemental | URL contient les paramètres attendus |
| E-SH-02 | URL de partage avec couches actives | comportemental | Paramètre `l=` correctement encodé |
| E-SH-03 | URL de partage avec données personnelles | comportemental | Paramètre `d=` présent |
| E-SH-04 | Copie de l'URL dans le presse-papier | comportemental | Toast de confirmation affiché |
| E-SH-05 | URL de partage rechargée — couches restaurées | snapshot | État carte identique après rechargement |

---

## 3. Conventions et infrastructure

### 3.1 Données de test (fixtures)

| Fichier | Usage |
|---------|-------|
| `public/mocks/mapbox1.json` | Style Mapbox de test |
| `public/mocks/regions.geojson` | Données vecteur GeoJSON |
| `public/mocks/croquis1.kml` | Croquis KML |
| `public/mocks/rando_corse.gpx` | Trace GPX |
| `public/mocks/wmts.json` | Capacités WMTS mockées |
| `public/mocks/wms.json` | Capacités WMS mockées |
| `public/data/entreeCarto.json` | Configuration des couches |

### 3.2 Mocks API (MSW)

Les handlers MSW (`src/mocks/handlers.js`) interceptent :
- Les appels à l'API Entrepôt (`/api/...`) — documents, utilisateurs
- Les appels IAM/Keycloak — authentification
- Les appels WFS/WMS/WMTS — données géographiques

### 3.3 Priorités de mise en œuvre

| Priorité | Domaine | Raison |
|----------|---------|--------|
| 🔴 Haute | Permalien & Partage | Cœur fonctionnel, tests unitaires existants à compléter |
| 🔴 Haute | Couches cartographiques | Couverture des types de données |
| 🟠 Moyenne | Authentification | Flux critique, mocks disponibles |
| 🟠 Moyenne | Espace personnel | Dépend de l'authentification |
| 🟡 Normale | Outils cartographiques | Nombreux cas mais moins critiques |
| 🟡 Normale | Affichage & snapshots E2E | Détection de régressions visuelles |
| 🟢 Basse | Impression | Fonctionnalité secondaire |

### 3.4 Outils et configuration

| Outil | Rôle |
|-------|------|
| **Vitest** | Runner de tests unitaires |
| **Vue Test Utils** | Montage de composants Vue |
| **Pinia** | Store de test (mode test) |
| **MSW** | Mock des appels réseau |
| **Playwright** | Tests E2E (Chromium, Firefox, WebKit) |
| **playwright-visual-comparisons** | Comparaison de snapshots |

```bash
# Tests unitaires
npx vitest run

# Tests unitaires avec couverture
npx vitest run --coverage

# Tests E2E
npx playwright test

# Tests E2E avec interface graphique
npx playwright test --ui
```
