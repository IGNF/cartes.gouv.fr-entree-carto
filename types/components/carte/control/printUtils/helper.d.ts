/**
 * Retourne un coefficient d'échelle.
 * Appliqué aux dimension d'un content,
 * il l'ajuste aux dimensions d'un container en conservant les proportions
 * @param {*} mapRef Référence vers le DOM d'une map OpenLayer
 * @param { Number } containerWidth Largeur du contenant
 * @param { Number } containerHeight Hauteur du contenant
 * @param { Number } contentWidth Largeur du contenu
 * @param { Number } contentHeight Hauteur du contenu
 * @returns
 */
export function computeScaleCoeff(containerWidth: number, containerHeight: number, contentWidth: number, contentHeight: number): number;
/**
 * Capture un snapshot de la scaleline en coordonnées relatives à la map.
 * Permet de redessiner ensuite une échelle figée même si OL recalcule la DOM.
 * @param {*} mapRef Référence vers le DOM d'une map OpenLayer
 * @param { Number } domScaleCoeff Coefficient du transform CSS (scale) appliqué à la preview (paper2PreviewScaleCoeff)
 * @returns {Object | null}
 */
export function captureScaleLineSnapshot(mapRef: any, domScaleCoeff?: number): Object | null;
/**
 * Crée une image de l'échelle sur un canvas
 * @param { * } ctx Context d'un canvas
 * @param {*} mapRef Référence vers le DOM d'une map OpenLayer contenant une échelle
 * @param { Number } canvasWidth Largeur du canvas (en haute résolution)
 * @param { Number } canvasHeight Hauteur du canvas (en haute résolution)
 * @param { Object | null } scaleSnapshot Snapshot figé de la scaleline (optionnel)
 * @param { Number } domScaleCoeff Coefficient du transform CSS (scale) applique a la preview (paper2PreviewScaleCoeff), ignoré si scaleSnapshot fourni
 * @returns
 */
export function drawScale(ctx: any, mapRef: any, canvasWidth: number, canvasHeight: number, scaleSnapshot?: Object | null, domScaleCoeff?: number): void;
/**
 * Crée une image du titre sur un canvas
 * @param { * } ctx Context d'un canvas
 * @param { Number } canvasHeight Hauteur du canvas
 * @param { Number } canvasWidth Largeur du canvas
 * @param { String } printTitle titre
 * @param { Element } titleElement élément du titre du DOM
 * @param { Number } dpiCoeff Coefficient DPI (dpi / 96) - optionnel
 * @returns
 */
export function drawTitle(ctx: any, canvasHeight: number, canvasWidth: number, printTitle: string, titleElement: Element, dpiCoeff?: number): void;
