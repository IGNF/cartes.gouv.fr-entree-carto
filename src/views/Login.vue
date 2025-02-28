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
  var success = urlParams.get('success'); // remote
  var auth = urlParams.get('authentication_failed'); // remote

  // Si aucun parametre de session dans l'URL de la route '/login',
  // on redirige vers IAM authentification
  if (!queryString) {
    // Lien vers IAM pour se connecter
    // on sort de l'application !
    service.getAccessLogin().then((url) => {
      location.href = url;
    });
    return;
  }
  // IAM authentification redirige vers la route '/login' aprés validation
  // Et, elle fournit 
  // * le 'code' et la 'session' dans l'url pour le mode 'local'
  // * 'authentication_failed' ou 'success' pour le mode 'remote'
  // Puis, on revient dans l'application !
  var value = 0;
  if (service.mode === "local" && code && session && state) {
    value = 1;
  } else if (service.mode === "remote" && auth !== null) {
    value = parseInt(auth, 10);
  } else if (service.mode === "remote" && success !== null) {
    value = parseInt(success, 10);
  } else {
    value = 0;
  }
  router.push({ path : '/',  query: { from : 'login', success : value } });
});

</script>

<template>
  <slot></slot>
</template>
