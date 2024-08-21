<script setup lang="js">
const props = defineProps({
    layers: Object
})

// Fonds de carte
const baseLayers = computed(() => {
  return Object.values(props.layers)
  .filter((layer) => {
    if (layer.hasOwnProperty("base")
    &&  layer.base)
      return layer
  })
})


</script>

<template>
    <LayerList
    :layers="baseLayers"
    />
</template>