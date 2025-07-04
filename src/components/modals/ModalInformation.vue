<script lang="js">
/**
 * @see https://vue-ds.fr/composants/DsfrAlert
 * @description
 * Affichage d'une modale d'alertes afin de prévenir 
 * les utilisateurs d'une opération de maintenance
 * 
 * Cette modale est configurable via le fichier d'alertes : 
 * ```json
 * {
 *    "id": "edef2f50-4b68-4d3b-bf90-7c247b97b04f",
 *    "title": "Test 1",
 *    "description": "Test alerte 1",
 *    "link": {
 *      "url": "/niveau-de-service",
 *      "label": "En savoir plus"
 *    },
 *    "severity": "warning",
 *    "details": "C'est les détails",
 *    "date": "2025-06-24T20:48:07.455Z",
 *    "visibility": {
 *      "homepage": false,
 *      "contact": false,
 *      "map": true,
 *      "serviceLevel": true
 *    }
 * }
 * ```
 * 
 * Le champ **type** permet de choisir le type d'alerte :
 * - error (Erreur), 
 * - success (Succès), 
 * - warning (Avertissement),
 * - info (Information)
 * 
 * Le champ **opened** permet d'activer (true) / désactiver (false) la modale au chargement du site.
 * 
 */
export default {};
</script>
<script setup lang="js">
import { useDataStore } from "@/stores/dataStore";
import { useMapStore } from "@/stores/mapStore";
import { useEulerian } from '@/plugins/Eulerian';
import { useBaseUrl } from '@/composables/baseUrl';

const eulerian = useEulerian();
const data = useDataStore();

const title = "Messages d'informations";
const alerts = computed(() => {
  var lstAlerts = data.getAlerts();
  for (let index = 0; index < lstAlerts.length; index++) {
    const element = lstAlerts[index];
    element.closed = false;
  }
  return lstAlerts;
});

const description = (alert) => {
  // INFO
  // link : par défaut, url relative à cartes.gouv.fr
  var url = alert.link.url;
  if (url.startsWith('/')) {
    url = useBaseUrl() + alert.link.url;
  }
  var message = `${alert.description} - ${alert.details} <a href="${url}" title="ouvre une nouvelle fenêtre" target="_blank" class="fr-notice__link">${alert.link.label}</a>`;
  return `${message}`;
};

const opened = ref(alerts.value.length !== 0);

if (opened.value) {
  eulerian.pause();
}
const onModalInformationClose = () => {
  opened.value = false;
  eulerian.resume();
};

const onClose = (id) => {
  alerts.value.forEach((alert) => {
    if (alert.id === id) {
      alert.closed = true // mettre la propriété closed à true pour cette alerte
    }
  })
}
</script>

<template>
  <DsfrModal 
    :opened="opened" 
    :title="title"
    size="md" 
    @close="onModalInformationClose"
  >
    <!-- slot : c'est ici que l'on customise le contenu ! -->
    <DsfrAlert
      v-for="alert in alerts"
      :key="`alert-${alert.id}`"
      :type="alert.severity"
      :title="alert.title"
      :closed="alert.closed"
      :closeable=true
      @close="onClose(alert.id)"
    >
      <div v-html="description(alert)"></div>
    </DsfrAlert>
  </DsfrModal>
</template>

<style></style>