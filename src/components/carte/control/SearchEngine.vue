<script setup lang="js">

import { useLogger } from 'vue-logger-plugin';
import { useMapStore } from '@/stores/mapStore';

import { shallowRef } from 'vue';

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
const insee = shallowRef(new InseeAdvancedSearch({ ...props.searchEngineOptions.advancedSearchOptions, name: 'Code INSEE' }));
const location = shallowRef(new LocationAdvancedSearch({ ...props.searchEngineOptions.advancedSearchOptions, name: 'Lieux et toponymes' }));
const coordinates = shallowRef(new CoordinateAdvancedSearch({ ...props.searchEngineOptions.advancedSearchOptions, name: 'Coordonnées' }));
const parcels = shallowRef(new ParcelAdvancedSearch({ ...props.searchEngineOptions.advancedSearchOptions, name: 'Parcelles cadastrales' }));

const advancedSearchEngineOptions = computed(() => {
    return Object.assign({}, props.searchEngineOptions, {advancedSearch : [insee.value, location.value, coordinates.value, parcels.value]})
});

let searchEngineAdvanced = shallowRef(new SearchEngineAdvanced(advancedSearchEngineOptions.value));

onMounted(() => {
  if (props.visibility) {
    map.addControl(searchEngineAdvanced.value);
    /** abonnement au widget */

    /* événements de recherche non implémentés dans le SearchEngineAdvanced
    searchEngineAdvanced.value.on("searchengine:search:click", onClickSearch);
    searchEngineAdvanced.value.on("searchengine:autocomplete:click", onClickAutocompletResult);
    searchEngineAdvanced.value.on("searchengine:geocode:click", onClickGeocodeResult);
    searchEngineAdvanced.value.on("searchengine:coordinates:click", onClickSeachByCoordinates);
    */
    searchEngineAdvanced.value.on("searchengineadvanced:geolocation:click", onClickSearchGeolocationOpen);
    searchEngineAdvanced.value.on("searchengineadvanced:feature:remove", onClickSearchGeolocationRemove);
    searchEngineAdvanced.value.on("searchengineadvanced:popup:close", onPopupClose);
  }
})

onBeforeUpdate(() => {
  map.removeControl(searchEngineAdvanced.value);
})

onUpdated(() => {
  if (props.visibility) {
    // cree un nouveau searchengine quand les props changent (label)
    searchEngineAdvanced = shallowRef(new SearchEngineAdvanced(advancedSearchEngineOptions.value));
    map.addControl(searchEngineAdvanced.value);
  }
})

// abonnement
emitter.addEventListener("searchengineadvanced:geolocation:displayed", (e) => {
  if (searchEngineAdvanced.value) {
    var coordinates = e.position;
    var info = `<h6> Ma position </h6> longitude : ${coordinates[0]}<br/> latitude : ${coordinates[1]}`;
    // on ne se centre pas sur le marker de geolocalisation car le permalien a déjà un paramètre center
    searchEngineAdvanced.value.createMarker(e.position, info, "geolocate", false);
  }
});

/**
 * Gestionnaire d'evenement sur les abonnements
 */

/* événements de recherche non implémentés dans le SearchEngineAdvanced
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
*/
const onClickSearchGeolocationOpen = (e) => {
  log.debug("SearchEngineAdvanced - onClickSearchGeolocationOpen", e);
  // geolocalisation demandée :
  // on ajoute l'information dans le permalien...
  // on passe par le mapStore
  mapStore.geolocation = e.coordinates.toString();
}

const onClickSearchGeolocationRemove = (e) => {
  log.debug("SearchEngineAdvanced - onClickSearchGeolocationRemove", e);
  // geolocalisation demandée :
  // on enlève l'information dans le permalien...
  // on passe par le mapStore
  if (e.feature.get("origin") === "geolocate") {
    mapStore.geolocation = "";
  }
  // emitter.emit("searchengine:geolocation:removed");
}

const onPopupClose = (e) => {
  log.debug("SearchEngineAdvanced - onPopupClose", e);
  // si la fermeture de la popup ne concerne pas la geolocalisation, on vide le positionnement du localstorage pour ne plus lavoir dans le permalien
  // utile dans le cas où on fait une recherche de lieu alors que le marker de geolocalisation est toujours présent
  if (e.evt && e.evt.result.get("origin") !== "geolocate") {
      mapStore.geolocation = "";
  }
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
