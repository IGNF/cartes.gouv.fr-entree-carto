<script setup lang="ts">
import { inject } from 'vue';

import Main from './views/Main.vue';

import { useLogger } from "vue-logger-plugin";
import { useAuth } from 'authentification-vue-oidc';
import { useServiceStore } from '@/stores/serviceStore';
import { useServiceSyncDocuments } from '@/services/ServiceSyncDocuments';

const service = inject('services');
const emitter = inject('emitter');
const logger = useLogger();

if (!service || !emitter) {
  throw new Error('Missing document services');
}

useServiceSyncDocuments(useAuth(), service, useServiceStore(), emitter, () => {
  logger.warn('Espace personnel: Impossible de charger certains documents !');
});

// INFO
// Chargement direct de la page principale
// On peut prevoir à ce niveau : 
// - une page d'information
// - une page de maintenance
// Ces informations peuvent être fournies par un JSON de configuration editoriale 
</script>

<template>
  <Main />
</template>
