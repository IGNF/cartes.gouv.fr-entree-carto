<script setup lang="js">
import { useActionButtonEulerian } from '@/composables/actionEulerian.js';
import { useLogger } from 'vue-logger-plugin'
import {
  MousePosition
} from 'geopf-extensions-openlayers'

const props = defineProps({
  mapId: String,
  visibility: Boolean,
  analytic: Boolean,
  mousePositionOptions: Object
})

const log = useLogger()


const map = inject(props.mapId)
const mousePosition = ref(new MousePosition(props.mousePositionOptions))

onMounted(() => {
  if (props.visibility) {
    map.addControl(mousePosition.value);
    if (props.analytic) {
      var el = mousePosition.value.element.querySelector("button[id^=GPshowMousePositionPicto-]");
      useActionButtonEulerian(el);
    }
  }
})

onBeforeUpdate(() => {
  if (!props.visibility) {
    map.removeControl(mousePosition.value);
  }
})

onUpdated(() => {
  if (props.visibility) {
    map.addControl(mousePosition.value);
    if (props.analytic) {
      var el = mousePosition.value.element.querySelector("button[id^=GPshowMousePositionPicto-]");
      useActionButtonEulerian(el);
    }
  }
})

</script>

<template>
  <!-- TODO ajouter l'emprise du widget pour la gestion des collisions -->
</template>

<style>
/* reduction de la largeur du panel déterminé par max-content */
div[id^=GPmousePositionSettings-] {
  width: 275px;
}
@media (max-width: 576px){
  div[id^=GPmousePositionSettings-] {
    width: unset;
  }
}
</style>
