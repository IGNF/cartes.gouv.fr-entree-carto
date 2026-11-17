/**
 * Injecte les métadonnées DPI (chunk pHYs) dans un PNG encodé en data URL.
 * @param {string} dataUrl - Data URL image/png
 * @param {number} dpi - Résolution cible en DPI
 * @returns {Promise<string>} URL blob du PNG modifié
 */
export function injectDpiInPng(dataUrl: string, dpi: number): Promise<string>;
