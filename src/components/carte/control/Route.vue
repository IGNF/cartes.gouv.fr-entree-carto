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
const btnExport = ref(new ButtonExport({
  title : "Exporter",
  kind : "secondary",
  download : true,
  name: "Mon itineraire",
  description: "",
  control: route.value,
  menu : true,
  menuOptions : {
    outside: true,
    above: true,
    selectFormat: false,
    labelDesc: false
  },
  direction : "column",
  format : "geojson",
  icons : {
    menu : "",
    button : "export"
  }
}));
const btnSave = ref(new ButtonExport({
  title : "Enregistrer",
  kind : "primary",
  download : false,
  control: route.value,
  format : "geojson",
  menu : false,
  direction : "column",
  icons : {
    menu : "",
    button : "save"
  }
}));

// TODO
// abonnement à l'evenement sur la gestion d'une couche compute
// ex. Route.addEventListener('route:compute:called', (e) => { this.setData(e.data); });

onMounted(() => {
  if (props.visibility) {
    map.addControl(route.value);
    map.addControl(btnExport.value);
    if (import.meta.env.IAM_DISABLE === '1') {
      btnSave.value.getContainer().style.display = "none";
    }
    map.addControl(btnSave.value);
    /* abonnement au widget 
    * @fires route:drawstart
    * @fires route:drawend
    * @fires route:compute
    */
    route.value.on("route:drawstart", onDrawStart);
    route.value.on("route:drawend", onDrawEnd);
    route.value.on("route:compute", onCompute);
    btnExport.value.on("button:clicked", onExportRoute);
    btnSave.value.on("button:clicked", onSaveRoute);
    if (props.analytic) {
      var el = route.value.element.querySelector("button[id^=GPshowRoutePicto-]");
      useActionButtonEulerian(el);
    }
  }
})

onBeforeUpdate(() => {
  if (!props.visibility) {
    map.removeControl(route.value);
    map.removeControl(btnSave.value);
    map.removeControl(btnExport.value);
  }
})

onUpdated(() => {
  if (props.visibility) {
    map.addControl(route.value);
    map.addControl(btnExport.value);
    if (import.meta.env.IAM_DISABLE === '1') {
      btnSave.value.getContainer().style.display = "none";
    }
    map.addControl(btnSave.value);
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
    btnExport.value.on("button:clicked", onExportRoute);
    btnSave.value.on("button:clicked", onSaveRoute);
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
/**
 * Gestionnaire d'evenement 
 * 
 * Ecouteur pour la export d'un calcul d'itineraire
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
 const onExportRoute = (e) => {
  log.debug(e);
}
</script>

<template>
  <!-- TODO ajouter l'emprise du widget pour la gestion des collisions -->
</template>

<style></style>