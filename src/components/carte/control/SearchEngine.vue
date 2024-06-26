<script setup lang="js">

import { useLogger } from 'vue-logger-plugin'
import { useDataStore } from "@/stores/dataStore"
import { useMapStore } from '@/stores/mapStore';

import {
  SearchEngine,
  LayerMapBox as GeoportalMapBox,
  LayerWMS as GeoportalWMS,
  LayerWMTS as GeoportalWMTS
} from 'geoportal-extensions-openlayers'

const props = defineProps({
  visibility: Boolean,
  searchEngineOptions: Object
})

const log = useLogger()

const mapStore = useMapStore();
const dataStore = useDataStore();

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

onUnmounted(() => {})

/**
 * Gestionnaire d'evenement sur l'abonnement 
 * à la recherche de couche
 */
const onClickSearch = (e) => {
  var id = dataStore.getLayerIdByName(e.suggest.name, e.suggest.service);
  log.debug("onClickSearch", id);
  mapStore.addLayer(id);
}

</script>

<template>
  <!-- TODO ajouter l'emprise du widget pour la gestion des collisions -->
</template>

<style>
/* Centrage de la barre de recherche avec marge horizontales auto et largeur fixe */
  div[id^="GPsearchEngine-"] {
    position: relative;
    width: 520px;
    margin: 0 auto;
    left: unset;
  }

  /* pas de scrollbar sur les panneaux de recherche avancée */
  form[id^="GPadvancedSearchForm"],
  form[id^="GPcoordinateSearchForm"] {
    max-height: unset;
  }

  /* MODE MOBILE : les boutons sont en dessous de la barre de recherche qui prend toute la largeur */
  @media (max-width: 576px){
    div[id^=GPsearchEngine-]{
      top: unset;
      left: unset;
      width: 100%;
    }

    [id^="GPautocompleteResults-"] {
      height: 70vh;
    }
  }
</style>
