import { useStorage } from '@vueuse/core';

import {
  defineStore
} from 'pinia';

/**
 * Espace de noms des clefs du localStorage
 */
const NAMESPACE = "cartes.gouv.fr";

const ns = ((value) => {
  return NAMESPACE + '.' + value;
});


export const useDomStore = defineStore('dom', () => {
  var menuCatalogueButton = ref();
  var BookmarksButton = ref();
  var leftControlMenu = ref();
  var rightControlMenu = ref();
  var isReportingDisabled = ref(false);
  var isHeaderCompact = useStorage(ns('isHeaderCompact'), false);
  let isFullscreenPanoramax = ref(false);

  function getBookmarksButton () {
    return BookmarksButton.value;
  }
  function setBookmarksButton (m) {
    BookmarksButton.value = m;
  }

  function getmenuCatalogueButton () {
    return menuCatalogueButton.value;
  }
  function setmenuCatalogueButton (m) {
    menuCatalogueButton.value = m;
  }

  function getleftControlMenu () {
    return leftControlMenu.value;
  }
  function setleftControlMenu (m) {
    leftControlMenu.value = m;
  }

  function getrightControlMenu () {
    return rightControlMenu.value;
  }
  function setrightControlMenu (m) {
    rightControlMenu.value = m;
  }

  function getReportingDisabled () {
    return isReportingDisabled.value;
  }

  function setReportingDisabled (value) {
    isReportingDisabled.value = value;
  }

  return {
    isHeaderCompact,
    isFullscreenPanoramax,
    menuCatalogueButton,
    leftControlMenu,
    rightControlMenu,
    BookmarksButton,
    isReportingDisabled,
    getmenuCatalogueButton,
    setmenuCatalogueButton,
    getBookmarksButton,
    setBookmarksButton,
    getrightControlMenu,
    setrightControlMenu,
    getleftControlMenu,
    setleftControlMenu,
    getReportingDisabled,
    setReportingDisabled,
  }
});