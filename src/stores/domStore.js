import {
  defineStore
} from 'pinia';

export const useDomStore = defineStore('dom', () => {
  var menuCatalogueButton = ref();
  var BookmarksButton = ref();
  var leftControlMenu = ref();

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

  return {
    menuCatalogueButton,
    leftControlMenu,
    BookmarksButton,
    getmenuCatalogueButton,
    setmenuCatalogueButton,
    getBookmarksButton,
    setBookmarksButton,
    getleftControlMenu,
    setleftControlMenu
  }
});