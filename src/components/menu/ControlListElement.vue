<script lang="js">
  /**
   * @description 
   * Composant représentant un élément de la liste des contrôles dans le menu de gestion des outils.
   * 
   * @property {Object} controlListElementOptions Options de l'élément de la liste des contrôles
   * @property {Array} selectedControls Tableau des contrôles sélectionnés ajoutés à la carte
   */
  export default {
    name: 'ControlListElement'
  };
</script>

<script setup lang="js">
import { VIcon } from '@gouvminint/vue-dsfr';

const props = defineProps({
  controlListElementOptions: {
    type: Object,
    default: () => ({})
  },
  selectedControls: {
    type: Array,
    default: () => []
  }
});

const selectedControlsModel = defineModel({ type: Array, default: () => [] })
const isActive = ref()

const dsfrIcon = computed(() => typeof props.controlListElementOptions.icon === 'string' && props.controlListElementOptions.icon.startsWith('fr-icon-'))

watch(isActive, (value) => {
  if(value === true && !selectedControlsModel.value.includes(props.controlListElementOptions.name)) {
    selectedControlsModel.value = [...selectedControlsModel.value, props.controlListElementOptions.name]
  }
  if(value === false) {
    selectedControlsModel.value = selectedControlsModel.value.filter(e => e !== props.controlListElementOptions.name);
  }
})

onMounted(() => {})
onUpdated(() => {})

</script>

<template>
  <div class="control-list-element">
    <div class="control-list-element-img">
      <div>
        <VIcon
          v-if="!dsfrIcon"
          scale="1.25"
          :name="controlListElementOptions.icon"
        />
        <span 
          v-else
          :class="controlListElementOptions.icon" 
          aria-hidden="true"
        />
      </div>
    </div>
    <div class="control-list-element-toggle">
      <DsfrToggleSwitch
        v-model="isActive"
        :disabled="controlListElementOptions.disabled"
        :input-id="controlListElementOptions.id"
        :label="controlListElementOptions.label"
        label-left
        no-text
        :hint="controlListElementOptions.hint"
        :model-value="selectedControlsModel === true || (Array.isArray(selectedControlsModel) && selectedControlsModel.includes(controlListElementOptions.name))"
        v-bind="$attrs"
      />
    </div>
  </div> 
</template>

<style scoped>
.control-list-element {
  display: flex;
  align-items: center;
  margin: 0 0.5rem;
  padding: 1rem 0;
}
.control-list-element + .control-list-element {
  border-top: 1px solid var(--border-default-grey);
}
.control-list-element-img {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 0 0 40px;
  height: 40px;
  margin-right: 0.5rem;
}
.control-list-element-toggle {
  flex: 1;
}
</style>

<style lang="scss">
// augmente la zone cliquable du label
.control-list-element {
  .fr-toggle__label {
    padding-bottom: 1.5rem;
  }
  .fr-hint-text {
    position: absolute;
    bottom: 0;
    pointer-events: none;
  }
}
</style>
