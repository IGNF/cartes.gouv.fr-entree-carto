<script setup lang="js">

import { useLogger } from 'vue-logger-plugin';
import { useDataStore } from '@/stores/dataStore';
import { useMapStore } from '@/stores/mapStore';
import { useDomStore } from '@/stores/domStore';
import { useActionButtonEulerian } from '@/composables/actionEulerian.js';

import "@panoramax/web-viewer/build/photoviewer.js";
import "@panoramax/web-viewer/build/photoviewer.css";

import { Panoramax } from 'geopf-extensions-openlayers';

// lib notification
import { push } from 'notivue';
import t from '@/features/translation';

const props = defineProps({
  mapId: {
    type: String,
    default: ''
  },
  visibility: Boolean,
  analytic: Boolean,
  panoramaxOptions: {
    type: Object,
    default: () => ({})
  }
});

const log = useLogger();
const dataStore = useDataStore();
const mapStore = useMapStore();
const domStore = useDomStore();

const map = inject(props.mapId)
const panoramax = ref(new Panoramax(props.panoramaxOptions));

panoramax.value.on("pnx:fullscreen", (e) => {
  domStore.isFullscreenPanoramax = e.data.fullscreen;
});

onMounted(() => {
  if (props.visibility) {
    map.addControl(panoramax.value)
    if (props.analytic) {
      var el = panoramax.value.element.querySelector("button[id^=GPshowPanoramaxPicto-]");
      useActionButtonEulerian(el);
    }
    /* abonnement au widget */
  }
})

onBeforeUpdate(() => {
  if (!props.visibility) {
    map.removeControl(panoramax.value);
  }
})

onUpdated(() => {
  if (props.visibility) {
    map.addControl(panoramax.value);
    if (props.analytic) {
      var el = panoramax.value.element.querySelector("button[id^=GPshowPanoramaxPicto-]");
      useActionButtonEulerian(el);
    }
    /* abonnement au widget */
    
  }
})

/** 
 * gestionnaire d'evenement sur les abonnements
 * @description
 * ...
 */

</script>

<template>
  <div />
</template>

<style lang="scss">
@use "@/assets/variables" as *;

.gpf-widget[id^="GPpanoramax-"] {
  // toujours en dernier dans la liste (tout en bas)
  order: 1;
}

// double la classe (hack pour cascade)
.gpf-panel.gpf-panel[id^="GPpanoramaxPanelButtons-"] {
  top: initial !important;
  bottom: 0 !important;
  box-shadow: none;

  .gpf-btn {
    height: $widget-btn-size;
    // cree l'effet du bouton
    @include widget-btn-style;

    &:not(:disabled):hover {
      @include widget-btn-style-hover;
    }
    &[aria-pressed="true"],
    &[aria-pressed="true"]:not(:disabled):hover {
      @include widget-btn-style-active;
    }
  }
}

@include max(sm) {
  // selecteur a rallonge obligatoire pour surclasser le style
  .position .gpf-widget-button > button[aria-pressed] ~ dialog.gpf-panel[id^="GPpanoramaxPanelButtons-"] {
    top: initial !important;
    bottom: 0 !important;
    left: $widget-btn-size + $gap !important;
  }
}

.gpf-panel.gpf-panel[id^="GPpanoramaxPanelOptions-"] {
  top: initial !important;
  bottom: $widget-btn-size + $gap !important;
}

@include max(sm) {
  // selecteur a rallonge obligatoire pour surclasser le style
  .position .gpf-widget-button > button[aria-pressed] ~ form.gpf-panel[id^="GPpanoramaxPanelOptions-"] {
    top: initial !important;
    bottom: -$gap !important;
    left: -$gap !important;
    right: 0 !important;
  }
}


.gpf-panel.gpf-panel[id^="GPpanoramaxPanelViewer-"] {
  inset: 0px !important;
  max-height: initial !important;
  min-height: initial !important;
  height: auto !important;
  width: auto !important;
  max-width: initial !important;

  .gpf-panel__body {
    max-height: initial !important;
  }
}

@include max(sm) {
  // selecteur a rallonge obligatoire pour surclasser le style
  .position .gpf-widget-button > button[aria-pressed] ~ dialog.gpf-panel[id^="GPpanoramaxPanelViewer-"] {
    top: 0 !important;
    right: 0 !important;
    left: 0 !important;
  }
}

// photo viewer au dessus
.position:has(> .gpf-widget-button > .gpf-btn-icon.gpf-btn-icon-panoramax[aria-pressed="true"]) {
  z-index: 3;
}
</style>
