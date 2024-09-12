<script setup lang="js">
import LayerCatalogue from "@/components/menu/catalogue/LayerCatalogue.vue"

const props = defineProps({
    layers: Object,
    selectedLayers: Object,
    listName: String
});

</script>

<template>
    <template v-for="layer in layers" :key="`${layer.key}-${listName}`">
        <LayerCatalogue
            :active="(selectedLayers) ? selectedLayers.filter(l => l.key == layer.key).length > 0 : false"    
            :layer="layer"    
        />
    </template>
</template>