<script setup>
import { useDomStore } from "@/stores/domStore";
import { useHeaderParams } from '@/composables/headerParams';
import { useMatchMedia } from '@/composables/matchMedia';

const domStore = useDomStore();
const { theme } = useScheme();
const mobileScreen = useMatchMedia('LG');

let operatorImgSrc = computed(() => {
  let lightOrDark = theme.value === 'light' ? '' : '-dark';
  return `https://data.geopf.fr/annexes/ressources/header/cartes-gouv-logo${lightOrDark}.svg`;
});

const headerParams = useHeaderParams();

onMounted(() => {
  // modifie le badge beta en explorer
  let badge = document.querySelector('.fr-header__service-title .fr-badge');
  if (badge) {
    badge.classList.remove('fr-badge--green-emeraude');
    badge.classList.add('fr-badge--purple-glycine');
    badge.innerHTML = `
      <span class="fr-icon-road-map-fill fr-ml-n1v" style="transform:scale(0.5)"></span>
      Explorer
    `;
  }
});

//
// Hacks pour vuedsfr
//
// ajoute un faux quicklinks (pour pouvoir utiliser le slot after-quick-links)
headerParams.value.quickLinks = [
  {
    label: '',
    to: '/',
  }
];
// ajoute un faux aria-label (qui permet en CSS de masquer le faux quicklinks)
headerParams.value.quickLinksAriaLabel = 'hack_quickLinks';
</script>

<template>
  <DsfrHeader
    :service-title="headerParams.serviceTitle"
    :show-beta="true"
    :service-description="domStore.isHeaderCompact ? false : headerParams.serviceDescription"
    :logo-text="domStore.isHeaderCompact ? [] : headerParams.logoText"
    :quick-links="headerParams.quickLinks"
    :quick-links-aria-label="headerParams.quickLinksAriaLabel"
    :operator-img-src="operatorImgSrc"
    :language-selector="headerParams.languageSelector"
    :class="{ 'fr-header--compact': domStore.isHeaderCompact }"
  >
    <template #after-quick-links>
      <CustomNavigation
        id="main-navigation"
        label="Menu principal"
        :nav-items="headerParams.afterQuickLinks"
      />
      <CustomFooter v-if="mobileScreen" />
    </template>
  </DsfrHeader>
</template>

<style lang="scss">
// fixe taille du logo
.fr-header__operator img {
  min-width: 0;
  width: 55px;
  height: 60px;
}

// mobile (SM/MD): le menu ne couvre pas toute la page
@media (min-width: 36em) and (max-width: 62em) {
  .fr-header__menu {
    max-width: 360px;
    left: auto;
    right: 0;
  }
}

/**
 * Header mode compact
 * 
 * hauteur totale = 56px
 * hauteur du contenu = 40px
 * 
 * */
.fr-header--compact {
  .fr-header__body-row {
    padding: 0.5rem;
  }
  .fr-header__brand {
    padding: 0.125rem 0;
  }
  .fr-header__logo {
    padding-top: 0;
    padding-bottom: 0;

    .fr-logo {
      padding-top: 0.9rem; // vertical-align
      transform: scale(1.33);
    }
    .fr-logo::after {
      content: none; // Supprime le pseudo-élément
    }
  }
  .fr-header__operator {
    padding: 0;
    margin-left: 0.75rem;

    img {
      // conserve les pixels nets
      width: 33px;
      height: 36px;
    }
  }
  .fr-header__service {
    padding-top: 0;
    padding-bottom: 0;
    padding-right: 0.75rem;
  }
  /* mobile */
  @media (max-width: 62em) {
    .fr-header__body-row {
      padding: 0;
    }
    .fr-header__brand {
      padding: 0.625rem 0.5rem;
    }
    .fr-header__brand-top {
      width: auto;
    }
    .fr-header__navbar {
      position: absolute;
      top: 0;
      right: 8px;
    }
    .fr-header__service::before {
      content: none;
    }
  }
}

// hack vuedsfr
[aria-label="hack_quickLinks"] {
  display: none !important;
}
</style>
