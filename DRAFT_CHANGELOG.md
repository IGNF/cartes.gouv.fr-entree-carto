# Unreleased

<https://github.com/IGNF/cartes.gouv.fr-entree-carto/compare/v1.0.16-3...HEAD>

## 🔖 version 1.0.16-3 - __DATE__

### 🎉 Résumé

Corrections UI variées, amélioration de certaines performances de rendu.

### 💥 Breaking changes

### 📖 Changelog

#### ✨ [Ajout]
  
#### 🔨 [Evolution]

  - Cartalogue : Réoganisation de la liste des couches de référence (6ab2ddc44df96afb70efae182f460cccb653bc0c)
  - SearcheEngine: ajout du placeholder "Rechercher un lieu" (#1010)
  - Amélioration des performances de rendu de la carte et de l’interface (#1007)
  - Carte : Le fond cartographique est gris en cas d'absence de données à afficher (#1008)
  - Ajout d’une case à cocher «Ne plus afficher» sur la modale d’embarquement (#988)
  - SearchEngine : les communes de moins de 3 caractères sont renvoyées en cliquand sur la loupe de la barre de recherche(#1024)

#### 🔥 [Obsolète]

#### 🔥 [Suppression]

#### 🐛 [Correction]

  - Territories: fixe la hauteur de la modale (#886)
  - Echelle : l'outil d'echelle est repositionné à droite si pas d'autres outils présents (#1008)
  - LayerSwitcher : la largeur des panel est forcée (#1008)
  - Cartalogue : correction du scoll en mode mobile (#1008)
  - Panels: les panels des widgets de gauche sont positionnés sous la recherche (#1015)
  - Panels: fixe un scroll sur la légende
  - Panels: fixe la largeur du sous panel Infos de LayerSwitcher
  - Espace Personnel : Les dessin sont conservés dans le localStorage quand on ferme le widget de dessin et non perdus en mode déconnecté (#1019)
  - Itinéraire/Isochrone(HOTFIX) : répare l'interface des widgets itinéraire et isochrone
  
#### 🔒 [Sécurité]

---
