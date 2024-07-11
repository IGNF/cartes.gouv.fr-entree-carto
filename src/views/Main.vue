<script setup lang="ts">
import { type DsfrNavigationProps } from '@gouvminint/vue-dsfr';
import { useRoute } from 'vue-router';
import { useMatchMedia } from '@/composables/matchMedia';
import { useHeaderParams } from '@/composables/headerParams';
import { useFooterParams } from '@/composables/footerParams';
import { useBaseUrl } from '@/composables/baseUrl';
import { useLogger } from 'vue-logger-plugin'

const log = useLogger()

useScheme()

// paramètres de mediaQuery pour affichage HEADER et FOOTER
const largeScreen = useMatchMedia("LG");


// paramètres pour le Header
const headerParams = useHeaderParams();

// paramètres pour le Footer
const footerParams = useFooterParams();

// gestion de la modale de changement de thème d'affichage
const modelValue = ref();


const { setScheme, theme } = useScheme();

const changeTheme = () => {
  setScheme(modelValue.value);
}

const themeModalOpened = ref(false)

const openModalTheme = () => {
  console.log(themeModalOpened);
  themeModalOpened.value = true;
}

const onModalClose = () => {
  themeModalOpened.value = false;
}

const afterMandatoryLinks = [
  {
    label: 'Paramètres d’affichage',
    button: true,
    class: 'fr-icon-theme-fill fr-link--icon-left fr-px-2v',
    to: '/settings',
    onclick: openModalTheme
  },
];

// paramètre pour la barre de navigations
const route = useRoute();

const navItems: DsfrNavigationProps['navItems'] = [
  {
    title: 'Commencer avec cartes.gouv',
    get active() {
      return [
        'Documentation',
        'Offre',
        'Nous rejoindre'].includes(route.name as string)
    },
    links: [
      {
        to: useBaseUrl() + '/documentation',
        text: 'Documentation',
      },
      {
        to: useBaseUrl() + '/offre',
        text: 'Offre',
      },
      {
        to: useBaseUrl() + '/nous-rejoindre',
        text: 'Nous rejoindre',
      },
    ],
  },
  {
    to: useBaseUrl() + '/catalogue',
    text: 'Catalogue',
  },
  {
    to: useBaseUrl() + '/actualites',
    text: 'Actualités',
  },
  {
    title: 'Assistance',
    get active() {
      return [
        'Questions fréquentes',
        'Nous écrire',
        'Niveau de service'].includes(route.name as string)
    },
    links: [
      {
        to: useBaseUrl() + '/faq',
        text: 'Questions fréquentes',
      },
      {
        to: useBaseUrl() + '/nous-ecrire',
        text: 'Nous écrire',
      },
      {
        to: useBaseUrl() + '/niveau-de-service',
        text: 'Niveau de service',
      },
    ],
  },
  {
    to: useBaseUrl() + '/a-propos',
    text: '\u00c0 propos',
  }
];

</script>

<template>
  <DsfrHeader 
    v-model="headerParams.serviceTitle" 
    :service-title="headerParams.serviceTitle"
    :show-beta=true
    :service-description="headerParams.serviceDescription" 
    :logo-text="headerParams.logoText"
    :quick-links="headerParams.quickLinks">
    <DsfrNavigation 
      :nav-items="navItems" 
      v-show="!largeScreen" 
    />
  </DsfrHeader>
  
  <div>
    <router-view />
  </div>

  <!-- INFO 
      On retire les valeurs par defaut pour ajouter 
      des valeurs customisées de mandatoryLinks.
        :a11y-compliance="footerParams.a11yCompliance" 
        :legal-link="footerParams.legalLink"
        :personal-data-link="footerParams.personalDataLink" 
        :cookies-link="footerParams.cookiesLink"
        :a11y-compliance-link="footerParams.a11yComplianceLink"  
  -->
  <DsfrFooter 
    :before-mandatory-links="footerParams.beforeMandatoryLinks" 
    :after-mandatory-links="afterMandatoryLinks"
    :logo-text="footerParams.logoText" 
    :desc-text="footerParams.descText"
    :home-link="footerParams.homeLink" 
    :partners="footerParams.partners" 
    :licence-text="footerParams.licenceText"
    :licence-to="footerParams.licenceTo" 
    :licence-name="footerParams.licenceName"
    :licence-link-props="footerParams.licenceLinkProps" 
    :ecosystem-links="footerParams.ecosystemLinks" 
    :mandatory-links="footerParams.mandatoryLinks"
  />

  <div class="fr-container fr-container--fluid fr-container-md">
    <DsfrModal 
      ref="modal" 
      :opened="themeModalOpened" 
      :title="footerParams.themeModale.title"
      :size="footerParams.themeModale.size" 
      @close="onModalClose">

      <DsfrRadioButtonSet 
        v-model="modelValue" 
        :legend="footerParams.themeModale.legend" 
        name="fr-radios-theme"
        :options="footerParams.themeModale.themeOptions" 
        @update:model-value="changeTheme" />

    </DsfrModal>
  </div>
    
</template>
