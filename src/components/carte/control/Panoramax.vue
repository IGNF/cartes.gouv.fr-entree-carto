<script setup lang="js">

import { useLogger } from 'vue-logger-plugin';
import { useDataStore } from '@/stores/dataStore';
import { useMapStore } from '@/stores/mapStore';
import { useActionButtonEulerian } from '@/composables/actionEulerian.js';

import { Panoramax } from 'geopf-extensions-openlayers';

// lib notification
import { push } from 'notivue';
import t from '@/features/translation';

const props = defineProps({
  mapId: {
    type: String,
    default: ''
  },
  visibility: Boolean,
  analytic: Boolean,
  panoramaxOptions: {
    type: Object,
    default: () => ({})
  }
});

const log = useLogger();
const dataStore = useDataStore();
const mapStore = useMapStore();

const map = inject(props.mapId)
const panoramax = ref(new Panoramax(props.panoramaxOptions));

onMounted(() => {
  if (props.visibility) {
    map.addControl(panoramax.value)
    if (props.analytic) {
      var el = panoramax.value.element.querySelector("button[id^=GPshowPanoramaxPicto-]");
      useActionButtonEulerian(el);
    }
    /* abonnement au widget */
  }
})

onBeforeUpdate(() => {
  if (!props.visibility) {
    map.removeControl(panoramax.value);
  }
})

onUpdated(() => {
  if (props.visibility) {
    map.addControl(panoramax.value);
    if (props.analytic) {
      var el = panoramax.value.element.querySelector("button[id^=GPshowPanoramaxPicto-]");
      useActionButtonEulerian(el);
    }
    /* abonnement au widget */
    
  }
})

/** 
 * gestionnaire d'evenement sur les abonnements
 * @description
 * ...
 */

</script>

<template>
  <div />
</template>

<style lang="scss">

</style>
