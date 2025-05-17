<script setup lang="js">

import { useLogger } from 'vue-logger-plugin'
import { useDataStore } from '@/stores/dataStore';
import { useMapStore } from '@/stores/mapStore';
import { useActionButtonEulerian } from '@/composables/actionEulerian';
import { useCreateDocument } from '@/components/carte/control/actions/actionSaveButton';
import { useActionEdit } from '@/components/carte/control/actions/actionEditButton';

import { 
  Isocurve,
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
  isocurveOptions: Object
});

const log = useLogger()
const store = useDataStore();
const mapStore = useMapStore();

const map = inject(props.mapId)
const isocurve = ref(new Isocurve(props.isocurveOptions))
const btnExport = ref(new ButtonExport({
  title : "Exporter",
  kind : "secondary",
  download : true,
  name: "Mon iso",
  description: "",
  control: isocurve.value,
  menu : true,
  menuOptions : {
    outside: true,
    above: true,
    selectFormat: false,
    labelDesc: false
  },
  direction : "column",
  format : "geojson",
  icons : {
    menu : "",
    button : "export"
  }
}))
const btnSave = ref(new ButtonExport({
  title : "Enregistrer",
  kind : "primary",
  download : false,
  control: isocurve.value,
  format : "geojson",
  menu : false,
  direction : "column",
  icons : {
    menu : "",
    button : "save"
  }
}));

/** 
 * Gestionnaire d'evenement : abonnement sur "compute-isocurve:edit:clicked"
 * 
 * Reassocier la donnée et l'outil de calcul
 * via le bouton d'edition du gestionnaire de couche
 * (un clic sur l'edition renvoie un event avec la couche associée)
 * @see LayerSwitcher
 */
 emitter.addEventListener("compute-isocurve:edit:clicked", (e) => {
  log.debug(e);
  btnExport.value.inputName.value = e.options.title || "";
  useActionEdit(isocurve.value, e.layer);
});

onMounted(() => {
  if (props.visibility) {
    map.addControl(isocurve.value);
    map.addControl(btnExport.value);
    if (import.meta.env.IAM_DISABLE === '1') {
      btnSave.value.getContainer().style.display = "none";
    }
    map.addControl(btnSave.value);
    if (props.analytic) {
      var el = isocurve.value.element.querySelector("button[id^=GPshowIsochronPicto-]");
      useActionButtonEulerian(el);
    }
    /* abonnement au widget 
    * @fires isocurve:drawstart
    * @fires isocurve:drawend
    * @fires isocurve:compute
    */
    isocurve.value.on("isocurve:drawstart", onDrawStart);
    isocurve.value.on("socurve:drawend", onDrawEnd);
    isocurve.value.on("isocurve:compute", onCompute);
    isocurve.value.on("change:collapsed", onToggleShowCompute);
    btnExport.value.on("button:clicked", onExportIsocurve);
    btnSave.value.on("button:clicked", onSaveIsocurve);
  }
})

onBeforeUpdate(() => {
  if (!props.visibility) {
    map.removeControl(isocurve.value);
    map.removeControl(btnSave.value);
    map.removeControl(btnExport.value);
  }
})

onUpdated(() => {
  if (props.visibility) {
    map.addControl(isocurve.value);
    map.addControl(btnExport.value);
    if (import.meta.env.IAM_DISABLE === '1') {
      btnSave.value.getContainer().style.display = "none";
    }
    map.addControl(btnSave.value);
    if (props.analytic) {
      var el = isocurve.value.element.querySelector("button[id^=GPshowIsochronPicto-]");
      useActionButtonEulerian(el);
    }
    /* abonnement au widget 
    * @fires isocurve:drawstart
    * @fires isocurve:drawend
    * @fires isocurve:compute
    */
    isocurve.value.on("isocurve:drawstart", onDrawStart);
    isocurve.value.on("socurve:drawend", onDrawEnd);
    isocurve.value.on("isocurve:compute", onCompute);
    isocurve.value.on("change:collapsed", onToggleShowCompute);
    btnExport.value.on("button:clicked", onExportIsocurve);
    btnSave.value.on("button:clicked", onSaveIsocurve);
  }
})

/** 
 * gestionnaire d'evenement sur les abonnements du widget
 * @description
 * ...
 */
 const onToggleShowCompute = (e) => {
  log.debug(e);
  if (e.target.collapsed) {
    // dissociation de la couche du widget 
    // pour permettre une autre saisie
    isocurve.value.clean();
  }
}

/** 
 * gestionnaire d'evenement sur les abonnements du widget
 * @description
 * ...
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
  layer.set("geojson", widget.getGeoJSON());
}
/**
 * Gestionnaire d'evenement 
 * 
 * Ecouteur pour la sauvegarde d'un calcul isochrone
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
const onSaveIsocurve = (e) => {
  log.debug(e);
  if (!service.authenticated) {
    push.warning({
      title: t.auth.title,
      message: t.auth.not_authentificated
    });
    return; // pas plus loin...
  }

  // ID pour un nouveau calcul
  // "compute:Pieton$GEOPORTAIL:GPP:Isocurve",
  // "compute:Voiture$GEOPORTAIL:GPP:Isocurve",
  // ID pour un import de calcul : layerimport:compute
  var gpID = e.layer.gpResultLayerId.toLowerCase();
  var type = gpID.split(':')[0];
  if (type === "layerimport") {
    type = gpID.split(':')[1];
    if (type !== "compute") {
      push.error({
        title: t.iso.title,
        message: t.iso.failed_import
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
    compute : "isocurve",
    target : "internal",
    type : type // ex. drawing, import, bookmark, compute...
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
      title: t.iso.title,
      message: t.iso.save_success
    });
  })
  .catch((error) => {
    console.error(error);
    push.error({
      title: t.iso.title,
      message: t.iso.save_failed
    });
  });
}

/**
 * Gestionnaire d'evenement 
 * 
 * Ecouteur pour l'export d'un calcul isochrone
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
 const onExportIsocurve = (e) => {
  log.debug(e);
}
</script>

<template>
  <!-- TODO ajouter l'emprise du widget pour la gestion des collisions -->
</template>

<style></style>