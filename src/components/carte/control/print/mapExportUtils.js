/**
 * Fusionne tous les canvas des couches OpenLayers dans un canvas cible.
 * Gère l'opacité, la couleur de fond et les transformations CSS matrix().
 * @param {HTMLElement} mapViewport - Viewport de la map OL (map.getViewport())
 * @param {CanvasRenderingContext2D} targetCtx - Contexte du canvas de destination
 */
export function mergeMapCanvases(mapViewport, targetCtx) {
  const canvases = mapViewport.querySelectorAll('.ol-layer canvas, canvas.ol-layer');

  targetCtx.setTransform(1, 0, 0, 1, 0, 0);
  targetCtx.clearRect(0, 0, targetCtx.canvas.width, targetCtx.canvas.height);

  canvases.forEach((layerCanvas) => {
    if (!layerCanvas.width || !layerCanvas.height) {
      return;
    }

    const opacity = layerCanvas.parentElement?.style.opacity || layerCanvas.style.opacity;
    targetCtx.globalAlpha = opacity === '' ? 1 : Number(opacity);

    const backgroundColor = layerCanvas.parentElement?.style.backgroundColor;
    if (backgroundColor) {
      targetCtx.fillStyle = backgroundColor;
      targetCtx.fillRect(0, 0, layerCanvas.width, layerCanvas.height);
    }

    const transform = layerCanvas.style.transform;
    if (transform) {
      const matrix = transform
        .match(/^matrix\(([^)]*)\)$/)?.[1]
        ?.split(',')
        .map(Number);

      if (matrix?.length === 6) {
        targetCtx.setTransform(...matrix);
      }
    } else {
      const style = getComputedStyle(layerCanvas);
      const scaleX = parseFloat(style.width) / layerCanvas.width;
      const scaleY = parseFloat(style.height) / layerCanvas.height;
      targetCtx.setTransform(scaleX, 0, 0, scaleY, 0, 0);
    }

    targetCtx.drawImage(layerCanvas, 0, 0);
  });

  targetCtx.globalAlpha = 1;
  targetCtx.setTransform(1, 0, 0, 1, 0, 0);
}

/**
 * Rend la map OpenLayers à une taille pixel donnée en conservant l'emprise,
 * capture le résultat dans un canvas, puis restaure l'état initial.
 * @param {import('ol/Map').default} map - Instance OpenLayers
 * @param {number} widthPx - Largeur cible en pixels
 * @param {number} heightPx - Hauteur cible en pixels
 * @returns {Promise<HTMLCanvasElement>} Canvas avec le rendu haute résolution
 */
export async function renderMapCanvasForExport(map, widthPx, heightPx) {
  const view = map.getView();
  const originalSize = map.getSize();
  const originalCenter = view.getCenter();
  const originalResolution = view.getResolution();
  const viewportEl = map.getViewport();
  const originalW = viewportEl.style.width;
  const originalH = viewportEl.style.height;
  const originalExtent = view.calculateExtent(originalSize);

  const exportCanvas = document.createElement('canvas');
  exportCanvas.width = widthPx;
  exportCanvas.height = heightPx;

  try {
    map.setSize([widthPx, heightPx]);
    viewportEl.style.width = `${widthPx}px`;
    viewportEl.style.height = `${heightPx}px`;
    view.fit(originalExtent, {
      size: [widthPx, heightPx],
      nearest: true,
      duration: 0,
    });

    await new Promise((resolve) => {
      map.once('rendercomplete', resolve);
      map.renderSync();
    });

    const exportCtx = exportCanvas.getContext('2d');
    mergeMapCanvases(map.getViewport(), exportCtx);

    return exportCanvas;
  } finally {
    map.setSize(originalSize);
    viewportEl.style.width = originalW;
    viewportEl.style.height = originalH;
    if (originalCenter) {
      view.setCenter(originalCenter);
    }
    if (originalResolution) {
      view.setResolution(originalResolution);
    }
    map.renderSync();
  }
}
