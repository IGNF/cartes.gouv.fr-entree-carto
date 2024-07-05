<script setup lang="js">
import { MeasureLength } from 'geoportal-extensions-openlayers'

const props = defineProps({
  visibility: Boolean,
  measureLengthOptions: Object
})

const map = inject('map')
const measureLength = ref(new MeasureLength(props.measureLengthOptions))

onMounted(() => {
  if (props.visibility) {
    map.addControl(measureLength.value)
  }
})

onBeforeUpdate(() => {
  if (props.visibility) {
    map.addControl(measureLength.value)
  }
  else {
    map.removeControl(measureLength.value)
  }
})
</script>

<template>
  <!-- TODO ajouter l'emprise du widget pour la gestion des collisions -->
</template>

<style></style>
