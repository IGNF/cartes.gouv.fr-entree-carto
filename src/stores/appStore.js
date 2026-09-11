import {
  defineStore
} from 'pinia';

import { useScheme } from '@gouvminint/vue-dsfr';
import { useStorage } from '@vueuse/core';

const { setScheme, scheme } = useScheme();

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
const VERSION = "12";

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

/**
 * Clef du localStorage des documents temporaires
 */
const DOCUMENT_TEMP_KEY_LS = "document-temporary";

const isQuotaExceededError = (error) => {
  return error?.name === "QuotaExceededError" || error?.code === 22 || error?.code === 1014;
};

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

  // INFO détection première ouverture
  // variable de contrôle de la première ouverture
  // choix d'utiliser sessionStorage pour ne pas persister au delà de la session
  
  const siteOpened = ref(false);

  function detectFirstOpen() {
    if (!sessionStorage.getItem(ns("siteOpened"))) {
      // 👉 Première ouverture dans un nouvel onglet
      siteOpened.value = true;

      // On marque que l’onglet est déjà passé ici
      sessionStorage.setItem(ns("siteOpened"), "true");
    } else {
      // 👉 Reload / Retour redirection → false
      siteOpened.value = false;
    }
  }

  // INFO documents temporaires
  // stockage des documents temporaires dans le localStorage
  var documentTemporary = useStorage(DOCUMENT_TEMP_KEY_LS, "");

  watch(documentTemporary, () => {
    try {
      localStorage.setItem(DOCUMENT_TEMP_KEY_LS, documentTemporary.value);
    } catch (error) {
      if (isQuotaExceededError(error)) {
        clearDocumentTemporary();
        return;
      }
      throw error;
    }
  })

  const setDocumentTemporary = (data) => {
    try {
      localStorage.setItem(DOCUMENT_TEMP_KEY_LS, data);
      documentTemporary.value = data;
      return true;
    } catch (error) {
      if (isQuotaExceededError(error)) {
        clearDocumentTemporary();
        return false;
      }
      throw error;
    }
  }
  const getDocumentTemporary = () => {
    return documentTemporary.value;
  }
  const clearDocumentTemporary = () => {
    documentTemporary.value = "";
    try {
      localStorage.removeItem(DOCUMENT_TEMP_KEY_LS);
    } catch (error) {
      console.error(error);
    }
  }

  return {
    ns,
    siteOpened,
    detectFirstOpen,
    setDocumentTemporary,
    getDocumentTemporary,
    clearDocumentTemporary
  }

});
