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
import { useMapStore } from "@/stores/mapStore";

const eulerian = useEulerian();
const router = useRouter();
const store = useMapStore();

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
const style = ref({ display: "none" });
const active = ref(false);

if (opened.value) {
  eulerian.pause();
}

const openModalLogin = (active) => {
  style.value = (active) ? { display: "block" } : { display: "none" };
  opened.value = true;
  eulerian.pause();
};

const onModalLoginClose = () => {
  opened.value = false;
  eulerian.resume();
};

const onModalLoginNoInformation = (status) => {
  console.log(status);
  // enregistrer l'information dans le sessionStorage
  store.noLoginInformation = status;
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
    @close="onModalLoginClose"
  >
    <!-- slot : c'est ici que l'on customise le contenu ! -->
    <template #default>
      <p>
        Pour enregistrer vos données, vous devez vous identifier 
        ou créer un compte sur cartes.gouv.fr
      </p>
      <div :style="style">
        <DsfrCheckbox
          :model-value="active"
          label="Ne plus afficher ce message"
          @update:model-value="onModalLoginNoInformation"
        />
      </div>
    </template>
  </DsfrModal>
</template>

<style>
button[title="ne plus afficher ce message"] {
  margin-top: 16px;
}
</style>