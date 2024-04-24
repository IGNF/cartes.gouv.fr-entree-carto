<script setup lang="js">

import { useDataStore } from "@/stores/dataStore"


const props = defineProps({})
const store = useDataStore()

// FIXME l'opération est asynchrone, il faut trouver un mécanisme pour
// attendre que le store soit chargé avant d'initialiser la carte.
await store.fetchData()

const layers = computed(() => store.getLayers)
console.log(layers.value) // debug
</script>

<template>
  <!-- TODO mettre en place une patience -->
</template>

<style scoped></style>