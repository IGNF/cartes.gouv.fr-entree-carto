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
  <!-- <tr class="control-list-element">
    <td class="control-list-element-img" />
    <td> -->
      <div v-if="['elevationPath','measureAzimuth','reverseGeocode'].includes(controlListElementOptions.id)">
        <DsfrTooltip
        onHover
        :content="controlListElementOptions.hint">
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
      </div>
      <div v-else>
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
      </div>

    <!-- </td>
  </tr> -->
</template>

<style scoped>
.control-list-element {
    margin-bottom: 20px;
    max-width: 95%;
}
.control-list-element-img {
  border: solid --background-default-grey;
}
</style>
