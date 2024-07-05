<script setup lang="js">

// chargement des CSS de la carte et des extensions
import "ol/ol.css";
import "geoportal-extensions-openlayers/css/Dsfr.css";

import Map from '@/components/carte/Map.vue'
import View from '@/components/carte/View.vue'
import Controls from '@/components/carte/Controls.vue'
import Layers from '@/components/carte/Layer/Layers.vue'
import PointerInteraction from "@/components/carte/interaction/PointerInteraction.vue";

import { useMapStore } from "@/stores/mapStore"

const props = defineProps({
  selectedControls : Array,
  selectedLayers : Object,
})

const mapStore = useMapStore()

// INFO
// Les listes sont transmises aux composants Controls et Layers

</script>

<template>
    <Map>
      <!-- Initialisation de la vue -->
      <View
        :center="mapStore.center"
        :zoom="mapStore.zoom"/>
      <!-- Composant pour selectionner les widgets à afficher sur la carte -->
      <Controls
        v-if="selectedControls"
        :control-options="selectedControls"/>
      <!-- Composant pour ajouter les couches sur la carte -->
      <Layers
        v-if="selectedLayers"
        :selected-layers="selectedLayers"/>
    </Map>
</template>

<style scoped>

</style>