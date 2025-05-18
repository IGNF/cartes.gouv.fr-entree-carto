<script setup lang="js">

import { useLogger } from 'vue-logger-plugin';
import { useDataStore } from '@/stores/dataStore';
import { useMapStore } from '@/stores/mapStore';
import { useActionButtonEulerian } from '@/composables/actionEulerian';
import { useCreateDocument } from '@/components/carte/control/actions/actionSaveButton';
import { useActionEdit } from '@/components/carte/control/actions/actionEditButton';

import { 
  Route,
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
  routeOptions: Object
});

const log = useLogger();
const store = useDataStore();
const mapStore = useMapStore();

const map = inject(props.mapId);
const route = ref(new Route(props.routeOptions));
const btnExport = ref(new ButtonExport({
  title : "Exporter",
  kind : "secondary",
  download : true,
  name: "Mon itineraire",
  description: "",
  control: route.value,
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
}));
const btnSave = ref(new ButtonExport({
  title : "Enregistrer",
  kind : "primary",
  download : false,
  name: "Mon itineraire",
  control: route.value,
  format : "geojson",
  menu : false,
  direction : "column",
  icons : {
    menu : "",
    button : "save"
  }
}));

/** 
 * Gestionnaire d'evenement : abonnement sur "compute-route:edit:clicked"
 * 
 * Reassocier la donnée et l'outil de calcul
 * via le bouton d'edition du gestionnaire de couche
 * (un clic sur l'edition renvoie un event avec la couche associée)
 * @see LayerSwitcher
 */
emitter.addEventListener("compute-route:edit:clicked", (e) => {
  log.debug(e);
  btnExport.value.inputName.value = e.options.title || "";
  useActionEdit(route.value, e.layer);
});

onMounted(() => {
  if (props.visibility) {
    map.addControl(route.value);
    map.addControl(btnExport.value);
    if (import.meta.env.IAM_DISABLE === '1') {
      btnSave.value.getContainer().style.display = "none";
    }
    map.addControl(btnSave.value);
    /* abonnement au widget 
    * @fires route:drawstart
    * @fires route:drawend
    * @fires route:compute
    */
    route.value.on("route:drawstart", onDrawStart);
    route.value.on("route:drawend", onDrawEnd);
    route.value.on("route:compute", onCompute);
    route.value.on("change:collapsed", onToggleShowCompute);
    btnExport.value.on("button:clicked", onExportRoute);
    btnSave.value.on("button:clicked", onSaveRoute);
    if (props.analytic) {
      var el = route.value.element.querySelector("button[id^=GPshowRoutePicto-]");
      useActionButtonEulerian(el);
    }
  }
})

onBeforeUpdate(() => {
  if (!props.visibility) {
    map.removeControl(route.value);
    map.removeControl(btnSave.value);
    map.removeControl(btnExport.value);
  }
})

onUpdated(() => {
  if (props.visibility) {
    map.addControl(route.value);
    map.addControl(btnExport.value);
    if (import.meta.env.IAM_DISABLE === '1') {
      btnSave.value.getContainer().style.display = "none";
    }
    map.addControl(btnSave.value);
    if (props.analytic) {
      var el = route.value.element.querySelector("button[id^=GPshowRoutePicto-]");
      useActionButtonEulerian(el);
    }
    /* abonnement au widget 
    * @fires route:drawstart
    * @fires route:drawend
    * @fires route:compute
    */
    route.value.on("route:drawstart", onDrawStart);
    route.value.on("route:drawend", onDrawEnd);
    route.value.on("route:compute", onCompute);
    route.value.on("change:collapsed", onToggleShowCompute);
    btnExport.value.on("button:clicked", onExportRoute);
    btnSave.value.on("button:clicked", onSaveRoute);
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
    route.value.clean();
  }
}
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
 * Ecouteur pour la sauvegarde d'un calcul d'itineraire
 * 
 * Actions :
 * - ajouter le calcul dans le permalien
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
const onSaveRoute = (e) => {
  log.debug(e);
  if (!service.authenticated) {
    push.warning({
      title: t.auth.title,
      message: t.auth.not_authentificated
    });
    return; // pas plus loin...
  }

  // ID pour un nouveau calcul
  // compute:Pieton$OGC:OPENLS;Itineraire
  // compute:Voiture$OGC:OPENLS;Itineraire
  // ID pour un import de calcul : layerimport:compute
  var gpID = e.layer.gpResultLayerId.toLowerCase();
  var type = gpID.split(':')[0];
  if (type === "layerimport") {
    type = gpID.split(':')[1];
    if (type !== "compute") {
      push.error({
        title: t.route.title,
        message: t.route.failed_import
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
    compute : "route",
    target : "internal",
    type : type // ex. drawing, import, bookmark, compute...
  };

  var promise;
  if (type !== "bookmark") {
    promise = useCreateDocument(data, emitter, service);
  } else {
    // INFO
    // Il n'y a pas de mise à jour d'un calcul d'itineraire.
    // Le widget procède à une suppression / creation de la couche à chaque calcul...
    push.info({
      title: t.route.title,
      message: t.route.save_already
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
      title: t.route.title,
      message: t.route.save_success
    });
  })
  .catch((error) => {
    console.error(error);
    push.error({
      title: t.route.title,
      message: t.route.save_failed
    });
  });
}
/**
 * Gestionnaire d'evenement 
 * 
 * Ecouteur pour la export d'un calcul d'itineraire
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
const onExportRoute = (e) => {
  log.debug(e);
  // on reprend le nom de l'export saisie par l'utilisateur
  btnExport.value.options.name = btnExport.value.inputName.value || e.name;
}

</script>

<template>
  <!-- TODO ajouter l'emprise du widget pour la gestion des collisions -->
</template>

<style></style>