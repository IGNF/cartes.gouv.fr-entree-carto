<script lang="js">
/**
 * @description
 * Affichage d'une modale d'information afin de prévenir 
 * les utilisateurs d'une opération de maintenance
 * 
 * Cette modale est configurable via l'edito : 
 * ```json
 * "informations" : {
 *    "title": "Intervention technique",
 *    "description": "Une opération de maintenance aura lieu le lundi 15 juillet à partir de 19h.",
 *    "type": "error",
 *    "opened": false,
 *    "version": 1
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
import { useEulerian } from '@/plugins/Eulerian.js';

const eulerian = useEulerian();
const store = useMapStore();
const data = useDataStore();

const info = data.getInformations();
const title = info.title;
const description = info.description;
const type = info.type;
const version = info.version;
const opened = ref(info.opened && (version !== parseInt(store.noInformation, 10)));

if (opened.value) {
  eulerian.pause();
}
const onModalInformationClose = () => {
  opened.value = false;
  eulerian.resume();
};

const onModalNoInformationClose = () => {
  opened.value = false;
  store.noInformation = version;
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
      :description="description"
      :type="type"
    />
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