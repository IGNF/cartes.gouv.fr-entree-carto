<script setup lang="js">
import { MeasureAzimuth } from 'geoportal-extensions-openlayers'

const props = defineProps({
  visibility: Boolean,
  measureAzimuthOptions: Object
})

const map = inject('map')
const measureAzimuth = ref(new MeasureAzimuth(props.measureAzimuthOptions))

onMounted(() => {
  if (props.visibility) {
    map.addControl(measureAzimuth.value)
  }
})

onBeforeUpdate(() => {
  if (props.visibility) {
    map.addControl(measureAzimuth.value)
  }
  else {
    map.removeControl(measureAzimuth.value)
  }
})
</script>

<template>
  <!-- TODO ajouter l'emprise du widget pour la gestion des collisions -->
</template>

<style></style>
