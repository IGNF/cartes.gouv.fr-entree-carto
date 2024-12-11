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
  var token = urlParams.get('token');

  // Si aucun parametre de session dans l'URL de la route '/login',
  // on redirige vers IAM authentification
  if (!queryString) {
    // Lien vers IAM pour se connecter
    // on sort de l'application !
    service.getAccessLogin().then((url) => {
      location.href = url;
    });
  }
  // IAM authentification redirige vers la route '/login' aprés validation
  // Et, elle fournit le 'code' et la 'session' dans l'url
  // On revient dans l'application !
  if ((service.mode === "local" && code && session && state) ||
      (service.mode === "remote" && token)) {
    router.push({ path : '/' });
  }
});

</script>

<template>
  <slot></slot>
</template>