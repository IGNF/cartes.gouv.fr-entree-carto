import { useMediaQuery } from '@vueuse/core';
import { ref } from 'vue';

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