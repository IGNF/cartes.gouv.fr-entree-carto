# Unreleased

<https://github.com/IGNF/cartes.gouv.fr-entree-carto/compare/v1.0.15...HEAD>

## 🔖 version 1.0.15 - __DATE__

### 🎉 Résumé

### 💥 Breaking changes

### 📖 Changelog

#### ✨ [Ajout]

  - Territories: persistance via localStorage des territoires utilisateurs (#969)
  
#### 🔨 [Evolution]

  - Header/Footer: adaptation du design aux maquettes (#816)
  - Menu des contrôles: respect de la maquette
  - Zoom: améliorations UI (fix #700)
  - Mini Carte: respect maquette (fix #794)
  - La modale informations (les alertes) est transformée en alerte, bandeau en haut de page (#906)
  - Mise à jour des packages dsfr et vue-dsfr

#### 🔥 [Obsolète]

#### 🔥 [Suppression]

  - Suppression des actions Eulerian: utilise la version standalone sans dépendance dsfr

#### 🐛 [Correction]

  - Header : correction d'un lien d'aide dans le header et du bouton "Decouvrir cartes.gouv" (#947)
  - En mode mobile, le footer est intégré au header (#816)
  - Revue UI des widgets/boutons/panels (#964) (fix #672, #743, #844, #886, #888)
  - Amélioration accessibilité toggle du header compact

#### 🔒 [Sécurité]

  - Dépendance : conversion des images en base64 directement réalisée dans le build des extensions geopf pour openlayers (#962)
---
