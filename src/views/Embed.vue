<script lang="js">
/**
 * @description
 * Cartographie intégrée pour partage
 * 
 */
</script>

<script setup lang="js">
import Carto from '@/components/carte/Carto.vue';
import Patience from '@/components/utils/Patience.vue'
import StoreData from '@/components/StoreData.vue';

import { useMapStore } from "@/stores/mapStore";
import { useDataStore } from "@/stores/dataStore";


const mapStore = useMapStore();
const dataStore = useDataStore();

// On récupère les couches du mapStore
const selectedLayers = computed(() => {
  let layers = mapStore.getLayers();
  return layers.map((layerId) => {
    var layer = dataStore.getLayerByID(layerId);
    // les options de la couche sont récuperées dans le mapStore (permalink)
    var props = mapStore.getLayerProperty(layerId);
    layer.opacity = props.opacity;
    layer.visible = props.visible;
    layer.grayscale = props.grayscale;
    return layer;
  });
});

// Contrôles fixés par defaut
const selectedControls = [
  "ScaleLine", 
  // "OverviewMap",
  "Zoom"
];

</script>

<template>
  <Suspense>
    <!-- Chargement du dataStore avec une patience avant affichage de la cartographie -->
    <StoreData>
      <div class="map-container">
        <Carto 
          :selected-layers="selectedLayers"
          :selected-controls="selectedControls"
          :selected-bookmarks="[]"
        />
      </div>
    </StoreData>

    <!-- loading state via #fallback slot -->
    <template #fallback>
      <Patience />
    </template>
  </Suspense>
</template>

<style scoped>
.map-container,
.patience-container {
  height: 100vh;
}
</style>
