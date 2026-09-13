# Rapport RGAA

Ce dossier contient les rapports d'analyse RGAA générés manuellement via GitHub Actions.

## Utilisation

Le workflow manuel `Analyse RGAA manuelle` est disponible dans `.github/workflows/rgaa-analysis.yml`.

Il peut être déclenché depuis l'interface GitHub Actions :

1. Ouvrir l'onglet `Actions`
2. Sélectionner `Analyse RGAA manuelle`
3. Cliquer sur `Run workflow`
4. Optionnellement fournir une date d'analyse

## Nommage des fichiers

Les rapports sont nommés au format :

`rgaa-YYYY-MM-DD-HHhMMmSSs.md`

Exemple :

`rgaa-2026-09-13-13h10m43s.md`

## Script de génération

Le script de génération est disponible dans :

`generate-rgaa-report.mjs`

Il lit le rapport source `Rapport-RGAA.md` et produit un fichier daté dans ce répertoire.
