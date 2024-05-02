<script setup lang="js">
import TileLayer from 'ol/layer/Tile.js'

const props = defineProps({
  layerOptions: Object
})

const map = inject('map')
const layer = ref(new TileLayer(props.layerOptions))

onMounted(() => {
  map?.addLayer(layer.value)
})


onUnmounted(() => {
  map?.removeLayer(layer.value)
})

</script>

<template>
    <div>
    <slot></slot>
  </div>
</template>
