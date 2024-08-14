<script setup lang="js">

import { useLogger } from 'vue-logger-plugin'
import { useDataStore } from '@/stores/dataStore';

import { Route } from 'geopf-extensions-openlayers'

// FIXME
// l'intégration de ce widget ne fonctionne pas car le constructeur 
// n'utilise pas de shadow dom !

const props = defineProps({
  visibility: Boolean,
  routeOptions: Object
})

const log = useLogger()
const store = useDataStore();

const map = inject('map')
const route = ref(new Route(props.routeOptions))

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
  }
})

onBeforeUpdate(() => {
  if (!props.visibility) {
    map.removeControl(route.value)
  }
})

onUpdated(() => {
  if (props.visibility) {
    map.addControl(route.value)
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