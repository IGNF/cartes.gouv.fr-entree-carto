<script setup lang="js">

import { useLogger } from 'vue-logger-plugin'
import { storeToRefs } from 'pinia'
import { useDataStore } from "@/stores/dataStore"
import SearchEngine from 'geoportal-extensions-openlayers/src/packages/Controls/SearchEngine/SearchEngine'

const props = defineProps({
  visibility: Boolean,
  searchEngineOptions: Object
})

const log = useLogger()
const store = useDataStore()
const { getLayerByName } = storeToRefs(store)

const map = inject('map')
const searchEngine = ref(new SearchEngine(props.searchEngineOptions))

onMounted(() => {
  if (props.visibility) {
    map.addControl(searchEngine.value)
    // abonnement au widget
    searchEngine.value.on("searchengine:search:click", (e) => {
      if (store.isLoaded) {
        log.debug("search", e.suggest, getLayerByName.value(e.suggest.name, e.suggest.service));
      }
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
