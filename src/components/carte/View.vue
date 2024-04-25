<script setup lang="js">
import View from 'ol/View'

import { useMapStore } from "@/stores/mapStore"
const store = useMapStore()

const props = defineProps({
  zoom : Number,
  center : Array,
  layers : Array
})

const map = inject('map')

const view = new View({ 
  zoom: props.zoom, 
  center: props.center 
})

/**
 * abonnement aux evenements de la vue
 */
view.on("change:center", (e) => {
  store.setCenter(e.target.getCenter());
})

onMounted(() => {
  if (map) {
    props.layers.forEach((layer) => {
      map.addLayer(layer)
    })
    map.setView(view)
  }
})
</script>

<template>
  <div />
</template>

<style scoped>
</style>