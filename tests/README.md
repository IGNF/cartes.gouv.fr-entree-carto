# Tests

> TODO

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

## Composants à tester

- permalien
- service
- favoris

## Le permalien

- test d'un permalien en url
- test de creation d'un permalien
  - ajout / suppression d'une couche du catalogue
  - ajout / suppression d'une donnée de l'espace personnel

On teste quoi ?

- le localStorage : layers / boormarks / permalink
- le rendu sur la webapp : snapshots

1. tests unitaires avec share.js

- [x] conversion : document -> url
- [x] conversion : url -> document
- [ ] par type de données :
  - mapbox
  - vecteurs
  - service
  - compute (?)

2. tests unitaires avec permalink.js

- [x] passage url -> store
- [ ] par type de données

3. tests de rendu

Note :
> Pour les tests de rendu, il faut monter un serveur
> Le serveur peut utilser les mocks pour les favoris

- [ ] rendu de la carte
  - position des couches
  - visibilité
  - N&B
  - opacité
- [ ] rendu dans le gestionnaire de couches
  - ordre
  - nom
