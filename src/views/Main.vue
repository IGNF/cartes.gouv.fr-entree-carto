<script setup lang="ts">
import type { DsfrNavigationProps } from '@gouvminint/vue-dsfr'

import { inject } from 'vue'
// composables
import { useRoute } from 'vue-router'
import { useLogger } from 'vue-logger-plugin'
import { useMatchMedia } from '@/composables/matchMedia'
import { useHeaderParams } from '@/composables/headerParams'
import { useFooterParams } from '@/composables/footerParams'
import { useBaseUrl } from '@/composables/baseUrl'
// components
import ModalConsent from '@/components/modals/ModalConsent.vue'
import ModalTheme from '@/components/modals/ModalTheme.vue'
// stores
import { useAppStore } from "@/stores/appStore"

useAppStore()

const log = useLogger()

// paramètres de mediaQuery pour affichage HEADER et FOOTER
const largeScreen = useMatchMedia('LG')

// paramètres pour le Header
const headerParams = useHeaderParams()

// paramètres pour le Footer
const footerParams = useFooterParams()

// ref sur le component ModalTheme
const refModalTheme = ref(null)

// INFO
// on met à jour les afterMandatoryLinks pour y ajouter des
// options sur la 'gestion des themes'
const afterMandatoryLinks = computed(() => {
  return [
    {
      label: 'Paramètres d’affichage',
      button: true,
      class: 'fr-icon-theme-fill fr-link--icon-left fr-px-2v',
      to: '/settings',
      onclick: refModalTheme.value ? refModalTheme.value.openModalTheme : null
    },
  ]
})

// ref sur le component ModalConsent
const refModalConsent = ref(null)

// INFO
// on met à jour les mandatoryLinks pour y ajouter des
// options sur la 'gestion des cookies'
const mandatoryLinks = computed(() => {
  return footerParams.mandatoryLinks.map((element: any) => {
    if (element.label === 'Gestion des cookies') {
      delete element.href
      element.onclick = refModalConsent.value ? refModalConsent.value.openModalConsent : null
      element.to = '/'
    }
    return element
  })
})

// INFO
// on teste si une demande de connexion (ou de deconnexion) a été faite,
// et si elle est valide, on demande le jeton de connexion, puis, 
// on récupère les informations utilisateurs
var service :any = inject('services');
var serviceMessageError = ref("");
var serviceMessageClosed = ref(true);
var onServiceMessageClose = () => {
  serviceMessageClosed.value = true;
};
service.isAccessValided()
.then((status:any) => {
  if (status === "login") {
    // on recupère le token
    service.getAccessToken()
    .then((token:any) => {
      if (token) {
        // on recherche des informations de l'utilisateur
        service.getUserMe()
        .then((data:any) => {
          // on met à jour le header en renseignant les informations utilisateurs
          var last_name = data.last_name;
          var first_name = data.first_name;
          headerParams.value.quickLinks.forEach((element:any) => {
            if (element.label === "...") {
              element.label = `${first_name} ${last_name}`;
            }
          });
        })
        .catch((e:any) => {
          console.error(e);
          serviceMessageError.value = 'Error to get user info : ' + e.message;
          serviceMessageClosed.value = false;
        })
      }
    })
    .catch((e:any) => {
      console.error(e);
      serviceMessageError.value = 'Error to get token : ' + e.message;
      serviceMessageClosed.value = false;
    })
  }
})
.catch((e:any) => {
  console.error(e);
  serviceMessageError.value = 'Error during authentication : ' + e.message;
  serviceMessageClosed.value = false;
});

// INFO
// on met à jour les quickLinks pour la connexion
const quickLinks = computed(() => {
  return headerParams.value.quickLinks.filter((element: any) => {
    // INFO
    // en cas de refresh de la page...
    if (service.authenticated && element.label === "...") {
      if (Object.keys(service.user).length) {
        var last_name = service.user.last_name;
        var first_name = service.user.first_name;
        element.label = `${first_name} ${last_name}`;
      } else {
        // si il y'a un souci pour récuperer des informations,
        // on n'affiche pas l'utilisateur...
        return false;
      }
    }
    if (!Object.keys(element).includes("authenticated") || element.authenticated === service.authenticated) {
      return true;
    }
  });
})

// paramètre pour la barre de navigations
const route = useRoute()

const navItems: DsfrNavigationProps['navItems'] = [
  {
    title: 'Commencer avec cartes.gouv',
    get active () {
      return [
        'Documentation',
        'Offre',
        'Nous rejoindre'
      ].includes(route.name as string)
    },
    links: [
      {
        to: `${useBaseUrl()}/documentation`,
        text: 'Documentation',
      },
      {
        to: `${useBaseUrl()}/offre`,
        text: 'Offre',
      },
      {
        to: `${useBaseUrl()}/nous-rejoindre`,
        text: 'Nous rejoindre',
      },
    ],
  },
  {
    to: `${useBaseUrl()}/catalogue`,
    text: 'Catalogue',
  },
  {
    to: `/`,
    text: 'Cartes',
  },
  {
    to: `${useBaseUrl()}/actualites`,
    text: 'Actualités',
  },
  {
    title: 'Assistance',
    get active () {
      return [
        'Questions fréquentes',
        'Nous écrire',
        'Niveau de service'
      ].includes(route.name as string)
    },
    links: [
      {
        to: `${useBaseUrl()}/faq`,
        text: 'Questions fréquentes',
      },
      {
        to: `${useBaseUrl()}/nous-ecrire`,
        text: 'Nous écrire',
      },
      {
        to: `${useBaseUrl()}/niveau-de-service`,
        text: 'Niveau de service',
      },
    ],
  },
  {
    to: `${useBaseUrl()}/a-propos`,
    text: '\u00C0 propos',
  }
]
</script>

<template>
  <DsfrHeader
    v-model="headerParams.serviceTitle"
    :service-title="headerParams.serviceTitle"
    :show-beta="true"
    :service-description="headerParams.serviceDescription"
    :logo-text="headerParams.logoText"
    :quick-links="quickLinks"
  >
    <template #mainnav>
      <DsfrNavigation
        :nav-items="navItems"
      />
    </template>
  </DsfrHeader>

  <DsfrAlert
    :description="serviceMessageError"
    type="error"
    :closed="serviceMessageClosed"
    :closeable=true
    @close="onServiceMessageClose()"
  />

  <div>
    <router-view />
  </div>

  <!-- INFO
      Bouton non DSFR pour l'affichage du footer en mode mobile comme sur la maquette
  -->
  <label
    class="fr-footer-toggle-label fr-btn fr-btn--tertiary-no-outline"
    for="fr-footer-toggle"
  />
  <input
    id="fr-footer-toggle"
    type="checkbox"
  >
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
    :mandatory-links="mandatoryLinks"
  />

  <div class="fr-container fr-container--fluid fr-container-md">
    <!-- Modale : Paramètres d’affichage -->
    <ModalTheme ref="refModalTheme" />

    <!-- Modale : Gestion des cookies (+ Eulerian) -->
    <ModalConsent ref="refModalConsent" />
  </div>
</template>

<style>
  #fr-footer-toggle {
    display: none;
  }
  .fr-footer-toggle-label {
    display: block;
    position: absolute;
    right: 0;
    width: 32px;
    min-height: 32px;
    padding: 8px;
    background-image: url(../assets/arrow-down.svg);
    background-repeat: no-repeat;
    background-position: center;
    transform: translateY(12px);
    transition: transform 0.2s;
    caret-color: transparent;
  }
  .fr-footer-toggle-label:has(+ #fr-footer-toggle:checked) {
    transform: translateY(12px) rotateX(180deg);
  }
  @media (min-width: 576px){
    .fr-footer-toggle-label {
      display: none;
    }
  }
  @media (max-width: 576px){
    /* mini header */
    .fr-header__service-tagline {
      display: none;
    }
    .fr-header__service {
      position: absolute;
      left: 100px;
    }
    .fr-header__service::before {
      display: none;
    }
    /* mini footer */
    .fr-footer {
      padding: 0.5rem 0;
    }
    .fr-footer__body, .fr-footer__partners, .fr-footer__bottom > div {
      display: none;
    }
    .fr-footer__partners + .fr-footer__bottom {
      margin-top: 0;
    }
    .fr-footer__bottom > .fr-footer__bottom-list > .fr-footer__bottom-item::before {
      display: none;
    }
    .fr-footer__bottom > .fr-footer__bottom-list > .fr-footer__bottom-item:not(:has(.fr-icon-theme-fill)) {
      display: none;
    }
    .fr-footer__bottom {
      box-shadow: unset;
    }

    #fr-footer-toggle:checked + .fr-footer {
      padding-top: 2rem;
    }

    #fr-footer-toggle:checked + .fr-footer .fr-footer__body {
      display: flex;
    }

    #fr-footer-toggle:checked + .fr-footer .fr-footer__partners,
    #fr-footer-toggle:checked + .fr-footer .fr-footer__bottom > div {
      display: unset;
    }

    #fr-footer-toggle:checked + .fr-footer .fr-footer__bottom > .fr-footer__bottom-list > .fr-footer__bottom-item::before {
      display: inline-block;
    }

    #fr-footer-toggle:checked + .fr-footer .fr-footer__bottom > .fr-footer__bottom-list > .fr-footer__bottom-item:not(:has(.fr-icon-theme-fill)) {
      display: inline-block;
    }

    #fr-footer-toggle:checked + .fr-footer .fr-footer__bottom {
      box-shadow: inset 0 1px 0 0 var(--border-default-grey);
    }
  }
</style>
