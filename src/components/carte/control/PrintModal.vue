<script lang="js" setup>
import { useElementSize } from '@vueuse/core';
import { reactive } from 'vue';
import { useMapStore }  from '@/stores/mapStore';
import { useEulerian } from '@/plugins/Eulerian.js';

import Map from '@/components/carte/Map.vue';
import PrintLayers from '@/components/carte/Layer/PrintLayers.vue';
import Patience from '@/components/utils/Patience.vue';

import { printMap } from '@/composables/keys';
import { 
  computeScaleCoeff, 
  drawScale, 
  drawTitle } 
from './printUtils/helper.js';
import { injectDpiInPng } from './printUtils/png.js';
import { renderMapCanvasForExport } from './printUtils/mapExport.js';

import { jsPDF } from "jspdf";

const eulerian = useEulerian();
const mapStore = useMapStore();

// INFO
// Les options sont definies dans CartoAndTools.vue 
// et passées en props à la modale
const props = defineProps({
  printOptions: {
    type: Object,
    default: () => ({})
  }
});

const emitter = inject('emitter');

/**
 * Paramètres du composant de la modale
 */
const title = "Imprimer une carte";
const size = "xl"; // taille de la modale : sm, md, lg, xl, full

/**
 * Liste des orientations du papier pour le menu déroulant
 */
const pageOrientationOptions = [
  {
    label: 'Portrait',
    value: 'portrait',
    icon: 'material-symbols:crop-portrait-outline-sharp',
  },
  {
    label: 'Paysage',
    value: 'landscape',
    icon: 'material-symbols:crop-landscape-outline-sharp',
  },
];

/*************************************************************************
 * Gestion ouverture et fermeture de la Modal d'impression
 **************************************************************************/

const printModalOpened = ref(false);
const isExportInProgress = ref(false);

const onModalPrintOpen = () => {
  emitter.dispatchEvent("leftmenu:close");
  printModalOpened.value = true;
  eulerian.pause();
};
const onModalPrintClose = () => {
  isExportInProgress.value = false;
  printModalOpened.value = false;
  eulerian.resume();
  mapStore.getMap().renderSync();
};

// INFO
// Ces fonctions sont exposées pour être appelées depuis le composant parent
defineExpose({
  onModalPrintClose,
  onModalPrintOpen
});

/*************************************************************************
 * Ref sur les elements du DOM
 **************************************************************************/

const refMap = ref(null);
const mapTitle = ref(null);
const printPage = ref(null);
const printForm = ref(null);

/*************************************************************************
 * Constantes et paramètres pour le calcul des dimensions de la carte à imprimer
 *  - COEFF_PX2MM : coefficient de conversion pixel -> mm
 *  - MM_PER_INCH : nombre de mm par pouce
 *  - BASE_DPI : résolution d'écran standard (96 DPI)
 *  - HIGH_DPI_VALUE : résolution d'impression haute (300 DPI)
 *  - MAX_HIGH_DPI_PAPER_AREA : surface maximale du papier pour l'impression haute résolution (en mm²)
 **************************************************************************/

const COEFF_PX2MM = 0.264583333;
const MM_PER_INCH = 25.4;
const BASE_DPI = 96; // Résolution d'écran standard (96 DPI)
const HIGH_DPI_VALUE = 300; // Résolution d'impression haute (300 DPI)
// Surface maximale du papier pour l'impression haute résolution (en mm²)
const MAX_HIGH_DPI_PAPER_AREA = 250 * 353; // B4 (250mm x 353mm)

/*************************************************************************
 *  Paramètres formulaire de la carte à imprimer
 *  {Boolean} hasScale - ajoute une échelle ou pas à la carte
 *  {Boolean} hasTitle - ajoute un titre ou pas à la carte
 *  {String} printTitle - Titre de la carte
 *  {String} pageOrientation - Orientation du papier
 *  {Number} margin - marge en mm 
 *  {String} paperFormat - Format standard de papier
 *  {Number} dpi - Résolution d'impression en DPI
 *  {String} format - Format d'export de la carte (PDF, PNG, JPEG)
 **************************************************************************/

// Valeurs par défaut du formulaire d'impression
const defaultPrintFormState = {
  hasScale: true,
  hasTitle: true,
  printTitle: 'Ma carte',
  pageOrientation: 'portrait',
  margin: 5,
  paperFormat: 'A4',
  dpi: 96,
  format: 'PNG',
};

// État réactif du formulaire d'impression
const printFormState = reactive({ ...defaultPrintFormState });

// Options autorisées pour le formulaire d'impression
const allowedPrintOptionKeys = [
  'hasScale',
  'hasTitle',
  'printTitle',
  'pageOrientation',
  'margin',
  'paperFormat',
  'dpi',
  'format',
];

// Applique les options d'impression passées en props au formulaire d'impression
const applyPrintOptions = (options) => {
  if (!options || typeof options !== 'object') {
    return;
  }

  allowedPrintOptionKeys.forEach((key) => {
    if (options[key] !== undefined) {
      printFormState[key] = options[key];
    }
  });
};

// Surveille les changements des options d'impression passées en props et applique les nouvelles options au formulaire d'impression
watch(
  () => props.printOptions,
  (options) => {
    applyPrintOptions(options);
  },
  { immediate: true, deep: true },
);

/*************************************************************************
 * Gestion des formats de papier et de la résolution d'impression
 *  - paperFormats : dimensions des formats de papier standard (en mm)
 *  - isPaperFormatAllowedAtHighDpi : vérifie si le format de papier est autorisé pour l'impression haute résolution
 *  - isCurrentPaperFormatAllowedAtHighDpi : vérifie si le format de papier actuel est autorisé pour l'impression haute résolution
 *  - paperFormatOptions : options pour le menu déroulant des formats de papier
 *  - dpiOptions : options pour le menu déroulant des résolutions d'impression
 **************************************************************************/

const paperFormats = {
  A0: { width: 841, height: 1189 },
  A1: { width: 594, height: 841 },
  A2: { width: 420, height: 594 },
  A3: { width: 297, height: 420 },
  A4: { width: 210, height: 297 },
  A5: { width: 148, height: 210 },
  B4: { width: 250, height: 353 },
  B5: { width: 176, height: 250 },
};

const isPaperFormatAllowedAtHighDpi = (paperFormat) => {
  const selectedFormat = paperFormats[paperFormat];
  if (!selectedFormat) {
    return false;
  }

  return (selectedFormat.width * selectedFormat.height) <= MAX_HIGH_DPI_PAPER_AREA;
};

const isCurrentPaperFormatAllowedAtHighDpi = computed(() => {
  return isPaperFormatAllowedAtHighDpi(printFormState.paperFormat);
});

const paperFormatOptions = computed(() => {
  return Object.entries(paperFormats).map(([format, dimension]) => {
    const isDisabledAtHighDpi = printFormState.dpi === HIGH_DPI_VALUE
      && !isPaperFormatAllowedAtHighDpi(format);

    return {
      value: format,
      text: `${format} (${dimension.width} x ${dimension.height} mm)`,
      disabled: isDisabledAtHighDpi,
    };
  });
});

const dpiOptions = computed(() => {
  return [
    { value: 96, text: '96 DPI (écran)' },
    {
      value: HIGH_DPI_VALUE,
      text: '300 DPI (impression)',
      disabled: !isCurrentPaperFormatAllowedAtHighDpi.value,
    },
  ];
});

// Surveille les changements de format de papier et de résolution d'impression pour ajuster le format de papier
watch(
  () => [printFormState.dpi, printFormState.paperFormat],
  ([dpiValue, paperFormat]) => {
    if (dpiValue === HIGH_DPI_VALUE && !isPaperFormatAllowedAtHighDpi(paperFormat)) {
      printFormState.paperFormat = 'A4';
    }
  },
  { immediate: true },
);

const paperDimension = computed(() => {
  if (printFormState.pageOrientation === 'portrait') {
    return {
      width: paperFormats[printFormState.paperFormat].width,
      height: paperFormats[printFormState.paperFormat].height,
    };
  }
  if (printFormState.pageOrientation === 'landscape') {
    return {
      width: paperFormats[printFormState.paperFormat].height,
      height: paperFormats[printFormState.paperFormat].width,
    };
  }
  return paperFormats.A4;
});

/*************************************************************************
 * Gestion des dimensions du DOM pour le calcul de la taille de la carte à imprimer
 *  - printPageSize : taille de la page print (DOM)
 *  - printFormSize : taille du formualaire (DOM)
 *  - titleSize : taille du titre de la carte sur la prévisualisation (DOM)
 *  - paperDimensionPx : dimensions du papier en pixel (preview)
 *  - paper2PreviewScaleCoeff : coefficient de conversion dimension papier vers preview (EN PIXEL)
 *  - printableAreaMm : dimensions imprimables en mm (papier - marges)
 *  - mapDimensionMm : dimensions de la carte en mm
 *  - cssMapDimensionMm : dimensions de la carte en mm String pour CSS
 *  - titleHeightMm : hauteur du titre en mm
 *  - previewDimensionPx : dimensions du bloc de prévisualisation en px
 *  - cssPreviewDimensionPx : dimensions du bloc de prévisualisation en px String pour CSS
 *  - cssPreviewPaddingPx : marges de la preview en pixel
 **************************************************************************/

/**
 * Taille de la page print (DOM)
 * (Formulaire et prévisualisation)
 */
const printPageSize = reactive(
  useElementSize(
    printPage,
    { width: 0, height: 0 },
    { box: 'border-box' },
  ),
);
/**
 * Taille du formualaire (DOM)
 */
const printFormSize = reactive(
  useElementSize(
    printForm,
    { width: 0, height: 0 },
    { box: 'border-box' },
  ),
);
/**
 * Taille du titre de la carte 
 * sur la prévisualisation (DOM)
 */
const titleSize = reactive(
  useElementSize(
    mapTitle,
    { width: 0, height: 0 },
    { box: 'border-box' },
  ),
);

/**
 * Dimensions du papier en pixel
 */
const paperDimensionPx = computed(() => {
  return {
    width: paperDimension.value.width / COEFF_PX2MM,
    height: paperDimension.value.height / COEFF_PX2MM,
  };
});

/**
 *  Coefficient de conversion dimension papier vers preview (EN PIXEL)
 *  coeff * dimContenu = newDimensionFitContenant
 */
const paper2PreviewScaleCoeff = computed(() => {
  const containerHeight = printPageSize.height;
  const containerWidth = printPageSize.width - printFormSize.width;
  return computeScaleCoeff(containerWidth, containerHeight, paperDimensionPx.value.width, paperDimensionPx.value.height);
});

/**
 * Zone imprimable en mm (papier - marges)
 */
const printableAreaMm = computed(() => {
  return {
    width: paperDimension.value.width - (2 * printFormState.margin),
    height: paperDimension.value.height - (2 * printFormState.margin),
  };
});

/**
 * Ratio de la hauteur du titre dans la prévisualisation (entre 0 et 1)
 */
const titleHeightRatioInPreview = computed(() => {
  if (!printFormState.hasTitle || previewDimensionPx.value.height <= 0) {
    return 0;
  }
  const ratio = titleSize.height / previewDimensionPx.value.height;
  return Math.max(0, Math.min(1, ratio));
});

/**
 * Hauteur du titre de la carte en mm
 */
const titleHeightMm = computed(() => {
  return printableAreaMm.value.height * titleHeightRatioInPreview.value;
});

/**
 *  Dimensions de la carte en mm
 */
const mapDimensionMm = computed(() => {
  return {
    width: printableAreaMm.value.width,
    height: Math.max(0, printableAreaMm.value.height - titleHeightMm.value),
  };
});

/**
 * Dimensions de la carte en mm 
 * String pour CSS
 */
const cssMapDimensionMm = computed(() => {
  return {
    width: `${mapDimensionMm.value.width}mm`,
    height: `${mapDimensionMm.value.height}mm`,
  };
});

/**
 * Dimensions du bloc de prévisualisation en px
 */
const previewDimensionPx = computed(() => {
  return {
    width: paperDimensionPx.value.width * paper2PreviewScaleCoeff.value,
    height: paperDimensionPx.value.height * paper2PreviewScaleCoeff.value,
  };
});

/**
 * Dimensions du bloc de prévisualisation en px
 */
const cssPreviewDimensionPx = computed(() => {
  return {
    width: `${previewDimensionPx.value.width}px`,
    height: `${previewDimensionPx.value.height}px`,
  };
});

/**
 * Marges de la preview en pixel
 */
const cssPreviewPaddingPx = computed(() => {
  const leftRightPx = (printFormState.margin / paperDimension.value.width) * previewDimensionPx.value.width;
  const topBottomPx = (printFormState.margin / paperDimension.value.height) * previewDimensionPx.value.height;

  return {
    left: `${leftRightPx}px`,
    right: `${leftRightPx}px`,
    top: `${topBottomPx}px`,
    bottom: `${topBottomPx}px`,
  };
});

/************************************************************************************
 * Fonctions d'export de la carte
 *  - getPrintMapInstance() : retourne l'instance de la carte à imprimer
 *  - buildRasterExportCanvas() : construit le canvas final de la carte à exporter
 *  - exportMap() : fonction principale qui appelle les fonctions d'export selon le format
 *  - exportHighResMap() : export de la carte en PNG ou JPEG
 *  - exportPDF() : export de la carte en PDF
 *************************************************************************************/

const getPrintMapInstance = () => {
  return refMap.value?.map ?? mapStore.getMap();
};

/************************************************************************************
 * → Fonctions utilitaires
 *************************************************************************************/

 /**
 * Convertit une valeur en millimètres en pixels en fonction du DPI
 * @param {number} valueMm - Valeur en millimètres
 * @param {number} dpiValue - Résolution en DPI
 * @returns {number} Valeur en pixels
 */
const convertMmToPx = (valueMm, dpiValue) => {
  return Math.round((valueMm / MM_PER_INCH) * dpiValue);
};

/**
 * Récupère le contexte 2D d'un canvas
 * @param {HTMLCanvasElement} canvas - Canvas HTML
 * @param {string} errorMessage - Message d'erreur en cas d'échec
 * @returns {CanvasRenderingContext2D} Contexte 2D du canvas
 */
const getCanvas2DContext = (canvas, errorMessage) => {
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error(errorMessage);
  }
  return ctx;
};

/**
 * Crée un canvas final pour l'export
 * @param {number} width - Largeur du canvas en pixels
 * @param {number} height - Hauteur du canvas en pixels
 * @returns {{canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D}} Canvas et contexte 2D
 */
const createFinalExportCanvas = (width, height) => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = getCanvas2DContext(canvas, 'Impossible de récupérer le contexte 2D du canvas final.');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  return { canvas, ctx };
};

/**
 * Dessine le titre sur le canvas final
 * @param {CanvasRenderingContext2D} finalCtx - Contexte 2D du canvas final
 * @param {number} mapWidthPx - Largeur de la carte en pixels
 * @param {number} titleHeightPx - Hauteur du titre en pixels
 * @param {number} marginPx - Marge en pixels
 * @param {number} dpiCoeff - Coefficient DPI
 */
const drawTitleOverlay = (finalCtx, mapWidthPx, titleHeightPx, marginPx, dpiCoeff) => {
  const titleCanvas = document.createElement('canvas');
  titleCanvas.width = mapWidthPx;
  titleCanvas.height = titleHeightPx;

  const titleCtx = getCanvas2DContext(titleCanvas, 'Impossible de récupérer le contexte 2D du titre.');
  drawTitle(titleCtx, titleHeightPx, mapWidthPx, printFormState.printTitle, mapTitle.value, dpiCoeff);
  finalCtx.drawImage(titleCanvas, marginPx, marginPx);
  titleCanvas.remove();
};

/**
 * Dessine l'échelle sur le canvas final
 * @param {CanvasRenderingContext2D} finalCtx - Contexte 2D du canvas final
 * @param {number} mapWidthPx - Largeur de la carte en pixels
 * @param {number} mapHeightPx - Hauteur de la carte en pixels
 * @param {number} marginPx - Marge en pixels
 * @param {number} titleHeightPx - Hauteur du titre en pixels
 * @param {HTMLElement} mapElement - Élément HTML de la carte
 */
const SCALE_LINE_PRINT_BOOST = 2; // Facteur d'agrandissement pour l'échelle lors de l'export

const drawScaleOverlay = (finalCtx, mapWidthPx, mapHeightPx, marginPx, titleHeightPx, mapElement) => {
  const scaleCanvas = document.createElement('canvas');
  scaleCanvas.width = mapWidthPx;
  scaleCanvas.height = mapHeightPx;

  const scaleCtx = getCanvas2DContext(scaleCanvas, 'Impossible de récupérer le contexte 2D de l\'échelle.');
  drawScale(scaleCtx, mapElement, mapWidthPx, mapHeightPx, SCALE_LINE_PRINT_BOOST);
  finalCtx.drawImage(scaleCanvas, marginPx, marginPx + titleHeightPx);
  scaleCanvas.remove();
};

/**
 * Déclenche le téléchargement d'un fichier
 * @param {string} fileName - Nom du fichier à télécharger
 * @param {string} url - URL du fichier à télécharger
 */
const triggerDownload = (fileName, url) => {
  const link = document.createElement('a');
  link.download = fileName;
  link.href = url;
  link.click();
};

/************************************************************************************
 * → Fonctions principales d'export de la carte
 *************************************************************************************/

/**
 * Construit le canvas final de la carte à exporter
 *  - Récupère l'instance de la carte à imprimer
 *  - Redimensionne la carte pour correspondre aux dimensions d'export
 *  - Récupère le canvas de la carte
 *  - Dessine le titre et l'échelle si nécessaire
 *  - Retourne le canvas final
 *  - Restaure la taille initiale de la carte
 *  - Restaure la vue initiale de la carte
 *  - Restaure le style initial du viewport de la carte
 *  - Restaure la taille initiale du viewport de la carte  
 */
const buildRasterExportCanvas = async () => {
  const dpiValue = printFormState.dpi;
  const dpiCoeff = dpiValue / BASE_DPI;

  // Base physique export (papier réel en px au DPI demandé)
  const paperWidthPx = convertMmToPx(paperDimension.value.width, dpiValue);
  const paperHeightPx = convertMmToPx(paperDimension.value.height, dpiValue);
  const marginPx = convertMmToPx(printFormState.margin, dpiValue);

  // Conversion cohérente: ratio du titre en preview -> hauteur du titre en export
  const titleHeightPx = printFormState.hasTitle
    ? Math.round((titleHeightMm.value / paperDimension.value.height) * paperHeightPx)
    : 0;

  const mapWidthPx = Math.max(0, paperWidthPx - (marginPx * 2));
  const mapHeightPx = Math.max(0, paperHeightPx - (marginPx * 2) - titleHeightPx);

  // Récupère l'instance de la carte à imprimer
  const map = getPrintMapInstance();
  // Récupère le canvas de la carte à exporter
  const mapCanvas = await renderMapCanvasForExport(map, mapWidthPx, mapHeightPx);
  const mapElement = refMap.value?.mapRef;

  // Crée un canvas final pour l'export
  const finalWidthPx = mapWidthPx + (marginPx * 2);
  const finalHeightPx = mapHeightPx + titleHeightPx + (marginPx * 2);
  const { canvas: finalCanvas, ctx: finalCtx } = createFinalExportCanvas(finalWidthPx, finalHeightPx);
  finalCtx.drawImage(mapCanvas, marginPx, marginPx + titleHeightPx);

  // Dessine le titre si nécessaire
  if (printFormState.hasTitle) {
    drawTitleOverlay(finalCtx, mapWidthPx, titleHeightPx, marginPx, dpiCoeff);
  }

  // Dessine l'échelle si nécessaire
  if (printFormState.hasScale && mapElement) {
    drawScaleOverlay(finalCtx, mapWidthPx, mapHeightPx, marginPx, titleHeightPx, mapElement);
  }

  // Supprime le canvas temporaire de la carte
  mapCanvas.remove();

  return {
    dpiValue,
    finalCanvas,
  };
};

// Gestion du clic sur le bouton d'export de la carte
const onClickExportMap = async () => {
  if (isExportInProgress.value) {
    return;
  }

  isExportInProgress.value = true;
  try {
    if (printFormState.format === 'PDF') {
      await exportPDF();
      return;
    }
    await exportHighResMap();
  } finally {
    isExportInProgress.value = false;
  }
}

// Export haute résolution de la map
const exportHighResMap = async () => {
  const { dpiValue, finalCanvas } = await buildRasterExportCanvas();
  const dataUrl = finalCanvas.toDataURL('image/png');

  // Injecter DPI et télécharger
  if (printFormState.format === 'PNG') {
    const finalUrl = await injectDpiInPng(dataUrl, dpiValue);
    triggerDownload('carte.png', finalUrl);
  } else if (printFormState.format === 'JPEG') {
    const jpegUrl = finalCanvas.toDataURL('image/jpeg', 0.95);
    triggerDownload('carte.jpeg', jpegUrl);
  }

  finalCanvas.remove();
};
// Export PDF de la map
const exportPDF = async () => {
  const { finalCanvas } = await buildRasterExportCanvas();

  // Créer le PDF
  const opts = {
    orientation: printFormState.pageOrientation,
    unit: "mm",
    format: [paperDimension.value.width, paperDimension.value.height],
  };
  const doc = new jsPDF(opts);

  // Convertir le canvas en image
  const mapImgUrl = finalCanvas.toDataURL('image/png');
  doc.addImage(
    mapImgUrl,
    'PNG',
    0,
    0,
    paperDimension.value.width,
    paperDimension.value.height,
  );

  doc.save('carte.pdf');

  finalCanvas.remove();
};

/**
 * Options de l'échelle pour le composant ScaleLine
 */
const scaleLineOptions = {
  id: '4',
  units: 'metric',
  bar: false,
};
</script>

<template>
  <DsfrModal
    :opened="printModalOpened"
    :title="title"
    :size="size"
    @close="onModalPrintClose"
  >
    <!-- slot : c'est ici que l'on customise le contenu ! -->
    <div
      ref="printPage"
      class="print-page"
    >
      <!-- Formulaire d'impression -->
      <div
        ref="printForm"
        class="print-form"
      >
        <DsfrSegmentedSet
          v-model="printFormState.pageOrientation"
          :inline="false"
          :options="pageOrientationOptions"
          :small="false"
          legend="Mise en Page"
          class="mb-20"
        >
          <template #legend>
            Mise en Page
          </template>
        </DsfrSegmentedSet>
        <DsfrSelect
          v-model="printFormState.paperFormat"
          label="Dimensions"
          :options="paperFormatOptions"
        />
        <DsfrSelect
          v-model.number="printFormState.margin"
          label="Marge"
          :options="[
            { value : 0, text : 'Pas de marge - 0mm' },
            { value : 5, text : 'Petite marge - 5mm' },
            { value : 10, text : 'Grosse marge - 10mm' }
          ]"
        />
        <DsfrInput
          v-model="printFormState.printTitle"
          :disabled="!printFormState.hasTitle"
          label="Titre de la carte"
          label-visible
          name="titre"
          class="mb-10"
        />
        <div class="mt-10">
          <DsfrCheckbox
            v-model="printFormState.hasTitle"
            name="checkbox-simple"
            :label="!printFormState.hasTitle ? 'Activer le titre' : 'Désactiver le titre'"
          />
        </div>
        <div class="mt-10">
          <DsfrCheckbox
            v-model="printFormState.hasScale"
            name="checkbox-simple"
            :label="!printFormState.hasScale ? 'Afficher l\'échelle' : 'Désactiver l\'échelle'"
          />
        </div>
        <DsfrSelect
          v-model="printFormState.format"
          label="Format d'export"
          :options="[ 'PDF', 'PNG', 'JPEG']"
        />
        <DsfrSelect
          v-model.number="printFormState.dpi"
          label="Résolution"
          :options="dpiOptions"
        />
        <DsfrButton
          id="print-page-export"
          :label="isExportInProgress ? 'Traitement en cours...' : 'Imprimer la carte'"
          :title="isExportInProgress ? 'Traitement en cours...' : 'Imprimer la carte'"
          :disabled="isExportInProgress"
          icon=""
          no-outline
          @click="onClickExportMap"
        />
      </div>
      <!-- Dom de la prévisualisation de l'impression -->
      <div class="print-preview-container">
        <div
          ref="printPreview"
          class="print-preview"
        >
          <div
            v-if="printFormState.hasTitle"
            id="map-title"
            ref="mapTitle"
            class="map-title"
          >
            {{ printFormState.printTitle }}
          </div>
          <Map
            v-if="printModalOpened" 
            ref="refMap" 
            class="map"
            :map-id="printMap"
            :center="mapStore.center"
            :zoom="mapStore.zoom"
          >
            <PrintLayers
              :print-map-id="printMap"
            />
            <ScaleLine
              :visibility="printFormState.hasScale"
              :scale-line-options="scaleLineOptions"
              :map-id="printMap"
            />
          </Map>
        </div>
      </div>
      <div
        v-if="isExportInProgress"
        class="print-patience-overlay"
      >
        <Patience />
      </div>
    </div>
  </DsfrModal>
</template>

<style scoped>
  #print-button-position {
    position: absolute;
    right: 16px;
    top: 100px;
    z-index: 1000;
    background-color: var(--background-default-grey);
    overflow: visible;
  }

  #print-button-position[title]:hover:after {
    -webkit-mask-image: unset;
    mask-image: unset;
    background-color: unset;
    flex: unset;
    height: unset;
    -webkit-mask-size: unset;
    mask-size: unset;
    vertical-align: unset;
    content: attr(title);
    position: absolute;
    top: 0;
    color: var(--text-default-grey);
    font-size: .75rem;
    width: fit-content;
    white-space: nowrap;
    padding: .5rem .5rem 0.5rem 1.25rem;
    background-size: .375rem .5rem,.375rem .5rem,1px, 100%,calc(100% - 0.5rem) 100%;
    background-repeat: no-repeat;
    background-position: 0.125rem 50%, 100% 50%,0.375rem 100%,0.375rem 100%;
    filter: drop-shadow(0 2px 6px rgba(0,0,18,.16));
    filter: drop-shadow(var(--overlap-shadow));
    background-image: conic-gradient(from 56.31deg at 0% 50%,transparent 0deg,var(--background-overlap-grey) 0deg,var(--background-overlap-grey) 67.38deg,transparent 67.38deg),conic-gradient(from 56.31deg at 0% 50%,transparent 0deg,var(--border-default-grey) 0deg,var(--border-default-grey) 67.38deg,transparent 67.38deg),linear-gradient(90deg,var(--border-default-grey),var(--border-default-grey)),linear-gradient(90deg,var(--background-overlap-grey),var(--background-overlap-grey));
    transform: translateX(-262px);
  }
  .print-button-size {
    width: 40px;
    height: 40px;
  }

  /* positionnement absolu à adapter en fonction du positionnement
  des autres boutons car n'est pas dans la grille */
  @media (max-width: 576px){
    #print-button-position {
      top: 60px;
    }
  }

  @media (max-width: 627px) and (min-width: 576px){
    #print-button-position {
      top: 120px;
    }
  }

  .mb-20 {
    margin-bottom: 12px;
  }
  .mb-10 {
    margin-bottom: 6px;
  }
  .mt-10 {
    margin-top: 6px;
  }
  .print-page{
    display: flex;
    flex-direction: row;
    height: 35rem;
    position: relative;
  }

  .print-patience-overlay {
    position: absolute;
    inset: 0;
    background: rgba(255, 255, 255, 0.75);
    z-index: 2;
  }
  /*
  TODO gestion des titres trop longs : le rapport de taille de la prévisualisation 
  n'est plus respecté
  */
  .print-preview-container{
    justify-content: flex-start;
    align-items: flex-start;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    margin: 0 auto;
    box-shadow: 3px 3px 5px 6px #ccc;
  }
  .print-preview {
    width: v-bind("cssPreviewDimensionPx.width");
    height: v-bind("cssPreviewDimensionPx.height");
    padding-left : v-bind("cssPreviewPaddingPx.left");
    padding-right : v-bind("cssPreviewPaddingPx.right");
    padding-top : v-bind("cssPreviewPaddingPx.top");
    padding-bottom : v-bind("cssPreviewPaddingPx.bottom");
    flex: 0 0;
  }
  .print-form {
    flex: 0 0 230px;
    margin-right: 10px;
    /* max-width: 230px; */
  }

  .print-form :deep(.fr-select-group),
  .print-form :deep(.fr-input-group),
  .print-form :deep(.fr-checkbox-group),
  .print-form :deep(.fr-fieldset) {
    margin-bottom: 8px;
  }

  .map-title {
    text-align: center;
  }

  .map {
    width: v-bind("cssMapDimensionMm.width");
    height: v-bind("cssMapDimensionMm.height");
    transform: scale(v-bind(paper2PreviewScaleCoeff));
    transform-origin: top left;
  }
</style>

<style>
/* hack pour surcharger le style modal dsfr */
  .modal-override {
    max-width: 80vw;
    margin-left: auto;
    margin-right: auto;
    width: 100%;
  }
</style>