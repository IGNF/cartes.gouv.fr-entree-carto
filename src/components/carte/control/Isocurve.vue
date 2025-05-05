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
const btnExport = ref(new ButtonExport({
  title : "Exporter",
  kind : "secondary",
  download : true,
  name: "Mon iso",
  description: "",
  control: isocurve.value,
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
}))
const btnSave = ref(new ButtonExport({
  title : "Enregistrer",
  kind : "primary",
  download : false,
  control: isocurve.value,
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
    map.addControl(isocurve.value);
    map.addControl(btnExport.value);
    if (import.meta.env.IAM_DISABLE === '1') {
      btnSave.value.getContainer().style.display = "none";
    }
    map.addControl(btnSave.value);
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
    btnExport.value.on("button:clicked", onExportIsocurve);
    btnSave.value.on("button:clicked", onSaveIsocurve);
  }
})

onBeforeUpdate(() => {
  if (!props.visibility) {
    map.removeControl(isocurve.value);
    map.removeControl(btnSave.value);
    map.removeControl(btnExport.value);
  }
})

onUpdated(() => {
  if (props.visibility) {
    map.addControl(isocurve.value);
    map.addControl(btnExport.value);
    if (import.meta.env.IAM_DISABLE === '1') {
      btnSave.value.getContainer().style.display = "none";
    }
    map.addControl(btnSave.value);
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
    btnExport.value.on("button:clicked", onExportIsocurve);
    btnSave.value.on("button:clicked", onSaveIsocurve);
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

/**
 * Gestionnaire d'evenement 
 * 
 * Ecouteur pour l'export d'un calcul isochrone
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
 const onExportIsocurve = (e) => {
  log.debug(e);
}
</script>

<template>
  <!-- TODO ajouter l'emprise du widget pour la gestion des collisions -->
</template>

<style></style>