import {
  defineStore
} from 'pinia';

export const useDomStore = defineStore('dom', () => {
  var menuCatalogueButton = ref();
  var BookmarksButton = ref();

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

  return {
    menuCatalogueButton,
    BookmarksButton,
    getmenuCatalogueButton,
    setmenuCatalogueButton,
    getBookmarksButton,
    setBookmarksButton
  }
});