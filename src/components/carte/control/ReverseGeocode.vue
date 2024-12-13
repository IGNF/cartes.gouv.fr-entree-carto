<script setup lang="js">

import { useLogger } from 'vue-logger-plugin';
import { useDataStore } from '@/stores/dataStore';
import { useActionButtonEulerian } from '@/composables/actionEulerian.js';

import { ReverseGeocode } from 'geopf-extensions-openlayers';

const props = defineProps({
  mapId: String,
  visibility: Boolean,
  analytic: Boolean,
  reverseGeocodeOptions: Object
})

const log = useLogger();
const store = useDataStore();


const map = inject(props.mapId);
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
    if (props.analytic) {
      var el = reverseGeocode.value.element.querySelector("button[id^=GPshowReverseGeocodingPicto-]");
      useActionButtonEulerian(el);
    }
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
    if (props.analytic) {
      var el = reverseGeocode.value.element.querySelector("button[id^=GPshowReverseGeocodingPicto-]");
      useActionButtonEulerian(el);
    }
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