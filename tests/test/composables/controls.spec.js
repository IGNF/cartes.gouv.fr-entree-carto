import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/composables/matchMedia', () => ({
  useMatchMedia: () => ({ value: false })
}));
vi.mock('@/stores/dataStore', () => ({
  useDataStore: () => ({})
}));
vi.mock('geopf-extensions-openlayers', () => ({
  LayerWMTS: class LayerWMTS {}
}));
vi.mock('vue-logger-plugin', () => ({
  useLogger: () => ({ warn: vi.fn() })
}));

import { isControlVisible, useControls, useControlsMenuOptions, useDefaultControls } from '@/composables/controls';

const initialOverviewMapConfig = { ...useControls.OverviewMap };

afterEach(() => {
  Object.assign(useControls.OverviewMap, initialOverviewMapConfig);
});

describe('composables/controls', () => {
  it('U-CT-02 - useControls - définit les statuts attendus', () => {
    for (const control of Object.values(useControls)) {
      expect(control).toHaveProperty('id');
      expect(control).toHaveProperty('visible');
      expect(control).toHaveProperty('disabled');
      if ('defaultEnabled' in control) {
        expect(typeof control.defaultEnabled).toBe('boolean');
      }
    }
  });

  it('U-CT-03 - useDefaultControls et useControlsMenuOptions - excluent un contrôle invisible', () => {
    useControls.OverviewMap.visible = false;
    useControls.OverviewMap.defaultEnabled = true;

    expect(useDefaultControls()).not.toContain('OverviewMap');
    expect(isControlVisible('OverviewMap')).toBe(false);
    expect(isControlVisible('ExternalControl')).toBe(true);
    expect(useControlsMenuOptions().some(option => option.name === 'OverviewMap')).toBe(false);
  });

  it('U-CT-04 - useControlsMenuOptions - conserve un contrôle visible mais désactivé', () => {
    useControls.OverviewMap.disabled = true;
    const overviewMapOption = useControlsMenuOptions().find(option => option.name === 'OverviewMap');

    expect(overviewMapOption).toMatchObject({
      name: 'OverviewMap',
      disabled: true
    });
  });

  it('U-CT-05 - useDefaultControls - inclut un contrôle dont defaultEnabled est indéfini', () => {
    expect(useControls.Catalog.defaultEnabled).toBeUndefined();
    expect(useDefaultControls()).toContain('Catalog');
    expect(useDefaultControls()).not.toContain('OverviewMap');
  });
});