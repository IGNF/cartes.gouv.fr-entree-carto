import { describe, it, expect, vi, beforeAll, beforeEach, afterEach } from 'vitest';

// geopf-extensions-openlayers et ses dépendances (ol-contextmenu…) ne sont pas
// compatibles avec la résolution de modules Node/jsdom en environnement de test.
// L'alias dans vite.config.ts permet à Vite de trouver le fichier d'entrée du paquet ;
// ce mock empêche le chargement du code réel (et de ses dépendances transitives cassées).
vi.mock('geopf-extensions-openlayers', () => ({
  LayerWMTS: class LayerWMTS {},
  LayerWMS: class LayerWMS {},
}));

import { addPermalink, removePermalink, getLayersFromPermalink } from '@/features/permalink';
import { useMapStore } from '@/stores/mapStore';
import { setActivePinia, createPinia } from 'pinia';
import Map from 'ol/Map';

var map = null;

beforeAll(() => {
  map = new Map({ target: "map" });
  setActivePinia(createPinia());
});

// ─── addPermalink / removePermalink ────────────────────────────────────────────

describe('addPermalink', () => {
  afterEach(() => {
    // Nettoyer l'URL après chaque test
    window.history.pushState({}, '', '/');
  });

  it('U-PL-01 - addPermalink - ajoute le paramètre permalink=yes dans l\'URL', () => {
    window.history.pushState({}, '', '/?z=6');
    addPermalink();
    expect(window.location.search).toContain('permalink=yes');
  });

  it('U-PL-01 - addPermalink - préserve les paramètres existants', () => {
    window.history.pushState({}, '', '/?c=2.6,46.5&z=10');
    addPermalink();
    const params = new URLSearchParams(window.location.search);
    expect(params.get('permalink')).toBe('yes');
    expect(params.get('c')).toBe('2.6,46.5');
    expect(params.get('z')).toBe('10');
  });
});

describe('removePermalink', () => {
  afterEach(() => {
    window.history.pushState({}, '', '/');
  });

  it('U-PL-02 - removePermalink - supprime le paramètre permalink de l\'URL', () => {
    window.history.pushState({}, '', '/?c=2.6,46.5&permalink=yes');
    removePermalink();
    expect(window.location.search).not.toContain('permalink');
  });

  it('U-PL-02 - removePermalink - conserve les autres paramètres', () => {
    window.history.pushState({}, '', '/?c=2.6,46.5&z=8&permalink=yes');
    removePermalink();
    const params = new URLSearchParams(window.location.search);
    expect(params.has('permalink')).toBe(false);
    expect(params.get('c')).toBe('2.6,46.5');
    expect(params.get('z')).toBe('8');
  });

  it('U-PL-02 - removePermalink - URL sans autres paramètres ne laisse pas de "?"', () => {
    window.history.pushState({}, '', '/?permalink=yes');
    removePermalink();
    expect(window.location.search).toBe('');
  });
});

// ─── getLayersFromPermalink ────────────────────────────────────────────────────

describe('getLayersFromPermalink', () => {
  var mapStore = null;

  beforeEach(() => {
    mapStore = useMapStore();
    mapStore.setMap(map);
    // Réinitialiser l'URL propre
    window.history.pushState({}, '', '/');
  });

  afterEach(() => {
    window.history.pushState({}, '', '/');
  });

  it('U-PL-03 - getLayersFromPermalink - couche WMTS Géoportail met à jour le store', () => {
    const url = "https://cartes.gouv.fr/?c=2.602777,46.493888&z=6&l=GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2$GEOPORTAIL:OGC:WMTS(-1;1;1;0)&permalink=yes";
    getLayersFromPermalink(url);
    expect(mapStore.zoom).toEqual(6);
    expect(mapStore.layers).toEqual("GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2$GEOPORTAIL:OGC:WMTS(-1;1;1;0)");
    expect(mapStore.center).toEqual(['2.602777', '46.493888']);
  });

  it('U-PL-04 - getLayersFromPermalink - couche WMS met à jour le store', () => {
    const url = "https://cartes.gouv.fr/?c=2.3,48.8&z=10&l=BDCARTO$GEOPORTAIL:OGC:WMS(1;1;1;0)&permalink=yes";
    getLayersFromPermalink(url);
    expect(mapStore.zoom).toEqual(10);
    expect(mapStore.layers).toEqual("BDCARTO$GEOPORTAIL:OGC:WMS(1;1;1;0)");
  });

  it('U-PL-05 - getLayersFromPermalink - couche vecteur GeoJSON met à jour le store', () => {
    const url = "https://cartes.gouv.fr/?z=8&l=https://example.com/regions.geojson$EXTERNAL:GeoJSON(1;1;1;0)&permalink=yes";
    getLayersFromPermalink(url);
    expect(mapStore.zoom).toEqual(8);
    expect(mapStore.layers).toEqual("https://example.com/regions.geojson$EXTERNAL:GeoJSON(1;1;1;0)");
  });

  it('U-PL-06 - getLayersFromPermalink - couche Mapbox met à jour le store', () => {
    const url = "https://cartes.gouv.fr/?z=7&l=https://example.com/mapbox1.json$EXTERNAL:Mapbox(1;1;1;0)&permalink=yes";
    getLayersFromPermalink(url);
    expect(mapStore.zoom).toEqual(7);
    expect(mapStore.layers).toContain('Mapbox');
  });

  it('U-PL-07 - getLayersFromPermalink - données espace personnel (d=) stockées dans bookmarks', () => {
    const docUrl = "https://data.geopf.fr/documents/abc.bin?uuid=123&name=Mon+croquis&format=kml&opacity=1&visible=1&grayscale=0";
    const url = `https://cartes.gouv.fr/?z=6&l=GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2$GEOPORTAIL:OGC:WMTS(1;1;1;0)&d=${encodeURIComponent(docUrl)}&permalink=yes`;
    getLayersFromPermalink(url);
    expect(mapStore.bookmarks).toBeTruthy();
    expect(mapStore.bookmarks).toContain('geopf.fr/documents');
  });

  it('U-PL-08 - getLayersFromPermalink - URL invalide lève une erreur sans crash inattendu', () => {
    const url = "https://cartes.gouv.fr/?c=invalide&permalink=yes";
    expect(() => getLayersFromPermalink(url)).toThrow();
  });

  it('U-PL-08 - getLayersFromPermalink - URL sans paramètre ne modifie pas le store', () => {
    const zoomAvant = mapStore.zoom;
    const url = "https://cartes.gouv.fr/?permalink=yes";
    getLayersFromPermalink(url);
    // Aucun paramètre métier → le store reste inchangé
    expect(mapStore.zoom).toEqual(zoomAvant);
  });
});