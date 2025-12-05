# Unreleased

<https://github.com/IGNF/cartes.gouv.fr-entree-carto/compare/v1.0.12...HEAD>

## 🔖 version 1.0.12 - __DATE__

### 🎉 Résumé

Mise en place d'un mécanisme d'icônes personnalisés :

```html
<DsfrButton icon='cartes.gouv.fr:icon-catalog' />
<DsfrButton icon={ name: 'cartes.gouv.fr:icon-menu-tools', color: '#000091' } />
```

### 💥 Breaking changes

### 📖 Changelog

#### ✨ [Ajout]

#### 🔨 [Evolution]

  - Icones : mécanisme pour les icones personnalisés (#777)
  - Header : réduction de la taille du header et bouton pour le passer en mode compact (#715) 
  - Barre de Recherche : refonte de la barre de recherche (#800)

#### 🔥 [Obsolète]

#### 🔥 [Suppression]

  - Cartalogue : suppression du filtre de couches par services (#802)

#### 🐛 [Correction]
  
  - Footer : images des logos récupérées depuis les annexes de la Géoplateforme (#750)
  - Mini Carte : correction de l'affichage de la minicarte aux très petites ou très grandes echelles (#760)
  - Recherche d'adresse : correction de l'affichage des résultats en mode mobile (https://github.com/IGNF/geopf-extensions-openlayers/pull/456)

#### 🔒 [Sécurité]

---
