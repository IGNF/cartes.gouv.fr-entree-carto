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
      :label="title"
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

.navButton[title]:hover::before {
  content: attr(title);
  position: absolute;
  top: 0;
  color: var(--text-default-grey);
  font-size: .75rem;
  width: fit-content;
  white-space: nowrap;
  padding: .5rem .5rem 0.5rem 1.25rem;
  background-size: .375rem .5rem,.375rem .5rem,1px, 100%,calc(100% - 0.5rem) 100%;
  background-repeat: no-repeat;
  background-position: 0.125rem 50%, 0% 50%,0.375rem 100%,0.375rem 100%;
  filter: drop-shadow(0 2px 6px rgba(0,0,18,.16));
  filter: drop-shadow(var(--overlap-shadow));
  background-image: conic-gradient(from 56.31deg at 0% 50%,transparent 0deg,var(--background-overlap-grey) 0deg,var(--background-overlap-grey) 67.38deg,transparent 67.38deg),conic-gradient(from 56.31deg at 0% 50%,transparent 0deg,var(--border-default-grey) 0deg,var(--border-default-grey) 67.38deg,transparent 67.38deg),linear-gradient(90deg,var(--border-default-grey),var(--border-default-grey)),linear-gradient(90deg,var(--background-overlap-grey),var(--background-overlap-grey));
}

</style>
