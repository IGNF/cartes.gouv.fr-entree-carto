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
import { useEulerian } from '@/plugins/Eulerian.js';

const router = useRouter();
const eulerian = useEulerian();

const consentCustomModalOpened = ref(false);
const refConsent = ref(null);

const title = "Panneau de gestion des cookies";
const size = "md";
const url = useBaseUrl() + "/donnees-personnelles";

const openModalConsentCustom = () => {
  consentCustomModalOpened.value = true;
  eulerian.pause();
}

const onModalConsentCustomClose = () => {
  consentCustomModalOpened.value = false;
  router.push({ path : '/' });
  // INFO
  // l'utilisateur a t il fait un choix ou fermeture direct ?
  eulerian.resume();
}

defineExpose({
  openModalConsentCustom,
  onModalConsentCustomClose
});

const onAcceptConsentAll = () => {
  eulerian.start();
  onModalConsentCustomClose();
}
const onRefuseConsentAll = () => {
  eulerian.stop();
  onModalConsentCustomClose();
}
const onClickValideChoice = () => {
  onModalConsentCustomClose();
}

onMounted(() => {
  if (refConsent.value) {}
})

onBeforeUpdate(() => {
  if (refConsent.value) {
    var btn = refConsent.value.querySelector('button[title="Refuser tous les cookies"]');
    btn.classList.add("fr-btn--secondary");
  }
})

onUpdated(() => {
  if (refConsent.value) {
    // HACK
    var btn = refConsent.value.querySelector('button[title="Refuser tous les cookies"]');
    btn.classList.add("fr-btn--secondary");
    var ul = refConsent.value.querySelector('ul');
    ul.classList.replace("fr-btns-group--inline-reverse", "fr-btns-group--inline");
  }
})

</script>

<template>
  <!-- Modale : Gestion des cookies (+ Eulerian) -->
  <DsfrModal
    :opened="consentCustomModalOpened" 
    :title="title"
    :size="size" 
    @close="onModalConsentCustomClose"
  >
    <!-- slot : c'est ici que l'on customise le contenu ! -->
    <p id="my-consent-custom" ref="refConsent">
      <DsfrConsent
        @accept-all="onAcceptConsentAll()"
        @refuse-all="onRefuseConsentAll()"
      >
        Préférences pour tous les services.
        <a :href="url">Données personnelles et cookies</a>
      </DsfrConsent>
    </p>
    <hr>
    <div>
      <h5>Eulerian Analytics</h5>
      En cliquant sur 'Tout accepter', vous consentez à l'utilisation des cookies pour nous aider
      à améliorer notre site web en collectant et en rapportant des informations sur votre
      utilisation grâce à Eulerian Analytics. <br>
      Si vous n'êtes pas d'accord, veuillez cliquer sur 'Tout refuser'. 
      Votre expérience de navigation ne sera pas affectée.
    </div>
    <div class="fr-consent-manager__buttons fr-btns-group fr-btns-group--right fr-btns-group--inline-sm">
      <DsfrButton
        @click="onClickValideChoice"
      >
        Confirmer mes choix
      </DsfrButton>
    </div>
  </DsfrModal>
</template>

<style>
/* Surcharge sur le composant DsfrConsent : 
  > on n'affiche pas le bouton 'Personnaliser les cookies' 
*/
#my-consent-custom button[title="Personnaliser les cookies"] {
  display: none;
}
/* Surcharge sur le composant DsfrConsent : 
  > on centre les boutons 
*/
.fr-btns-group--inline-sm.fr-btns-group--right.fr-btns-group--inline-reverse {
  justify-content: end;
}
</style>