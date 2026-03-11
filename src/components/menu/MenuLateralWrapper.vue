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
const props = defineProps({
  side: String,
  visibility: Boolean,
  id: String,
})
const icon = "fr-icon-close-line"

const is_expanded = defineModel(false)

const menuTabs = ref()

function closeMenu() {
  is_expanded.value = false
}
function openMenu() {
  // cas particulier des fenêtres d'annotation
    const closeButton1 = document.querySelector('.gp-label-div button.GPpanelClose');
    if (closeButton1) {
      closeButton1.click();
    }
    const closeButton2 = document.querySelector('.gp-styling-div button.GPpanelClose');
    if (closeButton2) {
      closeButton2.click();
    }
  is_expanded.value = true
}

defineExpose({
  closeMenu,
  openMenu
})
</script>

<template>
  <div
    v-if="visibility"
    class="menu-toggle-wrap"
    :class="`${is_expanded && 'is_expanded'} ${props.side}`"
  >
    <div
      ref="menuTabs"
      class="menu-logo-list"
    >
      <slot name="navButtons" />
    </div>

    <div
      v-show="is_expanded"
      class="menu-content-list"
    >
      <div class="menu-collapse-icon-wrapper">
        <DsfrButton
          :id="props.id"
          size="sm"
          tertiary
          no-outline
          class="menu-collapse-icon"
          @click="closeMenu"
        >
          Fermer
          <span
            :class="icon" 
            aria-hidden="true"
          />
        </DsfrButton>
      </div>

      <div class="menu-content">
        <slot name="content" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/variables" as *;

.menu-toggle-wrap {
  position: absolute;
  z-index: 2;
  width: $widget-btn-size;

  @include max(sm) {
    // passe par dessus quand ouvert
    &.is_expanded {
      z-index: 5;
    }
  }

  &.left {
    // en haut/droite
    top: $gap;
    left: $gap;

    @include max(sm) {
      // decalage search
      top: $widget-btn-size + $gap * 2;
    }
  }
  &.right {
    // en haut/gauche, 3e position
    top: $widget-btn-size * 2 + $gap * 3;
    right: $gap;

    @include max(sm) {
      // decalage search
      top: $widget-btn-size * 3 + $gap * 4;
    }
  }
}

.menu-content-list {
  position: absolute;
  top: 0;
  @include widget-panel-sizes;
  overflow: auto;
  scrollbar-width: thin;
  background-color: var(--background-default-grey);
  border-radius: $widget-btn-radius;
  box-shadow: var(--raised-shadow);
}
.left .menu-content-list {
  left: $widget-btn-size + $gap;

  @include max(sm) {
    top: -($widget-btn-size + $gap * 2);
    left: -$gap;
  }
}
.right .menu-content-list {
  top: -($widget-btn-size * 2 + $gap * 2);
  right: $widget-btn-size + $gap;

  @include max(sm) {
    top: -($widget-btn-size * 3 + $gap * 4);
    right: -$gap;
  }
}

// wrapper du bouton Fermer
.menu-collapse-icon-wrapper{
  text-align: right;
  margin-right: 10px;
  margin-top: 10px;
}

.menu-logo-list {
  display: flex;
  flex-direction: column;
  gap: $gap;
  pointer-events: none;
  // hack pour positionnement du layer switcher
  ::v-deep(button) {
    pointer-events: all;
  }
}
.menu-content {
  padding: 1rem;
}
</style>
