<script setup lang="js">
import { GeoportalFullScreen } from 'geoportal-extensions-openlayers'

const props = defineProps({
  visibility: Boolean,
  fullscreenOptions: Object
})

const map = inject('map')
const fullscreen = ref(new GeoportalFullScreen(props.fullscreenOptions))

onMounted(() => {
  if (props.visibility) {
    map.addControl(fullscreen.value)
  }
})

onBeforeUpdate(() => {
  if (props.visibility) {
    map.addControl(fullscreen.value)
  }
  else {
    map.removeControl(fullscreen.value)
  }
})
</script>

<template></template>

<style></style>
