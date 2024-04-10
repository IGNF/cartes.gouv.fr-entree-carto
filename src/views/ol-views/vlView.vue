<script setup lang="ts">
import type Map from 'ol/Map'
import View from 'ol/View.js'

const props = defineProps({
  zoom: Number,
  center: Array
})

const map = inject<Map>('map')

const view: View | undefined = new View(props)

onMounted(() => {
  map?.setView(view)
})
</script>

<template>
  <div />
</template>
