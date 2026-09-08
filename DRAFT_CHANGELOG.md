# Unreleased

<https://github.com/IGNF/cartes.gouv.fr-entree-carto/compare/v1.0.20...HEAD>

## 🔖 version 1.0.20 - __DATE__

### 🎉 Résumé

Corrrections sur l'espace personnel, l'import et le chargement de données, et l'affichage des informations dans certains panels.
Le menu contextuel affiché au clic droit est allégé, et l'information des couches est directement accessible via un clic gauche sur la carte.

### 💥 Breaking changes

### 📖 Changelog

#### ✨ [Ajout]

- Panoramax : ajout d'une fonctionnalité de partage de photo depuis la visionneuse panoramax (#1103)

#### 🔨 [Evolution]

- GFI : l'activation du getFeatureInfo se fait au clic gauche (#1232)
- Menu Contextuel : le nombre d'entrées affichées dans le menu contextuel clic droit) est réduit (#1232)
- Espce personnel : Mise en place du permalien court dans les favoris (#1216)

#### 🔥 [Obsolète]

#### 🔥 [Suppression]

#### 🐛 [Correction]

- Territoires : modification emprise Wallis-et-Futuna pour centrer la vue correctement sur le territoire (46c8c76b6406f87df0438efbb065d3a3ccba9165, a23c74eac1ec729742e276f1b4c1762340ccf80a)
- UI : LayerImport affiche la liste des couches WMS/WMTS/Tuiles vectorielles (#1218)
- GPX : Correctif sur l'export du format GPX (#1206)
- Espace personnel : Correctif sur l'enregistrement d'une carte avec un import (#1207)
- Espace personnel : Deconnexion silencieuse si incoherence détéctée de la session (#1210)
- GFI : améliorations sur l’ouverture au sein du panel (#1225)
- Print : correction de l'affichage de l'echelle en fonction du format d'impression (#1234)
- UX : le copier-coller est possible dans les inputs via le clic droit (ext-ol-gpf-584, fix #1208)
- Coordonnées du curseur : l'edition des coordonnées en degrés sexagésimaux est de nouveau possible (ext-ol-gpf-583, fix #1219)

#### 🔒 [Sécurité]

