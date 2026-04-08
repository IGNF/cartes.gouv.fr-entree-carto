<script lang="js">
  /**
   * @description
   * ...
   * @listens emitter#drawing:open:clicked
   */
  export default {
    name: 'Drawing'
  };
</script>

<script setup lang="js">
import { useActionButtonEulerian } from '@/composables/actionEulerian';
import { useLogger } from 'vue-logger-plugin';
import { useMapStore } from '@/stores/mapStore';
import { useAppStore } from '@/stores/appStore';
import { useServiceStore } from '@/stores/serviceStore';

import { 
  useCreateDocument, 
  useUpdateDocument 
} from '@/components/carte/control/actions/actionSaveButton';

import { 
  Drawing,
  ButtonExport
} from 'geopf-extensions-openlayers';

import { toShare } from '@/features/share';

import { createVectorLayer } from '@/features/layer';

// lib notification
import { push } from 'notivue';
import t from '@/features/translation';

const emitter = inject('emitter');
var service = inject('services');

const appStore = useAppStore();
const mapStore = useMapStore();
const serviceStore = useServiceStore();
const log = useLogger();

const props = defineProps({
  mapId: {
    type: String,
    default: ''
  },
  visibility: Boolean,
  analytic: Boolean,
  drawingOptions: {
    type: Object,
    default: () => ({})
  }
});

const map = inject(props.mapId)
const drawing = ref(new Drawing(props.drawingOptions));

// INFO
// variable pour éviter la restauration multiple d'un document temporaire
// cas d'un event "document:restore" émis plusieurs fois ou avant le montage du composant
const restoredTemporaryDocument = ref(false);

// bouton d'enregistrement / export du croquis avec un menu
const formatByDefault = "kml";
const btnExport = ref(new ButtonExport({
  title : "Exporter",
  kind : "secondary",
  download : true,
  name: "Mon croquis",
  description: "",
  control: drawing.value,
  menu : true,
  menuOptions : {
    outside: true,
    above: true,
    selectFormat: false,
    labelDesc: false
  },
  direction : "column",
  format : formatByDefault,
  icons : {
    menu : "",
    button : "export"
  }
}));
const btnSave = ref(new ButtonExport({
  title : "Enregistrer",
  kind : "primary",
  download : false,
  name: "Mon croquis",
  description: "",
  control: drawing.value,
  menu: false,
  format : formatByDefault,
  icons : {
    menu : "",
    button : "save"
  }
}));

/** 
 * @event vector:edit:clicked
 * @description
 * Gestionnaire d'evenement : abonnement sur "vector:edit:clicked"
 * 
 * Reassocier la couche et l'outil de dessin
 * via le bouton d'edition du gestionnaire de couche
 * (un clic sur l'edition renvoie un event avec la couche associée)
 * @property {Object} layer - couche à éditer
 * @property {Object} options - options de la couche
 * @see LayerSwitcher
 */
emitter.addEventListener("vector:edit:clicked", (e) => {
  if (drawing.value) {
    drawing.value.setCollapsed(false);
    drawing.value.setLayer(e.layer);
    btnExport.value.setName(e.options.title || "");
    btnSave.value.setName(e.options.title || "");
  }
  // INFO
  // on sauvegarde / exporte au format natif
  var gpId = e.layer.gpResultLayerId.toLowerCase();
  if (gpId) {
    var format;
    if (gpId.includes("drawing") || gpId.includes("kml")) {
      format = "kml";
    } else if (gpId.includes("geojson")) {
      format = "geojson";
    } else if (gpId.includes("gpx")) {
      format = "gpx";
    } else {
      format = "kml"; // par defaut ?
    }
    btnExport.value.setFormat(format);
    btnSave.value.setFormat(format);
  }
});

/**
 * @event drawing:open:clicked
 * @description Evenement pour ouvrir/fermer le controle de dessin
 * @property {Boolean} open - ouvrir/fermer le controle
 */
emitter.addEventListener("drawing:open:clicked", (e) => {
  if (drawing.value) {
    drawing.value.setCollapsed(!e.open);
  }
});

/**
 * @event document:restore
 * @description Evenement pour restaurer un document temporaire déclenché 
 * par la demande de connexion réussie
 * @property {Object} data - données du document
 * @property {String} componentName - nom du component qui emet l'event
 */
emitter.addEventListener("document:restore", (e) => {
  log.debug("Restore document !", e);
  restoreTemporaryDocument(e.data);
});

const restoreTemporaryDocument = (payload) => {
  if (!payload || !drawing.value) {
    return;
  }
  if (restoredTemporaryDocument.value) {
    return;
  }

  appStore.clearDocumentTemporary();

  createVectorLayer({
    name : payload.name || "Document restauré",
    description : payload.description || "Document temporaire restauré depuis une précédente session",
    type : payload.type || "drawing",
    format : payload.format || "kml",
    target : payload.target || "internal",
    data : payload.content
  }).then((layer) => {
    // restaurer le croquis dans le widget puis l'afficher
    drawing.value.setCollapsed(false);
    drawing.value.setLayer(layer);
    btnExport.value.setName(payload.name || "Document restauré");
    btnExport.value.setFormat(payload.format);
    btnSave.value.setName(payload.name || "Document restauré");
    btnSave.value.setFormat(payload.format);
  }).then(() => {
    // Le document est restauré dans le widget: 
    // la reconnexion n'est plus requise.
    serviceStore.setAuthentificateSyncNeeded(false);
    restoredTemporaryDocument.value = true;
  }).then(() => {
    // et, l'enregistrer définitivement sur l'espace personnel
    btnSave.value.button.click();
  }).catch((error) => {
    console.error(error);
    push.error({
      title: t.drawing.title,
      message: t.drawing.restore_failed
    });
  });
};

onMounted(() => {
  log.debug("Drawing component mounted");
  if (props.visibility) {
    map.addControl(drawing.value);
    map.addControl(btnExport.value);
    if (import.meta.env.IAM_DISABLE === '1') {
      btnSave.value.getContainer().style.display = "none";
    }
    map.addControl(btnSave.value);
    if (props.analytic) {
      var el = drawing.value.element.querySelector("button[id^=GPshowDrawingPicto-]");
      useActionButtonEulerian(el);
    }
    /** abonnement au widget */
    btnSave.value.on("button:clicked", onSaveVector);
    btnExport.value.on("button:clicked", onExportVector);
    drawing.value.on("change:collapsed", onToggleShowVector);
  }

  // Fallback: si l'event a ete emis avant le montage du composant,
  // le document temporaire reste disponible dans le store.
  const docTemp = appStore.getDocumentTemporary();
  if (service.authenticated && docTemp) {
    try {
      restoreTemporaryDocument(JSON.parse(docTemp));
    } catch (error) {
      console.error(error);
    }
  }
})

onBeforeUpdate(() => {
  if (props.visibility) {
    map.addControl(drawing.value);
    map.addControl(btnExport.value);
    if (import.meta.env.IAM_DISABLE === '1') {
      btnSave.value.getContainer().style.display = "none";
    }
    map.addControl(btnSave.value);
    if (props.analytic) {
      var el = drawing.value.element.querySelector("button[id^=GPshowDrawingPicto-]");
      useActionButtonEulerian(el);
    }
    /** abonnement au widget */
    btnSave.value.on("button:clicked", onSaveVector);
    btnExport.value.on("button:clicked", onExportVector);
    drawing.value.on("change:collapsed",onToggleShowVector);
  }
  else {
    map.removeControl(btnSave.value);
    map.removeControl(drawing.value);
    map.removeControl(btnExport.value);
  }
})

/**
 * Gestionnaire d'evenement 
 * 
 * Permet la dissociation de la couche 
 * et l'outil lors de la fermeture du controle
 */
const onToggleShowVector = (e) => {
  log.debug(e);
  if (e.target.collapsed) {
    if (drawing.value.getLayer()) {
      onSaveVector({
        content : drawing.value.exportFeatures(),
        name : drawing.value.getExportName(),
        description : "",
        format : drawing.value.getExportFormat(),
        layer : drawing.value.getLayer()
      });
    }
    // dissociation de la couche du widget 
    // pour permettre une autre saisie dans 
    // une autre couche
    drawing.value.setLayer();
    btnExport.value.inputName.value = "";
    btnExport.value.setFormat(formatByDefault);
    btnSave.value.setFormat(formatByDefault);
  }
}

/** 
 * Gestionnaire d'evenement
 * 
 * Ecouteur pour la sauvegarde d'un croquis ou un import vecteur
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
 * @fires emitter#document:updated
 * @param {Object} e
 * @property {Object} type - event
 * @property {Object} target - instance Export
 * @property {String} content - export data
 * @property {String} name - name
 * @property {String} description - description
 * @property {String} format - format : kml, geojson, ...
 * @property {Object} layer - layer
 */
const onSaveVector = (e) => {
  log.debug(e);

  var gpID = e.layer.gpResultLayerId.toLowerCase();
  var type = gpID.split(':')[0];
  
  var data = {
    layer : e.layer,
    content : e.content,
    name : btnExport.value.inputName.value || e.name,
    description : e.description,
    format : e.format.toLowerCase(),
    target : "internal",
    type : gpID.split(':')[0].replace("layer", "") // ex. drawing, import, bookmark...
  };

  var bSaveDocumentTemporary = false;
  // notification d'une authentification nécessaire
  if (!service.authenticated) {
    bSaveDocumentTemporary = true;
    push.warning({
      title: t.auth.title,
      message: t.auth.not_authentificated
    });
  }
  
  // stockage temporaire dans le localStorage
  // car l'utilisateur demande une sauvegarde sans etre authentifié !
  if (bSaveDocumentTemporary) {
    if (data.layer) {
      serviceStore.setAuthentificateSyncNeeded(true);
      appStore.setDocumentTemporary(JSON.stringify({
        content : data.content,
        name : data.name,
        description : data.description,
        format : data.format,
        target : data.target,
        type : data.type
      }));
    }
    return; // pas plus loin...
  }

  var promise;
  if (type !== "bookmark") {
    promise = useCreateDocument(data, emitter, service);
  } else {
    // INFO
    // mise à jour, l'ID de la couche fournit 
    // - un uuid 
    // - le type
    var uuid = gpID.split(':')[2];
    var soustype = gpID.split(':')[1].split('-')[0]; // ex. drawing-kml, import-gpx, ...
    data.type = soustype;
    data.uuid = uuid;
    promise = useUpdateDocument(data, emitter, service);
  }
  
  promise
  .then((o) => {
    var document = service.find(o.uuid); // un peu redondant...
    if (document) {
      var url = null;
      // nouvelle donnée à ajouter ou mise à jour au permalien
      if (o.action === "added") {
        url = toShare(document, { 
          opacity: data.layer.get('opacity'), 
          visible: data.layer.get('visible'),
          grayscale: data.layer.get('grayscale'),
          stop: 1 // HACK croquis déjà présent sur la carte via le widget !
        });
        mapStore.addBookmark(url);
      }
      else if (o.action === "updated") {
        url = toShare(document, { 
          opacity: data.layer.get('opacity'), 
          visible: data.layer.get('visible'),
          grayscale: data.layer.get('grayscale')
        });
        mapStore.updateBookmark(url);
      } else {
        throw new Error("Action not yet implemented !");
      }
    }
  })
  .then(() => {
    // mise à jour du titre de la couche 
    // ceci déclenche un evenement pour le gestionnaire de couche
    data.layer.set('title', data.name);
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

/**
 * Gestionnaire d'evenement
 * 
 * Ecouteur pour l'export d'un croquis ou un import vecteur
 * 
 * @param {Object} e
 */
const onExportVector = (e) => {
  log.debug(e);
  // rien de particulier pour l'instant
}

</script>

<template>
  <div />
</template>

<style lang="scss">
@use "@/assets/variables" as *;

// gp-label-div/gp-styling-div sont les sous-panel de "annoter la carte"
// positionne au même endroit qu'un panel de gauche
.ol-overlay-container:has(.gp-label-div),
.ol-overlay-container:has(.gp-styling-div) {
  z-index: 4;
  transform: none !important;
  top: $gap;
  left: $widget-panel-x;

  @include max(sm) {
    top: 0;
    left: 0;

    .gp-label-div,
    .gp-styling-div {
      width: 100vw;
    }
  }
}
.gp-label-div,
.gp-styling-div {
  transform: none;
}
</style>
