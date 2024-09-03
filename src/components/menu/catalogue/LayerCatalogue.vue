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
        @update:modelValue="layerInteraction($event, layer)"
        />
        <div class="layer-description" v-html="layer.description"></div>

</template>

<style>
.layer-description {
    margin-left: 40px;
    margin-bottom: 2em;
}
</style>