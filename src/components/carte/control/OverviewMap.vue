<script setup lang="js">
import { useLogger } from 'vue-logger-plugin';
import { useMatchMedia } from '@/composables/matchMedia';
import { useActionButtonEulerian } from '@/composables/actionEulerian.js';
import { useControlsOptions } from '@/composables/controls';

import { GeoportalOverviewMap } from 'geopf-extensions-openlayers';

const props = defineProps({
  mapId: String,
  visibility: Boolean,
  analytic: Boolean,
});

const log = useLogger();


const map = inject(props.mapId);
const overviewMap = ref(new GeoportalOverviewMap(useControlsOptions().overviewMap));

const isSmallScreen = useMatchMedia('SM')

watch(isSmallScreen, () => {
  if (props.visibility && !isSmallScreen.value) {
    map.addControl(overviewMap.value);
    if (props.analytic) {
      var el = overviewMap.value.element.querySelector("button[id^=GPshowOverviewMap-]");
      useActionButtonEulerian(el);
    }
  }
  else {
    map.removeControl(overviewMap.value);
  }
})

onMounted(() => {
  if (props.visibility && !isSmallScreen.value) {
    map.addControl(overviewMap.value);
    overviewMap.value.on('overviewmap:toggle', onToggleOverviewMap);
    if (props.analytic) {
      var el = overviewMap.value.element.querySelector("button[id^=GPshowOverviewMap-]");
      useActionButtonEulerian(el);
    }
  }
})

onBeforeUpdate(() => {
  if (props.visibility && !isSmallScreen.value) {
    map.addControl(overviewMap.value);
    if (props.analytic) {
      var el = overviewMap.value.element.querySelector("button[id^=GPshowOverviewMap-]");
      useActionButtonEulerian(el);
    }
  }
  else {
    map.removeControl(overviewMap.value);
  }
})

function onToggleOverviewMap (e) {
  log.debug(e)
}
</script>

<template>
  <div />
</template>

<style lang="scss">
@use "@/assets/variables" as *;

.gpf-widget[id^="GPoverviewMap-"] {
  // toujours en premier dans la liste
  order: -1;
  // position relative pour que l'ouverture de la minimap soit par rapport au bouton
  position: relative !important;
  left: auto;
  bottom: auto;

  .ol-overviewmap-map {
    position: absolute;
    top: 0;
    left: $widget-btn-size + $gap;
    border-radius: $widget-btn-radius;
    width: $widget-btn-size * 2 + $gap;
    height: $widget-btn-size * 2 + $gap;
    border: solid $widget-btn-padding var(--background-default-grey);
    background-color: var(--background-default-grey);
  }
}
</style>
