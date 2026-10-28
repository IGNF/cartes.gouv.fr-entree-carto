---
description: "Guidelines for writing Node.js and JavaScript code with Vitest testing"
applyTo: '**/*.js, **/*.mjs, **/*.cjs'
---

## Objectif de ces instructions

Ces consignes s'appliquent aux tests unitaires Vitest du projet `cartes.gouv.fr-entree-carto`.
Elles doivent rester coherentes avec:

- le plan de tests `tests/PLAN.md`
- la configuration test dans `vite.config.ts`
- l'arborescence cible sous `tests/test/`

## Portee et organisation attendues

- Ecrire les tests unitaires uniquement sous `tests/test/`.
- Respecter les domaines fonctionnels du plan:
	- `tests/test/features/*.spec.js`
	- `tests/test/composables/*.spec.js`
	- `tests/test/stores/*.spec.js`
	- `tests/test/services/*.spec.js`
- Utiliser `tests/test/vitest.setup.js` pour les polyfills et la preparation globale (pas de duplication locale dans chaque spec).
- Garder un fichier spec par module/fonctionnalite metier (ex: `permalink.spec.js`, `useAuthentication.spec.js`).

## Style de tests attendu

### Imports et structure

- Commencer par `import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';` en ne gardant que les symboles utiles.
- Grouper les scenarios par domaine via `describe()` puis `it()` avec des titres explicites.
- Nommer les tests selon le schema:
	- `<Code PLAN> - <Fonction> - <Resultat attendu>`
- Exemple:
	- `U-PL-01 - addPermalink - ajoute le parametre permalink=yes`

### Isolation et mocks

- Isoler les tests: reinitialiser les mocks, spies et etats partages entre tests (`beforeEach`/`afterEach`).
- Privilegier `vi.mock()` et `vi.spyOn()` pour les dependances externes (fetch, storage, services).
- Pour les modules Pinia/Vue, tester le comportement observable (etat, getters, actions) plutot que l'implementation interne.
- Ne jamais modifier le code source pour "faciliter" les tests.

### Assertions

- Verifier les comportements fonctionnels attendus par le plan (parsing URL, etat store, gestion erreur, etc.).
- Utiliser des assertions precises:
	- `toEqual` pour structure/objets
	- `toBe` pour primitives
	- `toContain`/`toContainEqual` pour collections
	- `toThrow` ou `rejects.toThrow` pour erreurs
- Toujours couvrir au minimum:
	- cas nominal
	- cas limites
	- cas erreur/degradation

## Alignement avec le PLAN.md

- Lors de la creation ou mise a jour d'un spec, verifier la couverture des cas references dans `tests/PLAN.md`.
- Priorite des domaines de couverture:
	- Permalien/Partage (`features/permalink`, `features/share`, `composables/urlParams`)
	- Couches cartographiques (`features/layer`, `features/style`, `features/loader`, `features/cityinfo`)
	- Composables utilitaires (`useModals`, `controls`, `printUtils`, `searchInArray`)
	- Authentification (`useAuthentication`)
	- Stores Pinia (`mapStore`, `serviceStore`, `appStore`, `dataStore`, `domStore`)
	- Services (`ServiceDocuments`, `ServiceEncrypt`, `ServiceUsers`)

## Donnees de test et environnement

- Utiliser des fixtures/mocks locaux et deterministes.
- Eviter toute dependance reseau externe en tests unitaires.
- Respecter la config Vitest existante:
	- environnement `jsdom`
	- `setupFiles: tests/test/vitest.setup.js`
	- inclusion des specs via `tests/test/**/*.{test,spec}.{ts,js}`

## Patron de spec recommande

```javascript
import { describe, it, expect } from 'vitest';
import { addPermalink } from '@/features/permalink';

describe('features/permalink', () => {
	it('U-PL-01 - addPermalink - ajoute le parametre permalink=yes', () => {
		const url = new URL('https://example.test/?c=1,2&z=10');

		addPermalink(url);

		expect(url.searchParams.get('permalink')).toBe('yes');
	});
});
```

## Strategie d'execution

1. Lancement complet: `npm run test:unit`
2. Lancement cible (fichier): `npx vitest tests/test/features/permalink.spec.js`
3. Mode watch local: `npx vitest --watch`
4. Verification finale: relancer `npm run test:unit` apres modifications

## Checklist avant validation

- [ ] Le fichier est sous `tests/test/` et dans le bon domaine (`features`, `composables`, `stores`, `services`)
- [ ] Les titres des cas de test sont explicites et aligns au `PLAN.md`
- [ ] Les cas nominaux, limites et erreurs sont couverts
- [ ] Les mocks/spies sont nettoyes entre tests
- [ ] Aucun appel reseau externe non mocke n'est introduit
- [ ] Les tests passent avec `npm run test:unit`