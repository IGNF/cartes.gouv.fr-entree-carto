<script setup lang="js">

import { useLogger } from 'vue-logger-plugin'
import { useDataStore } from '@/stores/dataStore';

import { Isocurve } from 'geoportal-extensions-openlayers'

const props = defineProps({
  visibility: Boolean,
  isocurveOptions: Object
})

const log = useLogger()
const store = useDataStore();

const map = inject('map')
const isocurve = ref(new Isocurve(props.isocurveOptions))

onMounted(() => {
  if (props.visibility) {
    map.addControl(isocurve.value)
    /* abonnement au widget 
    * @fires isocurve:drawstart
    * @fires isocurve:drawend
    * @fires isocurve:compute
    */
    isocurve.value.on("isocurve:drawstart", onDrawStart);
    isocurve.value.on("socurve:drawend", onDrawEnd);
    isocurve.value.on("isocurve:compute", onCompute);
  }
})

onBeforeUpdate(() => {
  if (!props.visibility) {
    map.removeControl(isocurve.value)
  }
})

onUpdated(() => {
  if (props.visibility) {
    map.addControl(isocurve.value)
  }
})

/** 
 * gestionnaire d'evenement sur les abonnements
 */
const onDrawStart = (e) => {
  log.debug(e);
}
const onDrawEnd = (e) => {
  log.debug(e);
}
const onCompute = (e) => {
  log.debug(e);
}
</script>

<template></template>

<style></style>