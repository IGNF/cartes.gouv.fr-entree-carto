# Unreleased

<https://github.com/IGNF/cartes.gouv.fr-entree-carto/compare/v1.0.7...HEAD>

## 🔖 version 1.0.7 - __DATE__

### 🎉 Résumé

Publication de l'espace personnel et des fonctionnalités qui y sont liées.
Diverses corrections sur l'espace personnel (favoris), amélioration du gestionnaire de couches, et de l'affichage du footer.

### 💥 Breaking changes

Mise à jour de la version du localStorage : perte des données de session.

### 📖 Changelog

#### ✨ [Ajout]
    
    - Espace Personnel : ajout des fonctionnalités de l'espace personnel : enregistrement, import, modification de données (#439,#564,#585) 
    - Menu Contextuel : ajout des enregistrements au menu contextuel (#579)
    - Theme sombre : affichage des notifications dans le thème sombre (#576)
    - Gestionnaire de couches : gestion de l'affichage des boutons edition / N&B en fonction du type de données
    - Gestionnaire de couches : ajout d'un menu pour choisir le thème des couches TMS

#### 🔨 [Evolution]

    - Geolocalisation : le clic sur le marker de géolocalisation centre la vue dessus

#### 🔥 [Obsolète]

#### 🔥 [Suppression]

    - Carte : suppression de la patience affichée sur la carte (#590)
    - Partage : suppression du petit de bouton de partage situé après ceux des réseaux sociaux (#591)

#### 🐛 [Correction]

    - Lien de partage : Gestion correcte de l'ordre des couches dans le permalien (#559)
    - Noir et Blanc : N&B correctement géré pour des couches de type mapbox issues des favoris
    - Espace Personnel : correction de l'activation du bouton 'Enregistrer une carte' dans le menu des favoris (#561)
    - Header : en mode connecté, le clic sur son nom de profil redirige vers le tableau de bord (#566)
    - Espace Personnel : correction de l'enregistrement des services de type WMS, WMTS ou MapBox dans les favoris (#563)
    - Partage : Gestion de l'erreur au chargement d'un lien de partage avec une couche inconnue (#534)
    - Footer : Correction du footer en cas de zoom ou dézoom sur la fenêtre du navigateur (#580)

#### 🔒 [Sécurité]

---
