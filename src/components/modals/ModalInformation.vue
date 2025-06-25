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
 * L'utilisateur a la possibilité de valider le choix afin de ne plus afficher l'information sur la prochaine session
 * (cf. localStorage : cartes.gouv.fr.noInformation)
 */
export default {};
</script>
<script setup lang="js">
import { useDataStore } from "@/stores/dataStore";
import { useMapStore } from "@/stores/mapStore";
import { useEulerian } from '@/plugins/Eulerian';
import { useBaseUrl } from '@/composables/baseUrl';

const eulerian = useEulerian();
const store = useMapStore();
const data = useDataStore();

const title = "Messages d'informations";
const alerts = data.getAlerts();

const description = (alert) => {
  // INFO
  // link : url relative à cartes.gouv.fr par défaut
  var url = useBaseUrl() + alert.link.url;
  var message = `${alert.description} - ${alert.details} <a href="${url}">${alert.link.label}</a>`;
  return `${message}`;
};

// FIXME
// utiliser pour stopper l'affichage : store.noInformation=true|false
// mais si nouvelles alertes, il faut les afficher de nouveau !
const opened = ref(!store.noInformation);

if (opened.value) {
  eulerian.pause();
}
const onModalInformationClose = () => {
  opened.value = false;
  eulerian.resume();
};

const onModalNoInformationClose = () => {
  opened.value = false;
  store.noInformation = true;
  eulerian.resume();
};

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
    >
      <div v-html="description(alert)"></div>
    </DsfrAlert>
    <!-- fr-btn--close -->
    <button
      class="fr-btn--tertiary-no-outline" 
      title="ne plus afficher ce message"
      type="button"
      @click="onModalNoInformationClose"
    >
      <span>Ne plus afficher ce message</span>
    </button>
  </DsfrModal>
</template>

<style>
/* Surcharge sur le composant DsfrConsent : 
  > on n'affiche pas le bouton 'Personnaliser' 
*/
button[title="ne plus afficher ce message"] {
  margin-top: 16px;
}
</style>