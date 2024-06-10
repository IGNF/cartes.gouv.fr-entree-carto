<script setup lang="js">

import { 
  GeoportalZoom
} from 'geoportal-extensions-openlayers'

const props = defineProps({
  visibility: Boolean,
  zoomOptions: Object
})

const map = inject('map')
const zoom = ref(new GeoportalZoom(props.zoomOptions))

onMounted(() => {
  if (props.visibility) {
    map.addControl(zoom.value)
  }
})

onBeforeUpdate(() => {
  if (!props.visibility) {
    map.removeControl(zoom.value)
  }
})

onUpdated(() => {
  if (props.visibility) {
    map.addControl(zoom.value)
  }
})
</script>

<template></template>

<style scoped>
  /* TODO style DSFR */
</style>