<script lang="js">
  /**
   * @description
   * ...
   * @listens emitter#layerimport:open:clicked
   */
  export default {
    name: 'LayerImport'
  };
</script>

<script setup lang="js">
import { useActionButtonEulerian } from '@/composables/actionEulerian.js';
import { useLogger } from 'vue-logger-plugin'
import {
  LayerImport
} from 'geopf-extensions-openlayers'

const props = defineProps({
  mapId: String,
  visibility: Boolean,
  analytic: Boolean,
  layerImportOptions: Object
})

const log = useLogger();

const map = inject(props.mapId);
const layerImport = ref(new LayerImport(props.layerImportOptions));

// abonnement sur l'ouverture du controle
const emitter = inject('emitter');
emitter.addEventListener("layerimport:open:clicked", (e) => {
  if (layerImport.value) {
    layerImport.value.setCollapsed(!e.open);
  }
});

onMounted(() => {
  if (props.visibility) {
    map.addControl(layerImport.value);
    if (props.analytic) {
      var el = layerImport.value.element.querySelector("button[id^=GPshowImportPicto-]");
      useActionButtonEulerian(el);
    }
    /** abonnement au widget */
    layerImport.value.on("layerimport:vector:saved", onSaveImportVector);
    layerImport.value.on("layerimport:service:saved", onSaveImportService);
    layerImport.value.on("layerimport:mapbox:saved", onSaveImportMapbox);
    layerImport.value.on("layerimport:compute:saved", onSaveImportCompute);
  }
})

onBeforeUpdate(() => {
  if (!props.visibility) {
    map.removeControl(layerImport.value);
  }
})

onUpdated(() => {
  if (props.visibility) {
    map.addControl(layerImport.value);
    if (props.analytic) {
      var el = layerImport.value.element.querySelector("button[id^=GPshowImportPicto-]");
      useActionButtonEulerian(el);
    }
    /** abonnement au widget */
    layerImport.value.on("layerimport:vector:saved", onSaveImportVector);
    layerImport.value.on("layerimport:service:saved", onSaveImportService);
    layerImport.value.on("layerimport:mapbox:saved", onSaveImportMapbox);
    layerImport.value.on("layerimport:compute:saved", onSaveImportCompute);
  }
})

/** 
 * Gestionnaires d'evenement
 * 
 * @description
 * 
 * Ecouteur pour la sauvegarde automatique d'un import de type :
 * - vecteur
 * - service
 * - mapbox
 * - compute
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
const onSaveImportVector = (e) => {
  log.debug(e);
};
const onSaveImportService = (e) => {
  log.debug(e);
};
const onSaveImportMapbox = (e) => {
  log.debug(e);
};
const onSaveImportCompute = (e) => {
  log.debug(e);
};

</script>

<template>
  <!-- TODO ajouter l'emprise du widget pour la gestion des collisions -->
</template>

<style>
button[id^=GPshowImportPicto-] {
  display: none;
}
dialog[id^=GPcontrolListPanel-] button[id^=GPshowImportPicto-]{
  display: block;
}
</style>
