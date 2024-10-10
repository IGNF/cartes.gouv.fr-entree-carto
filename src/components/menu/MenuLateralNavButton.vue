<script lang="js">
  /**
   * @description
   * 
   * @property { String } icon nom de l'icône à afficher
   * @property { String } id du menu à ouvrir au clic sur l'icone
   * @property { Boolean } active boolean assurant le style actif ou inactif du bouton
   * 
   */
  export default {
    name: 'MenuLateralButton'
  };
</script>

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
    <DsfrButton :id="props.id" 
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
