<script setup lang="js">

import { useLogger } from 'vue-logger-plugin';

import { useDataStore } from "@/stores/dataStore";
import { useMapStore } from '@/stores/mapStore';

import {
  toLonLat as toLonLatProj,
  // fromLonLat as fromLonLatProj
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
  mapId: String,
  visibility: Boolean,
  analytic: Boolean,
  searchEngineOptions: Object
});

const log = useLogger();

const mapStore = useMapStore();
const dataStore = useDataStore();


const map = inject(props.mapId);
const insee = ref(new InseeAdvancedSearch());
const location = ref(new LocationAdvancedSearch());
const coordinates = ref(new CoordinateAdvancedSearch());
const parcels = ref(new ParcelAdvancedSearch());

const advancedSearchEngineOptions = computed(() => {
    return Object.assign(props.searchEngineOptions, {advancedSearch : [insee.value, location.value, coordinates.value, parcels.value]})
});

const searchEngineAdvanced = ref(new SearchEngineAdvanced(advancedSearchEngineOptions.value));

onMounted(() => {
  if (props.visibility) {
    map.addControl(searchEngineAdvanced.value)
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
    map.removeControl(searchEngineAdvanced.value)
  }
})

onUpdated(() => {
  if (props.visibility) {
    map.addControl(searchEngineAdvanced.value)
  }
})

onUnmounted(() => {})

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
  // on passe en geographique
  mapStore.geolocation = toLonLatProj(e.coordinates).toString();
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

</style>
