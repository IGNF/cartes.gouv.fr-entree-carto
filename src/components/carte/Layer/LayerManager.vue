<script setup lang="js">
// FIXME c'est juste pour l'exemple car on va ajouter l'extension LayerSwitcher !
// Donc provisoire...
import Layer from '@/components/carte/Layer/Layer.vue'

const props = defineProps({
  layersList: Object
})

// ça me semble inutile ?
var layersConfList = computed(() => {
  return toRaw(props.layersList).map(layer => {
    return {
      name : layer.name,
      service : layer.serviceParams.id.split(":")[1]
    }
  })
});

</script>

<template>
    <Layer
    v-for="layer in layersConfList"
    :layer-options="layer"
    />
</template>
