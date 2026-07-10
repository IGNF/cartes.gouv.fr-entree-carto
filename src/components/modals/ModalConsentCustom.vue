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
import { useModals } from '@/composables/useModals';

// plugin local
import { useEulerian } from '@/plugins/Eulerian.js';

const router = useRouter();
const eulerian = useEulerian();
let modals = useModals();

const refConsent = ref(null);

const url = useBaseUrl() + "/donnees-personnelles";

const onModalConsentCustomClose = () => {
  modals.close('consentCustom');
  router.push({ path : '/' });
  // INFO
  // l'utilisateur a t il fait un choix ou fermeture direct ?
  eulerian.resume();
}

const onAcceptConsentAll = () => {
  eulerian.start();
  onModalConsentCustomClose();
}
const onRefuseConsentAll = () => {
  eulerian.stop();
  onModalConsentCustomClose();
}

onMounted(() => {
  if (refConsent.value) {
    // HACK vuedsfr
    var btn = refConsent.value.querySelector('button[title="Refuser tous les cookies"]');
    btn.classList.add("fr-btn--secondary");
    var ul = refConsent.value.querySelector('ul');
    ul.classList.replace("fr-btns-group--inline-reverse", "fr-btns-group--inline");
  }
})
</script>

<template>
  <div id="my-consent-description">
    <h5>Eulerian Analytics</h5>
    En cliquant sur 'Tout accepter', vous consentez à l'utilisation des cookies pour nous aider
    à améliorer notre site web en collectant et en rapportant des informations sur votre
    utilisation grâce à Eulerian Analytics. <br>
    Si vous n'êtes pas d'accord, veuillez cliquer sur 'Tout refuser'. 
    Votre expérience de navigation ne sera pas affectée.
  </div>
  <div>
    <p
      id="my-consent-buttons"
      ref="refConsent"
    >
      <DsfrConsent
        @accept-all="onAcceptConsentAll()"
        @refuse-all="onRefuseConsentAll()"
      >
        Préférences pour tous les services.
        <a :href="url">Données personnelles et cookies</a>
      </DsfrConsent>
    </p>
  </div>
</template>

<style>
/* Surcharge sur le composant DsfrConsent : 
  > on n'affiche pas le bouton 'Personnaliser les cookies' 
*/
#my-consent-buttons button[title="Personnaliser les cookies"] {
  display: none;
}
#my-consent-description {
  padding-bottom: 1em;
}
/* Surcharge sur le composant DsfrConsent : 
  > on centre les boutons 
*/
.fr-btns-group--inline-sm.fr-btns-group--right.fr-btns-group--inline-reverse {
  justify-content: end;
}
</style>