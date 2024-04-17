<script setup lang="ts">
import { useRoute } from 'vue-router'

useScheme()

// Paramètres pour le Header
const serviceTitle = 'Carte.gouv.fr'
const serviceDescription = 'Portail Cartographique'
const logoText = ['Ministère', 'des Cartes']

const quickLinks = [
  {
    label: serviceDescription,
    to: '/',
    icon: 'ri-arrow-right-line',
    iconRight: true
  },
  {
    label: 'Accueil',
    to: '/accueil',
    icon: 'ri-arrow-right-line',
    iconRight: true
  },
  {
    label: 'Catalogue',
    to: '/catalogue',
    icon: 'ri-arrow-right-line',
    iconRight: true,
  },
  {
    label: 'Se Connecter',
    to: '/login',
    icon: 'fa-user-circle',
  }
]

const searchQuery = ref('')

// Paramètres pour le Footer

const beforeMandatoryLinks = [{ label: 'Before', to: '/before' }]
const afterMandatoryLinks = [
  { label: 'After', to: '/after' },
  {
    label: 'Paramètres d’affichage',
    button: true,
    class: 'fr-icon-theme-fill fr-link--icon-left fr-px-2v',
    to: '/settings',
  },
]
const a11yCompliance = 'partiellement conforme'
const legalLink = '/mentions-legales'
const personalDataLink = '/donnees-personnelles'
const cookiesLink = '/cookies'
const a11yComplianceLink = '/a11y-conformite'
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

// Paramètre pour la barre de navigation
const route = useRoute()

const navItems: DsfrNavigationProps['navItems'] = [
  {
    title: 'Commencer avec cartes.gouv',
    get active () {
      return ['Documentation Géoplateforme', 'Questions fréquanetes', 'Nous écrire'].includes(route.name as string)
    },
    links: [
      {
        href: '',
        text: 'Documentation Géoplateforme',
      },
      {
        href: '',
        text: 'Questions fréquanetes',
      },
      {
        href: '',
        text: 'Nous écrire',
      },
    ],
  },
  {
    to: { href: '' },
    text: 'Actualités',
  },
  {
    to: { href: '' },
    text: 'A propos',
  }
]
</script>

<template>
  <DsfrHeader
    v-model="searchQuery"
    :service-title="serviceTitle"
    :service-description="serviceDescription"
    :logo-text="logoText"
    :quick-links="quickLinks"
    show-search
  >
    <DsfrNavigation
      :nav-items="navItems"
    />
  </DsfrHeader>

  <div>
    <router-view />
  </div>

  <DsfrFooter
    :before-mandatory-links="beforeMandatoryLinks"
    :after-mandatory-links="afterMandatoryLinks"
    :a11y-compliance="a11yCompliance"
    :logo-text="logoText"
    :legal-link="legalLink"
    :personal-data-link="personalDataLink"
    :cookies-link="cookiesLink"
    :a11y-compliance-link="a11yComplianceLink"
    :desc-text="descText"
    :home-link="homeLink"
    :licence-text="licenceText"
    :licence-to="licenceTo"
    :licence-name="licenceName"
    :licence-link-props="licenceLinkProps"
    :ecosystem-links="ecosystemLinks"
  />
</template>
