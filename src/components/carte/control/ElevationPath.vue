<script setup lang="js">
import { useActionButtonEulerian } from '@/composables/actionEulerian';
import { useCreateDocument } from '@/components/carte/control/actions/actionSaveButton';
import { useActionEdit } from '@/components/carte/control/actions/actionEditButton';

import { useLogger } from 'vue-logger-plugin';
import { useDataStore } from '@/stores/dataStore';
import { useMapStore } from '@/stores/mapStore';
import {
  ElevationPath,
  ButtonExport
} from 'geopf-extensions-openlayers';

import { toShare } from '@/features/share';

// lib notification
import { push } from 'notivue';
import t from '@/features/translation';
 
const emitter = inject('emitter');
var service = inject('services');

const props = defineProps({
  mapId: String,
  visibility: Boolean,
  analytic: Boolean,
  elevationPathOptions: Object
})

const log = useLogger();
const store = useDataStore();
const mapStore = useMapStore();

const map = inject(props.mapId);
const elevationPath = ref(new ElevationPath(props.elevationPathOptions));
const btnExport = ref(new ButtonExport({
  title : "Exporter",
  kind : "secondary",
  download : true,
  name: "Mon profil",
  description: "",
  control: elevationPath.value,
  direction : "column", // row
  menu : true,
  menuOptions : {
    name : "Options", // nom du menu, null affiche uniquement le curseur
    position : "bottom", // bottom, right, left, ...
    outside : true, // menu accordéon ou non
    labelName : true, // afficher le nom de l'export
    labelDesc : false, // afficher la description
    selectFormat : true // afficher la liste des types d'export
  },
  format : "geojson",
  icons : {
    menu : "",
    button : "export"
  }
}));
const btnSave = ref(new ButtonExport({
  title : "Enregistrer",
  kind : "primary",
  name: "Mon profil",
  download : false,
  control: elevationPath.value,
  format : "geojson",
  menu : false,
  icons : {
    menu : "",
    button : "save"
  }
}));

/** 
 * Gestionnaire d'evenement : abonnement sur "compute-profil:edit:clicked"
 * 
 * Reassocier la donnée et l'outil de calcul
 * via le bouton d'edition du gestionnaire de couche
 * (un clic sur l'edition renvoie un event avec la couche associée)
 * @see LayerSwitcher
 */
 emitter.addEventListener("compute-profil:edit:clicked", (e) => {
  log.debug(e);
  btnExport.value.inputName.value = e.options.title || "";
  useActionEdit(elevationPath.value, e.layer);
});

onMounted(() => {
  if (props.visibility) {
    map.addControl(elevationPath.value);
    if (import.meta.env.IAM_DISABLE === '1') {
      btnSave.value.getContainer().style.display = "none";
    }
    map.addControl(btnExport.value);
    map.addControl(btnSave.value);
    /* abonnement au widget 
    * @fires elevationpath:drawstart
    * @fires elevationpath:drawend
    * @fires elevationpath:compute
    */
    elevationPath.value.on("elevationpath:drawstart", onDrawStart);
    elevationPath.value.on("elevationpath:drawend", onDrawEnd);
    elevationPath.value.on("elevationpath:compute", onCompute);
    elevationPath.value.on("change:collapsed", onToggleShowCompute);
    btnExport.value.on("button:clicked", onExportElevationPath);
    btnSave.value.on("button:clicked", onSaveElevationPath);

    var el = elevationPath.value.element.querySelector("button[id^=GPshowElevationPathPicto-]");
    if (props.analytic) {
      useActionButtonEulerian(el);
    }
    // INFO
    // si on clique pour desactiver le profil alti, cette action supprime le tracé en cours !
    // mais, par contre, si on interdit cette action, la couche n'est pas supprimée, 
    // l'interaction reste toujours active, et le nettoyage des ressources n'est pas realisé !

    // HACK
    // on souhaite que cette action ne supprime pas ni la couche, ni le tracé !
    // mais uniquement desactive l'interaction, et procede au nettoyage des ressources en cours !
    // on fait donc passer une instruction au gestionnaire d'evenement sous-jacent,
    // au niveau des extensions : "data-remove-measure:false"
    el.dataset.removeMeasure = "false";
    el.dataset.removeLayer = "false";
  }
})

onBeforeUpdate(() => {
  if (!props.visibility) {
    map.removeControl(elevationPath.value);
    map.removeControl(btnSave.value);
    map.removeControl(btnExport.value);
  }
})

onUpdated(() => {
  if (props.visibility) {
    map.addControl(elevationPath.value);
    map.addControl(btnExport.value);
    if (import.meta.env.IAM_DISABLE === '1') {
      btnSave.value.getContainer().style.display = "none";
    }
    map.addControl(btnSave.value);

    var el = elevationPath.value.element.querySelector("button[id^=GPshowElevationPathPicto-]");
    if (props.analytic) {
      useActionButtonEulerian(el);
    }
    // cf. HACK
    el.dataset.removeMeasure = "false";
    el.dataset.removeLayer = "false";

    /* abonnement au widget 
    * @fires elevationpath:drawstart
    * @fires elevationpath:drawend
    * @fires elevationpath:compute
    */
    elevationPath.value.on("elevationpath:drawstart", onDrawStart);
    elevationPath.value.on("elevationpath:drawend", onDrawEnd);
    elevationPath.value.on("elevationpath:compute", onCompute);
    elevationPath.value.on("change:collapsed", onToggleShowCompute);
    btnExport.value.on("button:clicked", onExportElevationPath);
    btnSave.value.on("button:clicked", onSaveElevationPath);
  }
})

/** 
 * gestionnaire d'evenement sur les abonnements du widget
 * @description
 * ...
 * @fixme la méthode setCollapsed n'est pas implémentés !
 */
 const onToggleShowCompute = (e) => {
  log.debug(e);
  if (e.target.collapsed) {
    // dissociation de la couche du widget 
    // pour permettre une autre saisie
    elevationPath.value.clean(false);
  }
}

/** 
 * gestionnaire d'evenement sur les abonnements du widget
 * 
 * @description
 * ...
 * 
 */
const onDrawStart = (e) => {
  log.debug(e);
}
const onDrawEnd = (e) => {
  log.debug(e);
}
const onCompute = (e) => {
  log.debug(e);
  var widget = e.target;
  var layer = widget.getLayer();
  layer.set("control", widget.CLASSNAME.toLowerCase());
  layer.set("data", widget.getData());
  // layer.set("geojson", widget.getGeoJSON());
}
/**
 * Gestionnaire d'evenement 
 * 
 * Ecouteur pour la sauvegarde d'un calcul de profil altimétrique
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
const onSaveElevationPath = (e) => {
  log.debug(e);
  if (!service.authenticated) {
    push.warning({
      title: t.auth.title,
      message: t.auth.not_authentificated
    });
    return; // pas plus loin...
  }

  // ID pour un nouveau calcul
  // "measure:profil",
  // ID pour un import de calcul : layerimport:compute
  var gpID = e.layer.gpResultLayerId.toLowerCase();
  var type = gpID.split(':')[0];
  if (type === "measure") {
    type = gpID.split(':')[1];
    if (type !== "profil") {
      push.error({
        title: t.profil.title,
        message: t.profil.failed_import
      });
      return; // pas plus loin...
    }
  }

  var data = {
    layer : e.layer,
    content : e.content,
    name : btnExport.value.inputName.value || e.name,
    description : e.description,
    format : e.format.toLowerCase(),
    compute : "profil",
    target : "internal",
    type : "compute" // ex. drawing, import, bookmark, compute...
  };

  var promise;
  if (type !== "bookmark") {
    promise = useCreateDocument(data, emitter, service);
  } else {
    // INFO
    // Il n'y a pas de mise à jour d'un calcul.
    // Le widget procède à une suppression / creation de la couche à chaque calcul...
    push.info({
      title: t.iso.title,
      message: t.iso.save_already
    });
    return; // pas plus loin...
  }

  promise
  .then((o) => {
    var document = service.find(o.uuid); // un peu redondant...
    if (document) {
      var url = toShare(document, { 
        opacity: data.layer.get('opacity'), 
        visible: data.layer.get('visible'),
        grayscale: data.layer.get('grayscale'),
        stop: 1 // HACK !
      });
      // nouvelle donnée à ajouter ou mise à jour au permalien
      if (o.action === "added") {
        mapStore.addBookmark(url);
      } else {
        throw new Error("Action not yet implemented !");
      }
    }
  })
  .then(() => {
    // notification
    push.success({
      title: t.profil.title,
      message: t.profil.save_success
    });
  })
  .catch((error) => {
    console.error(error);
    push.error({
      title: t.profil.title,
      message: t.profil.save_failed
    });
  });
}

/**
 * Gestionnaire d'evenement 
 * 
 * Ecouteur pour l'export d'un calcul de profil altimétrique
 * 
 * @param {Object} e
 * @property {Object} type - event
 * @property {Object} target - instance Export
 * @property {String} content - export data
 * @property {String} name - name
 * @property {String} description - description
 * @property {String} format - format : kml, geojson, ...
 * @property {Object} layer - layer
 */
const onExportElevationPath = (e) => {
  log.debug(e);
  // on reprend le nom de l'export saisie par l'utilisateur
  btnExport.value.options.name = btnExport.value.inputName.value || e.name;
}
</script>

<template>
  <!-- TODO ajouter l'emprise du widget pour la gestion des collisions -->
</template>

<style scoped></style>
