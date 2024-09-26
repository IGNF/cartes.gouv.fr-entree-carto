<script lang="js">
  /**
   * @description
   * ...
   * @property {String} thematicLabel
   * @property {Number} layersCount
   */
  export default {
    name: 'MenuCatalogueThematique'
  };
</script>

<script setup lang="js">

const props = defineProps({
    thematicLabel: String,
    layersCount: Number
});

const title = computed(() => {
    return props.thematicLabel + ` (${props.layersCount})`
});
const expandedId = ref('');

</script>

<template>
    <DsfrAccordion
        :title="title"
        :expanded-id="expandedId"
        @expand="expandedId = $event">
        <slot></slot>
    </DsfrAccordion>
</template>