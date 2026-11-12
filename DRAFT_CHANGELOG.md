# Unreleased

<https://github.com/IGNF/cartes.gouv.fr-entree-carto/compare/v1.0.23...HEAD>

## 🔖 version 1.0.23 - __DATE__

### 🎉 Résumé

### 💥 Breaking changes

### 📖 Changelog

#### ✨ [Ajout]

- Recherche : possibilité de rechercher des coordonnées directement dans la barre de recherche simple (#1368)

#### 🔨 [Evolution]

- Import de données : des flux WMS/WMTS privé peuvent être importés si leur sécurisaton le permet (#1353)
- Informations attributaires : un marker apparait à l'endroit selectionné (https://github.com/IGNF/geopf-extensions-openlayers/pull/607)
- Navigation : contrainte de la navigation à l'emprise de la carte (#1364)

#### 🔥 [Obsolète]

#### 🔥 [Suppression]

#### 🐛 [Correction]

- Menu contextuel : le marker d'adresse et coordonnées affiché au clic droit disparait quand on ferme le panel (#1352)
- Import de couche : l'accès aux informations attributaires est possible sur les couches importées (https://github.com/IGNF/geopf-extensions-openlayers/pull/646)
- Recherche avancée : controle de la validité des coordonnées saisis (#1365)
- Itinéraire/Isochrone : utilisation de la ressource bdtopo-valhalla pour tous les cas d'utilisation itinéraire/isochrone (#1365)
- Légendes : ajout description/alt pour image des légendes (RGAA) (#1276)
- Navigation : ajout de liens d'évitement (contenu principal, navigation, recherche, pied de page) et d'une zone de contenu principal `<main>` (RGAA) (#1256)

#### 🔒 [Sécurité]

- Authentification sécurisée (#1354)

