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
 * Initialise les options pour la fonction addImage de la librairie JSPDF
 * @param {*} canvas canvas contenant la carte
 * @returns
 */
export function getMapImgParams(canvas, marge, titleHeight, mapMMDimension) {
    const img = canvas.toDataURL('image/png')
    return {
        img : img,
        format: 'PNG',
        imgPosX : marge,
        imgPosY : titleHeight + marge,
        imgWidth : mapMMDimension.width,
        imgHeight : mapMMDimension.height
    }
}


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
export function drawScale(ctx, mapRef, canvasWidth, canvasHeight) {
    // DEBUG
    // ctx.fillStyle = "rgb(0,255,0, 0.5)";
    // ctx.fillRect(0, 0, canvasWidth,canvasHeight);   
    
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
export function drawTitle(ctx, canvasHeight, canvasWidth, printTitle, titleElement) {
        // DEBUG visuel optionnel : permet de voir le bloc titre dans le canvas
        // ctx.fillStyle = "rgb(0,0,255, 0.5)";
        // ctx.fillRect(0, 0, canvasWidth,canvasHeight);

        // Récupération du style appliqué dans le DOM
        const style = getComputedStyle(titleElement)

        // Largeur de référence utilisée pour mettre à l'échelle le texte vers le canvas d'export
        const titleDivWidth = titleElement.clientWidth || canvasWidth
        const scaleX = titleDivWidth > 0 ? (canvasWidth / titleDivWidth) : 1
        
        // Calcul de la taille de police et de l'interligne à partir du style DOM, mis à l'échelle pour le canvas d'export
        const fontSizeValue = parseInt(style.fontSize, 10)
        const fontSize = (fontSizeValue > 0 ? fontSizeValue : 16) * scaleX
        const lineHeight = parseInt(style.lineHeight, 10) * scaleX

        // Configuration du contexte 2D pour mimer le style DOM
        ctx.font = `${style.fontStyle} ${style.fontVariant} ${style.fontWeight} ${fontSize}px ${style.fontFamily}`
        ctx.fillStyle = style.color || '#3a3a3a'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'top'

        // Récupère le découpage réel des lignes puis dessine chaque ligne au centre
        const lines = getRenderedLines(titleElement, printTitle)
        let y = 10 // Marge supérieure pour le titre dans le canvas d'export
        lines.forEach((line) => {
            ctx.fillText(line, canvasWidth / 2, y, canvasWidth)
            y += lineHeight
        })
};

// Reconstitue les lignes exactement comme le navigateur les a cassées dans la preview
//    en inspectant la position verticale de chaque caractère rendu
const getRenderedLines = function(element, text) {
    const textNode = element.firstChild
    // Cas de secours : pas de nœud texte exploitable ou texte vide
    if (!textNode || textNode.nodeType !== Node.TEXT_NODE || !text) {
        return [text]
    }
    // Range DOM : permet de mesurer la boîte de chaque caractère
    const range = document.createRange()
    const groupedChars = []
    let currentLineTop = null
    let currentLine = ''
    for (let i = 0; i < text.length; i += 1) {
        // Mesure du caractère i
        range.setStart(textNode, i)
        range.setEnd(textNode, i + 1)
        const rect = range.getBoundingClientRect()
        // Caractère sans boîte mesurable : on le conserve dans la ligne en cours
        if (!rect || (rect.width === 0 && rect.height === 0)) {
            currentLine += text[i]
            continue
        }
        // Première ligne rencontrée : mémorisation de sa coordonnée Y
        if (currentLineTop === null) {
            currentLineTop = rect.top
        }
        // Si Y change, le navigateur est passé à la ligne suivante
        if (Math.abs(rect.top - currentLineTop) > 0.5) {
            groupedChars.push(currentLine)
            currentLine = ''
            currentLineTop = rect.top
        }
        // Ajout du caractère à la ligne courante
        currentLine += text[i]
    }
    // Ajoute la dernière ligne construite
    if (currentLine) {
        groupedChars.push(currentLine)
    }
    // Retourne les lignes mesurées, ou une ligne unique de secours
    return groupedChars.length ? groupedChars : [text]
}