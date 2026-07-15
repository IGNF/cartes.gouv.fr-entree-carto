import { describe, it, expect, beforeAll } from 'vitest';
import { toShare, fromShare } from '@/features/share';
import { useServiceStore } from '@/stores/serviceStore';
import { setActivePinia, createPinia } from 'pinia';

// Fixtures communes
const DOC_VECTEUR = {
  name: "Mes regions",
  description: "carte des regions",
  labels: ["cartes.gouv.fr", "import", "geojson", "internal"],
  public_url: "https://data.geopf.fr/documents/MbJm2TiNss64KS0kcTyh8F3NBslCr3L3lB1TlBxulLs3E6.bin",
  _id: "ac16ac4a-1acd-465c-9003-b33c64ccc705"
};

const DOC_MAPBOX = {
  name: "Mon style Mapbox",
  description: "style mapbox",
  labels: ["cartes.gouv.fr", "service", "mapbox", "internal"],
  public_url: "https://data.geopf.fr/documents/ZSqrOC52yNfWvvJF4sUMz6FLjX4ZQPsMYAIPz1A0UDHoOk.bin",
  _id: "b95feb80-da74-451f-a0e5-cc6dc3c4acb4"
};

const DOC_SERVICE = {
  name: "Ma couche WMS",
  description: "couche wms",
  labels: ["cartes.gouv.fr", "service", "wms", "internal"],
  public_url: "https://data.geopf.fr/documents/AbCdEf12345678901234567890123456789012345.bin",
  _id: "d1e2f3a4-b5c6-7890-abcd-ef1234567890"
};

beforeAll(() => {
  setActivePinia(createPinia());
  useServiceStore().setService({ mode: "remote" });
});

// ─── toShare ──────────────────────────────────────────────────────────────────

describe('toShare', () => {
  it('U-SH-07 - toShare - document non défini retourne undefined', () => {
    expect(toShare()).toBeUndefined();
    expect(toShare(null)).toBeUndefined();
    expect(toShare({})).toBeUndefined();
  });

  it('U-SH-01 - toShare - document interne de type vecteur (GeoJSON)', () => {
    const url = toShare(DOC_VECTEUR);
    expect(url).toBeDefined();
    expect(url).toContain('MbJm2TiNss64KS0kcTyh8F3NBslCr3L3lB1TlBxulLs3E6.bin');
    expect(url).toContain('i=ac16ac4a-1acd-465c-9003-b33c64ccc705');
    expect(url).toContain('n=Mes+regions');
    expect(url).toContain('f=geojson');
    expect(url).toContain('t=import');
    expect(url).toContain('c=internal');
    // La description est un paramètre optionnel : elle ne doit pas apparaître
    expect(url).not.toContain('description');
    // L'URL de base geopf.fr/documents/ est retirée (réduction)
    expect(url).not.toContain('https://data.geopf.fr/documents/');
  });

  it('U-SH-02 - toShare - document de type mapbox (public_url geopf)', () => {
    const url = toShare(DOC_MAPBOX);
    expect(url).toBeDefined();
    expect(url).toContain('ZSqrOC52yNfWvvJF4sUMz6FLjX4ZQPsMYAIPz1A0UDHoOk.bin');
    expect(url).toContain('f=mapbox');
    expect(url).toContain('t=service');
    expect(url).toContain('k=mapbox');
    expect(url).toContain('c=internal');
  });

  it('U-SH-02 - toShare - document de type service WMS', () => {
    const url = toShare(DOC_SERVICE);
    expect(url).toBeDefined();
    expect(url).toContain('t=service');
    expect(url).toContain('k=wms');
    expect(url).toContain('c=internal');
  });

  it('U-SH-06 - toShare - paramètres opacity / visible / grayscale inclus', () => {
    const url = toShare(DOC_VECTEUR, { opacity: 0.5, visible: true, grayscale: true });
    expect(url).toBeDefined();
    expect(url).toContain('o=0.5');
    expect(url).toContain('v=true');
    expect(url).toContain('g=true');
  });
});

// ─── fromShare ────────────────────────────────────────────────────────────────

describe('fromShare', () => {
  it('U-SH-07 - fromShare - URL non définie retourne undefined', () => {
    expect(fromShare()).toBeUndefined();
    expect(fromShare(null)).toBeUndefined();
  });

  it('U-SH-04 - fromShare - URL de type import/vecteur reconstruit le document', () => {
    const url =
      'MbJm2TiNss64KS0kcTyh8F3NBslCr3L3lB1TlBxulLs3E6.bin?' +
      'n=Mes+regions&i=ac16ac4a-1acd-465c-9003-b33c64ccc705&f=geojson&t=import&c=internal';
    const doc = fromShare(url);
    expect(doc).toBeDefined();
    expect(doc.name).toBe('Mes regions');
    expect(doc.id).toBe('ac16ac4a-1acd-465c-9003-b33c64ccc705');
    expect(doc.format).toBe('geojson');
    expect(doc.type).toBe('import');
    expect(doc.target).toBe('internal');
    expect(doc.url).toBe('https://data.geopf.fr/documents/MbJm2TiNss64KS0kcTyh8F3NBslCr3L3lB1TlBxulLs3E6.bin');
  });

  it('U-SH-05 - fromShare - URL de type mapbox reconstruit le document', () => {
    const url =
      'ZSqrOC52yNfWvvJF4sUMz6FLjX4ZQPsMYAIPz1A0UDHoOk.bin?' +
      'n=Mon+style+Mapbox&i=b95feb80-da74-451f-a0e5-cc6dc3c4acb4&f=mapbox&t=service&c=internal&k=mapbox';
    const doc = fromShare(url);
    expect(doc).toBeDefined();
    expect(doc.name).toBe('Mon style Mapbox');
    expect(doc.format).toBe('mapbox');
    expect(doc.type).toBe('service');
    expect(doc.kind).toBe('mapbox');
    expect(doc.url).toBe('https://data.geopf.fr/documents/ZSqrOC52yNfWvvJF4sUMz6FLjX4ZQPsMYAIPz1A0UDHoOk.bin');
  });

  it('U-SH-03 - fromShare - URL de type service WMS reconstruit le document', () => {
    const url =
      'AbCdEf12345678901234567890123456789012345.bin?' +
      'n=Ma+couche+WMS&i=d1e2f3a4-b5c6-7890-abcd-ef1234567890&t=service&c=internal&k=wms';
    const doc = fromShare(url);
    expect(doc).toBeDefined();
    expect(doc.name).toBe('Ma couche WMS');
    expect(doc.type).toBe('service');
    expect(doc.kind).toBe('wms');
    expect(doc.target).toBe('internal');
  });

  it('U-SH-06 - fromShare - paramètres opacity / visible / grayscale préservés', () => {
    const url =
      'MbJm2TiNss64KS0kcTyh8F3NBslCr3L3lB1TlBxulLs3E6.bin?' +
      'n=Mes+regions&i=ac16ac4a-1acd-465c-9003-b33c64ccc705&f=geojson&t=import&c=internal&o=0.5&v=true&g=true';
    const doc = fromShare(url);
    expect(doc.opacity).toBe('0.5');
    expect(doc.visible).toBe('true');
    expect(doc.grayscale).toBe('true');
  });

  it('U-SH-08 - fromShare - cycle aller-retour document → URL → document', () => {
    const url = toShare(DOC_VECTEUR);
    const doc = fromShare(url);
    expect(doc.name).toBe(DOC_VECTEUR.name);
    expect(doc.id).toBe(DOC_VECTEUR._id);
    expect(doc.format).toBe('geojson');
    expect(doc.type).toBe('import');
    expect(doc.target).toBe('internal');
    expect(doc.url).toBe(DOC_VECTEUR.public_url);
  });
});

