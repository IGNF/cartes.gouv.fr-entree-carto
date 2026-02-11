<script setup lang="js">
const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  }
});
</script>

<template>
  <div class="fr-callout">
    <h6 v-if="props.data.title" class="fr-callout__title">
      {{ props.data.title }}
    </h6>
    <div v-if="props.data.description" class="fr-callout__text">
      {{ props.data.description }}
    </div>
    <div v-if="props.data.legend" class="fr-callout__text">
      <strong>Légende :</strong> {{ props.data.legend }}
    </div>
  </div>
</template>
