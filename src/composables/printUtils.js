/**
 * Crée une image de l'échelle 
 * @param {*} mapRef Référence vers le DOM d'une map OpenLayer
 * @param { Number } canvasWidth Largeur du canvas
 * @param { Number } canvasHeight Hauteur du canvas
 * @returns
 */
export function getFakeCanvas(mapRef, canvasWidth, canvasHeight) {
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