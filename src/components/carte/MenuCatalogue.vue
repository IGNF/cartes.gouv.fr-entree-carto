<script setup lang="js">
// FIXME on place ce composant dans un autre répertoire : ex. menu ou navigation
// ce composant utilise un composant DSFR, il n'appartient pas à l'ensemble 'carte'
// revoir la logique de l'appel des composants de type menu !
import { useLogger } from 'vue-logger-plugin'
import MenuLateralWrapper from '@/components/carte/MenuLateralWrapper.vue';

const log = useLogger()

const props = defineProps({
    layers: Object
})
const headingTitle = "Catalogue de données";
const buttonLabel = "bouton label sensé déplier le side menu";
const collapsable = true;
const side = "left";

const menuItems = Object.values(props.layers).map((layer) => {
    return {
        text: layer.title,
        to: "/",
        id:layer.name
    }
}).slice(0, 50);


// const newLayername = defineModel();
const emit = defineEmits(['selectLayer'])

function selectLayer(e) {
    const newLayername = e.target.text
    emit("addLayer", newLayername);
}

</script>

<template>
<MenuLateralWrapper
    :side="side">
    <DsfrSideMenu
    :heading-title="headingTitle"
    :button-label="buttonLabel"
    :collapsable="collapsable"
    :menu-items="menuItems"
    @click="selectLayer"
  />
</MenuLateralWrapper>
</template>



<style scoped>
</style>
