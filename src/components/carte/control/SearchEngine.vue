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
  <div />
</template>

<style lang="scss">
@use "@/assets/variables" as *;

.gpf-widget[id^="GPsearchEngine-Advanced"] {
  left: $widget-panel-x - 5; // marge 5 interne
  box-shadow: none;

  .GPSearchBar .GPInputGroup,
  .GPSearchBar .GPInputGroup > input,
  button[id^="GPshowSearchEnginePicto-"].fr-btn {
    height: $widget-btn-size;
  }

  .GPSearchBar .GPInputGroup {
    border-top-right-radius: 0;
  }

  @include min(sm) {
    width: 420px;
  }

  @include max(sm) {
    top: $gap;
    left: $gap - 5; // 5 interne
    max-width: calc(100% - 6px); // 6px un peu magique

    &:has(.GPSearchEngine-advanced-btn[aria-expanded="true"]),
    .GPautoCompleteContainer {
      z-index: 4;
    }
  }
}

// empeche le retrecissement dans un contexte flex
// et fixe la largeur min
.GPsearchInputSubmit {
  flex: 0 0 $widget-btn-size;
}
// centre l'icone
.GPsearchInputSubmit::before {
  margin: 0 auto !important;
}
</style>
