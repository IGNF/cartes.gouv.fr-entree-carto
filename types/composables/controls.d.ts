export function isControlVisible(controlId: any): boolean;
/**
 * Obtenir les contrôles par défaut
 * @returns
 */
export function useDefaultControls(): string[];
/**
 * Obtenir les options pour le menu des contrôles
 * (cf. MenuControl.vue)
 * @returns
 */
export function useControlsMenuOptions(): ({
    label: string;
    id: string;
    name: string;
    disabled: boolean;
    icon: string;
    group: string;
    hint?: undefined;
} | {
    label: string;
    id: string;
    name: string;
    hint: string;
    disabled: boolean;
    icon: string;
    group: string;
} | {
    label: string;
    id: string;
    name: string;
    disabled: boolean;
    icon: string;
    group?: undefined;
    hint?: undefined;
} | {
    label: string;
    id: string;
    name: string;
    hint: string;
    disabled: boolean;
    icon?: undefined;
    group?: undefined;
} | {
    label: string;
    id: string;
    name: string;
    disabled: boolean;
    icon?: undefined;
    group?: undefined;
    hint?: undefined;
})[];
/**
 * Obtenir les positions des contrôles (extensions)
 * @returns
 */
export function useControlsExtensionPosition(): {
    shareOptions: string;
    printOptions: string;
    territoriesOptions: string;
    layerSwitcherOptions: string;
    legendsOptions: string;
    getFeatureInfoOptions: string;
    overviewMapOptions: string;
    zoomOptions: string;
    controlListOptions: string;
    isocurveOptions: string;
    routeOptions: string;
    reverseGeocodeOptions: string;
    fullscreenOptions: string;
    measureLengthOptions: string;
    measureAreaOptions: string;
    measureAzimuthOptions: string;
    elevationPathOptions: string;
    layerImportOptions: string;
    mousePositionOptions: string;
    drawingOptions: string;
    reportingOptions: string;
    catalogOptions: string;
    panoramaxOptions: string;
};
/**
 * Obtenir la position des contrôles (gauche/droite)
 * @returns
 */
export function useControlsPosition(): {
    left: string[];
    right: string[];
};
/**
 * Obtenir les options de chaque contrôle
 * @returns
 */
export function useControlsOptions(): {
    catalog: {
        id: string;
        position: string;
        gutter: boolean;
        listable: boolean;
        titlePrimary: string;
        layerLabel: string;
        layerThumbnail: boolean;
        size: string;
        tabHeightAuto: boolean;
        addToMap: boolean;
        optimisation: string;
        search: {
            display: boolean;
            criteria: string[];
        };
        categories: ({
            title: string;
            id: string;
            order: boolean;
            featured: boolean;
            producer: boolean;
            filter: {
                field: string;
                value: string;
            };
            search?: undefined;
            items?: undefined;
        } | {
            title: string;
            id: string;
            search: boolean;
            items: ({
                title: string;
                default: boolean;
                order: boolean;
                section: boolean;
                icon: boolean;
                filter: {
                    field: string;
                    value: string;
                };
            } | {
                title: string;
                order: boolean;
                section: boolean;
                icon: boolean;
                filter: {
                    field: string;
                    value: string;
                };
                default?: undefined;
            })[];
            order?: undefined;
            featured?: undefined;
            producer?: undefined;
            filter?: undefined;
        })[];
        configuration: {
            type: string;
            data: {
                layers: any;
                topics: any;
                featured: any;
            };
        };
    };
    overviewMap: {
        id: string;
        collapsed: boolean;
        position: string;
        layers: GeoportalWMTS[];
    };
};
export namespace useControls {
    namespace Catalog {
        let id: string;
        let visible: boolean;
        let disabled: boolean;
        let icon: string;
    }
    namespace LayerSwitcher {
        let id_1: string;
        export { id_1 as id };
        let visible_1: boolean;
        export { visible_1 as visible };
        let disabled_1: boolean;
        export { disabled_1 as disabled };
        let icon_1: string;
        export { icon_1 as icon };
    }
    namespace MeasureLength {
        let id_2: string;
        export { id_2 as id };
        let visible_2: boolean;
        export { visible_2 as visible };
        let disabled_2: boolean;
        export { disabled_2 as disabled };
        let icon_2: string;
        export { icon_2 as icon };
    }
    namespace MeasureArea {
        let id_3: string;
        export { id_3 as id };
        let visible_3: boolean;
        export { visible_3 as visible };
        let disabled_3: boolean;
        export { disabled_3 as disabled };
        let icon_3: string;
        export { icon_3 as icon };
    }
    namespace Drawing {
        let id_4: string;
        export { id_4 as id };
        let visible_4: boolean;
        export { visible_4 as visible };
        let disabled_4: boolean;
        export { disabled_4 as disabled };
        let icon_4: string;
        export { icon_4 as icon };
    }
    namespace Route {
        let id_5: string;
        export { id_5 as id };
        let visible_5: boolean;
        export { visible_5 as visible };
        let disabled_5: boolean;
        export { disabled_5 as disabled };
        let icon_5: string;
        export { icon_5 as icon };
    }
    namespace Isocurve {
        let id_6: string;
        export { id_6 as id };
        let visible_6: boolean;
        export { visible_6 as visible };
        let disabled_6: boolean;
        export { disabled_6 as disabled };
        let icon_6: string;
        export { icon_6 as icon };
    }
    namespace ReverseGeocode {
        let id_7: string;
        export { id_7 as id };
        let visible_7: boolean;
        export { visible_7 as visible };
        let disabled_7: boolean;
        export { disabled_7 as disabled };
        let icon_7: string;
        export { icon_7 as icon };
    }
    namespace MousePosition {
        let id_8: string;
        export { id_8 as id };
        let visible_8: boolean;
        export { visible_8 as visible };
        let disabled_8: boolean;
        export { disabled_8 as disabled };
        let icon_8: string;
        export { icon_8 as icon };
    }
    namespace ElevationPath {
        let id_9: string;
        export { id_9 as id };
        let visible_9: boolean;
        export { visible_9 as visible };
        let disabled_9: boolean;
        export { disabled_9 as disabled };
        let icon_9: string;
        export { icon_9 as icon };
    }
    namespace MeasureAzimuth {
        let id_10: string;
        export { id_10 as id };
        let visible_10: boolean;
        export { visible_10 as visible };
        let disabled_10: boolean;
        export { disabled_10 as disabled };
        let icon_10: string;
        export { icon_10 as icon };
    }
    namespace ControlList {
        let id_11: string;
        export { id_11 as id };
        let visible_11: boolean;
        export { visible_11 as visible };
        let disabled_11: boolean;
        export { disabled_11 as disabled };
        let icon_11: string;
        export { icon_11 as icon };
    }
    namespace OverviewMap {
        let id_12: string;
        export { id_12 as id };
        let visible_12: boolean;
        export { visible_12 as visible };
        export let defaultEnabled: boolean;
        let disabled_12: boolean;
        export { disabled_12 as disabled };
        let icon_12: string;
        export { icon_12 as icon };
    }
    namespace SearchEngine {
        let id_13: string;
        export { id_13 as id };
        let visible_13: boolean;
        export { visible_13 as visible };
        let disabled_13: boolean;
        export { disabled_13 as disabled };
        let icon_13: string;
        export { icon_13 as icon };
    }
    namespace ScaleLine {
        let id_14: string;
        export { id_14 as id };
        let visible_14: boolean;
        export { visible_14 as visible };
        let disabled_14: boolean;
        export { disabled_14 as disabled };
        let icon_14: string;
        export { icon_14 as icon };
    }
    namespace GetFeatureInfo {
        let id_15: string;
        export { id_15 as id };
        let visible_15: boolean;
        export { visible_15 as visible };
        let disabled_15: boolean;
        export { disabled_15 as disabled };
        let icon_15: string;
        export { icon_15 as icon };
    }
    namespace Legends {
        let id_16: string;
        export { id_16 as id };
        let visible_16: boolean;
        export { visible_16 as visible };
        let disabled_16: boolean;
        export { disabled_16 as disabled };
        let icon_16: string;
        export { icon_16 as icon };
    }
    namespace Zoom {
        let id_17: string;
        export { id_17 as id };
        let visible_17: boolean;
        export { visible_17 as visible };
        let defaultEnabled_1: boolean;
        export { defaultEnabled_1 as defaultEnabled };
        let disabled_17: boolean;
        export { disabled_17 as disabled };
        let icon_17: string;
        export { icon_17 as icon };
    }
    namespace FullScreen {
        let id_18: string;
        export { id_18 as id };
        let visible_18: boolean;
        export { visible_18 as visible };
        let disabled_18: boolean;
        export { disabled_18 as disabled };
        let icon_18: string;
        export { icon_18 as icon };
    }
    namespace Share {
        let id_19: string;
        export { id_19 as id };
        let visible_19: boolean;
        export { visible_19 as visible };
        let disabled_19: boolean;
        export { disabled_19 as disabled };
        let icon_19: string;
        export { icon_19 as icon };
    }
    namespace Print {
        let id_20: string;
        export { id_20 as id };
        let visible_20: boolean;
        export { visible_20 as visible };
        let disabled_20: boolean;
        export { disabled_20 as disabled };
        let icon_20: string;
        export { icon_20 as icon };
    }
    namespace Territories {
        let id_21: string;
        export { id_21 as id };
        let visible_21: boolean;
        export { visible_21 as visible };
        let defaultEnabled_2: boolean;
        export { defaultEnabled_2 as defaultEnabled };
        let disabled_21: boolean;
        export { disabled_21 as disabled };
        let icon_21: string;
        export { icon_21 as icon };
    }
    namespace LayerImport {
        let id_22: string;
        export { id_22 as id };
        let visible_22: boolean;
        export { visible_22 as visible };
        let disabled_22: boolean;
        export { disabled_22 as disabled };
        let icon_22: string;
        export { icon_22 as icon };
    }
    namespace ContextMenu {
        let id_23: string;
        export { id_23 as id };
        let visible_23: boolean;
        export { visible_23 as visible };
        let disabled_23: boolean;
        export { disabled_23 as disabled };
        let icon_23: string;
        export { icon_23 as icon };
    }
    namespace Reporting {
        let id_24: string;
        export { id_24 as id };
        let visible_24: boolean;
        export { visible_24 as visible };
        let disabled_24: boolean;
        export { disabled_24 as disabled };
        let icon_24: string;
        export { icon_24 as icon };
    }
    namespace Panoramax {
        let id_25: string;
        export { id_25 as id };
        let visible_25: boolean;
        export { visible_25 as visible };
        let defaultEnabled_3: boolean;
        export { defaultEnabled_3 as defaultEnabled };
        let disabled_25: boolean;
        export { disabled_25 as disabled };
        let icon_25: string;
        export { icon_25 as icon };
    }
}
import { LayerWMTS as GeoportalWMTS } from 'geopf-extensions-openlayers';
