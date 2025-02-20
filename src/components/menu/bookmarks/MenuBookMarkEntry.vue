<script lang="js">
/**
 * @description
 * Entrée d'un favori :
 * - nom
 * - icone en fonction du type de données
 * - type de données
 * - date (creer et modifier)
 * - menu options : renommer, partager, supprimer
 * 
 * En cliquant sur une entrée, la donnée est ajoutée à la carte.
 * On procede :
 * - récupèration des informations complementaires
 * - téléchargement du fichier
 * - enregistrement de l'ID dans la couche native : 
 *   ex. gpResultLayerId = 'bookmark:drawing-kml:3fa85f64-5717-4562-b3fc-2c963f66afa5'
 * 
 * @todo gestion des exceptions sur les actions avec notification
 * @todo renommer un favoris
 * @todo le type service mapbox est à mettre en place
 * @todo le type compute est à mettre en place
 */
export default {
  name: 'MenuBookMarkEntry'
};
</script>

<script setup lang="js">

import { 
  createVectorLayer, 
  createServiceLayer,
  createMapBoxLayer 
} from '@/features/ol.js';

import { getLayersFromPermalink } from '@/features/permalink.js';

// lib notification
import { push } from 'notivue'
import t from '@/features/translation';

import { useMapStore } from "@/stores/mapStore";
const mapStore = useMapStore();

/**
 * Options :
 * - type : 'map' ou 'data'
 * - data : {id, name, ext, type, type_fr, icon, date}
 */
const props = defineProps({
  type : String,
  data : Object
});

const service = inject('services');
const emitter = inject('emitter');

/**
 * Gestionnaire d'evenement d'affichage de la couche sur la carte
 * 
 * @param data - {id, name, format, type, type_fr, icon, date}
 */
const displayDataOnMap = (data) => {
  service.getDocumentById(data.id)
  .then((infos) => {
    var fct = null;
    switch (data.type) {
      case "drawing":
        fct = service.getDrawing;
        break;
      case "import":
        fct = service.getImport;
        break;
      case "compute":
        // TODO
        // Ce type de données doit initialisé un contrôle : 
        // - isochrone
        // - profil altimétrique
        // - itineraire
        fct = service.getCompute;
        throw new Error(t.bookmark.failed_not_yet_implemented(data.type));
        break;
      case "service":
        fct = service.getService;
        break;
      case "carte":
        fct = service.getCartes;
        break;
      default:
        break;
    }
    if (!fct) {
      throw new Error(t.bookmark.failed_type_unknow(data.type));
    }
    // appel de la requête de télechargement du fichier
    fct.call(service, data.id)
    .then((response) => {
      
      var opts = {};
      var target = {};
      var layer = null;
      
      // creation de l'objet layer pour afficher un Vecteur ou un Service
      if (data.type === "carte") {
        getLayersFromPermalink(response);
        push.success({
          title: t.bookmark.title,
          message: t.bookmark.success_add_data("permalien")
        });
        return;
      } else if (data.type === "service") {
        // les reponses possibles :
        // - style (json) ou url pour mapbox, 
        // - liste de parametres (json) pour wms et wmts
        opts = {
          id : data.id,
          title : data.name,
          description : infos.description,
          format : infos.extra.format // wms, wmts ou mapbox
        };
        if (infos.extra.format === "mapbox") {
          target = (infos.extra.target && infos.extra.target === "internal") ? { data : response } : { url : response };
          createMapBoxLayer({
            ...opts,
            ...target
          })
          .then((layer) => {
            mapStore.getMap().addLayer(layer);
            push.success({
              title: t.bookmark.title,
              message: t.bookmark.success_add_data("mapbox"),
            });
          })
          .catch((e) => {
            throw t.ol.failed_mapbox(e);
          });
          return;
        } else {
          target = { data : response };
          layer = createServiceLayer({
            ...opts,
            ...target
          });
        }
      } else {
        opts = {
          id : data.id,
          extended : true, // on utilise le format étendu de GeoJSON, KML et GPX (sauf pour mapbox)
          title : data.name,
          description : infos.description,
          format : infos.extra.format,
          type : data.type
        };
        if (infos.extra.format === "mapbox") {
          target = { data : response };
          createMapBoxLayer({
            ...opts,
            ...target
          })
          .then((layer) => {
            mapStore.getMap().addLayer(layer);
            push.success({
              title: t.bookmark.title,
              message: t.bookmark.success_add_data("mapbox"),
            });
          })
          .catch((e) => {
            throw t.ol.failed_mapbox(e);
          });
          return;
        } else {
          target = (infos.extra.target && infos.extra.target === "external") ? { url : response } : { data : response };
          layer = createVectorLayer({
            ...opts,
            ...target
          });
        }
      }
      // ajout de la couche sur la carte
      mapStore.getMap().addLayer(layer);
      push.success({
        title: t.bookmark.title,
        message: t.bookmark.success_add_data(infos.extra.format),
      });
    })
    .catch((e) => {
      throw e;
    });
  })
  .catch((e) => {
    console.error(e);
    push.error({
      title: t.bookmark.title,
      message: t.bookmark.failed_add_data(e.message),
    });
  })
};

onBeforeMount(() => {});

onMounted(() => {});

const refDivRename = useTemplateRef('div-rename');
const rename = ref('');

const onClickButtonRename = (e) => {
  console.debug(e);
  refDivRename.value.classList.toggle("fr-hidden");
  rename.value = props.data.name;
};
const onClickButtonDelete = (e) => {
  console.debug(e);
  var data = {
    uuid : e.target.dataset.id,
    type : e.target.dataset.type
  };
  service.deleteDocument(data)
    .then((o) => {
      // emettre un event pour prévenir de la suppression d'un document
      // au composant des favoris
      emitter.dispatchEvent("document:deleted", {
        uuid : o.uuid,
        action : o.action // added, updated, deleted
      });
    })
    .then(() => {
      // FIXME
      // doit on modifier le statut de la couche dans le gestionnaire de couche ?
      // ex. modifier gpResultLayerId avec le type (drawing, layerimport, compute, ...)
    });
};
const onClickButtonExport = (e) => {
  console.debug(e);
  var data = {
    uuid : e.target.dataset.id,
    type : e.target.dataset.type
  };
  service.exportDocument(data)
  .then((o) => {
    // emettre un event pour prévenir de l'export d'un document
    // au composant des favoris
    emitter.dispatchEvent("document:exported", {
      uuid : o.uuid,
      action : o.action // added, updated, deleted
    });
    return o;
  })
  .then((o) => {
    var mimeType = o.extra.mimeType;
    var content = o.extra.content;
    var name = o.extra.name;
    var ext = o.extra.ext;
  
    // au cas où...
    var filename = (name.includes(ext)) ? name : name + "." + ext;
  
    var link = document.createElement("a");
    // determiner le bon charset !
    var charset = "utf-8";
    link.setAttribute("href", "data:" + mimeType + ";charset=" + charset + "," + encodeURIComponent(content));
    link.setAttribute("download", filename);
    if (document.createEvent) {
      var event = document.createEvent("MouseEvents");
      event.initEvent("click", true, true);
      link.dispatchEvent(event);
    } else {
      link.click();
    }
  });
};

const onClickButtonValidateRename = (e) => {
  console.debug(e);
  var data = {
    uuid : props.data.id,
    type : props.data.type,
    name : rename.value
  };
  
  if (rename.value === props.data.name) {
    return;
  }

  service.renameDocument(data)
  .then((o) => {
    // emettre un event pour prévenir la modification d'un document
    // au composant des favoris
    emitter.dispatchEvent("document:updated", {
      uuid : o.uuid,
      action : o.action // added, updated, deleted
    });
  })
  .then(() => {
    // FIXME
    // doit on fermer dés que l'action est realisée ?
    refDivRename.value.classList.toggle("fr-hidden");
  })
  .then(() => {
    // FIXME
    // doit on modifier les informations du gestionnaire de couche ?
    // ex. modifier Name
  });

};
const onClickButtonCancelRename  = (e) => {
  refDivRename.value.classList.toggle("fr-hidden");
};

// INFO
// on ajoute des informations utiles directement dans le dataset des boutons
// - data-id : uuid
// - data-type : ex. drawing, import, carte...
const buttonsMap = [
{
    label: 'Renommer',
    icon: "fr-icon-edit-line",
    "data-id": props.data.id,
    "data-type": props.data.type,
    "data-name": props.data.name,
    disabled: false,
    iconOnly: true,
    iconRight: false,
    secondary: true,
    noOutline: true,
    style: "margin: unset;box-shadow: unset;",
    class: 'bookmark-button-container-advanced',
    onclick: onClickButtonRename
  },
  {
    label: 'Supprimer',
    icon: "fr-icon-delete-line",
    "data-id": props.data.id,
    "data-type": props.data.type,
    "data-name": props.data.name,
    disabled: false,
    iconOnly: true,
    iconRight: false,
    secondary: true,
    noOutline: true, 
    style: "margin: unset;box-shadow: unset;",
    class: 'bookmark-button-container-advanced',
    onclick: onClickButtonDelete
  }
];

const buttonsData = [
  ...buttonsMap,
  {
    label: 'Exporter',
    icon: "fr-icon-download-line",
    "data-id": props.data.id,
    "data-type": props.data.type,
    "data-name": props.data.name,
    disabled: false,
    iconOnly: true,
    iconRight: false,
    secondary: true,
    noOutline: true,
    style: "margin: unset;box-shadow: unset;",
    class: 'bookmark-button-container-advanced',
    onclick: onClickButtonExport
  }
];

</script>

<template>
  <!-- Menu d'un favori -->
  <div class="container-bookmark-entry">
    <!-- Bouton de selection d'un favori à afficher sur la carte -->
    <DsfrButton 
      :data-id="data.id"
      :data-type="data.type"
      :title="data.name"
      class="button-bookmark-entry"
      tertiary
      no-outline
      :icon="data.icon"
      @click="displayDataOnMap(data)">
        {{ data.name }}
    </DsfrButton>
    <!-- Groupe d'action : 
     - renommer
     - exporter
     - supprimer
    -->
    <div class="container-bookmark-entry-advanced-options">
      <DsfrButtonGroup v-if="data.type === 'carte'"
        :buttons="buttonsMap"
        inlineLayoutWhen
        size="sm" />
      <DsfrButtonGroup v-else
        :buttons="buttonsData"
        inlineLayoutWhen
        size="sm" />
    </div>
  </div>
  <!-- Informations :
    - type : service, calcul, croquis, import
    - format? : geojson, ...
    - date?
  -->
  <div class="container-bookmark-entry-advanced-infos fr-hint-text">
    <span>{{ data.type_fr }}</span>
    <span v-if="data.format"> - {{ data.format }}</span>
    <span v-if="data.date"> - {{ data.date }}</span>
  </div>
  <!-- Menu pour renommer un favori -->
  <div ref="div-rename" class="container-bookmark-entry-rename fr-hidden">
    <DsfrInput
      v-model="rename"
      label="Renommer"
      placeholder=""
    />
    <div class="container-bookmark-entry-buttons-rename">
      <DsfrButton
        size="sm"
        icon="ri:close-line"
        tertiary
        no-outline
        class="fr-p-1w"
        @click="onClickButtonCancelRename" />
      <DsfrButton
        size="sm"
        icon="ri:check-line"
        tertiary
        no-outline
        class="fr-p-1w"
        @click="onClickButtonValidateRename" />
    </div>
  </div>
  <slot></slot>
</template>

<style>
.container-bookmark-entry {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: wrap;
  align-content: center;
  align-items: baseline;
}
.button-bookmark-entry {
  width: 210px;
}
.button-bookmark-entry > span {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.container-bookmark-entry-rename {
  display: flex;
}
.container-bookmark-entry-buttons-rename {
  display: flex;
}


// FIXME ne marche pas !?
.bookmark-button-container-advanced {
  margin: unset;
  box-shadow: unset;
}
</style>