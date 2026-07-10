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
  var from = urlParams.get('from'); // logout redirection

  // INFO
  // La session expirée n'est plus utilisée 
  // suite au changement de workflow de deconnexion, 
  // mais on garde le code en cas où...
  if (from === 'sessionExpired') {
    service.getAccessLogoutSilent()
    .then((url) => {
      location.href = url;
    })
    .catch((error) => {
      console.error('Silent logout failed:', error);
      // En cas d'échec de la déconnexion silencieuse, rediriger vers la page de connexion
      router.push({ path: '/', query: { from : 'logout', success : 0 } });
    });
    return;
  }

  // INFO
  // En cas de session invalide détectée à l'authentification
  if (from === 'authInvalid') {
    service.getAccessLogout()
    .then((url) => {
      location.href = url;
    })
    .catch((error) => {
      console.error('Logout after auth invalid failed:', error);
      router.push({ path: '/', query: { from : 'logout', success : 0 } });
    });
    return;
  }

  // INFO
  // Si aucun parametre de session dans l'URL de la route '/logout',
  // on redirige vers IAM de deconnexion
  if (!queryString) {
    service.getAccessLogout()
    .then((url) => {
      location.href = url;
    });
    return;
  }
  
  // IAM de deconnexion redirige vers la route '/logout' aprés validation
  // Et, elle fournit la 'session' en mode 'local' ou 'success' pour le mode 'remote'
  var value = 0;
  if (service.mode === "local" && session !== null) {
    // HACK
    // On considere que si on a une session, la deconnexion a reussi, 
    // même si on ne peut pas le verifier
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
  <slot />
</template>