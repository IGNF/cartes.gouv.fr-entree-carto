<template>
  <div
    class="fr-container fr-container--fluid fr-container-md"
  >
    
    <CgfrModalTheme />

    <ModalConsent />

    <CgfrModalCookies 
      @accept-consent="onAcceptConsentAll"
      @refuse-consent="onRefuseConsentAll"
      @close-consent="OnCloseConsent"
    />

    <Modal
      v-if="modals.isOpen('welcome')"
      name="welcome"
      size="lg"
      title=""
      dismissible
      :actions="[
        {
          label: 'Accéder aux cartes',
          onClick () {
            modals.close('welcome')
          },
        },
        {
          label: 'En savoir plus',
          secondary: true,
          onClick () {
            setUrl('/decouvrir');
          },
        },
      ]"
    >
      <ModalWelcome />
    </Modal>
  </div>
</template>

<script setup>
import { CgfrModalCookies, CgfrModalTheme } from 'cartes.gouv.fr-vue-components';

import Modal from '@/components/modals/Modal.vue';
import ModalConsent from '@/components/modals/ModalConsent.vue';
import ModalTheme from '@/components/modals/ModalTheme.vue';
import ModalWelcome from '@/components/modals/ModalWelcome.vue';

import { useAppStore } from '@/stores/appStore';
let appStore = useAppStore();

import { useEulerian } from '@/plugins/Eulerian.js';
import { useBaseUrl } from '@/composables/baseUrl';
import { useModals } from '@/composables/useModals';
let modals = useModals();
const eulerian = useEulerian();

const setUrl = (url) => {
  window.location.href = useBaseUrl() + url;
};

function onAcceptConsentAll() {
  eulerian.start();
  eulerian.resume();
}
function onRefuseConsentAll() {
  eulerian.stop();
  eulerian.resume();
}

onMounted(() => {
  // modale d'embarquement ?
  // on verifie le localstorage, on ouvre si non inclus
  let dismissibleModals = [];
  if (localStorage.getItem(appStore.ns('modals'))) {
    dismissibleModals = JSON.parse(localStorage.getItem(appStore.ns('modals')));
  }
  if (!dismissibleModals.includes('welcome')) {
    modals.open('welcome');
  }
});
</script>
