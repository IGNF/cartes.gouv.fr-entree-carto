<script setup lang="js">

import { useLogger } from 'vue-logger-plugin';
import { useDataStore } from '@/stores/dataStore';

import { ReverseGeocode } from 'geoportal-extensions-openlayers';

const props = defineProps({
  visibility: Boolean,
  reverseGeocodeOptions: Object
})

const log = useLogger();
const store = useDataStore();

const map = inject('map');
const reverseGeocode = ref(new ReverseGeocode(props.reverseGeocodeOptions));

onMounted(() => {
  if (props.visibility) {
    map.addControl(reverseGeocode.value)
    /* abonnement au widget 
    * @fires reversegeocode:compute
    * @fires reversegeocode:onclickresult
    */
    reverseGeocode.value.on("reverseGeocode:onclickresult", onClickResult);
    reverseGeocode.value.on("reverseGeocode:compute", onCompute);
  }
})

onBeforeUpdate(() => {
  if (!props.visibility) {
    map.removeControl(reverseGeocode.value);
  }
})

onUpdated(() => {
  if (props.visibility) {
    map.addControl(reverseGeocode.value);
  }
})

/** 
 * gestionnaire d'evenement sur les abonnements
 */
const onClickResult = (e) => {
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