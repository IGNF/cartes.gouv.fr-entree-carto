<script setup lang="js">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from 'authentification-vue-oidc';
import { push } from 'notivue';

const router = useRouter();
const { login, isAuthenticated, error } = useAuth();

onMounted(async () => {
  if (isAuthenticated.value || error.value) {
    await router.replace('/');
    return;
  }
  try {
    await login({ returnTo: '/' });
  } catch {
    push.warning({ title: 'Connexion', message: 'La connexion est indisponible.' });
    await router.replace('/');
  }
});
</script>

<template>
  <span role="status">Connexion en cours...</span>
</template>
