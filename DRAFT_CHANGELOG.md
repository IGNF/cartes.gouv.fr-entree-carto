# Unreleased

<https://github.com/IGNF/cartes.gouv.fr-entree-carto/compare/v1.0.17...HEAD>

## 🔖 version 1.0.18 - __DATE__

### 🎉 Résumé

Nouveau widget Panoramax qui permet de visualiser des photos immersives libres via des instances de contribution collaboratives.
Refonte du menu de gestion des widgets sur l'interface.

### 💥 Breaking changes

### 📖 Changelog

#### ✨ [Ajout]

  - Panoramax : Ajout du nouveau widget Panoramax (#1046)
  - Barre de Recherche : Ajout du Lambert II étendu dans les systèmes de références de la recherche avancée par coordonnées (#1080)
  - Barre de Recherche : Conversion à la volée des coordonnées lors du changement de système de référence (#1080)
  - PLan : Ajout de la route "/plan/:insee" pour afficher le plan d'une ville (#1094)
 
#### 🔨 [Evolution]

  - Gestionnaire de couche : au survol de son entrée, le titre de la couche s'affiche dans un tooltip (#505)
  - Header : la signature change pour "Notre territoire commun" (#1084)
  - Gestionnaire d’outils : intégration du «nouveau» widget ControlList (#998)
  - Gestionnaire d’outils : déplacement des autres outils dans «Préférences d’affichage» (#998)
  - Panoramax : filtre image 360 actif par défaut (#1098)

#### 🔥 [Obsolète]

#### 🔥 [Suppression]

#### 🐛 [Correction]

- UI extensions : fixe la position d'un panel dans un panel (#1078)
- UI : empêche le décalage de la page au focus clavier (#1082)
- UI : masque le badge en mobile (#1082)
- UI : les icones des thèmes Société et Océans du catalogue sont correctement affichés (#1083)
- Partage : les données issues de l'espace personnel sont correctement affichées dans les iframes (#1090)

#### 🔒 [Sécurité]

---
