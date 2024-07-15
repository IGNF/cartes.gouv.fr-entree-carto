<script setup lang="js">
import { Legends } from 'geoportal-extensions-openlayers'

const props = defineProps({
  visibility: Boolean,
  panel: Boolean,
  auto: Boolean,
  info: Boolean,
  draggable: Boolean
})

const map = inject('map')
const legends = ref(new Legends(props))

onMounted(() => {
  if (props.visibility) {
    map.addControl(legends.value)
  }
})

onBeforeUpdate(() => {
  if (props.visibility) {
    map.addControl(legends.value)
  }
  else {
    map.removeControl(legends.value)
  }
})
</script>

<template>
  <!-- TODO ajouter l'emprise du widget pour la gestion des collisions -->
</template>

<style></style>