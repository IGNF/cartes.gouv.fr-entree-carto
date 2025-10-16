# Unreleased

<https://github.com/IGNF/cartes.gouv.fr-entree-carto/compare/v1.0.10...HEAD>

## 🔖 version 1.0.10 - __DATE__

### 🎉 Résumé

Multiples réorganisations de l'interface et reprises sur le menu contextuel et le panel de gestion des widgets. Diverses corrections sur plusieurs fonctionnalités.

### 💥 Breaking changes

Mise à jour de la version du localStorage, perte des données enregistrées dedans (paramètres de la carte).

### 📖 Changelog

#### ✨ [Ajout]

  - Geocodage inverse : possibilité de copier le résultat (#705 et https://github.com/IGNF/geopf-extensions-openlayers/pull/415)

#### 🔨 [Evolution]

  - Coordonnées de la souris : options avancées disponible via un accordéon à déplier (https://github.com/IGNF/geopf-extensions-openlayers/pull/425)
  - Recherche : la vue se centre automatiquement sur l'adresse ou le lieu selectionné en résultat (https://github.com/IGNF/geopf-extensions-openlayers/pull/432)
  - Menu des Widgets : mise à jour de la présentation de la liste des widgets et de leur description (#687)
  - Menu des Widgets : Changement de la position des certain poutons et panels, et de certains icons (#713, #705 et https://github.com/IGNF/geopf-extensions-openlayers/pull/442)
  - Menu des Widgets : Zoom et MiniCarte rendus facultatifs (#705)
  - Informations au clic : les informations attributaires des couches sous le clic sont accessibles uniquement via le menu contextuel par le clic droit (#705)
  - Menu Contextuel : retrait des entrées "Imprimer carte", "Partager", "Ajouter données", "Mes Enregistrements" (#720)
  - Menu Contextuel : changement du titre de l'entrée "isochrone" en "Zone selon temps de trajet" (https://github.com/IGNF/geopf-extensions-openlayers/commit/3d228a692c8d51155bbdf8c8c32bb51629b6a03f)
  - Footer : changement de l'url vers service-public.gouv.fr (https://github.com/IGNF/cartes.gouv.fr-entree-carto/commit/f7c70c658b2709fc86cbedb73c4671dfd1bc0e88)
  - Mini Carte : réduction de la taille de la minicarte et mise en place de bords arrondis (#748)

#### 🔥 [Obsolète]

#### 🔥 [Suppression]

#### 🐛 [Correction]

  - Coordonnées : homogénéisation de l'ordre d'affichage des coordonnées sur le site : latitude, longitude (https://github.com/IGNF/geopf-extensions-openlayers/pull/421)
  - Espace Perso : correction du #698 pour le chargement des cartes enregistrées (#701)
  - Partage : Correction du chargement des iframes avec bookmarks (a02e8e826efc448a45f7bdecf5dff95282ecfc1e)
  - Import de données : Le panel d'import de données s'ouvre correctement à gauche en remplacant le menu carte (#699)
  - LayerSwitcher : Le drag & drop de couches est réparé sous les navigateurs au moteur Chrome (https://github.com/IGNF/geopf-extensions-openlayers/pull/444)
  - Menu Contextuel : Le clic pour obtenir les informations sur la couche n'active pas définitivement la fonctionnalité au clic gauche sur la carte (#717) 
  - Informations des couches (GetFeatureInfo) : le texte affiché en résultat dans le panel d'informations des couches est sélectionnable (#718 et https://github.com/IGNF/geopf-extensions-openlayers/pull/446)

#### 🔒 [Sécurité]

---
