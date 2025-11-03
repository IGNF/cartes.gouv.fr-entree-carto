<script setup lang="js">

import { useLogger } from 'vue-logger-plugin'
import { useDataStore } from "@/stores/dataStore"

const props = defineProps({})

const log = useLogger()
const storeData = useDataStore()

// INFO
// l'opération est asynchrone, il faut donc attendre que le store soit chargé 
// avant d'initialiser la carte.
const { fetchData } = storeData;
const res = await fetchData();
log.debug("StoreData Component result", res);
</script>

<template>
  <slot v-if="storeData.isLoaded && !storeData.error" />
</template>

<style scoped></style>