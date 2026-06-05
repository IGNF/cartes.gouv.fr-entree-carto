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
