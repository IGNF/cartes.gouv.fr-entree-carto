<script lang="js">
/**
 * @description
 * Affichage d'une modale de succès de l'envoi d'un signalement
 */
export default {
  name: 'ModalReportingSuccessSent'
};
</script>

<script setup lang="js">
import { useRouter } from 'vue-router';
import { useEulerian } from '@/plugins/Eulerian';

const eulerian = useEulerian();
const router = useRouter();

const title = "Merci de contribuer à améliorer cartes.gouv.fr !";
const icon = 'fr-icon-feedback-line';
const actions = [
  {
    label: 'Retour à la carte',
    onClick () {
      opened.value = false;
    }
  },
  {
    label: 'Autre contribution',
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

const openModalReportingSent = (active) => {
  style.value = (active) ? { display: "block" } : { display: "none" };
  opened.value = true;
  eulerian.pause();
};

const onModalReportingSentClose = () => {
  opened.value = false;
  eulerian.resume();
};

defineExpose({
  openModalReportingSent,
  onModalReportingSentClose
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
    @close="onModalReportingSentClose"
  >
    <!-- slot : c'est ici que l'on customise le contenu ! -->
    <template #default>
      <p>
        Nous vous tiendrons informé par courriel de la prise en compte de votre
        signalement par nos équipes.
      </p>
    </template>
  </DsfrModal>
</template>

<style></style>