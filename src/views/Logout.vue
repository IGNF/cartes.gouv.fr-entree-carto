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
  var success = urlParams.get('success'); // remote

  // Si aucun parametre de session dans l'URL de la route '/logout',
  // on redirige vers IAM de deconnexion
  if (!queryString) {
    service.getAccessLogout().then((url) => {
      location.href = url;
    });
    return;
  }
  // IAM de deconnexion redirige vers la route '/logout' aprés validation
  // Et, elle fournit la 'session' en mode 'local' ou 'success' pour le mode 'remote'
  var value = 0;
  if (service.mode === "local" && session) {
    value = 1;
  } else if (service.mode === "remote" && success !== null) {
    value = parseInt(success, 10);
  } else {
    value = 0;
  }
  router.push({ path : '/',  query: { from : 'logout', success : value } });
});
</script>

<template>
  <slot></slot>
</template>