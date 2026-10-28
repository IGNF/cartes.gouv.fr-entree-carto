# Tests

> Mise en place des tests unitaires et de rendus

[Vitest](https://vitest.dev/) et <https://vitest.fr/>
[playwright](https://playwright.dev/)

<https://fr.vuejs.org/guide/scaling-up/testing>
<https://test-utils.vuejs.org/guide/>

## Liens utiles

Tests unitaires / composants

- <https://www.vuemastery.com/blog/getting-started-with-vitest/>
- <https://github.com/vitest-tests/browser-examples/tree/main/examples/vue>
- <https://runthatline.com/vitest-mock-localstorage/>
- <https://runthatline.com/vitest-test-pinia-store-actions-getters/>

Tests E2E (rendu)

- <https://playwright.dev/>
- <https://github.com/MelihAltintas/vue3-openlayers.git>

## Plan de tests

cf. PLAN.md

## CI

**TODO :**
> Mise en place des tests sur la CI

## IA

* Prompt Vitest

Exemple de prompt pour les tests unitaires :
```text
Écris ou complète le test unitaire dans permalink.spec.js.
Respecte strictement PLAN.md, vitest.instructions.md et vue.instructions.md .
Couvre au minimum U-PL-01, U-PL-02 et U-PL-08 avec cas nominal, cas limite et cas erreur.
Utilise des mocks déterministes, aucun appel réseau externe.
Avant de coder, liste les règles d’instructions appliquées, puis implémente.
```

* Prompt Playwright

Exemle de prompt pour les testts e2e :
```text
Crée le fichier tests/e2e/03-permalink.spec.ts en suivant PLAN.md et playwright-test.instructions.md .
Utilise le POM MainPage.ts, structure en describe + test.step, et applique la convention de nommage des tests du plan.
Implémente E-PL-03 et E-PL-10 avec assertions web-first et sans attente arbitraire.
```