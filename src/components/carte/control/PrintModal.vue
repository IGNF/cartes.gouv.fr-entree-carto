<script lang="js">
/**
 * @description
 * Panneau de partage de carte
 *
 * {@link https://github.com/dnum-mi/vue-dsfr/tree/main/src/components/DsfrButton}
 * {@link https://github.com/dnum-mi/vue-dsfr/tree/main/src/components/DsfrModal}
 */
export default {};
</script>

<script lang="js" setup>
import { useElementSize } from '@vueuse/core'
import { useMapStore }  from '@/stores/mapStore';
import { useEulerian } from '@/plugins/Eulerian.js';
import Map from '../Map.vue';
import View from '../View.vue';
import { printMap } from '@/composables/keys';
import { getFakeMapCanvas, drawScale, drawTitle } from '@/composables/printUtils';
import { jsPDF } from "jspdf";

const eulerian = useEulerian();
const mapStore = useMapStore();
const props = defineProps({
  visibility: Boolean,
  printOptions: Object,
  selectedBookmarks : Array
});
const selectedLayers = inject('selectedLayers');

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
  printModalOpened.value = true;
  eulerian.pause();
};
const onModalPrintClose = () => {
  printModalOpened.value = false;
  eulerian.resume();
};

defineExpose({
    onModalPrintClose,
    onModalPrintOpen
})
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
const hasTitle = ref(false)
const printTitle = ref("Ma carte")
const pageOrientation = ref("portrait");
const margin = ref(0)
const paperFormat = ref("A4")
const dimension = computed(() => {
  let dimension = { 
    'A0': { width : 841, height: 1189 },
    'A1' : { width : 594, height: 841 },
    'A2' : { width : 420, height: 594 },
    'A3' : { width : 297, height: 420 },
    'A4' : { width : 210, height: 297 },
    'A5' : { width : 148, height: 210 },
    'B4' : { width : 250, height: 353 },
    'B5' : { width : 176, height: 250 }
  }
  return {
    width : dimension[paperFormat.value].width,
    height : dimension[paperFormat.value].height
  }
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
 * Rapport de conversion mm vers pixel selon l'espace disponible
 */
const coeff = computed(() => {
  if (pageOrientation.value == "portrait")
    return Math.floor((printPageSize.height - titleSize.height) * coeffPX2MM) / dimension.value.height;
  if (pageOrientation.value == "landscape") {
    let coeff = Math.floor((printPageSize.width - printFormSize.width - parseInt(formMarginRight)) * coeffPX2MM) / dimension.value.height;
    // cas ou la hauteur disponible n'est pas suffisante 
    if (dimension.value.height * coeff + titleSize.height < printPageSize.height) {
      return Math.floor((printPageSize.height - titleSize.height) * coeffPX2MM) / dimension.value.width; 
    }
    else {
      return coeff
    } 
  }
})

/**
 * Hauteur et largeur en mm
 * du format papier
 */
const mapHeight = computed(() => {
  if (pageOrientation.value == "portrait")
    return dimension.value.height + "mm";
    // return dimension.value.height - titleSize.height * coeffPX2MM + "mm";
  if (pageOrientation.value == "landscape")
    return dimension.value.width + "mm";
    // return dimension.value.width  - titleSize.height * coeffPX2MM + "mm";
})
const mapWidth = computed(() => {
  if (pageOrientation.value == "portrait")
    return dimension.value.width + "mm";
  if (pageOrientation.value == "landscape")
    return dimension.value.height + "mm";
})

/**
 * Hauteur et largeur en pixel
 * de la prévisualisation de la carte à imprimer
 */ 
// TODO PROBLEME AVEC LA HAUTEUR COMPORTEMENT AVEC LE TITRE
const previewHeight = computed(() => {
  //   return printPageSize.height - titleSize.height + "px";
    return printPageSize.height + "px";
})
const previewWidth = computed(() => {
  if (pageOrientation.value == "portrait")
    return (dimension.value.width * coeff.value ) / coeffPX2MM + "px";
  if (pageOrientation.value == "landscape")
    return ((dimension.value.height * coeff.value ) / coeffPX2MM) + "px";
})

/**
 * Fonction d'export de la carte
 */
const exportPDF = () => {
  const opts = {
    orientation : pageOrientation.value,
    unit : "mm",
    format : [parseInt(mapHeight.value), parseInt(mapWidth.value)],
  } 
  const doc = new jsPDF(opts)
  const marge = parseInt(margin.value)
  const canvasWidth = refMap.value.mapRef.getElementsByTagName('canvas')[0].width
  const canvasHeight = refMap.value.mapRef.getElementsByTagName('canvas')[0].height
  const canvas = refMap.value.mapRef.getElementsByTagName('canvas')[0]


  const img = canvas.toDataURL('image/png')
  const imgWidth = (canvasWidth * coeffPX2MM) - (marge * 2)
  const imgHeight = ((canvasHeight - titleSize.height) * coeffPX2MM) - (marge * 2)
  const imgPosX = marge
  const imgPosY = (titleSize.height * coeffPX2MM) + marge
  doc.addImage(img, 'PNG', imgPosX, imgPosY, imgWidth, imgHeight)
  

  if (hasScale.value) {
    // Fake canvas
    const fakeCanvas = getFakeMapCanvas(refMap.value.mapRef, canvasWidth, canvasHeight)
    let ctx = fakeCanvas.getContext("2d");
    ctx.reset()
    // Dessine l'échelle
    drawScale(ctx, refMap.value.mapRef, canvasHeight)
    let imgOverlay = fakeCanvas.toDataURL('image/png')
    doc.addImage(imgOverlay, 'PNG', imgPosX, imgPosY, imgWidth, imgHeight)
  }
  if (hasTitle.value) {
    // Dessine le titre
    const titleCanvas = document.createElement('canvas');
    titleCanvas.width = canvasWidth;
    titleCanvas.height = titleSize.height;
    let ctx = titleCanvas.getContext('2d');
    drawTitle(ctx, titleCanvas.height, titleCanvas.width, printTitle.value)
    let imgTitle = titleCanvas.toDataURL('image/png')
    doc.addImage(imgTitle, 'PNG', marge, marge, imgWidth, titleCanvas.height * (coeff.value / coeffPX2MM) - (marge * 2))
    titleCanvas.remove()
  }

  doc.save('carte.pdf')
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
      @close="onModalPrintClose">
      <!-- slot : c'est ici que l'on customise le contenu ! -->
    <div ref="printPage" class="print-page">
      <!-- Formulaire d'impression -->
        <div ref="printForm" class="print-form">
            <DsfrSegmentedSet
              :inline="false"
              v-model="pageOrientation"
              :options="pageOrientationOptions"
              :small="false"
              legend="Mise en Page"
              class="mb-20"
            >
              <template #legend>Mise en Page</template>
            </DsfrSegmentedSet>
            <DsfrSelect
              v-model="paperFormat"
              label="Dimensions"
              :options="[ 'A0', 'A1', 'A2', 'A3', 'A4', 'A5', 'B4', 'B5']"
            />
       <!--    <DsfrSelect
              v-model="margin"
              label="Marge"
              :options="[
                { value : 0, text : 'Pas de marge - 0mm' },
                { value : 5, text : 'Petite marge - 5mm' },
                { value : 10, text : 'Grosse marge - 10mm' }
              ]"
            />-->
            <DsfrInput
                v-model="printTitle"
                :disabled="!hasTitle"
                label="Titre de la carte"
                label-visible
                name="titre"
                class="mb-10"
            />
            <div class="mt-10"><DsfrCheckbox
              v-model="hasTitle"
              name="checkbox-simple"
              :label="!hasTitle ? 'Activer le titre' : 'Désactiver le titre'"
            /></div>
            <div class="mt-10">
              <DsfrCheckbox
              v-model="hasScale"
              name="checkbox-simple"
              :label="!hasScale ? 'Afficher l\'échelle' : 'Désactiver l\'échelle'"
            /></div>
            <DsfrButton
              id="print-page-export"
              label="Export PDF"
              title="Export PDF"
              icon=""
              no-outline
              @click="exportPDF"
            />
         </div>
        <!-- Dom de la prévisualisation de l'impression -->
        <div  class="print-preview-container">
          <div ref="printPreview" class="print-preview">
            <div id="map-title" ref="mapTitle" class="map-title" v-if="hasTitle">{{ printTitle }}</div>
            <Map
              v-if="printModalOpened" 
              class="map" 
              ref="refMap"
              :map-Id="printMap"
            >
                <View
                  :map-Id="printMap"
                  :center="mapStore.center"
                  :zoom="mapStore.zoom"/>
                <Layers
                  :map-Id="printMap"
                  :selected-layers="selectedLayers"
                  :selected-bookmarks="selectedBookmarks"/>
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
    margin-top: 30px;
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
    width: v-bind(previewWidth);
    height: v-bind(previewHeight);
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
    width: v-bind(mapWidth);
    height: v-bind(mapHeight);
    transform: scale(v-bind(coeff));
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