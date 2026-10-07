# RGAA

Ce dossier contient le script de génération et le stockage des rapports d'audit RGAA.

## Structure

- `generate-rgaa-report.mjs` : script de génération du rapport
- `rapports/` : fichiers générés, classés par date

## Génération

Le workflow GitHub Actions manuel `Analyse RGAA manuelle` est disponible dans `.github/workflows/rgaa-analysis.yml`.

Il crée un rapport daté dans le dossier `rgaa/rapports/`.

## Exemple de nommage

`rgaa-2026-09-13-13h10m43s.md`
