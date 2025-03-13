<script lang="js">
  /**
   * @description
   * ...
   * @property {Object} dataLayers
   * @property {String} currDataFilter
   * @property {Object} selectedLayers
   */
  export default {
    name: 'DataLayerCatalogue'
  };
</script>

<script setup lang="js">
import { useDataStore } from "@/stores/dataStore"

const props = defineProps({
  dataLayers: Object,
  currDataFilter : String,
  selectedLayers: Object
})

const dataStore = useDataStore();

const thematics = computed(() => {
  return dataStore.getThematics().map(thematic => {
    return [thematic[0],   props.dataLayers.filter(layer => thematic[1].includes(layer.key))]
  })
})

const producers = computed(() => {
  return dataStore.getProducers().map(producer => {
    return [producer[0],   props.dataLayers.filter(layer => producer[1].includes(layer.key))]
  })
});

const activeAccordion1 = ref(-1)
const activeAccordion2 = ref(-1)

</script>

<template>
  <div class="catalogue-content-with-radio-btn">
      <DsfrAccordionsGroup
        v-model="activeAccordion1">
        <template v-for="(producer, idx) in producers" :key="producer[0]">
          <div v-show="currDataFilter === 'producteur'" >
            <MenuCatalogueThematique  v-show="producer[1].length > 0"
          :id="idx"
          :thematic-label="producer[0]"
          :layers-count="producer[1].length"
          :key="producer[0] + '-menuCatalogueThematique'">
          <LayerList
            v-if="idx == activeAccordion1"
            :key="producer[0]"
            :list-name="producer[0]"
            :selected-layers="selectedLayers"
            :layers="producer[1]"/>
          </MenuCatalogueThematique>
          </div>
          
      </template>
    </DsfrAccordionsGroup>
    
      <DsfrAccordionsGroup 
      v-model="activeAccordion2">
        <template v-for="(thematic, idx) in thematics" :key="thematic[0]">
          <div v-show="currDataFilter === 'theme'" >
            <MenuCatalogueThematique v-show="thematic[1].length > 0"
            :id="idx"
            :thematic-label="thematic[0]"
            :layers-count="thematic[1].length"
            :key="thematic[0] + '-menuCatalogueThematique'">
            <LayerList
              v-if="idx == activeAccordion2"
              :key="thematic[0]"
              :list-name="thematic[0]"
              :selected-layers="selectedLayers"
              :layers="thematic[1]"/>
            </MenuCatalogueThematique>
          </div>
        </template>
      </DsfrAccordionsGroup>
    
      <div v-show="currDataFilter == 'tout'">
        <LayerList 
          list-name="tout"
          :selected-layers="selectedLayers"
          :layers="props.dataLayers"/>
      </div>
    
  </div>
</template>

<style>
.catalogue-content-with-radio-btn {
  overflow-y: scroll;
  scrollbar-width: thin;
  overflow-x: hidden;
  max-height: calc(70vh - 327px);
}
</style>