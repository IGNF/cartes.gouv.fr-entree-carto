<script setup lang="js">
import { useLogger } from 'vue-logger-plugin'
import Layer from '@/components/carte/Layer/Layer.vue'

const props = defineProps({
  selectedLayers: Object,
  selectedBookmarks: Object,
  mapId: String
})

// INFO
// liste des couches à ajouter sur la carte
// Array(Object) : cf. dataStore.getLayerByID(layerId)
const log = useLogger()

// liste des informations utiles pour le composant Layer
// Array(Object) : [{name, service, opacity, visible, ...}]
var layers = computed(() => {
  return toRaw(props.selectedLayers).map(layer => {
    log.debug(layer.name, layer.position);
    return {
      name : layer.name,
      service : layer.service || layer.serviceParams.id.split(":")[1], // HACK !
      key : layer.key,
      position : layer.hasOwnProperty("position") ? layer.position : -1,
      opacity : layer.hasOwnProperty("opacity") ? layer.opacity : 1,
      visible : layer.hasOwnProperty("visible") ? layer.visible : true,
      grayscale : layer.hasOwnProperty("grayscale") ? layer.grayscale : false
    }
  })
});

// liste des informations utiles pour le composant Layer
// Array(Object) : [{url, format, opacity, visibility, ...}]
var bookmarks = computed(() => {
  return toRaw(props.selectedBookmarks).map(bookmark => {
    log.debug(bookmark.name, bookmark.position);
    return {
      position : bookmark.hasOwnProperty("position") ? bookmark.position : -1,
      opacity : bookmark.hasOwnProperty("opacity") ? bookmark.opacity : 1,
      visible : bookmark.hasOwnProperty("visible") ? bookmark.visible : true,
      grayscale : bookmark.hasOwnProperty("grayscale") ? bookmark.grayscale : false,
      ...bookmark
    };
  })
});

</script>

<template>
  <Layer
    v-for="layer in [...layers, ...bookmarks]"
    :key="layer.key"
    :layer-options="layer"
    :map-id="mapId"
  />
</template>
