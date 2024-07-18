<script setup lang="js">
import { useDataStore } from "@/stores/dataStore"

const data = useDataStore();

const info = data.getInformations();
const title = info.title;
const description = info.description;
const type = info.type;
const opened = ref(info.opened);

const onModalInformationClose = () => {
  opened.value = false;
}

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
  
  </DsfrModal>
</template>