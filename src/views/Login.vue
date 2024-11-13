<script lang="js">
/**
 * @description
 * Login sur l'IAM de la geoplateforme
 */
export default {};
</script>

<script setup lang="js">
import { inject } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const service = inject('services');

onMounted(() => {
  const queryString = location.search;
  const urlParams = new URLSearchParams(queryString);
  // parametres
  var code = urlParams.get('code');
  var session = urlParams.get('session_state');
  var state = urlParams.get('state');

  if (!queryString) {
    location.href = service.getAccessLogin();
  } 
  // L'authentification fournit le 'code' et la 'session'
  if (code && session && state) {
    router.push({ path : '/' });
  }
});

</script>

<template>
  <slot></slot>
</template>