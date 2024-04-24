<script setup lang="js">

import { useDataStore } from "@/stores/dataStore"
import SearchEngine from 'geoportal-extensions-openlayers/src/packages/Controls/SearchEngine/SearchEngine'

const props = defineProps({
  visibility: Boolean,
  searchEngineOptions: Object
})

const store = useDataStore()

const map = inject('map')
const searchEngine = ref(new SearchEngine(props.searchEngineOptions))

onMounted(() => {
  if (props.visibility) {
    map.addControl(searchEngine.value)
    // abonnement au widget
    searchEngine.value.on("searchengine:search:click", (e) => {
      console.warn("search", e.suggest, store.data);
    });
  }
})

onBeforeUpdate(() => {
  if (!props.visibility) {
    map.removeControl(searchEngine.value)
  }
})

onUpdated(() => {
  if (props.visibility) {
    map.addControl(searchEngine.value)
  }
})
</script>

<template></template>

<style scoped></style>
