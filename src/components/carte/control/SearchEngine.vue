<script setup lang="js">

import { useLogger } from 'vue-logger-plugin';
import { useDataStore } from "@/stores/dataStore";
import { useMapStore } from '@/stores/mapStore';

import {
  toLonLat as toLonLatProjj
} from "ol/proj";

import {
  SearchEngine
} from 'geopf-extensions-openlayers';

const emitter = inject('emitter');

// FIXME
// choisir où placer le tracker Eulerian sur ce widget !

const props = defineProps({
  mapId: String,
  visibility: Boolean,
  analytic: Boolean,
  searchEngineOptions: Object
});

const log = useLogger();

const mapStore = useMapStore();
const dataStore = useDataStore();


const map = inject(props.mapId);
const searchEngine = ref(new SearchEngine(props.searchEngineOptions));

onMounted(() => {
  if (props.visibility) {
    map.addControl(searchEngine.value)
    /** abonnement au widget */
    searchEngine.value.on("searchengine:search:click", onClickSearch);
    searchEngine.value.on("searchengine:autocomplete:click", onClickAutocompletResult);
    searchEngine.value.on("searchengine:geocode:click", onClickGeocodeResult);
    searchEngine.value.on("searchengine:coordinates:click", onClickSeachByCoordinates);
    searchEngine.value.on("searchengine:geolocation:click", onClickSearchGeolocationOpen);
    searchEngine.value.on("searchengine:geolocation:remove", onClickSearchGeolocationRemove);
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

// abonnement
emitter.addEventListener("searchengine:open:displayed", (e) => {
  if (searchEngine.value) {
    var coordinates = toLonLatProjj(e.position);
    var info = `<h6> Ma position </h6> longitude : ${coordinates[0]}<br/> latitude : ${coordinates[1]}`;
    searchEngine.value._setMarker(e.position, info);
  }
});

/**
 * Gestionnaire d'evenement sur l'abonnement
 * à la recherche de couche
 */
const onClickSearch = (e) => {
  var id = dataStore.getLayerIdByName(e.suggest.name, e.suggest.service);
  mapStore.addLayer(id);
  log.debug("onClickSearch", id);
}
const onClickAutocompletResult = (e) => {}
const onClickGeocodeResult = (e) => {}
const onClickSeachByCoordinates = (e) => {}
const onClickSearchGeolocationOpen = (e) => {
  // geolocalisation demandée :
  // on ajoute l'information dans le permalien...
  // on passe par le mapStore
  mapStore.geolocation = e.coordinates.toString();
}
const onClickSearchGeolocationRemove = (e) => {
  // geolocalisation demandée :
  // on enlève l'information dans le permalien...
  // on passe par le mapStore
  mapStore.geolocation = "";
}


</script>

<template>
  <!-- TODO ajouter l'emprise du widget pour la gestion des collisions -->
</template>

<style>
/* Centrage de la barre de recherche avec marge horizontales auto et largeur fixe */
  div[id^="GPsearchEngine-"] {
    position: relative;
    /* FIXME repasser à 480px quand fusion des boutons rech avancée et rech par coords */
    width: 550px;
    margin: 0 auto;
    left: unset;
  }

  /* pas de scrollbar sur les panneaux de recherche avancée */
  form[id^="GPadvancedSearchForm"],
  form[id^="GPcoordinateSearchForm"] {
    max-height: unset;
  }

  /* FIXME l'affichage ne se fait pas comme sur les extensions... Pourquoi ??*/
  dialog[id^=GPadvancedSearchPanel] {
    max-height: 50vh;
    overflow: auto;
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
