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

</script>

<template>
  <slot v-if="!storeData.loading && !storeData.error"></slot>
</template>

<style scoped></style>