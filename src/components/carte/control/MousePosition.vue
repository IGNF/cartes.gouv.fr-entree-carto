<script setup lang="js">
import { useActionButtonEulerian } from '@/composables/actionEulerian.js';
import { useLogger } from 'vue-logger-plugin'
import {
  MousePosition
} from 'geopf-extensions-openlayers'

const props = defineProps({
  visibility: Boolean,
  analytic: Boolean,
  mousePositionOptions: Object
})

const log = useLogger()

const map = inject('map')
const mousePosition = ref(new MousePosition(props.mousePositionOptions))

defineExpose({
  container: mousePosition.value.getContainer(),
  options: mousePosition.value.options
});

onMounted(() => {
  if (props.visibility) {
    map.addControl(mousePosition.value);
    if (props.analytic) {
      var el = measureArea.value.element.querySelector("button[id^=GPshowMousePositionPicto-]");
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
      var el = measureArea.value.element.querySelector("button[id^=GPshowMousePositionPicto-]");
      useActionButtonEulerian(el);
    }
  }
})

</script>

<template>
  <!-- TODO ajouter l'emprise du widget pour la gestion des collisions -->
</template>

<style scoped></style>
