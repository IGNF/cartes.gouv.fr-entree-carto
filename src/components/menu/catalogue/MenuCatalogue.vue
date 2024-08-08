<script lang="js">
  export default {
    name: 'CatalogueMenu'
  }
</script>

<script setup lang="js">
import MenuCatalogueThematique from  '@/components/menu/catalogue/MenuCatalogueThematique.vue'

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

const collapsable = true;
const searchString = ref("")

// Fonds de carte
const baseLayers = computed(() => {
  return Object.values(props.layers)
  .filter((layer) => {
    if (layer.hasOwnProperty("base")
    &&  layer.base)
      return layer
  })
  .map((layer) => {
    return {
        text: layer.title,
        to: "/?key=" + layer.key,
        id: layer.key
    }
})
})

// Données
const dataLayers = computed(() => {
  return Object.values(props.layers)
  .filter((layer) => {
    if (!layer.hasOwnProperty("base")
    ||  !layer.base)
      return layer
  })
  .map((layer) => {
    return {
        text: layer.title,
        to: "/?key=" + layer.key,
        id: layer.key
    }
})
})

const thematicDataLayers = computed(() => {
  let arr = [... new Set(Object.values(props.layers)
  .filter((layer) => {
    if (layer.hasOwnProperty("thematic")
      && layer.thematic.length > 0)
      return layer.thematic
  })
  .map(l => l.thematic)
)]
.map((thematic) => {
  return {
    thematicLabel : thematic,
    layers : Object.values(props.layers)
                    .filter(l => l.hasOwnProperty("thematic") && thematic == l.thematic)
                    .map(l => l)
  }
})

arr.push({
    thematicLabel : "Autres",
    layers : Object.values(props.layers)
                    .filter((l) => {
                      if(!l.hasOwnProperty("thematic") || l.thematic.length == 0)
                        return l
                    })
  })

  return arr
})



const thematicBaseLayers = computed(() => {
  let arr = [... new Set(Object.values(props.layers)
  .filter((layer) => {
    if (layer.hasOwnProperty("base")
    &&  layer.base
      && layer.hasOwnProperty("thematic")
      && layer.thematic.length > 0)
      return layer.thematic
  })
  .map(l => l.thematic)
)]
.map((thematic) => {
  return {
    thematicLabel : thematic,
    layers : Object.values(props.layers)
                    .filter(l => layer.hasOwnProperty("base") && l.hasOwnProperty("thematic") && thematic == l.thematic)
                    .map(l => l)
  }
})

arr.push({
    thematicLabel : "Autres",
    layers : Object.values(props.layers)
                    .filter((l) => {
                      if(l.hasOwnProperty("base")
                      &&  l.base
                      && (!l.hasOwnProperty("thematic") || l.thematic.length == 0))
                        return l
                    })
  })

  return arr
})

const baseLayerMenu = computed(() => {
  return createMenuConf(thematicBaseLayers)
})

const dataLayerMenu = computed(() => {
  return createMenuConf(thematicDataLayers)

})

function createMenuConf(thematicLayers) {
  return thematicLayers.value.map(thematic => {
    let l = thematic.layers.filter((layer) => {
        if (layer.title.toLowerCase().includes(searchString.value.toLowerCase()) 
        || layer.name.toLowerCase().includes(searchString.value.toLowerCase()))
          return layer
      })
      let ret = l.map((layer) => {
          return {
              text: layer.title,
              to: "/?key=" + layer.key,
              id: layer.key
          }
      })
      return {
        thematicLabel : thematic.thematicLabel,
        layers: ret
      }
  });
}

const emit = defineEmits(['onClickSelectLayer'])

/**
 * La selection d'un titre du catalogue permet son affichage
 * @param e 
 */
function onClickSelectLayer(e) {
    // INFO
    // l'ajout de la couche est realisé via la modification
    // du mapStore et la reactivité : cf. src/components/CartoAndTools.vue
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


function updateSearch(e) {
  searchString.value = e
}


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
    <KeepAlive>
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
      <template v-for="thematic in baseLayerMenu" :key="thematic.thematicLabel">
        <DsfrAccordionsGroup>
        <MenuCatalogueThematique v-if="thematic.layers.length > 0"
          :thematic-label="thematic.thematicLabel"
          :layers-count="thematic.layers.length">
          <DsfrSideMenu
            :collapsable="collapsable"
            :menu-items="thematic.layers"
            @click="onClickSelectLayer"
          />
        </MenuCatalogueThematique>
      </DsfrAccordionsGroup>
      </template>
    </DsfrTabContent>

    <DsfrTabContent
      panel-id="tab-content-1"
      tab-id="tab-1"
      :selected="selectedTabIndex === 1"
      :asc="asc"
    >
      <template v-for="thematic in dataLayerMenu" :key="thematic.thematicLabel">
      <DsfrAccordionsGroup>
        <MenuCatalogueThematique v-if="thematic.layers.length > 0"
          :thematic-label="thematic.thematicLabel"
          :layers-count="thematic.layers.length">
          <DsfrSideMenu
          :collapsable="collapsable"
          :menu-items="thematic.layers"
          @click="onClickSelectLayer"
        /> 
        </MenuCatalogueThematique>
      </DsfrAccordionsGroup>
      </template>
    </DsfrTabContent>
   
  </DsfrTabs>
</KeepAlive>
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
