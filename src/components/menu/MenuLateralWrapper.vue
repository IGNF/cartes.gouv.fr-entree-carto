<script setup lang="js">
// FIXME composant dans un autre répertoire : ex. menu
import { OhVueIcon as VIcon } from 'oh-vue-icons'

const props = defineProps({
  side: String,
  width: Number,
  menuObjectArray : Array
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

    <div class="menu-content-list">
        <slot name="content"></slot>
    </div>

    <div class="menu-logo-list">
      <button class="menu-collapse-icon" @click="ToggleMenu">
        <VIcon
        v-bind="iconProps"/>  
      </button>
      <slot name="navButtons"></slot>
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
    position: absolute;
    height: inherit;
    display: inline-flex;
    z-index: 1;
    background-color: v-bind(backgroundColor);
    &.is_expanded {
      .menu-content-list {
        width : auto;
      }
    }
}

.menu-content-list {
  height: inherit;
  width: 0;
  overflow-y: scroll;
  scrollbar-width: thin;
}
.menu-logo-list {
  flex-direction: column;
  display: flex;
}


</style>
