<script setup lang="js">
import { nextTick } from "vue";
import { useMapStore } from "@/stores/mapStore";
import { useActionButtonEulerian } from '@/composables/actionEulerian.js';
import {
  ControlList
} from 'geopf-extensions-openlayers';
import { mainMap } from '@/composables/keys';

import { selectedControls } from '@/composables/mapControls';

const mapStore = useMapStore();

const props = defineProps({
  mapId: { type: String, default: mainMap },
  visibility: Boolean,
  analytic: Boolean,
  controlListOptions: { type: Object, default: () => ({}) }
});

const map = inject(props.mapId);
const controlList = new ControlList(props.controlListOptions);

const FIRST_TOOL_POSITION = 2;

controlList.on('controllist:sorted', (e) => {
  let controls = mapStore.controls.split(',');
  controls.splice(FIRST_TOOL_POSITION, e.list.length, ...e.list); // mutate en insérant les N outils dans l'ordre, à partir du 3e
  // TODO verif qu'on a les bons outils ?
  mapStore.controls = controls.join(',');
});

controlList.on('change:collapsed', () => {
  let opened = !controlList.collapsed;
  if (opened) {
    document.addEventListener('click', onDocumentClick);
  } else {
    document.removeEventListener('click', onDocumentClick);
  }
});

let onDocumentClick = () => {
  controlList.setCollapsed(true);
};

// sélecteurs pour chaque chaque widget OL
const controlSelectors = new Map([
  ['MeasureLength', 'div[id^="GPmeasureLength-"]'],
  ['MeasureArea', 'div[id^="GPmeasureArea-"]'],
  ['Drawing', 'div[id^="GPdrawing-"]'],
  ['Route', 'div[id^="GProute-"]'],
  ['Isocurve', 'div[id^="GPisochron-"]'],
  ['ReverseGeocode', 'div[id^="GPreverseGeocoding-"]'],
  ['MousePosition', 'div[id^="GPmousePosition-"]'],
  ['ElevationPath', 'div[id^="GPelevationPath-"]'],
  ['MeasureAzimuth', 'div[id^="GPmeasureAzimuth-"]'],
]);

// liste des outils controlés par controllist (au milieu dans le localstorage)
let orderedManagedControls = computed(() => {
  let last = selectedControls.value.indexOf('ControlList');

  return selectedControls.value.slice(FIRST_TOOL_POSITION, last);
});

watch(selectedControls, () => {
  nextTick(applyControlsOrder);
});

// reordonne physiquement les éléments dans le DOM
// comme les composants de controle n'ont pas de rendu Vue, c'est la seule option
function applyControlsOrder() {
  const container = document.getElementById('position-container-top-right');
  if (!container) return;

  const controlListWidget = document.querySelector('#position-container-top-right > [id^="GPcontrolList-"]');

  // reordonne les 9 contrôles gérés
  orderedManagedControls.value.forEach((control) => {
    const selector = controlSelectors.get(control);
    if (!selector) return;
    const widget = document.querySelector('#position-container-top-right > ' + selector);
    if (!widget) return;
    if (controlListWidget) {
      container.insertBefore(widget, controlListWidget);
      return;
    }

    container.appendChild(widget);
  });

  // force l'ordre des controles dans le controllist
  controlList._controlsListSorted = orderedManagedControls.value;
}

onMounted(() => {
  applyControlsOrder();
  if (props.visibility) {
    map.addControl(controlList);
    if (props.analytic) {
      var el = controlList.element.querySelector("button[id^=GPshowControlListPicto-]");
      useActionButtonEulerian(el);
    }
  }
})

// onBeforeUpdate(() => {
//   if (!props.visibility) {
//     map.removeControl(controlList.value);
//   }
// })

// onUpdated(() => {
//   if (props.visibility) {
//     map.addControl(controlList.value);
//     if (props.analytic) {
//       var el = controlList.value.element.querySelector("button[id^=GPshowControlListPicto-]");
//       useActionButtonEulerian(el);
//     }
//   }
// })

</script>

<template>
  <div />
</template>

<style lang="scss">
@use "@/assets/variables" as *;

.gpf-widget[id^="GPcontrolList-"] {
  height: $widget-btn-size;
  box-shadow: 0 3px 3px -1px var(--shadow-color);

  .gpf-btn-icon span::before {
    // supprime la séparation
    content: none !important;
  }
}

// le positionnement dynamique des widgets basé sur la hauteur modifie la position de GPcontrolList (en absolute)
// du coup, le panel doit être en fixed pour être aligné en haut de la map
// puis déplacer pour être aligné par rapport à la barre d'outil
.gpf-widget[id^="GPcontrolList-"] .gpf-panel {
  position: fixed;
  top: $widget-btn-size * 2 + $gap * 2 !important;
  max-height: calc(100cqb - ($widget-btn-size * 2 + $gap * 4)) !important;
}

@include max(sm) {
  .gpf-widget[id^="GPcontrolList-"] .gpf-panel {
    max-height: 100cqb !important;
  }
}

@include min(sm) {
  @container map (max-height: 500px) {
    .gpf-widget[id^="GPcontrolList-"] .gpf-panel {
      top: 0 !important;
      max-height: calc(100cqb - ($gap * 2)) !important;
    }
  }
}



</style>
