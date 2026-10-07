<script setup>
import { useBaseUrl } from '@/composables/baseUrl';
const isStaticService = import.meta.env.VITE_GPF_SERVICE_STATIC === "true";

const baseUrl = useBaseUrl();
const logoText = "République Française";
</script>

<template>
  <div class="fr-grid-row fr-header__logo fr-p-0 fr-mb-2w">
    <DsfrLogo
      :logo-text="logoText"
      data-testid="header-logo"
      class="maxwidth"
    />
    <img
      :src="isStaticService ? `${baseUrl}/img/header/cartes-gouv-logo.svg` : `${baseUrl}/annexes/ressources/header/cartes-gouv-logo.svg`"
      alt=""
    >
  </div>
  <div class="fr-grid-row">
    <h2 class="fr-modal__title fr-h2">
      Bienvenue sur cartes.gouv.fr
    </h2>
    <p><a href="https://cartes.gouv.fr/actualites/clap-de-fin-pour-le-geoportail-bienvenue-sur-cartesgouvfr">Le Géoportail a fermé ses portes</a> mais l’expérience cartographique continue ici !</p>
    <p><b>Retrouvez vos cartes, vos données et vos outils</b> sur cartes.gouv.fr, le nouveau site de référence pour explorer, comprendre et approfondir la connaissance du territoire.</p>
  </div>
</template>

<style scoped lang="scss">
.maxwidth {
    max-width: 140px;
}
img {
    width: 55px;
    height: 60px;
    margin-top: 4px;
}
</style>