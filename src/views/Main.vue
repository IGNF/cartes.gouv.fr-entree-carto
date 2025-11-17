<script setup lang="ts">
import type { DsfrNavigationProps } from '@gouvminint/vue-dsfr'
import CustomNavigation from '@/components/CustomNavigation.vue'
import CustomNavigationMenu from '@/components/CustomNavigationMenu.vue'
import { inject, markRaw } from 'vue'

// icones
import NotificationInfo from '@/icons/NotificationInfo.vue';
import NotificationSuccess from '@/icons/NotificationSuccess.vue';
import NotificationError from '@/icons/NotificationError.vue';
import NotificationWarning from '@/icons/NotificationWarning.vue';
import NotificationClose from '@/icons/NotificationClose.vue';
// composables
import { useRoute, useRouter } from 'vue-router'
import { useLogger } from 'vue-logger-plugin'
import { useMatchMedia } from '@/composables/matchMedia'
import { useHeaderParams } from '@/composables/headerParams'
import { useFooterParams } from '@/composables/footerParams'
import { useBaseUrl } from '@/composables/baseUrl'
// library
import { Notivue, Notification, push, lightTheme, darkTheme, type NotivueTheme} from 'notivue'
// components
import ModalConsent from '@/components/modals/ModalConsent.vue'
import ModalConsentCustom from '@/components/modals/ModalConsentCustom.vue'
import ModalTheme from '@/components/modals/ModalTheme.vue'
// stores
import { useAppStore } from "@/stores/appStore"
import { useDomStore } from "@/stores/domStore"
// others
import t from '@/features/translation'

useAppStore()
const domStore = useDomStore();

const route = useRoute()
const router = useRouter()
const log = useLogger()

// paramètres de mediaQuery pour affichage HEADER et FOOTER
const largeScreen = useMatchMedia('LG')

// paramètres pour le Header
const headerParams = useHeaderParams()

// paramètres pour le Footer
const footerParams = useFooterParams()

// ref sur le component ModalTheme
const refModalTheme = ref<InstanceType<typeof ModalTheme> | null>(null)

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
const refModalConsent = ref<InstanceType<typeof ModalConsent> | null>(null)
const refModalConsentCustom = ref<InstanceType<typeof ModalConsentCustom> | null>(null)

// INFO
// on met à jour les mandatoryLinks pour y ajouter des
// options sur la 'gestion des cookies'
const mandatoryLinks = computed(() => {
  return footerParams.mandatoryLinks.map((element: any) => {
    if (element.label === 'Gestion des cookies') {
      delete element.href
      element.onclick = refModalConsentCustom.value ? refModalConsentCustom.value.openModalConsentCustom : null
      element.to = '/'
    }
    return element
  })
})

var service :any = inject('services');

service.isAuthentificate()
.then((status:boolean) => {
  // le service renvoie un user 
  // mais on n'est pas authentifié sur la carto
  // --> sync
  if (status && !service.authenticated && service.mode === "remote") {
    router.push({ path : '/login?success=1' });
  }
  // le service ne renvoie rien (401 Unauthorized)
  // mais, on est encore enregistré comme authentifié
  // --> sync
  if (!status && service.authenticated && service.mode === "remote") {
    router.push({ path : '/logout?success=1' });
  }
})
.catch()
.finally();

// INFO
// on teste si une demande de connexion (ou de deconnexion) a été faite,
// et si elle est valide, on demande le jeton de connexion, puis,
// on récupère les informations utilisateurs.
// Pour les favoris, on récupère aussi les documents.
service.isAccessValided()
.then((status:any) => {
  if (status === "login") {
    // on met à jour le header en renseignant les informations utilisateurs
    var name = service.getUser();
    headerParams.value.quickLinks.forEach((element:any) => {
      if (element.label === "...") {
        element.label = name;
      }
    });
  }
  if (status !== "no-auth") {
    router.replace({ query: undefined });
  }
})
.catch((e:any) => {
  console.error(e);
  push.error({
    title: t.auth.title,
    message: t.auth.failed(e.message || e)
  });
})
.finally(() => {
});

// INFO
// on met à jour les quickLinks pour la connexion
const quickLinks = computed(() => {
  return headerParams.value.quickLinks
})

// paramètre pour la barre de navigations
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

// customisation des icons dsfr pour les notifications
const myNotificationsIcons = {
  warning : markRaw(NotificationWarning),
  success : markRaw(NotificationSuccess),
  info : markRaw(NotificationInfo),
  error : markRaw(NotificationError),
  close : markRaw(NotificationClose)
}

// theme à customiser
const myNotificationsTheme: NotivueTheme = {
  '--nv-radius': '0',
  '--nv-width': '350px',
  '--nv-border-width': '1px',
  '--nv-icon-size': '30px',
  '--nv-success-accent': '#18753c', // And -bg, -fg, -border
  '--nv-success-border': '#18753c',
  '--nv-error-accent': '#ce0500',
  '--nv-error-border': '#ce0500',
  '--nv-warning-accent': '#b34000',
  '--nv-warning-border': '#b34000',
  '--nv-info-accent': '#0063cb',
  '--nv-info-border': '#0063cb'
}

// choix du theme en fonction du theme dark ou light
const notificationsTheme = computed(() => {
  if (refModalTheme.value) {
    if (refModalTheme.value.modelValue === 'dark') {
      return {
        ...darkTheme,
        ...myNotificationsTheme
      };
    }
  }
  return {
    ...lightTheme,
    ...myNotificationsTheme
  };
});

const scrollDown = () => {
  // on scroll down pour afficher le footer
  setTimeout(() => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth'
    });
  }, 100);
}
onMounted(() => {
  let badge = document.querySelector(".fr-header__service-title span")
  let icon = document.createElement("span")
  icon.classList.add("fr-icon-road-map-fill")
  icon.style.scale = "50%"
    if (badge && parent) {
    badge.innerHTML = "Explorer les cartes"
    badge.classList.remove("fr-badge--green-emeraude")
    badge.classList.add("fr-badge--purple-glycine")
    badge.classList.add("fr-icon-road-map-fill")
    const textNode = badge.firstChild;
    badge.insertBefore(icon, textNode)
  }
})
</script>

<template>
  <DsfrHeader
    v-model="headerParams.serviceTitle"
    :service-title="headerParams.serviceTitle"
    :show-beta="true"
    :service-description="domStore.isHeaderCompact ? '' : headerParams.serviceDescription"
    :logo-text="domStore.isHeaderCompact ? [] : headerParams.logoText"
    :quick-links="quickLinks"
    :class="domStore.isHeaderCompact ? 'minimized': ''"
  >
    <!-- <template #mainnav>
      <DsfrNavigation
        :nav-items="navItems"
      />
    </template> -->
    <template #after-quick-links>
    <CustomNavigation
      id="main-navigation"
      :label="'Menu principal'"
      :nav-items="headerParams.afterQuickLinks"
    />
    </template>

  </DsfrHeader>
  <!-- Notifications
  -->
  <Notivue v-slot="item">
    <Notification
      :item="item"
      :icons="myNotificationsIcons"
      :theme="notificationsTheme"
    />
  </Notivue>

  <div class="futur-map-container" :class="domStore.isHeaderCompact ? 'minimized': ''">
    <router-view />
  </div>

  <!-- INFO
      Bouton non DSFR pour l'affichage du footer en mode mobile comme sur la maquette
  -->
  <!-- <label
    class="fr-footer-toggle-label fr-btn fr-btn--tertiary-no-outline fr-btn--close"
    for="fr-footer-toggle"
    @click="scrollDown"
  ><span>Fermer</span></label>
  <input
    id="fr-footer-toggle"
    type="checkbox"
  > -->
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
    v-show="!largeScreen"
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

  <div
   class="fr-container fr-container--fluid fr-container-md">
    <!-- Modale : Paramètres d’affichage -->
    <ModalTheme ref="refModalTheme" />

    <!-- Modale : Gestion des cookies (+ Eulerian) -->
    <ModalConsent ref="refModalConsent" />
    <ModalConsentCustom ref="refModalConsentCustom" />
  </div>
</template>

<style lang="scss">
  .futur-map-container{
    width: 100%;
    height: calc(100vh - 172.5px);
  }
  .minimized.futur-map-container{
    height: calc(100vh - 108.5px);
  }

  @media (max-width: 991px) {
    .futur-map-container{
      height: calc(100vh - 168px);
      margin-bottom: 0px;

    }
    .minimized.futur-map-container{
      height: calc(100vh - 52px);
      margin-bottom: 0px;
    }
  }
  /* TODO :
  surcharge des popups de notifications :
  https://docs.notivue.smastrom.io/built-in-notifications/using-css-classes.html#targeting-elements
  */
  /*
  .Notivue__content-message {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: wrap;
  }
  */
  /*
  .Notivue__icon {
    color: white;
    display: flex;
    justify-content: center;
    align-items: start;
    overflow: visible;
    min-width: var(--nv-icon-size);
    width: var(--nv-icon-size);
    margin: 0;
  }
  */
 /*
  [data-notivue='error'] .Notivue__icon {
    background-color: #ce0500;
  }
  [data-notivue='success'] .Notivue__icon {
    background-color: #18753c;
  }
  [data-notivue='info'] .Notivue__icon {
    background-color: #0063cb;
  }
  [data-notivue='warning'] .Notivue__icon {
    background-color: #b34000;
  }
  [data-notivue='close'] .Notivue__icon {
    color: #070707;
  }
  */

  .fr-footer__body, .fr-footer__partners, .fr-footer__bottom-copy{
    display: none;
  }
  #footer {
    padding-top: 0;
  }
  .fr-footer__bottom {
    margin-top: 0;
    box-shadow: inset 0 0px 0 0 var(--border-default-grey);
  }
  .fr-footer__partners + .fr-footer__bottom {
    margin-top: 0;
  }

  /* mini footer */
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
    transform: translate(-15px, 10px);
    caret-color: transparent;
  }

  .fr-footer-toggle-label::after {
    display: none;
  }
  .fr-footer-toggle-label > span {
    display: none;
  }

  .fr-footer-toggle-label:has(+ #fr-footer-toggle:checked)::after {
    display: inline-block;
  }

  .fr-footer-toggle-label:has(+ #fr-footer-toggle:checked) {
    background-image: unset;
    width: 100px;
  }

  .fr-footer-toggle-label:has(+ #fr-footer-toggle:checked) > span {
    display: inline;
  }

  #fr-footer-toggle:checked + .fr-footer {
    padding-top: 4rem;
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

  @media (max-width: 991px){
    /* mini header */
    .minimized {
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
    .fr-footer-toggle {
      display: none;
    }
    .fr-footer__bottom > .fr-footer__bottom-list > .fr-footer__bottom-item:not(:has(.fr-icon-theme-fill)) {
      display: none;
    }
    .fr-footer__bottom {
      box-shadow: unset;
    }

    #fr-footer-toggle:checked + .fr-footer .fr-footer__bottom {
      box-shadow: inset 0 1px 0 0 var(--border-default-grey);
    }
  }

/* Surcharge du logo DSFR */
.minimized {
  .fr-logo::after {
    content: none !important; /* Supprime complètement le pseudo-élément */
    background: none !important;
    display: none !important;
}
  .fr-logo {
    padding-top: 1rem !important;
    scale: 1.3 !important;
}
.fr-header__body-row {
    padding: 0;
  }
}

.flex-start {
  justify-content: flex-start;
}
</style>
