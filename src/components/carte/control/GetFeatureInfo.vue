<script setup lang="js">
import { useLogger } from 'vue-logger-plugin';
import { useMatchMedia } from '@/composables/matchMedia';
import { useActionButtonEulerian } from '@/composables/actionEulerian.js';

import { GetFeatureInfo } from 'geopf-extensions-openlayers';

const props = defineProps({
  visibility: Boolean,
  analytic: Boolean,
  getFeatureInfoOptions: Object
});

const log = useLogger();

import { mainMap } from "@/composables/keys"
const map = inject(mainMap);
const getFeatureInfo = ref(new GetFeatureInfo(props.getFeatureInfoOptions));

const isSmallScreen = useMatchMedia('SM')

watch(isSmallScreen, () => {
  if (props.visibility && !isSmallScreen.value) {
    map.addControl(getFeatureInfo.value);
    if (props.analytic) {
      var el = getFeatureInfo.value.element.querySelector("button[id^=GPgetFeatureInfoPicto-]");
      useActionButtonEulerian(el);
    }
  }
  else {
    map.removeControl(getFeatureInfo.value);
  }
})

onMounted(() => {
  if (props.visibility && !isSmallScreen.value) {
    map.addControl(getFeatureInfo.value);
    getFeatureInfo.value.on('GetFeatureInfo:toggle', onToggleGetFeatureInfo);
    if (props.analytic) {
      var el = getFeatureInfo.value.element.querySelector("button[id^=GPgetFeatureInfoPicto-]");
      useActionButtonEulerian(el);
    }
  }
})

onBeforeUpdate(() => {
  if (props.visibility && !isSmallScreen.value) {
    map.addControl(getFeatureInfo.value);
    if (props.analytic) {
      var el = getFeatureInfo.value.element.querySelector("button[id^=GPgetFeatureInfoPicto-]");
      useActionButtonEulerian(el);
    }
  }
  else {
    map.removeControl(getFeatureInfo.value);
  }
})

function onToggleGetFeatureInfo (e) {
  log.debug(e)
}
</script>

<template>
  <!-- TODO ajouter l'emprise du widget pour la gestion des collisions -->
</template>

<style></style>
