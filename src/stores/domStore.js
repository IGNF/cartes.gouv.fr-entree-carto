import {
  defineStore
} from 'pinia';

export const useDomStore = defineStore('dom', () => {
  var menuCatalogueButton = ref();

  function getmenuCatalogueButton () {
    return menuCatalogueButton.value;
  }
  function setmenuCatalogueButton (m) {
    menuCatalogueButton.value = m;
  }

  return {
    menuCatalogueButton,
    getmenuCatalogueButton,
    setmenuCatalogueButton
  }
});