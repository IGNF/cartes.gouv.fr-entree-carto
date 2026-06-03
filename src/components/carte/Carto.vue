<script lang="js">
  /**
   * @description
   * Composant définissant la configuration de la carte :
   * @property { Object } selectedLayers liste des Layers sélectionnés ajoutés à la carte par l'utilisateur
   * @property { Array } selectedControls tableau des controls (gpf-extension) sélectionnés par l'utilisateur pour s'afficher sur la carte
   * 
   */
  export default {
    name: 'Carto'
  };
</script>
<script setup lang="js">
import { defineAsyncComponent, nextTick } from "vue";

import Map from '@/components/carte/Map.vue'
import Layers from '@/components/carte/Layer/Layers.vue'

import { useMapStore } from "@/stores/mapStore";
import { mainMap } from "@/composables/keys"
import { useLogger } from "vue-logger-plugin";

const props = defineProps({
  selectedControls: {
    type: Array,
    default: () => []
  },
  selectedLayers: {
    type: Object,
    default: () => ({})
  },
  selectedBookmarks: {
    type: Object,
    default: () => ({})
  }
})

const mapStore = useMapStore()
const log = useLogger()

const Controls = defineAsyncComponent(() => import('@/components/carte/Controls.vue'));

// INFO
// Les listes sont transmises aux composants Controls et Layers
// Ces listes sont reactives car le parent les produit via des 
// fonctions computed() où on récupère la liste via le mapStore

// INFO
// On place une ref sur l'objet Map afin de savoir quand le DOM
// est écrit. Une fonction computed() permet de savoir quand le DOM
// est ready

// la reference sur l'objet Map
const refMap = ref(null);

// une fonction de type computed() qui permet de savoir 
// si le DOM est prêt
const mapIsReady = computed(() => {
  return (refMap.value && refMap.value.mapRef);
});

const controlsCanLoad = ref(false);


const hasInitialRecenter = ref(false);

// INFO
// On écoute l'événement "ready" émis par le composant Layers lorsque 
// la dernière couche est montée.
const onLayersReady = () => {
  if (hasInitialRecenter.value) {
    return;
  }

  nextTick(() => {
    initialize();
    hasInitialRecenter.value = true;
  });
};

const initialize = () => {
  const map = mapStore.getMap();
  if (!map) {
    return;
  }

  const view = map.getView();
  if (!view) {
    return;
  }

  // actions à faire une fois que la carte est prête 
  // et que les couches sont montées !
}

onMounted(() => {
  log.debug("Carto component mounted") 

  // Décale le chargement du chunk des contrôles pour laisser la carte s'afficher d'abord.
  nextTick(() => {
    controlsCanLoad.value = true;
  });
})

</script>

<template>
  <Map
    ref="refMap"
    class="map"
    :map-id="mainMap"
    :center="mapStore.center"
    :zoom="mapStore.zoom"
  >
    <!-- Composant pour selectionner les widgets à afficher sur la carte -->
    <Controls
      v-if="mapIsReady && controlsCanLoad"
      :map-id="mainMap"
      :control-options="props.selectedControls"
    />
    <!-- Composant pour ajouter les couches sur la carte -->
    <Layers
      :map-id="mainMap"
      :selected-layers="props.selectedLayers"
      :selected-bookmarks="props.selectedBookmarks"
      @ready="onLayersReady"
    />
  </Map>
</template>

<style scoped>
.map {
    position: absolute;
    width: 100%;
    height: inherit;
}
</style>
