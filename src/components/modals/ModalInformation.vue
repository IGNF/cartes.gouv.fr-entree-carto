<script setup lang="js">
import { useDataStore } from "@/stores/dataStore";
import { useMapStore } from "@/stores/mapStore";

const store = useMapStore();
const data = useDataStore();

const info = data.getInformations();
const title = info.title;
const description = info.description;
const type = info.type;
const version = info.version;
const opened = ref(info.opened && (version !== parseInt(store.noInformation, 10)));

const onModalInformationClose = () => {
  opened.value = false;
};

const onModalNoInformationClose = () => {
  opened.value = false;
  store.noInformation = version;
};

</script>

<template>
  <DsfrModal 
    :opened="opened" 
    :title="title"
    size="md" 
    @close="onModalInformationClose">

    <!-- slot : c'est ici que l'on customise le contenu ! -->
    <DsfrAlert
      :description="description"
      :type="type"
    />
    <!-- fr-btn--close -->
    <button
      class="fr-btn--tertiary-no-outline" 
      title="ne plus afficher ce message"
      type="button"
      @click="onModalNoInformationClose">
      <span>Ne plus afficher ce message</span>
    </button>
  
  </DsfrModal>
</template>

<style>
/* Surcharge sur le composant DsfrConsent : 
  > on n'affiche pas le bouton 'Personnaliser' 
*/
button[title="ne plus afficher ce message"] {
  margin-top: 16px;
}
</style>