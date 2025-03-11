<script lang="js">
  /**
   * @description
   * ...
   * @property {Object} layer
   * @property {Boolean} active
   */
  export default {
    name: 'LayerCatalogue'
  };
</script>

<script setup lang="js">
import { useMapStore } from "@/stores/mapStore"

const mapStore = useMapStore();

const props = defineProps({
    layer: Object,
    active: Boolean
})

const active = ref(props.active)

function layerInteraction(e, layer) {
    active.value = e;
    if (active.value) {
        mapStore.addLayer(layer.key);
    }
    else {
        mapStore.removeLayer(layer.key);
    }
}

onUpdated(() => {
    active.value = props.active;
})

</script>

<template>
    <DsfrCheckbox
        :model-value="active"
        :label="layer.title"
        @update:modelValue="layerInteraction($event, layer)"
    />
    <!-- <CustomAccordeon
        class="layer-description"
        :description="layer.description"
    /> -->
</template>

<style>
.layer-description {
    margin-left: 40px;
    margin-bottom: 2em;
}
</style>