<script lang="js" setup>
import { useElementSize } from '@vueuse/core'
import { useMapStore }  from '@/stores/mapStore';
import { useEulerian } from '@/plugins/Eulerian.js';

import Map from '@/components/carte/Map.vue';
import PrintLayers from '@/components/carte/Layer/PrintLayers.vue';

import { printMap } from '@/composables/keys';
import { 
  computeScaleCoeff, 
  drawScale, 
  drawTitle } 
from './printUtils.js';
import { injectDpiInPng } from './pngUtils.js';
import { renderMapCanvasForExport } from './mapExportUtils.js';

import { jsPDF } from "jspdf";

const eulerian = useEulerian();
const mapStore = useMapStore();

const props = defineProps({
  visibility: Boolean,
});

const emitter = inject('emitter');

/**
 * Paramètres du composant de la modale
 */
const title = "Imprimer une carte";
const size = "xl";

/**
 * Conf formulaire orientation du papier
 * Menu déroulant
 */
 const pageOrientationOptions = [
  {
    "label": "Portrait",
    "value": "portrait",
    "icon": "material-symbols:crop-portrait-outline-sharp"
  },
  {
    "label": "Paysage",
    "value": "landscape",
    "icon": "material-symbols:crop-landscape-outline-sharp"
  }
];

/**
 * Gestion ouverture et fermeture de la Modal d'impression
 */
const printModalOpened = ref(false);
const onModalPrintOpen = () => {
  emitter.dispatchEvent("leftmenu:close");
  printModalOpened.value = true;
  eulerian.pause();
};
const onModalPrintClose = () => {
  printModalOpened.value = false;
  eulerian.resume();
  mapStore.getMap().renderSync();
};

defineExpose({
  onModalPrintClose,
  onModalPrintOpen
});

/**
 * Ref sur les elements du DOM
 */
const refMap = ref(null);
const mapTitle = ref(null);
const printPage = ref(null)
const printForm = ref(null)
const printPreview = ref(null)

const formMarginRight = "10px"
const coeffPX2MM = 0.264583333

/**
 *  Paramètres de la carte à imprimer
 *  {Boolean} hasScale - ajoute une échelle ou pas à la carte
 *  {Boolean} hasTitle - ajoute un titre ou pas à la carte
 *  {String} printTitle - Titre de la carte
 *  {String} pageOrientation - Orientation du papier
 *  {Number} margin - marge en mm 
 *  {String} paperFormat - Format standard de papier
 *  {Object} dimension - Dimension du papier selon format choisi
 */
const hasScale = ref(true)
const hasTitle = ref(true)
const printTitle = ref("Ma carte")
const pageOrientation = ref("portrait");
const margin = ref(5)
const paperFormat = ref("A4")
const dpi = ref(96)
const paperDimension = computed(() => {
  var dimension = { 
    'A0': { width : 841, height: 1189 },
    'A1' : { width : 594, height: 841 },
    'A2' : { width : 420, height: 594 },
    'A3' : { width : 297, height: 420 },
    'A4' : { width : 210, height: 297 },
    'A5' : { width : 148, height: 210 },
    'B4' : { width : 250, height: 353 },
    'B5' : { width : 176, height: 250 }
  }
  if (pageOrientation.value == "portrait") {
    return {
      width : dimension[paperFormat.value].width,
      height : dimension[paperFormat.value].height
    }
  }
  if (pageOrientation.value == "landscape") {
    return {
      width : dimension[paperFormat.value].height,
      height : dimension[paperFormat.value].width
    }
  }
  return dimension['A4'];
})

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
)
/**
 * Taille du formualaire (DOM)
 */
const printFormSize = reactive(
  useElementSize(
    printForm,
    { width: 0, height: 0 },
    { box: 'border-box' },
  ),
)
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
)

/**
 * Dimensions du papier en pixel
 */
const pixelPaperDimension = computed(() => {
  return {
    width : paperDimension.value.width / coeffPX2MM,
    height : paperDimension.value.height / coeffPX2MM
  }
})

/**
 *  Coefficient de conversion dimension papier vers preview (EN PIXEL)
 *  coeff * dimContenu = newDimensionFitContenant
 */
const paper2PreviewScaleCoeff = computed(() => {
  let containerHeight = printPageSize.height
  let containerWidth = printPageSize.width - printFormSize.width
  return computeScaleCoeff(containerWidth, containerHeight, pixelPaperDimension.value.width, pixelPaperDimension.value.height)
})

/**
 *  Dimensions de la carte en mm
 */
const mapMMDimension = computed(() => {
  var w = paperDimension.value.width - 2 * margin.value
  var h = paperDimension.value.height - 2 *  margin.value
  if (hasTitle.value) {
    /**
     * on utilise la part que représente le titre dans la preview car
     * la conversion avec pixel2mm est trop approximative
     * */
    h -= (titleSize.height / previewPXDimension.value.height) * h
  }
  return {
    width : w,
    height : h
  }
})
/**
 *  Dimensions de la carte en mm 
 * String pour CSS
 */
 const CSSMapMMDimension = computed(() => {
  return {
    width : mapMMDimension.value.width + "mm",
    height : mapMMDimension.value.height + "mm"
  }
})

const titleHeightMM = computed(() => {
  return paperDimension.value.height - mapMMDimension.value.height - 2* margin.value
})

/**
 *  Dimensions de la carte en px 
 */
 const mapPXDimension = computed(() => {
  return {
    width : mapMMDimension.value.width / coeffPX2MM,
    height : mapMMDimension.value.height / coeffPX2MM
  }
})

/**
 * Dimensions du bloc de prévisualisation en px
 */
 const previewPXDimension = computed(() => {
  return {
    width : pixelPaperDimension.value.width * paper2PreviewScaleCoeff.value,
    height : pixelPaperDimension.value.height * paper2PreviewScaleCoeff.value
  }
})

/**
 * Dimensions du bloc de prévisualisation en px
 */
const cssPreviewPXDimension = computed(() => {
  return {
    width : previewPXDimension.value.width + "px",
    height : previewPXDimension.value.height + "px"
  }
})

/**
 * Marge Gauche de la preview en pixel
 */
 const CSSPreviewPadding = computed(() => {
  return {
    left : (margin.value / paperDimension.value.width) * previewPXDimension.value.width + "px",
    top : (margin.value / paperDimension.value.height) * previewPXDimension.value.height + "px",
  }
})

const format = ref('PNG');

function getPrintMapInstance() {
  return refMap.value?.map ?? mapStore.getMap();
}

async function buildRasterExportCanvas() {
  const dpiValue = dpi.value;
  const dpiCoeff = dpiValue / 96;
  const mapWidthPx = Math.round((mapMMDimension.value.width / 25.4) * dpiValue);
  const mapHeightPx = Math.round((mapMMDimension.value.height / 25.4) * dpiValue);
  const marginPx = Math.round((margin.value / 25.4) * dpiValue);
  const titleHeightPx = hasTitle.value ? Math.round((titleHeightMM.value / 25.4) * dpiValue) : 0;
  const mapCanvas = await renderMapCanvasForExport(getPrintMapInstance(), mapWidthPx, mapHeightPx);
  const finalCanvas = document.createElement('canvas');

  finalCanvas.width = mapWidthPx + (marginPx * 2);
  finalCanvas.height = mapHeightPx + titleHeightPx + (marginPx * 2);

  const finalCtx = finalCanvas.getContext('2d');
  finalCtx.fillStyle = '#ffffff';
  finalCtx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);
  finalCtx.drawImage(mapCanvas, marginPx, marginPx + titleHeightPx);

  const mapElement = refMap.value.mapRef;

  if (hasTitle.value) {
    const titleCanvas = document.createElement('canvas');
    titleCanvas.width = mapWidthPx;
    titleCanvas.height = titleHeightPx;

    const ctxTitle = titleCanvas.getContext('2d');
    drawTitle(ctxTitle, titleHeightPx, mapWidthPx, printTitle.value, mapTitle.value, dpiCoeff);
    finalCtx.drawImage(titleCanvas, marginPx, marginPx);
    titleCanvas.remove();
  }

  if (hasScale.value) {
    const scaleCanvas = document.createElement('canvas');
    scaleCanvas.width = mapWidthPx;
    scaleCanvas.height = mapHeightPx;

    const ctxScale = scaleCanvas.getContext('2d');
    drawScale(ctxScale, mapElement, mapWidthPx, mapHeightPx, dpiCoeff);
    finalCtx.drawImage(scaleCanvas, marginPx, marginPx + titleHeightPx);
    scaleCanvas.remove();
  }

  mapCanvas.remove();

  return {
    dpiValue,
    mapHeightPx,
    mapWidthPx,
    finalCanvas,
    titleHeightPx,
  };
}

async function exportMap() {
  if (format.value === 'PDF') {
    await exportPDF();
    return;
  }
  await exportHighResMap();
}

// Export haute résolution de la map
const exportHighResMap = async () => {
  const { dpiValue, finalCanvas } = await buildRasterExportCanvas();
  const dataUrl = finalCanvas.toDataURL('image/png');

  // Injecter DPI et télécharger
  if (format.value === 'PNG') {
    const finalUrl = await injectDpiInPng(dataUrl, dpiValue);
    const link = document.createElement('a');
    link.download = 'carte.png';
    link.href = finalUrl;
    link.click();
  } else if (format.value === 'JPEG') {
    const jpegUrl = finalCanvas.toDataURL('image/jpeg', 0.95);
    const link = document.createElement('a');
    link.download = 'carte.jpeg';
    link.href = jpegUrl;
    link.click();
  }

  finalCanvas.remove();
}
// Export PDF de la map
const exportPDF = async () => {
  const { finalCanvas } = await buildRasterExportCanvas();

  // Créer le PDF
  const opts = {
    orientation: pageOrientation.value,
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
}

const scaleLineOptions = {
  id: "4",
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
          v-model="pageOrientation"
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
          v-model="paperFormat"
          label="Dimensions"
          :options="[ 'A0', 'A1', 'A2', 'A3', 'A4', 'A5', 'B4', 'B5']"
        />
        <DsfrSelect
          v-model.number="margin"
          label="Marge"
          :options="[
            { value : 0, text : 'Pas de marge - 0mm' },
            { value : 5, text : 'Petite marge - 5mm' },
            { value : 10, text : 'Grosse marge - 10mm' }
          ]"
        />
        <DsfrInput
          v-model="printTitle"
          :disabled="!hasTitle"
          label="Titre de la carte"
          label-visible
          name="titre"
          class="mb-10"
        />
        <div class="mt-10">
          <DsfrCheckbox
            v-model="hasTitle"
            name="checkbox-simple"
            :label="!hasTitle ? 'Activer le titre' : 'Désactiver le titre'"
          />
        </div>
        <div class="mt-10">
          <DsfrCheckbox
            v-model="hasScale"
            name="checkbox-simple"
            :label="!hasScale ? 'Afficher l\'échelle' : 'Désactiver l\'échelle'"
          />
        </div>
        <DsfrSelect
          v-model="format"
          label="Format d'export"
          :options="[ 'PDF', 'PNG', 'JPEG']"
        />
        <DsfrSelect
          v-model.number="dpi"
          label="Résolution"
          :options="[
            { value: 96, text: '96 DPI (écran)' },
            { value: 300, text: '300 DPI (impression)' }
          ]"
        />
        <DsfrButton
          id="print-page-export"
          label="Imprimer la carte"
          title="Imprimer la carte"
          icon=""
          no-outline
          @click="exportMap"
        />
      </div>
      <!-- Dom de la prévisualisation de l'impression -->
      <div class="print-preview-container">
        <div
          ref="printPreview"
          class="print-preview"
        >
          <div
            v-if="hasTitle"
            id="map-title"
            ref="mapTitle"
            class="map-title"
          >
            {{ printTitle }}
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
              :visibility="hasScale"
              :scale-line-options="scaleLineOptions"
              :map-id="printMap"
            />
          </Map>
        </div>
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
    margin-bottom: 20px;
  }
  .mb-10 {
    margin-bottom: 10px;
  }
  .mt-10 {
    margin-top: 10px;
  }
  .print-page{
    display: flex;
    flex-direction: row;
    height: 36rem;
  }
  /*
  TODO gestion des titres trop longs : le rapport de taille de la prévisualisation 
  n'est plus respecté
  */
  .print-preview-container{
    justify-content: center;
    align-items: center;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    margin: 0 auto;
    box-shadow: 3px 3px 5px 6px #ccc;
  }
  .print-preview {
    width: v-bind("cssPreviewPXDimension.width");
    height: v-bind("cssPreviewPXDimension.height");
    padding-left : v-bind("CSSPreviewPadding.left");
    padding-top : v-bind("CSSPreviewPadding.top");
    flex: 0 0;
  }
  .print-form {
    flex: 0 0 260px;
    margin-right: v-bind(formMarginRight);
    /* max-width: 260px; */
  }

  .map-title {
    text-align: center;
  }

  .map {
    width: v-bind("CSSMapMMDimension.width");
    height: v-bind("CSSMapMMDimension.height");
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