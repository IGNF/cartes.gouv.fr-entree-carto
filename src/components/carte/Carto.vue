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
import { nextTick } from "vue";

import Map from '@/components/carte/Map.vue'
import Controls from '@/components/carte/Controls.vue'
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


// INFO
// verrou pour savoir si on a déjà initialisé la carte 
// après que les Layers soient prêts
const hasInitializedAfterLayersReady = ref(false);

// INFO
// On écoute l'événement "ready" (once) émis par le composant Layers lorsque 
// la dernière couche est montée. On ajoute l'attribut "ol-layers-fully-loaded" 
// sur le composant Map pour indiquer que toutes les couches sont prêtes.
const layersReady = ref(false); // uniquement au moment du montage des Layers, pas à chaque changement de props.selectedLayers
const onLayersReady = () => {
  layersReady.value = true;

  if (hasInitializedAfterLayersReady.value) {
    return;
  }

  nextTick(() => {
    initialize();
    hasInitializedAfterLayersReady.value = true;
  });
};

// INFO
// On initialise la carte une fois que le DOM est prêt 
// et que les Layers sont montés
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

const controlsready = ref(false); // uniquement au moment du montage des Controls, pas à chaque changement de props.selectedControls    
const onControlsReady = () => {
  log.debug("Controls are ready");
  controlsready.value = true;
}

onMounted(() => {
  log.debug("Carto component mounted") 
})

</script>

<template>
  <Map
    ref="refMap"
    class="map"
    :class="{
      'ol-layers-fully-loaded': layersReady,
      'ol-controls-fully-loaded': controlsready
    }"
    :map-id="mainMap"
    :center="mapStore.center"
    :zoom="mapStore.zoom"
  >
    <!-- Composant pour selectionner les widgets à afficher sur la carte -->
    <Controls
      v-if="mapIsReady"
      :map-id="mainMap"
      :control-options="props.selectedControls"
      @ready="onControlsReady"
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
