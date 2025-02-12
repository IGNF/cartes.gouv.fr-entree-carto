<script setup lang="js">
import { useActionButtonEulerian } from '@/composables/actionEulerian';
import { useLogger } from 'vue-logger-plugin';
import { useMapStore } from '@/stores/mapStore';

import { 
  Drawing,
  ButtonExport
} from 'geopf-extensions-openlayers';

// lib notification
import { push } from 'notivue';
import t from '@/features/translation';

const emitter = inject('emitter');
var service = inject('services');

const mapStore = useMapStore();
const log = useLogger();

const props = defineProps({
  mapId: String,
  visibility: Boolean,
  analytic: Boolean,
  drawingOptions: Object
});

const map = inject(props.mapId)
const drawing = ref(new Drawing(props.drawingOptions));
// bouton d'enregistrement du croquis avec un menu
const btnSave = ref(new ButtonExport({
  title : "Enregistrer",
  kind : "primary",
  download : false,
  name: "Mon croquis",
  description: "Saisie d'un croquis",
  control: drawing.value,
  menu : true,
  menuOptions : {
    above : true,
    outside : true,
    selectFormat : false
  },
  direction : "column",
  format : "kml",
  icons : {
    menu : "",
    button : "save"
  }
}));

onMounted(() => {
  if (props.visibility) {
    map.addControl(drawing.value);
    map.addControl(btnSave.value);
    if (props.analytic) {
      var el = drawing.value.element.querySelector("button[id^=GPshowDrawingPicto-]");
      useActionButtonEulerian(el);
    }
    /** abonnement au widget */
    btnSave.value.on("button:clicked", onSaveDrawing);
    drawing.value.on("change:collapsed", onToggleShowDrawing);
  }
})

onBeforeUpdate(() => {
  if (props.visibility) {
    map.addControl(drawing.value);
    map.addControl(btnSave.value);
    if (props.analytic) {
      var el = drawing.value.element.querySelector("button[id^=GPshowDrawingPicto-]");
      useActionButtonEulerian(el);
    }
    /** abonnement au widget */
    btnSave.value.on("button:clicked", onSaveDrawing);
    drawing.value.on("change:collapsed",onToggleShowDrawing);
  }
  else {
    map.removeControl(btnSave.value);
    map.removeControl(drawing.value);
  }
})

/** 
 * Gestionnaire d'evenement : abonnement sur "drawing:edit:clicked"
 * 
 * Reassocier la couche et l'outil de dessin
 * via le bouton d'edition du gestionnaire de couche
 * (un clic sur l'edition renvoie un event avec la couche associée)
 * @see LayerSwitcher
 */
emitter.addEventListener("drawing:edit:clicked", (e) => {
  if (drawing.value) {
    drawing.value.setCollapsed(false);
    drawing.value.setLayer(e.layer);
  }
});

/**
 * Gestionnaire d'evenement 
 * 
 * Permet la dissociation de la couche 
 * et l'outil lors de la fermeture du controle
 */
const onToggleShowDrawing = (e) => {
  log.debug(e);
  if (e.target.collapsed) {
    // dissociation de la couche du widget 
    // pour permettre une autre saisie dans 
    // une autre couche
    drawing.value.setLayer();
  }
}

/** 
 * Gestionnaire d'evenement
 * 
 * Ecouteur pour la sauvegarde d'un croquis
 * - enregistrement d'un nouveau croquis
 * - mise à jour du croquis s'il existe déjà
 * 
 * Actions :
 * - ajouter le croquis dans le permalien
 * - emettre un event pour les favoris
 * - mettre à jour l'ID de la couche : gpResultLayerId
 * - mettre à jour le titre du gestionnaire de couche : gpResultLayerDiv
 * - notifier l'utilisateur
 * 
 * @fires emitter#document:saved
 * @param {Object} e
 * @property {Object} type - event
 * @property {Object} target - instance Export
 * @property {String} content - export data
 * @property {String} name - name
 * @property {String} description - description
 * @property {String} format - format : kml, geojson, ...
 * @property {Object} layer - layer
 */
const onSaveDrawing = (e) => {
  log.debug(e);
  if (!service.authenticated) {
    push.warning({
      title: t.auth.title,
      message: t.auth.not_authentificated
    });
    return; // pas plus loin...
  }

  var data = {
    layer : e.layer,
    content : e.content,
    name : e.name,
    description : e.description,
    format : e.format.toLowerCase(),
    type : "drawing"
  };

  service.setDocument(data)
  .then((o) => {
    // mise à jour du permalien
    mapStore.addBookmark(o.uuid);
    return o;
  })
  .then((o) => {
    // emettre un event pour prévenir l'ajout d'un croquis
    // au composant des favoris
    emitter.dispatchEvent("document:saved", {
      uuid : o.uuid,
      action : o.action // added, updated, deleted
    });
    return o;
  })
  .then((o) => {
    // mise à jour de l'id interne de la couche
    if (data.layer.gpResultLayerId) {
      data.layer.gpResultLayerId = `bookmark:${data.format.toLowerCase()}:${o.uuid}`;
    }
  })
  .then(() => {
    // mise à jour de l'entrée du gestionnaire de couche
    if (data.layer.gpResultLayerDiv) {
      var div = data.layer.gpResultLayerDiv.querySelector("label[id^=GPname_ID_]");
      if (div) {
        div.innerHTML = data.name;
        div.title = data.description;
      }  
    }
  })
  .then(() => {
    // notification
    push.success({
      title: t.drawing.title,
      message: t.drawing.save_success
    });
  })
  .catch((error) => {
    console.error(error);
    push.error({
      title: t.drawing.title,
      message: t.drawing.save_failed
    });
  });
}

</script>

<template>
  <!-- TODO ajouter l'emprise du widget pour la gestion des collisions -->
</template>

<style>
.ol-overlay-container:has(.gp-label-div),
.ol-overlay-container:has(.gp-styling-div) {
  transform: translate(62px, 79px) !important;
}

@media (max-width: 627px) and (min-width: 576px) {
  .ol-overlay-container:has(.gp-label-div),
  .ol-overlay-container:has(.gp-styling-div) {
    transform: translate(62px, 144px) !important;
  }
}

@media (max-width: 576px) {
  .ol-overlay-container:has(.gp-label-div),
  .ol-overlay-container:has(.gp-styling-div) {
    transform: translate(62px, 235px) !important;
  }
}
</style>