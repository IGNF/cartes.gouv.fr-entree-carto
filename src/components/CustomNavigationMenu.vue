<script setup lang="js">
import { useRandomId, useCollapsable } from "@gouvminint/vue-dsfr"
import { useElementSize } from '@vueuse/core'

const props = defineProps({
  id: {
    type: String,
    default: () => useRandomId('menu'),
  },
  menu: {
    type: Object,
    default: () => [],
  },
  expandedId: {
    type: String,
    default: '',
  }
})
const {
  collapse,
  collapsing,
  cssExpanded,
  doExpand,
  onTransitionEnd,
} = useCollapsable()
const emit = defineEmits(['toggleId'])
const button = ref(null)
const {  width: btnWidth, height: btnHeight } = useElementSize(button)
const { width: menuWidth, height: menuHeight } = useElementSize(collapse)

// 16px déduit de la classe .fr-menu
const marginLeft = computed(() => {
  return `-${menuWidth.value - btnWidth.value - 16}px`
})
const expanded = computed(() => props.id === props.expandedId)

watch(expanded, (newValue, oldValue) => {
  // @see https://github.com/GouvernementFR/dsfr/blob/main/src/core/script/collapse/collapse.js
  if (newValue !== oldValue) {
    doExpand(newValue)
  }
})

onMounted(() => {
  // NavigationMenu can be expanded by default
  // We need to trigger the expand animation at mounted
  if (expanded.value) {
    doExpand(true)
  }
})

</script>

<template>     
  <nav
    class="fr-nav"
    role="navigation"
    :aria-label="menu.title"
    :id="menu.title.trim().toLowerCase().replaceAll(' ', '-')"
  > 
  <div class="fr-nav__item">
  <DsfrButton
    ref="button"
    :label="menu.title"
    :icon="menu.icon"
    class="fr-nav__btn"
    :aria-expanded="expanded"
    :aria-controls="id"
    @click.stop="$emit('toggleId', id)">

  </DsfrButton>
    <div
    :id="id"
    ref="collapse"
    class="fr-collapse fr-menu fr-access_menu"
    data-testid="navigation-menu"
    :class="{ 'fr-collapse--expanded': cssExpanded, 'fr-collapsing': collapsing }"
    @transitionend="onTransitionEnd(expanded)"
  >
    <ul
      class="fr-menu__list"
    >
      <DsfrNavigationMenuItem
        v-for="(link, idx) of menu.links"
        :key="idx"
        @click.stop="$emit('toggleId', expandedId)"
      >
      <div :id="idx" class="fr-container" v-if="link.type && link.type == 'html'" v-html="link.text"
      >
      </div>
      <a v-else :id="idx" :href="link.to"
        class="fr-link--icon-left fr-access__link fr-nav__link flex-start"
        :class="'fr-icon' + link.icon?.replace('ri', '')">
        <!-- <VIcon :name="link.icon" size="1.5rem" class="fr-icon--grey-800" /> -->
        {{link.text}}
      </a>
      </DsfrNavigationMenuItem>
    </ul>
  </div>

  </div>
</nav>
</template>

<style scoped>
.flex-start {
  justify-content: flex-start;
}
.fr-nav__list {
  position: relative;
}
@media (min-width: 992px) {
.fr-access_menu {
  margin-left: v-bind(marginLeft);
}
}
</style>