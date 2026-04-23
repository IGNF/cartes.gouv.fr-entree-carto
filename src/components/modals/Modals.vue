<template>
  <div
    class="fr-container fr-container--fluid fr-container-md"
  >
    <Modal
      v-if="modals.isOpen('theme')"
      name="theme"
      title="Paramètres d’affichage"
    >
      <ModalTheme />
    </Modal>

    <ModalConsent />

    <Modal
      v-if="modals.isOpen('consentCustom')"
      name="consentCustom"
      title="Panneau de gestion des cookies"
    >
      <ModalConsentCustom />
    </Modal>

    <Modal
      v-if="modals.isOpen('planisphere')"
      name="planisphere"
      title="Mode planisphère"
    >
      <ModalPlanisphere />
    </Modal>

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
import Modal from '@/components/modals/Modal.vue';
import ModalConsent from '@/components/modals/ModalConsent.vue';
import ModalPlanisphere from '@/components/modals/ModalPlanisphere.vue';
import ModalTheme from '@/components/modals/ModalTheme.vue';
import ModalWelcome from '@/components/modals/ModalWelcome.vue';

import { useAppStore } from '@/stores/appStore';
let appStore = useAppStore();

import { useBaseUrl } from '@/composables/baseUrl';
import { useModals } from '@/composables/useModals';
let modals = useModals();

const setUrl = (url) => {
  window.location.href = useBaseUrl() + url;
};

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
