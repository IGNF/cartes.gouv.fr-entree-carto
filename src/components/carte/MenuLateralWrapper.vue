<script setup lang="js">
import { OhVueIcon as VIcon } from 'oh-vue-icons'

const props = defineProps({
  side: String,
})


const icon = "bi-chevron-double-right"
const defaultScale = 0.8325;
const iconProps = computed(() => typeof icon === 'string'
  ? { scale: defaultScale.value, name: icon }
  : { scale: defaultScale.value, ...icon },
);

const is_expanded = ref(false)

const backgroundColor = getComputedStyle(document.body)?.backgroundColor;


const ToggleMenu = () => {
  is_expanded.value = !is_expanded.value
}

</script>



<template>

  <div class="menu-toggle-wrap" :class="`${is_expanded  && 'is_expanded'} ${props.side}`">
    <button class="menu-collapse-icon" @click="ToggleMenu">
        <VIcon
        v-bind="iconProps"
    />  
    </button>
    <div class="menu-list">
      <slot></slot>
    </div>
  </div>
</template>



<style scoped lang="scss">
.left {
left: 0;
}
.right {
  right: 0;
}
.menu-toggle-wrap {
    position: absolute;
    height: inherit;
    display: flex;
    z-index: 1;
    background-color: v-bind(backgroundColor);
    width : 50px;
    &.is_expanded {
      width:auto;
      .menu-list {
        width : auto;
    }
}
}



.menu-list {
  height: inherit;
  width: 0;
  overflow-y: scroll;
  scrollbar-width: thin;
}

.menu-collapse-icon {
    position: absolute;
    right: 0;
    margin-right: 15px;
    z-index: 1;
}

</style>
