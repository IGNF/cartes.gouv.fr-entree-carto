<script setup lang="ts">
import { CgfrFooter } from 'cartes.gouv.fr-vue-components';

defineProps({
  compact: {
    type: Boolean,
    default: false,
  }
});

</script>

<template>

  <div class="ign-footer">
    <CgfrFooter compact/>
  </div>
</template>

<style lang="scss">
@use "@/assets/variables" as *;

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
@include max(lg) {
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
  padding-right: 4rem;
  height: 3.5rem;
  box-shadow: inset 0 2px 0 0 var(--border-plain-blue-france);

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