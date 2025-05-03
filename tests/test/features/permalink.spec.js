import { vi, describe, expect, test } from 'vitest';
import { getLayersFromPermalink } from '@/features/permalink';
import { useMapStore } from '@/stores/mapStore';
import { setActivePinia, createPinia } from 'pinia';
import Map from 'ol/Map';

var map = null;

beforeAll(() => {
  // map
  map = new Map({
    target: "map"
  });
  // pinia
  setActivePinia(createPinia())
})

describe('getLayersFromPermalink', () => {
  var mapStore = null;;
  beforeEach(() => {
    mapStore = useMapStore();
    mapStore.setMap(map);
  })

  it('permalin par defaut', () => {
    var url = "https://cartes.gouv.fr/cartes?c=2.602777,46.493888&z=6&l=GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2$GEOPORTAIL:OGC:WMTS(-1;1;1;0)&w=OverviewMap,SearchEngine,ScaleLine,LayerSwitcher,GetFeatureInfo,Legends,Zoom,FullScreen,Share,Print,Territories,LayerImport,ControlList,ContextMenu&permalink=yes";
    getLayersFromPermalink(url)
    expect(mapStore.zoom).toEqual(6)
    expect(mapStore.layers).toEqual("GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2$GEOPORTAIL:OGC:WMTS(-1;1;1;0)")
    expect(mapStore.center).toEqual(['2.602777','46.493888'])
  })

  it.todo('permalien avec une donnée de type : mapbox')
  it.todo('permalien avec une donnée de type : vecteur')
  it.todo('permalien avec une donnée de type : service')
  it.todo('permalien avec une donnée de type : compute')
})