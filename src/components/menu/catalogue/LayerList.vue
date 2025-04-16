<script lang="js">
  /**
   * @description
   * ...
   * @property {Array} layers Le tableau des layers ordonnés
   * @property {Object} selectedLayers
   * @property {String} listName
   * @see LayerCatalogue
   */
  export default {
    name: 'LayerList'
  };
</script>

<script setup lang="js">
import LayerCatalogue from "@/components/menu/catalogue/LayerCatalogue.vue"

const props = defineProps({
    layers: Array,
    selectedLayers: Object,
    listName: String
});

function getUniqueKey(layer) {
  let key = layer.key ? layer.key : layer.name
  key = key + "-" + props.listName
  return key
}

</script>

<template>
  <div>
    <template
      v-for="layer in layers"
      :key="getUniqueKey(layer)"
    >
      <div>
        <LayerCatalogue
          :active="(selectedLayers) ? selectedLayers.filter(l => l.key == layer.key).length > 0 : false"    
          :layer="layer"    
        />
      </div>
    </template>
  </div>
</template>