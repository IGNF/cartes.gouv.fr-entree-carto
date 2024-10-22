import {
  defineStore
} from 'pinia';

import { useStorage } from '@vueuse/core';

const { setScheme, theme, scheme } = useScheme();

/**
 * Espace de noms des clefs du localStorage
 */
const NAMESPACE = "cartes.gouv.fr";

const ns = ((value) => {
  return NAMESPACE + '.' + value;
});

/**
 * Versionning du localStorage
 */
const VERSION = "0";

/**
 * Clef du localStorage de cartes.gouv.fr
 * sur le choix du thème
 */
const SCHEME_KEY_LS_MAIN = "scheme";

/**
 * Clef du localStorage de cartes.gouv.fr/cartes
 * sur le choix du thème
 */
const SCHEME_KEY_LS_CARTES = "vue-dsfr-scheme";

export const useAppStore = defineStore('app', () => {

  // INFO version
  // la méthode useStorage() récupère la valeur dans le localStorage
  // sinon, elle prend celle par defaut.
  var version = useStorage(ns('version'), VERSION);

  // si la version du localStorage est differente de celle du code,
  // on nettoie le localStorage et on enregistre la bonne version.
  if (version.value !== VERSION) {
    localStorage.clear();
    localStorage.setItem(ns('version'), VERSION);
    version.value = VERSION;
  }

  watch(version, () => {
    localStorage.setItem(ns('version'), version.value);
  })

  // INFO gestion du thème
  // on récupère la valeur du thème de cartes.gouv.fr
  var schemeMain = useStorage(SCHEME_KEY_LS_MAIN);

  // si cartes.gouv.fr a défini une valeur,
  // on l'applique pour la carte
  if (schemeMain.value) {
    localStorage.setItem(SCHEME_KEY_LS_CARTES, schemeMain.value);
    setScheme(schemeMain.value);
  }
  
  // mise à jour de la clef et application du thème
  watch(schemeMain, () => {
    localStorage.setItem(SCHEME_KEY_LS_CARTES, schemeMain.value);
    setScheme(schemeMain.value);
  })

  // mise à jour de la clef de cartes.gouv.fr
  watch(scheme, () => {
    localStorage.setItem(SCHEME_KEY_LS_MAIN, scheme.value);
  })

});