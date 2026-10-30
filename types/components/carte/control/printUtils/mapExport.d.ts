/**
 * Rendu de la carte OpenLayers dans un canvas haute résolution pour l'export.
 * @async
 * @param {import('ol/Map').default} map - Instance OpenLayers
 * @param {number} widthPx - Largeur cible en pixels
 * @param {number} heightPx - Hauteur cible en pixels
 * @returns {Promise<HTMLCanvasElement>} Canvas avec le rendu haute résolution
 */
export function renderMapCanvasForExport(map: import("ol/Map").default, widthPx: number, heightPx: number): Promise<HTMLCanvasElement>;
