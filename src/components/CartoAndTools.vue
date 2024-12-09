<script setup lang="ts">
import Carto from '@/components/carte/Carto.vue'
import LeftMenuTool from '@/components/menu/LeftMenuTool.vue'
import RightMenuTool from '@/components/menu/RightMenuTool.vue'
import ModalTheme from '@/components/modals/ModalTheme.vue'
import ShareModal from '@/components/carte/control/ShareModal.vue'
import PrintModal from "@/components/carte/control/PrintModal.vue";

import { useDataStore } from "@/stores/dataStore"
import { useMapStore } from "@/stores/mapStore"


const mapStore = useMapStore();
const dataStore = useDataStore();
 
const refModalTheme = ref(null)
const modalShareRef = ref(null)
const refPrintModal = ref(null)
const onModalShareOpen = () => {
  modalShareRef.value.onModalShareOpen()
}
const onModalThemeOpen = () => {
  refModalTheme.value.openModalTheme()
}
const onModalPrintOpen = () => {
  refPrintModal.value.onModalPrintOpen()
}

// INFO
// Les listes sont initialisées via le mapStore, et 
// elles sont transmises à la cartographie à chaque fois
// que le mapStore est modifié.
// Chaque fois que des  modules modifient le mapStore en 
// ajoutant des couches (ex. LayerSwitcher), on repasse 
// via la reactivité dans ce cycle.

// liste des couches utilisateurs disponibles
// (cette liste est recalculée à chaque fois que le mapStore est modifié)
const selectedLayers = computed(() => {
  // ajouter les options des couches
  // ex. l'opacité et la visibilité
  let layers = mapStore.getLayers();
  return layers.map((layerId: string) => {
    var layer = dataStore.getLayerByID(layerId);
    // les options de la couche sont récuperées dans le mapStore (permalink)
    var props = mapStore.getLayerProperty(layerId);
    layer.opacity = props.opacity;
    layer.visible = props.visible;
    layer.gray = props.gray;
    return layer;
  });
});

// liste des contrôles utilisateurs disponibles
// (cette liste est recalculée à chaque fois que le mapStore est modifié)
const selectedControls = computed(() => {
  let controls = mapStore.getControls();
  return controls;
});

const cartoRef = ref(null)

provide("selectedLayers", selectedLayers);
</script>

<template>
  <div id="map-and-tools-container">

    <!-- Le catalogue est dans le menu gauche -->
    <LeftMenuTool
      @on-modal-share-open="onModalShareOpen"
      @on-modal-print-open="onModalPrintOpen"
      @on-modal-theme-open="onModalThemeOpen"
    />

    <!-- Module cartographique : 
     - liste des couches selectionnées
     - liste des controles selectionnés
    -->
    <Carto
      ref="cartoRef"
      :selected-layers="selectedLayers"
      :selected-controls="selectedControls"/>

    <!-- Le menu des contrôles est dans le menu droite -->
    <RightMenuTool
      :selected-layers="selectedLayers"
      :selected-controls="selectedControls"
    />
    <div class="modal-container">
  <ModalTheme ref="refModalTheme" />
  <PrintModal ref="refPrintModal" />
  <ShareModal ref="modalShareRef"/>
</div>
  </div>
</template>

<style scoped>
  #map-and-tools-container{
    margin-left: 0;
    width: inherit;
    height: 70vh;
    display: flex;
  }

  @media (max-width: 576px) {
    #map-and-tools-container {
      /* FIXME : la hauteur de la carto dépend de la hauteur du footer et du header, ici en dur */
      height: calc(100vh - 92.5px - 56px);
    }
  }
</style>

<style>
/* FIXME Style non scopé pour cacher les boutons partage et de menu
à voir si c'est factorisable avec ce qui est fait l153 de MenuLateralWrapper.vue */
@media (max-width: 576px) {
  #map-and-tools-container:has(.gpf-mobile-fullscreen > button[aria-pressed="true"]) .navButton,
  #map-and-tools-container:has(.gpf-mobile-fullscreen > button[aria-pressed="true"]) #share-button-position {
    display: none;
  }
}
</style>
