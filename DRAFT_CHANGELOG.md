# Unreleased

<https://github.com/IGNF/cartes.gouv.fr-entree-carto/compare/v1.0.22...HEAD>

## 🔖 version 1.0.22 - __DATE__

### 🎉 Résumé

Ajout de nouveaux territoires dans les selecteur de territoires et évolutions sur l'espace personnel, le cartalogue et la gestion des fonctionnalités affichées sur l'interface.

### 💥 Breaking changes

### 📖 Changelog

#### ✨ [Ajout]

- Intégration Matomo IGN (#1322)
- Territoires : ajout de nouveaux territoires au widget de selecteur de territoires (#1320)

#### 🔨 [Evolution]

- Espace personnel : fenêtre de confirmation avant suppression d'un document personnel (#1334)
- Cartalogue: n’affiche plus les producteurs des cartes de base (#1327)
- Stockage : mécanisme de nettoyage "fin" du localStorage mis en place (#1330)
- Interface : nouveau mécanisme de gestion de la propriété affichée/active des widgets/fonctionnalités de la page (#1335)
- Informations attributaires : les items précédemment ouverts du panels s'ouvrent par défaut (ou l'item le plus haut de la liste sinon) (#1344)
- Outils : modification de l’icone quand un seul outil affiché et affichage d’un outil de plus en hauteur (#1350)

#### 🔥 [Obsolète]

#### 🔥 [Suppression]

#### 🐛 [Correction]

- Ajout d'une page 404 en cas de route inconnue sur explorer-les-cartes (#1328)
- Informations attributaires : correction de l'affichage du panel des infos attributaires en mode mobile (#1341)
- Bandeau d'alerte : invalidation du cache sur les alertes (#1336)

#### 🔒 [Sécurité]

- Mise à jour des dépendances de sécurités (#1333)
