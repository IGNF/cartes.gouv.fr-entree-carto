import { useMediaQuery } from '@vueuse/core';

/**
 * Taille des écrans
 * @param {*} size
 * @returns
 */
export function useMatchMedia(size) {
    // breakpoints définis par le DSFR
    // mais en min-width uniquement, donc on retranche 1px
    // car ici on utilise max-width
    var sizes = {
        SM : 576 - 1,
        MD : 768 - 1,
        LG : 992 - 1,
        XL : 1440 - 1
    };

    if (sizes[size] !== undefined) {
        const query = "(max-width: " + sizes[size] + "px)";
        return useMediaQuery(query)
    }
};

export function useMatchMediaHeight(size) {
    // breakpoints définis par le DSFR
    var sizes = {
        XS : "739px", // TODO 639px
        SM : "719px",
        LG : "779px",
        XL : "859px",
    };

    if (sizes[size] !== undefined) {
        const query = "(max-height: " + sizes[size] + ")";
        return useMediaQuery(query)
    }
};