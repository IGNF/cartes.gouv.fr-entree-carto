<script lang="js">
/**
 * @description
 * Component accordeon simple alternatif au DSFR
 */
export default {};
</script>

<script lang="js" setup>
const props = defineProps({
  description: String,
});

const iconBeforeExpand = "ri-arrow-down-s-line"
const iconAfterExpand = "ri-arrow-drop-up-line"

const BtnLabelBeforeExpand = "Afficher plus"
const BtnLabelAfterExpand = "Afficher moins"

const isExpanded = ref(false)

const BtnLabel = computed(() => { return isExpanded.value ? BtnLabelAfterExpand : BtnLabelBeforeExpand })

function ExpandAction() {
    isExpanded.value = !isExpanded.value;
}


onMounted(() => {

})
</script>

<template>
    <div>
        <div class="title-Expand">
            <p class="fr-hint-text hint-class" v-show="isExpanded">{{ description }}</p>            
            <DsfrButton
                tertiary
                iconRight
                noOutline
                size="sm"
                :icon="isExpanded ? iconAfterExpand : iconBeforeExpand"
                @click="ExpandAction()">
                {{ BtnLabel }}
            </DsfrButton>
        </div>
    </div>    
</template>

<style scoped>
.title-Expand {
}
</style>
