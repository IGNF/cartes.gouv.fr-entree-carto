<script setup lang="js">
import { useLogger } from 'vue-logger-plugin';
import { useActionButtonEulerian } from '@/composables/actionEulerian.js';

import { GetFeatureInfo } from 'geopf-extensions-openlayers';

const props = defineProps({
  mapId: String,
  visibility: Boolean,
  analytic: Boolean,
  getFeatureInfoOptions: Object
});

const log = useLogger();


const map = inject(props.mapId);
const getFeatureInfo = ref(new GetFeatureInfo(props.getFeatureInfoOptions));

onMounted(() => {
  if (props.visibility) {
    map.addControl(getFeatureInfo.value);
    getFeatureInfo.value.on('GetFeatureInfo:toggle', onToggleGetFeatureInfo);
    if (props.analytic) {
      var el = getFeatureInfo.value.element.querySelector("button[id^=GPgetFeatureInfoPicto-]");
      useActionButtonEulerian(el);
    }
  }
})

onBeforeUpdate(() => {
  if (props.visibility) {
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
  <div />
</template>

<style lang="scss">
@use "@/assets/variables" as *;

// le widget est intégré dans le container gauche
// mais le bouton est caché (car intégré dans menu contextuel)
.position-container-top-left .gpf-btn-icon[id^=GPgetFeatureInfoPicto-] {
  display: none;
}
// modale au-dessus
// spécifique à GFI car le aria-pressed reste a false
.position:has(> .gpf-widget[id^="GPgetFeatureInfo-"] > .gpf-btn-icon[aria-pressed]) {
  z-index: 2;

  // au dessus de tout en mobile
  @include max(sm) {
    z-index: 4;
  }
}
/* surcharge style renvoyé dans getFeature info pour meilleur rendu voulu par #695 */
.geoportail-popup-content :is(h1, h2, h3, h4, h5) {
  font-size: 1.25rem;
}
</style>
