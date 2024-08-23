<script setup lang="js">
import { useControlsMenuOptions } from "@/composables/controls";
import { useMapStore } from "@/stores/mapStore"

const mapStore = useMapStore();

const props = defineProps({
    layer: Object,
    active: Boolean
})

const active = ref(props.active)

function layerInteraction(e, layer) {
    active.value = e
    if(active.value) {
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
        @update:modelValue="layerInteraction($event, layer)"
        />
</template>