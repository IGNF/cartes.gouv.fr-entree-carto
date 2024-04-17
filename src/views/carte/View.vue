<script setup lang="ts">
import type Map from 'ol/Map'
import View from 'ol/View'
import type BaseLayer from 'ol/layer/Tile.js'

const props = defineProps({
  zoom: Number,
  center: Array,
  layers: Array <BaseLayer>
})

const map = inject<Map>('map')
const viewParams = { zoom: props.zoom, center: props.center }
const view: View | undefined = new View(viewParams)

onMounted(() => {
  props.layers.forEach((layer) => {
    map?.addLayer(layer)
  })
  map?.setView(view)
})
</script>

<template>
  <div />
</template>
