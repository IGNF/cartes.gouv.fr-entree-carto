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
const translateRight = computed(() => {
  return "-" + cssWidth.value;
})
const menuTabs = ref()
const backgroundColor = getComputedStyle(document.body)?.backgroundColor;

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
        <button class="menu-collapse-icon" @click="closeMenu">
        Fermer
        <VIcon
        v-bind="iconProps"/>  
      </button>
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
left: 7px;
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
        width: v-bind(cssWidth);
      }

    }
}

.menu-content-list {
  height: inherit;
  background-color: v-bind(backgroundColor);
  padding-left: 30px;
  position: absolute;
  display: flex;
  flex-direction: column;
}
.menu-content {
  overflow-y: scroll;
  scrollbar-width: thin;
  overflow-x: hidden;
}
.menu-logo-list {
  flex-direction: column;
  display: flex;
  row-gap: 20px;
  margin-top: 12px;
  width: 40px;
  position: absolute;
}


</style>
