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

import { fromShare } from "@/features/share";

const mapStore = useMapStore();
const dataStore = useDataStore();

// liste des couches utilisateurs disponibles
// (cette liste est recalculée à chaque fois que le mapStore est modifié)
const selectedLayers = computed(() => {
  var layersValided = [];
  var layers = mapStore.getLayers();
  for (let i = 0; i < layers.length; i++) {
    var layerId = layers[i];
    var layer = dataStore.getLayerByID(layerId);
    if (!layer) {
      continue;
    }
    // les options de la couche sont récuperées dans le mapStore (permalink)
    var props = mapStore.getLayerProperty(layerId);
    // ajouter les options des couches
    // ex. l'opacité et la visibilité
    layer.position = props.position;
    layer.opacity = props.opacity;
    layer.visible = props.visible;
    layer.grayscale = props.grayscale;
    if (props.style) {
      // INFO
      // on ajoute le style de la couche si il est défini
      // ex. pour les couches de type TMS / MapBox
      layer.style = props.style;
    }
    layersValided.push(layer);
  }
  return layersValided;
});

// liste des favoris selectionnés par l'utilisateur, donc disponibles dans le permalien
// (cette liste est recalculée à chaque fois que le mapStore est modifié)
const selectedBookmarks = computed(() => {
  var bookmarksValided = [];
  var bookmarks = mapStore.getBookmarks();
  for (let i = 0; i < bookmarks.length; i++) {
    var bookmark = bookmarks[i];
    // transformer un partage d'URL en un objet
    var obj = fromShare(decodeURIComponent(bookmark));
    if (!obj) {
      continue;
    }
    bookmarksValided.push(obj);
    
  }
  return bookmarksValided;
});

// Contrôles fixés par defaut
const selectedControls = [
  "LayerSwitcher",
  "ScaleLine", 
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
          :selected-bookmarks="selectedBookmarks"
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
