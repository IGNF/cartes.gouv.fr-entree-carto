# Unreleased

<https://github.com/IGNF/cartes.gouv.fr-entree-carto/compare/v1.0.1...HEAD>

## 🔖 version 1.0.1 - __DATE__

### 🎉 Résumé

Version 1.0.1 de l'entrée cartographique de la Géoplateforme.

### 💥 Breaking changes

### 📖 Changelog

#### ✨ [Ajout]

* Ajout du widget d'import de données [#324](https://github.com/IGNF/cartes.gouv.fr-entree-carto/pull/324)

* Ajout du widget de getFeatureInfo pour récupérer les informations attributaires des couches au clic [#354](https://github.com/IGNF/cartes.gouv.fr-entree-carto/pull/354)

* Ajout du widget de profil altimétrique [#325](https://github.com/IGNF/cartes.gouv.fr-entree-carto/pull/325)

* Ajout des tooltips DSFR au survol des boutons des widgets [extensions:#210](https://github.com/IGNF/geopf-extensions-openlayers/pull/210)

#### 🔨 [Evolution]

* LayerSwitcher et Barre de recherche en widgets fixes [#348](https://github.com/IGNF/cartes.gouv.fr-entree-carto/pull/348)

* Positionnement fixe des panel "dialog" des widgets [#350](https://github.com/IGNF/cartes.gouv.fr-entree-carto/pull/350)

* Ajout d'un marker sur la carte lors d'un centrage via la barre de recherche (simple ou avancée) [#345](https://github.com/IGNF/cartes.gouv.fr-entree-carto/pull/345)

* Ajout d'une version au localStorage pour que celui-ci se vide si besoin en cas de relivraison du composant [#353](https://github.com/IGNF/cartes.gouv.fr-entree-carto/pull/353)

* Plus haute priorité donnée aux couches WMTS dans la recherche pour privilégier les couches WMTS aux WMS si les deux sont disponibles [extensions:#214](https://github.com/IGNF/geopf-extensions-openlayers/pull/214)

#### 🔥 [Obsolète]

#### 🔥 [Suppression]

#### 🐛 [Correction]

* Partage par mail [#347](https://github.com/IGNF/cartes.gouv.fr-entree-carto/pull/347)

* Passage des boutons des widgets en type "secondaires" [#352](https://github.com/IGNF/cartes.gouv.fr-entree-carto/pull/352)

* Mise en conformité des liens de footer au DSFR [#357](https://github.com/IGNF/cartes.gouv.fr-entree-carto/pull/357)

* Prise en compte des choix utilisateurs (thème + consentement) partagés entre les briques de cartes.gouv [issue:1d5eb02321ebdc3427f4ac7d4a14ceb7c58fed3c](https://github.com/IGNF/cartes.gouv.fr-entree-carto/commit/1d5eb02321ebdc3427f4ac7d4a14ceb7c58fed3c)

* Placement correct de la barre latéral de widget actif sous Firefox et Chrome [extensions:#219](https://github.com/IGNF/geopf-extensions-openlayers/pull/219)

#### 🔒 [Sécurité]
---
