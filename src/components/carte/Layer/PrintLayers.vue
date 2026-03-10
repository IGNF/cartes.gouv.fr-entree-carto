<script setup lang="js">
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import TileLayer from 'ol/layer/Tile';
import VectorTile from 'ol/layer/VectorTile';

import { useMapStore } from '@/stores/mapStore';
let mapStore = useMapStore();

const props = defineProps({
  printMapId: {
    type: String,
    default: ''
  }
})

const printMap = inject(props.printMapId);

function cloneTileLayer(layer) {
  return new TileLayer({
    source: layer.getSource(),
    visible: layer.getVisible(),
    opacity: layer.getOpacity(),
    zIndex: layer.getZIndex(),
    minResolution: layer.getMinResolution(),
    maxResolution: layer.getMaxResolution(),
  });
}

function cloneVectorTileLayer(layer) {
  return new VectorTile({
    source: layer.getSource(),
    style: layer.getStyle(),
    visible: layer.getVisible(),
    opacity: layer.getOpacity(),
    zIndex: layer.getZIndex(),
    minResolution: layer.getMinResolution(),
    maxResolution: layer.getMaxResolution(),
    declutter: layer.getDeclutter?.(),
    renderMode: layer.getRenderMode?.(),
  });
}

function cloneVectorLayer(layer) {
  const source = layer.getSource();

  const clonedFeatures =
    source.getFeatures().map(f => f.clone());

  const newSource = new VectorSource({
    features: clonedFeatures
  });

  return new VectorLayer({
    source: newSource,
    style: layer.getStyle(),
    visible: layer.getVisible(),
    opacity: layer.getOpacity(),
    zIndex: layer.getZIndex(),
    minResolution: layer.getMinResolution(),
    maxResolution: layer.getMaxResolution(),
  });
}
function isVectorLayer(layer) {
  const source = layer.getSource?.();
  return source && typeof source.getFeatures === 'function';
}

function isTileLayer(layer) {
  const source = layer.getSource?.();
  return source && typeof source.getTileGrid === 'function';
}

function isVectorTileLayer(layer) {
  const source = layer.getSource && layer.getSource();
  if (!source) return false;

  return typeof source.getTileGrid === 'function' &&
         layer.service == 'TMS';
}

function cloneLayer(layer) {
  if (isVectorTileLayer(layer)) {
    return cloneVectorTileLayer(layer);
  }
  if (isVectorLayer(layer)) {
    return cloneVectorLayer(layer);
  }
  if (isTileLayer(layer)) {
    return cloneTileLayer(layer);
  }
  throw new Error('Type de layer non supporté');
}

onMounted(async () => {
const layers = mapStore.getMap().getLayers();
layers.forEach(layer => {
  let l = cloneLayer(layer)
  printMap.addLayer(l);
});
 await nextTick(); // 👈 attendre que Vue ait fini
  printMap.renderSync();
});


</script>

<template>
  <div />
</template>
