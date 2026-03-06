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
import MenuBookMarkNoData from '@/components/menu/bookmarks/MenuBookMarkNoData.vue';
import MenuBookMarkDataList from '@/components/menu/bookmarks/MenuBookMarkDataList.vue';
import Patience from '@/components/utils/Patience.vue';

var service = inject('services');
const emitter = inject('emitter');

const documentsLoadState = ref('loading');
const isLoading = computed(() => documentsLoadState.value === 'loading');

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
  documentsLoadState.value = 'loaded';
  toggle.value = !toggle.value;
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
  if (service.isAlreadyAuthentificate() && !documentsIsEmpty.value) {
    documentsLoadState.value = 'loaded';
  }
})

</script>

<template>
  <div
    v-if="isLoading"
    class="patience-container"
  >
    <p class="fr-text fr-mt-2w">
      Chargement des enregistrements...
    </p>
    <Patience class="loader" />
  </div>
  <div v-else-if="documentsIsEmpty">
    <!-- Mode connecté sans documents dans l'espace personnel -->
    <MenuBookMarkNoData />
  </div>
  <div v-else>
    <!-- Mode connecté avec des documents disponible -->
    <MenuBookMarkDataList
      title="Mes enregistrements"
    />
  </div>
</template>

<style scoped>
.patience-container {
  width: 100%;
  height: unset;
  justify-content: center;

}
.loader {
  width: 80px;
  height: 80px;
  left: initial;
}
</style>