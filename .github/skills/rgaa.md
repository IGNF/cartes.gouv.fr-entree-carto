---
name: rgaa-accessibilite
description: Assister la conception, l'audit et la correction de pages et composants web pour atteindre la conformite RGAA en s'appuyant sur les criteres et tests officiels.
---

# RGAA - Accessibilite Numerique

Skill pour produire des recommandations, correctifs et checklists de conformite RGAA (France), avec traces de verification.

## Quand utiliser ce skill

- Creation d'un nouveau composant UI
- Revue de code front-end (HTML/CSS/JS/TS)
- Audit d'accessibilite d'une page ou d'un parcours
- Correction d'ecarts detectes par QA, audit interne ou externe
- Preparation d'une declaration d'accessibilite et d'un plan d'actions

## Sources normatives (a utiliser en priorite)

- RGAA - Criteres et tests: https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/
- RGAA - Methode generale: https://accessibilite.numerique.gouv.fr/methode/
- RAWeb (techniques de reference): https://accessibilite.numerique.gouv.fr/ressources/raweb/

## Entree attendue

### Informations minimales

- Contexte: composant, page, parcours, ou user story
- Technologie: Web Components, React, Angular, Vue, HTML natif, etc.
- Niveau cible: conformite RGAA (par defaut)
- Extraits utiles: markup, styles, logique clavier, captures ou URL

### Informations optionnelles

- Critere(s) RGAA vise(s) (ex: 7.1, 11.1, 12.8)
- Outils de test deja utilises (axe, Lighthouse, lecteur d'ecran)
- Contrainte produit (design system, legacy, delai)

## Procedure de travail

### 1. Cadrer le besoin et le perimetre

- Identifier la fonctionnalite principale et les interactions utilisateur
- Distinguer les etats: normal, focus, erreur, chargement, desactive
- Verifier s'il y a du contenu dynamique (notifications, modales, SPAs)

### 2. Mapper les criteres RGAA applicables

- 1 Images (alternatives textuelles)
- 2 Cadres (titre des iframes, masquage des cadres decoratifs)
- 3 Couleurs (contraste, information non portee uniquement par la couleur)
- 4 Multimedia (sous-titres, audiodescription, transcription pour audio/video)
- 5 Tableaux (caption, scope, headers pour tableaux de donnees)
- 6 Liens (intitules explicites)
- 7 Scripts (clavier, nom/role/valeur, changements de contexte)
- 8 Elements obligatoires (langue, titre, validite de structure)
- 9 Structuration de l'information (titres, listes, regions)
- 10 Presentation (ordre visuel/logique, lisibilite)
- 11 Formulaires (etiquettes, erreurs, aide, obligations)
- 12 Navigation (ordre de tabulation, raccourcis, acces rapide)
- 13 Consultation (zoom, orientation, adaptation)

### 3. Produire des corrections concretes

- Privilegier HTML semantique avant ARIA
- Garantir navigation clavier complete (Tab, Shift+Tab, Enter, Espace, Esc, fleches selon pattern)
- Gerer correctement le focus (ouverture/fermeture modale, retour focus)
- Fournir nom accessible, role et etat corrects pour chaque controle
- Rendre les erreurs de formulaire comprehensibles et annoncees
- Assurer contraste et indicateur de focus visible

### 4. Verifier et documenter les preuves

- Test automatise: axe-core / jest-axe / equivalent
- Test manuel clavier: parcours complet sans souris
- Test lecteur d'ecran: NVDA/JAWS/VoiceOver selon cible
- Tracer pour chaque ecart: critere RGAA, severite, correctif, statut

## Format de sortie attendu

Utiliser ce format:

```md
## Diagnostic RGAA

### Resume
- Perimetre: <composant/page>
- Statut: Conforme / Partiellement conforme / Non conforme
- Risque utilisateur: Faible / Moyen / Eleve

### Criteres RGAA concernes
- <critere>: <statut> - <justification courte>
- <critere>: <statut> - <justification courte>

### Ecarts detectes
1. <ecart>
- Critere RGAA: <x.x>
- Impact: <qui est bloque et pourquoi>
- Correctif propose: <action precise>
- Exemple de code: <si necessaire>

2. <ecart>
- Critere RGAA: <x.x>
- Impact: <...>
- Correctif propose: <...>

### Plan de verification
- [ ] Test clavier complet
- [ ] Test lecteur d'ecran
- [ ] Verification contraste
- [ ] Verification zoom 200%
- [ ] Verification sous-titres et transcription (si multimedia)
- [ ] Re-run tests automatises

### Decision
- Pret pour recette accessibilite: Oui/Non
- Points bloquants restants: <liste courte>
```

## Contraintes obligatoires

### MUST

1. Toujours citer les criteres RGAA relies aux recommandations.
2. Toujours proposer au moins un test de verification par correction.
3. Toujours expliquer l'impact utilisateur (pas seulement l'impact technique).
4. Toujours privilegier une solution semantique avant une surcouche ARIA.

### MUST NOT

1. Ne pas utiliser `tabindex` positif (`tabindex="1+"`) sauf cas exceptionnel justifie.
2. Ne pas supprimer l'indicateur de focus sans alternative visible.
3. Ne pas s'appuyer uniquement sur la couleur pour transmettre une information.
4. Ne pas annoncer "conforme RGAA" sans preuves de tests.

## Checklist rapide RGAA

- [ ] Ordre de tabulation logique et complet
- [ ] Nom accessible de tous les controles interactifs
- [ ] Intitules de liens explicites hors contexte
- [ ] Messages d'erreur explicites et relies aux champs
- [ ] Contrastes conformes
- [ ] Zones dynamiques annoncees correctement
- [ ] Structure de titres coherente
- [ ] Contenu lisible et utilisable a 200% de zoom
- [ ] Titre de page present et pertinent
- [ ] Langue principale declaree (et changements de langue inline)
- [ ] Iframes avec attribut title significatif
- [ ] Tableaux de donnees avec caption et en-tetes corrects
- [ ] Contenus multimedia avec sous-titres et/ou transcription

## Bonnes pratiques

- Donner des exemples de correction minimaux et applicables directement.
- Prioriser les ecarts bloquants (clavier, formulaire, navigation, comprehension).
- En cas d'incertitude, demander le contexte manquant avant de conclure.
- Rester aligne avec le contexte technique existant tout en respectant le RGAA.

## Metadonnees

- Version: 1.1.0
- Derniere mise a jour: 2026-04-08
- Tags: #rgaa #accessibilite #a11y #audit #frontend