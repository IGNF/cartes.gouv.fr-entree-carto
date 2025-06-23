<script setup lang="js">

import { useLogger } from 'vue-logger-plugin';
import { useDataStore } from '@/stores/dataStore';
import { useActionButtonEulerian } from '@/composables/actionEulerian.js';

import { Reporting } from 'geopf-extensions-openlayers';

const props = defineProps({
  mapId: String,
  visibility: Boolean,
  analytic: Boolean,
  reportingOptions: Object
});

const log = useLogger();
const store = useDataStore();


const map = inject(props.mapId)
const reporting = ref(new Reporting(props.reportingOptions));

function addThematics () {
  // TODO 
  // ajouter les thématiques pour le signalement
  // quand ils seront définis dans le store
}

onMounted(() => {
  if (props.visibility) {
    addThematics();
    map.addControl(reporting.value)
    if (props.analytic) {
      var el = reporting.value.element.querySelector("button[id^=GPshowReportingPicto-]");
      useActionButtonEulerian(el);
    }
    /* abonnement au widget */
    reporting.value.on("", );
  }
})

onBeforeUpdate(() => {
  if (!props.visibility) {
    map.removeControl(reporting.value);
  }
})

onUpdated(() => {
  if (props.visibility) {
    addThematics();
    map.addControl(reporting.value);
    if (props.analytic) {
      var el = reporting.value.element.querySelector("button[id^=GPshowReportingPicto-]");
      useActionButtonEulerian(el);
    }
    /* abonnement au widget */
    reporting.value.once("reporting:opened", onOpenPanelInformation);
    reporting.value.on("reporting:sending", onSendingReporting);
  }
})

/** 
 * gestionnaire d'evenement sur les abonnements
 * @description
 * ...
 */
const onOpenPanelInformation = (e) => {
  log.debug(e);
}
/** 
 * gestionnaire d'evenement sur les abonnements
 * @description
 * ...
 */
const onSendingReporting = (e) => {
  log.debug(e);
}
</script>

<template>
  <!-- TODO ajouter l'emprise du widget pour la gestion des collisions -->
</template>

<style>
</style>