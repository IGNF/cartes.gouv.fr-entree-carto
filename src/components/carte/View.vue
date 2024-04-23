<script setup lang="js">
import View from 'ol/View'

const props = defineProps({
  zoom : Number,
  center : Array,
  layers : Array
})

const map = inject('map')

const viewParams = { 
  zoom: props.zoom, 
  center: props.center 
}
const view = new View(viewParams)

onMounted(() => {
  if (map) {
    props.layers.forEach((layer) => {
      map.addLayer(layer)
    })
    map.setView(view)
  }
})
</script>

<template>
  <div />
</template>

<style scoped>
</style>