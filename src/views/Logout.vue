<script setup lang="js">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from 'authentification-vue-oidc';
import { push } from 'notivue';

const router = useRouter();
const { logout } = useAuth();

onMounted(async () => {
  try {
    await logout();
  } catch {
    push.warning({ title: 'Connexion', message: 'La deconnexion du serveur est indisponible.' });
    await router.replace('/');
  }
});
</script>

<template>
  <span role="status">Déconnexion en cours...</span>
</template>