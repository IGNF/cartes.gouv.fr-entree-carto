<template>
  <div
    class="fr-container fr-container--fluid fr-container-md"
  >
    <CgfrModalTheme />

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
          label: 'Découvrir cartes.gouv.fr',
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
import { CgfrModalTheme } from '@ignf/cartes.gouv.fr-vue-components';

import Modal from '@/components/modals/Modal.vue';
import ModalWelcome from '@/components/modals/ModalWelcome.vue';

import { useAppStore } from '@/stores/appStore';
let appStore = useAppStore();

import { useBaseUrl } from '@/composables/baseUrl';
import { useModals } from '@/composables/useModals';
import { ROUTE_NAMES } from '@/router/routeNames';
import { useRoute } from 'vue-router';
let modals = useModals();
const route = useRoute();
const isEmbedRoute = () => route.name === ROUTE_NAMES.EMBED;

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
  if (!dismissibleModals.includes('welcome') && !isEmbedRoute()) {
    modals.open('welcome');
  }
});
</script>
