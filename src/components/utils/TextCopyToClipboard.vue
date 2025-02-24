<script lang="js">
/**
 * @description
 * Panneau de partage de carte
 *
 * {@link https://github.com/dnum-mi/vue-dsfr/tree/main/src/components/DsfrButton}
 * {@link https://github.com/dnum-mi/vue-dsfr/tree/main/src/components/DsfrModal}
 * {@link https://github.com/dnum-mi/vue-dsfr/tree/main/src/components/DsfrShare}
 */
export default {};
</script>

<script lang="js" setup>
import { useClipboard } from '@vueuse/core'
import { VIcon } from '@gouvminint/vue-dsfr'
import { useMatchMedia } from '@/composables/matchMedia';

const isSmallScreen = useMatchMedia('SM')

const props = defineProps({
  copiedText: String,
  label: String,
  description : String
});
const clipboardSource = ref('')
const { text, copy, copied, isSupported } = useClipboard({ clipboardSource })


const iconBeforeCopy = "ri:file-copy-line"
const iconAfterCopy = "ic:outline-check"

const BtnLabelBeforeCopy = "Copier"
const BtnLabelAfterCopy = "Copié"

const icon = ref(iconBeforeCopy)
const BtnLabel = ref(BtnLabelBeforeCopy)
const defaultScale = ref(0.8325);
const iconProps = computed(() => typeof icon.value === 'string'
  ? { scale: defaultScale.value, name: icon.value }
  : { scale: defaultScale.value, ...icon.value },
);

function copyAction() {
    copy(props.copiedText)
    icon.value = iconAfterCopy
    BtnLabel.value = BtnLabelAfterCopy
    setTimeout(() => {
        icon.value = iconBeforeCopy
        BtnLabel.value = BtnLabelBeforeCopy
    }, 5000)
}


onMounted(() => {

})
</script>

<template>
    <div>
        <div class="title-copy">
            <div>{{ label }}</div>            
            <DsfrButton
                secondary
                iconRight
                :iconOnly="isSmallScreen"
                :icon="iconProps"
                @click="copyAction()">
                {{ BtnLabel }}
            </DsfrButton>
            </div>
        <p class="fr-hint-text hint-class">{{ description }}</p>            
    </div>    
</template>

<style scoped>
.title-copy {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
}
</style>
