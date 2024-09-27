<script setup lang="js">

import { useLogger } from 'vue-logger-plugin';
import { useDataStore } from '@/stores/dataStore';
import { useActionButtonEulerian } from '@/composables/actionEulerian.js';

import { Route } from 'geopf-extensions-openlayers';

const props = defineProps({
  visibility: Boolean,
  analytic: Boolean,
  routeOptions: Object
});

const log = useLogger();
const store = useDataStore();

const map = inject('map');
const route = ref(new Route(props.routeOptions));

onMounted(() => {
  if (props.visibility) {
    map.addControl(route.value)
    /* abonnement au widget 
    * @fires route:drawstart
    * @fires route:drawend
    * @fires route:compute
    */
    route.value.on("route:drawstart", onDrawStart);
    route.value.on("route:drawend", onDrawEnd);
    route.value.on("route:compute", onCompute);
    if (props.analytic) {
      var el = route.value.element.querySelector("button[id^=GPshowRoutePicto-]");
      useActionButtonEulerian(el);
    }
  }
})

onBeforeUpdate(() => {
  if (!props.visibility) {
    map.removeControl(route.value);
  }
})

onUpdated(() => {
  if (props.visibility) {
    map.addControl(route.value);
    if (props.analytic) {
      var el = route.value.element.querySelector("button[id^=GPshowRoutePicto-]");
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