<script setup lang="js">
import { useActionButtonEulerian } from '@/composables/actionEulerian';
import { useLogger } from 'vue-logger-plugin';
import { 
  Drawing,
  ButtonExport
} from 'geopf-extensions-openlayers';

const log = useLogger();

const props = defineProps({
  mapId: String,
  visibility: Boolean,
  analytic: Boolean,
  drawingOptions: Object
});

const map = inject(props.mapId)
const drawing = ref(new Drawing(props.drawingOptions));
const button = ref(new ButtonExport({
  title : "Sauvegarde",
  kind : "secondary",
  download : false,
  control: drawing.value,
  format : "kml",
  icons : {
    button : "save"
  }
}));

onMounted(() => {
  if (props.visibility) {
    map.addControl(drawing.value);
    map.addControl(button.value);
    if (props.analytic) {
      var el = drawing.value.element.querySelector("button[id^=GPshowDrawingPicto-]");
      useActionButtonEulerian(el);
    }
    /** abonnement au widget */
    button.value.on("button:clicked", onSaveDrawing);
  }
})

onBeforeUpdate(() => {
  if (props.visibility) {
    map.addControl(drawing.value);
    map.addControl(button.value);
    if (props.analytic) {
      var el = drawing.value.element.querySelector("button[id^=GPshowDrawingPicto-]");
      useActionButtonEulerian(el);
    }
  }
  else {
    map.removeControl(button.value);
    map.removeControl(drawing.value);
  }
})

/** 
 * Gestionnaires d'evenement sur les abonnements
 * 
 * @description
 */

const onSaveDrawing = (e) => {
  log.debug("onSaveDrawing", e);
}

</script>

<template>
  <!-- TODO ajouter l'emprise du widget pour la gestion des collisions -->
</template>

<style>
.ol-overlay-container:has(.gp-label-div),
.ol-overlay-container:has(.gp-styling-div) {
  transform: translate(62px, 79px) !important;
}

@media (max-width: 627px) and (min-width: 576px) {
  .ol-overlay-container:has(.gp-label-div),
  .ol-overlay-container:has(.gp-styling-div) {
    transform: translate(62px, 144px) !important;
  }
}

@media (max-width: 576px) {
  .ol-overlay-container:has(.gp-label-div),
  .ol-overlay-container:has(.gp-styling-div) {
    transform: translate(62px, 235px) !important;
  }
}

</style>