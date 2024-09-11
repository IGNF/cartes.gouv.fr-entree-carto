<script setup lang="js">

import Attributions from 'ol/control/Attribution'

// FIXME
// - utiliser le widget GeoportalAttribution !
// - tracker Eulerian !?

const props = defineProps({
  visibility: Boolean,
  analytic: Boolean,
  attributionsOptions: Object
})

const map = inject('map')
const attributions = ref(new Attributions(props.attributionsOptions))

onMounted(() => {
  if (props.visibility) {
    map.addControl(attributions.value)
  }
})

onBeforeUpdate(() => {
  if (!props.visibility) {
    map.removeControl(attributions.value)
  }
})

onUpdated(() => {
  if (props.visibility) {
    map.addControl(attributions.value)
  }
})
</script>

<template>
  <!-- TODO ajouter l'emprise du widget pour la gestion des collisions -->
</template>

<style scoped>
  /* TODO style DSFR */
</style>