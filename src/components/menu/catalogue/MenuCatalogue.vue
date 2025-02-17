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
import { useDebounceFn } from '@vueuse/core'

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

/** @type {Reactif} Etat actualisé de la chaine de caractère à chercher dans la barre de recherche */
const searchStringModelValue = ref("");
/** @type {Reactif} property à rechercher mise à jour en prenant en compte le debounce */
const searchString = ref("");

// If no invokation after 300ms due to repeated input,
// the function will be called anyway.
const debouncedFn = useDebounceFn(() => {
  searchString.value = searchStringModelValue.value }
  , 300)

watch(searchStringModelValue, (newVal) => {
  // Sensation de latence plus importante quand on vide la barre de recherche.
  // on update donc dès que c'est vide 
  if (newVal.length == 0) {
    searchString.value = newVal
  }
  else {
    debouncedFn()
  }
})

const searchedLayers = computed(() => {
  return useSearchInArray(Object.values(props.layers), searchString.value, ['title', 'description', 'name'])
});

/** Liste des couches de fonds */
const baseLayers = computed(() => {
  return searchedLayers.value.filter((layer) => {
    if (layer.hasOwnProperty("base") &&  layer.base) {
      return layer
    }
  })
});

/** Liste des couches de données */
const dataLayers = computed(() => {
  return searchedLayers.value.filter((layer) => {
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
        v-model="searchStringModelValue"
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
            list-name="baseLayer"
            :selected-layers="selectedLayers"
            :layers="baseLayers"/>
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
