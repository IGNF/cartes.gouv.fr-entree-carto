<script lang="js">
  /**
   * @description
   * 
   * @property {Object} controlListElementOptions 
   * 
   */
  export default {
    name: 'ControlListElement'
  };
</script>

<script setup lang="js">
import { VIcon } from '@gouvminint/vue-dsfr';

const props = defineProps({
  controlListElementOptions : Object,
  selectedControls : () => []
});
const selectedControls = defineModel()
const isActive = ref()

watch(isActive, (value) => {
  if(value === true && !selectedControls.value.includes(props.controlListElementOptions.name)) {
    selectedControls.value = [...selectedControls.value, props.controlListElementOptions.name]
  }
  if(value === false) {
    selectedControls.value = selectedControls.value.filter(e => e !== props.controlListElementOptions.name);
  }
})

onMounted(() => {

})
onUpdated(() => {
})

</script>

<template>
  <tr class="control-list-element">
    <td class="control-list-element-img">
      <DsfrTooltip
        onHover
        :content="controlListElementOptions.tooltip">
      <div><span v-if="controlListElementOptions.svg" v-html="controlListElementOptions.svg" class="custom-svg-icon"></span>
        <VIcon v-else
          :name="controlListElementOptions.icon"
        />
    </div>
  </DsfrTooltip>

    </td>
    <td class="control-list-element-img">
      <DsfrTooltip
        onHover
        :content="controlListElementOptions.tooltip">
      <DsfrToggleSwitch
        v-model="isActive"
        :disabled="controlListElementOptions.disabled"
        :input-id="controlListElementOptions.id"
        :label="controlListElementOptions.label"
        label-left
        :model-value="selectedControls === true || (Array.isArray(selectedControls) && selectedControls.includes(controlListElementOptions.name))"
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
