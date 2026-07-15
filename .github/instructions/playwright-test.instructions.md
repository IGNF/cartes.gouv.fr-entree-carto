---
description: 'Playwright test generation instructions'
applyTo: '**'
---

## Objectif de ces instructions

Ces consignes s'appliquent aux tests E2E Playwright du projet `cartes.gouv.fr-entree-carto`.
Elles doivent rester coherentes avec:

- le plan de tests `tests/PLAN.md`
- la configuration `playwright.config.ts`
- l'approche Page Object Model (POM) inspiree de `vue3-openlayers/tests/MapPage.ts`

## Portee et organisation attendues

- Ecrire les tests Playwright uniquement sous `tests/e2e/`.
- Conserver la convention du plan de tests pour les fichiers metier E2E:
  - `01-carte.spec.ts`
  - `02-navigation.spec.ts`
  - `03-permalink.spec.ts`
  - `04-catalogue.spec.ts`
  - `05-espace-personnel.spec.ts`
  - `06-authentification.spec.ts`
  - `07-outils.spec.ts`
  - `08-impression.spec.ts`
  - `09-partage.spec.ts`
- Utiliser un POM principal dans `tests/e2e/MainPage.ts`.
- Les fichiers `examples.spec.ts` et `tests-examples/` sont des exemples: ne pas s'en inspirer pour la structure finale du projet.

## Style POM attendu (inspire de MapPage.ts)

### Principes

- Centraliser les interactions UI/carte dans la classe POM (`MainPage`).
- Exposer des methodes metier (ex: `openCatalog`, `toggleLayer`, `zoomIn`, `drawLine`) plutot que du code Playwright brut dans les spec.
- Encapsuler les interactions canvas/OpenLayers:
  - recuperation de la zone (`boundingBox`)
  - clic/drag/hover avec coordonnees locales
  - gestion des modificateurs clavier si necessaire (`Shift`, `Control`, etc.)

### Chargement de la carte

- Eviter les attentes fixes (`waitForTimeout`) sauf cas exceptionnel documente.
- Preferer des attentes deterministes:
  - `waitForLoadState('domcontentloaded')`
  - presence d'un `canvas` ou d'un conteneur OpenLayers (`.ol-viewport`)
  - si disponible, attendre un marqueur de carte chargee (ex: `.ol-map-fully-loaded`)

## Standards de qualite des tests

- Imports: toujours commencer par `import { test, expect } from '@playwright/test';`.
- Structurer les scenarios par fonctionnalite via `test.describe()`.
- Utiliser `test.step()` pour decrire les actions metier et faciliter le rapport.
- Prioriser des locators robustes et lisibles:
  - `getByRole`, `getByLabel`, `getByText`
  - en carte, utiliser les locators techniques dans le POM uniquement
- Assertions: utiliser des assertions web-first auto-retry (`await expect(...)...`).
- Navigation et URL: verifier avec `toHaveURL`.
- Texte/listes: utiliser `toHaveText`, `toContainText`, `toHaveCount`.
- Captures: pour les tests visuels carte, utiliser `toHaveScreenshot` (les seuils sont deja configures dans `playwright.config.ts`).

## Convention de nommage des tests

- Le titre d'un test doit suivre le schema:
  - `<Domaine PLAN> - <Scenario metier> - <Resultat attendu>`
- Exemples:
  - `Carte - Affichage initial - Le titre de page est visible`
  - `Permalink - Chargement avec parametre c/z/l - La vue est restauree`

## Donnees, mocks et environnement

- Les tests E2E doivent privilegier les donnees locales et mocks (MSW/fixtures) conformement au `PLAN.md`.
- Ne pas introduire de dependance reseau externe instable dans les tests CI.
- Respecter la config existante:
  - `testDir: ./tests/e2e`
  - projet principal `chromium`
  - serveur lance via `npm run serve`

## Patron de spec recommande

```typescript
import { test, expect } from '@playwright/test';
import { MainPage } from './MainPage';

test.describe('01-carte', () => {
  test('Carte - Affichage initial - Le titre principal est present', async ({ page }) => {
    const main = new MainPage(page);

    await test.step('Ouvrir la page principale et attendre la carte', async () => {
      await main.goto();
      await main.wait();
    });

    await test.step('Verifier le titre de la page', async () => {
      await main.checkMainPageTitle();
      await expect(page).toHaveURL(/\/$/);
    });
  });
});
```

## Strategie d'execution

1. Lancement initial: `npm run test:e2e -- --project=chromium`
2. Debug local: `npm run test:e2e:debug`
3. Trace: `npm run test:e2e:trace`
4. Rapport: `npm run test:e2e:report`

## Checklist avant validation

- [ ] Chaque spec est rangee dans `tests/e2e/` et alignee au domaine du `PLAN.md`
- [ ] Le code Playwright bas niveau est factorise dans `MainPage.ts`
- [ ] Aucune attente arbitraire n'est introduite sans justification
- [ ] Les assertions verifient un comportement utilisateur observable
- [ ] Les scenarios sont lisibles via `describe` + `step` + titres explicites
- [ ] Les tests passent en `chromium` avec la configuration du projet