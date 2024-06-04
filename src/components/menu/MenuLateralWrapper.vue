<script setup lang="js">
import { OhVueIcon as VIcon } from 'oh-vue-icons'
import { useElementSize, useEventListener } from '@vueuse/core'
import { vOnClickOutside } from '@vueuse/components'

const props = defineProps({
  side: String,
  menuObjectArray : Array
})

const icon = "bi-chevron-double-right"
const defaultScale = 0.8325;
const iconProps = computed(() => typeof icon === 'string'
  ? { scale: defaultScale.value, name: icon }
  : { scale: defaultScale.value, ...icon },
);

const is_expanded = ref(false)
const width = ref()
const resizer = ref()
width.value = 30
const cssWidth = computed(() => {
  return width.value + "vw";
})
const menuTabs = ref()
const { width : tabsWidth } = useElementSize(menuTabs)

const isResizing = ref(false)
const backgroundColor = getComputedStyle(document.body)?.backgroundColor;


const ToggleMenu = () => {
  is_expanded.value = !is_expanded.value
}



onMounted(() => {
  const mousedown = useEventListener(resizer, 'mousedown', (e) => {
    isResizing.value = true;
  })
  const mousemove = useEventListener(document, 'mousemove', (e) => {
    if (isResizing.value) {
      if (props.side == "left")
        width.value =  100 * ((e.clientX) / window.innerWidth)
      if (props.side == "right")
        width.value =  100 * ((window.innerWidth - e.clientX - tabsWidth.value) / window.innerWidth)
    }
  })
  const mouseup = useEventListener(document, 'mouseup', (e) => {
    if (isResizing.value) {
      isResizing.value = false;
    }
    
  })
})
function closeMenu() {
  is_expanded.value = false
}
</script>



<template>

  <div class="menu-toggle-wrap" :class="`${is_expanded  && 'is_expanded'} ${props.side}`"
    v-on-click-outside="closeMenu">

    <div class="menu-content-list resizable"
    draggable="false"
    v-show="is_expanded">
        <slot name="content"></slot>
    </div>

    <div ref="menuTabs" class="menu-logo-list">
      <button class="menu-collapse-icon" @click="ToggleMenu">
        <VIcon
        v-bind="iconProps"/>  
      </button>
      <slot name="navButtons"></slot>
    </div>
    <div class="panel-resizer"
      ref="resizer"
      v-show="is_expanded">
    </div>
  </div>
</template>



<style scoped lang="scss">
.left {
left: 0;
&.is_expanded {
  .menu-collapse-icon {
        transform : rotate(-180deg);
    }
}
}
.right {
  right: 0;
  .menu-collapse-icon {
    transform : rotate(-180deg)
  }
  &.is_expanded {
  flex-direction: row-reverse;
  .menu-collapse-icon {
        transform : none;
  }
  .menu-content-list {
    margin-left: 20px;
  }
}
}

.menu-collapse-icon {
    &:hover{
      color : #8585f6;
      // color : var(--text-activeblue-france-tab-active);
    }
    margin-bottom: 20px;
}
.menu-toggle-wrap {
    height: inherit;
    display: inline-flex;
    z-index: 1;
    background-color: v-bind(backgroundColor);
    &.is_expanded {
      .menu-content-list {
        width: v-bind(cssWidth);
      }
    }
}

.menu-content-list {
  height: inherit;
  width: 0;
  overflow-y: scroll;
  scrollbar-width: thin;
  flex: 1;
}
.menu-logo-list {
  flex-direction: column;
  display: flex;
}
.resizable {
  flex: none;
  min-width: 0;
  max-width: 50vw;
}
.panel-resizer {
  cursor: col-resize;
  position: relative;
  width: 4px;
  margin: 0 -2px;
  z-index: 1;
  &:hover{
  background-color:#8585f6;
  box-shadow: 0 1px 4px 1px #8585f6;
}
}


</style>
