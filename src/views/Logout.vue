<script lang="js">
/**
 * @description
 * Logout sur l'IAM de la geoplateforme
 */
export default {};
</script>

<script setup lang="js">
// PLUGIN: import { inject } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const service = inject('services');

onMounted(() => {
  const queryString = location.search;
  const urlParams = new URLSearchParams(queryString);
  // parametres
  var session = urlParams.get('session_state');
  
  if (!queryString) {
    location.href = service.getAccessLogout();
  }
  if (session) {
    router.push({ path : '/' });
  }
});
</script>

<template>
  <slot></slot>
</template>