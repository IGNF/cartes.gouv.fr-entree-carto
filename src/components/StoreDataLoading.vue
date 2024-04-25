<script setup lang="js">

import { useLogger } from 'vue-logger-plugin'
import { storeToRefs } from 'pinia'
import { useDataStore } from "@/stores/dataStore"

const props = defineProps({})

const log = useLogger()
const store = useDataStore()
const { getLayers } = storeToRefs(store)

// INFO
// l'opération est asynchrone, il faut donc attendre que le store soit chargé 
// avant d'initialiser la carte.
await store.fetchData()

if (store.isLoaded) {
  log.debug(getLayers.value)
}
</script>

<template>
  <!-- TODO mettre en place une patience -->
</template>

<style scoped></style>