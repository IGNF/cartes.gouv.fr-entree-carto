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
  <!-- TODO ajouter l'emprise du widget pour la gestion des collisions -->
</template>

<style>
/* surcharge style renvoyé dans getFeature info pour meilleur rendu voulu par #695 */
.geoportail-popup-content :is(h1, h2, h3, h4, h5) {
  font-size: 1.25rem;
}

dialog[id^="GPgetFeatureInfoPanel-"] {
  top: -6px !important;
  left: 47px !important;
}

@media (max-width: 576px) {
  dialog[id^="GPgetFeatureInfoPanel-"] {
    top: -132px !important;
    left: 2px !important;
  }
}
</style>
