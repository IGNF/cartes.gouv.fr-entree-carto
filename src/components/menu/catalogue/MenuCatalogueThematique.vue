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
    id: Number,
    layersCount: Number
});

const title = computed(() => {
    return props.thematicLabel + ` (${props.layersCount})`
});

</script>

<template>
    <DsfrAccordion
      :id="'accordion-' + id"
      :title="title">
        <slot></slot>
    </DsfrAccordion>
</template>