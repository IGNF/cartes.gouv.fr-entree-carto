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

</script>

<template>
    <Map>
      <View
        :center="mapStore.center"
        :zoom="mapStore.zoom"/>
      <Controls
        v-if="selectedControls"
        :control-options="props.selectedControls"/>
      <Layers
        :v-if="selectedLayers"
        :selected-layers="props.selectedLayers"/>
    </Map>
</template>

<style scoped>

</style>