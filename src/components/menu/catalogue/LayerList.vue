<script setup lang="js">
import { useMapStore } from "@/stores/mapStore"
import { useDataStore } from "@/stores/dataStore"
import LayerCatalogue from "@/components/menu/catalogue/LayerCatalogue.vue"

const mapStore = useMapStore();
const dataStore = useDataStore();

const props = defineProps({
    layers: Object,
    selectedLayers: Object
})

onMounted(() => {
})

</script>

<template>
    <template v-for="layer in layers" :key="layer.id">
        <LayerCatalogue
            :active="selectedLayers?.filter(l => l.key == layer.key).length > 0"    
            :layer="layer"    
        />
    </template>
</template>