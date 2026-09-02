---
description: 'Comprehensive Vue 3 development standards and best practices: Composition API, `<script setup>`, the full reactivity system, compiler macros (defineModel/defineSlots/defineOptions), built-in components (Teleport/Suspense/Transition/KeepAlive), provide/inject, composables, Pinia, Vue Router, TypeScript, testing, performance, SSR, and security.'
applyTo: '**/*.vue, **/*.ts, **/*.js, **/*.css, **/*.scss'
---

# Vue Instructions - cartes.gouv.fr-entree-carto

Ces regles doivent refleter l'implementation reelle du projet, pas un standard Vue generique.

## Contexte technique du projet

- Vue 3 + Vite.
- Base de code mixte JS et TS:
	- `*.vue` majoritairement en `<script setup lang="ts">`
	- beaucoup de composables et stores en `*.js`
- Pinia pour l'etat global.
- Vue Router avec routes lazy-load et noms centralises.
- DSFR + `@gouvminint/vue-dsfr` + `cartes.gouv.fr-vue-components`.
- Notifications via Notivue.
- Plugins applicatifs enregistres dans `src/main.ts` (services, bus d'evenements, Eulerian, logger).

## Regles de style a respecter

### Vue SFC

- Conserver le style actuel des SFC: `<script setup lang="ts">`, puis `<template>`, puis `<style>`.
- Eviter les refontes d'architecture non demandees (ne pas basculer en Options API, ne pas forcer une migration TS globale).
- Garder des composants centres sur un role metier clair.
- Utiliser des refs typees pour les composants enfants quand necessaire (`InstanceType<typeof X>`).

### JavaScript vs TypeScript

- Respecter le langage du fichier touche:
	- un fichier `*.js` reste en JS (pas de conversion automatique en TS)
	- un fichier `*.ts` garde un typage explicite coherent
- Ne pas introduire des patterns TS avances dans des modules JS existants.

### Imports et alias

- Preferer les alias deja utilises (`@/`) pour `src`.
- Conserver la convention de nommage actuelle des imports de composants en PascalCase.
- Regrouper les imports par familles quand c'est pertinent (icones, composants, composables, stores, librairies).

## Reactivite et logique metier

- Privilegier `computed` pour les derivees de donnees et `watch` pour les effets de bord.
- Ne pas faire de logique metier complexe directement dans le template.
- Conserver les flux existants basees sur stores/composables avant d'introduire de nouvelles couches.
- Pour les operations asynchrones, preferer `async/await` avec gestion d'erreur explicite.

## Conventions stores Pinia

- Le projet utilise les deux styles Pinia (setup store et option store):
	- ne pas imposer une conversion systematique d'un style vers l'autre
	- rester coherent avec le fichier modifie
- Garder les stores focalises par domaine (`app`, `map`, `service`, etc.).
- Ne pas casser les mecanismes de persistance existants (`useStorage`, `pinia-plugin-store`, namespace localStorage).

## Routing

- Ajouter/modifier les routes dans `src/router/index.ts`.
- Reutiliser les noms de routes centralises dans `src/router/routeNames.ts`.
- Conserver le lazy loading des vues via `() => import(...)`.
- Si une route impacte le titre de page ou une redirection, maintenir la logique de garde existante.

## UI, DSFR et design system

- Preserver l'integration DSFR existante (classes, composants, tokens, theming).
- Ne pas remplacer les composants DSFR/vue-dsfr par des composants custom sans demande explicite.
- Pour les notifications, suivre le pattern Notivue deja en place (configuration globale + `push.*`).

## Plugins et injections

- Les injections applicatives (`services`, `emitter`, refs de modales, etc.) sont un pattern central du projet.
- Avant d'ajouter une nouvelle injection globale, verifier qu'un store/composable existant ne couvre pas deja le besoin.
- Ne pas casser la sequence d'initialisation de `src/main.ts` (mocks conditionnels, `router.isReady()`, montage final).

## Gestion des donnees navigateur

- Ce projet s'appuie fortement sur `localStorage`/`sessionStorage` pour la persistance metier.
- Toute evolution de clef de stockage doit:
	- rester compatible avec le namespace existant
	- eviter les regressions sur permalink, auth, favoris et preferences utilisateur
- Eviter les nettoyages globaux agressifs du storage sauf besoin explicitement justifie.

## Qualite, securite et robustesse

- En cas de parsing ou de donnees externes, garder un mode degrade sans crash (try/catch + fallback).
- Pour les exceptions linter securite existantes, ne pas supprimer le garde-fou metier sans justification.
- Eviter `v-html` avec donnees non maitrisees.

## Tests attendus lors des changements

- Si vous modifiez des composables/stores JS: ajouter ou adapter les tests Vitest sous `tests/test/**` selon `tests/PLAN.md`.
- Si vous modifiez des parcours UI/routing critiques: ajouter ou adapter les tests Playwright sous `tests/e2e/**` selon `tests/PLAN.md`.
- Les nouvelles assertions doivent verifier un comportement utilisateur observable.

## Anti-patterns a eviter dans ce repository

- Introduire une migration globale JS -> TS non demandee.
- Reorganiser massivement la structure des dossiers sans besoin fonctionnel.
- Dupliquer la logique metier entre composant, store et composable.
- Ajouter des delais arbitraires (`setTimeout`) pour masquer des problemes de synchro quand un signal deterministe existe deja.
- Changer des conventions de nommage/format de stockage sans plan de migration.