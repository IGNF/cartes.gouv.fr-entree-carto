<script setup lang="js">

import { useLogger } from 'vue-logger-plugin';
import { useMatchMedia } from '@/composables/matchMedia';

import { useActionButtonEulerian } from '@/composables/actionEulerian';

import ReportingSuccessSentModal from '@/components/modals/ModalReportingSuccessSent.vue';
import ReportingStartModal from '@/components/modals/ModalReportingStart.vue';

import MyServiceAction from '@/features/reportingActions/iocServiceAction';

import { Reporting } from 'geopf-extensions-openlayers';

const emitter = inject('emitter');

const props = defineProps({
  mapId: String,
  visibility: Boolean,
  analytic: Boolean,
  reportingOptions: Object
});

const log = useLogger();

const map = inject(props.mapId)
const reporting = ref(new Reporting(props.reportingOptions));

const isSmallScreen = useMatchMedia('SM')

const refModalReportingSent = ref({});
const refModalReportingStart = ref({});

// abonnement sur l'ouverture du controle
emitter.addEventListener("reporting:open:clicked", (e) => {
  if (reporting.value) {
    reporting.value.setCollapsed(!e.open);
  }
});

function addThematics () {
  // TODO 
  // ajouter les thématiques pour le signalement
  // quand ils seront définis dans le store
}

onMounted(() => {
  if (props.visibility) {
    addThematics();
    reporting.value.setComponentService(new MyServiceAction());
    map.addControl(reporting.value)
    if (props.analytic) {
      var el = reporting.value.element.querySelector("button[id^=GPshowReportingPicto-]");
      useActionButtonEulerian(el);
    }
    /* abonnement au widget */
    reporting.value.on("reporting:opened", onOpenPanelInformation);
    reporting.value.on("reporting:sending", onSendingReporting);
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
    reporting.value.setComponentService(new MyServiceAction());
    map.addControl(reporting.value);
    if (props.analytic) {
      var el = reporting.value.element.querySelector("button[id^=GPshowReportingPicto-]");
      useActionButtonEulerian(el);
    }
    /* abonnement au widget */
    reporting.value.on("reporting:opened", onOpenPanelInformation);
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
  refModalReportingStart.value.openModalReportingStart(true);
}
/** 
 * gestionnaire d'evenement sur les abonnements
 * @description
 * ...
 */
const onSendingReporting = (e) => {
  log.debug(e);
  refModalReportingSent.value.openModalReportingSent();
}
</script>

<template>
  <ReportingSuccessSentModal ref="refModalReportingSent" />
  <ReportingStartModal ref="refModalReportingStart" />
</template>

<style>
button[id^="GPshowReportingPicto-"] {
  display: none;
}

div[id^="GPreporting-"]:has(>.gpf-btn-icon[aria-pressed=true]):after {
  display: none;
}

dialog[id^="GPreportingPanel-"] {
  top: -5px !important;
  left: 47px !important;
}

@media (max-width: 576px) {
  dialog[id^="GPreportingPanel-"] {
    /* HACK : surcharge de la propriété de position top de gpf-mobile-fullscreen deja en important */
    margin-top : -295px !important;
  }
}
</style>