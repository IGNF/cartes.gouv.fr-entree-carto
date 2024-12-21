<script setup lang="ts">
import Carto from '@/components/carte/Carto.vue'
import LeftMenuTool from '@/components/menu/LeftMenuTool.vue'
import RightMenuTool from '@/components/menu/RightMenuTool.vue'

import ThemeModal from '@/components/modals/ModalTheme.vue'
import LoginModal from "@/components/modals/ModalLogin.vue";
import ShareModal from '@/components/carte/control/ShareModal.vue'
import PrintModal from "@/components/carte/control/PrintModal.vue";

import { useDataStore } from "@/stores/dataStore"
import { useMapStore } from "@/stores/mapStore"


const mapStore = useMapStore();
const dataStore = useDataStore();
 
const refModalTheme: ThemeModal = ref({})
const refModalLogin: LoginModal = ref({})
const refModalShare: ShareModal = ref({})
const refModalPrint: PrintModal = ref({})

// Les gestionnaires d'évenements des modales
const onModalShareOpen = () => {
  refModalShare.value.onModalShareOpen()
}
const onModalThemeOpen = () => {
  refModalTheme.value.openModalTheme()
}
const onModalPrintOpen = () => {
  refModalPrint.value.onModalPrintOpen()
}
const onModalLoginOpen = () => {
  refModalLogin.value.openModalLogin()
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

    <!-- Le menu de gauche : le menu tierce (et les favoris)
     il y figure la liste des abonnements aux evenements sur le clic
     d'un élement du menu tierce
    -->
    <LeftMenuTool
      @on-modal-share-open="onModalShareOpen"
      @on-modal-print-open="onModalPrintOpen"
      @on-modal-theme-open="onModalThemeOpen"
      @on-modal-login-open="onModalLoginOpen"
    />

    <!-- Module cartographique : 
     - liste des couches selectionnées
     - liste des controles selectionnés
    -->
    <Carto
      ref="cartoRef"
      :selected-layers="selectedLayers"
      :selected-controls="selectedControls"/>

    <!-- Le menu des contrôles et le catalogue -->
    <RightMenuTool
      :selected-layers="selectedLayers"
      :selected-controls="selectedControls"
    />
    <!-- Liste des modales -->
    <div class="modal-container">
      <ThemeModal ref="refModalTheme" />
      <PrintModal ref="refModalPrint" />
      <ShareModal ref="refModalShare" />
      <LoginModal ref="refModalLogin" />
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
