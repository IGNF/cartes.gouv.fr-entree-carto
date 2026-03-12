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
  </div>
</template>

<script setup>
import Modal from '@/components/modals/Modal.vue';
import ModalConsent from '@/components/modals/ModalConsent.vue';
import ModalTheme from '@/components/modals/ModalTheme.vue';

import { useModals } from '@/composables/useModals';
let modals = useModals();
</script>
