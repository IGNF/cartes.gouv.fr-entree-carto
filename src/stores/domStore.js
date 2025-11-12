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
  var isHeaderCompact = useStorage(ns('isHeaderCompact'), false);

  watch(isHeaderCompact, () => {
    localStorage.setItem(ns('isHeaderCompact'), isHeaderCompact.value);
  })

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
    console.log('setleftControlMenu', m);
    leftControlMenu.value = m;
  }

  function getIsHeaderCompact () {
    return isHeaderCompact.value;
  }
  function setIsHeaderCompact (m) {
    isHeaderCompact.value = m;
  }

  return {
    isHeaderCompact,
    menuCatalogueButton,
    leftControlMenu,
    BookmarksButton,
    getmenuCatalogueButton,
    setmenuCatalogueButton,
    getBookmarksButton,
    setBookmarksButton,
    getleftControlMenu,
    setleftControlMenu,
    getIsHeaderCompact,
    setIsHeaderCompact
  }
});