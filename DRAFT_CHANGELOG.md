# Unreleased

<https://github.com/IGNF/cartes.gouv.fr-entree-carto/compare/v1.0.14...HEAD>

## 🔖 version 1.0.14 - __DATE__

### 🎉 Résumé

Evolutions majeures sur la fonctionnalité d'impression qui permet désormais d'imprimer tous les types de couches et de choisir son format d'impression.
Un croquis créé hors connexion n'est désormais plus perdu si on se connecte à son espace personnel lors de la même session.

Multiples corrections fonctionnelles et d'interface.

### 💥 Breaking changes

### 📖 Changelog

#### ✨ [Ajout]
  
  - Impression : possibilité de choisir son format image d'impression (#905)

#### 🔨 [Evolution]

  - Partage : les permaliens de type "ajout de données" filtrent les couches en doublon (#893)
  - Carte : possibilité d'activer du zoom-client pour certaines des couches de référence et activation du zoom max 21 (#892)
  - Espace personnel : possibilité de conserver temporairement son travail en cours en mode non connecté (#909)

#### 🔥 [Obsolète]

#### 🔥 [Suppression]

  - Itinéraire : suppression de mode de calcul "Plus rapide" et de la section "Passages autorisés" lorsque le calcul est lancé en mode piéton (#921, #722)

#### 🐛 [Correction]

  - Notifications : limitation du nombre de notifications affichées simultanément à l'écran (#885) 
  - Entête : correction des liens vers l'aide et la documentation pour qu'ils ouvrent un nouvel onglet (#891)
  - Impression : toutes les couches (calcul, imports, tms, vecteur) se retrouvent bien dans la carte à imprimer (#902)
  - Légende : affichage de la légende possible en mode mobile (#887)
  - Barre de recherche : les interactions de clic des pop-ups affichées sur la carte après une recherche sont fonctionnelles (#907)
  - Permalien : amélioration de la lecture des permaliens issus de la redirection du Géoportail (#908)
  - Espace personnel : la modification et le réenregistrement d'un document dans son espace personnel est fonctionnel (#918)
  - Barre de recheche : la recherche avancée affiche les coordonnées dans l'ordre "Latitude-Longitude" (#821, #857)

#### 🔒 [Sécurité]

---
