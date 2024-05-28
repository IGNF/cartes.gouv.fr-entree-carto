<script setup lang="js">
import View from 'ol/View'

import { useMapStore } from "@/stores/mapStore"
const store = useMapStore()

const props = defineProps({
  zoom : Number,
  center : Array,
})

// recuperation de l'objet 'map' du composant parent
const map = inject('map')

/**
 * creation de la vue
 */
const view = new View({ 
  zoom: props.zoom, 
  center: props.center 
})

/**
 * abonnement à l'evenement 'change:center' de la vue
 * pour mise à jour du centre de la carte
 */
view.on("change:center", (e) => {
  store.lat =  e.target.getCenter()[0]
  store.long =  e.target.getCenter()[1]
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
    // enregistrement
    store.map = map
  }
})
</script>

<template></template>

<style scoped></style>