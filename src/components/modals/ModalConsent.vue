<script lang="js">
/**
 * @description
 * Modale de consentements des cookies / trackers Eulerian
 * 
 * La validation enregistre une entrée dans le localStorage :
 * `{"eulerianAnalytics":true,"isFullConsent":true}`
 * 
 * cf. {@link src/plugins/Eulerian.js}
 * 
 */
export default {};
</script>
<script setup lang="js">
import { useRouter } from 'vue-router';
import { useBaseUrl } from '@/composables/baseUrl';

import ModalConsentCustom from './ModalConsentCustom.vue';

// plugin local
import { useEulerian } from '@/plugins/Eulerian.js';

const router = useRouter();
const eulerian = useEulerian();

const refModalConsentCustom = ref(null);

// gestion de la modale de consentement 'eulerian'
var open = eulerian.hasKey();

const consentModalOpened = ref(!open);

const title = "À propos des cookies sur cartes.gouv.fr";
const size = "md";
const url = useBaseUrl() + "/donnees-personnelles";

const openModalConsent = () => {
  consentModalOpened.value = true;
  eulerian.pause();
}

const onModalConsentClose = () => {
  consentModalOpened.value = false;
  router.push({ path : '/' });
  // INFO
  // l'utilisateur a t il fait un choix ou fermeture direct ?
  eulerian.resume();
}

defineExpose({
  openModalConsent,
  onModalConsentClose
});

const onAcceptConsentAll = () => {
  eulerian.start();
  onModalConsentClose();
}
const onRefuseConsentAll = () => {
  eulerian.stop();
  onModalConsentClose();
}
const onCustomizeCookies = () => {
  eulerian.stop();
  onModalConsentClose();
  if (refModalConsentCustom.value) {
    refModalConsentCustom.value.openModalConsentCustom();
  }
}

</script>

<template>
  <div v-if="consentModalOpened"
class="fr-consent-banner">
    <h2 class="fr-h6">
{{ title }}
</h2>
    <p id="my-consent">
      <DsfrConsent
        @accept-all="onAcceptConsentAll()"
        @refuse-all="onRefuseConsentAll()"
        @customize="onCustomizeCookies()"
      >
        Bienvenue ! Nous utilisons des cookies pour améliorer votre expérience et 
        les services disponibles sur ce site. 
        Pour en savoir plus, visitez la page <a :href="url">Données personnelles et cookies</a>.  
        Vous pouvez, à tout moment, avoir le contrôle sur les cookies que vous souhaitez activer.
        Préférences pour tous les services.
      </DsfrConsent>
    </p>
    <DsfrButton
      id="fr-consent-modal-hidden-control-button"
      class="fr-hidden"
      @click="onModalConsentClose"
    />
  </div>
  <!-- Modale : Gestion des cookies personnalisés -->
  <ModalConsentCustom ref="refModalConsentCustom" />
</template>

<style>
/* Surcharge sur le composant DsfrConsent : 
  > on centre les boutons 
*/
.fr-btns-group--inline-sm.fr-btns-group--right.fr-btns-group--inline-reverse {
  justify-content: end;
}
</style>