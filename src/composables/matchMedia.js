import { useMediaQuery } from '@vueuse/core';

/**
 * Taille des écrans
 * @param {*} size
 * @returns
 */
export function useMatchMedia(size) {
    // breakpoints définis par le DSFR
    var sizes = {
        SM : "576px",
        MD : "768px",
        LG : "992px",
        XL : "1440px"
    };

    if (sizes[size] !== undefined) {
        const query = "(max-width: " + sizes[size] + ")";
        return useMediaQuery(query)
    }
};

export function useMatchMediaHeight(size) {
    // breakpoints définis par le DSFR
    var sizes = {
        XS : "639px",
        SM : "719px",
        LG : "779px",
        XL : "859px",
    };

    if (sizes[size] !== undefined) {
        const query = "(max-height: " + sizes[size] + ")";
        return useMediaQuery(query)
    }
};