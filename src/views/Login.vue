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
  // * 'authentication_failed' pour le mode 'remote'
  // Puis, on revient dans l'application !
  if (service.mode === "local" && code && session && state) {
    router.push({ path : '/',  query: { from : 'login', success : 1 } });
  } else if (service.mode === "remote" && auth !== null) {
    router.push({ path : '/',  query: { from : 'login', success : auth } });
  } else {
    router.push({ path : '/',  query: { from : 'login', success : 0 } });
  }
});

</script>

<template>
  <slot></slot>
</template>
