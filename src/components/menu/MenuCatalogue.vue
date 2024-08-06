<script lang="js">
  export default {
    name: 'CatalogueMenu'
  }
</script>

<script setup lang="js">

import { useLogger } from 'vue-logger-plugin'
import { useMapStore } from "@/stores/mapStore"

const log = useLogger()
const store = useMapStore()

const props = defineProps({
  layers: Object
})

// INFO
// liste des configurations des couches du catalogue
// cf. dataStore.getLayers()
log.debug(props.layers);

const buttonLabel = "Liste des couches du catalogue";
const collapsable = true;

// Fonds de carte
const menuItems0 = computed(() => {
  return Object.keys(props.layers)
  .filter((key) => {
    if (props.layers[key].hasOwnProperty("base")
    &&  props.layers[key].base)
      return key
  })
  .filter((key) => {
    if (props.layers[key].title.toLowerCase().includes(searchString.value.toLowerCase()) 
    || props.layers[key].name.toLowerCase().includes(searchString.value.toLowerCase()))
      return key
  })
  .map((key) => {
    return {
        text: props.layers[key].title,
        to: "/?key=" + key,
        id: key
    }
})
})

// Données
const menuItems1 = computed(() => {
  return Object.keys(props.layers)
  .filter((key) => {
    if (!props.layers[key].hasOwnProperty("base")
    ||  !props.layers[key].base)
      return key
  })
  .filter((key) => {
    if (props.layers[key].title.toLowerCase().includes(searchString.value.toLowerCase()) 
    || props.layers[key].name.toLowerCase().includes(searchString.value.toLowerCase()))
      return key
  })
  .map((key) => {
    return {
        text: props.layers[key].title,
        to: "/?key=" + key,
        id: key
    }
})
})

const emit = defineEmits(['onClickSelectLayer'])

/**
 * La selection d'un titre du catalogue permet son affichage
 * @param e 
 */
function onClickSelectLayer(e) {
    // INFO
    // l'ajout de la couche est realisé via la modification
    // du mapStore et la reactivité : cf. src/components/CartoAndTools.vue
    console.log(e)
    const layerId = e.target.baseURI.split("?key=")[1];
    log.debug(layerId);
    store.addLayer(layerId);
}

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

const searchString = ref("")

function updateSearch(e) {
  searchString.value = e
}


</script>

<template>
  <div class="catalogue-search-bar">
    <DsfrSearchBar
    :model-value="searchString"
    @update:model-value="updateSearch"
  />
  </div>
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
      <DsfrSideMenu
        :button-label="buttonLabel"
        :collapsable="collapsable"
        :menu-items="menuItems0"
        @click="onClickSelectLayer"
      />
    </DsfrTabContent>
    <DsfrTabContent
      panel-id="tab-content-1"
      tab-id="tab-1"
      :selected="selectedTabIndex === 1"
      :asc="asc"
    >
    <DsfrSideMenu
        :button-label="buttonLabel"
        :collapsable="collapsable"
        :menu-items="menuItems1"
        @click="onClickSelectLayer"
      />
    </DsfrTabContent>
   
  </DsfrTabs>
</template>

<style scoped>
.catalogue-search-bar {
  margin-bottom: 30px;
  margin-right: 40px;
}
</style>
