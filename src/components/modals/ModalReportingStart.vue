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
import { useMapStore } from "@/stores/mapStore";
import { useDataStore } from "@/stores/dataStore";
import { useBaseUrl } from '@/composables/baseUrl';

const emitter = inject('emitter');

const eulerian = useEulerian();
const router = useRouter();
const mapStore = useMapStore();
const dataStore = useDataStore();

const faq = `${useBaseUrl()}/faq`;
const title = "Avant d'effectuer un signalement";
const icon = 'fr-icon-feedback-line';
const actions = [
  {
    label: 'J\'ai compris',
    onClick () {
      onModalReportingStartClose()
    }
  },
  {
    label: 'Afficher Plan IGN J+1',
    tertiary: true,
    onClick () {
      onModalReportingStartClose()
      var id = dataStore.getLayerIdByName("GEOGRAPHICALGRIDSYSTEMS.MAPS.BDUNI.J1", "WMTS");
      mapStore.addLayer(id);
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
  emitter.dispatchEvent("reporting:open:clicked", {
              open : true,
              componentName: "Reporting"
  });
};


defineExpose({
  openModalReportingStart,
  onModalReportingStartClose
});

</script>

<template>
  <DsfrModal
    id="reporting-modal" 
    :opened="opened" 
    :title="title"
    size="md" 
    :icon="icon"
    :is-alert="true"
    @close="onModalReportingStartClose"
  >
    <!-- slot : c'est ici que l'on customise le contenu ! -->
    <template #default>
      <p>
        Avant de débuter, nous vous recommandons de prendre connaissance de 
        notre <a :href="faq" target="_blank">foire aux questions</a> dédiée et d'afficher la carte la plus à jour,
        afin de vérifier que l'anomalie n'a pas déjà été prise en compte.
      </p>
    </template>
    <template #footer>
      <DsfrButtonGroup
        align="center"
        :buttons="actions"
        inline-layout-when="large"
      />
    </template>
  </DsfrModal>
</template>

<style>
  /* par dessus la barre de recherche et les boutons ajouté entrée carto (z-index 1000 - 1002) */
  dialog[id^="reporting-modal"] {
    z-index: 1003;
  }

</style>