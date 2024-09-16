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

// plugin local
import { useEulerian } from '../../plugins/Eulerian.js';

const router = useRouter();
const eulerian = useEulerian();

// gestion de la modale de consentement 'eulerian'
var open = eulerian.hasKey();

const consentModalOpened = ref(!open);

const title = "Panneau de gestion des cookies";
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
</script>

<template>
  <!-- Modale : Gestion des cookies (+ Eulerian) -->
  <DsfrModal 
    :opened="consentModalOpened" 
    :title="title"
    :size="size" 
    @close="onModalConsentClose">
    <!-- slot : c'est ici que l'on customise le contenu ! -->
      <p>
        <DsfrConsent
          @accept-all="onAcceptConsentAll()"
          @refuse-all="onRefuseConsentAll()">

          Préférences pour tous les services.
          <a :href="url">Données personnelles et cookies</a>
        </DsfrConsent>
      </p>
      <hr>
      <p>
        <h5>Eulerian Analytics</h5>
        En cliquant sur 'Tout accepter', vous consentez à l'utilisation des cookies pour nous aider
        à améliorer notre site web en collectant et en rapportant des informations sur votre
        utilisation grâce à Eulerian Analytics. <br>
        Si vous n'êtes pas d'accord, veuillez cliquer sur 'Tout refuser'. 
        Votre expérience de navigation ne sera pas affectée.
      </p>
    </DsfrModal>
</template>

<style>
/* Surcharge sur le composant DsfrConsent : 
  > on n'affiche pas le bouton 'Personnaliser' 
*/
button[title="Personnaliser les cookies"] {
  display: none;
}
/* Surcharge sur le composant DsfrConsent : 
  > on centre les boutons 
*/
.fr-btns-group--inline-sm.fr-btns-group--right.fr-btns-group--inline-reverse {
  justify-content: center;
}
</style>