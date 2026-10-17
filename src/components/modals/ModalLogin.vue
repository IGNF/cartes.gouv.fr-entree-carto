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
import { useRoute } from 'vue-router';
import { useAuth } from 'authentification-vue-oidc';
import { push } from 'notivue';
import { useMapStore } from "@/stores/mapStore";

const route = useRoute();
const { login } = useAuth();
const store = useMapStore();

const title = "Se connecter à cartes.gouv.fr";
const icon = 'fr-icon-account-fill';
const actions = [
  {
    label: 'Se connecter',
    async onClick () {
      // on renvoie vers la route de login
      opened.value = false;
      try {
        await login({ returnTo: route.fullPath });
      } catch {
        push.warning({ title: 'Connexion', message: 'La connexion est indisponible.' });
      }
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

const openModalLogin = (active) => {
  style.value = (active) ? { display: "block" } : { display: "none" };
  opened.value = true;
};

const onModalLoginClose = () => {
  opened.value = false;
};

const onModalLoginNoInformation = (status) => {
  console.log(status);
  // enregistrer l'information dans le localStorage
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