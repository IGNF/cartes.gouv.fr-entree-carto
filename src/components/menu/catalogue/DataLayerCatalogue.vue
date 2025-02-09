<script lang="js">
  /**
   * @description
   * ...
   * @property {Object} dataLayers
   * @property {String} currDataFilter
   * @property {String} searchString
   * @property {Object} selectedLayers
   */
  export default {
    name: 'DataLayerCatalogue'
  };
</script>

<script setup lang="js">
import { useSearchInArray } from '@/composables/searchInArray'

const props = defineProps({
  dataLayers: Object,
  currDataFilter : String,
  searchString: String,
  selectedLayers: Object
})

const thematicDataLayers = computed(() => {
  return getLayersByThematic(props.dataLayers);
})

const producerDataLayers = computed(() => {
  return getLayersByProducer(props.dataLayers);
})

function getLayersByThematic(layers) {
  let arr = [... new Set(Object.values(layers)
    .filter((layer) => {
      if (layer.hasOwnProperty("thematic") && layer.thematic.length > 0) {
        return layer.thematic;
      }
    })
    .map(layer => layer.thematic)
  )]
  .map((thematic) => {
    return {
      thematicLabel : thematic,
      layers : useSearchInArray (
        Object.values(layers)
          .filter(layer => layer.hasOwnProperty("thematic") && thematic === layer.thematic)
          .map(layer => layer),
        props.searchString,
        ['title', 'description', 'name']
      )
    }
  });
  
  arr.push({
    thematicLabel : "Autres",
    layers : useSearchInArray(
      Object.values(layers).filter((layer) => {
        if(!layer.hasOwnProperty("thematic") || layer.thematic.length === 0) {
          return layer;
        }
      }),
      props.searchString,
      ['title', 'description', 'name']
    )
  });
  
  return arr;
}

function getLayersByProducer(layers) {
  let arr = [... new Set(Object.values(layers)
    .filter((layer) => {
      if (layer.hasOwnProperty("producer") && layer.producer.length > 0) {
        return layer.producer
      }
    })
    .map(layer => layer.producer)
  )]
  .map((producer) => {
    return {
      producerLabel : producer,
      layers : useSearchInArray(
        Object.values(layers)
          .filter(layer => layer.hasOwnProperty("producer") && producer === layer.producer)
          .map(layer => layer),
        props.searchString,
        ['title', 'description', 'name']
      )
    }
  });
  
  arr.push({
    producerLabel : "IGN",
    layers : useSearchInArray(
      Object.values(layers)
        .filter((l) => {
          if(!l.hasOwnProperty("producer") || l.producer.length == 0) {
            return l;
          }
        }),
      props.searchString,
      ['title', 'description', 'name']
    )
  });
  
  return arr;
}
const activeAccordion1 = ref(-1)
const activeAccordion2 = ref(-1)
</script>

<template>
  <div class="catalogue-content-with-radio-btn">
      <DsfrAccordionsGroup
        v-model="activeAccordion1">
        <template v-if="currDataFilter === 'producteur'" v-for="(producer, idx) in producerDataLayers" :key="producer.producerLabel">
          <MenuCatalogueThematique v-if="producer.layers.length > 0"
          :id="idx"
          :thematic-label="producer.producerLabel"
          :layers-count="producer.layers.length"
          :key="producer.producerLabel">
          <LayerList
            :list-name="currDataFilter"
            :selected-layers="selectedLayers"
            :layers="producer.layers"
            :key="producer.producerLabel"/>
        </MenuCatalogueThematique>
      </template>
    </DsfrAccordionsGroup>
    
      <DsfrAccordionsGroup 
      v-model="activeAccordion2">
        <template v-if="currDataFilter === 'theme'" v-for="(thematic, idx) in thematicDataLayers" :key="thematic.thematicLabel">
          <MenuCatalogueThematique v-if="thematic.layers.length > 0"
            :id="idx"
            :thematic-label="thematic.thematicLabel"
            :layers-count="thematic.layers.length">
            <LayerList
              :list-name="currDataFilter"
              :selected-layers="selectedLayers"
              :layers="thematic.layers"/>
          </MenuCatalogueThematique>
        </template>
      </DsfrAccordionsGroup>
    
    <LayerList
      v-if="currDataFilter == 'tout'"
      :list-name="currDataFilter"
      :selected-layers="selectedLayers"
      :layers="useSearchInArray(props.dataLayers, searchString, ['title', 'description', 'name'])"/>
    
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