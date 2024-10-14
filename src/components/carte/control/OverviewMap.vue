<script setup lang="js">
import { useLogger } from 'vue-logger-plugin';
import { useMatchMedia } from '@/composables/matchMedia';
import { useActionButtonEulerian } from '@/composables/actionEulerian.js';

import { GeoportalOverviewMap } from 'geopf-extensions-openlayers';

const props = defineProps({
  visibility: Boolean,
  analytic: Boolean,
  overviewMapOptions: Object
});

const log = useLogger();

const map = inject('map');
const overviewMap = ref(new GeoportalOverviewMap(props.overviewMapOptions));

defineExpose({
  container: overviewMap.value.getContainer(),
  options: overviewMap.value.options
});

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
  <!-- TODO ajouter l'emprise du widget pour la gestion des collisions -->
</template>

<style></style>
