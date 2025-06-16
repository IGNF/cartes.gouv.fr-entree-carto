<script lang="js">
/**
 * @description
 * Affichage d'une modale de sauvegarde
 */
export default {
  name: 'ModalSave'
};
</script>

<script setup lang="js">
import { useRouter } from 'vue-router';
import { useEulerian } from '@/plugins/Eulerian';

const eulerian = useEulerian();
const router = useRouter();

var delegateCbk = null;

const title = "Sauvegarde sur l'espace personnel";
const icon = 'fr-icon-save-fill';
const actions = [
  {
    label: 'Sauvegarder',
    onClick () {
      opened.value = false;
      // on déclenche l'appel de la fonction de sauvegarde
      // qui a été transmise par le composant parent
      // et qui est stockée dans la variable delegateCbk
      delegateCbk();
    }
  },
  {
    label: 'Annuler',
    tertiary: true,
    onClick () {
      opened.value = false;
      delegateCbk = null;
    }
  },
];

const opened = ref(false);

if (opened.value) {
  eulerian.pause();
}
const openModalSave = () => {
  opened.value = true;
  eulerian.pause();
};

const onModalSaveClose = () => {
  opened.value = false;
  eulerian.resume();
};

/**
 * On transmet la fonction d'execution de la sauvegarde
 * @param cbk
 */
const onDelegateCbk = (cbk) => {
  delegateCbk = cbk;
}

defineExpose({
  openModalSave,
  onModalSaveClose,
  onDelegateCbk
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
    @close="onModalSaveClose"
  >
    <!-- slot : c'est ici que l'on customise le contenu ! -->
    <template #default>
      <p>
        Voulez-vous enregistrer sur votre espace personnel la donnée importée ?
      </p>
    </template>
  </DsfrModal>
</template>

<style>

</style>