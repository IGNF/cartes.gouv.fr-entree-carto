# Unreleased

<https://github.com/IGNF/cartes.gouv.fr-entree-carto/compare/v1.0.4...HEAD>

## 🔖 version 1.0.4 - __DATE__

### 🎉 Résumé

Amélioration de la barre de recherche principale.
Mise à jour de la dépendance au framework VueDsfr. 
Amélioration du processus de recherche de couches et de mise à jour du catalogue de l'entrée cartographique.

### 💥 Breaking changes

### 📖 Changelog

#### ✨ [Ajout]

#### 🔨 [Evolution]

- Upgrade version vue-dsfr : vers 8.1.1 [#478](https://github.com/IGNF/cartes.gouv.fr-entree-carto/pull/478)
- Mise en cohérence des couches renvoyées par le moteur de recherche avec celles disponibles dans l'outil catalogue [#483](https://github.com/IGNF/cartes.gouv.fr-entree-carto/pull/483)
- Changement du nom du menu supérieur-droit : Menu carte s'affiche désormais dans la tooltip au survol [#485](https://github.com/IGNF/cartes.gouv.fr-entree-carto/pull/485)
- Barre de recherche : résultats "Lieux et adresses" et "Cartes et données" s'affichent sur la même fenêtre de résultats [ext-gpf-#346](https://github.com/IGNF/geopf-extensions-openlayers/pull/346)

#### 🔥 [Obsolète]

#### 🔥 [Suppression]

#### 🐛 [Correction]

- Mise à jour automatique du catalogue de couches [481](https://github.com/IGNF/cartes.gouv.fr-entree-carto/pull/481)
- Amélioration des performances de recherche de l'outil de catalogue et filtrage des couches listées [#489](https://github.com/IGNF/cartes.gouv.fr-entree-carto/pull/489)
- Correction graphique de la hauteur du catalogue qui pouvait parfois dépasser en hauteur sur le footer [#484](https://github.com/IGNF/cartes.gouv.fr-entree-carto/pull/484)
- Correction graphique de la hauteur du panel de recherche avancée par parcelle qui pouvait dépasser sur le footer [#488](https://github.com/IGNF/cartes.gouv.fr-entree-carto/pull/488)
- Filtrage de certaines propriétés de style (ex. label-stroke) pour qu'elles ne soient plus affichées dans la fenêtre d'affichage des attributions au clic (getFeatureInfo) [ext-gpf-357](https://github.com/IGNF/geopf-extensions-openlayers/pull/357)
- Correction de la taille des fenêtres pour afficher les résultats d'import de services ou d'autocomplétion [ext-gpf-#349](https://github.com/IGNF/geopf-extensions-openlayers/pull/349)

#### 🔒 [Sécurité]

---
