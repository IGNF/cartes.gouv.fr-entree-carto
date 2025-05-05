<script setup lang="js">
import LogoSun from "@gouvfr/dsfr/dist/artwork/pictograms/environment/sun.svg";
import LogoMoon from "@gouvfr/dsfr/dist/artwork/pictograms/environment/moon.svg";
import LogoSystem from "@gouvfr/dsfr/dist/artwork/pictograms/system/system.svg";

// plugin local
import { useEulerian } from '@/plugins/Eulerian';
const eulerian = useEulerian();

// gestion de la modale de changement de thème d'affichage

// recuperation du theme
const { setScheme, theme, scheme } = useScheme();

// initialisation avec le thème (light, dark ou system)
const modelValue = ref(scheme.value);

// mise à jour du thème (checkbox)
watch(scheme, () => {
  modelValue.value = scheme.value;
})

const title = "Paramètres d'affichage";
const size = "md";
const legend = "Choisissez un thème pour personnaliser l'apparence du site.";
const themeOptions = [
  {
    label: 'Thème clair',
    value: 'light',
    id: 'fr-radios-theme-light',
    name: 'fr-radios-theme',
    img: LogoSun,
  },
  {
    label: 'Thème sombre',
    id: 'fr-radios-theme-dark',
    value: 'dark',
    name: 'fr-radios-theme',
    img: LogoMoon,
  },
  {
    label: 'Système',
    id: 'fr-radios-theme-system',
    value: 'system',
    name: 'fr-radios-theme',
    hint: 'Utilise les paramètres sytème.',
    img: LogoSystem,
  }
];

const changeTheme = () => {
  setScheme(modelValue.value);
}

const themeModalOpened = ref(false);

const openModalTheme = () => {
  themeModalOpened.value = true;
  eulerian.pause(); // HACK on desactive la collecte afin d'ouvrir la modale
}

const onModalThemeClose = () => {
  themeModalOpened.value = false;
  // HACK on reactive la collecte si besoin
  eulerian.resume();
}

defineExpose({
  openModalTheme,
  onModalThemeClose,
  modelValue
});

</script>

<template>
  <!-- Modale : Paramètres d’affichage -->
  <DsfrModal 
    ref="modal" 
    :opened="themeModalOpened" 
    :title="title"
    :size="size" 
    @close="onModalThemeClose"
  >
    <DsfrRadioButtonSet 
      v-model="modelValue" 
      :legend="legend" 
      name="fr-radios-theme"
      :options="themeOptions" 
      @update:model-value="changeTheme"
    />
  </DsfrModal>
</template>