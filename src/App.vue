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
    label: "Accueil",
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
const descText = 'Description'
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
    title: 'Présentation',
    get active () {
      return ['Présentation générale', 'Gouvernance', 'Commencer sur cartes.gouv.fr'].includes(route.name as string)
    },
    links: [
      {
        href: '',
        text: 'Présentation générale',
      },
      {
        href: '',
        text: 'Gouvernance',
      },
      {
        href: '',
        text: 'Commencer sur cartes.gouv.fr',
      },
    ],
  },
  {
    title: 'Ressources',
    get active () {
      return ['Catalogue de données (prochainement)', 'Catalogue de traitements (prochainement)', 'API & outils de construction (prochainement)'].includes(route.name as string)
    },
    links: [
      {
        href: '',
        text: 'Catalogue de données (prochainement)',
      },
      {
        href: '',
        text: 'Catalogue de traitements (prochainement)',
      },
      {
        href: '',
        text: 'API & outils de construction (prochainement)',
      },
    ],
  },
  {
    title: 'Développeurs',
    get active () {
      return ['Blog Développeurs', 'Communautés de développeurs', 'API & outils de construction (prochainement)', 'Bac à sable développement', 'Gitlab cartes.gouv'].includes(route.name as string)
    },
    links: [
      {
        href: '',
        text: 'Blog Développeurs',
      },
      {
        href: '',
        text: 'Communautés de développeurs',
      },
      {
        href: '',
        text: 'API & outils de construction (prochainement)',
      },
      {
        href: '',
        text: 'Bac à sable développement',
      },
      {
        href: '',
        text: 'Gitlab cartes.gouv',
      },
    ],
  },

  {
    title: 'Communautés géoplateforme',
    get active () {
      return ['Organisations (prochainement)', 'Communautés d\'assistance', 'Réutilisations', 'Témoignages'].includes(route.name as string)
    },
    links: [
      {
        href: '',
        text: 'Organisations (prochainement)',
      },
      {
        href: '',
        text: 'Communautés d\'assistance',
      },
      {
        href: '',
        text: 'Réutilisations',
      },
      {
        href: '',
        text: 'Témoignages',
      }
    ],
  },
  {
    to: { href: '' },
    text: 'Actualités',
  },
  {
    to: { href: '' },
    text: 'Agenda',
  },
  {
    title: 'Support',
    get active () {
      return ['Niveau de service', 'Documentation', 'Didactitiels', 'Contacter l\'assistance', 'Plans d\'assistance', 'FAQ'].includes(route.name as string)
    },
    links: [
      {
        href: '',
        text: 'Niveau de service',
      },
      {
        href: '',
        text: 'Documentation',
      },
      {
        href: '',
        text: 'Didactitiels',
      },
      {
        href: '',
        text: 'Contacter l\'assistance',
      },
      {
        href: '',
        text: 'Plans d\'assistance',
      },
      {
        href: '',
        text: 'FAQ',
      },
    ],
  }
]
// Paramètre pour la barre de navigation
const categoryName1 = 'Présentation'
const linkList1 = [
  {
    to: { href: '' },
    label: 'Présentation générale',
  },
  {
    to: { href: '' },
    label: 'Gouvernance',
  },
  {
    to: { href: '' },
    label: 'Commencer sur cartes.gouv.fr',
  },
]
const categoryName2 = 'Ressources'
const linkList2 = [
  {
    to: { href: '' },
    label: 'Présentation générale',
  },
  {
    to: { href: '' },
    label: 'Gouvernance',
  },
  {
    to: { href: '' },
    label: 'Commencer sur cartes.gouv.fr',
  },
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
    <!-- <template #mainnav> -->
    <DsfrNavigation
      :nav-items="navItems"
    />
    <!-- </template> -->
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
  >
    <template #footer-link-lists>
      <DsfrFooterLinkList
        class="fr-col-6"
        :category-name="categoryName1"
        :links="linkList1"
      />
      <DsfrFooterLinkList
        class="fr-col-6"
        :category-name="categoryName2"
        :links="linkList2"
      />
    </template>
  </DsfrFooter>
</template>
