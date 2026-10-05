<script setup lang="js">
import { computed, toRaw } from 'vue'
import { useLogger } from 'vue-logger-plugin'
import Layer from '@/components/carte/Layer/Layer.vue'
import { removePermalink } from '@/features/permalink.js';
import { useMapStore } from '@/stores/mapStore';
import { push } from 'notivue'
import t from '@/features/translation';

const props = defineProps({
  selectedLayers: {
    type: Object,
    default: () => ({})
  },
  selectedBookmarks: {
    type: Object,
    default: () => ({})
  },
  mapId: {
    type: String,
    default: ''
  }
})

// INFO
// Evenement "ready" émis lorsque la dernière couche est montée !
const emit = defineEmits(["ready"])

// INFO
// liste des couches à ajouter sur la carte
// Array(Object) : cf. dataStore.getLayerByID(layerId)
const log = useLogger()
const mapStore = useMapStore()

/**
 * Valide les données minimales d'une couche du catalogue
 */
const isValidCatalogLayer = (layer) => {
  // Vérifier que name et service existent
  if (!layer.name) {
    return false;
  }
  
  // Si le service est défini directement, c'est ok
  if (layer.service) {
    return true;
  }
  
  // Sinon, vérifier que serviceParams.id existe et peut être parsé
  if (layer.serviceParams && layer.serviceParams.id) {
    try {
      const service = layer.serviceParams.id.split(":")[1];
      return !!service; // Doit avoir au moins un service après le split
    } catch (e) {
      log.warn("Erreur lors du parsing de serviceParams.id pour la couche", layer.name, e);
      return false;
    }
  }
  
  return false;
};

// liste des informations utiles pour le composant Layer
// Array(Object) : [{name, service, opacity, visible, ...}]
var layers = computed(() => {
  return toRaw(props.selectedLayers)
    .filter(layer => {
      // Filtrer les couches invalides
      if (!isValidCatalogLayer(layer)) {
        log.warn("Couche invalide filtrée", layer.name || layer.key);
        return false;
      }
      return true;
    })
    .map(layer => {
      log.debug(layer.name, layer.position);
      var service = layer.service;
      if (!service && layer.serviceParams && layer.serviceParams.id) {
        try {
          service = layer.serviceParams.id.split(":")[1];
        } catch (e) {
          log.warn("Erreur lors du parsing du service pour", layer.name, e);
          return null;
        }
      }
      
      if (!service) {
        log.warn("Service introuvable pour la couche", layer.name);
        return null;
      }
      
      var properties = {
        name : layer.name,
        service : service,
        key : layer.key,
        position : Object.prototype.hasOwnProperty.call(layer, "position") ? layer.position : -1,
        opacity : Object.prototype.hasOwnProperty.call(layer, "opacity") ? layer.opacity : 1,
        visible : Object.prototype.hasOwnProperty.call(layer, "visible") ? layer.visible : true,
        grayscale : Object.prototype.hasOwnProperty.call(layer, "grayscale") ? layer.grayscale : false
      };
      if (Object.prototype.hasOwnProperty.call(layer, "style")) {
        properties.style = layer.style;
      }
      return properties;
    })
    .filter(props => props !== null); // Filtrer les couches avec erreur de parsing
});

// liste des informations utiles pour le composant Layer
// Array(Object) : [{url, format, opacity, visibility, ...}]
var bookmarks = computed(() => {
  return toRaw(props.selectedBookmarks).map(bookmark => {
    log.debug(bookmark.name, bookmark.position);
    return {
      position : Object.prototype.hasOwnProperty.call(bookmark, "position") ? bookmark.position : -1,
      opacity : Object.prototype.hasOwnProperty.call(bookmark, "opacity") ? bookmark.opacity : 1,
      visible : Object.prototype.hasOwnProperty.call(bookmark, "visible") ? bookmark.visible : true,
      grayscale : Object.prototype.hasOwnProperty.call(bookmark, "grayscale") ? bookmark.grayscale : false,
      ...bookmark
    };
  })
});

function onLayerMounted(layer, index) {
  var allLayers = [...layers.value, ...bookmarks.value].sort((a, b) => (a.position ?? -1) - (b.position ?? -1));
  log.debug(`Layer mounted : ${layer.name} (${index} / ${allLayers.length - 1})`);
  if (allLayers.length - 1 === index) {
    emit("ready"); // dernière couche montée : "ready" !
    setTimeout(() => {
      log.debug(`Layer last : ${layer.name} (${index})`);
      removePermalink();
    });
  }
}

function onLayerUnMounted(layer, index) {
  log.debug(`Layer unmounted : ${layer.name} (${index})`);
}

/**
 * Gère les erreurs lors du chargement d'une couche
 * Retire la couche du localStorage pour éviter qu'elle bloque le site
 */
function onLayerError(layerId, layerName, error) {
  log.warn(`Erreur sur la couche ${layerId} (${layerName}) :`, error);
  // Retirer la couche du store localStorage
  mapStore.removeLayer(layerId);
  push.warning({
    title: "Erreur",
    message: `La couche "${layerName}" a été retirée car une erreur s'est produite lors de son chargement.`
  });
}

</script>

<!-- FIXME : doit on trier les couches par position (ordre d'affichage)
car les bookmarks sont ajoutés à la fin de la liste des couches !?
[...layers, ...bookmarks].sort((a, b) => (a.position ?? -1) - (b.position ?? -1)) -->
<template>
  <Layer
    v-for="(layer, index) in [...layers, ...bookmarks].sort((a, b) => (a.position ?? -1) - (b.position ?? -1))"
    :key="layer.key"
    :layer-options="layer"
    :map-id="mapId"
    @mounted="onLayerMounted(layer, index)"
    @unmounted="onLayerUnMounted(layer, index)"
    @error="onLayerError(layer.key, layer.name, $event)"
  />
</template>
