<script setup lang="js">

import { useLogger } from 'vue-logger-plugin';
import { useDataStore } from '@/stores/dataStore';
import { useMapStore } from '@/stores/mapStore';
import { useActionButtonEulerian } from '@/composables/actionEulerian.js';

import {
    transformExtent as olTransformExtentProj
} from "ol/proj";

import { LayerSwitcher } from 'geopf-extensions-openlayers';

const props = defineProps({
  mapId: String,
  visibility: Boolean,
  analytic: Boolean,
  layerSwitcherOptions: Object
});

const log = useLogger();
const mapStore = useMapStore();
const dataStore = useDataStore();

const map = inject(props.mapId)
const layerSwitcher = ref(new LayerSwitcher(props.layerSwitcherOptions));

onMounted(() => {
  if (props.visibility) {
    map.addControl(layerSwitcher.value);
    if (props.analytic) {
      var el = layerSwitcher.value.element.querySelector("button[id^=GPshowLayersListPicto-]");
      useActionButtonEulerian(el);
    }
    /** abonnement au widget */
    layerSwitcher.value.on("layerswitcher:add", onAddLayer);
    layerSwitcher.value.on("layerswitcher:remove", onRemoveLayer);
    layerSwitcher.value.on("layerswitcher:extent", onZoomToExtentLayer);
    layerSwitcher.value.on("layerswitcher:change:opacity", onChangeOpacityLayer);
    layerSwitcher.value.on("layerswitcher:change:visibility", onChangeVisibilityLayer);
    layerSwitcher.value.on("layerswitcher:change:position", onChangePositionLayer);
  }
})

onBeforeUpdate(() => {
  if (!props.visibility) {
    map.removeControl(layerSwitcher.value);
    if (props.analytic) {
      var el = layerSwitcher.value.element.querySelector("button[id^=GPshowLayersListPicto-]");
      useActionButtonEulerian(el);
    }
  }
})

onUpdated(() => {
  if (props.visibility) {
    map.addControl(layerSwitcher.value);
  }
})

/** 
 * Gestionnaires d'evenement sur les abonnements
 */
const onAddLayer = (e) => {
  var id = dataStore.getLayerIdByName(e.layer.name, e.layer.service);
  log.debug("onAddLayer", id);
  if (id) {
    mapStore.addLayer(id);
  }
}
const onRemoveLayer = (e) => {
  var id = dataStore.getLayerIdByName(e.layer.name, e.layer.service);
  log.debug("onRemoveLayer", id);
  if (id) {
    mapStore.removeLayer(id);
  }
}
const onZoomToExtentLayer = (e) => {
  log.debug("onZoomToExtentLayer", e);
  // INFO
  // on reimplemente le ZoomToExtent
  // car on préfère utiliser le dataStore 
  // pour le configurer
  if (e.error) {
    var globalConstraints = dataStore.getGlobalConstraintsByName(e.layer.name, e.layer.service);
    if (globalConstraints) {
      var view = map.getView();
      var crsTarget = view.getProjection();
    
      var bbox = [
        globalConstraints.extent.left,
        globalConstraints.extent.bottom,
        globalConstraints.extent.right,
        globalConstraints.extent.top
      ];

      var crsSource = globalConstraints.crs;
      if (!crsSource) {
        crsSource = "EPSG:4326";
      }
                
      var extent = olTransformExtentProj(bbox, crsSource, crsTarget);
      if (extent) {
        view.fit(extent);
      }
    }
  }
}
const onChangeOpacityLayer = (e) => {
  var id = dataStore.getLayerIdByName(e.layer.name, e.layer.service);
  log.debug("onChangeOpacityLayer", e);
  mapStore.updateLayerProperty(id, {
    opacity : e.opacity
  });
}
const onChangeVisibilityLayer = (e) => {
  var id = dataStore.getLayerIdByName(e.layer.name, e.layer.service);
  log.debug("onChangeVisibilityLayer", e);
  mapStore.updateLayerProperty(id, {
    visible : e.visibility
  });
}
const onChangePositionLayer = (e) => {
  log.debug("onChangePositionLayer", e);
  // INFO
  // on met à jour uniquement les couches du catalogues ou enregistrées 
  // dans l'espace personnel (les properties name&service sont renseignées)
  mapStore.updateLayerPosition(e.layers.reverse().map((layer) => {
    if (layer.name && layer.service) {
      return dataStore.getLayerIdByName(layer.name, layer.service);
    } 
  }));
}

</script>

<template>
  <!-- TODO ajouter l'emprise du widget pour la gestion des collisions -->
</template>

<style>

</style>
