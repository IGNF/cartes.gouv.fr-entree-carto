<script lang="js">
/**
 * @description
 * Liste des Favoris avec les documents suivants : 
 * - cartes ou permaliens
 * - données : croquis, imports, calculs et services
 * 
 * @fires emitter#layerimport:open:clicked
 * @todo gestion de l'accessibilité des onglets
 * @todo obtenir plus d'informations complementaires sur les documents
 * @todo mécanisme de date (tag extra de l'API Entrepôt): creation et modification
 */
export default {
  name: 'MenuBookMarkDataList'
};
</script>

<script setup lang="js">

import MenuBookMarkEntry from '@/components/menu/bookmarks/MenuBookMarkEntry.vue';
import { useMapStore } from '@/stores/mapStore';
import { inject } from 'vue';

// lib notification
import { push } from 'notivue'
import t from '@/features/translation';

const mapStore = useMapStore();
const service = inject('services');
const emitter = inject('emitter');

// options
const props = defineProps({
  title: String
});

// recherche de données
const searchString = ref('');
function updateSearch(e) {
  searchString.value = e;
}

// gestion des onglets
const tabListName = 'Liste des données';
const tabTitles = [
  { title: "Cartes", tabId: 'tab-bookmark-maps', panelId: 'tab-content-bookmark-maps'},
  { title: 'Données', tabId: 'tab-bookmark-data', panelId: 'tab-content-bookmark-data' }
];

const selectedIndex = ref(0);

// mapping label i18n FR
const i18n = (label) => {
  var mapping = label;
  if (service.labels.includes(label)) {
      if (label === "drawing") {
        mapping = "croquis";
      }
      if (label === "compute") {
        mapping = "calcul";
      }
  } else {
      mapping = label;
  }
  return mapping;
};
// mapping label icon (dsfr)
const icon = (label) => {
  var icon = "";
  if (service.labels.includes(label)) {
      if (label === "drawing") {
        icon = "ri:pencil-line";
      }
      if (label === "import") {
        icon = "ri:file-upload-line";
      }
      if (label === "service") {
        icon = "ri:cloud-line";
      }
      if (label === "compute") {
        icon = "ri:settings-5-line";
      }
  } else {
      icon = "ri:pencil-line";
  }
  return icon;
};

const update = ref(null);

// liste des données avec filtre sur la recherche (sur le nom complet)
const lstData = computed(() => {
  if (update.value) {
    console.log("update data !");
  }
  var data = [];
  for (const type in service.documents) {
    if (Object.prototype.hasOwnProperty.call(service.documents, type)) {
      if (type === "carte") {
        continue;
      }
      var documents = service.documents[type];
      if (!documents) {
        continue;
      } 
      for (let i = 0; i < documents.length; i++) {
        var document = documents[i];
        // INFO
        // on a des informations partielles sur les documents...
        var extensions = [ ".geojson", ".gpx", ".kml", ".json"];
        var ext = extensions.find((ext) => document.name.includes(ext));
        data.push({
          id : document._id,
          name : (ext) ? document.name.replace(ext, "").slice(0, -1) : document.name,
          type : type,
          type_fr : "", // pas de traduction, sinon utiliser i18n(type)
          icon : icon(type)
        });
      }
    }
  }
  return data.filter((el) => !searchString.value || el.name.includes(searchString.value) );
});

//  liste des cartes avec filtre sur la recherche (sur le nom complet)
const lstMap = computed(() => {
  if (update.value) {
    console.log("update map !");
  }
  var map = [];
  if (service.documents.carte) {
    for (let i = 0; i < service.documents.carte.length; i++) {
      const document = service.documents.carte[i];
      map.push({
        id : document._id,
        name : document.name,
        type : "carte",
        type_fr : "", // pas de traduction, sinon ex. "carte", "permalien"
        icon : "ri-map-2-line",
      });
    }
  }
  return map.filter((el) => !searchString.value || el.name.includes(searchString.value) );
});

const onUpdateBookmark = (e) => {
  console.log(e);
  // mise à jour du menu si 
  // - nouveau document
  // - mise à jour
  // - suppression
  // attention à la mise à jour du même document !
  var timestamp = Date.now();
  update.value = Object.assign(e, { timestamp : timestamp });
}

// abonnements
emitter.addEventListener("document:saved", onUpdateBookmark);
emitter.addEventListener("document:updated", onUpdateBookmark);
emitter.addEventListener("document:deleted", onUpdateBookmark);
emitter.addEventListener("document:exported", onUpdateBookmark);

/**
 * gestionnaire d'evenements
 * 
 * Action d'enregistrement du document sur l'espace personnel :
 * - un permalien pour "Enregistrer la carte"
 * - une donnée de type vecteur ou service pour "Ajouter une donnée"
 * @fires emitter#layerimport:open:clicked
 */
const addMap = () => {
  refDivMapName.value.classList.toggle("fr-hidden");
};
const addData = () => {
  // envoi d'un evenement pour l'ouverture du contrôle d'import de données
  // et le widget realise l'enregistrement automatique dans l'espace personnel
      // envoi d'un evenement pour l'ouverture du contrôle d'import de données
      emitter.dispatchEvent("layerimport:open:clicked", {
        open : true,
        componentName: "LayerImport"
      });
      emitter.dispatchEvent("leftmenu:close", {
        open : false,
        componentName: "LeftMenu"
      });
};

const refDivMapName = useTemplateRef('div-map-name');
const name = ref('');

const onClickMapButtonValidateName = (e) => {
  refDivMapName.value.classList.toggle("fr-hidden");
  // recupèrer le permalien
  var permalink = mapStore.permalink;
  
  // fournir un nom au document via UI avec bouton valider / annuler 
  const data = {
    name : name.value,
    description : "permalien",
    format : "json",
    target : "internal",
    type : "carte",
    content : JSON.stringify({
      name : name.value,
      date : new Date().toISOString(),
      permalink : permalink
    })
  };

  createCarteDocument(data)
  .then(() => {
    // refDivMapName.value.classList.toggle("fr-hidden");
  })
  .then(() => {
    name.value = "";
  })
  .then(() => {
    // notification
    push.success({
      title: t.bookmark.title,
      message: t.bookmark.success_save_map
    });
  })
  .catch((e) => {
    console.error(e);
    push.error({
      title: t.bookmark.title,
      message: t.bookmark.failed_save_map
    });
  });
  
};
const onClickMapButtonCancelName  = (e) => {
  refDivMapName.value.classList.toggle("fr-hidden");
};

const createCarteDocument = async (data) => {
  // enregistrement du permalien dans un document
  // avec le nom fourni par l'utilisateur
  try {
    const o = await service.setDocument(data)
    var uuid = o.uuid;
    var action = o.action;

    // emettre un event pour prévenir l'ajout d'un document
    // au composant des favoris
    emitter.dispatchEvent("document:saved", {
      uuid : uuid,
      action : action // added, updated, deleted
    });

    return o;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

onBeforeMount(() => {});

onMounted(() => {});

</script>

<template>
  <div class="fr-container fr-p-1w">
    <h4 v-if="title">
      {{ title }}
    </h4>
    <!-- Module de recherche des données utilisateur -->
    <div class="search-bookmark fr-p-1w">
      <DsfrSearchBar
        v-model="searchString"
        label="Rechercher un enregistrement"
        @update:model-value="updateSearch"
      />
    </div>

    <!-- Module d'affichage des données sur 2 rubriques : 
      - cartes : permaliens
      - données : croquis, imports, calculs et services
    -->
    <div class="tabs-bookmark fr-p-1w">
      <DsfrTabs
        id="tabs-bookmark"
        v-model="selectedIndex"
        :tab-list-name="tabListName"
        :tab-titles="tabTitles"
      >
        <!-- TODO Ajouter l'accessibilité avec l'update vers la v6 ou sup
        <template #tab-items>
          <DsfrTabItem
            v-for="(tab, index) of tabTitles"
            :key="tab.tabId"
            :tab-id="tab.tabId"
            :panel-id="tab.panelId"
            @click="selectedTabBookmarkIndex = index"
            @next="selectNext()"
            @previous="selectPrevious()"
            @first="selectFirst()"
            @last="selectLast()">
            {{ tab.title }}
          </DsfrTabItem>
        </template> 
        -->

        <DsfrTabContent
          panel-id="tab-content-bookmark-maps"
          tab-id="tab-bookmark-maps"
        >
          <!-- Bouton pour enregistrer la carte -->
          <DsfrButton
            label="Enregistrer la carte"
            tertiary
            size="sm"
            class="button-action"
            icon="fr-icon-save-line"
            @click="addMap()"
          />
          <!-- Affichage du menu pour nommer le permalien dans les favoris -->
          <div
            ref="div-map-name"
            class="container-bookmark-map-name fr-hidden"
          >
            <DsfrInput
              v-model="name"
              label="Nommer"
              placeholder=""
            />
            <div class="container-bookmark-map-buttons-name">
              <DsfrButton
                size="sm"
                icon="ri:close-line"
                tertiary
                no-outline
                class="fr-p-1w"
                @click="onClickMapButtonCancelName"
              />
              <DsfrButton
                size="sm"
                icon="ri:check-line"
                tertiary
                no-outline
                class="fr-p-1w"
                @click="onClickMapButtonValidateName"
              />
            </div>
          </div>
          <!-- Affichage des cartes ou permaliens -->
          <div
            v-for="map in lstMap"
            class="container-bookmark-map-item fr-p-1w"
          >
            <MenuBookMarkEntry
              :data="map"
              type="map"
            />
          </div>
        </DsfrTabContent>

        <DsfrTabContent
          panel-id="tab-content-bookmark-data"
          tab-id="tab-bookmark-data"
        >
          <!-- Bouton pour importer un fichier -->
          <DsfrButton
            label="Ajouter une donnée"
            tertiary
            size="sm"
            class="button-action"
            icon="fr-icon-upload-line"
            @click="addData()"
          />
          <!-- Affichage des données :
            - nom
            - icone en fonction du type de données
            - type de données
            - date
            - menu options : renommer, partager, supprimer
          -->
          <div
            v-for="data in lstData"
            class="container-bookmark-data-item fr-p-1w"
          >
            <MenuBookMarkEntry
              :data="data"
              type="data"
            />
          </div>
        </DsfrTabContent>
      </DsfrTabs>
    </div>
  </div>
</template>

<style>
.container-bookmark-map-name {
  display: flex;
}
.container-bookmark-map-buttons-name {
  display: flex;
}
</style>

<style lang="css" scoped>
#tab-content-bookmark-maps,
#tab-content-bookmark-data {
  overflow-y: scroll;
  scrollbar-width: thin;
  overflow-x: hidden;
  max-height: calc(76.8vh - 270px);
  padding: 1em;
}
.button-action {
    display: flex;
    width: 100%;
    justify-content: center;
}
</style>

