<script lang="js">
/**
 * @description
 * Affichage d'une modale de succès de l'envoi d'un signalement
 */
export default {
  name: 'ModalReportingStart'
};
</script>

<script setup lang="js">
import { useRouter } from 'vue-router';
import { useEulerian } from '@/plugins/Eulerian';

const eulerian = useEulerian();
const router = useRouter();

const title = "Avant d'effectuer un signalement";
const icon = 'fr-icon-feedback-line';
const actions = [
  {
    label: 'J\'ai compris',
    onClick () {
      opened.value = false;
    }
  },
  {
    label: 'Mettre à jour la donnée',
    tertiary: true,
    onClick () {
      opened.value = false;
    }
  },
];

const opened = ref(false);
const style = ref({ display: "none" });

if (opened.value) {
  eulerian.pause();
}

const openModalReportingStart = (active) => {
  style.value = (active) ? { display: "block" } : { display: "none" };
  opened.value = true;
  eulerian.pause();
};

const onModalReportingStartClose = () => {
  opened.value = false;
  eulerian.resume();
};

defineExpose({
  openModalReportingStart,
  onModalReportingStartClose
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
    @close="onModalReportingStartClose"
  >
    <!-- slot : c'est ici que l'on customise le contenu ! -->
    <template #default>
      <p>
        Avant de débuter, nous vous recommendons de prendre connaissance de 
        notre <a href="" target="_blank">foire aux questions</a> dédiée, et de mettre à jour les données,
        afin de vérifier que l'anomalie n'a pas déjà été prise en compte.
      </p>
    </template>
  </DsfrModal>
</template>

<style></style>