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
  var code = urlParams.get('code');
  var session = urlParams.get('session_state');
  var state = urlParams.get('state');

  // Si aucun parametre de session dans l'URL de la route '/login',
  // on redirige vers IAM authentification
  if (!queryString) {
    // Lien vers IAM pour se connecter
    location.href = service.getAccessLogin();
  }
  // IAM authentification redirige vers la route '/login' aprés validation
  // Et, elle fournit le 'code' et la 'session'
  if (code && session && state) {
    // on peut rediriger vers la route '/' pour traitement suivant
    router.push({ path : '/' });
  }
});

</script>

<template>
  <slot></slot>
</template>