<script setup lang="js">

import { useLogger } from 'vue-logger-plugin';
import { useMapStore } from '@/stores/mapStore';

import { shallowRef, markRaw } from 'vue';

import {
  toLonLat as toLonLatProj,
} from "ol/proj";

import {
    SearchEngineAdvanced,
    InseeAdvancedSearch,
    LocationAdvancedSearch,
    CoordinateAdvancedSearch,
    ParcelAdvancedSearch
} from 'geopf-extensions-openlayers';

const emitter = inject('emitter');

// FIXME
// choisir où placer le tracker Eulerian sur ce widget !

const props = defineProps({
  mapId: {
    type: String,
    default: ''
  },
  visibility: Boolean,
  analytic: Boolean,
  searchEngineOptions: {
    type: Object,
    default: () => ({})
  }
});

const log = useLogger();
const mapStore = useMapStore();

const map = inject(props.mapId);
const insee = ref(new InseeAdvancedSearch());
const location = ref(new LocationAdvancedSearch());
const coordinates = ref(new CoordinateAdvancedSearch());
const parcels = ref(new ParcelAdvancedSearch());

const advancedSearchEngineOptions = computed(() => {
    return Object.assign({}, props.searchEngineOptions, {advancedSearch : [insee.value, location.value, coordinates.value, parcels.value]})
});

// const searchEngineAdvanced = ref(markRaw(new SearchEngineAdvanced(advancedSearchEngineOptions.value)));
const searchEngineAdvanced = shallowRef(new SearchEngineAdvanced(advancedSearchEngineOptions.value));

onMounted(() => {
  if (props.visibility) {
    map.addControl(searchEngineAdvanced.value);
    /** abonnement au widget */
    searchEngineAdvanced.value.on("searchengine:search:click", onClickSearch);
    searchEngineAdvanced.value.on("searchengine:autocomplete:click", onClickAutocompletResult);
    searchEngineAdvanced.value.on("searchengine:geocode:click", onClickGeocodeResult);
    searchEngineAdvanced.value.on("searchengine:coordinates:click", onClickSeachByCoordinates);
    searchEngineAdvanced.value.on("searchengine:geolocation:click", onClickSearchGeolocationOpen);
    searchEngineAdvanced.value.on("searchengine:geolocation:remove", onClickSearchGeolocationRemove);
  }
})

onBeforeUpdate(() => {
  if (!props.visibility) {
    map.removeControl(searchEngineAdvanced.value);
  }
})

onUpdated(() => {
  if (props.visibility) {
    map.addControl(searchEngineAdvanced.value);
  }
})

/**
 * Gestionnaire d'evenement sur les abonnements
 */

const onClickSearch = (e) => {
  log.debug("SearchEngineAdvanced - onClickSearch", e);
}
const onClickAutocompletResult = (e) => {
  log.debug("SearchEngineAdvanced - onClickAutocompletResult", e);
}
const onClickGeocodeResult = (e) => {
  log.debug("SearchEngineAdvanced - onClickGeocodeResult", e);
}
const onClickSeachByCoordinates = (e) => {
  log.debug("SearchEngineAdvanced - onClickSearchByCoordinates", e);
}
const onClickSearchGeolocationOpen = (e) => {
  log.debug("SearchEngineAdvanced - onClickSearchGeolocationOpen", e);
  // geolocalisation demandée :
  // on ajoute l'information dans le permalien...
  // on passe par le mapStore
  // on passe en geographique
  mapStore.geolocation = toLonLatProj(e.coordinates).toString();
  emitter.emit("searchengine:geolocation:clicked", e.coordinates);
}
const onClickSearchGeolocationRemove = (e) => {
  log.debug("SearchEngineAdvanced - onClickSearchGeolocationRemove", e);
  // geolocalisation demandée :
  // on enlève l'information dans le permalien...
  // on passe par le mapStore
  mapStore.geolocation = "";
  emitter.emit("searchengine:geolocation:removed");
}

</script>

<template>
  <div>
    <!-- TODO ajouter l'emprise du widget pour la gestion des collisions -->
  </div>
</template>

<style>
@media (min-width: 576px){
  div[id^="GPsearchEngine-Advanced"] {
    left: 50px;
  }
}
@media (max-width: 576px){
  div[id^="GPsearchEngine-Advanced"] {
    margin-top: 3px;
    max-width: calc(100% - 16px);
    margin-left: 1px;
  }
}
/* Uniformisation avec les taille de bouton entrée carto */
form.GPSearchBar>button[id^=GPshowSearchEnginePicto-].fr-btn {
    width: 43px;
}
/* Permet de placer le menu déroulant de la barre de recherche par dessus les boutons menu
  côté entrée carto
*/
@media (max-width: 576px) {
.ol-overlaycontainer-stopevent {
  z-index: 1002 !important;
}
}
</style>
