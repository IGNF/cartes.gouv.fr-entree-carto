# Unreleased

<https://github.com/IGNF/cartes.gouv.fr-entree-carto/compare/v1.0.2...HEAD>

## 🔖 version 1.0.2 - __DATE__

### 🎉 Résumé

Version 1.0.2 de l'entrée cartographique de la Géoplateforme.

### 💥 Breaking changes

LocalStorage incrémenté : perte des informations enregistrées dans les données de session.

### 📖 Changelog

Version 1.0.2 de l'entrée cartographique de la Géoplateforme.

Principaux changements :
- amélioration des performances lorsque l'utilisateur donne son consentement à la collecte des cookies
- ajout de nouvelles fonctionnalités : dessin, impression
- modification du positionnement des widgets sur l'interface
- corrections multiples sur le partage et l'affichage de certains éléments

#### ✨ [Ajout]

* Ajout du widget ControlList qui permet de limiter les nombre de boutons de widgets affichés à l'écran selon sa hauteur [#394](https://github.com/IGNF/cartes.gouv.fr-entree-carto/pull/394) et [#396](https://github.com/IGNF/cartes.gouv.fr-entree-carto/pull/396)

* Ajout d'une première version du widget de dessin [#373](https://github.com/IGNF/cartes.gouv.fr-entree-carto/pull/373)

* Ajout d'une première version de la fonctionnalité d'impression [#379](https://github.com/IGNF/cartes.gouv.fr-entree-carto/pull/379)

#### 🔨 [Evolution]

* Ajout temporaire dans la barre de recherche des couches privées accessibles via la clé ign_scan_ws [276e7b4](https://github.com/IGNF/cartes.gouv.fr-entree-carto/commit/276e7b433d2c5b0a7c9f28f70cebc3d589b6608a)

* Repositionnement des widgets sur l'interface cartographique [#391](https://github.com/IGNF/cartes.gouv.fr-entree-carto/pull/391)

* Mise en avant de certaines couches dans es résultats de la barre de recherche [7dc9abb](https://github.com/IGNF/cartes.gouv.fr-entree-carto/commit/7dc9abbe502c5fe87dbb82ee89232f4fcb105dfa)

* Changement sur l'interface du menu de gestion des widgets  [#392](https://github.com/IGNF/cartes.gouv.fr-entree-carto/pull/392)

* ID unique pour les éléments trackés par Eulerian [#411](https://github.com/IGNF/cartes.gouv.fr-entree-carto/pull/411)

#### 🔥 [Obsolète]

#### 🔥 [Suppression]

#### 🐛 [Correction]

* Retrait des doubles tooltips pour les boutons catalogue, widgets et partage [#383](https://github.com/IGNF/cartes.gouv.fr-entree-carto/pull/383)

* Positionnement des boutons sur petit écran en mode mobile [#397](https://github.com/IGNF/cartes.gouv.fr-entree-carto/pull/397)

* Mise à jour de la dépendance au DSFR en version 1.13.0 pour amélioration des performances du tracking Eulerian [#404](https://github.com/IGNF/cartes.gouv.fr-entree-carto/pull/404)

* Affichage des panels en mode mobile lorsque le footer est déplié [#406](https://github.com/IGNF/cartes.gouv.fr-entree-carto/pull/406)

* Synchronisation de l'ordre d'empilement des couches dans le permalien de partage [#409](https://github.com/IGNF/cartes.gouv.fr-entree-carto/pull/409)

* Widgets par défaut toujours ajoutés par le permalien [#410](https://github.com/IGNF/cartes.gouv.fr-entree-carto/pull/410)

#### 🔒 [Sécurité]
---
