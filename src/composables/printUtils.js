/**
 * 
 * 
 * Fonctions liées aux conversions entre la preview et la page d'impression
 * 
 * 
 */

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
export function computeScaleCoeff(containerWidth, containerHeight, contentWidth, contentHeight) {
    // Calcul des ratios de chaque bloc
    const ratioBloc1 = containerWidth / containerHeight;
    const ratioBloc2 = contentWidth / contentHeight;

    // Déterminer le coefficient de conversion pour remplir le container
    let coefficient;
    if (ratioBloc2 > ratioBloc1) {
        // Le contenant est plus large que le container → ajuster par la largeur
        coefficient = containerWidth / contentWidth;
    } else {
        // Le contenant est plus étroit ou carré → ajuster par la hauteur
        coefficient = containerHeight / contentHeight;
    }

    return coefficient;
}

/**
 * 
 * 
 * CANVAS METHOD TO DRAW ELEMENTS ON EXPORTED PDF
 * 
 * 
 */

/**
 * Crée une image de l'échelle 
 * @param {*} mapRef Référence vers le DOM d'une map OpenLayer
 * @param { Number } canvasWidth Largeur du canvas
 * @param { Number } canvasHeight Hauteur du canvas
 * @returns
 */
export function getFakeMapCanvas(mapRef, canvasWidth, canvasHeight) {
    if (mapRef.getElementsByTagName('canvas').length < 2) {
        var fakeCanvas = document.createElement('canvas')
        fakeCanvas.classList = ['fixedoverlay']
        fakeCanvas.width = canvasWidth
        fakeCanvas.height = canvasHeight
        mapRef.getElementsByClassName("ol-overlaycontainer")[0].insertAdjacentElement('beforebegin', fakeCanvas)
    }
    // Cas où le fake canvas a déjà été créé
    else {
      var fakeCanvas = mapRef.getElementsByTagName('canvas')[1]
    }
    fakeCanvas.style.display = "none"
    return fakeCanvas
}

/**
 * Crée une image de l'échelle sur un canavs
 * @param { * } ctx Context d'un canvas
 * @param {*} mapRef Référence vers le DOM d'une map OpenLayer contenant une échelle
 * @param { Number } canvasHeight Hauteur du canvas
 * @returns
 */
export function drawScale(ctx, mapRef, canvasHeight) {
    const scaleLine = mapRef.getElementsByClassName("ol-scale-line")[0]  
    const scaleLineInner = scaleLine.children[0]  
    const style = getComputedStyle(scaleLine)
    const styleInner = getComputedStyle(scaleLineInner)
    const scaleLeft = parseInt(style.left)
    const scaleBottom = parseInt(style.bottom)
    const scaleContent = scaleLineInner.innerHTML;
    const scaleWidth = parseInt(styleInner.width) 
    const scaleHeight = parseInt(styleInner.lineHeight)
    const y1 = canvasHeight - scaleBottom - scaleHeight
    
    // rect
    ctx.beginPath();
    ctx.fillStyle = "rgba(255, 255, 255, 0.75)"
    ctx.rect(scaleLeft, y1, scaleWidth, scaleHeight)
    ctx.fillRect(scaleLeft,y1,scaleWidth,scaleHeight)
    // Text
    ctx.font = styleInner.font
    ctx.textAlign="center"; 
    ctx.fillStyle = "#000000";
    ctx.fillText(scaleContent, scaleLeft+(scaleWidth/2),y1+(scaleHeight/2));
    // Line
    ctx.beginPath();
    ctx.moveTo(scaleLeft, y1)
    ctx.lineTo(scaleLeft, y1 + scaleHeight);
    ctx.lineTo(scaleLeft, y1 + scaleHeight);
    ctx.lineTo(scaleLeft + scaleWidth, y1 + scaleHeight);
    ctx.lineTo(scaleLeft + scaleWidth, y1);
    ctx.lineWidth = 1;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#666666"
    ctx.stroke();
};

/**
 * Crée une image de l'échelle sur un canavs
 * @param { * } ctx Context d'un canvas
 * @param { Number } canvasHeight Hauteur du canvas
 * @param { Number } canvasWidth Largeur du canvas
 * @param { String } printTitle titre
 * @returns
 */
export function drawTitle(ctx, canvasHeight, canvasWidth, printTitle) {
        // Définir les propriétés du texte (à personnaliser selon vos besoins)
        ctx.font = 'bold 24px Arial';
        ctx.fillStyle = '#000000';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Dessiner le texte centré horizontalement et verticalement
        ctx.fillText(printTitle, canvasWidth / 2, canvasHeight / 2);
};