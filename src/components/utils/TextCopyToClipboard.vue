<script lang="js">
/**
 * @description
 * Composant utilitaire pour copier du texte dans le presse-papiers.
 * Un titre, une description, une zone de saisie et un bouton pour copier par défaut.
 * 
 * Plusieurs slots pour customiser le composant
 * - `label` : pour remplacer le titre
 * - `description` : pour remplacer la description
 * - `buttons-before` : pour ajouter des boutons avant le bouton de copie
 * - `buttons-after` : pour ajouter des boutons après le bouton de copie  
 */
export default {};
</script>

<script lang="js" setup>
import { useClipboard } from '@vueuse/core'
import { useMatchMedia } from '@/composables/matchMedia';

const isSmallScreen = useMatchMedia('SM')

const props = defineProps({
  copiedText: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  description : {
    type: String,
    default: ''
  }
});
const clipboardSource = ref('')
const { copy } = useClipboard({ clipboardSource })


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
    <div class="container-title">
      <div>
        <slot name="label">
          {{ label }}
        </slot>
      </div>
      <div class="container-buttons">
        <slot name="buttons-before" />
        <DsfrButton
          secondary
          icon-right
          :icon-only="isSmallScreen"
          :icon="iconProps"
          @click="copyAction()"
        >
          {{ BtnLabel }}
        </DsfrButton>
        <slot name="buttons-after" />
      </div>          
    </div>
    <p class="fr-hint-text hint-class">
      <slot name="description">
        {{ description }}
      </slot>
    </p>            
  </div>    
</template>

<style scoped>
.container-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
}
.container-buttons {
  display: inline-flex;
}

</style>
