<script setup>
const logoText = "République Française";

const iconProps = ref({ scale: 1.25, name: 'ri:map-2-line' });
</script>

<template>
  <div class="fr-container">
    <div class="fr-grid-row logo-row">
      <DsfrLogo
        :logo-text="logoText"
        data-testid="header-logo"
        class="maxwidth"
      />
      <img
        src="https://data.geopf.fr/annexes/ressources/header/cartes-gouv-logo.svg"
        alt=""
      >
    </div>
    <div class="fr-grid-row content">
      <h2 class="fr-modal__title fr-h2">
        Bienvenue sur cartes.gouv.fr
      </h2>
      <p>Retrouvez ici la référence de la cartographie publique pour explorer, connaître et piloter le territoire :</p>
      <div><span class="icon vicon purple-glycine"><VIcon v-bind="iconProps" /></span>Accédez à une vaste bibliothèque de cartes et de données</div>
      <div><span class="icon yellow-tournesol"><i class="fr-icon-brush-line" /></span>Créez et partagez vos propres cartes</div>
      <div><span class="icon green-archipel"><i class="fr-icon-database-line" /></span>Hébergez vos données et vos cartes en toute autonomie</div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.maxwidth {
    max-width: 140px;
}
img {
    width: 4.5rem;
    height: 4.5rem;
}
.logo-row {
    align-items: center;
    margin-bottom: 1.5rem;
    scale: 0.595;
    transform-origin: left;
}
.content div {
    margin-bottom: 1rem;
}
div > span {
    margin-right: 0.5rem;
    border-radius: 50%;
    height: 34px;
    width: 34px;
    i::before, svg:first-child {
        scale: 0.9;
    }
}
.icon {
  display: inline-flex;
  align-items: center; 
  justify-content: center;
}
.vicon {
    margin-left: 0.1rem;
}
.yellow-tournesol {
    background-color: var(--yellow-tournesol-925-125);
}
.purple-glycine {
    background-color: var(--purple-glycine-925-125);
}
.green-archipel {
    background-color: var(--green-archipel-925-125);
}
</style>