<script setup lang="js">
// FIXME c'est juste pour l'exemple car on va ajouter l'extension LayerSwitcher !
// Donc provisoire...
import Layer from '@/components/carte/Layer/Layer.vue'

const props = defineProps({
  selectedLayers: Object
})

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
