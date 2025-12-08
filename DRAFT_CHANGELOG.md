# Unreleased

<https://github.com/IGNF/cartes.gouv.fr-entree-carto/compare/v1.0.12...HEAD>

## 🔖 version 1.0.12 - __DATE__

### 🎉 Résumé

Mise en place d'un mécanisme d'icônes personnalisés :

```html
<DsfrButton icon='cartes.gouv.fr:icon-catalog' />
<DsfrButton icon={ name: 'cartes.gouv.fr:icon-menu-tools', color: '#000091' } />
```

Nouvelle barre de recherche, évolutions sur le cartalogue, et mise en place d'un header réduit.

### 💥 Breaking changes

### 📖 Changelog

#### ✨ [Ajout]

  - Accueil : affichage d'une modale à la première ouverture sur un onglet (#824)
  - Cartalogue : ajout des cartes de référence dans le cartalogue (#825)

#### 🔨 [Evolution]

  - Icones : mécanisme pour les icones personnalisés (#777)
  - Icones : mise à jour des icones du site (#786, #788, #806)
  - Header : réduction de la taille du header et bouton pour le passer en mode compact (#715) 
  - Barre de Recherche : refonte de la barre de recherche (#800)
  - Partage : gestion de permalien spéciaux en cas de redirection (#693)
  - DSFR : mise à jour des dépendances à DSFR et Vue-DSFR (#789)
  - Footer : réorganisation de la disposition des logos partenaires (#805)

#### 🔥 [Obsolète]

#### 🔥 [Suppression]

  - Cartalogue : suppression du filtre de couches par services (#802)

#### 🐛 [Correction]

  - Vue : blocage du zoom maximum possible (#774)  
  - Footer : images des logos récupérées depuis les annexes de la Géoplateforme (#750)
  - Mini Carte : correction de l'affichage de la minicarte aux très petites ou très grandes echelles (#760)
  - Recherche d'adresse : correction de l'affichage des résultats en mode mobile (https://github.com/IGNF/geopf-extensions-openlayers/pull/456)
  - Footer : correction de l'affichage des logos qui étaient mal dimensionnés (#784)
  - Cartalogue : corrections de design,  d'affichage, de performances (#785)
  - Footer : correction de l'interaction de dépliage (#803)
  - Header : correction et evolutions- sur l'UI de l'entête (#811)
  - Cartalogue : mise à jour des fichiers de configuration pour tri automatique des couches et génération automatique des vignettes (752be0d088f91f173aa2ebb4dc26226a774917ff)
 
#### 🔒 [Sécurité]

---
