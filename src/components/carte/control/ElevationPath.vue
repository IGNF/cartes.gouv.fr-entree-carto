<script setup lang="js">
import { useActionButtonEulerian } from '@/composables/actionEulerian.js';
import { useLogger } from 'vue-logger-plugin'
import {
  ElevationPath,
  ButtonExport
} from 'geopf-extensions-openlayers'

const props = defineProps({
  mapId: String,
  visibility: Boolean,
  analytic: Boolean,
  elevationPathOptions: Object
})

const log = useLogger();

const map = inject(props.mapId);
const elevationPath = ref(new ElevationPath(props.elevationPathOptions));
const btnExport = ref(new ButtonExport({
  title : "Exporter",
  kind : "secondary",
  download : true,
  name: "Mon profil",
  description: "",
  control: elevationPath.value,
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
  control: elevationPath.value,
  format : "geojson",
  menu : false,
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
    map.addControl(elevationPath.value);
    if (import.meta.env.IAM_DISABLE === '1') {
      btnSave.value.getContainer().style.display = "none";
    }
    map.addControl(btnExport.value);
    map.addControl(btnSave.value);
    /* abonnement au widget 
    * @fires elevationpath:drawstart
    * @fires elevationpath:drawend
    * @fires elevationpath:compute
    */
    elevationPath.value.on("elevationpath:drawstart", onDrawStart);
    elevationPath.value.on("elevationpath:drawend", onDrawEnd);
    elevationPath.value.on("elevationpath:compute", onCompute);
    btnExport.value.on("button:clicked", onExportElevationPath);
    btnSave.value.on("button:clicked", onSaveElevationPath);
    if (props.analytic) {
      var el = elevationPath.value.element.querySelector("button[id^=GPshowElevationPathPicto-]");
      useActionButtonEulerian(el);
    }
  }
})

onBeforeUpdate(() => {
  if (!props.visibility) {
    map.removeControl(elevationPath.value);
    map.removeControl(btnSave.value);
    map.removeControl(btnExport.value);
  }
})

onUpdated(() => {
  if (props.visibility) {
    map.addControl(elevationPath.value);
    map.addControl(btnExport.value);
    if (import.meta.env.IAM_DISABLE === '1') {
      btnSave.value.getContainer().style.display = "none";
    }
    map.addControl(btnSave.value);
    if (props.analytic) {
      var el = elevationPath.value.element.querySelector("button[id^=GPshowElevationPathPicto-]");
      useActionButtonEulerian(el);
    }
    /* abonnement au widget 
    * @fires elevationpath:drawstart
    * @fires elevationpath:drawend
    * @fires elevationpath:compute
    */
    elevationPath.value.on("elevationpath:drawstart", onDrawStart);
    elevationPath.value.on("elevationpath:drawend", onDrawEnd);
    elevationPath.value.on("elevationpath:compute", onCompute);
    btnExport.value.on("button:clicked", onExportElevationPath);
    btnSave.value.on("button:clicked", onSaveElevationPath);
  }
})

/** 
 * gestionnaire d'evenement sur les abonnements du widget
 * 
 * @description
 * ...
 * 
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
 * Ecouteur pour la sauvegarde d'un calcul de profil altimétrique
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
const onSaveElevationPath = (e) => {
  log.debug(e);
}
/**
 * Gestionnaire d'evenement 
 * 
 * Ecouteur pour l'export d'un calcul de profil altimétrique
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
const onExportElevationPath = (e) => {
  log.debug(e);
}
</script>

<template>
  <!-- TODO ajouter l'emprise du widget pour la gestion des collisions -->
</template>

<style scoped></style>
