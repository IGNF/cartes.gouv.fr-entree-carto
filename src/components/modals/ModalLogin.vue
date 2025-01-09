<script lang="js">
/**
 * @description
 * Affichage d'une modale de connexion
 */
export default {
  name: 'ModalLogin'
};
</script>

<script setup lang="js">
import { useRouter } from 'vue-router';
import { useEulerian } from '@/plugins/Eulerian';

const eulerian = useEulerian();
const router = useRouter();

const title = "Se connecter à cartes.gouv.fr";
const icon = 'fr-icon-account-fill';
const actions = [
  {
    label: 'Se connecter',
    onClick () {
      // on renvoie vers la route de login
      opened.value = false;
      router.push({ path : '/login' });
    }
  },
  {
    label: 'Annuler',
    tertiary: true,
    onClick () {
      opened.value = false;
    }
  },
];

const opened = ref(false);

if (opened.value) {
  eulerian.pause();
}
const openModalLogin = () => {
  opened.value = true;
  eulerian.pause();
};

const onModalLoginClose = () => {
  opened.value = false;
  eulerian.resume();
};

defineExpose({
  openModalLogin,
  onModalLoginClose
});

</script>

<template>
  <DsfrModal 
    :opened="opened" 
    :title="title"
    size="md" 
    :icon="icon"
    :is-alert="true"
    :actions="actions"
    @close="onModalLoginClose">

    <!-- slot : c'est ici que l'on customise le contenu ! -->
    <template #default>
      <p>Pour enregistrer vos données, vous devez vous identifier 
        ou créer un compte sur cartes.gouv.fr
      </p>
    </template>
  </DsfrModal>
</template>

<style>

</style>