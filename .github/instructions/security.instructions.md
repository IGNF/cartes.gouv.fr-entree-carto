---
applyTo: "eslint.config.js,eslint.config.mjs,**/.eslintrc*"
---

# Instructions securite (ESLint + CodeQL)

## Portee

- Ces consignes s'appliquent uniquement aux fichiers de configuration ESLint:
  - `eslint.config.js`
  - `eslint.config.mjs`
  - `**/.eslintrc*`

## Politique de securite du depot

- Le depot utilise des regles ESLint securite pour prevenir les failles tot en developpement.
- CodeQL est actif au niveau de l'organisation IGNF (configuration centralisee) et complete ESLint par une analyse semantique en CI/PR, meme sans workflow CodeQL versionne dans ce depot.
- ESLint et CodeQL sont complementaires: ne pas assouplir ESLint sous pretexte que CodeQL existe.

## Plugins et baseline attendus

- Conserver les plugins securite actuellement utilises dans la flat config:
  - `eslint-plugin-security`
  - `eslint-plugin-secure-coding`
  - `eslint-plugin-browser-security`
- Toute suppression de plugin ou baisse de severite globale doit etre consideree comme exceptionnelle.

## Regles de modification autorisees

- Toute desactivation/changement de severite d'une regle securite doit inclure:
  - une justification explicite en commentaire
  - le contexte metier (faux positif, contrainte technique reelle)
  - une portee la plus reduite possible (fichier/bloc plutot que globale)
- Eviter les `off` globaux pour des regles critiques sans plan de mitigation.
- Si un `off` global est temporairement necessaire, ajouter un commentaire avec action de suivi (ticket/PR cible).

## Cas sensible: `security/detect-object-injection`

- Privilegier une severite differenciee par zones de code plutot qu'une desactivation globale durable.
- Les zones qui traitent des entrees utilisateur ou donnees importees (upload, parsing KML/GPX/GeoJSON, URL params, donnees externes) doivent rester protegees, idealement en `error`.
- Si la regle est desactivee pour bruit excessif, documenter la strategie de retour progressif (overrides par dossier/fichier).

## Cas sensible: XSS / DOM injection

- Ne pas assouplir les protections liees a l'injection HTML/DOM (`vue/no-v-html` et regles associees) sur les zones exposant des contenus externes.
- Toute exception `v-html` doit etre justifiee et accompagnee d'une sanitisation explicite.

## Interaction avec CodeQL

- En cas de divergence ESLint vs CodeQL:
  - traiter d'abord le risque reel
  - documenter la raison si une alerte est classée faux positif
  - preferer une correction de code a une suppression de regle
- Pour les alertes CodeQL de severite elevee/critique, ne pas proposer de contournement uniquement via ESLint.

## Recherche de faux positifs (obligatoire avant assouplissement)

- Avant de classer une alerte en faux positif, verifier et documenter:
  - la source des donnees (utilisateur, URL, storage, API, fichier importe)
  - le trajet des donnees jusqu'au sink sensible (DOM, eval, requete, filesystem, etc.)
  - les mecanismes de protection effectifs (validation, sanitisation, whitelist, encodage)
- Un faux positif doit reposer sur une preuve technique, pas uniquement sur une intuition.
- Si la preuve est insuffisante, conserver la regle/alerte ouverte et traiter le code comme potentiellement vulnerable.
- Pour CodeQL, privilegier la qualification dans l'outil (state/reason) et lier le contexte dans la PR.
- Pour ESLint, preferer une exception locale documentee (`eslint-disable-next-line` motive) plutot qu'une desactivation globale.

## Checklist avant validation d'un changement ESLint securite

- [ ] Le changement est minimal et scope au besoin reel
- [ ] Une justification est presente pour chaque assouplissement
- [ ] Les regles XSS/DOM restent strictes sur les zones a risque
- [ ] L'impact potentiel vis-a-vis des alertes CodeQL est pris en compte