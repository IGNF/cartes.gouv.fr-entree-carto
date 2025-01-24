<script setup lang="js">
import { ContextMenu } from 'geopf-extensions-openlayers';
import { useMatchMedia } from '@/composables/matchMedia';

const isSmallScreen = useMatchMedia('SM')

const props = defineProps({
  mapId: String,
  visibility: Boolean,
  analytic: Boolean,
  contextMenuOptions: Object
});

const map = inject(props.mapId)
const contextMenu = ref(new ContextMenu(props.contextMenuOptions));

onMounted(() => {
  if (props.visibility && !isSmallScreen.value) {
    map.addControl(contextMenu.value);
  }
})

onBeforeUpdate(() => {
  if (props.visibility && !isSmallScreen.value) {
    map.addControl(contextMenu.value);
  }
  else {
    map.removeControl(contextMenu.value);
  }
})
</script>

<template>
  <!-- TODO ajouter l'emprise du widget pour la gestion des collisions -->
</template>

<style>
.ol-overlay-container:has(.gp-label-div),
.ol-overlay-container:has(.gp-styling-div) {
  transform: translate(62px, 79px) !important;
}

@media (max-width: 627px) and (min-width: 576px) {
  .ol-overlay-container:has(.gp-label-div),
  .ol-overlay-container:has(.gp-styling-div) {
    transform: translate(62px, 144px) !important;
  }
}

@media (max-width: 576px) {
  .ol-overlay-container:has(.gp-label-div),
  .ol-overlay-container:has(.gp-styling-div) {
    transform: translate(62px, 235px) !important;
  }
}

</style>