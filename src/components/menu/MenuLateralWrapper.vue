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

/* FIXME : le bouton widget n'est pas intégré à la grille des widgets
On gère donc sa position de manière absolue
En mode petit écran on le positionne tout en haut en attendant mieux */
@media (max-width: 382px) {
  .menu-logo-list {
    margin-top: 13px;
  }
}

@media (max-width: 576px) and (min-width: 382px) {
  .menu-logo-list {
    margin-top: 13px;
  }
}

@media (max-width: 627px) and (min-width: 576px){
  .menu-logo-list {
    top : 228px;
  }
}
/* Petits écrans */
@media (max-width: 627px) {
  // FIXME : on cache les bouton "rouage" et "catalogue" si un menu latéral est ouvert.
  // Cette instruction contourne le css scopé pour selectionner le menu suivant (tild) si le menu scopé est expanded
  .menu-toggle-wrap.is_expanded ~ .menu-toggle-wrap > .menu-logo-list {
    display : none;
  }

  // Cette instruction contourne le css scopé pour selectionner le menu scopé s'il y a un menu expanded après (tild)
  .menu-toggle-wrap:has(~ .menu-toggle-wrap.is_expanded) > .menu-logo-list {
    display: none
  }
  /* Les panels de gestion des widgets et du catalogue prennent toute la largeur
  sur petits écrans (<627px de large) et passent au dessus du reste */
  .menu-toggle-wrap {
    z-index: 1001;
    &.is_expanded {
      .menu-content-list {
        width: 100%;
      }
    }
  }

  .left {
    .menu-content-list {
      left: 0px;
    }
  }

  .right {
    .menu-content-list {
      right: 0px;
    }
  }
}
</style>
