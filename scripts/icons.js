// @ts-check
import { icons as riCollection } from "@iconify-json/ri";

/**
 * Liste de nom d’icônes **sans** le préfixe de la collection Remix Icons 
 * qui sont utilisées dans l’application.
 * @type {string[]}
 */
const riIconNames = [
  "arrow-right-line",
  "bookmark-line",
  "check-line",
  "close-line",
  "menu-add-fill",
  "tools-line",
  "zoom-in-line",
  "custom-size",
  "drag-drop-fill",
  "drag-drop-line",
  "draggable",
  "earth-fill",
  "earth-line",
  "file-copy-fill",
  "file-copy-line",
  "file-upload-fill",
  "file-upload-line",
  "flower-fill",
  "flower-line",
  "fullscreen-exit-fill",
  "fullscreen-exit-line",
  "fullscreen-fill",
  "fullscreen-line",
  "function-add-fill",
  "function-add-line",
  "list-indefinite",
  "map-2-fill",
  "map-2-line",
  "map-pin-5-fill",
  "map-pin-5-line",
  "map-pin-add-fill",
  "map-pin-add-line",
  "map-pin-time-fill",
  "map-pin-time-line",
  "menu-search-fill",
  "menu-search-line",
  "navigation-fill",
  "navigation-line",
  "play-list-add-fill",
  "play-list-add-line",
  "route-fill",
  "route-line",
  "share-2-fill",
  "share-2-line",
  "shining-2-fill",
  "shining-2-line",
  "signpost-fill",
  "signpost-line",
  "text",
  "tree-fill",
  "tree-line"
];


/**
 * Liste de tuples [collectionDIcônes, tableauDeNomsDIcônesUtiliséesDansLApplication]
 * @type {[import('@iconify/vue').IconifyJSON, string[]][]}
 */
export const collectionsToFilter = [
  [riCollection, riIconNames]
]