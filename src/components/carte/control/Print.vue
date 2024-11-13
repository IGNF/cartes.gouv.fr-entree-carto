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

const eulerian = useEulerian();
const mapStore = useMapStore();
const props = defineProps({
  visibility: Boolean,
  printOptions: Object
});
const selectedLayers = inject('selectedLayers');
// paramètres du composant bouton
const btnTitle = "Ouvrir le panneau d'impression carte";
const btnIcon = "px-print"; // FIXME icone de partage dsfr !?
const btnLabel = "";

// paramètres du composant de la modale
const title = "Imprimer une carte";
const size = "xl";

const printModalOpened = ref(false);

const onModalPrintOpen = () => {
  printModalOpened.value = true;
  eulerian.pause();
};
const onModalPrintClose = () => {
  printModalOpened.value = false;
  eulerian.resume();
};

const refMap = ref(null);
const mapTitle = ref(null);
const modal = ref(null)
const printPage = ref(null)
const printForm = ref(null)
const formMarginRight = "10px"
// Paramètres de la carte
const hasTitle = ref(true)
const printTitle = ref("Titre de la carte")
const margin = ref(0)

const pageOrientation = ref("paysage");

const pageOrientationOptions = [
  {
    "label": "Portrait",
    "value": "portrait",
    "icon": "md-cropportrait-sharp"
  },
  {
    "label": "Paysage",
    "value": "paysage",
    "icon": "md-croplandscape-sharp"
  }
];

const paperFormat = ref("A4")
const printPageSize = reactive(
  useElementSize(
    printPage,
    { width: 0, height: 0 },
    { box: 'border-box' },
  ),
)
const printFormSize = reactive(
  useElementSize(
    printForm,
    { width: 0, height: 0 },
    { box: 'border-box' },
  ),
)
const titleSize = reactive(
  useElementSize(
    mapTitle,
    { width: 0, height: 0 },
    { box: 'border-box' },
  ),
)
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

// rapport de conversion mm vers pixel selon l'espace disponible
const coeff = computed(() => {
  if (pageOrientation.value == "portrait")
    return Math.floor((printPageSize.height - titleSize.height) * 0.264583333) / dimension.value.height;
  if (pageOrientation.value == "paysage") {
    let coeff = Math.floor((printPageSize.width - printFormSize.width - parseInt(formMarginRight)) * 0.264583333) / dimension.value.height;
    // cas ou la hauteur disponible n'est pas suffisante 
    if (dimension.value.height * coeff + titleSize.height < printPageSize.height) {
      return Math.floor((printPageSize.height - titleSize.height) * 0.264583333) / dimension.value.width; 
    }
    else {
      return coeff
    } 
  }
})
const mapHeight = computed(() => {
  if (pageOrientation.value == "portrait")
    return dimension.value.height + "mm";
  if (pageOrientation.value == "paysage")
    return dimension.value.width + "mm";
})
const mapWidth = computed(() => {
  if (pageOrientation.value == "portrait")
    return dimension.value.width + "mm";
  if (pageOrientation.value == "paysage")
    return dimension.value.height + "mm";
}) 
const previewHeight = computed(() => {
  if (pageOrientation.value == "portrait")
    return printPageSize.height + "px";
  if (pageOrientation.value == "paysage")
    return printPageSize.height + "px";
})
const previewWidth = computed(() => {
  if (pageOrientation.value == "portrait")
    return (dimension.value.width * coeff.value ) / 0.264583333 + "px";
  if (pageOrientation.value == "paysage")
    return ((dimension.value.height * coeff.value ) / 0.264583333) + "px";
})

onUpdated(() => {
  /* hack pour surcharger le style modal dsfr */
    let modalDOM = modal.value.getElementsByClassName("fr-container")[0]
    if (modalDOM) {
      modalDOM.classList.add("modal-override");
      modalDOM.classList.remove("fr-container-md", "fr-container");
    }
});

</script>

<template>
  <div ref="modal" id="print-container">
    <DsfrButton
      v-if="props.visibility"
      id="print-button-position"
      class="fr-btn fr-btn--md fr-btn fr-btn--secondary inline-flex justify-center print-button-size"
      :label="btnLabel"
      :title="btnTitle"
      :icon="btnIcon"
      icon-only
      no-outline
      @click="onModalPrintOpen"
    />
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
            <DsfrSelect
              v-model="margin"
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
            <div class="mt-10"><DsfrCheckbox
              v-model="hasTitle"
              name="checkbox-simple"
              :label="!hasTitle ? 'Activer le titre' : 'Désactiver le titre'"
            /></div>
        </div>
        <!-- Dom de la prévisualisation de l'impression -->
        <div  class="print-preview-container">
          <div class="print-preview">
            <div ref="mapTitle" class="map-title" v-if="hasTitle">{{ printTitle }}</div>
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
                  :selected-layers="selectedLayers"/>
            </Map>
        </div>
        </div>    
    </div>
    </DsfrModal>
  </div>
</template>

<style scoped>
  #print-button-position {
    position: absolute;
    right: 16px;
    top: 56px;
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
  .print-preview-container{
    /* transform: scale(v-bind(coeff)); */
    /* height: 36rem; */
    justify-content: center;
    align-items: center;
    display: flex;
    flex-direction: column;
    overflow-x: auto;
    overflow-y: auto;
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
    max-width: 98vw;
    margin-left: auto;
    margin-right: auto;
    width: 100%;
  }
</style>