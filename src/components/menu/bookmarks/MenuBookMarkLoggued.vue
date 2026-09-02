<script lang="js">
/**
 * @description
 * Menu des Favoris en mode connecté 
 * avec un menu avec ou sans documents disponible
 * 
 * @listens emitter#service:documents:loaded
 */
export default {
  name: 'MenuBookMarkLoggued'
};
</script>

<script setup lang="js">
import { ref, computed, onMounted, onUnmounted, inject } from 'vue';

import MenuBookMarkNoData from '@/components/menu/bookmarks/MenuBookMarkNoData.vue';
import MenuBookMarkDataList from '@/components/menu/bookmarks/MenuBookMarkDataList.vue';
import Patience from '@/components/utils/Patience.vue';

var service = inject('services');
const emitter = inject('emitter');

const LOADED_DELAY_MS = 1500;

const documentsLoadState = ref('loading');
const isLoading = computed(() => documentsLoadState.value !== 'loaded');
const isFinishing = computed(() => documentsLoadState.value === 'finishing');
const documentsProgress = ref({});
let loadedDelayTimer = null;

const totalCategories = computed(() => {
  return Array.isArray(service.labels) ? service.labels.length : 0;
});

const completedCategories = computed(() => {
  return Object.keys(documentsProgress.value).length;
});

const progressItems = computed(() => {
  return Object.entries(documentsProgress.value).map(([label, value]) => ({
    label,
    loaded: value.loaded,
    total: value.total
  }));
});

const toDocumentsCompletedPayload = (payload) => {
  // Compatibilite: certains emitters poussent { detail: ... }, d'autres directement l'objet.
  return payload && payload.detail ? payload.detail : payload;
};

const setLoadedWithDelay = () => {
  documentsLoadState.value = 'finishing';
  if (loadedDelayTimer) {
    clearTimeout(loadedDelayTimer);
  }
  loadedDelayTimer = setTimeout(() => {
    documentsLoadState.value = 'loaded';
    loadedDelayTimer = null;
  }, LOADED_DELAY_MS);
};

const IsEmpty = () => {
  var empty = true;
  for (const key in service.documents) {
    if (Object.prototype.hasOwnProperty.call(service.documents, key)) {
      const element = service.documents[key];
      if (element && element.length) {
        empty = false;
      }
    }
  }
  return empty;
};

const hasInitializedAllCategories = () => {
  if (!Array.isArray(service.labels) || service.labels.length === 0) {
    return false;
  }

  return service.labels.every((label) => {
    // Validate label to prevent prototype pollution
    return Object.prototype.hasOwnProperty.call(service.documents, label) && 
           Array.isArray(service.documents[label]);
  });
};

var toggle = ref(false);
var documentsIsEmpty = computed(() => {
  // INFO
  // les promises sur les documents ne sont pas encore completement remontées !
  // on met donc une ref 'toggle' qui est complété par l'evenement émis 
  // par le service
  var value = IsEmpty();
  if (toggle.value) {
    return IsEmpty();
  }
  return value;
});

// INFO
// abonnement à l'evenement du service sur les documents afin de 
// savoir quand tous les documents sont remontés
emitter.addEventListener("service:documents:loaded", () => {
  setLoadedWithDelay();
  toggle.value = !toggle.value;
});
emitter.addEventListener("service:documents:completed", (payload) => {
  var detail = toDocumentsCompletedPayload(payload) || {};
  var category = detail.label;
  if (!category) {
    return;
  }

  var loaded = Array.isArray(detail.data) ? detail.data.length : 0;
  var total = Number.isFinite(detail.total) ? detail.total : loaded;

  var nextProgress = {
    ...documentsProgress.value,
    [category]: {
      loaded,
      total
    }
  };

  documentsProgress.value = nextProgress;

  // Fallback: si l'evenement global loaded n'arrive pas, on sort du chargement
  // une fois toutes les categories traitees.
  if (Object.keys(nextProgress).length >= totalCategories.value) {
    setLoadedWithDelay();
  }
});
// INFO
// abonnement à l'evenement du service afin de 
// mettre à jour le menu si un document a été ajouté, modifié ou supprimé...
emitter.addEventListener("document:saved", () => {
  documentsLoadState.value = 'loaded';
  toggle.value = !toggle.value;
});
emitter.addEventListener("document:deleted", () => {
  documentsLoadState.value = 'loaded';
  toggle.value = !toggle.value;
});
emitter.addEventListener("document:updated", () => {
  documentsLoadState.value = 'loaded';
  toggle.value = !toggle.value;
});

onMounted(() => {
  if (service.isAuthenticatedLocally() && (hasInitializedAllCategories() || !documentsIsEmpty.value)) {
    documentsLoadState.value = 'loaded';
  }
})

onUnmounted(() => {
  if (loadedDelayTimer) {
    clearTimeout(loadedDelayTimer);
  }
});

</script>

<template>
  <div
    v-if="isLoading"
    class="loading-container"
  >
    <p class="fr-text fr-mt-2w">
      Chargement des enregistrements...
    </p>
    <p class="fr-text--sm fr-mb-1w progress-summary">
      {{ completedCategories }} / {{ totalCategories }} catégories chargées
    </p>
    <ul
      v-if="progressItems.length"
      class="progress-list fr-text--xs"
    >
      <li
        v-for="item in progressItems"
        :key="item.label"
      >
        {{ item.label }} : {{ item.loaded }} / {{ item.total }}
      </li>
    </ul>
    <p
      v-if="isFinishing"
      class="fr-text fr-text--sm done-label"
    >
      Terminé !
    </p>
    <Patience />
  </div>
  <div v-else-if="documentsIsEmpty">
    <!-- Mode connecté sans documents dans l'espace personnel -->
    <MenuBookMarkNoData />
  </div>
  <div v-else>
    <!-- Mode connecté avec des documents disponible -->
    <MenuBookMarkDataList />
  </div>
</template>

<style scoped>
.loading-container {
  width: 100%;
  height: unset;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

}
.progress-summary {
  margin-top: 0;
}
.progress-list {
  width: 100%;
  max-width: 320px;
  margin: 0 0 0.5rem;
  text-align: left;
}
.done-label {
  margin: 0 0 0.5rem;
  color: var(--text-title-grey);
  font-weight: 700;
}
</style>