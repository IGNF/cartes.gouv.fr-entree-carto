# Unreleased

<https://github.com/IGNF/cartes.gouv.fr-entree-carto/compare/v1.0.8...HEAD>

## 🔖 version 1.0.8 - __DATE__

### 🎉 Résumé

Ajout de la fonctionnalité de signalement accessible depuis le menu contextuel (clic droit) ou le menu carte en haut à gauche. Reprise du design des boutons, du footer, et de la fenêtre de consentement.
Branchement de la configuration du cartalogue au service de recherche de la Géoplateforme, et utilisation d'une clé d'accès dédiée pour les offres sur la route private.

### 💥 Breaking changes

### 📖 Changelog

#### ✨ [Ajout]

- Signalement : Outil de signalement d'anomalie accessible depuis le menu carte ou le menu contextuel (#622) 

#### 🔨 [Evolution]

- Espace Personnel : en mode connecté, enregistrement automatique des imports de données vectorielles (#603)
- Partage : réduction du nombre de chiffres après la virgule des coordonnées (#617)
- Partage : retrait des widgets permanents du permalien (#625)
- UI : redesign des boutons (#618, #619)
- Configuration : Gestion homogène des messages d'alertes en cas d'incidents ou d'informations à afficher (#624)
- Consentement : Mise à jour de la fenêtre de consentement au format standard de cartes.gouv (#626)

#### 🔥 [Obsolète]

#### 🔥 [Suppression]

#### 🐛 [Correction]

- Partage : prise en compte du style pour les couches TMS dans le lien de partage (#610)
- Notifications : correction de l'affichage de notifications intempestives en cas de donnée inexistante au chargement (e8e2131e32ba264b6fe15e91c7966f5d3e3007e1)
- Plein Écran : correctif pour garder tous les boutons de la carte en pleine écran (79637fe8730235d7fd2e5f60c48597e0cafea808)
- Footer : mise en conformité du footer réduit en mode dépliable (#620)
- UI : décalage dans l'alignement des boutons (#623)

#### 🔒 [Sécurité]

---
