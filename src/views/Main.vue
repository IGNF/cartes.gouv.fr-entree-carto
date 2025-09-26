<script setup lang="ts">
import type { DsfrNavigationProps } from '@gouvminint/vue-dsfr'
import CustomNavigation from '@/components/CustomNavigation.vue'
import CustomNavigationMenu from '@/components/CustomNavigationMenu.vue'
import { inject } from 'vue'
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
// others
import t from '@/features/translation'

useAppStore()

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
  return headerParams.value.quickLinks.filter((element: any) => {
    // INFO
    // en cas de refresh de la page...
    if (service.authenticated && element.label === "...") {
      if (Object.keys(service.user).length) {
        var name = service.getUser();
        element.label = name;
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

const navItemsTest = [
{
    title: "Aides",
    icon: "ri-question-fill",
    get active () {
      return [
        'Tableau de bord',
        'Mon compte',
      ].includes(route.name as string)
    },
    links :[
      {
          text: "Questions Fréquentes",
          to: "#",
          icon: "ri-question-mark"
      },
      {
          text: "Documentation",
          to: "#",
          icon: "ri-file-text-line"
      },
      {
          text: "Nous contacter",
          to: "#",
          icon: "ri-mail-line"
      }
    ]   
  },  
{
    title: "Services",
    icon: "ri-grid-fill",
    get active () {
      return [
        'Tableau de bord',
        'Mon compte',
      ].includes(route.name as string)
    },
    links :[
      {
          text: `<div class="fr-grid-row fr-grid-row--left" id="description-358">
                          <div class="fr-description__label fr-text--bold fr-text--sm fr-text-action-high--grey">Nom
                            utilisateur</div>
                          <div class="fr-description__info fr-text--xs fr-text-mention--grey">
                            adresseutilisateur@email.com</div>
                        </div>`,
          type: "html"
      },
      {
          text: "Tableau de bord",
          to: "#",
          icon: "ri-dashboard-3-line"
      },
      {
          text: "Mon compte",
          to: "#",
          icon: "ri-user-line"
      }
    ]   
  },  
{
    title: "Mon espace",
    icon: "ri-account-circle-fill",
    get active () {
      return [
        'Tableau de bord',
        'Mon compte',
      ].includes(route.name as string)
    },
    links :[
      {
          text: `<div class="fr-grid-row fr-grid-row--left" id="description-358">
                          <div class="fr-description__label fr-text--bold fr-text--sm fr-text-action-high--grey">Nom
                            utilisateur</div>
                          <div class="fr-description__info fr-text--xs fr-text-mention--grey">
                            adresseutilisateur@email.com</div>
                        </div>`,
          type: "html"
      },
      {
          text: "Tableau de bord",
          to: "#",
          icon: "ri-dashboard-3-line"
      },
      {
          text: "Mon compte",
          to: "#",
          icon: "ri-user-line"
      },
      {
          text: `<div class="fr-grid-row fr-grid-row--center">
                          <button class="fr-icon-logout-box-r-line fr-btn fr-btn--tertiary fr-btn--icon-left">
                            <i class="ri-logout-box-line"></i> Se déconnecter
                          </button>
                  </div>`,
          type: "html"
      },
    ]   
  }
]

onMounted(() => {
  let el = document.getElementsByClassName('fr-header__logo')[0]
  el.innerHTML = "";
  el.classList.add('fr-logo__custom');


})
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
    <!-- <template #mainnav>
      <DsfrNavigation
        :nav-items="navItems"
      />
    </template> -->
    <template #after-quick-links>
    <CustomNavigation
      id="main-navigation"
      :label="'Menu principal'"
      :nav-items="navItemsTest"
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

  <div class="futur-map-container">
    <router-view />
  </div>

  <!-- INFO
      Bouton non DSFR pour l'affichage du footer en mode mobile comme sur la maquette
  -->
  <label
    class="fr-footer-toggle-label fr-btn fr-btn--tertiary-no-outline fr-btn--close"
    for="fr-footer-toggle"
    @click="scrollDown"
  ><span>Fermer</span></label>
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
    <ModalConsentCustom ref="refModalConsentCustom" />
  </div>
</template>

<style>
  .futur-map-container{
    width: 100%;
    height: calc(100vh - 222.5px);
  }

  @media (max-width: 576px) {
    .futur-map-container{
      height: calc(100vh - 131px);
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

.fr-logo__custom::before {
  content: "";
  background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 44 18'%3E%3Cpath fill='%23fff' d='M11.3 10.2c-.9.6-1.7 1.3-2.3 2.1v-.1c.4-.5.7-1 1-1.5.4-.2.7-.5 1-.8.5-.5 1-1 1.7-1.3.3-.1.5-.1.8 0-.1.1-.2.1-.4.2H13v-.1c-.3.3-.7.5-1 .9-.1.2-.2.6-.7.6 0 .1.1 0 0 0zm1.6 4.6c0-.1-.1 0-.2 0l-.1.1-.1.1-.2.2s.1.1.2 0l.1-.1c.1 0 .2-.1.2-.2.1 0 .1 0 .1-.1 0 .1 0 0 0 0zm-1.6-4.3c.1 0 .2 0 .2-.1s.1-.1.1-.1v-.1c-.2.1-.3.2-.3.3zm2.4 1.9s0-.1 0 0c.1-.1.2-.1.3-.1.7-.1 1.4-.3 2.1-.6-.8-.5-1.7-.9-2.6-1h.1c-.1-.1-.3-.1-.5-.2h.1c-.2-.1-.5-.1-.7-.2.1 0 .2-.2.2-.3h-.1c-.4.2-.6.5-.8.9.2.1.5 0 .7.1h-.3c-.1 0-.2.1-.2.2h.1c-.1 0-.1.1-.2.1.1.1.2 0 .4 0 0 .1.1.1.1.1-.1 0-.2.1-.3.3-.1.2-.2.2-.3.3v.1c-.3.2-.6.5-.9.8v.1c-.1.1-.2.1-.2.2v.1c.4-.1.6-.4 1-.5l.6-.3c.2 0 .3-.1.5-.1v.1h.2c0 .1-.2 0-.1.1s.3.1.4 0c.2-.2.3-.2.4-.2zM12.4 14c-.4.2-.9.2-1.2.4 0 0 0 .1-.1.1 0 0-.1 0-.1.1-.1 0-.1.1-.2.2l-.1.1s0 .1.1 0l.1-.1s-.1.1-.1.2V15.3l-.1.1s0 .1-.1.1l-.1.1.2-.2.1-.1h.2s0-.1.1-.1c.1-.1.2-.2.3-.2h.1c.1-.1.3-.1.4-.2.1-.1.2-.2.3-.2.2-.2.5-.3.8-.5-.1 0-.2-.1-.3-.1 0 .1-.2 0-.3 0zM30 9.7c-.1.2-.4.2-.6.3-.2.2 0 .4.1.5.1.3-.2.5-.4.5.1.1.2.1.2.1 0 .2.2.2.1.4s-.5.3-.3.5c.1.2.1.5 0 .7-.1.2-.3.4-.5.5-.2.1-.4.1-.6 0-.1 0-.1-.1-.2-.1-.5-.1-1-.2-1.5-.2-.1 0-.3.1-.4.1-.1.1-.3.2-.4.3l-.1.1c-.1.1-.2.2-.2.3-.1.2-.2.4-.2.6-.2.5-.2 1 0 1.4 0 0 1 .3 1.7.6.2.1.5.2.7.4l1.7 1H13.2l1.6-1c.6-.4 1.3-.7 2-1 .5-.2 1.1-.5 1.5-.9.2-.2.3-.4.5-.5.3-.4.6-.7 1-1l.3-.3s0-.1.1-.1c-.2.1-.2.2-.4.2 0 0-.1 0 0-.1s.2-.2.3-.2v-.1c-.4 0-.7.2-1 .5h-.2c-.5.2-.8.5-1.2.7v-.1c-.2.1-.4.2-.5.2-.2 0-.5.1-.8 0-.4 0-.7.1-1.1.2-.2.1-.4.1-.6.2v.1l-.2.2c-.2.1-.3.2-.5.4l-.5.5h-.1l.1-.1.1-.1c0-.1.1-.1.1-.2.2-.1.3-.3.5-.4 0 0-.1 0 0 0 0 0 0-.1.1-.1l-.1.1c-.1.1-.1.2-.2.2v-.1-.1l.2-.2c.1-.1.2-.1.3-.2h.1c-.2.1-.3.1-.5.2H14h-.1c0-.1.1-.1.2-.2h.1c1-.8 2.3-.6 3.4-1 .1-.1.2-.1.3-.2.1-.1.3-.2.5-.3.2-.2.4-.4.5-.7v-.1c-.4.4-.8.7-1.3 1-.6.2-1.3.4-2 .4 0-.1.1-.1.1-.1 0-.1.1-.1.1-.2h.1s0-.1.1-.1h.1c-.1-.1-.3.1-.4 0 .1-.1 0-.2.1-.2h.1s0-.1.1-.1c.5-.3.9-.5 1.3-.7-.1 0-.1.1-.2 0 .1 0 0-.1.1-.1.3-.1.6-.3.9-.4-.1 0-.2.1-.3 0 .1 0 .1-.1.2-.1v-.1h0c0-.1.1 0 .2-.1h-.1c.1-.1.2-.2.4-.2 0-.1-.1 0-.1-.1h.1-.5c-.1 0 0-.1 0-.1.1-.2.2-.5.3-.7h-.1c-.3.3-.8.5-1.2.6h-.2c-.2.1-.4.1-.5 0-.1-.1-.2-.2-.3-.2-.2-.1-.5-.3-.8-.4-.7-.2-1.5-.4-2.3-.3.3-.1.7-.2 1.1-.3.5-.2 1-.3 1.5-.3h-.3c-.4 0-.9.1-1.3.2-.3.1-.6.2-.9.2-.2.1-.3.2-.5.2v-.1c.3-.4.7-.7 1.1-.8.5-.1 1.1 0 1.6.1.4 0 .8.1 1.1.2.1 0 .2.2.3.3.2.1.4 0 .5.1v-.2c.1-.1.3 0 .4 0 .2-.2-.2-.4-.3-.6v-.1c.2.2.5.4.7.6.1.1.5.2.5 0-.2-.3-.4-.6-.7-.9v-.2c-.1 0-.1 0-.1-.1-.1-.1-.1-.2-.1-.3-.1-.2 0-.4-.1-.5-.1-.2-.1-.3-.1-.5-.1-.5-.2-1-.3-1.4-.1-.6.3-1 .6-1.5.2-.4.5-.7.8-1 .1-.4.3-.7.6-1 .3-.3.6-.5.9-.6.3-.1.5-.2.8-.3l2.5-.4H25l1.8.3c.1 0 .2 0 .2.1.1.1.3.2.4.2.2.1.4.3.6.5.1.1.2.3.1.4-.1.1-.1.4-.2.4-.2.1-.4.1-.6.1-.1 0-.2 0-.4-.1.5.2.9.4 1.2.8 0 .1.2.1.3.1v.1c-.1.1-.1.1-.1.2h.1c.1-.1.1-.4.3-.3.2.1.2.3.1.4-.1.1-.2.2-.4.3v.2c.1.1.1.2.2.4s.1.5.2.7c.1.5.2.9.2 1.4 0 .2-.1.5 0 .7l.3.6c.1.2.2.3.3.5.2.3.6.6.4 1zm-15.6 5.2c-.1 0-.1.1-.1.1s.1 0 .1-.1zm5.8-1.8c-.1.1 0 0 0 0zm-6.7-.2c0 .1.1 0 .1 0 .2-.1.5 0 .6-.2-.1-.1-.2 0-.2-.1-.1 0-.2 0-.2.1-.1.1-.3.1-.3.2z'/%3E%3Cpath fill='gray' d='M27.9 6.8c.1 0 .3 0 .3.1-.1.2-.4.3-.6.5h-.1c-.1.1-.1.2-.1.2h-.3c.1.1.3.2.5.2l.1.1h.2V8c-.1.1-.2.1-.4.1.2.1.5.1.7 0 .2-.1 0-.4.1-.5-.1 0 0-.1-.1-.1.1-.1.1-.2.2-.2s.1 0 .2-.1c0-.1-.1-.1-.1-.2.2-.1.3-.3.3-.5 0-.1-.3-.1-.4-.2h-.5c-.2 0-.3.1-.5.1l-.6.3c.2-.1.4-.1.7-.2 0 .3.2.3.4.3'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-size: contain;
}

.fr-header__body-row {
        padding: 0;
}
.flex-start {
  justify-content: flex-start;
}
</style>
