<script lang="js">
/**
 * @description
 * Liste des Favoris : 
 * - cartes ou permaliens
 * - données : croquis, imports, calculs et services
 * 
 * @todo accessibilité des onglets
 * @todo handler sur les boutons d'enregistrement de cartes ou de fichiers
 */
export default {
  name: 'MenuBookMarkDataList'
};
</script>

<script setup lang="js">

import MenuBookMarkEntry from '@/components/menu/bookmarks/MenuBookMarkEntry.vue';

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

// mapping label i18n
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

// liste des données avec filtre sur la recherche (sur le nom complet)
const lstData = computed(() => {
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
        data.push({
          id : element._id,
          full_name : element.name,
          name : element.name.substring(0, element.name.lastIndexOf('.')),
          ext : element.name.substring(element.name.lastIndexOf('.') + 1),
          type : key,
          type_fr : i18n(key),
          icon : icon(key),
          date : "" // FIXME information non dispo
        });
      }
    }
  }
  return data.filter((el) => !searchString.value || el.full_name.includes(searchString.value) );
});

// liste des cartes avec filtre sur la recherche (sur le nom complet)
const lstMap = computed(() => {
  var map = [];
  if (service.documents.carte) {
    for (let i = 0; i < service.documents.carte.length; i++) {
      const element = service.documents.carte[i];
      map.push({
        id : element._id,
        full_name : element.name,
        name : element.name,
        ext : null,
        type : "carte",
        type_fr : "permalien",
        icon : "fr-icon-link", // icon de permalien
        date : "" // FIXME information non dispo
      });
    }
  }
  return map.filter((el) => !searchString.value || el.full_name.includes(searchString.value) );
});

// TODO gestionnaire d'evenements :
// Action d'enregistrement du document sur l'espace personnel
const addMap = () => {};
const addData = () => {};

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
            tertiary
            size="sm"
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
            label="Ajouter un fichier"
            tertiary
            size="sm"
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
}
</style>