<script setup lang="ts">
import type Map from 'ol/Map'
import { OverviewMap, ScaleLine } from 'ol/control'
import { SearchEngine } from 'geoportal-extensions-openlayers'
import BaseLayer from 'ol/layer/Base'

const props = defineProps({
  units: String,
  layer: BaseLayer
})

const map = inject<Map>('map')

onMounted(() => {
  const searchengine = new SearchEngine({})
  const scaleLine = new ScaleLine({ units: props.units })
  const overviewMap = new OverviewMap({
    className: 'ol-overviewmap ol-custom-overviewmap',
    layers: [props.layer],
    collapseLabel: '\u00BB',
    label: '\u00AB',
    collapsed: false,
  })
  map?.addControl(searchengine)
  map?.addControl(scaleLine)
  map?.addControl(overviewMap)
})
</script>

<template>
  <div />
</template>

<style>
     #map .ol-custom-overviewmap {
        bottom: 30px;
        left: auto;
        right: 20px;
        top: auto;
      }
</style>
