<script setup lang="js">

import { useLogger } from 'vue-logger-plugin';
import { useDataStore } from '@/stores/dataStore';
import { useActionButtonEulerian } from '@/composables/actionEulerian.js';

import { 
  Route,
  ButtonExport 
 } from 'geopf-extensions-openlayers';

const props = defineProps({
  mapId: String,
  visibility: Boolean,
  analytic: Boolean,
  routeOptions: Object
});

const log = useLogger();
const store = useDataStore();


const map = inject(props.mapId);
const route = ref(new Route(props.routeOptions));
const button = ref(new ButtonExport({
  title : "Enregistrer",
  kind : "secondary",
  download : false,
  control: route.value,
  format : "geojson",
  menu : true,
  menuOptions : {
    above : true,
    outside : true,
    selectFormat : false
  },
  direction : "column",
  icons : {
    menu : "",
    button : "save"
  }
}));

onMounted(() => {
  if (props.visibility) {
    map.addControl(route.value);
    map.addControl(button.value);
    /* abonnement au widget 
    * @fires route:drawstart
    * @fires route:drawend
    * @fires route:compute
    */
    route.value.on("route:drawstart", onDrawStart);
    route.value.on("route:drawend", onDrawEnd);
    route.value.on("route:compute", onCompute);
    button.value.on("button:clicked", onSaveRoute);
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
    map.addControl(button.value);
    if (props.analytic) {
      var el = route.value.element.querySelector("button[id^=GPshowRoutePicto-]");
      useActionButtonEulerian(el);
    }
    /* abonnement au widget 
    * @fires route:drawstart
    * @fires route:drawend
    * @fires route:compute
    */
    route.value.on("route:drawstart", onDrawStart);
    route.value.on("route:drawend", onDrawEnd);
    route.value.on("route:compute", onCompute);
    button.value.on("button:clicked", onSaveRoute);
  }
})

/** 
 * gestionnaire d'evenement sur les abonnements du widget
 * @description
 * ...
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
/**
 * Gestionnaire d'evenement 
 * 
 * Ecouteur pour la sauvegarde d'un calcul d'itineraire
 * 
 * @param {Object} e
 * @property {Object} type - event
 * @property {Object} target - instance Export
 * @property {String} content - export data
 * @property {String} name - name
 * @property {String} description - description
 * @property {String} format - format : kml, geojson, ...
 * @property {Object} layer - layer
 */
const onSaveRoute = (e) => {
  log.debug(e);
}
</script>

<template>
  <!-- TODO ajouter l'emprise du widget pour la gestion des collisions -->
</template>

<style></style>