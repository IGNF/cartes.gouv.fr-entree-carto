<script setup lang="js">
// FIXME c'est juste pour l'exemple car on va ajouter l'extension LayerSwitcher !
// Donc provisoire...
import Layer from '@/components/carte/Layer/Layer.vue'
import { resolutions } from '@/composables/layers'
import WMTS from 'ol/source/WMTS.js';
import WMTSTileGrid from 'ol/tilegrid/WMTS';

const props = defineProps({
  layersList: Object
})
var layersConfList = computed(() => {return toRaw(props.layersList).map(layername => addWMTSLayer(layername))});

function addWMTSLayer(layer) {
  if (layer && Object.keys(layer).length) {
    const startRes = Object.keys(layer.wmtsOptions.tileMatrixSetLimits)[0]
    const endRes = Object.keys(layer.wmtsOptions.tileMatrixSetLimits).slice(-1)
    const sourceOptions = {
    url: 'https://wmts.geopf.fr/wmts',
    layer: layer.name,
    matrixSet: layer.wmtsOptions.tileMatrixSetLink,
    projection: layer.defaultProjection,
    format: layer.formats[0].name,
    style: layer.styles[0].name,
    tileGrid : new WMTSTileGrid({
                    origin: [-20037508,20037508], // topLeftCorner
                    resolutions: resolutions.slice(startRes, endRes), // résolutions
                    matrixIds: Object.keys(layer.wmtsOptions.tileMatrixSetLimits) // ids des TileMatrix
    })
  };
  return {
        source : new WMTS(sourceOptions),
        opacity: 1

    }
  }
  else return {}
}

</script>

<template>
    <Layer
    v-for="layer in layersConfList"
    :layer-options="layer"
    />
</template>
