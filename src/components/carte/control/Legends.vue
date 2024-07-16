<script setup lang="js">
import { Legends } from 'geoportal-extensions-openlayers'

const props = defineProps({
  visibility: Boolean,
  legendsOptions: Object
})

const map = inject('map')
const legends = ref(new Legends(props.legendsOptions))

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