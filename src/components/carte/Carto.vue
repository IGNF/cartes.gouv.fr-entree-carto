<script setup lang="js">

// chargement des CSS de la carte et des extensions
import "ol/ol.css";
import "geoportal-extensions-openlayers/css/Dsfr.css";

import Map from '@/components/carte/Map.vue'
import View from '@/components/carte/View.vue'
import Control from '@/components/carte/Control.vue'
import LayerManager from '@/components/carte/Layer/LayerManager.vue'

import { useMapStore } from "@/stores/mapStore"

const props = defineProps({
  selectedControls : Array,
  layersList : Object,
})

const mapStore = useMapStore()

</script>

<template>
    <Map>
      <View
        :center="mapStore.center"
        :zoom="mapStore.zoom"/>
      <Control
        v-if="selectedControls"
        :control-options="props.selectedControls"/>
      <!-- FIXME c'est un composant pour l'exemple
      donc provisoire ! -->
      <LayerManager
        :layers-list="props.layersList"/>
    </Map>
</template>

<style scoped>

</style>