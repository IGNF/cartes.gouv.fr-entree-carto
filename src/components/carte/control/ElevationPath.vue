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
const button = ref(new ButtonExport({
  title : "Enregistrer",
  kind : "secondary",
  download : false,
  control: elevationPath.value,
  format : "geojson",
  icons : {
    button : "save"
  }
}));

onMounted(() => {
  if (props.visibility) {
    map.addControl(elevationPath.value);
    map.addControl(button.value);
    /* abonnement au widget 
    * @fires elevationpath:drawstart
    * @fires elevationpath:drawend
    * @fires elevationpath:compute
    */
    elevationPath.value.on("elevationpath:drawstart", onDrawStart);
    elevationPath.value.on("elevationpath:drawend", onDrawEnd);
    elevationPath.value.on("elevationpath:compute", onCompute);
    button.value.on("button:clicked", onSaveElevationPath);
    if (props.analytic) {
      var el = elevationPath.value.element.querySelector("button[id^=GPshowElevationPathPicto-]");
      useActionButtonEulerian(el);
    }
  }
})

onBeforeUpdate(() => {
  if (!props.visibility) {
    map.removeControl(elevationPath.value);
    map.removeControl(button.value);
  }
})

onUpdated(() => {
  if (props.visibility) {
    map.addControl(elevationPath.value);
    map.addControl(button.value);
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
    button.value.on("button:clicked", onSaveElevationPath);
  }
})

/** 
 * gestionnaire d'evenement sur les abonnements
 * 
 * @description
 * ...
 * 
 */
 const onDrawStart = () => {
  log.debug(e);
}
const onDrawEnd = () => {
  log.debug(e);
}
const onCompute = (e) => {
  log.debug(e);
}
const onSaveElevationPath = (e) => {
  log.debug(e);
}
</script>

<template>
  <!-- TODO ajouter l'emprise du widget pour la gestion des collisions -->
</template>

<style scoped></style>
