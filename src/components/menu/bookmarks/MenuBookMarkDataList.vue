<script lang="js">
/**
 * @description
 * Liste des Favoris avec les documents suivants : 
 * - cartes ou permaliens
 * - données : croquis, imports, calculs et services
 * 
 * @fires emitter#layerimport:open:clicked
 * @todo gestion de l'accessibilité des onglets
 * @todo handler sur les boutons d'enregistrement de cartes ou de fichiers
 * @todo mécanisme de date (tag extra de l'API Entrepôt): creation et modification
 */
export default {
  name: 'MenuBookMarkDataList'
};
</script>

<script setup lang="js">

import MenuBookMarkEntry from '@/components/menu/bookmarks/MenuBookMarkEntry.vue';

import { inject } from 'vue';
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

const initialSelectedIndex = 1;
const selectedTabBookmarkIndex = ref(initialSelectedIndex);
function selectTabBookmark (idx) {
  selectedTabBookmarkIndex.value = idx;
}

const service = inject('services');

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
        icon = "fr-icon-edit-line";
      }
      if (label === "import") {
        icon = "fr-icon-file-download-line";
      }
      if (label === "service") {
        icon = "fr-icon-cloud-line";
      }
      if (label === "compute") {
        icon = "fr-icon-settings-5-line";
      }
  } else {
      icon = "fr-icon-pencil-line";
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
  for (const key in service.documents) {
    if (Object.prototype.hasOwnProperty.call(service.documents, key)) {
      if (key === "carte") {
        continue;
      }
      var elements = service.documents[key];
      if (!elements) {
        continue;
      } 
      for (let i = 0; i < elements.length; i++) {
        var element = elements[i];
        // FIXME 
        // date : information non dispo
        // format : information non dispo
        var extensions = [ "geojson", "gpx", "kml", "json"];
        var ext = extensions.find((ext) => element.name.includes(ext));
        data.push({
          id : element._id,
          name : (ext) ? element.name.replace(ext, "").slice(0, -1) : element.name,
          format : ext || "",
          type : key,
          type_fr : i18n(key),
          icon : icon(key),
          date : ""
        });
      }
    }
  }
  return data.filter((el) => !searchString.value || el.name.includes(searchString.value) );
});

// liste des cartes avec filtre sur la recherche (sur le nom complet)
const lstMap = computed(() => {
  if (update.value) {
    console.log("update map !");
  }
  var map = [];
  if (service.documents.carte) {
    for (let i = 0; i < service.documents.carte.length; i++) {
      const element = service.documents.carte[i];
      map.push({
        id : element._id,
        name : element.name,
        format : null,
        type : "carte",
        type_fr : "permalien",
        icon : "fr-icon-link", // icon de permalien
        date : ""
      });
    }
  }
  return map.filter((el) => !searchString.value || el.name.includes(searchString.value) );
});

const onAddBookmark = (e) => {
  console.log(e.uuid);
  // mise à jour du menu si nouveau uuid !
  update.value = e.uuid;
}

// abonnements
emitter.addEventListener("drawing:saved", onAddBookmark);

/**
 * gestionnaire d'evenements
 * 
 * Action d'enregistrement du document sur l'espace personnel :
 * - un permalien pour "Enregistrer la carte"
 * - une donnée de type vecteur ou service pour "Ajouter une donnée"
 * @fires emitter#layerimport:open:clicked
 */
const addMap = () => {};
const addData = () => {
  // envoi d'un evenement pour l'ouverture du contrôle d'import de données
  // et le widget realise l'enregistrement automatique dans l'espace personnel
  emitter.dispatchEvent("layerimport:open:clicked", {
    open : true,
    componentName: "LayerImport"
  });
};

onBeforeMount(() => {});

onMounted(() => {});

</script>

<template>
  <div class="fr-container fr-p-1w">
    <h4 v-if="title">{{ title }}</h4>
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
        :tab-list-name="tabListName"
        :tab-titles="tabTitles"
        :initial-selected-index="initialSelectedIndex"
        @select-tab="selectTabBookmark">

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
          :selected="selectedTabBookmarkIndex === 0">
          <!-- Bouton pour enregistrer la carte -->
          <DsfrButton
            label="Enregistrer la carte"
            disabled
            tertiary
            size="sm"
            class="button-action"
            icon="fr-icon-save-line"
            @click="addMap()"/>
          <!-- Affichage des cartes ou permaliens -->
          <div class="container-bookmark-map-item fr-p-1w" v-for="map in lstMap">
            <MenuBookMarkEntry :data="map" type="map"></MenuBookMarkEntry>
          </div>
        </DsfrTabContent>

        <DsfrTabContent
          panel-id="tab-content-bookmark-data"
          tab-id="tab-bookmark-data"
          :selected="selectedTabBookmarkIndex === 1">
          <!-- Bouton pour importer un fichier -->
          <DsfrButton
            label="Ajouter une donnée"
            tertiary
            size="sm"
            class="button-action"
            icon="fr-icon-upload-line"
            @click="addData()"/>
          <!-- Affichage des données :
            - nom
            - icone en fonction du type de données
            - type de données
            - date
            - menu options : renommer, partager, supprimer
          -->
          <div class="container-bookmark-data-item fr-p-1w" v-for="data in lstData">
            <MenuBookMarkEntry :data="data" type="data"></MenuBookMarkEntry>
          </div>
        </DsfrTabContent>

      </DsfrTabs>
    </div>
  </div>
</template>

<style lang="css" scoped>
#tab-content-bookmark-maps,
#tab-content-bookmark-data {
  overflow-y: scroll;
  scrollbar-width: thin;
  overflow-x: hidden;
  max-height: calc(70vh - 270px);
  padding: 1em;
}
.button-action {
    display: flex;
    width: 100%;
    justify-content: center;
}
</style>

