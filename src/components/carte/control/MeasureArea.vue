<script setup lang="js">
import { MeasureArea } from 'geopf-extensions-openlayers';

const props = defineProps({
  visibility: Boolean,
  measureAreaOptions: Object
})

const map = inject('map')
const measureArea = ref(new MeasureArea(props.measureAreaOptions))

onMounted(() => {
  if (props.visibility) {
    map.addControl(measureArea.value)
  }
})

onBeforeUpdate(() => {
  if (props.visibility) {
    map.addControl(measureArea.value)
  }
  else {
    map.removeControl(measureArea.value)
  }
})
</script>

<template>
  <!-- TODO ajouter l'emprise du widget pour la gestion des collisions -->
</template>

<style></style>
