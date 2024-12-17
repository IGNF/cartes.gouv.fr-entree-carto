<script setup lang="js">

import { useLogger } from 'vue-logger-plugin'
import { useDataStore } from '@/stores/dataStore';
import { useActionButtonEulerian } from '@/composables/actionEulerian.js';

import { Isocurve } from 'geopf-extensions-openlayers'

const props = defineProps({
  mapId: String,
  visibility: Boolean,
  analytic: Boolean,
  isocurveOptions: Object
})

const log = useLogger()
const store = useDataStore();


const map = inject(props.mapId)
const isocurve = ref(new Isocurve(props.isocurveOptions))

onMounted(() => {
  if (props.visibility) {
    map.addControl(isocurve.value)
    if (props.analytic) {
      var el = isocurve.value.element.querySelector("button[id^=GPshowIsochronPicto-]");
      useActionButtonEulerian(el);
    }
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
    if (props.analytic) {
      var el = isocurve.value.element.querySelector("button[id^=GPshowIsochronPicto-]");
      useActionButtonEulerian(el);
    }
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

<template>
  <!-- TODO ajouter l'emprise du widget pour la gestion des collisions -->
</template>

<style></style>