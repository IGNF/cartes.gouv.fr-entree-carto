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
        var query = "(max-width: " + sizes[size] + ")";
        const match = window.matchMedia(query);
        const isMatching = ref(match.matches);
        match.addEventListener('change', e => isMatching.value = e.matches);
        return isMatching;
    }
};