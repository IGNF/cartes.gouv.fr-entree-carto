<script setup lang="ts">
import OSM from 'ol/source/OSM.js'
import TileLayer from 'ol/layer/Tile.js'
import Map from './carte/Map.vue'
import View from './carte/View.vue'
import Control from './carte/Control.vue'
import MenuControl from './carte/MenuControl.vue'
import { ControlList } from '@/composables/configuration'

const zoom = 10
const center = [-234814.550892, 4774562.534805]

const layers = [new TileLayer({
  source: new OSM(),
})]

// const controlOptions = defineModel()
var controlOptions = Object.values(ControlList);
</script>

<template>
  <!-- <MenuControl
    v-model="controlOptions"
  /> -->
  <Map>
    <View
      :center="center"
      :zoom="zoom"
      :layers="layers"
    />
    <Control
      :controlOptions="controlOptions"
    />
  </Map>
</template>
