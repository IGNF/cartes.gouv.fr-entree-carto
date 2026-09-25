#!/usr/bin/env node

import { promises as fs } from 'node:fs';
import path from 'node:path';

const repoRoot = process.cwd();
const sourceReport = path.join(repoRoot, 'Rapport-RGAA.md');
const outputDir = path.join(repoRoot, 'rgaa', 'rapports');

const normalizeDate = (value) => {
  const date = new Date(value || Date.now());

  if (Number.isNaN(date.getTime())) {
    return 'date-inconnue';
  }

  const pad = (n) => String(n).padStart(2, '0');
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}-${pad(date.getUTCHours())}h${pad(date.getUTCMinutes())}m${pad(date.getUTCSeconds())}s`;
};

const analysisDate = process.env.ANALYSIS_DATE || new Date().toISOString();
const safeDate = normalizeDate(analysisDate);

const reportText = await fs.readFile(sourceReport, 'utf8');

const promptMatch = reportText.match(/Prompt \(vscode\) :\s*```text\n([\s\S]*?)```\s*```text\n([\s\S]*?)```/m);
const promptText = promptMatch
  ? `${promptMatch[1].trim()}\n\n${promptMatch[2].trim()}`
  : 'Analyse RGAA à compléter selon le prompt disponible dans le rapport source.';

await fs.mkdir(outputDir, { recursive: true });

const outputFile = path.join(outputDir, `rgaa-${safeDate}.md`);

const promptBlock = '```text\n' + promptText + '\n```';

const generatedContent = `# Rapport RGAA - ${analysisDate}

> Généré automatiquement par GitHub Actions.
> Date d'analyse : ${analysisDate}

## Source

Le rapport de référence est disponible dans [Rapport-RGAA.md](../Rapport-RGAA.md).

## Prompt utilisé

${promptBlock}

## Résultat de l'analyse

Ce fichier a été généré automatiquement pour documenter le déclenchement manuel de l'analyse RGAA.

La suite de l'analyse doit être complétée selon le prompt ci-dessus, en recoupant les composants et vues du projet, puis en documentant les écarts, leur impact et les correctifs.
`;

await fs.writeFile(outputFile, generatedContent, 'utf8');
console.log(`Rapport RGAA généré : ${outputFile}`);
