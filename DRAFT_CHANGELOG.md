# Unreleased

<https://github.com/IGNF/cartes.gouv.fr-entree-carto/compare/v1.0.21...HEAD>

## 🔖 version 1.0.21 - __DATE__

### 🎉 Résumé

Corrections sur la barre de recherche, mise à jour du footer et du calcul d'azimuth, et mise en place d'un nouveau service de remontées d'anomalies.

Contribution de @ofri-peretz sur la mise à jour des dépendances de sécurités

### 💥 Breaking changes

### 📖 Changelog

#### ✨ [Ajout]

- Intégration Matomo IGN (#1322)

#### 🔨 [Evolution]

- Report d'anomalie : ajour d'une option pour désactiver la fonctionnalité (#1280)
- Espce personnel : Mise en place du permalien court dans les favoris (#1216)
- Footer : Mise à jour cartes.gouv.fr-vue-components (#1286)
- Mesure d'azimuth : activation de l’azimuth géodésique (#1285)
- Modale d’embarquement : mise à jour des textes et position «Ne plus afficher» (#1295)
- Reporting: intégration service anomaily aavec validation par geocaptcha (#1284)

#### 🔥 [Obsolète]

#### 🔥 [Suppression]

#### 🐛 [Correction]

- Recherche avancée : les parcelles contenues dans des sections contenant plus de 1000 parcelles sont trouvables en autocompletion (#1287)
- Barre de recherche : la recherche de communes dont le nom contient 3 caractères renvoie bien un résultat (#1283)

#### 🔒 [Sécurité]

- Mise à jour des dépendances de sécurités (#1333)
