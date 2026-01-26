# Entrée cartographique de cartes.gouv.fr

Toutes les modifications notables apportées à ce projet sont documentées dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/) et ce projet respecte [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## 🔖 version 1.0.13 - 22/01/2026

### 🎉 Résumé

### 💥 Breaking changes

### 📖 Changelog

#### ✨ [Ajout]

#### 🔨 [Evolution]

  - Territoires : ajout d'une fonctionnalité d'enregistrement de territoires "custom" définis par l'utilisateur (#799)
  - Mobile : réactivation du menu contextuel en mode mobile (#846)
  - Gestionnaire de couches : les titres peuvent s'afficher sur deux lignes (#869)
  - Notifications : réduction du nombre de notifications affichées à l'écran lors du chargement de couches via permalien ou le cartalogue (#851)

#### 🔥 [Obsolète]

#### 🔥 [Suppression]

#### 🐛 [Correction]

  - Footer : modification de la description (#853)
  - LayerSwitcher : mise à jour du compteur de couches (#810)
  - Référencement  : amélioration du contenu meta pour le référencement naturel du site (80a34b37e)
  - Signalement et Annoter la carte : correction de la superposition de modales d'annotation (#854)
  - Cartalogue : les vignettes renseignées par les producteurs de données s'affichent correctement (#859)
  - Connexion : mise à jour du header et de la connexion pour meilleure gestion de l'expiration de la sessions utilisateur (#863)
  - Modale de bienvenue : affichage correct de la modale de bienvenue quand le suivi Eulerian est activé (#872)

#### 🔒 [Sécurité]

---

## 🔖 version 1.0.12 - 10/12/2025

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
  - Cartalogue : mise en avant de couches spécifiques en début de la liste des cartes de référence (#473)

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
  - Cartalogue : theme sombre géré pour tous les composants du cartalogue (#473)
 
#### 🔒 [Sécurité]

---

## 🔖 version 1.0.11 - 14/11/2025 

### 🎉 Résumé 

Refontes majeures du Gestionnaire de couche et du Cartalogue. Autres reprises UI sur le panel de consultation des informations des couches et sur les points de rupture de l'interface. 

### 💥 Breaking changes 

### 📖 Changelog 

#### ✨ [Ajout] 

#### 🔨 [Evolution] 

- Gestionnaire de couches : refonte complète du rendu et de l'UX de l'outil (#745) 
- Footer : mise à jour des logos (#726) 
- Informations attributaires : mise à jour du panel de résultat de consultation des informations attributaires des couches (#744) 
- UI : nouveaux points de rupture pour l'affichage de nombres de boutons différentes en fonction de la hauteur de l'écran (#746) 
- Espace Perso : mise à jour du panel en mode connecté sans enregistrements (#757) 
- Catalogue : refonte du rendu et de l'UX de l'outil (#712) 

#### 🔥 [Obsolète] 

#### 🔥 [Suppression] 

#### 🐛 [Correction] 

- Footer : images des logos récupérées depuis les annexes de la Géoplateforme (#750) 
- Mini Carte : correction de l'affichage de la minicarte aux très petites ou très grandes echelles (#760) 
- Recherche d'adresse : correction de l'affichage des résultats en mode mobile (https://github.com/IGNF/geopf-extensions-openlayers/pull/456) 

#### 🔒 [Sécurité] 

---

## 🔖 version 1.0.10 - 20/10/2025

### 🎉 Résumé

Multiples réorganisations de l'interface et reprises sur le menu contextuel et le panel de gestion des widgets. Diverses corrections sur plusieurs fonctionnalités.

### 💥 Breaking changes

Mise à jour de la version du localStorage, perte des données enregistrées dedans (paramètres de la carte).

### 📖 Changelog

#### ✨ [Ajout]

  - Geocodage inverse : possibilité de copier le résultat (#705 et https://github.com/IGNF/geopf-extensions-openlayers/pull/415)

#### 🔨 [Evolution]

  - Coordonnées de la souris : options avancées disponibles via un accordéon à déplier (https://github.com/IGNF/geopf-extensions-openlayers/pull/425)
  - Recherche : la vue se centre automatiquement sur l'adresse ou le lieu selectionné en résultat (https://github.com/IGNF/geopf-extensions-openlayers/pull/432)
  - Menu des Widgets : mise à jour de la présentation de la liste des widgets et de leur description (#687)
  - Menu des Widgets : Changement de la position de certains boutons et panels, et de certains icones (#713, #705 et https://github.com/IGNF/geopf-extensions-openlayers/pull/442)
  - Menu des Widgets : Widgets Zoom et Mini Carte rendus facultatifs (#705)
  - Informations au clic : les informations attributaires des couches sous le clic sont accessibles uniquement via le menu contextuel par le clic droit (#705)
  - Menu Contextuel : retrait des entrées "Imprimer carte", "Partager", "Ajouter données", "Mes Enregistrements" (#720)
  - Menu Contextuel : changement du titre de l'entrée "isochrone" en "Zone selon temps de trajet" (https://github.com/IGNF/geopf-extensions-openlayers/commit/3d228a692c8d51155bbdf8c8c32bb51629b6a03f)
  - Footer : changement de l'url du lien vers service-public.gouv.fr (https://github.com/IGNF/cartes.gouv.fr-entree-carto/commit/f7c70c658b2709fc86cbedb73c4671dfd1bc0e88)
  - Mini Carte : réduction de la taille de la mini carte et mise en place de bords arrondis (#748)

#### 🐛 [Correction]

  - Coordonnées : homogénéisation de l'ordre d'affichage des coordonnées sur le site : latitude, longitude (https://github.com/IGNF/geopf-extensions-openlayers/pull/421)
  - Espace Perso : correction du #698 pour le chargement des cartes enregistrées (#701)
  - Partage : Correction du chargement des iframes avec bookmarks (a02e8e826efc448a45f7bdecf5dff95282ecfc1e)
  - Import de données : Le panel d'import de données s'ouvre correctement à gauche en remplacant le menu carte si celui-ci est ouvert (#699)
  - LayerSwitcher : Le drag & drop de couches est réparé sous les navigateurs fonctionnant avec le moteur Chrome (https://github.com/IGNF/geopf-extensions-openlayers/pull/444)
  - Menu Contextuel : Le clic pour obtenir les informations sur la couche n'active pas définitivement la fonctionnalité au clic gauche sur la carte (#717)
  - Informations des couches (GetFeatureInfo) : le texte affiché en résultat dans le panel d'informations des couches est sélectionnable (#718 et https://github.com/IGNF/geopf-extensions-openlayers/pull/446)

---

## 🔖 version 1.0.9 - 25/08/2025 

### 🎉 Résumé 

Corrections diverses sur l’UI et ajout du mode édition sur l’outil d’affichage des coordonnées de la souris. 

### 💥 Breaking changes

### 📖 Changelog

#### ✨ [Ajout]

- Coordonnées de la souris : ajout du mode édition pour choisir les coordonnées de centrage (#671)

#### 🔨 [Evolution]

- Zoom : Mise à jour des icones pour les fonctions de zoom (via geopf-ext-ol-#412) 

#### 🔥 [Obsolète]

#### 🔥 [Suppression]

#### 🐛 [Correction]

- UI : le bouton permettant d’afficher les widgets additionnels (“+”) reste toujours positionné en dernier élément de la pile supérieure droite de boutons (#664)
- Partage : dans le lien de partage, seuls 6 chiffres significatifs sont enregistrés pour les coordonnées d’un partage de géolocalisation (#665)
- UI : en mode mobile, les panels se positionnent correctement en hauteur (#667)
- LayerSwitcher : en mode mobile, le menu des fonctionnalités ne laisse plus d'espace vide (via geopf-ext-ol-#417) 
- Itinéraire/Isochrone : Mise en conformité des requêtes itinéraire / isochrone en réduisant la précision des coordonnées à 5 chiffres significatifs (via geopf-ext-ol-#411) 

#### 🔒 [Sécurité]

---

## 🔖 version 1.0.8 - 02/07/2025

### 🎉 Résumé

Ajout de la fonctionnalité de signalement accessible depuis le menu contextuel (clic droit) ou le menu carte en haut à gauche. 
Reprise du design des boutons, du footer, et de la fenêtre de consentement.
Branchement de la configuration du cartalogue au service de recherche de la Géoplateforme, et utilisation d'une clé d'accès dédiée pour les offres sur la route private.

### 💥 Breaking changes

### 📖 Changelog

#### ✨ [Ajout]

- Signalement : Outil de signalement d'anomalie accessible depuis le menu carte ou le menu contextuel (#622)
- Partage : nouveau type de permalien pour compléter la configuration existante enregistrée dans le localStorage (#641)

#### 🔨 [Evolution]

- Espace Personnel : en mode connecté, enregistrement automatique des imports de données vectorielles (#603)
- Partage : réduction du nombre de chiffres après la virgule des coordonnées (#617)
- Partage : retrait des widgets permanents du permalien (#625)
- UI : redesign des boutons (#618, #619)
- Configuration : Gestion homogène des messages d'alertes en cas d'incidents ou d'informations à afficher (#624)
- Consentement : Mise à jour de la fenêtre de consentement au format standard de cartes.gouv (#626)
- Connexion : synchronisation de la connexion avec les autres pages de cartes.gouv (#640)
- Espace Personnel : ajout d'un bouton dans l'espace personnel pour directement copier ses cartes (#649)

#### 🔥 [Suppression]

- Partage : retrait des widgets permanents du permalien (#625)

#### 🐛 [Correction]

- Partage : prise en compte du style pour les couches TMS dans le lien de partage (#610)
- Notifications : correction de l'affichage de notifications intempestives en cas de donnée inexistante au chargement (e8e2131e32ba264b6fe15e91c7966f5d3e3007e1)
- Plein Écran : correctif pour garder tous les boutons de la carte en pleine écran (79637fe8730235d7fd2e5f60c48597e0cafea808)
- Footer : mise en conformité du footer réduit en mode dépliable (#620)
- UI : décalage dans l'alignement des boutons (#623)
- Configuration : Utilisation d’une clé d’accès dédiée (81aed043c6e6f75553e09b01684eb929a9868687)
- LayerSwitcher : correction de la fonctionnalité de centrage sur emprise en cas de contraintes non exprimées en 4326 (#642)
- Geocodage Inverse : correction de la recherche par cercle (#643)

---

## 🔖 version 1.0.7 - 20/05/2025

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

## 🔖 version 1.0.6 - 28/04/2025

### 🎉 Résumé

Amélioration du temps de chargement du site et des performances de rendu.
Amélioration du lien de partage qui permet d'intégrer sa géolocalisation.
Amélioration de la fonctionnalité d'impression de la carte : possibilité de régler les marges, de donner un titre, et d'afficher ou non l'echelle.
Correction de diverses erreurs d'interface.

### 💥 Breaking changes

Version du localStorage incrémentée : perte des données de session.

### 📖 Changelog

#### ✨ [Ajout]

  - **Performance :** utilisation d'un fichier de configuration unique (#529)

#### 🔨 [Evolution]

  - **LayerSwitcher :** ajout d'un bouton pour passer les couches en noir et blanc (24ba88876e8dda0dcf536721ccab99d0ee260a0d)
  - **Impression :** possibilité d'ajouter un titre, de régler les marges, et d'afficher ou non la légende (#522)
  - **Partage :** Ajout d'un marker permettant de partager sa position (#530)
  - **Extensions :** mise à jour de la version des extensions Géoplateforme pour OpenLayers en dépendance du projet en version 1.0.0-beta.4
  - **Interface :** réduction de la hauteur du footer (#572)

#### 🔥 [Obsolète]

#### 🔥 [Suppression]

#### 🐛 [Correction]

  - **Cartalogue :** correction de l'algorithme utilisé pour sa création qui ralentissait fortement le chargement de la page (#516)
  - **Impression :** Mise à jour de certaines propriétés de la page print suite à regressions introduites par #515 (#521)
  - **Itinéraire / Isochrone :** Les boutons d'enregistrement et d'export n'apparaissent que sur la fenêtre de résultats du calcul (24ba88876e8dda0dcf536721ccab99d0ee260a0d)
  - **Menus cartographiques :** Les menus de gestion des widgets, cartalogue, et de fonctions liées à la carte ne se superposent plus avec ceux des autres outils (#535)
  - **Performance :** amélioration du temps de chargement de l'entrée cartographique (#529, #532, #537)
  - **Croquis :** correction de la visibilité des pop-up permettant de rajouter des éléments attributaires aux éléments de dessin (#560)

#### 🔒 [Sécurité]

---

## 🔖 version 1.0.5 - 10/03/2025

### 🎉 Résumé

Ajout d'une fonctionnalité pour exporter sur son ordinateur au format souhaité ses dessins, itinéraires, isochrones, profils altimétriques.
La recherche par coordonnées est désormais accessible via la recherche avancée.
Le widget Catalogue ("Cartalogue") tri désormais les sections et le titre des couches par ordre alphabétique. La description des couches peut être rendue visible en cliquant sur un bouton "Afficher plus".
Les résultats de calcul d'itinéraire sont affichés de manière plus lisible.

### 💥 Breaking changes

### 📖 Changelog

#### ✨ [Ajout]

  - Croquis et calculs : Ajout d'un bouton pour exporter ses créations de type croquis ou calcul (#509)

#### 🔨 [Evolution]

  - Partage : Mise en conformité avec la maquette du bouton copier-coller (#479)
  - Cartalogue : tri par ordre alphabétique des couches selon le thème et le producteur (#503)
  - Cartalogue : description des couches cachée, ajout d'un bouton "Afficher plus" pour la voir (#507)
  - Recherche : la recherche par coordonnées est intégrée à la recherche avancée (#508)

#### 🔥 [Obsolète]

#### 🔥 [Suppression]

#### 🐛 [Correction]

  - Itinéraire : correction de l'affichage des résultats d'itinéraire (#508)
  - Catalogue : correction en cas de couche sans configuration chargée (#503)

#### 🔒 [Sécurité]

---

## 🔖 version 1.0.4 - 17/02/2025

### 🎉 Résumé

Amélioration de la barre de recherche principale.
Mise à jour de la dépendance au framework VueDsfr. 
Amélioration du processus de recherche de couches et de mise à jour du catalogue de l'entrée cartographique.

### 💥 Breaking changes

### 📖 Changelog

#### ✨ [Ajout]

#### 🔨 [Evolution]

- Upgrade version vue-dsfr : vers 8.1.1 [#478](https://github.com/IGNF/cartes.gouv.fr-entree-carto/pull/478)
- Mise en cohérence des couches renvoyées par le moteur de recherche avec celles disponibles dans l'outil catalogue [#483](https://github.com/IGNF/cartes.gouv.fr-entree-carto/pull/483)
- Changement du nom du menu supérieur-droit : Menu carte s'affiche désormais dans la tooltip au survol [#485](https://github.com/IGNF/cartes.gouv.fr-entree-carto/pull/485)
- Barre de recherche : résultats "Lieux et adresses" et "Cartes et données" s'affichent sur la même fenêtre de résultats [ext-gpf-#346](https://github.com/IGNF/geopf-extensions-openlayers/pull/346)

#### 🔥 [Obsolète]

#### 🔥 [Suppression]

#### 🐛 [Correction]

- Mise à jour automatique du catalogue de couches [481](https://github.com/IGNF/cartes.gouv.fr-entree-carto/pull/481)
- Amélioration des performances de recherche de l'outil de catalogue et filtrage des couches listées [#489](https://github.com/IGNF/cartes.gouv.fr-entree-carto/pull/489)
- Correction graphique de la hauteur du catalogue qui pouvait parfois dépasser en hauteur sur le footer [#484](https://github.com/IGNF/cartes.gouv.fr-entree-carto/pull/484)
- Correction graphique de la hauteur du panel de recherche avancée par parcelle qui pouvait dépasser sur le footer [#488](https://github.com/IGNF/cartes.gouv.fr-entree-carto/pull/488)
- Filtrage de certaines propriétés de style (ex. label-stroke) pour qu'elles ne soient plus affichées dans la fenêtre d'affichage des attributions au clic (getFeatureInfo) [ext-gpf-357](https://github.com/IGNF/geopf-extensions-openlayers/pull/357)
- Correction de la taille des fenêtres pour afficher les résultats d'import de services ou d'autocomplétion [ext-gpf-#349](https://github.com/IGNF/geopf-extensions-openlayers/pull/349)

#### 🔒 [Sécurité]

---

## 🔖 version 1.0.3 - 04/02/2025 

### 🎉 Résumé 

Version 1.0.3 de l'entrée cartographique de la Géoplateforme. 

**Principaux changements :** 

- améliorations multiples sur le fonctionnel et l'affichage des résultats de la barre de recherche. A suivre. 
- ajout d'un menu de fonctionnalités non cartographiques avec l'impression, le partage, ou encore le choix du thème de la page (lumineux ou sombre) 
- ajout d'un menu contextuel qui s'affiche avec un clic droit sur la carte. Ce menu offre des raccourcis vers des fonctionnalités comme le calcul d’itinéraire, le catalogue, ou encore l’affichage de coordonnées.  
- réorganisation des boutons et de l'accès à certaines fonctionnalités comme le catalogue ou le partage. 

### 📖 Changelog 

#### ✨ [Ajout] 

- nouveau menu pour accéder à certaines fonctionnalités  non cartographiques, comme le partage ou l'impression de cartes ([#407](https://github.com/IGNF/cartes.gouv.fr-entree-carto/pull/407)) 
- ajout de la fonctionnalité d'impression de la carte ([#431](https://github.com/IGNF/cartes.gouv.fr-entree-carto/pull/431)) 
- ajout d'un menu contextuel lorsqu'un clic droit est réalisé sur la carte ([#455](https://github.com/IGNF/cartes.gouv.fr-entree-carto/pull/455) [#468](https://github.com/IGNF/cartes.gouv.fr-entree-carto/pull/468) [#470](https://github.com/IGNF/cartes.gouv.fr-entree-carto/pull/470)) 

  
#### 🔨 [Evolution] 

- amélioration des entrées affichées en autocomplétion de la barre de recherche ([#445](https://github.com/IGNF/cartes.gouv.fr-entree-carto/pull/445)) 
- mise à jour de la bibliothèque cartographique Openlayers utilisée pour afficher les images cartographiques en version 10 ([#447](https://github.com/IGNF/cartes.gouv.fr-entree-carto/pull/447)) 
- mise à jour des extensions Géoplateforme pour OpenLayers en version [1.0.0-beta2](https://github.com/IGNF/geopf-extensions-openlayers/releases/tag/1.0.0-beta.2) 
- refonte de l'outil de dessin pour améliorer sa conformité au DSFR ([#448](https://github.com/IGNF/cartes.gouv.fr-entree-carto/pull/448)) 

#### 🔥 [Obsolète] 

#### 🔥 [Suppression] 

- Suppression du partage de carte via X (ex. Twitter) ([#476](https://github.com/IGNF/cartes.gouv.fr-entree-carto/pull/476)) 


#### 🐛 [Correction] 

- ajout d'une croix de fermeture à la pop-up affichée par le marker de geolocalisation ([#445](https://github.com/IGNF/cartes.gouv.fr-entree-carto/pull/445)) 
- correction du menu de gestion des widgets ([#438](https://github.com/IGNF/cartes.gouv.fr-entree-carto/pull/438)) 
- correction de l'affichage des résultats de la barre de recherche en mode mobile ([#446](https://github.com/IGNF/cartes.gouv.fr-entree-carto/pull/446)) 
- homogénéisation du header avec les autres briques : ajout de l'entrée "Cartes" ([#440](https://github.com/IGNF/cartes.gouv.fr-entree-carto/pull/440)) 
- paramétrage du HTML pour être interprété en français par le navigateur ([#425](https://github.com/IGNF/cartes.gouv.fr-entree-carto/pull/425)) 


#### 🔒 [Sécurité] 

---

## 🔖 version 1.0.2 - 17/12/2024

### 🎉 Résumé

Version 1.0.2 de l'entrée cartographique de la Géoplateforme.

### 💥 Breaking changes

LocalStorage incrémenté : perte des informations enregistrées dans les données de session.

### 📖 Changelog

Version 1.0.2 de l'entrée cartographique de la Géoplateforme.

**Principaux changements :**
- amélioration des performances lorsque l'utilisateur donne son consentement à la collecte des cookies
- ajout de nouvelles fonctionnalités : dessin, impression
- modification du positionnement des widgets sur l'interface
- corrections multiples sur le partage et l'affichage de certains éléments

#### ✨ [Ajout]

* Ajout du widget ControlList qui permet de limiter les nombre de boutons de widgets affichés à l'écran selon sa hauteur [#394](https://github.com/IGNF/cartes.gouv.fr-entree-carto/pull/394) et [#396](https://github.com/IGNF/cartes.gouv.fr-entree-carto/pull/396)

* Ajout d'une première version du widget de dessin [#373](https://github.com/IGNF/cartes.gouv.fr-entree-carto/pull/373). Evolutions attendues dans une release ultérieure pour des améliorations sur l'UI et l'UX de l'outil.

* Ajout d'une première version de la fonctionnalité d'impression [#379](https://github.com/IGNF/cartes.gouv.fr-entree-carto/pull/379)

#### 🔨 [Evolution]

* Ajout temporaire dans la barre de recherche des couches privées accessibles via la clé ign_scan_ws [276e7b4](https://github.com/IGNF/cartes.gouv.fr-entree-carto/commit/276e7b433d2c5b0a7c9f28f70cebc3d589b6608a)

* Repositionnement des widgets sur l'interface cartographique [#391](https://github.com/IGNF/cartes.gouv.fr-entree-carto/pull/391)

* Mise en avant de certaines couches dans es résultats de la barre de recherche [7dc9abb](https://github.com/IGNF/cartes.gouv.fr-entree-carto/commit/7dc9abbe502c5fe87dbb82ee89232f4fcb105dfa)

* Changement sur l'interface du menu de gestion des widgets  [#392](https://github.com/IGNF/cartes.gouv.fr-entree-carto/pull/392)

* ID unique pour les éléments trackés par Eulerian [#411](https://github.com/IGNF/cartes.gouv.fr-entree-carto/pull/411)

#### 🔥 [Obsolète]

#### 🔥 [Suppression]

#### 🐛 [Correction]

* Retrait des doubles tooltips pour les boutons catalogue, widgets et partage [#383](https://github.com/IGNF/cartes.gouv.fr-entree-carto/pull/383)

* Positionnement des boutons sur petit écran en mode mobile [#397](https://github.com/IGNF/cartes.gouv.fr-entree-carto/pull/397)

* Mise à jour de la dépendance au DSFR en version 1.13.0 pour amélioration des performances du tracking Eulerian [#404](https://github.com/IGNF/cartes.gouv.fr-entree-carto/pull/404)

* Affichage des panels en mode mobile lorsque le footer est déplié [#406](https://github.com/IGNF/cartes.gouv.fr-entree-carto/pull/406)

* Synchronisation de l'ordre d'empilement des couches dans le permalien de partage [#409](https://github.com/IGNF/cartes.gouv.fr-entree-carto/pull/409)

* Widgets par défaut toujours ajoutés par le permalien [#410](https://github.com/IGNF/cartes.gouv.fr-entree-carto/pull/410)

#### 🔒 [Sécurité]

---

## 🔖 version 1.0.1 - 19/11/2024
### 🎉 Résumé

Version 1.0.1 de l'entrée cartographique de la Géoplateforme.

**Attention** : le consentement des cookies utilisateurs implique une forte dégradation des performances !

### 💥 Breaking changes

### 📖 Changelog

#### ✨ [Ajout]

* Ajout du widget d'import de données [#324](https://github.com/IGNF/cartes.gouv.fr-entree-carto/pull/324)

* Ajout du widget de getFeatureInfo pour récupérer les informations attributaires des couches au clic [#354](https://github.com/IGNF/cartes.gouv.fr-entree-carto/pull/354)

* Ajout du widget de profil altimétrique [#325](https://github.com/IGNF/cartes.gouv.fr-entree-carto/pull/325)

* Ajout des tooltips DSFR au survol des boutons des widgets [extensions:#210](https://github.com/IGNF/geopf-extensions-openlayers/pull/210)

#### 🔨 [Evolution]

* LayerSwitcher et Barre de recherche en widgets fixes [#348](https://github.com/IGNF/cartes.gouv.fr-entree-carto/pull/348)

* Positionnement fixe des panel "dialog" des widgets [#350](https://github.com/IGNF/cartes.gouv.fr-entree-carto/pull/350)

* Ajout d'un marker sur la carte lors d'un centrage via la barre de recherche (simple ou avancée) [#345](https://github.com/IGNF/cartes.gouv.fr-entree-carto/pull/345)

* Ajout d'une version au localStorage pour que celui-ci se vide si besoin en cas de relivraison du composant [#353](https://github.com/IGNF/cartes.gouv.fr-entree-carto/pull/353)

* Plus haute priorité donnée aux couches WMTS dans la recherche pour privilégier les couches WMTS aux WMS si les deux sont disponibles [extensions:#214](https://github.com/IGNF/geopf-extensions-openlayers/pull/214)

#### 🔥 [Obsolète]

#### 🔥 [Suppression]

#### 🐛 [Correction]

* Partage par mail [#347](https://github.com/IGNF/cartes.gouv.fr-entree-carto/pull/347)

* Passage des boutons des widgets en type "secondaires" [#352](https://github.com/IGNF/cartes.gouv.fr-entree-carto/pull/352)

* Mise en conformité des liens de footer au DSFR [#357](https://github.com/IGNF/cartes.gouv.fr-entree-carto/pull/357)

* Prise en compte des choix utilisateurs (thème + consentement) partagés entre les briques de cartes.gouv [issue:1d5eb02321ebdc3427f4ac7d4a14ceb7c58fed3c](https://github.com/IGNF/cartes.gouv.fr-entree-carto/commit/1d5eb02321ebdc3427f4ac7d4a14ceb7c58fed3c)

* Placement correct de la barre latéral de widget actif sous Firefox et Chrome [extensions:#219](https://github.com/IGNF/geopf-extensions-openlayers/pull/219)

* Ouverture responsive des panels des widgets sur petits écrans [#360](https://github.com/IGNF/cartes.gouv.fr-entree-carto/pull/360)

#### 🔒 [Sécurité]

---

## 🔖 version 1.0.0 - 15/10/2024

### 🎉 Résumé

Version 1 de l’entrée cartographique de cartes.gouv.fr. Cette version correspond au MVP (Produit Minimal Viable) du composant cartographique de cartes.gouv.fr. 

Par rapport à la version v0.0.8, cette version intègre les changements suivants : 

* Ajout d'un CHANGELOG
* Mécanisme de permalien qui permet de conserver dans la session le paramétrage de la carte (centre, niveau de zoom, couches affichées, widgets activés) 
* 4 nouveaux composants avec : 
    * le partage de carte 
    * la consultation du catalogue 
    * les coordonnées de la souris 
    * le centrage sur territoires

### 💥 Breaking changes

    > 🔥 Nettoyer le localStorage !

Si cela n’est pas fait, la carte risque de ne pas se charger correctement et l’interface cartographique risque d’être inutilisable. 

### 📖 Changelog

#### ✨ [Ajout]

* Activation des tracker Eulerain sur les actions boutons des widgets [#309](https://github.com/IGNF/cartes.gouv.fr-entree-carto/pull/309)

* Partager une carte [#310](https://github.com/IGNF/cartes.gouv.fr-entree-carto/pull/310)

* Coordonnées de la souris [315](https://github.com/IGNF/cartes.gouv.fr-entree-carto/pull/315)

* Catalogue avec barre de recherche [#245](https://github.com/IGNF/cartes.gouv.fr-entree-carto/pull/245)

* Gestion du permalien [#308](https://github.com/IGNF/cartes.gouv.fr-entree-carto/pull/308)

* Ajout d'un CHANGELOG [#307](https://github.com/IGNF/cartes.gouv.fr-entree-carto/pull/307)

* Collecte Eulerian des interaction avec les widgets (test) [#301](https://github.com/IGNF/cartes.gouv.fr-entree-carto/pull/301)

#### 🔨 [Evolution]

* Header en mode mobile [#305](https://github.com/IGNF/cartes.gouv.fr-entree-carto/pull/305)

* Footer en mode mobile [#304](https://github.com/IGNF/cartes.gouv.fr-entree-carto/pull/304)

#### 🔥 [Obsolète]

#### 🔥 [Suppression]

#### 🐛 [Correction]

* Ajout des options de preload sur les tuiles [#312](https://github.com/IGNF/cartes.gouv.fr-entree-carto/pull/312)

#### 🔒 [Sécurité]

---

## 🔖 version 0.0.8 - 21/08/2024

### 🎉 Résumé

### 💥 Breaking changes

### 📖 Changelog

#### ✨ [Ajout]

* Ajout des widgets de calcul d’isochrone et d’itinéraire

  * [#294](https://github.com/IGNF/cartes.gouv.fr-entree-carto/pull/294)
  * [#139](https://github.com/IGNF/geopf-extensions-openlayers/pull/139)
  * [#142](https://github.com/IGNF/geopf-extensions-openlayers/pull/142)
  * [#143](https://github.com/IGNF/geopf-extensions-openlayers/pull/143)

#### 🔨 [Evolution]

* Meilleur positionnement du bouton de menu widgets [#291](https://github.com/IGNF/cartes.gouv.fr-entree-carto/pull/291)
  
* Inversion des onglets du menu widget [#302](https://github.com/IGNF/cartes.gouv.fr-entree-carto/pull/302)
  
* Remplacement de l’icone du bouton de réduction du plein écran [#140](https://github.com/IGNF/geopf-extensions-openlayers/pull/140)
  
* Amélioration du rendu de la barre de recherche [#138](https://github.com/IGNF/geopf-extensions-openlayers/pull/138), [#148](https://github.com/IGNF/geopf-extensions-openlayers/pull/148), [#303](https://github.com/IGNF/cartes.gouv.fr-entree-carto/pull/303)
  
* Améliorations multiples du rendu des légendes et du layerSwitcher (marges et dimensions) [#137](https://github.com/IGNF/geopf-extensions-openlayers/pull/137)
  
* Changement de l’icone pour le drag & drop de couches du layerSwitcher [#136](https://github.com/IGNF/geopf-extensions-openlayers/pull/136)

#### 🔥 [Obsolète]

#### 🔥 [Suppression]

#### 🐛 [Correction]

* Menu hamburger affiche l’ensemble des liens en mode mobile [#293](https://github.com/IGNF/cartes.gouv.fr-entree-carto/pull/293)
  
* Au premier chargement du site, des widgets sont ajoutés par défaut [#292](https://github.com/IGNF/cartes.gouv.fr-entree-carto/pull/292)

#### 🔒 [Sécurité]

---

## 🔖 version 0.0.7 - 07/08/2024

### 🎉 Résumé

### 💥 Breaking changes

### 📖 Changelog

#### ✨ [Ajout]

#### 🔨 [Evolution]

* Amélioration du menu des widgets [#273](https://github.com/IGNF/cartes.gouv.fr-entree-carto/pull/273)
  
* Amélioration dropdown type recherche avancée POI
    > Côté extensions : [#114](https://github.com/IGNF/geoportal-extensions-openlayers/pull/114)
  
* Ajout d’un filtre sur les couches ayant une projection pour ne pas ajouter des couches qui ne s’affichent pas [#128](https://github.com/IGNF/geoportal-extensions-openlayers/pull/128)
  
* Amélioration barre de recherche se déplie onfocus / onhover [#125](https://github.com/IGNF/geoportal-extensions-openlayers/pull/125)

* Mise à jour des icones des widgets [#133](https://github.com/IGNF/geoportal-extensions-openlayers/pull/133)

#### 🔥 [Obsolète]

#### 🔥 [Suppression]

#### 🐛 [Correction]

* Correction synchronisation couches mesures avec layerswitcher [#116](https://github.com/IGNF/geoportal-extensions-openlayers/pull/116)

* Correction positionnement fenêtres de dialogue [#118](https://github.com/IGNF/geoportal-extensions-openlayers/pull/118)

* Correction ouverture du panneau information du layerswitcher [#127](https://github.com/IGNF/geoportal-extensions-openlayers/pull/127)

* Correction affichage dark des panneaux de résultats d’autocomplétion [#126](https://github.com/IGNF/geoportal-extensions-openlayers/pull/126)

#### 🔒 [Sécurité]

---

## 🔖 version 0.0.6 - 23/07/2024

### 🎉 Résumé

### 💥 Breaking changes

### 📖 Changelog

#### ✨ [Ajout]

* Ajout des outils de mesure Distance / Aire / Azimuth [#274](https://github.com/IGNF/cartes.gouv.fr-entree-carto/issues/274)
  
* Conservation partielle des paramètres utilisateur de l’interface [#277](https://github.com/IGNF/cartes.gouv.fr-entree-carto/issues/277)
  
* Branchement simple à Eulerian [#278](https://github.com/IGNF/cartes.gouv.fr-entree-carto/issues/278)
  
* Ajout du widget Légendes en version simple [#276](https://github.com/IGNF/cartes.gouv.fr-entree-carto/issues/276)
  
* Ajout d’une fonctionnalité d’alerte pop-up au chargement [#282](https://github.com/IGNF/cartes.gouv.fr-entree-carto/pull/282)

#### 🔨 [Evolution]

* Amélioration du Header (mention beta + lien catalogue) [#275](https://github.com/IGNF/cartes.gouv.fr-entree-carto/issues/275)
  
* Changement du style des boutons widgets : actif/inactif
    > Côté extensions [#95](https://github.com/IGNF/geoportal-extensions-openlayers/pull/95)

#### 🔥 [Obsolète]

#### 🔥 [Suppression]

#### 🐛 [Correction]

* Correction du positionnement des boutons [#270](https://github.com/IGNF/cartes.gouv.fr-entree-carto/pull/270)

* Correction affichage en mode sombre [#248](https://github.com/IGNF/cartes.gouv.fr-entree-carto/pull/248), [#285](https://github.com/IGNF/cartes.gouv.fr-entree-carto/pull/285)

* Correction de la recherche avancée [#284](https://github.com/IGNF/cartes.gouv.fr-entree-carto/pull/284)

#### 🔒 [Sécurité]

---

## 🔖 version 0.0.5 - 2024

## 🔖 version 0.0.4 - 2024

## 🔖 version 0.0.3 - 2024

## 🔖 version 0.0.2 - 2024

## 🔖 version 0.0.1 - 2024
