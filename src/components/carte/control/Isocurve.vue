<script setup lang="js">

import { useLogger } from 'vue-logger-plugin'
import { useDataStore } from '@/stores/dataStore';
import { useActionButtonEulerian } from '@/composables/actionEulerian.js';

import { 
  Isocurve,
  ButtonExport 
} from 'geopf-extensions-openlayers'

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
const button = ref(new ButtonExport({
  title : "Enregistrer",
  kind : "secondary",
  download : false,
  control: isocurve.value,
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
    map.addControl(isocurve.value);
    map.addControl(button.value);
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
    button.value.on("button:clicked", onSaveIsocurve);
  }
})

onBeforeUpdate(() => {
  if (!props.visibility) {
    map.removeControl(isocurve.value);
    map.removeControl(button.value);
  }
})

onUpdated(() => {
  if (props.visibility) {
    map.addControl(isocurve.value);
    map.addControl(button.value);
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
    button.value.on("button:clicked", onSaveIsocurve);
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
 * Ecouteur pour la sauvegarde d'un calcul isochrone
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
const onSaveIsocurve = (e) => {
  log.debug(e);
}
</script>

<template>
  <!-- TODO ajouter l'emprise du widget pour la gestion des collisions -->
</template>

<style></style>