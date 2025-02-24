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

const props = defineProps({
  dataLayers: Object,
  currDataFilter : String,
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
      layers : Object.values(layers)
          .filter(layer => layer.hasOwnProperty("thematic") && thematic === layer.thematic)
          .map(layer => layer)
    }
  });
  
  arr.push({
    thematicLabel : "Autres",
    layers : Object.values(layers).filter((layer) => {
        if(!layer.hasOwnProperty("thematic") || layer.thematic.length === 0) {
          return layer;
        }
      })
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
      layers : Object.values(layers)
          .filter(layer => layer.hasOwnProperty("producer") && producer === layer.producer)
          .map(layer => layer)
    }
  });
  
  arr.push({
    producerLabel : "Autres",
    layers : Object.values(layers)
        .filter((l) => {
          if(!l.hasOwnProperty("producer") || l.producer.length == 0) {
            return l;
          }
        }),
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
        <template v-for="(producer, idx) in producerDataLayers" :key="producer.producerLabel">
          <div>
            <MenuCatalogueThematique v-show="currDataFilter === 'producteur'"  v-if="producer.layers.length > 0"
          :id="idx"
          :thematic-label="producer.producerLabel"
          :layers-count="producer.layers.length"
          :key="producer.producerLabel + '-menuCatalogueThematique'">
          <LayerList
            :key="producer.producerLabel"
            :list-name="producer.producerLabel"
            :selected-layers="selectedLayers"
            :layers="producer.layers"/>
          </MenuCatalogueThematique>
          </div>
          
      </template>
    </DsfrAccordionsGroup>
    
      <DsfrAccordionsGroup 
      v-model="activeAccordion2">
        <template v-for="(thematic, idx) in thematicDataLayers" :key="thematic.thematicLabel">
          <div>
            <MenuCatalogueThematique v-show="currDataFilter === 'theme'" v-if="thematic.layers.length > 0"
            :id="idx"
            :thematic-label="thematic.thematicLabel"
            :layers-count="thematic.layers.length"
            :key="thematic.thematicLabel + '-menuCatalogueThematique'">


            <LayerList
              :key="thematic.thematicLabel"
              :list-name="thematic.thematicLabel"
              :selected-layers="selectedLayers"
              :layers="thematic.layers"/>
            </MenuCatalogueThematique>
          </div>
        </template>
      </DsfrAccordionsGroup>
    
      <div v-show="currDataFilter == 'tout'">
        <LayerList 
          list-name="tout"
          :selected-layers="selectedLayers"
          :layers="props.dataLayers.slice(0,10)"/>
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