<script setup>
import LogoSun from "@gouvfr/dsfr/dist/artwork/pictograms/environment/sun.svg";
import LogoMoon from "@gouvfr/dsfr/dist/artwork/pictograms/environment/moon.svg";
import LogoSystem from "@gouvfr/dsfr/dist/artwork/pictograms/system/system.svg";

// recuperation du theme
const { setScheme, scheme } = useScheme();

// initialisation avec le thème (light, dark ou system)
const modelValue = ref(scheme.value);

const changeTheme = () => {
  setScheme(modelValue.value);
}

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
</script>

<template>
  <DsfrRadioButtonSet
    v-model="modelValue"
    legend="Choisissez un thème pour personnaliser l’apparence du site."
    name="fr-radios-theme"
    :options="themeOptions"
    @update:model-value="changeTheme"
  />
</template>
