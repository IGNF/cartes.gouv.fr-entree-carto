<script setup lang="js">

const props = defineProps({
    icon: String,
    id: String,
    active: Boolean
})


const icon = props.icon

const emit = defineEmits(['tabClicked'])

const tabClicked = () => {
    emit("tabClicked", props.id);
}
</script>



<template>
    <DsfrButton :id="id" 
    primary
    :class="`${active ? 'active': ''}  'navBarIcon'` && 'navButton'"
    :icon="icon"
    :iconOnly="true"
    @click="tabClicked">
    </DsfrButton>
</template>



<style scoped lang="scss">
.noclick {
    pointer-events: none;
}

.navButton {
  width: 40px;
  height: 40px;
  color: white;
}

</style>
