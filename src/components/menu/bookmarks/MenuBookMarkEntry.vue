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
 * @todo le type service mapbox est à mettre en place
 * @todo le type compute est à mettre en place
 */
export default {
  name: 'MenuBookMarkEntry'
};
</script>

<script setup lang="js">

import { getLayersFromPermalink } from '@/features/permalink.js';

import { toShare } from '@/features/share.js';

// lib notification
import { push } from 'notivue'
import t from '@/features/translation';

import { useClipboard } from '@vueuse/core'
import { useMapStore } from "@/stores/mapStore";

const mapStore = useMapStore();

const clipboardSource = ref('');
const { copy } = useClipboard({ clipboardSource });

/**
 * Options :
 * - type : 'map' ou 'data'
 * - data : {id, name, type, type_fr, icon, date}
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
 * @param data - { id, name, type }
 */
const onAddData = (data) => {
  service.getDocumentById(data.id)
  .then((document) => {
    var fct = null;
    switch (data.type) {
      case "drawing":
        fct = service.getDrawing;
        break;
      case "import":
        fct = service.getImport;
        break;
      case "compute":
        // Ce type de données doit initialisé un contrôle : 
        // - isochrone
        // - profil altimétrique
        // - itineraire
        fct = service.getCompute;
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
    var permalink = false;
    // appel de la requête de télechargement du fichier
    fct.call(service, data.id)
    .then((response) => {
      
      if (data.type === "carte") {
        getLayersFromPermalink(response);
        push.success({
          title: t.bookmark.title,
          message: t.bookmark.success_add_data("permalien")
        });
        return;
      }
      if (data.type === "service") {
        permalink = true;
      }
      if (data.type === "drawing") {
        permalink = true;
      }
      if (data.type === "import") {
        permalink = true;
      }
      if (data.type === "compute") {
        // INFO
        // On emet un event vers le controle, et on lui passe le
        // informations du calcul du document
        // ex. emitter.dispatch('route:compute:called', {...});
        // Le controle va se charger de l'initialisation via l'abonnement
        // à l'evenement
        permalink = true;
      }
      
      // ajout du document dans le permalien pour partage
      if (permalink) {
        var url = toShare(document, {
          opacity: 1, 
          visible: true,
          grayscale: false
        });
        mapStore.addBookmark(url);
      }
    })
    .then(() => {
      push.success({
        title: t.bookmark.title,
        message: t.bookmark.success_add_data(document.extra.format),
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
    uuid : props.data.id,
    type : props.data.type
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
      // TODO
      // prevenir l'utilisateur que le document supprimé
      // ne sera plus disponible sur les cartes enregistrées
      // et donc sur le permalien !
    });
};
const onClickButtonExport = (e) => {
  console.debug(e);
  var data = {
    uuid : props.data.id,
    type : props.data.type
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
const onClickButtonCopyPermalink = (e) => {
  console.debug(e);
  var data = {
    uuid : props.data.id,
    type : props.data.type
  };

  service.getCartes(data.uuid)
  .then((response) => {
    copy(response);
  })
  .then(() => {
    push.success({
      title: t.bookmark.title,
      message: t.bookmark.success_copy_permalink
    });
  })
  .catch((e) => {
    console.error(e);
    push.error({
      title: t.bookmark.title,
      message: t.bookmark.failed_add_data(e.message),
    });
  });

}

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
const buttonsCommon = [
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
const buttonsMap = [
  ...buttonsCommon,
  {
    label: 'Copier',
    icon: "fr-icon-link",
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
    onclick: onClickButtonCopyPermalink
  }
];

const buttonsData = [
  ...buttonsCommon,
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
      @click="onAddData(data)"
    >
      {{ data.name }}
    </DsfrButton>
    <!-- Groupe d'action : 
     - renommer
     - exporter
     - supprimer
    -->
    <div class="container-bookmark-entry-advanced-options">
      <DsfrButtonGroup
        v-if="data.type === 'carte'"
        :buttons="buttonsMap"
        inline-layout-when
        size="sm"
      />
      <DsfrButtonGroup
        v-else
        :buttons="buttonsData"
        inline-layout-when
        size="sm"
      />
    </div>
  </div>
  <!-- Informations :
    - type : service, calcul, croquis, import
    - format? : geojson, ...
    - date?
  -->
  <div class="container-bookmark-entry-advanced-infos fr-hint-text">
    <span v-if="data.type_fr !== 'permalien'"> {{ data.type_fr }}</span>
    <span v-if="data.format"> {{ data.format }}</span>
    <span v-if="data.date"> {{ data.date }}</span>
  </div>
  <!-- Menu pour renommer un favori -->
  <div
    ref="div-rename"
    class="container-bookmark-entry-rename fr-hidden"
  >
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
        @click="onClickButtonCancelRename"
      />
      <DsfrButton
        size="sm"
        icon="ri:check-line"
        tertiary
        no-outline
        class="fr-p-1w"
        @click="onClickButtonValidateRename"
      />
    </div>
  </div>
  <slot />
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


/* FIXME ne marche pas !? */
.bookmark-button-container-advanced {
  margin: unset;
  box-shadow: unset;
}
</style>