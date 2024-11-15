<script lang="js">
/**
 * @description
 * Redirection sur l'IAM de la geoplateforme
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
  var session = urlParams.get('session_state');

  // Si aucun parametre de session dans l'URL de la route '/logout',
  // on redirige vers IAM de deconnexion
  if (!queryString) {
    location.href = service.getAccessLogout();
  }
  // IAM de deconnexion redirige vers la route '/logout' aprés validation
  // Et, elle fournit la 'session'
  if (session) {
    router.push({ path : '/' });
  }
});
</script>

<template>
  <slot></slot>
</template>