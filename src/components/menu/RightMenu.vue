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

const side = "right"

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


const activeTab = ref("MenuCatalogueContent1")
const selectedControls = defineModel([])

function changeTab(newTab) {
    activeTab.value = newTab + "Content1";
}

function tabIsActive(componentName) {
    return activeTab.value.replace("Content1" , '') === componentName ? true : false
}

onMounted(()=> {
    console.log(side)
})
</script>

<template>
<MenuLateralWrapper
    :side="side"
    :width="props.width"
    :menu-object-array="menuObjectArray">
        <template #content>
            <div id="MenuCatalogueContent1" 
                :class="[activeTab === 'MenuCatalogueContent1' ? 'activeTab' : 'inactiveTab']" >
                <MenuCatalogue
                    :layers="catalogueProps.layersConf"
                    @add-layer="addLayer"
                />
            </div>
            <div id="MenuControlContent1"
                :class="[activeTab === 'MenuControlContent1' ? 'activeTab' : 'inactiveTab']" >
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
