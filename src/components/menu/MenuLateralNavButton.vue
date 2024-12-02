<script lang="js">
  /**
   * @description
   *
   * @property { String } icon nom de l'icône à afficher
   * @property { String } id du menu à ouvrir au clic sur l'icone
   * @property { Boolean } active boolean assurant le style actif ou inactif du bouton
   * @property { Boolean } title label du bouton
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
    active: Boolean,
    title: String,
})


const icon = props.icon

const emit = defineEmits(['tabClicked'])

const tabClicked = () => {
    emit("tabClicked", props.id);
}
</script>



<template>
    <DsfrButton
      :id="id"
      secondary
      :aria-label="title"
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
  background-color: var(--background-default-grey);
}

.navButton[aria-label]:hover::before {
  content: attr(aria-label);
  position: absolute;
  top: 0;
  color: var(--text-default-grey);
  font-size: .75rem;
  width: fit-content;
  white-space: nowrap;
  background-repeat: no-repeat;
  filter: drop-shadow(0 2px 6px rgba(0,0,18,.16));
  filter: drop-shadow(var(--overlap-shadow));
}

</style>
