<script setup lang="js">
import { useActionButtonEulerian } from '@/composables/actionEulerian.js';
import { useLogger } from 'vue-logger-plugin'
import {
  LayerImport
} from 'geopf-extensions-openlayers'

const props = defineProps({
  visibility: Boolean,
  analytic: Boolean,
  layerImportOptions: Object
})

const log = useLogger()

const map = inject('map')
const layerImport = ref(new LayerImport(props.layerImportOptions))

onMounted(() => {
  if (props.visibility) {
    map.addControl(layerImport.value);
    if (props.analytic) {
    log.debug(layerImport.value.element)
      var el = layerImport.value.element.querySelector("button[id^=GPshowImportPicto-]");
      useActionButtonEulerian(el);
    }
  }
})

onBeforeUpdate(() => {
  if (!props.visibility) {
    map.removeControl(layerImport.value);
  }
})

onUpdated(() => {
  if (props.visibility) {
    map.addControl(layerImport.value);
    if (props.analytic) {
      var el = layerImport.value.element.querySelector("button[id^=GPshowImportPicto-]");
      useActionButtonEulerian(el);
    }
  }
})

</script>

<template>
  <!-- TODO ajouter l'emprise du widget pour la gestion des collisions -->
</template>

<style scoped></style>
