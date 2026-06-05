<script setup>
import { useDomStore } from "@/stores/domStore";
import { useHeaderParams } from '@/composables/headerParams';
import { useMatchMedia } from '@/composables/matchMedia';
import { CgfrFooter } from 'cartes.gouv.fr-vue-components';
import CustomNavigation from '@/components/header/CustomNavigation.vue';

const isStaticService = import.meta.env.VITE_GPF_SERVICE_STATIC === "true";

const domStore = useDomStore();
const { theme } = useScheme();
const mobileScreen = useMatchMedia('LG');

let operatorImgSrc = computed(() => {
  let lightOrDark = theme.value === 'light' ? '' : '-dark';
  return isStaticService ? `https://cartes.gouv.fr/img/header/cartes-gouv-logo${lightOrDark}.svg` : `https://data.geopf.fr/annexes/ressources/header/cartes-gouv-logo${lightOrDark}.svg`;
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
</script>

<template>
  <DsfrHeader
    :service-title="headerParams.serviceTitle"
    :show-beta="true"
    :service-description="domStore.isHeaderCompact ? false : headerParams.serviceDescription"
    :logo-text="domStore.isHeaderCompact ? [] : headerParams.logoText"
    :quick-links="headerParams.quickLinks"
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
      <CgfrFooter v-if="mobileScreen" />
    </template>
  </DsfrHeader>
</template>
