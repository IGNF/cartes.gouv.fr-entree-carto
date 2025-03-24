<script setup lang="js">
import { useActionButtonEulerian } from '@/composables/actionEulerian';
import { useLogger } from 'vue-logger-plugin';
import { useMapStore } from '@/stores/mapStore';

import { 
  Drawing,
  ButtonExport
} from 'geopf-extensions-openlayers';

import { toShare } from '@/features/share';

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

// bouton d'enregistrement / export du croquis avec un menu
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
  format : "kml",
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
  format : "kml",
  icons : {
    menu : "",
    button : "save"
  }
}));

onMounted(() => {
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
 * Gestionnaire d'evenement : abonnement sur "vector:edit:clicked"
 * 
 * Reassocier la couche et l'outil de dessin
 * via le bouton d'edition du gestionnaire de couche
 * (un clic sur l'edition renvoie un event avec la couche associée)
 * @see LayerSwitcher
 */
emitter.addEventListener("vector:edit:clicked", (e) => {
  if (drawing.value) {
    drawing.value.setCollapsed(false);
    drawing.value.setLayer(e.layer);
    btnExport.value.inputName.value = e.options.title || "";
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
 * Gestionnaire d'evenement 
 * 
 * Permet la dissociation de la couche 
 * et l'outil lors de la fermeture du controle
 */
const onToggleShowVector = (e) => {
  log.debug(e);
  if (e.target.collapsed) {
    // dissociation de la couche du widget 
    // pour permettre une autre saisie dans 
    // une autre couche
    drawing.value.setLayer();
    btnExport.value.inputName.value = "";
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
  if (!service.authenticated) {
    push.warning({
      title: t.auth.title,
      message: t.auth.not_authentificated
    });
    return; // pas plus loin...
  }

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

  var promise;
  if (type !== "bookmark") {
    promise = createVectorDocument(data);
  } else {
    // INFO
    // mise à jour, l'ID de la couche fournit 
    // - un uuid 
    // - le type
    var uuid = gpID.split(':')[2];
    var type = gpID.split(':')[1].split('-')[0]; // ex. drawing-kml, import-gpx, ...
    data.type = type;
    data.uuid = uuid;
    promise = updateVectorDocument(data);
  }
  
  promise
  .then((o) => {
    var document = service.find(o.uuid); // un peu redondant...
    if (document) {
      var url = toShare(document, { 
        opacity: data.layer.get('opacity'), 
        visible: +data.layer.get('visible'),
        gray: 0,
        stop: 1 // HACK !
      });
      // nouvelle donnée à ajouter ou mise à jour au permalien
      if (o.action === "added") {
        mapStore.addBookmark(url);
      }
      else if (o.action === "updated") {
        mapStore.updateBookmark(url);
      } else {
        throw new Error("Action not yet implemented !");
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

/**
 * Créer un document pour un vecteur
 * @param data 
 * @property {String} data.content - export data
 * @property {String} data.name - name
 * @property {String} data.description - description
 * @property {String} data.format - format : kml, geojson, ...
 * @property {String} data.target - internal, external
 * @property {String} data.type - drawing, import, bookmark
 * @property {Object} data.layer - layer
 */
const createVectorDocument = async (data) => {
  try {
    const o = await service.setDocument(data)
    var uuid = o.uuid;
    var action = o.action;
    
    // mise à jour de l'id interne de la couche
    if (data.layer.gpResultLayerId) {
      data.layer.gpResultLayerId = `bookmark:${data.type}-${data.format.toLowerCase()}:${uuid}`;
    }
    
    // mise à jour de l'entrée du gestionnaire de couche
    if (data.layer.gpResultLayerDiv) {
      var div = data.layer.gpResultLayerDiv.querySelector("label[id^=GPname_ID_]");
      if (div) {
        div.innerHTML = data.name;
        div.title = data.description;
      }  
    }

    // rendre public le document
    const s = await service.sharingDocument({
      uuid : uuid,
      type : data.type
    });
    console.debug(s);

    // mise à jour des extras du document
    const x = await service.updateMetadataDocument({
      uuid : uuid,
      type : data.type,
      name : data.name,
      description : data.description,
      // FIXME extra !? sinon, labels !
      extra : {
        format: data.format.toLowerCase(),
        target: "internal",
        date: new Date().toLocaleDateString()
      }
    });
    console.debug(x);

    // emettre un event pour prévenir l'ajout d'un croquis
    // au composant des favoris
    emitter.dispatchEvent("document:saved", {
      uuid : uuid,
      action : action // added, updated, deleted
    });

    return o;

  } catch (error) {
    console.error(error);
    throw error;
  }
}
/**
 * Mettre à jour un document pour un vecteur
 * @param data 
 * @property {String} data.content - export data
 * @property {String} data.name - name
 * @property {String} data.description - description
 * @property {String} data.format - format : kml, geojson, ...
 * @property {Object} data.layer - layer
 */
const updateVectorDocument = async (data) => {
  try {
    const o = await service.updateGeometryDocument(data);
    var uuid = o.uuid;
    var action = o.action;

    // mise à jour de l'entrée du gestionnaire de couche
    if (data.layer.gpResultLayerDiv) {
      var div = data.layer.gpResultLayerDiv.querySelector("label[id^=GPname_ID_]");
      if (div) {
        div.innerHTML = data.name;
        div.title = data.description;
      }  
    }

    const document = service.find(uuid);
    if (document && !document.public_url) {
      // rendre public le document
      const s = await service.sharingDocument({
        uuid : uuid,
        type : data.type
      });
      console.debug(s);
    }

    // mise à jour des extras du document
    const x = await service.updateMetadataDocument({
      uuid : uuid,
      type : data.type,
      name : data.name,
      description : data.description,
      // FIXME extra !? sinon, labels !
      extra : {
        format: data.format.toLowerCase(),
        target: "internal",
        date: new Date().toLocaleDateString()
      }
    });
    console.debug(x);
    
    // emettre un event pour prévenir l'ajout d'un croquis 
    // au composant des favoris
    emitter.dispatchEvent("document:updated", {
      uuid : uuid,
      action : action // added, updated, deleted
    });

    return o;

  } catch (error) {
    console.error(error);
    throw error;
  }
}

/**
 * Gestionnaire d'evenement
 * 
 * Ecouteur pour l'export d'un croquis ou un import vecteur
 * 
 * @param {Object} e
 */
const onExportVector = (e) => {}

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
