# Unreleased

<https://github.com/IGNF/cartes.gouv.fr-entree-carto/compare/v1.0.6...HEAD>

## 🔖 version 1.0.6 - __DATE__

### 🎉 Résumé

Amélioration du temps de chargement du site et des performances de rendu.
Amélioration du lien de partage qui permet d'intégrer sa géolocalisation.
Amélioration de la fonctionnalité d'impression de la carte : possibilité de régler les marges, de donner un titre, et d'afficher ou non l'echelle.
Correction de diverses erreurs d'interface.

### 💥 Breaking changes

Version du localStorage incrémentée : perte des données de session. 

### 📖 Changelog

#### ✨ [Ajout]

  - Performance : utilisation d'un fichier de configuration unique (#529)

#### 🔨 [Evolution]

  - LayerSwitcher : ajout d'un bouton pour passer les couches en noir et blanc (24ba88876e8dda0dcf536721ccab99d0ee260a0d)
  - Impression : possibilité d'ajouter un titre, de régler les marges, et d'afficher ou non la légende (#522)
  - Partage : Ajout d'un marker permettant de partager sa position (#530)
  - Extensions : mise à jour de la version des extensions Géoplateforme pour OpenLayers en dépendance du projet en version 1.0.0-beta.4
  - Interface : réduction de la hauteur du footer (#572)

#### 🔥 [Obsolète]

#### 🔥 [Suppression]

#### 🐛 [Correction]

  - Cartalogue : correction de l'algorithme utilisé pour sa création qui ralentissait fortement le chargement de la page (#516)
  - Impression : Mise à jour de certaines propriétés de la page print suite à regressions introduites par #515 (#521)
  - Itinéraire / Isochrone : Les boutons d'enregistrement et d'export n'apparaissent que sur la fenêtre de résultats du calcul (24ba88876e8dda0dcf536721ccab99d0ee260a0d)
  - Menus cartographiques : Les menus de gestion des widgets, cartalogue, et de fonctions liées à la carte ne se superposent plus avec ceux des autres outils (#535)
  - Performance : amélioration du temps de chargement de l'entrée cartographique (#529, #532, #537)
  - Croquis : correction de la visibilité des pop-up permettant de rajouter des éléments attributaires aux éléments de dessin (#560)

#### 🔒 [Sécurité]

---
