<script setup lang="js">
import { useLogger } from 'vue-logger-plugin'
import Layer from '@/components/carte/Layer/Layer.vue'

const props = defineProps({
  selectedLayers: Object,
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
      service : layer.serviceParams.id.split(":")[1],
      key : layer.key,
      opacity : layer.hasOwnProperty("opacity") ? layer.opacity : 1,
      visible : layer.hasOwnProperty("visible") ? layer.visible : true,
      gray : layer.hasOwnProperty("gray") ? layer.gray : true
    }
  })
});

</script>

<template>
    <Layer
      v-for="layer in layers"
      :key="layer.key"
      :layer-options="layer"
      :map-id="mapId" />
</template>
