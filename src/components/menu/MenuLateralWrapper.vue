<script lang="js">
  /**
   * @description
   * 
   * @property { String } side position sur la carte du menu : valeur possible 'left' ou 'right'
   * @property { Boolean } visibility  boolean assurant l'activation du menu
   * 
   */
  export default {
    name: 'MenuLateralWrapper'
  };
</script>

<script setup lang="js">
import { OhVueIcon as VIcon } from 'oh-vue-icons'

const props = defineProps({
  side: String,
  visibility: Boolean
})

const icon = "io-close"
const defaultScale = 0.8325;
const iconProps = computed(() => typeof icon === 'string'
  ? { scale: defaultScale.value, name: icon }
  : { scale: defaultScale.value, ...icon },
);

const is_expanded = defineModel(false)
const width = ref()
width.value = 30
const cssWidth = computed(() => {
  return width.value + "vw";
})
const menuTabs = ref()

function closeMenu() {
  is_expanded.value = false
}
function openMenu() {
  is_expanded.value = true
}

defineExpose({
  closeMenu,
  openMenu
})
</script>



<template>
  <div 
  class="menu-toggle-wrap" 
  :class="`${is_expanded  && 'is_expanded'} ${props.side}`"
  v-if="visibility"
  >
    <div ref="menuTabs" class="menu-logo-list">
      <slot name="navButtons"></slot>
    </div>

  
    <div class="menu-content-list"
    v-show="is_expanded">
      <div class="menu-collapse-icon-wrapper">
        <DsfrButton :id="id" 
          tertiary
          no-outline
          class="menu-collapse-icon"
          @click="closeMenu">
          Fermer
          <VIcon
        v-bind="iconProps"/>  
        </DsfrButton>
      </div>

      <div class="menu-content">
        <slot name="content"></slot>
      </div>
    </div>
  </div>
</template>



<style scoped lang="scss">
.left {
  .menu-logo-list {
left: 10px;
  }
  .menu-content-list {
    left: 60px;
  }
}
.right {
  .menu-logo-list {
  right: 16px;
  }
  .menu-content-list {
    right: 60px;
  }
}

.menu-collapse-icon {
    margin-bottom: 20px;
    &:hover{
      color : #8585f6;
    }
}

.menu-collapse-icon-wrapper{
  text-align: right;
  margin-right: 10px;
  margin-top: 10px;
}

.menu-toggle-wrap {
    height: inherit;
    z-index: 1;
    &.is_expanded {
      .menu-content-list {
        width: 550px;
        // width: v-bind(cssWidth);
      }

    }
}

.menu-content-list {
  height: inherit;
  background-color: var(--background-default-grey);
  padding-left: 30px;
  position: absolute;
  display: flex;
  flex-direction: column;
}
.menu-content {
  width : inherit
}
.menu-logo-list {
  flex-direction: column;
  display: flex;
  row-gap: 20px;
  margin-top: 12px;
  width: 40px;
  position: absolute;
}

/* FIX ME : le bouton widget n'est pas intégré à la grille des widgets
On gère donc sa position de manière absolue */
@media (max-width: 382px) {
  .menu-logo-list {
    top : 308px;
  }
}

@media (max-width: 576px) and (min-width: 382px){
  .menu-logo-list {
    top : 286px;
  }
}

@media (max-width: 627px) and (min-width: 576px){
  .menu-logo-list {
    top : 228px;
  }
}

</style>
