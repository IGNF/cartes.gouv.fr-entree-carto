<script lang="js">
  export default {
    name: 'CatalogueMenu'
  }
</script>

<script setup lang="js">
import MenuCatalogueThematique from  '@/components/menu/catalogue/MenuCatalogueThematique.vue'
import LayerList from '@/components/menu/catalogue/LayerList.vue'
import DataLayerCatalogue from '@/components/menu/catalogue/DataLayerCatalogue.vue'
import {getSearchResults} from '@/composables/searchInArray'

import { useLogger } from 'vue-logger-plugin'
import { useMapStore } from "@/stores/mapStore"

const log = useLogger()
const store = useMapStore()

const props = defineProps({
  layers: Object,
  selectedLayers: Object
})

// INFO
// liste des configurations des couches du catalogue
// cf. dataStore.getLayers()
log.debug(props.layers);

const collapsable = true;
const searchString = ref("")

const baseLayers = computed(() => {
  return Object.values(props.layers).filter((layer) => {
    if (layer.hasOwnProperty("base")
    &&  layer.base)
      return layer
  })
})

const dataLayers = computed(() => {
    return Object.values(props.layers).filter((layer) => {
    if (!layer.hasOwnProperty("base")
    ||  !layer.base)
      return layer
  })
})

const tabListName = "Liste des couches"
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
]

const selectedTabIndex = ref(0)
const asc = ref(true)
const initialSelectedIndex = 0

function selectTab (idx) {
  asc.value = selectedTabIndex.value < idx
  selectedTabIndex.value = idx
}

function updateSearch(e) {
  searchString.value = e
}

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
]

const currDataFilter = ref('producteur')

</script>

<template>
<div class="catalogue-container">
  <div class="catalogue-search-bar">
  <DsfrSearchBar
    :model-value="searchString"
    @update:model-value="updateSearch"
  />
  </div>
  <div class="catalogue-content">
  <DsfrTabs
    :tab-list-name="tabListName"
    :tab-titles="tabTitles"
    :initial-selected-index="initialSelectedIndex"
    @select-tab="selectTab"
  >

    <DsfrTabContent
      panel-id="tab-content-0"
      tab-id="tab-0"
      :selected="selectedTabIndex === 0"
      :asc="asc"
    >
    <LayerList
      :selected-layers="selectedLayers"
      :layers="getSearchResults(baseLayers, searchString, ['title', 'description', 'name'])"/>
    </DsfrTabContent>

    <DsfrTabContent
      panel-id="tab-content-1"
      tab-id="tab-1"
      :selected="selectedTabIndex === 1"
      :asc="asc"
    >
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
}

.catalogue-container {
  position: absolute;
  display: flex;
  flex-direction: column;
  width: -webkit-fill-available;
  height: -webkit-fill-available;
}
</style>
