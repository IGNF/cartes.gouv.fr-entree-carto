<script setup lang="js">
import { ref, computed, inject, watch, onMounted, onBeforeUnmount } from 'vue'

import { 
  useRandomId, 
  useCollapsable 
} from "@gouvminint/vue-dsfr"

import { useLogger } from 'vue-logger-plugin'
import { useBaseUrl } from '@/composables/baseUrl';

const log = useLogger();

const props = defineProps({
  id: {
    type: String,
    default: () => useRandomId('menu'),
  },
  menu: {
    type: Object,
    default: () => ({}),
  },
  expandedId: {
    type: String,
    default: '',
  }
})

// INFO
// Émettre l'événement toggleId au parent
const emit = defineEmits(['toggleId'])
const toggleId = (id) => emit('toggleId', id)

const button = ref(null)
const {
  collapse,
  cssExpanded,
  doExpand,
} = useCollapsable()

const expanded = computed(() => props.id === props.expandedId)
watch(expanded, (newValue, oldValue) => {
  // @see https://github.com/GouvernementFR/dsfr/blob/main/src/core/script/collapse/collapse.js
  if (newValue !== oldValue) {
    doExpand(newValue)
  }
})


var service = inject('services');
// variable locale pour stocker l'utilisateur
const user = ref(service.user);
// Base URL pour les routes login/logout
const url = useBaseUrl() + import.meta.env.BASE_URL;

// INFO
// Écouter l'événement service:user:loaded pour mettre à jour l'utilisateur
const emitter = inject('emitter');
emitter.addEventListener('service:user:loaded', (e) => {
  log.debug('service:user:loaded event received:', e);
  user.value = e.detail || service.user;
});

onBeforeMount(() => {
  log.debug(`NavigationMenu (${props.id}) mounted.`);
});

onMounted(() => {
  // NavigationMenu can be expanded by default
  // We need to trigger the expand animation at mounted
  if (expanded.value) {
    doExpand(true)
  }
});

onBeforeUnmount(() => {});

</script>

<template>     
  <nav
    :id="menu.title.trim().toLowerCase().replaceAll(' ', '-')"
    class="fr-nav"
    role="navigation"
    :aria-label="menu.title"
  > 
    <div class="fr-nav__item">
      <DsfrButton
        v-if="menu.connexionMenu && !service.authenticated"
        ref="button"
        icon="ri-account-circle-fill"
        class="fr-nav__btn fr-nav__btn-no-dropdown"
      >
        <a
          :href="url + '/login'"
        >Se connecter</a>
      </DsfrButton>
      <DsfrButton
        v-else
        ref="button"
        :label="menu.title"
        :icon="menu.icon"
        class="fr-nav__btn"
        :aria-expanded="expanded"
        :aria-controls="id"
        @click.stop="toggleId(id)"
      />
      <div
        :id="id"
        ref="collapse"
        class="fr-collapse fr-menu fr-access_menu"
        data-testid="navigation-menu"
        :class="{
          'fr-collapse--expanded': cssExpanded,
        }"
      >
        <ul
          class="fr-menu__list"
        >
          <DsfrNavigationMenuItem v-if="menu.connexionMenu && service.authenticated && user">
            <div class="fr-container  fr-pt-2v">  
              <div class="fr-grid-row fr-grid-row--left">
                <div class="fr-description__info fr-text--xs">
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
            @click.stop="toggleId(expandedId)"
          >
            <div 
              v-if="link.button" 
              :id="idx" 
              class="w100"
            >
              <div class="fr-grid-row fr-grid-row--center w100">
                <button 
                  class="fr-m-3v fr-btn fr-btn--tertiary fr-btn--icon-right w100 justify-center"
                  :class="link.icon"
                >
                  <a
                    :href="link.to"
                    :target="link.target"
                  >{{ link.text }}</a>
                </button>
              </div>
            </div>
            <a 
              v-else 
              :id="idx"
              :href="link.to"
              :target="link.target"
              class="fr-link--icon-left fr-access__link fr-nav__link flex-start"
              :class="'fr-icon' + link.icon?.replace('ri', '')"
            >
              <!-- <VIcon :name="link.icon" size="1.5rem" class="fr-icon--grey-800" /> -->
              {{ link.text }}
            </a>
          </DsfrNavigationMenuItem>
          <DsfrNavigationMenuItem v-if="menu.connexionMenu">
            <div class="flex">
              <div class="fr-grid-row fr-grid-row--center w100">
                <button class="fr-m-3v fr-icon-logout-box-r-line fr-btn fr-btn--tertiary fr-btn--icon-left w100 justify-center">
                  <i class="ri-logout-box-line" />
                  <a 
                    v-if="service.authenticated"
                    :href="url + '/logout'"
                  >Se déconnecter</a>
                  <a 
                    v-else 
                    :href="url + '/login'"
                  >Se connecter</a>
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
.w100 {
  width: 100%;
}
.flex {
  display: flex;
}

.fr-nav__btn-no-dropdown::after {
  display: none;
}

a[target=_blank]::after {
  margin-left: auto;
}

// menus collapsable
.fr-nav__item {
  position: relative;
}
.fr-collapse {
  right: 0;
}

// boutons du menu (desktop et mobile)
.fr-header__tools-links {
  .fr-nav__btn {
    padding: 0.5rem;
  }
}
.fr-header__menu-links {
  .fr-nav__btn {
    padding: 0.5rem;
  }
  .fr-btn--tertiary {
    box-shadow: inset 0 0 0 1px var(--border-default-grey);
  }
  .fr-menu__list {
    margin: 0 -0.25rem;
    padding: 0 0 1rem;
  }
}
</style>

<style lang="scss">
// alignements des boutons du menu mobile
.fr-nav__btn span {
  margin-right: auto;
}

.fr-header__menu-links::after {
  content: none !important;
}
</style>