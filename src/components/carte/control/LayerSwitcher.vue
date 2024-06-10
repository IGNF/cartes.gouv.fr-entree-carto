<script setup lang="js">

import { useLogger } from 'vue-logger-plugin'
import { useDataStore } from '@/stores/dataStore';

import {
    transformExtent as olTransformExtentProj
} from "ol/proj";

import { LayerSwitcher } from 'geoportal-extensions-openlayers'

const props = defineProps({
  visibility: Boolean,
  layerSwitcherOptions: Object
})

const log = useLogger()
const store = useDataStore();

const map = inject('map')
const layerSwitcher = ref(new LayerSwitcher(props.layerSwitcherOptions))

onMounted(() => {
  if (props.visibility) {
    map.addControl(layerSwitcher.value)
    /** abonnement au widget */
    layerSwitcher.value.on("layerswitcher:add", onAddLayer);
    layerSwitcher.value.on("layerswitcher:remove", onRemoveLayer);
    layerSwitcher.value.on("layerswitcher:extent", onZoomToExtentLayer);
    layerSwitcher.value.on("layerswitcher:change:opacity", onChangeOpacityLayer);
    layerSwitcher.value.on("layerswitcher:change:visibility", onChangeVisibilityLayer);
  }
})

onBeforeUpdate(() => {
  if (!props.visibility) {
    map.removeControl(layerSwitcher.value)
  }
})

onUpdated(() => {
  if (props.visibility) {
    map.addControl(layerSwitcher.value)
  }
})

/** 
 * gestionnaire d'evenement sur les abonnements
 */
const onAddLayer = (e) => {
  log.debug("layer", e);
}
const onRemoveLayer = (e) => {
  log.debug("layer", e);
}
const onZoomToExtentLayer = (e) => {
  log.debug("layer", e);
  // INFO
  // on reimplemente le ZoomToExtent
  // car on préfère utiliser le dataStore 
  // pour le configurer
  if (e.error) {
    var globalConstraints = store.getGlobalConstraintsByName(e.layer.name, e.layer.service);
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
  log.debug("layer", e);
}
const onChangeVisibilityLayer = (e) => {
  log.debug("layer", e);
}
</script>

<template></template>

<style>
  div[id^="GPlayerSwitcher-"] {
    top: 85px;
    right: 50px;
  }
</style>