<script setup lang="ts">
import type Map from 'ol/Map'
import View from 'ol/View'
import {SearchEngine} from "geoportal-extensions-openlayers"


const props = defineProps({
  zoom: Number,
  center: Array
})

const map = inject<Map>('map')

const view: View | undefined = new View(props)

onMounted(() => {
  map?.setView(view)
  var searchengine = new SearchEngine({});
  map?.addControl(searchengine)
})
</script>

<template>
  <div></div>
</template>

