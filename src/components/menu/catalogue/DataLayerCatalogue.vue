<script setup lang="js">
import {getSearchResults} from '@/composables/searchInArray'

const props = defineProps({
    dataLayers: Object,
    currDataFilter : String,
    searchString: String,
    selectedLayers: Object
})


const thematicDataLayers = computed(() => {
  return getLayersByThematic(props.dataLayers)
})

const producerDataLayers = computed(() => {
  return getLayersByProducer(props.dataLayers)
})

function getLayersByThematic(layers) {
  let arr = [... new Set(Object.values(layers)
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
    layers : getSearchResults(
                    Object.values(layers)
                    .filter(l => l.hasOwnProperty("thematic") && thematic == l.thematic)
                    .map(l => l),
                    props.searchString,
                    ['title', 'description', 'name']
                  )
  }
})
arr.push({
    thematicLabel : "Autres",
    layers : getSearchResults(
                  Object.values(layers)
                    .filter((l) => {
                      if(!l.hasOwnProperty("thematic") || l.thematic.length == 0)
                        return l
                    }),
                    props.searchString,
                    ['title', 'description', 'name']
                  )
  })

  return arr 
}

function getLayersByProducer(layers) {
  let arr = [... new Set(Object.values(layers)
  .filter((layer) => {
    if (layer.hasOwnProperty("producer")
      && layer.producer.length > 0)
      return layer.producer
  })
  .map(l => l.producer)
)]
.map((producer) => {
  return {
    producerLabel : producer,
    layers : getSearchResults(
                    Object.values(layers)
                    .filter(l => l.hasOwnProperty("producer") && producer == l.producer)
                    .map(l => l),
                    props.searchString,
                    ['title', 'description', 'name']
                  )
  }
})

arr.push({
    producerLabel : "IGN",
    layers : getSearchResults(
                  Object.values(layers)
                    .filter((l) => {
                      if(!l.hasOwnProperty("producer") || l.producer.length == 0)
                        return l
                    }),
                    props.searchString,
                    ['title', 'description', 'name']
                  )
  })

  return arr 
}

</script>

<template>
<div>
  <template v-if="currDataFilter == 'producteur'" v-for="producer in producerDataLayers" :key="producer.producerLabel">
      <DsfrAccordionsGroup>
        <MenuCatalogueThematique v-if="producer.layers.length > 0"
          :thematic-label="producer.producerLabel"
          :layers-count="producer.layers.length">
          <LayerList
            :list-name="currDataFilter"
            :selected-layers="selectedLayers"
            :layers="producer.layers"/>
        </MenuCatalogueThematique>
      </DsfrAccordionsGroup>
  </template>

  <template v-if="currDataFilter == 'theme'" v-for="thematic in thematicDataLayers" :key="thematic.thematicLabel">
      <DsfrAccordionsGroup>
        <MenuCatalogueThematique v-if="thematic.layers.length > 0"
          :thematic-label="thematic.thematicLabel"
          :layers-count="thematic.layers.length">
          <LayerList
            :list-name="currDataFilter"
            :selected-layers="selectedLayers"
            :layers="thematic.layers"/>
        </MenuCatalogueThematique>
      </DsfrAccordionsGroup>
  </template>

  <LayerList
      v-if="currDataFilter == 'tout'"
      :list-name="currDataFilter"
      :selected-layers="selectedLayers"
      :layers="getSearchResults(props.dataLayers, searchString, ['title', 'description', 'name'])"/>


</div>
</template>