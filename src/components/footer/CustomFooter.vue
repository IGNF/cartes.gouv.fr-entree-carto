<script setup lang="ts">
import { useFooterParams } from '@/composables/footerParams';

import ModalTheme from '@/components/modals/ModalTheme.vue';
// ref sur le component ModalTheme
const refModalTheme = ref<InstanceType<typeof ModalTheme> | null>(null)

import ModalConsentCustom from '@/components/modals/ModalConsentCustom.vue';
const refModalConsentCustom = ref<InstanceType<typeof ModalConsentCustom> | null>(null)

// paramètres pour le Footer
const footerParams = useFooterParams();

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

defineProps({
  compact: {
    type: Boolean,
    default: false,
  }
});

let open = ref(false);

let openAttrs = {
  label: 'Plus d’informations',
  icon: 'fr-icon-arrow-up-s-line',
};

let closeAttrs = {
  label: 'Fermer',
  icon: 'fr-icon-close-line',
};

let openCloseAttrs = computed(() => {
  return open.value ? closeAttrs : openAttrs;
});

const toggleFooter = () => {
  open.value = !open.value;

  let top = open.value ? document.body.scrollHeight : 0;
  setTimeout(() => {
    window.scrollTo({
      left: 0,
      top,
      behavior: (top !== 0) ? 'smooth' : 'auto',
    });
  }, 0);
};

</script>

<template>
  <div class="ign-footer">
    <DsfrButton
      v-if="compact"
      class="btn-toggle"
      :icon-only="!open"
      :label="openCloseAttrs.label"
      :aria-label="!open ? openCloseAttrs.label : null"
      :icon="openCloseAttrs.icon"
      icon-right
      tertiary
      no-outline
      :aria-expanded="open"
      aria-controls="footer"
      @click="toggleFooter"
    />
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
      :class="{
        'fr-footer--compact': compact,
        'fr-footer--compacted': compact && !open
      }"
    />
    <div
      class="fr-container fr-container--fluid fr-container-md"
    >
      <!-- Modale : Paramètres d’affichage (+ Eulerian) -->
      <ModalTheme ref="refModalTheme" />
      <!-- Modale : Gestion des cookies (+ Eulerian) -->
      <ModalConsent ref="refModalConsent" />
      <!-- Modale : Gestion des cookies (+ Eulerian) -->
      <ModalConsentCustom ref="refModalConsentCustom" />
      <!-- Modale : Welcome (+ Eulerian) -->
      <!-- <ModalWelcome ref="refModalWelcome" /> -->
    </div>
  </div>
</template>

<style lang="scss">
.ign-footer {
  position: relative;
}
.fr-footer__logo {
  max-height: 5.625rem;
}
.btn-toggle {
  position: absolute;
  right: 1rem;
  top: 0.5rem;
}

// le footer dans le header (mode mobile)
.fr-header .ign-footer .fr-modal {
  background: transparent;
}
@media (max-width: 62em) {
  .fr-footer {
    margin-top: 2rem;
    padding-top: 3rem;
    box-shadow: inset 0 1px 0 0 var(--border-default-grey);
  }
  .fr-footer .fr-container {
    padding: 0;
  }
  .fr-footer__partners-logos {
    flex-wrap: wrap;
    margin-right: 0;
  }
  .fr-footer__partners-main + .fr-footer__partners-sub {
    padding-left: 0;
  }
  .fr-footer__partners-sub > ul {
    flex: 1;
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
  }
  .fr-footer__partners-sub > ul > li {
    margin: 0;
  }
}

// footer compact
.fr-footer--compact {
  padding-top: 4rem;
}
.fr-footer--compacted {
  padding-top: 0;

  .fr-footer__body,
  .fr-footer__partners,
  .fr-footer__bottom-copy {
    display: none;
  }
  .fr-footer__bottom {
    margin-top: 0;
    box-shadow: none;
  }
}
</style>