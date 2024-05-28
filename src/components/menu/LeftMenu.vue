<script setup lang="js">
import MenuCatalogue from '@/components/menu/MenuCatalogue.vue';
import MenuControl from '@/components/menu/MenuControl.vue';

const props = defineProps({
    catalogueProps : Object,
    width: Number
})

const emit = defineEmits(['catalogueEvent'])

function addLayer(newLayername) {
    emit("catalogueEvent", newLayername);
}

const side = "left"

// Ce tableau donne l'ordre des icones du menu lateral
const tabArray = computed(() => {
    const arr = [
        {
            componentName : "MenuCatalogue",
            icon : "co-list-low-priority",
        },
        {
            componentName : "MenuControl",
            icon : "io-settings-sharp",
        }
    ];

    return arr
})


const activeTab = ref("MenuCatalogueContent")
const selectedControls = defineModel([])

function changeTab(newTab) {
    activeTab.value = newTab + "Content";
}

function tabIsActive(componentName) {
    return activeTab.value.replace("Content" , '') === componentName ? true : false
}
</script>

<template>
<MenuLateralWrapper
    :side="side"
    :width="props.width">
        <template #content>
            <div id="MenuCatalogueContent" 
                :class="[activeTab === 'MenuCatalogueContent' ? 'activeTab' : 'inactiveTab']" >
                <MenuCatalogue
                    :layers="catalogueProps.layersConf"
                    @add-layer="addLayer"
                />
            </div>
            <div id="MenuControlContent"
                :class="[activeTab === 'MenuControlContent' ? 'activeTab' : 'inactiveTab']" >
                <MenuControl
                v-model="selectedControls"/>
            </div>

        </template>
        <template #navButtons>
                 <MenuLateralNavButton
                v-for="tab in tabArray"
                :icon="tab.icon"
                :id="tab.componentName"
                :active="tabIsActive(tab.componentName)"
                @change-tab="changeTab"/>
        </template>
</MenuLateralWrapper>
</template>



<style scoped lang="scss">
.activeTab {
    display : block;
}

.inactiveTab {
    display : none;
}
</style>
