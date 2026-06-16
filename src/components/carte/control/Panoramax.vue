<script setup lang="js">

import { useDomStore } from '@/stores/domStore';
import { useActionButtonEulerian } from '@/composables/actionEulerian.js';

import "@panoramax/web-viewer/build/photoviewer.js";
import "@panoramax/web-viewer/build/photoviewer.css";

import { Panoramax } from 'geopf-extensions-openlayers';

const props = defineProps({
  mapId: {
    type: String,
    default: ''
  },
  visibility: Boolean,
  layersReady: {
    type: Boolean,
    default: false
  },
  analytic: Boolean,
  panoramaxOptions: {
    type: Object,
    default: () => ({})
  }
});

const domStore = useDomStore();

const map = inject(props.mapId);

const panoramax = new Panoramax(props.panoramaxOptions);

panoramax.on("pnx:fullscreen", (e) => {
  domStore.isFullscreenPanoramax = e.data.fullscreen;
});
 
const getHistoryState = () => {
  const state = window.history.state ?? {};
  if (!state) {
    return {};
  }
  const { picture, sequence } = state;
  if (!picture || !sequence) {
    return {};
  }
  return { picture, sequence };
}

const clearHistoryState = () => {
  const state = window.history.state ?? {};
  if (!state) {
    return;
  }

  const { picture, sequence, ...rest } = state;
  if (!picture && !sequence) {
    return;
  }

  window.history.replaceState(rest, document.title, window.location.href);
}

const openPanoramaxViewer = ({ picture, sequence }) => {
  if (!picture || !sequence) {
    return;
  }
  if (!props.layersReady) {
    return;
  }

  panoramax.setCollapsed(false);
  // mécanisme sur le widget pour prendre en compte les changements
  // si les properties suivantes sont modifiées, le widget ouvre automatiquement
  // une photo dans le viewer
  panoramax.set("sequence", sequence);
  panoramax.set("picture", picture);
  panoramax.set("display", true);
  // on supprime les infos de l'historique
  clearHistoryState();
};

onMounted(() => {
  if (props.visibility) {
    map.addControl(panoramax);
    if (props.analytic) {
      var el = panoramax.element.querySelector("button[id^=GPshowPanoramaxPicto-]");
      useActionButtonEulerian(el);
    }
    openPanoramaxViewer(getHistoryState());
  }
})

onBeforeUpdate(() => {
  if (!props.visibility) {
    map.removeControl(panoramax);
  }
})

onUpdated(() => {
  if (props.visibility) {
    map.addControl(panoramax);
    if (props.analytic) {
      var el = panoramax.element.querySelector("button[id^=GPshowPanoramaxPicto-]");
      useActionButtonEulerian(el);
    }
    openPanoramaxViewer(getHistoryState());
  }
})

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
