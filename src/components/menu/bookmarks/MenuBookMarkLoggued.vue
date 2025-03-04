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

var service = inject('services');
const emitter = inject('emitter');

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
var documentsIsReady = ref(false);
var documentsIsEmpty = computed(() => {
  // INFO
  // les promises sur les documents ne sont pas encore completement remontées !
  // on met donc une ref 'documentsIsReady' qui est complété par l'evenement émis 
  // par le service
  var value = IsEmpty();
  if (documentsIsReady.value) {
    return IsEmpty();
  }
  return value;
});

// INFO
// abonnement à l'evenement du service sur les documents afin de 
// savoir quand tous les documents sont remontés
emitter.addEventListener("service:documents:loaded", (e) => {
  documentsIsReady.value = true;
});

onMounted(() => {
})

</script>

<template>
  <div v-if="documentsIsEmpty">
    <!-- Mode connecté sans documents dans l'espace personnel -->
    <MenuBookMarkNoData />
  </div>
  <div v-else>
    <!-- Mode connecté avec des documents disponible -->
    <MenuBookMarkDataList
      title="Mes enregistrements" />
  </div>
</template>

<style scoped>

</style>