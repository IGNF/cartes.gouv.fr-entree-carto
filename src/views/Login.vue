<script lang="js">
/**
 * @description
 * Login sur l'IAM de la geoplateforme
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
  var code = urlParams.get('code');
  var session = urlParams.get('session_state');
  var state = urlParams.get('state');
  
  if (!queryString) {
    location.href = store.getService().getAccessLogin();
  } 
  // L'authentification fournit le 'code' et la 'session'
  if (code && session && state) {
    // TODO
    // initialise la connexion
    router.push({ path : '/' });
  }
});

</script>

<template>
  <slot></slot>
</template>