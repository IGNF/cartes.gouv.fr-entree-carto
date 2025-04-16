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
    return {
      name : layer.name,
      service : layer.service || layer.serviceParams.id.split(":")[1], // HACK !
      key : layer.key,
      opacity : layer.hasOwnProperty("opacity") ? layer.opacity : 1,
      visible : layer.hasOwnProperty("visible") ? layer.visible : true,
      gray : layer.hasOwnProperty("gray") ? layer.gray : false
    }
  })
});

// liste des informations utiles pour le composant Layer
// Array(Object) : [{url, format, opacity, visibility, ...}]
var bookmarks = computed(() => {
  return toRaw(props.selectedBookmarks).map(bookmark => {
    return {
      opacity : 1,
      visible : true,
      gray : false,
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
