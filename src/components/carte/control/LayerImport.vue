<script lang="js">
  /**
   * @description
   * ...
   * @listens emitter#layerimport:open:clicked
   */
  export default {
    name: 'LayerImport'
  };
</script>

<script setup lang="js">
import { useActionButtonEulerian } from '@/composables/actionEulerian.js';
import { useLogger } from 'vue-logger-plugin';
import { useMapStore } from '@/stores/mapStore';

import { 
  useCreateDocument
} from '@/components/carte/control/actions/actionSaveButton';

import {
  LayerImport
} from 'geopf-extensions-openlayers'

import { toShare } from '@/features/share';

// lib notification
import { push } from 'notivue';
import t from '@/features/translation';

const emitter = inject('emitter');
const service = inject('services');

const refModalLogin = inject("refModalLogin");
const refModalSave = inject("refModalSave");

const props = defineProps({
  mapId: String,
  visibility: Boolean,
  analytic: Boolean,
  layerImportOptions: Object
});

const mapStore = useMapStore();
const log = useLogger();

const map = inject(props.mapId);
const layerImport = ref(new LayerImport(props.layerImportOptions));

// abonnement sur l'ouverture du controle
emitter.addEventListener("layerimport:open:clicked", (e) => {
  if (layerImport.value) {
    layerImport.value.setCollapsed(!e.open);
  }
});

onMounted(() => {
  if (props.visibility) {
    map.addControl(layerImport.value);
    if (props.analytic) {
      var el = layerImport.value.element.querySelector("button[id^=GPshowImportPicto-]");
      useActionButtonEulerian(el);
    }
    /** abonnement au widget */
    layerImport.value.on("layerimport:vector:added", onSaveImportVector);
    layerImport.value.on("layerimport:service:added", onSaveImportService);
    layerImport.value.on("layerimport:mapbox:added", onSaveImportMapbox);
    layerImport.value.on("layerimport:compute:added", onSaveImportCompute);
  }
})

onBeforeUpdate(() => {
  if (!props.visibility) {
    map.removeControl(layerImport.value);
  }
})

onUpdated(() => {
  if (props.visibility) {
    map.addControl(layerImport.value);
    if (props.analytic) {
      var el = layerImport.value.element.querySelector("button[id^=GPshowImportPicto-]");
      useActionButtonEulerian(el);
    }
    /** abonnement au widget */
    layerImport.value.on("layerimport:vector:added", onSaveImportVector);
    layerImport.value.on("layerimport:service:added", onSaveImportService);
    layerImport.value.on("layerimport:mapbox:added", onSaveImportMapbox);
    layerImport.value.on("layerimport:compute:added", onSaveImportCompute);
  }
})

/**
 * ouverture de la modale de connexion pour proposer à l'utilisateur
 * de se connecter à son espace personnel
 * @param e - donnée de sauvegarde de l'import
 */
const onOpenModalLogin = (e) => {
  // FIXME
  // Si je decide de me connecter, je perds mon import
  // car il n'est pas enregistré !
  // On peut deleguer une action de sauvegarde ou emettre un evenement
  // aprés la validation de la connexion
  // Pour garder les informations de sauvegarde temporaire, 
  // on les stocke dans le localStorage
  log.debug(e);
  if (refModalLogin) {
    // true pour proposer le message 'Ne plus afficher le message'
    refModalLogin.value.openModalLogin(true); 
  }
}

/**
 * ouverture de la modale de sauvegarde pour proposer à l'utilisateur
 * de sauvegarder son import
 */
const onOpenModalSave = () => {
  if (refModalSave) {
    refModalSave.value.openModalSave();
  }
}

/**
 * 
 * @param e - donnée de sauvegarde de l'import
 */
const saveImportVector = (e) => {
  console.log("saveImportVector", e);
  
  var data = {
    layer : e.layer,
    content : e.data,
    name : e.name,
    description : "", // pas de description dans la réponse
    format : e.format.toLowerCase(),
    target : "internal",
    type : "import"
  };

  var promise = useCreateDocument(data, emitter, service);
  
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
      // nouvelle donnée à ajouter
      if (o.action === "added") {
        mapStore.addBookmark(url);
      } else {
        throw new Error("Action not yet implemented !");
      }
    }
  })
  .then(() => {
    layerImport.value.setCollapsed(true);
  })
  .then(() => {
    // notification
    push.success({
      title: t.layerimport.title,
      message: t.layerimport.save_success
    });
  })
  .catch((error) => {
    console.error(error);
    push.error({
      title: t.layerimport.title,
      message: t.layerimport.save_failed
    });
  });
}

/** 
 * Gestionnaires d'evenement
 * 
 * @description
 * 
 * Ecouteur pour la sauvegarde automatique d'un import de type :
 * - vecteur
 * - service
 * - mapbox
 * - compute
 * 
 * @event layerimport:service:added
 * @property {Object} type - event
 * @property {String} name - layerName
 * @property {String} data - data
 * @property {Object} layer - layer
 * @property {String} format - format : wms, wmts...
 * @property {Object} target - instance LayerImport
 * @example
 * LayerImport.on("layerimport:service:added", function (e) {
 *   console.log(e.layer);
 * })
 */
const onSaveImportVector = (e) => {
  log.debug(e);

  // on n'est pas connecté, on propose le choix de se connecter ou pas
  if (!service.authenticated) {
    // si la case 'Ne plus afficher ce message' est cochée,
    // on n'affiche plus la boite de dialogue de connexion
    if (!mapStore.noLoginInformation) {
      onOpenModalLogin(e);
    }
  } else {
    // on initie la méthode de delegation de la sauvegarde
    refModalSave.value.onDelegateCbk(() => {
      saveImportVector(e);
    });
  
    // si on est authentifié, on propose la possibilité de sauvegarder ou pas
    if (service.authenticated) {
      onOpenModalSave();
    }
  }
};
const onSaveImportService = (e) => {
  log.debug(e);
  // vérifier si l'utilisateur est authentifié
  if (!service.authenticated) {
    return;
  }

  var content = {};
  if (e.format.toLowerCase() === "wmts") {
    content = getDataServiceWMTS(e.data);
  }
  if (e.format.toLowerCase() === "wms") {
    content = getDataServiceWMS(e.data);
  }
  if (e.format.toLowerCase() === "wfs") {
    // TODO : à compléter
    console.error("WFS not implemented !");
    return;
  }

  if (!content.url) {
    push.error({
      title: t.layerimport.title,
      message: t.layerimport.add_failed_service(e.format.toUpperCase())
    });
    return;
  }

  var data = {
    content : JSON.stringify(content),
    name : content.title || e.name,
    description : content.description,
    format : "json",
    type : "service",
    kind : content.format.toLowerCase(),
    target : "external",
    layer : e.layer
  };

  createImportDocument(data)
  .then((o) => {
    var document = service.find(o.uuid); // un peu redondant...
    if (document) {
      var url = toShare(document, {
        opacity: 1, 
        visible: true,
        grayscale: false,
        stop : 1
      });
      mapStore.addBookmark(url);
    }
  })
  .then(() => {
    // notification
    push.success({
      title: t.layerimport.title,
      message: t.layerimport.add_success_service(e.format.toUpperCase())
    });
  })
  .catch((error) => {
    console.error(error);
    push.warning({
      title: t.layerimport.title,
      message: t.layerimport.add_failed_service(e.format.toUpperCase())
    });
  });

};
const onSaveImportMapbox = (e) => {
  log.debug(e);
  // vérifier si l'utilisateur est authentifié
  if (!service.authenticated) {
    return;
  }

  var data = {
    content : e.data,
    name : e.name,
    description : 'Import Mapbox',
    format : "json",
    type : "service",
    kind : 'mapbox',
    target : "internal",
    layer : e.layer
  };

  createImportDocument(data)
  .then((o) => {
    var document = service.find(o.uuid); // un peu redondant...
    if (document) {
      var url = toShare(document, {
        opacity: 1, 
        visible: true,
        grayscale: false,
        stop : 1
      });
      mapStore.addBookmark(url);
    }
  })
  .then(() => {
    // notification
    push.success({
      title: t.layerimport.title,
      message: t.layerimport.add_success_mapbox
    });
  })
  .catch((error) => {
    console.error(error);
    push.warning({
      title: t.layerimport.title,
      message: t.layerimport.add_failed_mapbox
    });
  });
};
const onSaveImportCompute = (e) => {
  log.debug(e);
};

const getDataServiceWMS = (data) => {
  // ex. de requête pour un WMS
  // {
  //   "url":"https://data.geopf.fr/wms-v/v?SERVICE=WMS&",
  //   "format":"WMS",
  //   "title":"Académies",
  //   "description":"L'académie est la circonscription administrative de l'éducation nationale. La France est partagée en 30 académies dont 26 académies métropolitaines et quatre académies d'outre-mer : Guadeloupe, Guyane, Martinique et La Réunion . Chaque académie correspond à une région, sauf en Île-de-France, Rhône-Alpes et Provence-Alpes-Côte d'Azur. Les autres collectivités d'outre-mer disposent d'un vice-rectorat ou de services de l'éducation nationale. Sources : IGN BD Topo 2015, MENESR avril 2015",
  //   "layers":["ACADEMIES.2015"],
  //   "version":"1.3.0",
  //   "stylesName":["default-style-ACADEMIES.2015"],
  //   "queryable":true,
  //   "gfiFormat":"text/html",
  //   "projection":null
  // }
  return {
    url : data["Url"],
    format : "WMS",
    title : data["Title"],
    description : data["Abstract"],
    layers : [data["Name"]],
    version : data["Version"],
    stylesName : data["Style"].map((o) => o["Name"]),
    queryable : data["queryable"],
    gfiFormat : "text/html", // TODO
    projection : data["Projection"]
  };
}
const getDataServiceWMTS = (data) => {
  // ex. de requête pour un WMTS
  // {
  //   "url" : "https://data.geopf.fr/wmts",
  //   "format" : "WMTS",
  //   "version" : "1.0.0",
  //   "layer" : "ACCES.BIOMETHANE",
  //   "outputFormat" : "image/png",
  //   "styleName" : "ACCES.BIOMETHANE",
  //   "tileMatrixSet" : "PM_6_16",
  //   "topLeftCorner" : {"x":-20037508.3427892,"y":20037508.3427892},
  //   "resolutions" : [2445.98490512564,1222.99245256282,611.49622628141,305.748113140705,152.874056570353,76.4370282851762,38.2185141425881,19.1092570712941,9.55462853564703,4.77731426782352,2.38865713391176],
  //   "matrixIds" : [6,7,8,9,10,11,12,13,14,15,16],
  //   "title" : "Cartographie biométhane d’accès aux réseaux",
  //   "description" : "Cette cartographie indique un premier ordre degrandeur du critère technico-économique exprimé en euro/Normalm3/h (€/Nm3/h): plus la valeur de ce critère est basse, meilleures sont les possibilités pour les opérateurs de réseau de réaliser des renforcements pour accueillir du biométhane sur la zone."
  // }
  return {
    url : data["Url"],
    format : "WMTS",
    version : data["Version"],
    layer : data["Identifier"],
    outputFormat : data["Format"][0],
    styleName : data["Style"][0]["Identifier"],
    tileMatrixSet : data["TileMatrixSetLink"][0]["TileMatrixSet"],
    topLeftCorner : {
      x: data["Origin"][0],
      y: data["Origin"][1]
    },
    resolutions : data["Resolutions"],
    matrixIds : data["MatrixIds"],  
    title : data["Title"],
    description : data["Abstract"]
  };
}
/**
 * Créer un document pour un service
 * 
 * @param data 
 * @property {String} data.content - export data
 * @property {String} data.name - name
 * @property {String} data.description - description
 * @property {String} data.format - format : kml, geojson, ...
 * @property {String} data.target - internal, external
 * @property {String} data.type - drawing, import, bookmark
 * @property {String} data.kind - wms, wmts, mapbox
 * @property {Object} data.layer - layer
 */
 const createImportDocument = async (data) => {
  try {
    const o = await service.setDocument(data)
    var uuid = o.uuid;
    var action = o.action;
    
    // rendre public le document
    const s = await service.sharingDocument({
      uuid : uuid,
      type : data.type
    });
    console.debug(s);

    // mise à jour de l'id interne de la couche
    // au cas où le widget LayerImport ne fait pas...
    if (data.layer.gpResultLayerId) {
      data.layer.gpResultLayerId = `bookmark:${data.kind}:${uuid}`;
    }

    // emettre un event pour prévenir l'ajout d'un service
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

</script>

<template>
  <!-- TODO ajouter l'emprise du widget pour la gestion des collisions -->
</template>

<style>
button[id^=GPshowImportPicto-] {
  display: none;
}
dialog[id^=GPcontrolListPanel-] button[id^=GPshowImportPicto-]{
  display: block;
}
</style>
