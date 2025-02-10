<script setup lang="js">

import { useLogger } from 'vue-logger-plugin';
import { useDataStore } from '@/stores/dataStore';
import { useMapStore } from '@/stores/mapStore';
import { useActionButtonEulerian } from '@/composables/actionEulerian.js';

import {
    transformExtent as olTransformExtentProj
} from "ol/proj";

import { LayerSwitcher } from 'geopf-extensions-openlayers';

// lib notification
import { push } from 'notivue';
import t from '@/features/translation';

const props = defineProps({
  mapId: String,
  visibility: Boolean,
  analytic: Boolean,
  layerSwitcherOptions: Object
});

const log = useLogger();
const mapStore = useMapStore();
const dataStore = useDataStore();

const emitter = inject('emitter');
const map = inject(props.mapId);

const layerSwitcher = ref(new LayerSwitcher(props.layerSwitcherOptions));

onMounted(() => {
  if (props.visibility) {
    map.addControl(layerSwitcher.value);
    if (props.analytic) {
      var el = layerSwitcher.value.element.querySelector("button[id^=GPshowLayersListPicto-]");
      useActionButtonEulerian(el);
    }
    /** abonnement au widget */
    layerSwitcher.value.on("layerswitcher:add", onAddLayer);
    layerSwitcher.value.on("layerswitcher:remove", onRemoveLayer);
    layerSwitcher.value.on("layerswitcher:edit", onClickEditLayer);
    layerSwitcher.value.on("layerswitcher:extent", onZoomToExtentLayer);
    layerSwitcher.value.on("layerswitcher:change:opacity", onChangeOpacityLayer);
    layerSwitcher.value.on("layerswitcher:change:visibility", onChangeVisibilityLayer);
    layerSwitcher.value.on("layerswitcher:change:position", onChangePositionLayer);
  }
})

onBeforeUpdate(() => {
  if (!props.visibility) {
    map.removeControl(layerSwitcher.value);
    if (props.analytic) {
      var el = layerSwitcher.value.element.querySelector("button[id^=GPshowLayersListPicto-]");
      useActionButtonEulerian(el);
    }
  }
})

onUpdated(() => {
  if (props.visibility) {
    map.addControl(layerSwitcher.value);
  }
})

/** 
 * Gestionnaires d'evenement sur les abonnements
 * 
 * @description
 * Les couches sont ajoutées par le gestionnaire de couche (extensions).
 * Mais, on s'abonne aux evenements pour y ajouter une action :
 * ex. inscrire la couche dans le permalien (store)
 * 
 * Une couche est issue soit 
 * - du catalogue
 * - d'une donnée utilisateur
 * 
 * Les données utilisateur doivent être enregistrées sur l'espace personnel
 * pour figurer dans le permalien, donc de type 'bookmark' !
 * 
 * L'ID de la couche d'un favori est de la forme : 
 * ex. "bookmark:kml:3fa85f64-5717-4562-b3fc-2c963f66afa3"
 * 
 * Le UUID est utilisé indirectement dans le permalien, on utilise une version 'short'
 * ex. 3fa85f64-5717-4562-b3fc-2c963f66afa3 --> 2c963f66afa3
 */
const onAddLayer = (e) => {
  log.debug("onAddLayer", e);
  var id = null;
  if (e.layer.name && e.layer.service) {
    id = dataStore.getLayerIdByName(e.layer.name, e.layer.service);
    if (id) {
      mapStore.addLayer(id);
    }
  } else {
    var gpId = e.layer.layer.gpResultLayerId;
    if (gpId) {
      id = gpId.split(':').pop();
      if (gpId.startsWith('bookmark')) {
        // ex. "bookmark:kml:3fa85f64-5717-4562-b3fc-2c963f66afa3"
        if (id) {
          mapStore.addBookmark(id);
        }
      }
    }
  }
  log.debug("onAddLayer", id);
  if (id) {
    // notification
    push.success({
      title: t.layerswitcher.title,
      message: t.layerswitcher.add_success
    });
  } else {
    push.warning({
      title: t.layerswitcher.title,
      message: t.layerswitcher.add_failed
    });
  }
}
const onRemoveLayer = (e) => {
  log.debug("onRemoveLayer", e);
  var id = null;
  if (e.layer.name && e.layer.service) {
    id = dataStore.getLayerIdByName(e.layer.name, e.layer.service);
    if (id) {
      mapStore.removeLayer(id);
    }
  } else {
    var gpId = e.layer.layer.gpResultLayerId;
    if (gpId) {
      id = gpId.split(':').pop();
      if (gpId.startsWith('bookmark')) {
        // ex. "bookmark:kml:3fa85f64-5717-4562-b3fc-2c963f66afa3"
        if (id) {
          mapStore.removeBookmark(id);
        }
      }
    }
  }
  log.debug("onRemoveLayer", id);
  if (id) {
    // notification
    push.success({
      title: t.layerswitcher.title,
      message: t.layerswitcher.remove_success
    });
  } else {
    push.warning({
      title: t.layerswitcher.title,
      message: t.layerswitcher.remove_failed
    });
  }
}
const onZoomToExtentLayer = (e) => {
  log.debug("onZoomToExtentLayer", e);
  // INFO
  // on reimplemente le ZoomToExtent
  // au cas où les extensions n'y arrivent pas !?
  if (e.error) {
    var globalConstraints = dataStore.getGlobalConstraintsByName(e.layer.name, e.layer.service);
    if (globalConstraints) {
      var view = map.getView();
      var crsTarget = view.getProjection();
    
      var bbox = [
        globalConstraints.extent.left,
        globalConstraints.extent.bottom,
        globalConstraints.extent.right,
        globalConstraints.extent.top
      ];

      var crsSource = globalConstraints.crs;
      if (!crsSource) {
        crsSource = "EPSG:4326";
      }
                
      var extent = olTransformExtentProj(bbox, crsSource, crsTarget);
      if (extent) {
        view.fit(extent);
      }
    }
  }
}
const onChangeOpacityLayer = (e) => {
  log.debug("onChangeOpacityLayer", e);
  var id = null;
  if (e.layer.name && e.layer.service) {
    id = dataStore.getLayerIdByName(e.layer.name, e.layer.service);
    if (id) {
      mapStore.updateLayerProperty(id, {
        opacity : e.opacity
      });
    }
  } else {
    var gpId = e.layer.layer.gpResultLayerId;
    if (gpId) {
      // ex. "bookmark:kml:3fa85f64-5717-4562-b3fc-2c963f66afa3"
      if (gpId.startsWith('bookmark')) {
        id = gpId.split(':').pop();
        if (id) {
          mapStore.updateBookmarkProperty(id, {
            opacity : e.opacity
          });
        }
      }
    }
  }
}
const onChangeVisibilityLayer = (e) => {
  log.debug("onChangeVisibilityLayer", e);
  var id = null;
  if (e.layer.name && e.layer.service) {
    id = dataStore.getLayerIdByName(e.layer.name, e.layer.service);
    if (id) {
      mapStore.updateLayerProperty(id, {
        visible : e.visibility
      });
    }
  } else {
    var gpId = e.layer.layer.gpResultLayerId;
    if (gpId) {
      // ex. "bookmark:kml:3fa85f64-5717-4562-b3fc-2c963f66afa3"
      if (gpId.startsWith('bookmark')) {
        id = gpId.split(':').pop();
        if (id) {
          mapStore.updateBookmarkProperty(id, {
            visible : e.visibility
          });
        }
      }
    }
  }
}
const onChangePositionLayer = (e) => {
  log.debug("onChangePositionLayer", e);
  // INFO
  // on met à jour les couches du catalogues ou enregistrées dans l'espace personnel
  mapStore.updateLayerPosition(e.layers.reverse().map((layer) => {
    // TODO les couches utilisateur enregistrées !
    if (layer.name && layer.service) {
      return dataStore.getLayerIdByName(layer.name, layer.service);
    } 
  }));
}

/**
 * Gestionnaire d'evenement
 * 
 * Permet d'envoyer un evenement vers l'outil de dessin
 * quand l'on clique sur le bouton d'édition
 * @see Drawing
 * @fires emitter#drawing:edit:clicked
 */
const onClickEditLayer = (e) => {
  log.debug("onClickEditLayer", e);
  // selon le type de données, on envoie une demande au widget
  // ex. pour les croquis, on envoie : "drawing:edit:clicked"
  /**
   * @event 
   */
  emitter.dispatchEvent("drawing:edit:clicked", e);
}
</script>

<template>
  <!-- TODO ajouter l'emprise du widget pour la gestion des collisions -->
</template>

<style>

</style>
