<script setup lang="js">
import { useLogger } from 'vue-logger-plugin'
import { useDataStore } from "@/stores/dataStore"
import { storeToRefs } from 'pinia'
const log = useLogger()
const store = useDataStore()
const { getLayers } = storeToRefs(store)

const props = defineProps({
    layers: Object
})
const headingTitle = "Catalogue de données";
const buttonLabel = "bouton label sensé déplier le side menu";
const collapsable = true;

const menuItems = Object.values(props.layers).map((layer) => {
    return {
        text: layer.title,
        to: "/",
        id:layer.name
    }
}).slice(0, 10);

const backgroundColor = getComputedStyle(document.body)?.backgroundColor;

// const newLayername = defineModel();
const emit = defineEmits(['selectLayer'])

function selectLayer(e) {
    const newLayername = e.target.text
    emit("addLayer", newLayername);
}

</script>

<template>
<div class="menu-catalogue">
    <DsfrSideMenu
    :heading-title="headingTitle"
    :button-label="buttonLabel"
    :collapsable="collapsable"
    :menu-items="menuItems"
    @click="selectLayer"
  />
</div>
</template>



<style scoped>
.menu-catalogue {
    position: absolute;
    height: inherit;
    z-index: 1;
    background-color: v-bind(backgroundColor);
    overflow-y: scroll;
}

</style>
