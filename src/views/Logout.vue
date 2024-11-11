<script lang="js">
/**
 * @description
 * Logout sur l'IAM de la geoplateforme
 */
export default {};
</script>

<script setup lang="js">
import { useServiceStore } from '@/stores/serviceStore';
import { useRouter } from 'vue-router';

const router = useRouter();
const store = useServiceStore();

onMounted(() => {
  const queryString = location.search;
  const urlParams = new URLSearchParams(queryString);
  // parametres
  var session = urlParams.get('session_state');
  
  if (!queryString) {
    location.href = store.getService().getAccessLogout();
  }
  // La session a pour valeur 'null' aprés une deconnexion
  if (session === "null") {
    // TODO
    // reinitialisation de service
    router.push({ path : '/' });
  }
});
</script>

<template>
  <slot></slot>
</template>