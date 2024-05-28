<script setup lang="js">

import { useLogger } from 'vue-logger-plugin'
import { useDataStore } from "@/stores/dataStore"

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
const store = useDataStore()

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
* gestionnaire d'evenement sur l'abonnement à la recherche de couche
*/
const onClickSearch = (e) => {
  var value = store.getLayerByName(e.suggest.name, e.suggest.service);
  var params = store.getLayerParamsByName(e.suggest.name, e.suggest.service);
  value.params = params; // fusion
  log.debug("search", e, value);
  // INFO
  // on reimplemente l'ajout des couches
  // car on préfère utiliser le dataStore 
  // pour configurer la couche à ajouter
  var service = e.suggest.service;
  var name = e.suggest.name;
  var layer = null;
  switch (service) {
    case "WMS":
      layer = new GeoportalWMS({
        layer : name,
        configuration : value
      });
      break;
    case "WMTS":
      layer = new GeoportalWMTS({
        layer : name,
        configuration : value
      });
      break;
    case "TMS":
      // INFO le style par defaut est utilisé !
      layer = new GeoportalMapBox({
        layer : name,
        configuration : value
      });
      break;
    default:
  }
  if (layer) {
    map.addLayer(layer);
  }
}

</script>

<template></template>

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
  }
</style>