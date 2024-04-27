<script setup lang="js">

import Attributions from 'ol/control/Attribution'

const props = defineProps({
  visibility: Boolean,
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

<template></template>

<style scoped></style>