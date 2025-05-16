# Unreleased

<https://github.com/IGNF/cartes.gouv.fr-entree-carto/compare/v1.0.7...HEAD>

## 🔖 version 1.0.7 - __DATE__

### 🎉 Résumé

Diverses corrections sur l'espace personnel (favoris), amélioration du gestionnaire de couches, et de l'affichage du footer.

### 💥 Breaking changes

### 📖 Changelog

#### ✨ [Ajout]

    - Menu Contextuel : ajout des enregistrements au menu contextuel (#579)
    - Theme sombre : affichage des notifications dans le thème sombre (#576)
    - Gestionnaire de couches : gestion de l'affichage des boutons edition / N&B en fonction du type de données
    - Gestionnaire de couches : ajout d'un menu pour choisir le thème des couches TMS

#### 🔨 [Evolution]

    - Geolocalisation : le clic sur le marker de géolocalisation centre la vue dessus

#### 🔥 [Obsolète]

#### 🔥 [Suppression]

#### 🐛 [Correction]

    - Lien de partage : Gestion correcte de l'ordre des couches dans le permalien (#559)
    - Noir et Blanc : N&B correctement géré pour des couches de type mapbox issues des favoris
    - Espace Personnel : correction de l'activation du bouton 'Enregistrer une carte' dans le menu des favoris (#561)
    - Header : en mode connecté, le clic sur son nom de profil redirige vers le tableau de bord (#562)
    - Espace Personnel : correction de l'enregistrement des services de type WMS, WMTS ou MapBox dans les favoris (#563)
    - Partage : Gestion de l'erreur au chargement d'un lien de partage avec une couche inconnue (#534)
    - Footer : Correction du footer en cas de zoom ou dézoom sur la fenêtre du navigateur (#580)

#### 🔒 [Sécurité]

---
