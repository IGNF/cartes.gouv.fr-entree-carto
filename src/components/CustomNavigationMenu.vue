<script setup lang="js">
import { useRandomId, useCollapsable } from "@gouvminint/vue-dsfr"
import { useElementSize } from '@vueuse/core'
import { useBaseUrl } from '@/composables/baseUrl';
import { useDomStore } from "@/stores/domStore"
const domStore = useDomStore();

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
  return `-${menuWidth.value - btnWidth.value}px`
})

const expanded = computed(() => props.id === props.expandedId)

const service = inject('services');

const user = computed(() => {
  console.log(service)
  if (service.authenticated) {
    return service.user
  }
  return null
});

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
    v-if="menu.connexionMenu && !user"
    ref="button"
    icon="ri-logout-box-r-line"
    class="fr-nav__btn fr-nav__btn-no-dropdown">
    <a :href="useBaseUrl() +  '/login'">Se connecter</a>
  </DsfrButton>
  <DsfrButton
    v-else
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
    :class="{
          'fr-collapse--expanded': cssExpanded,
          'minimized': domStore.isHeaderCompact
    }"
    @transitionend="onTransitionEnd(expanded)"
  >
    <ul
      class="fr-menu__list"
    >
    <DsfrNavigationMenuItem v-if="menu.connexionMenu && user">
      <div class="fr-container">  
        <div class="fr-grid-row fr-grid-row--left">
          <div class="fr-mt-1v fr-mb-2v fr-description__info fr-text--xs">
            <b>{{ user.first_name }} {{ user.last_name }}</b>
          </div>
        </div>
        <div class="fr-grid-row fr-grid-row--left">
          <div class="fr-mb-2v fr-description__info fr-text--xs fr-text-mention--grey">
            {{ user.email }}
          </div>
        </div>
      </div>
    </DsfrNavigationMenuItem>
    <DsfrNavigationMenuItem
        v-for="(link, idx) of menu.links"
        :key="idx"
        @click.stop="$emit('toggleId', expandedId)"
      >
      <div v-if="link.button" :id="idx" class="w100" >
        <div class="fr-grid-row fr-grid-row--center w100">
          <button class="fr-m-3v fr-btn fr-btn--tertiary fr-btn--icon-right w100 justify-center"
            :class="link.icon">
            <a :href="link.to">{{ link.text }}</a>
          </button>
        </div>
      </div>
      <a v-else :id="idx" :href="link.to"
        class="fr-link--icon-left fr-access__link fr-nav__link flex-start"
        :class="'fr-icon' + link.icon?.replace('ri', '')">
        <!-- <VIcon :name="link.icon" size="1.5rem" class="fr-icon--grey-800" /> -->
        {{link.text}}
      </a>
      </DsfrNavigationMenuItem>
      <DsfrNavigationMenuItem v-if="menu.connexionMenu">
      <div class="flex">
        <div class="fr-grid-row fr-grid-row--center w100">
          <button class="fr-m-3v fr-icon-logout-box-r-line fr-btn fr-btn--tertiary fr-btn--icon-left w100 justify-center">
            <i class="ri-logout-box-line"></i>
              <a v-if="user" :href="useBaseUrl() + '/logout'">Se déconnecter</a>
              <a v-else :href="useBaseUrl() +  '/login'">Se connecter</a>
          </button>
        </div>
      </div>
    </DsfrNavigationMenuItem>
    </ul>
  </div>

  </div>
</nav>
</template>

<style scoped lang="scss">
.flex-start {
  justify-content: flex-start;
}
.justify-center {
  justify-content: center;
}
.fr-nav__list {
  position: relative;
}
@media (min-width: 992px) {
.fr-access_menu {
  margin-left: v-bind(marginLeft);
}
.fr-access_menu:not(.minimized) {
  margin-top: -44px;
}
}
.w100 {
  width: 100%;
}
.flex {
  display: flex;
}

.fr-nav__btn-no-dropdown::after {
  display: none;
}

</style>