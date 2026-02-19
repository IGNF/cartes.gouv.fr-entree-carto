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
  mapId: {
    type: String,
    required: true
  },
  visibility: Boolean,
  analytic: Boolean,
  layerSwitcherOptions: {
    type: Object,
    default: () => ({})
  }
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
    layerSwitcher.value.on("layerswitcher:change:grayscale", onChangeGrayScaleLayer);
    layerSwitcher.value.on("layerswitcher:change:style", onChangeStyleMapboxLayer);
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
 * - d'une donnée de l'espace personnel
 * - d'une donnée quelconque
 * 
 * Les données utilisateur doivent être enregistrées sur l'espace personnel
 * pour figurer dans le permalien, donc de type 'bookmark' !
 * 
 * L'ID de la couche d'un favori est de la forme : 
 * ex. layer.gpResultLayerId = "bookmark:drawing-kml:3fa85f64-5717-4562-b3fc-2c963f66afa3"
 * 
 * Le UUID est utilisé indirectement dans le permalien, on utilise une version 'short'
 * ex. 3fa85f64-5717-4562-b3fc-2c963f66afa3 --> 2c963f66afa3
 * 
 * On garde un lien entre la couche et le gestionnaire de couche en y stockant le container
 * DOM dans l'objet layer natif d'openlayers :
 * ex. layer.gpResultLayerDiv = '<div id=GPlayerSwitcher_ID_2-2 ...'
 * 
 */
const onAddLayer = (e) => {
  log.debug("onAddLayer", e);
  var lyr = e.layer;
  var id = null;
  // Données issues du catalogue
  if (lyr.name && lyr.service) {
    id = dataStore.getLayerIdByName(lyr.name, lyr.service);
    // on ajoute la position de la couche dans le store
    log.debug(lyr.name, "| position", lyr.layer.getZIndex());
    mapStore.updateLayerProperty(id, {
      position : lyr.layer.getZIndex()
    });
    // cas du TMS
    if (lyr.service === "TMS") {
      // TODO
      // on ajoute le style de la couche par défaut
      var name = lyr.layer.styleName;
      var url = lyr.layer.styleUrl;
      log.debug("TMS", name, url);
      if (name && url) {
        mapStore.updateLayerProperty(id, {
          style : name
        });
      }
    }
  } else {
    // Données issues d'un widget
    // ex. drawing, layerimport, ...
    var gpId = lyr.layer.gpResultLayerId;
    id = gpId;
    if (gpId) {
      // on sauvegarde un lien entre le layer natif / le widget layerswitcher
      lyr.layer.gpResultLayerDiv = lyr.div;
      if (gpId.startsWith('bookmark')) {
        // on utilise le uuid pour les données utilisateurs !
        // ex. "bookmark:drawing-kml:3fa85f64-5717-4562-b3fc-2c963f66afa3"
        id = gpId.split(':').pop();
        log.debug(id, "| position", lyr.layer.getZIndex());
        mapStore.updateBookmarkPropertyByID(id, {
          p : lyr.layer.getZIndex() // position
        });
      }
    }
  }

  log.debug("onAddLayer", id);
  // var permalink = lyr.layer.get("permalink") || false;
  if (id) {
    if (mapStore.isPermalink()) {
      // on ne notifie pas l'ajout d'une couche du permalien
      return;
    }
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
  var lyr = e.layer;
  var id = null;
  // Données issues du catalogue
  if (lyr.name && lyr.service) {
    id = dataStore.getLayerIdByName(lyr.name, lyr.service);
    if (id) {
      mapStore.removeLayer(id);
    }
  } else {
    var gpId = lyr.layer.gpResultLayerId;
    if (gpId) {
      id = gpId.split(':').pop();
      if (gpId.startsWith('bookmark')) {
        // ex. "bookmark:import-kml:3fa85f64-5717-4562-b3fc-2c963f66afa3"
        if (id) {
          // on supprime le lien dans le store
          mapStore.removeBookmarkByID(id);
        }
      }
    }
  }

  // INFO
  // on met à jour la position des couches dans le store
  // on a la liste des couches natives restantes
  // on ne traite que les couches du catalogue (name & service properties) 
  // et les données personnelles (determiner bookmark id)
  var layers = e.target._layersOrder.reverse(); // on inverse la liste pour que la position soit cohérente avec l'ordre d'affichage (top / bottom)
  if (layers) {
    for (let index = 0; index < layers.length; index++) {
      const l = layers[index];
      if (l.layer.name && l.layer.service) {
          id = dataStore.getLayerIdByName(l.layer.name, l.layer.service);
          if (id) {
            mapStore.updateLayerProperty(id, {
              position : l.layer.getZIndex()
            });
          }
        } else {
          var gpId = l.layer.gpResultLayerId;
          if (gpId) {
            // ex. "bookmark:drawing-kml:3fa85f64-5717-4562-b3fc-2c963f66afa3"
            if (gpId.startsWith('bookmark')) {
              id = gpId.split(':').pop();
              if (id) {
                mapStore.updateBookmarkPropertyByID(id, {
                  p : l.layer.getZIndex() // position
                });
              }
            }
          }
        }
    }
  }
  log.debug("onRemoveLayer", id);
  if (id) {
    if (mapStore.isPermalink()) {
      // on ne notifie pas la suppression d'une couche du permalien
      return;
    }
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
  var lyr = e.layer;
  // INFO
  // on reimplemente le ZoomToExtent
  // au cas où les extensions n'y arrivent pas !?
  if (e.error) {
    var globalConstraints = dataStore.getGlobalConstraintsByName(lyr.name, lyr.service);
    if (globalConstraints) {
      var view = map.getView();
      var crsTarget = view.getProjection();
    
      var bbox = [
        globalConstraints.extent.left,
        globalConstraints.extent.bottom,
        globalConstraints.extent.right,
        globalConstraints.extent.top
      ];

      var crsSource = globalConstraints.projection;
      // par défaut, les projections devraient être en Geographique
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
  var lyr = e.layer;
  var id = null;
  if (lyr.name && lyr.service) {
    id = dataStore.getLayerIdByName(lyr.name, lyr.service);
    if (id) {
      mapStore.updateLayerProperty(id, {
        opacity : e.opacity
      });
    }
  } else {
    var gpId = lyr.layer.gpResultLayerId;
    if (gpId) {
      // ex. "bookmark:drawing-kml:3fa85f64-5717-4562-b3fc-2c963f66afa3"
      if (gpId.startsWith('bookmark')) {
        id = gpId.split(':').pop();
        if (id) {
          mapStore.updateBookmarkPropertyByID(id, {
            o : e.opacity // opacity
          });
        }
      }
    }
  }
}
const onChangeVisibilityLayer = (e) => {
  log.debug("onChangeVisibilityLayer", e);
  var lyr = e.layer;
  var id = null;
  if (lyr.name && lyr.service) {
    id = dataStore.getLayerIdByName(lyr.name, lyr.service);
    if (id) {
      mapStore.updateLayerProperty(id, {
        visible : e.visibility
      });
    }
  } else {
    var gpId = lyr.layer.gpResultLayerId;
    if (gpId) {
      // ex. "bookmark:drawing-kml:3fa85f64-5717-4562-b3fc-2c963f66afa3"
      if (gpId.startsWith('bookmark')) {
        id = gpId.split(':').pop();
        if (id) {
          mapStore.updateBookmarkPropertyByID(id, {
            v : e.visibility // visible
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
  // on inverse la liste des couches pour que la position soit cohérente avec l'ordre d'affichage (top / bottom)
  var layers = e.layers.reverse(); // on inverse la liste pour que la position soit cohérente avec l'ordre d'affichage (top / bottom)
  for (let index = 0; index < layers.length; index++) {
    const l = layers[index];
      if (l.name && l.service) {
        var id = dataStore.getLayerIdByName(l.name, l.service);
        if (id) {
          log.debug(l.name, "| position", index + 1);
          mapStore.updateLayerProperty(id, {
            position : index + 1 // position
          });
        }
      } else {
        var gpId = l.layer.gpResultLayerId;
        if (gpId) {
          // ex. "bookmark:drawing-kml:3fa85f64-5717-4562-b3fc-2c963f66afa3"
          if (gpId.startsWith('bookmark')) {
            var id = gpId.split(':').pop();
            if (id) {
              log.debug(id, "| position", index + 1);
              mapStore.updateBookmarkPropertyByID(id, {
                p : index + 1 // position
              });
            }
          }
        }
      }
    
  }
}
const onChangeGrayScaleLayer = (e) => {
  log.debug("onChangeGrayScaleLayer", e);
  var lyr = e.layer;
  var id = null;
  if (lyr.name && lyr.service) {
    id = dataStore.getLayerIdByName(lyr.name, lyr.service);
    if (id) {
      mapStore.updateLayerProperty(id, {
        grayscale : e.grayscale || false
      });
    }
  } else {
    var gpId = lyr.layer.gpResultLayerId;
    if (gpId) {
      // ex. "bookmark:drawing-kml:3fa85f64-5717-4562-b3fc-2c963f66afa3"
      if (gpId.startsWith('bookmark')) {
        id = gpId.split(':').pop();
        if (id) {
          mapStore.updateBookmarkPropertyByID(id, {
            g : e.grayscale || false // grayscale
          });
        }
      }
    }
  }
}
const onChangeStyleMapboxLayer = (e) => {
  log.debug("onChangeStyleMapboxLayer", e);
  if (e.layer.name && e.layer.service) {
    var id = dataStore.getLayerIdByName(e.layer.name, e.layer.service);
    var name = e.name;
    var url = e.url;
    log.debug("TMS", name, url);
    if (name && url) {
      // TODO
      // on ajoute le style de la couche par défaut
      mapStore.updateLayerProperty(id, {
        style : name
      });
    }
  }
}

/**
 * Gestionnaire d'evenement
 * 
 * Permet d'envoyer un evenement vers l'outil de dessin
 * quand l'on clique sur le bouton d'édition
 * @see Drawing
 * @fires emitter#vector:edit:clicked
 * @fires emitter#compute-route:edit:clicked
 * @fires emitter#compute-iso:edit:clicked
 * @fires emitter#compute-profil:edit:clicked
 * @todo Edition des styles mapbox
 */
const onClickEditLayer = (e) => {
  log.debug("onClickEditLayer", e);

  // INFO
  // selon le type de données, on envoie une demande au widget
  // ex. pour les croquis, on envoie : "vector:edit:clicked"
  // la couche nous fournit une information utile : 
  //   ex. gpResultLayerId = drawing | layerimport:(KML|GEOJSON...)
  // mais, attention dès que le dessin est enregistré, l'id est modifié :
  //  ex. gpResultLayerId = bookmark:drawing-kml:UUID
  
  if (e.layer.gpResultLayerId) {
    var gpId = e.layer.gpResultLayerId.toLowerCase();
    if (gpId) {
      // on liste tous les cas de figures possibles :
      // - vecteur --> widget Drawing
      // - compute --> widget Isocurve ou Route
      // - mapbox  --> TODO
      // - service --> TODO
      if (gpId.toLowerCase().includes("drawing") || 
        gpId.toLowerCase().includes("layerimport:kml") ||
        gpId.toLowerCase().includes("layerimport:gpx") ||
        gpId.toLowerCase().includes("layerimport:geojson") || 
        gpId.toLowerCase().includes("bookmark:drawing-kml") || 
        gpId.toLowerCase().includes("bookmark:import-kml") ||
        gpId.toLowerCase().includes("bookmark:import-gpx") ||
        gpId.toLowerCase().includes("bookmark:import-geojson")) {
        
        // on active le controle
        mapStore.addControl("Drawing");

        // solution de contournement...
        setTimeout(function() {
          /**
           * @event 
           * pour l'édition d'un drawing ou un import vecteur
           */
          emitter.dispatchEvent("vector:edit:clicked", e);
        }, 0);
        return;
      }
      // on liste tous les cas de figures possibles pour un compute à éditer
      if (gpId.toLowerCase().includes("bookmark:compute-route") || 
          (gpId.toLowerCase().includes("bookmark:compute") && e.layer.get("control") === "route") ||
          gpId.toLowerCase().includes("compute:pieton$ogc:openls;itineraire") ||
          gpId.toLowerCase().includes("compute:voiture$ogc:openls;itineraire") ||
          (gpId.toLowerCase().includes("layerimport:compute") && e.layer.get("control") === "route")
        ) {

        // on active le controle
        mapStore.addControl("Route");

        setTimeout(function() {
          /**
           * @event 
           * pour l'édition d'un calcul d'itineraire
           */
          emitter.dispatchEvent("compute-route:edit:clicked", e);
        }, 0);
        return;
      }
      // on liste tous les cas de figures possibles pour un compute à éditer
      if (gpId.toLowerCase().includes("bookmark:compute-isocurve") || 
          (gpId.toLowerCase().includes("bookmark:compute") && e.layer.get("control") === "isocurve") ||
          gpId.toLowerCase().includes("compute:pieton$geoportail:gpp:isocurve") ||
          gpId.toLowerCase().includes("compute:voiture$geoportail:gpp:isocurve")||
          (gpId.toLowerCase().includes("layerimport:compute") && e.layer.get("control") === "isocurve")) {

        // on active le controle
        mapStore.addControl("Isocurve");

        setTimeout(function() {
          /**
           * @event 
           * pour l'édition d'un calcul isochrone
           */
          emitter.dispatchEvent("compute-isocurve:edit:clicked", e);
        }, 0);
        return;
      }
      // on liste tous les cas de figures possibles pour un compute à éditer
      if (gpId.toLowerCase().includes("bookmark:compute-profil") || 
          (gpId.toLowerCase().includes("bookmark:compute") && e.layer.get("control") === "elevationpath") ||
          gpId.toLowerCase().includes("measure:profil") ||
          (gpId.toLowerCase().includes("layerimport:compute") && e.layer.get("control") === "elevationpath")) {

        // on active le controle
        mapStore.addControl("ElevationPath");

        setTimeout(function() {
          /**
           * @event 
           * pour l'édition d'un calcul de profil
           */
          emitter.dispatchEvent("compute-profil:edit:clicked", e);
        }, 0);
        return;
      }
    }
  }
  push.warning({
    title: t.layerswitcher.title,
    message: t.layerswitcher.failed_not_yet_implemented
  });
  
}
</script>

<template>
  <div>
    <!-- TODO ajouter l'emprise du widget pour la gestion des collisions -->
  </div>
</template>

<style>
button[id^="GPshowLayersListPicto-"] {
  border-radius: 4px !important;
}
</style>
