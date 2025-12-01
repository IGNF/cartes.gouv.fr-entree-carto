<script lang="js">
  /**
   * @description
   * 
   * @property { Number } zoom niveau de zoom à l'initialisation de la view Openlayer
   * @property { Array } center tableau des coordonnées du centre de la carte à l'initialisation de la view Openlayer
   * 
   */
  export default {
    name: 'View'
  };
</script>

<script setup lang="js">
import View from 'ol/View';
import {
  toLonLat as toLonLatProj,
  fromLonLat as fromLonLatProj
} from "ol/proj";

import { useMapStore } from "@/stores/mapStore";
import { mainMap } from "@/composables/keys";

const store = useMapStore();

const props = defineProps({
  zoom : Number,
  center : Array,
  mapId: String
});

// recuperation de l'objet 'map' du composant parent
const map = inject(props.mapId);

/**
 * creation de la vue
 */
const view = new View({ 
  zoom: props.zoom, 
  center: fromLonLatProj(props.center),
  minZoom : 0,
  maxZoom : 19,
  projection : "EPSG:3857"
});

/**
 * abonnement à l'evenement 'change:center' de la vue
 * pour mise à jour du centre de la carte
 */
view.on("change:center", (e) => {
  if (props.mapId == mainMap) {
    store.x = e.target.getCenter()[0];
    store.y = e.target.getCenter()[1];

    var coordinate = toLonLatProj(e.target.getCenter());
    store.lon = coordinate[0];
    store.lat = coordinate[1];
  }
})

/**
 * abonnement à l'evenement 'change:resolution' de la vue
 * pour mise à jour du zoom de la carte
 */
view.on("change:resolution", (e) => {
  store.zoom = view.getZoom();
})

onMounted(() => {
  if (map) {
    // autoriser ?
    // view.setConstrainResolution(true);
    map.setView(view);
  }
})

</script>

<template></template>

<style scoped></style>