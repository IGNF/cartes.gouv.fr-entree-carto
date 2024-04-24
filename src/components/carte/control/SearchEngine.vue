<script setup lang="js">

import SearchEngine from 'geoportal-extensions-openlayers/src/packages/Controls/SearchEngine/SearchEngine'

const props = defineProps({
  visibility: Boolean,
  searchEngineOptions: Object
})

const map = inject('map')
const searchEngine = ref(new SearchEngine(props.searchEngineOptions))

onMounted(() => {
  if (props.visibility) {
    map.addControl(searchEngine.value)
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
