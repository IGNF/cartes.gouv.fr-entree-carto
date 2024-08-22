<script setup lang="js">
import { useMapStore } from "@/stores/mapStore"

const mapStore = useMapStore();

const props = defineProps({
    layer: Object,
    active: Boolean
})

function layerInteraction(layer) {
    if(!props.active) {
        mapStore.addLayer(layer.key);
    }
    else {
        mapStore.removeLayer(layer.key)
    }
}

</script>

<template>
        <DsfrCheckbox
        :model-value="active"
        :label="layer.title"
        :id="layer.id"
        :hint="layer.description"
        @update:modelValue="layerInteraction(layer)"
        />
</template>