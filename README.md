# Entrée cartographique de cartes.gouv.fr

[![License: AGPL-3.0](https://img.shields.io/badge/License-AGPL--3.0-blue.svg)](LICENSE)

L'entrée cartographique de cartes.gouv.fr est la page d'entrée principale de cartes.gouv.fr : elle est constituée d'une interface cartographique permettant de visualiser et manipuler les données de la Géoplateforme.

---

# vue-dsfr-project

Ce gabarit possède tous les outils configurés pour développer un projets Vue 3 et VueDsfr avec Vite.

## Configuration recommandée

- Visual Studio Code avec ces extensions :
  - [VSCode](https://code.visualstudio.com/)
  - [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur)
  - [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin)
  - [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
  - [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
  - [Vue Ecosystem Snippets](https://marketplace.visualstudio.com/items?itemName=matijao.vue-nuxt-snippets)

## Support de TypeScript pour les fichiers `.vue`

TypeScript ne sait pas gérer les informations de type pour les imports dans les fichiers `.vue` par défault, donc la CLI `tsc` est remplacée par `vue-tsc` pour la vérification des types. Dans les éditeurs, il est besoin de l’extension [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) pour rendre le service du langage TypeScript capable de gérer les types des fichiers `.vue`.

Si le plugin TypeScript ne vous semble pas assez performant, Volar a aussi implémenté un [mode Take Over](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669) qui est plus performant. Vous pouvez l’activer en suivant les étapes suivantes :

1. Désactiver l’extension TypeScript incluse
    1) Lancer `Extensions: Show Built-in Extensions` depuis la palette de commandes VSCode
    2) Trouver `TypeScript and JavaScript Language Features`, cliquer avec le bouton droit et sélectionner `Disable (Workspace)`
2. Recharger la fenêtre VSCode en lançant `Developer: Reload Window` depuis la palette de commandes.

## Installer les dépendances

```sh
npm install
```

### Compilation et Hot-Reload pour le développement

```sh
npm run dev
```

### Vérification des types, Compilation et Minification pour la Production

```sh
npm run build
```

## Voir l'application avec le code de production

```sh
npm run preview
```

## Déployer le code de production

Déployer le contenu du dossier `dist` après avoir généré le code de production.

### Vérifier la syntaxe et le formattage avec [ESLint](https://eslint.org/)

```sh
npm run lint
```

### Lancer les Tests Unitaires avec [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Lancer les tests de End-to-End avec [playwright](https://playwright.dev/)

```bash
npm install -D @playwright/test@latest
# Also download new browser binaries and their dependencies:
npx playwright install --with-deps
```

#### Avec une interface graphique

```sh
npm run test:e2e:ui
```

#### Sans interface graphique (pour la CI)

```sh
npm run test:e2e
```

#### En mode debug

```sh
npm run test:e2e:debug
```

Pour information,
> On lance les tests end-to-end avec le code de production et on utilise un serveur externe (serve) autre que le serveur interne de Vite.

Le rapport

```bash
npx playwright show-report
```

### Analyse statique du code avec [ESLint](https://eslint.org/)

```sh
npm run lint
```
