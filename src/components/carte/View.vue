<script setup lang="js">
import View from 'ol/View'
import {
  toLonLat as toLonLatProj,
  fromLonLat as fromLonLatProj
} from "ol/proj";

import { useMapStore } from "@/stores/mapStore"
const store = useMapStore()

const props = defineProps({
  zoom : Number,
  center : Array,
})

// recuperation de l'objet 'map' du composant parent
const map = store.getMap()

/**
 * creation de la vue
 */
const view = new View({ 
  zoom: props.zoom, 
  center: fromLonLatProj(props.center)
})

/**
 * abonnement à l'evenement 'change:center' de la vue
 * pour mise à jour du centre de la carte
 */
view.on("change:center", (e) => {
  store.x = e.target.getCenter()[0];
  store.y = e.target.getCenter()[1];

  var coordinate = toLonLatProj(e.target.getCenter());
  store.lon = coordinate[0];
  store.lat = coordinate[1];
})

/**
 * abonnement à l'evenement 'change:resolution' de la vue
 * pour mise à jour du zoom de la carte
 */
view.on("change:resolution", (e) => {
    store.zoom = view.getZoom()
})

onMounted(() => {
  if (map) {
    map.setView(view)
  }
})
</script>

<template></template>

<style scoped></style>