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
 * Crée une image de l'échelle sur un canvas
 * @param { * } ctx Context d'un canvas
 * @param {*} mapRef Référence vers le DOM d'une map OpenLayer contenant une échelle
 * @param { Number } canvasWidth Largeur du canvas (en haute résolution)
 * @param { Number } canvasHeight Hauteur du canvas (en haute résolution)
 * @returns
 */
export function drawScale(ctx, mapRef, canvasWidth, canvasHeight) {
    const scaleLine = mapRef.getElementsByClassName("ol-scale-line")[0]
    const scaleLineInner = scaleLine?.children[0]
    if (!scaleLine || !scaleLineInner) {
        return
    }

    const mapRect = mapRef.getBoundingClientRect()
    const outerRect = scaleLine.getBoundingClientRect()
    const innerRect = scaleLineInner.getBoundingClientRect()
    if (!mapRect.width || !mapRect.height) {
        return
    }

    // Projection preview -> canvas d'export : même ancrage visuel, même paddings.
    const scaleFactorX = canvasWidth / mapRect.width
    const scaleFactorY = canvasHeight / mapRect.height
    const avgScaleFactor = (scaleFactorX + scaleFactorY) / 2

    const style = getComputedStyle(scaleLine)
    const styleInner = getComputedStyle(scaleLineInner)
    const scaleContent = scaleLineInner.textContent || ''

    const outerX = (outerRect.left - mapRect.left) * scaleFactorX
    const outerY = (outerRect.top - mapRect.top) * scaleFactorY
    const outerWidth = outerRect.width * scaleFactorX
    const outerHeight = outerRect.height * scaleFactorY
    const innerX = (innerRect.left - mapRect.left) * scaleFactorX
    const innerY = (innerRect.top - mapRect.top) * scaleFactorY
    const innerWidth = innerRect.width * scaleFactorX
    const innerHeight = innerRect.height * scaleFactorY

    const borderLeftWidth = parseFloat(styleInner.borderLeftWidth || '0') * scaleFactorX
    const borderRightWidth = parseFloat(styleInner.borderRightWidth || '0') * scaleFactorX
    const borderBottomWidth = parseFloat(styleInner.borderBottomWidth || '0') * scaleFactorY
    // const borderRadius = parseFloat(style.borderRadius || '0') * avgScaleFactor
    const outerBorderWidth = Math.max(avgScaleFactor * 0.75, 1)

    // Fond externe de la ScaleLine : padding, marge et arrondis inclus via la boîte DOM réelle.
    ctx.beginPath()
    ctx.fillStyle = style.backgroundColor || 'rgba(255, 255, 255, 0.75)'
    // if (typeof ctx.roundRect === 'function' && borderRadius > 0) {
    //     ctx.roundRect(outerX, outerY, outerWidth, outerHeight, borderRadius)
    //     ctx.fill()
    //     ctx.lineWidth = outerBorderWidth
    //     ctx.strokeStyle = '#0000FF'
    //     ctx.stroke()
    // } else {
        ctx.fillRect(outerX, outerY, outerWidth, outerHeight)
        ctx.lineWidth = outerBorderWidth
        ctx.strokeStyle = '#ffffff'
        ctx.strokeRect(outerX, outerY, outerWidth, outerHeight)
    // }

    // Bordure interne OpenLayers : 3 côtés uniquement, sans border-top.
    ctx.fillStyle = '#000000'
    if (borderLeftWidth > 0) {
        ctx.fillRect(innerX, innerY, borderLeftWidth, innerHeight)
    }
    if (borderRightWidth > 0) {
        ctx.fillRect(innerX + innerWidth - borderRightWidth, innerY, borderRightWidth, innerHeight)
    }
    if (borderBottomWidth > 0) {
        ctx.fillRect(innerX, innerY + innerHeight - borderBottomWidth, innerWidth, borderBottomWidth)
    }

    const baseFontSize = parseFloat(styleInner.fontSize || '10')
    ctx.font = styleInner.fontStyle + ' ' + styleInner.fontVariant + ' ' + styleInner.fontWeight + ' ' + (baseFontSize * avgScaleFactor) + 'px ' + styleInner.fontFamily
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = styleInner.color || '#333333'
    ctx.fillText(scaleContent, innerX + (innerWidth / 2), innerY + (innerHeight / 2))
};

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
export function drawTitle(ctx, canvasHeight, canvasWidth, printTitle, titleElement, dpiCoeff = 1) {
        // DEBUG visuel optionnel : permet de voir le bloc titre dans le canvas
        // ctx.fillStyle = "rgb(0,0,255, 0.5)";
        // ctx.fillRect(0, 0, canvasWidth,canvasHeight);

        // Récupération du style appliqué dans le DOM
        const style = getComputedStyle(titleElement)

        // Largeur de référence utilisée pour mettre à l'échelle le texte vers le canvas d'export
        const titleDivWidth = titleElement.clientWidth || canvasWidth / dpiCoeff
        const scaleX = titleDivWidth > 0 ? (canvasWidth / (titleDivWidth * dpiCoeff)) : 1
        
        // Calcul de la taille de police et de l'interligne à partir du style DOM, mis à l'échelle pour le canvas d'export
        const fontSizeValue = parseInt(style.fontSize, 10)
        const fontSize = (fontSizeValue > 0 ? fontSizeValue : 16) * scaleX * dpiCoeff
        const lineHeight = parseInt(style.lineHeight, 10) * scaleX * dpiCoeff

        // Configuration du contexte 2D pour mimer le style DOM
        ctx.font = `${style.fontStyle} ${style.fontVariant} ${style.fontWeight} ${fontSize}px ${style.fontFamily}`
        ctx.fillStyle = style.color || '#3a3a3a'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'top'

        // Récupère le découpage réel des lignes puis dessine chaque ligne au centre
        const lines = getRenderedLines(titleElement, printTitle)
        let y = 10 * dpiCoeff // Marge supérieure pour le titre dans le canvas d'export
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