<script setup lang="js">

// chargement des CSS de la carte et des extensions
import "ol/ol.css";
import "geoportal-extensions-openlayers/css/Dsfr.css";

import Map from '@/components/carte/Map.vue'
import View from '@/components/carte/View.vue'
import Controls from '@/components/carte/Controls.vue'
import Layers from '@/components/carte/Layer/Layers.vue'

import { useMapStore } from "@/stores/mapStore"

const props = defineProps({
  selectedControls : Array,
  selectedLayers : Object,
})

const mapStore = useMapStore()

// INFO
// Les listes sont transmises aux composants Controls et Layers
// Ces listes sont reactives car le parent les produit via des 
// fonctions computed() où on récupère la liste via le mapStore

// INFO
// On place une ref sur l'objet Map afin de savoir quang le DOM
// est écrit. Une fonction computed() permet de savoir quand le DOM
// est ready

// la reference sur l'objet Map
const refMap = ref(null);

// une fonction de type computed() qui permet de savoir 
// si le DOM est prêt
const mapIsReady = computed(() => {
  return (refMap.value && refMap.value.mapRef);
});

</script>

<template>
    <Map ref="refMap">
      <!-- Initialisation de la vue -->
      <View
        :center="mapStore.center"
        :zoom="mapStore.zoom"/>
      <!-- Composant pour selectionner les widgets à afficher sur la carte -->
      <Controls
        v-if="mapIsReady"
        :control-options="props.selectedControls"/>
      <!-- Composant pour ajouter les couches sur la carte -->
      <Layers
        :selected-layers="props.selectedLayers"/>
    </Map>
</template>

<style scoped>

</style>