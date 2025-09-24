<script setup lang="js">
import { useRandomId, useCollapsable } from "@gouvminint/vue-dsfr"

const props = defineProps({
  id: {
    type: String,
    default: () => useRandomId('menu'),
  },
  links: {
    type: Array,
    default: () => [],
  },
  expandedId: {
    type: String,
    default: '',
  }
})

const emit = defineEmits(['toggleId'])


const {
  collapse,
  collapsing,
  cssExpanded,
  doExpand,
  onTransitionEnd,
} = useCollapsable()

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


const navItems = [
  {
    title: "Mon espace",
    links :[
      {
          text: "Cartes",
          to: "#",
          icon: "fr-icon-map-line"
      },
      {
          text: "Tableau de bord",
          to: "#",
          icon: "ri-speed-up-line"
      },
      {
          text: "Mon compte",
          to: "#",
          icon: "ri-user-line"
      }
    ]   
  }
]
// const links= navItems[0].links

</script>

<template>

    <!-- <DsfrNavigation
        :nav-items="navItems"
    >

    
      <DsfrButton
        icon="ri-logout-box-r-line"
        icon-position="left"
        size="sm"
        tertiary
        no-outline
      >
        Se déconnecter
      </DsfrButton>
    </DsfrNavigation> -->
                <!-- <nav role="navigation" class="fr-access fr-nav" id="access-357">
                  <div class="fr-nav__item"> -->
                    
                  <DsfrNavigation>
                    <button
    class="fr-nav__btn"
    :aria-expanded="expanded"
    :aria-current="active || undefined"
    :aria-controls="id"
    @click="$emit('toggleId', id)"
  >
  <VIcon name="ri-user-line" size="1.5rem" class="fr-icon--grey-800" />
  <span>Mon espace</span>
</button>
                        <!-- <DsfrButton
                        icon="ri-user-line"
                        icon-right
                        size="sm"
                        tertiary
                        no-outline
                        :aria-expanded="expanded"
                        :aria-current="active || undefined"
                        :aria-controls="id"
                         @click="$emit('toggleId', id)"
                        >
                        <VIcon name="ri-arrow-drop-up-line" size="1.5rem" class="fr-icon--grey-800" />
                        Mon espace
                        </DsfrButton> -->


                            <div
                            :id="id"
                            ref="collapse"
                            class="fr-collapse fr-menu"
                            data-testid="navigation-menu"
                            :class="{ 'fr-collapse--expanded': cssExpanded, 'fr-collapsing': collapsing }"
                            @transitionend="onTransitionEnd(expanded)"
                          >
                            <ul
                              class="fr-menu__list"
                            >
                              <!-- @slot Slot par défaut pour le contenu de l’item de liste. Sera dans `<ul class="fr-menu__list">` -->
                              <slot />
                              <DsfrNavigationMenuItem
                                v-for="(link, idx) of links"
                                :key="idx"
                              >

                              <div v-if="link.type && link.type == 'html'" v-html="link.text" >
                              </div>
                              <a v-else :id="idx" :href="link.to"
                                class="fr-link--icon-left fr-access__link fr-nav__link fr-access__link fr-nav__link"
                                :class="'fr-icon' + link.icon?.replace('ri', '')">
                                <!-- <VIcon :name="link.icon" size="1.5rem" class="fr-icon--grey-800" /> -->
                                {{link.text}}
                              </a>
                                <!-- <DsfrNavigationMenuLink
                                  v-bind="link"
                                  @toggle-id="$emit('toggleId', expandedId)"
                                /> -->
                              </DsfrNavigationMenuItem>
                            </ul>
                          </div>
                        </DsfrNavigation> 



<!-- 

                  <div class="fr-collapse fr-access__menu fr-menu" id="collapse-332">
                    <ul class="fr-menu__list">
                      <li class="fr-menu__item">
                        <div class="fr-description" id="description-358">
                          <div class="fr-description__label fr-text--bold fr-text--sm fr-text-action-high--grey">Nom
                            utilisateur</div>
                          <div class="fr-description__info fr-text--xs fr-text-mention--grey">
                            adresseutilisateur@email.com</div>
                        </div>
                      </li>
                      <li class="fr-menu__item">
                        <a id="access__link-354" href="#"
                          class="fr-icon-dashboard-3-line fr-link--icon-left fr-access__link fr-nav__link fr-access__link fr-nav__link">Tableau
                          de bord</a>
                      </li>
                      <li class="fr-menu__item">
                        <a id="access__link-355" href="#"
                          class="fr-icon-user-line fr-link--icon-left fr-access__link fr-nav__link fr-access__link fr-nav__link">Mon
                          compte</a>
                      </li>
                      <li class="fr-menu__item fr-menu__option">
                        <div class="fr-option">
                          <a title="Se déconnecter" id="option-335" href="#"
                            class="fr-option__btn fr-btn fr-btn--sm fr-icon-logout-box-r-line fr-btn--icon-left fr-btn--tertiary">Se
                            déconnecter</a>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </nav> -->

</template>

<style scoped>

</style>