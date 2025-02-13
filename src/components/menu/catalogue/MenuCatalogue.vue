<script lang="js">
  /**
   * @description
   * ...
   * @property {Object} layers - Liste des couches du catalogue
   * @property {Object} selectedLayers - Liste des couches sélectionnées
   * @see LayerList
   * @see DataLayerCatalogue
   */
  export default {
    name: 'CatalogueMenu'
  };
</script>

<script setup lang="js">
import LayerList from '@/components/menu/catalogue/LayerList.vue';
import DataLayerCatalogue from '@/components/menu/catalogue/DataLayerCatalogue.vue';

import { useSearchInArray } from '@/composables/searchInArray';
import { useLogger } from 'vue-logger-plugin';
import { useMapStore } from "@/stores/mapStore";

const log = useLogger();
const store = useMapStore();

const props = defineProps({
  layers: Object,
  selectedLayers: Object
});

/**
 * Definition d'une variable reactive
 * @typedef {Object} Reactif
 */

// INFO
// liste des configurations des couches du catalogue
// cf. dataStore.getLayers()
log.debug(props.layers);

const collapsable = true;

/** @type {Reactif} property à rechercher */
const searchString = ref("");

/** Liste des couches de fonds */
const baseLayers = computed(() => {
  return Object.values(props.layers).filter((layer) => {
    if (layer.hasOwnProperty("base") &&  layer.base) {
      return layer
    }
  })
});

/** Liste des couches de données */
const dataLayers = computed(() => {
  return Object.values(props.layers).filter((layer) => {
    if (!layer.hasOwnProperty("base") || !layer.base) {
      return layer;
    }
  })
});

/** Titre principal */
const tabListName = "Liste des couches";

/** Titres des onglets + lien ID et panneaux à afficher */
const tabTitles = [
  {
    title : "Fonds de carte",
    tabId : "tab-0",
    panelId : "tab-content-0"
  },
  {
    title : "Données",
    tabId : "tab-1",
    panelId : "tab-content-10"
  }
];

/** @type {Reactif} Ordre de tri */
const asc = ref(true);

/** @type {Reactif} Index de l'onget sélectionné */
const selectedIndex = ref(0);

/** Mise à jour du mot clef de recherche */
function updateSearch(e) {
  searchString.value = e;
}

/** Sous categories */
const dataFilters = [
  {
    label: "Producteur",
    value: "producteur"
  },
  {
    label: "Thème",
    value: "theme"
  },
  {
    label: "Tout",
    value: "tout"
  }
];

/** @type {Reactif} La sous categore courrante */
const currDataFilter = ref('producteur');

</script>

<template>
  <div class="catalogue-container">
    <div class="catalogue-search-bar">
      <!-- Barre de recherche :
       >>> on transmet le mot clef de recherche
       >>> on sauvegarde ce mot clef pour les autres composants
      -->
      <DsfrSearchBar
        :model-value="searchString"
        @update:model-value="updateSearch"
      />
    </div>
      <!-- Liste des onglets -->
      <DsfrTabs
        :tab-list-name="tabListName"
        :tab-titles="tabTitles"
        v-model="selectedIndex"
      >
        <!-- Contenu de l'onglet sélectionné par defaut : les fonds de cartes -->
        <DsfrTabContent
          class="catalogue-content"
          panel-id="tab-content-0"
          tab-id="tab-0"
          :asc="asc"
        >
          <!-- Liste des fonds de carte et celles selectionnées
           >>> on transmet aussi la liste des couches issues de la recherche
          -->
          <LayerList
            :list-name="'dataLayer'"
            :selected-layers="selectedLayers"
            :layers="useSearchInArray(baseLayers, searchString, ['title', 'description', 'name'])"/>
        </DsfrTabContent>

        <!-- Contenu d'un autre onglet : les données catégorisées -->
        <DsfrTabContent
          panel-id="tab-content-1"
          tab-id="tab-1"
          :asc="asc"
        >
          <!-- Les sous categories -->
          <DsfrRadioButtonSet
            :inline="true"
            :model-value="currDataFilter"
            :small="true"
            :name="'filtre'"
            :options="dataFilters"
            @update:model-value="currDataFilter = $event"
          />
          <DataLayerCatalogue
            :data-layers="dataLayers"
            :curr-data-filter="currDataFilter"
            :search-string="searchString"
            :selected-layers="selectedLayers"
          />
      </DsfrTabContent>
      </DsfrTabs>
  </div>
</template>

<style scoped>
.catalogue-search-bar {
  margin-bottom: 30px;
  margin-right: 40px;
  top: 0px;
}

.catalogue-content {
  overflow-y: scroll;
  scrollbar-width: thin;
  overflow-x: hidden;
  max-height: calc(70vh - 180px);
}

.catalogue-container {
  position: absolute;
  display: flex;
  flex-direction: column;
  width: calc(100% - 60px);
  max-height: calc(70vh - 96px);
}
</style>
