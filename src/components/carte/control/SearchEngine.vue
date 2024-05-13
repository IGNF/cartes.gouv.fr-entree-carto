<script setup lang="js">

import { useLogger } from 'vue-logger-plugin'
import { storeToRefs } from 'pinia'
import { useDataStore } from "@/stores/dataStore"

import { SearchEngine } from 'geoportal-extensions-openlayers'

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
    /** abonnement au widget */
    searchEngine.value.on("searchengine:search:click", onClickSearch);
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

/** 
 * gestionnaire d'evenement sur l'abonnement à la recherche de couche
 */
const onClickSearch = (e) => {
  if (store.isLoaded) {
      log.debug("search", e.suggest, toRaw(getLayerByName.value(e.suggest.name, e.suggest.service)));
  }
}

</script>

<template></template>

<style>
/* Centrage de la barre de recherche avec marge horizontales auto et largeur fixe */
  div[id^="GPsearchEngine-"]{
    position: relative;
    width: 520px;
    margin: 0 auto;
    left: unset;
  }

  /* MODE MOBILE : les boutons sont en dessous de la barre de recherche qui prend toute la largeur */
  @media (max-width: 576px){
    div[id^=GPsearchEngine-]{
      flex-direction: column;
      top: unset;
      left: unset;
      width:100%;
    }
  }
</style>