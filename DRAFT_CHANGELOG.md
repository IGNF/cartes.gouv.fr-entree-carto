# Unreleased

<https://github.com/IGNF/cartes.gouv.fr-entree-carto/compare/v1.0.15...HEAD>

## 🔖 version 1.0.15 - __DATE__

### 🎉 Résumé

Refactorisation et reprise globale de l'UI : taille des panels, aspects des boutons, adaptation de l'interface, du header et du footer en fonction de la taille de la fenêtre.
Espace personnel rendu plus robuste dans le chargement et l'enregistrement des documents personnels, session en mode authentifiée mieux gérée entre les différentes instances de cartes.gouv.

### 💥 Breaking changes

Reset du localStorage pour les modifications de l'espace personnel.

### 📖 Changelog

#### ✨ [Ajout]

  - Territories: persistance via localStorage des territoires utilisateurs (#969)
  
#### 🔨 [Evolution]

  - Header/Footer : adaptation du design aux maquettes (#816)
  - Authentification : mise en place d'une auth direct avec un client public (#894)
  - Menu des contrôles : respect de la maquette (#964)
  - Zoom: améliorations UI (#964) (fix #700)
  - Mini Carte: respect maquette (#964) (fix #794)
  - Alertes/UI : La modale informations (les alertes) est transformée en alerte, bandeau en haut de page (#906)
  - Mise à jour des packages dsfr et vue-dsfr (#972)
  - Territoires : les territoires personnalisés sont sauvegardés dans les données de session et donc conservés en rechargeant la page (#969)
  - Amélioration des performances de rendu de la carte et de l’interface (#1007)

#### 🔥 [Obsolète]

#### 🔥 [Suppression]

  - Eulerian : Suppression des actions Eulerian en utilisant la version standalone sans dépendance dsfr (#970)
  - Eulerian : Suppression de l'affichage de la modale de consentement quand consultation du site dans une iframe (#966)

#### 🐛 [Correction]

  - Header : correction d'un lien d'aide dans le header et du bouton "Decouvrir cartes.gouv" (#947)
  - Alertes : mise en place d'un contournement au cas où les alertes ne se chargent pas à l'initialisation (885fe6667659170adf413ac8dc650547f3078404, f349d20f08cd42d40d8e843b954f0e4e260e5e3a)
  - Footer : En mode mobile, le footer est intégré au header (#816)
  - Espace Perso : optimisation de l'interface et des requêtes pour le chargement des enregistrements (#894)
  - LayerSwitcher : L'ordre d'empilement des couches est correctement conservé sur la carte et dans le layerswitcher après rechargement de la page (#948)
  - Recherche : La recherche avancée de parcelles cadastrales est fonctionnelle sur les DROM-COM (#959)
  - Revue UI des widgets/boutons/panels (#964) (fix #672, #743, #844, #886, #888)
  - Amélioration accessibilité toggle du header compact (#972)
  - UI : amélioration du comportement de l'interface aux valeurs seuils de taille d'écran (#971)

#### 🔒 [Sécurité]

  - Dépendance : mise à jour oauth2-client@3.3.1
  - Dépendance : conversion des images en base64 directement réalisée dans le build des extensions geopf pour openlayers (#962)
---
