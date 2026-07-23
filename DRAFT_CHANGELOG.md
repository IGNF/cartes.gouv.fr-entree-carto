# Unreleased

<https://github.com/IGNF/cartes.gouv.fr-entree-carto/compare/v1.0.19...HEAD>

## 🔖 version 1.0.19 - __DATE__

### 🎉 Résumé

Evolution de l'espace personnel, améliorations UI, nouvelle option pour l'impression, et correctifs sur le partage

### 💥 Breaking changes

### 📖 Changelog

#### ✨ [Ajout]

- Impression : ajout d’une option pour choisir la résolution d’impression (#1125)

#### 🔨 [Evolution]

- Espace personnel : recherche et tri des documents (#1128)
- Espace personnel : transformation de format de l'export pour les couches vectorielles (#1140)
- Espace personnel : gestion des erreurs de service et sync des documents supprimés (#1131)
- Espace personnel : suppression d'un favori présent dans un permalien (#1130)
- Espace personnel : ajout de la synchronisation des documents lors d'un rafraîchissement de la page (#1143)
- Espace personnel : gestion des documents supprimés dans un permalien (#1146)
- Espace Personnel : Ajout d'un délai de désactivation pour le bouton de sauvegard (#1152)
- Partage : Le paramètre «w» n’est plus utilisé. Le chargement d’un permalink ne modifie pas les outils de l’utilisateur (#1147)
- ControlList : Ferme le panel au click dans la page (#1151)

#### 🔥 [Obsolète]

#### 🔥 [Suppression]

#### 🐛 [Correction]

- UI : Empêche un bug lors de la modification des outils dans la barre d’outils (#1134)
- UI : Uniformisation entête/corps des panels du menu latéral («mes enregistrements», etc.) (#1164)
- Légendes : Plus de "alt" cassé dans l’affichage des légendes (#1164)
- Panoramax : Le panel des options peut défiler (#1164)
- Territories : Corrige et sérialise l'ordre des territoires (#1132)
- Map : Empêche la rotation de la carte (#1148)
- Partage : La geolocalisation est correctement partagée dans le permalien (#1155)
- Partage : ajout d'un slash dans le chemin des permaliens simples pour gestion de l'historique de navigation (#1127)
- Report : correction du lien vers la F.A.Q dans la modale de pré-signalement (#1157)
- Annotation : reactivation de l'edition d'imports de données vecteur en mode non connecté (#6979c57)
- Espace Personnel : synchroniser les positions des couches lors d'un appel de permalien via l'espace personnel (#1160)
- Print : Correctif sur l'échelle sur l'impression en 300 dpi (#1190)

#### 🔒 [Sécurité]

- Suppression des notifications ESLint (#1159)
- Correction des failles  de sécurités (#1159)
