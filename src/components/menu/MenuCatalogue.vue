<script lang="js">
  export default {
    name: 'CatalogueMenu'
  }
</script>

<script setup lang="js">
import { useLogger } from 'vue-logger-plugin'

const log = useLogger()

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
        id: layer.name
    }
})


const emit = defineEmits(['onClickSelectLayer'])

function onClickSelectLayer(e) {
    const newLayername = e.target.textContent
    emit("addLayer", newLayername);
}

</script>

<template>
  <DsfrSideMenu
    :heading-title="headingTitle"
    :button-label="buttonLabel"
    :collapsable="collapsable"
    :menu-items="menuItems"
    @click="onClickSelectLayer"
  />
</template>



<style scoped>
</style>
