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
  <tr class="control-list-element">
    <td class="control-list-element-img">
      <DsfrTooltip
        on-hover
        :content="controlListElementOptions.tooltip"
      >
        <div>
          <span
            v-if="controlListElementOptions.svg" 
            class="custom-svg-icon" 
            v-html="controlListElementOptions.svg"
          />
          <VIcon
            v-else
            :name="controlListElementOptions.icon"
          />
        </div>
      </DsfrTooltip>
    </td>
    <td class="control-list-element-img">
      <DsfrTooltip
        on-hover
        :content="controlListElementOptions.tooltip"
      >
        <DsfrToggleSwitch
          v-model="isActive"
          :disabled="controlListElementOptions.disabled"
          :input-id="controlListElementOptions.id"
          :label="controlListElementOptions.label"
          label-left
          :model-value="selectedControlsModel === true || (Array.isArray(selectedControlsModel) && selectedControlsModel.includes(controlListElementOptions.name))"
          v-bind="$attrs"
          class="control-list-element"
        />
      </DsfrTooltip>
    </td>
  </tr> 
</template>

<style scoped>
.control-list-element {
    margin-bottom: 20px;
    max-width: 95%;
}
.control-list-element-img {
  border: solid --background-default-grey;
}

.custom-svg-icon svg {
  width: 19.2px;
  height: 19.2px;
  display: inline-block;
  color: var(--test-default-grey);
  fill: currentColor;
}
.custom-svg-icon{
  display: inline-block;
  vertical-align: middle; 
  color: var(--test-default-grey);
  font-size: 1em;
}

td {
  vertical-align: top;
  text-align: left;
}

</style>
