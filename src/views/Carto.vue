<script setup lang="ts">
import OSM from 'ol/source/OSM.js'
import TileLayer from 'ol/layer/Tile.js'

import Map from '@/components/carte/Map.vue'
import View from '@/components/carte/View.vue'
import Control from '@/components/carte/Control.vue'

import { useControls } from '@/composables/controls'
import { useMapStore } from "@/stores/mapStore"

const store = useMapStore()
store.setZoom(12)
store.setCenter([-234814.550892, 4774562.534805])

// TODO enregistrer la liste des couches dans le store & localStorage
// TODO definir la couche par defaut ou les couches utilisateurs (localStorage)
const layers = [
  new TileLayer({
    source: new OSM(),
  })
]

const controlOptions = Object.values(useControls)
</script>

<template>
  <!-- <MenuControl
    v-model="controlOptions"
  /> -->
  <Map>
    <View
      :center="store.getCenter"
      :zoom="store.getZoom"
      :layers="layers"
    />
    <Control
      :control-options="controlOptions"
    />
  </Map>
</template>
