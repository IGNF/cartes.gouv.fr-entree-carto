import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import Service from '@/services/Service';
import { useServiceStore } from '@/stores/serviceStore';
import Map from 'ol/Map';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import TileLayer from 'ol/layer/Tile';

beforeEach(() => setActivePinia(createPinia()));
afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
  sessionStorage.clear();
});

describe('Service documents', () => {
  it('U-SS-01 - store - conserve uniquement documents et authentificated', () => {
    const store = useServiceStore();
    expect(store.$state).toEqual({ documents: {}, authentificated: false });
    store.setDocuments({ drawing: [{ _id: 'drawing' }] });
    const service = new Service();
    expect(Object.hasOwn(service, 'documents')).toBe(true);
    expect(service.documents).toBe(store.documents);
    service.documents.drawing.push({ _id: 'second-drawing' });
    expect(store.documents.drawing).toHaveLength(2);
    expect(service).not.toHaveProperty('token');
    expect(service).not.toHaveProperty('authenticated');
  });

  it('U-SS-02 - resetDocuments - conserve une reference partagee avec le store', () => {
    const store = useServiceStore();
    const service = new Service();
    service.documents.drawing = [{ _id: 'previous-account' }];
    const previous = service.documents;
    service.resetDocuments();
    expect(service.documents).not.toBe(previous);
    expect(service.documents).toBe(store.documents);
    expect(store.documents).toEqual({});
    service.documents.drawing = [{ _id: 'new-account' }];
    expect(store.documents.drawing).toEqual([{ _id: 'new-account' }]);
  });

  it('U-SS-05 - saveStore - expose uniquement les documents en mode debug', () => {
    vi.stubEnv('IAM_DEBUG', 'true');
    const service = new Service();
    service.documents.drawing = [{ _id: 'drawing' }];
    useServiceStore().setAuthentificated(true);
    service.saveStore();
    expect(JSON.parse(sessionStorage.getItem('service:documents:debug'))).toEqual({
      drawing: [{ _id: 'drawing' }],
    });
    service.resetDocuments();
    expect(JSON.parse(sessionStorage.getItem('service:documents:debug'))).toEqual({});
  });

  it('U-SS-06 - saveStore - retire un ancien instantane hors debug', () => {
    sessionStorage.setItem('service:documents:debug', '{"drawing":[]}');
    const service = new Service({ debug: false });
    service.documents.drawing = [{ _id: 'drawing' }];
    service.saveStore();
    expect(sessionStorage.getItem('service:documents:debug')).toBeNull();
  });

  it('U-SS-07 - saveStore - reste fonctionnel si le stockage est indisponible', () => {
    const service = new Service({ debug: true });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('Storage full', 'QuotaExceededError');
    });
    service.getFetch();
    expect(() => service.saveStore()).not.toThrow();
    expect(service.isPending()).toBe(false);
    expect(sessionStorage.getItem('service:documents:debug')).toBeNull();
  });

  it('U-SS-08 - saveStore - ne bloque pas sur des donnees non serialisables', () => {
    const service = new Service({ debug: true });
    service.documents.circular = service.documents;
    expect(() => service.saveStore()).not.toThrow();
    expect(sessionStorage.getItem('service:documents:debug')).toBeNull();
  });

  it('U-SD-01 - fetch - delegue au fetch injecte sans modifier la requete', async () => {
    const response = new Response('{}');
    const fetcher = vi.fn().mockResolvedValue(response);
    const service = new Service({ fetcher });
    const options = { method: 'POST', body: new FormData() };
    expect(await service.getFetch()('/documents', options)).toBe(response);
    expect(fetcher).toHaveBeenCalledWith('/documents', options);
  });

  it('U-SD-02 - resetDocuments - rejette une reponse ancienne', async () => {
    let resolveRequest;
    const fetcher = vi.fn(() => new Promise((resolve) => { resolveRequest = resolve; }));
    const service = new Service({ fetcher });
    const request = service.getFetch()('/documents');
    service.resetDocuments();
    resolveRequest(new Response('{}'));
    await expect(request).rejects.toThrow('Document request cancelled');
    expect(service.documents).toEqual({});
  });

  it('U-SD-03 - resetDocuments - rejette un corps de reponse recu apres le changement de compte', async () => {
    let resolveBody;
    const response = new Response('{}');
    vi.spyOn(response, 'json').mockImplementation(() => new Promise((resolve) => { resolveBody = resolve; }));
    const service = new Service({ fetcher: vi.fn().mockResolvedValue(response) });
    const result = await service.getFetch()('/documents');
    const body = result.json();
    service.resetDocuments();
    resolveBody([{ _id: 'previous-account' }]);
    await expect(body).rejects.toThrow('Document request cancelled');
    expect(service.documents).toEqual({});
  });
});
describe('Service documents - getUnsavedDocuments', () => {
  const createVector = (gpResultLayerId, { features = 1, title } = {}) => {
    const layer = new VectorLayer({
      source: new VectorSource({
        features: Array.from({ length: features }, () => new Feature(new Point([0, 0])))
      })
    });
    if (gpResultLayerId) {
      layer.gpResultLayerId = gpResultLayerId;
    }
    if (title) {
      layer.set('title', title);
    }
    return layer;
  };
  const createMap = (layers) => new Map({ layers });

  it('U-SD-04 - detecte les croquis et calculs non enregistres', () => {
    const service = new Service();
    const map = createMap([
      createVector('drawing', { title: 'Mon croquis' }),
      createVector('compute:Pieton$OGC:OPENLS;Itineraire'),
      createVector('compute:Voiture$GEOPORTAIL:GPP:Isocurve'),
      createVector('measure:profil'),
      createVector('layerimport:COMPUTE', { title: 'Calcul importe' })
    ]);
    expect(service.getUnsavedDocuments(map).map(({ name, type }) => ({ name, type }))).toEqual([
      { name: 'Mon croquis', type: 'drawing' },
      { name: 'Itinéraire', type: 'compute' },
      { name: 'Isochrone/Isodistance', type: 'compute' },
      { name: 'Profil altimétrique', type: 'compute' },
      { name: 'Calcul importe', type: 'compute' }
    ]);
  });

  it('U-SD-05 - ignore les couches vides, du catalogue, des imports et des mesures', () => {
    const service = new Service();
    const map = createMap([
      createVector('drawing', { features: 0 }),
      createVector(null),
      createVector('layerimport:KML'),
      createVector('measure'),
      new TileLayer()
    ]);
    expect(service.getUnsavedDocuments(map)).toEqual([]);
  });

  it('U-SD-06 - signale un bookmark absent des documents de l\'espace personnel', () => {
    const service = new Service();
    service.documents.drawing = [{ _id: 'saved-uuid', name: 'Enregistre' }];
    const map = createMap([
      createVector('bookmark:drawing-kml:saved-uuid', { title: 'Enregistre' }),
      createVector('bookmark:compute-route:missing-uuid', { features: 0 }),
      createVector('bookmark:import-kml:missing-import')
    ]);
    expect(service.getUnsavedDocuments(map).map(({ name, type }) => ({ name, type }))).toEqual([
      { name: 'Itinéraire', type: 'compute' }
    ]);
  });
});
