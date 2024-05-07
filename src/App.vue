<script setup lang="ts">
import { type DsfrNavigationProps } from '@gouvminint/vue-dsfr';
import { useRoute } from 'vue-router';
import { useMatchMedia } from '@/composables/matchMedia';

import StoreDataLoading from './components/StoreDataLoading.vue';

useScheme()

import LogoIGN from "./assets/logo-ign.png"
import LogoTRANSFO from "./assets/logo-transformation-fonction-publiques.png"
import LogoECOLO from "./assets/logo-transition-ecologique.png"
import LogoCNIG from "./assets/logo-cnig.png"
import { useModel } from 'vue';

// Paramètres de mediaQuery pour affichage HEADER et FOOTER
const largeScreen = useMatchMedia("LG");

const { setScheme, theme } = useScheme()

const openModalTheme = () => {
  opened.value = true;
  // setScheme(theme.value === 'light' ? 'dark' : 'light')
}
const onModalClose = () => {
  opened.value = false;
  // setScheme(theme.value === 'light' ? 'dark' : 'light')
}
const modelValue = ref()

const changeTheme = () => {
  setScheme(modelValue.value);
}

// Parametres Modale Theme
const opened = ref(false);
const title = "Params"
const size = "md"

const legend = "Groupe de cases à cocher simple"
const themeOptions = [
  {
    label: 'Thème clair',
    value: 'light',
    id: 'theme-1',
    name: 'radio-set',
  },
  {
    label: 'Thème Sombre',
    id: 'theme-2',
    value: 'dark',
    name: 'radio-set',
  },
  {
    label: 'Système',
    id: 'theme-3',
    value: 'system',
    name: 'radio-set',
    hint: 'Utilise les paramètres sytème.',
  }
]

// Paramètres pour le Header
const serviceTitle = 'cartes.gouv.fr'
const serviceDescription = 'Portail Cartographique'
const logoText = ['RÉPUBLIQUE', 'FRANÇAISE']
const quickLinks = [
  {
    label: 'Accueil',
    to: '/',
    icon: 'ri-arrow-right-line',
    iconRight: true
  },
  {
    label: 'Catalogue',
    to: '/catalogue',
    icon: 'ri-arrow-right-line',
    iconRight: true,
  }
]

const searchQuery = ref('')

// Paramètres pour le Footer
const afterMandatoryLinks = [
  {
    label: 'Paramètres d’affichage',
    button: true,
    class: 'fr-icon-theme-fill fr-link--icon-left fr-px-2v',
    to: '/settings',
    onclick: openModalTheme
  },
]
const beforeMandatoryLinks = [{ label: 'Plan du site', to: '/plan-du-site' }]
const a11yCompliance = 'partiellement conforme'
const legalLink = '/mentions-legales'
const personalDataLink = '/donnees-personnelles'
const cookiesLink = '/cookies'
const a11yComplianceLink = '/accessibilite'
const descText = 'Cartes.gouv.fr est développé par l’Institut national de l’information géographique et forestière (IGN) et ses partenaires. Le site s’appuie sur la Géoplateforme, la nouvelle infrastructure publique, ouverte et collaborative des données géographiques.'
const homeLink = '/'
const licenceText = undefined
const licenceTo = undefined
const licenceName = undefined
const licenceLinkProps = undefined
const ecosystemLinks = [
  {
    label: 'legifrance.gouv.fr',
    href: 'https://legifrance.gouv.fr',
  },
  {
    label: 'gouvernement.fr',
    href: 'https://gouvernement.fr',
  },
  {
    label: 'service-public.fr',
    href: 'https://service-public.fr',
  },
  {
    label: 'data.gouv.fr',
    href: 'https://data.gouv.fr',
  },
]

// Paramètre pour les partenaires
const partners = {
  title: "Nos partenaires",
  mainPartner: {
    href: "https://www.ign.fr/",
    logo: LogoIGN,
    name: "IGN"
  },
  subPartners: [
    {
      href: "https://www.transformation.gouv.fr/",
      logo: LogoTRANSFO,
      name: "Ministère de la transformation et de la fonction publiques"
    },
    {
      href: "https://www.ecologie.gouv.fr/",
      logo: LogoECOLO,
      name: "Ministère de la Transition Écologique et de la Cohésion des Territoires"
    },
    {
      href: "https://cnig.gouv.fr/",
      logo: LogoCNIG,
      name: "Conseil national de l’information géolocalisée"
    },
  ]
}

// Paramètre pour la barre de navigations
const route = useRoute()

const navItems: DsfrNavigationProps['navItems'] = [
  {
    title: 'Commencer avec cartes.gouv',
    get active() {
      return ['Documentation Géoplateforme', 'Questions fréquentes', 'Nous écrire'].includes(route.name as string)
    },
    links: [
      {
        to: '/documentation',
        text: 'Documentation Géoplateforme',
      },
      {
        to: '/faq',
        text: 'Questions fréquentes',
      },
      {
        to: '/nous-ecrire',
        text: 'Nous écrire',
      },
    ],
  },
  {
    to: '/actualites',
    text: 'Actualités',
  },
  {
    to: '/a-propos',
    text: '\u00c0 propos',
  }
]
</script>

<template>
  <DsfrHeader v-model="searchQuery" :service-title="serviceTitle" :service-description="serviceDescription"
    :logo-text="logoText" :quick-links="quickLinks">
    <DsfrNavigation :nav-items="navItems" v-show="!largeScreen" />
  </DsfrHeader>

  <Suspense>
    <StoreDataLoading />
    <!-- loading state -->
    <template #fallback>
      Loading...
    </template>
  </Suspense>

  <div>
    <router-view />
  </div>

  <DsfrFooter :before-mandatory-links="beforeMandatoryLinks" :after-mandatory-links="afterMandatoryLinks"
    :a11y-compliance="a11yCompliance" :logo-text="logoText" :legal-link="legalLink" :personal-data-link="personalDataLink"
    :cookies-link="cookiesLink" :a11y-compliance-link="a11yComplianceLink" :desc-text="descText" :home-link="homeLink"
    :partners="partners" :licence-text="licenceText" :licence-to="licenceTo" :licence-name="licenceName"
    :licence-link-props="licenceLinkProps" :ecosystem-links="ecosystemLinks" />
  <DsfrModal ref="modal" :opened="opened" :title="title" :size="size" @close="onModalClose">
    <div class="fr-container fr-my-2v">
      <div class="fr-my-2v">
        <DsfrRadioButtonSet v-model="modelValue" :legend="legend" name="radio-set" :options="themeOptions"
          @update:model-value="changeTheme" />
      </div>
    </div>
  </DsfrModal>
</template>