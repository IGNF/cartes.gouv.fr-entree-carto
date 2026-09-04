# Unreleased

<https://github.com/IGNF/cartes.gouv.fr-entree-carto/compare/v1.0.20...HEAD>

## 🔖 version 1.0.20 - __DATE__

### 🎉 Résumé

Evolution de l'espace personnel, améliorations UI, nouvelle option pour l'impression, et correctifs sur le partage

### 💥 Breaking changes

### 📖 Changelog

#### ✨ [Ajout]

#### 🔨 [Evolution]

- GFI : l'activation du getFeatureInfo se fait au clic gauche (#1232)
- Menu Contextuel : le nombre d'entrées affichées dans le menu contextuel clic droit) est réduit (#1232)

#### 🔥 [Obsolète]

#### 🔥 [Suppression]

#### 🐛 [Correction]

- Territoires : modification emprise Wallis-et-Futuna pour centrer la vue correctement sur le territoire (46c8c76b6406f87df0438efbb065d3a3ccba9165, a23c74eac1ec729742e276f1b4c1762340ccf80a)
- UI : LayerImport affiche la liste des couches WMS/WMTS/Tuiles vectorielles (#1218)
- Espace Personnel : synchroniser les positions des couches lors d'un appel de permalien via l'espace personnel (#1160)
- Print : Correctif sur l'échelle sur l'impression en 300 dpi (#1190)
- GPX : Correctif sur l'export du format GPX (#1206)
- Espace personnel : Correctif sur l'enregistrement d'une carte avec un import (#1207)
- Espace personnel : Deconnexion silencieuse si incoherence détéctée de la session (#1210)
- GFI : améliorations sur l’ouverture au sein du panel (#1225)

#### 🔒 [Sécurité]

