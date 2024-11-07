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
const modal = ref(null)

// Paramètres de la carte
const hasTitle = ref(true)
const printTitle = ref("Titre de la carte")
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
  return dimension[paperFormat.value]
})
onUpdated(() => {
    /* hack pour surcharger le style modal dsfr */
    let modalDOM = modal.value.getElementsByClassName("fr-container")[0]
    if (modalDOM) {
      modalDOM.classList.add("modal-override");
      modalDOM.classList.remove("fr-container-md", "fr-container");
      refMap.value.updateSize()
    }
});

onBeforeMount(() => {
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
    <div class="print-preview">
        <div class="print-form">
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
            <br>
            <DsfrCheckbox
              v-model="hasTitle"
              name="checkbox-simple"
              label="Ajouter un titre"
            />
            <DsfrInput
                v-model="printTitle"
                :disabled="!hasTitle"
                label="Titre de la carte"
                label-visible
                name="titre"
            />
        </div>
        <div class="print-map" :width="dimension.width  * 96 / 254" :height="dimension.height  * 96 / 254">
            <Map 
              class="map" 
              ref="refMap"
              :symbolName="printMap"
            >
              <View
                :center="mapStore.center"
                :zoom="mapStore.zoom"/>
              <Layers
                :selected-layers="selectedLayers"/>
            </Map>
        </div>
    </div>
    </DsfrModal>
  </div>
</template>

<style scoped>
  #print-container {}
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

  .print-preview{
    display: flex;
    flex-direction: row;
    height: 36rem;
    margin-top: 30px;
  }
  .print-map{
    flex: 3 0 300px;
    height: 36rem;

  }
  .print-form {
    flex: 1 2 100px;
    margin-right: 10px;
  }

  .map {
    width: 100%;
    height: 100%;
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