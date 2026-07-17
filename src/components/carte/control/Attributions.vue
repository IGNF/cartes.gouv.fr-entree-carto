<script setup lang="js">

import Attributions from 'ol/control/Attribution'
import { mainMap } from '@/composables/keys'

// FIXME
// - utiliser le widget GeoportalAttribution !
// - tracker Eulerian !?

const props = defineProps({
  mapId: { type: String, default: mainMap },
  visibility: Boolean,
  analytic: Boolean,
  attributionsOptions: { type: Object, default: () => ({}) }
})


const map = inject(props.mapId)
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
  <div />
</template>
