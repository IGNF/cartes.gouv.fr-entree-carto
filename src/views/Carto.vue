<script setup lang="ts">
import OSM from 'ol/source/OSM.js'
import TileLayer from 'ol/layer/Tile.js'

import Map from '@/components/carte/Map.vue'
import View from '@/components/carte/View.vue'
import Control from '@/components/carte/Control.vue'

import { ControlList } from '@/composables/configuration'

const zoom = 10
const center = [-234814.550892, 4774562.534805]

const layers = [new TileLayer({
  source: new OSM(),
})]

// const controlOptions = defineModel()
const controlOptions = Object.values(ControlList)
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
      :control-options="controlOptions"
    />
  </Map>
</template>
