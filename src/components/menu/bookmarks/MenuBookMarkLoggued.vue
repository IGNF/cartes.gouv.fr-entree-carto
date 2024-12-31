<script setup lang="js">
import MenuBookMarkNoData from '@/components/menu/bookmarks/MenuBookMarkNoData.vue';

var service = inject('services');

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
  if (documentsIsReady.value) {
    return IsEmpty();
  }
});

onMounted(() => {
  // INFO
  // abonnement à l'evenement du service sur les documents afin de 
  // savoir quand tous les documents sont remontés
  service.target.addEventListener("service::documents", (e) => {
    documentsIsReady.value = true;
  });
})

</script>

<template>
  <div v-if="documentsIsEmpty">
    <MenuBookMarkNoData />
  </div>
  <div v-else>
    Mes enregistrements : Connecté (TODO)
  </div>
</template>

<style scoped>

</style>