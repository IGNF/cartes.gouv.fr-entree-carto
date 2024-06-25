<script setup lang="js">
import { useLogger } from 'vue-logger-plugin'
import Layer from '@/components/carte/Layer/Layer.vue'

const props = defineProps({
  selectedLayers: Object
})

// INFO
// liste des couches à ajouter sur la carte
// Array(Object) : cf. dataStore.getLayerByID(layerId)
const log = useLogger()
log.debug(props.selectedLayers);

// liste des informations utiles pour le composant Layer
// Array(Object) : [{name, service}]
var layers = computed(() => {
  return toRaw(props.selectedLayers).map(layer => {
    return {
      name : layer.name,
      service : layer.serviceParams.id.split(":")[1]
    }
  })
});

</script>

<template>
    <Layer
      v-for="layer in layers"
      :layer-options="layer" />
</template>
