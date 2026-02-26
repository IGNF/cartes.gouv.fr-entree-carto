<script setup lang="js">
import { computed, toRaw } from 'vue'
import { useLogger } from 'vue-logger-plugin'
import Layer from '@/components/carte/Layer/Layer.vue'
import { removePermalink } from '@/features/permalink.js';

const props = defineProps({
  selectedLayers: {
    type: Object,
    default: () => ({})
  },
  selectedBookmarks: {
    type: Object,
    default: () => ({})
  },
  mapId: {
    type: String,
    default: ''
  }
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
    var properties = {
      name : layer.name,
      service : layer.service || layer.serviceParams.id.split(":")[1], // HACK !
      key : layer.key,
      position : Object.prototype.hasOwnProperty.call(layer, "position") ? layer.position : -1,
      opacity : Object.prototype.hasOwnProperty.call(layer, "opacity") ? layer.opacity : 1,
      visible : Object.prototype.hasOwnProperty.call(layer, "visible") ? layer.visible : true,
      grayscale : Object.prototype.hasOwnProperty.call(layer, "grayscale") ? layer.grayscale : false
    };
    if (Object.prototype.hasOwnProperty.call(layer, "style")) {
      properties.style = layer.style;
    }
    return properties;
  })
});

// liste des informations utiles pour le composant Layer
// Array(Object) : [{url, format, opacity, visibility, ...}]
var bookmarks = computed(() => {
  return toRaw(props.selectedBookmarks).map(bookmark => {
    log.debug(bookmark.name, bookmark.position);
    return {
      position : Object.prototype.hasOwnProperty.call(bookmark, "position") ? bookmark.position : -1,
      opacity : Object.prototype.hasOwnProperty.call(bookmark, "opacity") ? bookmark.opacity : 1,
      visible : Object.prototype.hasOwnProperty.call(bookmark, "visible") ? bookmark.visible : true,
      grayscale : Object.prototype.hasOwnProperty.call(bookmark, "grayscale") ? bookmark.grayscale : false,
      ...bookmark
    };
  })
});

function onLayerMounted(layer, index) {
  var allLayers = [...layers.value, ...bookmarks.value];
  log.debug(`Layer mounted : ${layer.name} (${index} / ${allLayers.length - 1})`);
  if (allLayers.length - 1 === index) {
    setTimeout(() => {
      log.debug(`Layer last : ${layer.name} (${index})`);
      removePermalink();
    });
  }
}

function onLayerUnMounted(layer, index) {
  log.debug(`Layer unmounted : ${layer.name} (${index})`);
}

</script>

<!-- FIXME : doit on trier les couches par position (ordre d'affichage)
car les bookmarks sont ajoutés à la fin de la liste des couches !?
[...layers, ...bookmarks].sort((a, b) => (a.position ?? -1) - (b.position ?? -1)) -->
<template>
  <Layer
    v-for="(layer, index) in [...layers, ...bookmarks].sort((a, b) => (a.position ?? -1) - (b.position ?? -1))"
    :key="layer.key"
    :layer-options="layer"
    :map-id="mapId"
    @mounted="onLayerMounted(layer, index)"
    @unmounted="onLayerUnMounted(layer, index)"
  />
</template>
