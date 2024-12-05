<script setup lang="js">
import { useActionButtonEulerian } from '@/composables/actionEulerian.js';
import { Drawing } from 'geopf-extensions-openlayers';
import { mainMap } from "@/composables/keys"

const props = defineProps({
  visibility: Boolean,
  analytic: Boolean,
  drawingOptions: Object
});

const map = inject(mainMap)
const drawing = ref(new Drawing(props.drawingOptions));

onMounted(() => {
  if (props.visibility) {
    map.addControl(drawing.value);
    if (props.analytic) {
      var el = drawing.value.element.querySelector("button[id^=GPshowDrawingPicto-]");
      useActionButtonEulerian(el);
    }
  }
})

onBeforeUpdate(() => {
  if (props.visibility) {
    map.addControl(drawing.value);
    if (props.analytic) {
      var el = drawing.value.element.querySelector("button[id^=GPshowDrawingPicto-]");
      useActionButtonEulerian(el);
    }
  }
  else {
    map.removeControl(drawing.value);
  }
})
</script>

<template>
  <!-- TODO ajouter l'emprise du widget pour la gestion des collisions -->
</template>

<style></style>