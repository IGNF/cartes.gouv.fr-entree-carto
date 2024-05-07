import { ref } from 'vue';

export function useHeaderParams() {

    // Paramètres pour le Header
    const headerParams = {
        serviceTitle: 'cartes.gouv.fr',
        serviceDescription: 'Portail Cartographique',
        logoText: ['RÉPUBLIQUE', 'FRANÇAISE'],
        quickLinks: [
            {
                label: 'Accueil',
                to: '/',
                icon: 'ri-arrow-right-line',
                iconRight: true
            },
            {
                label: 'Catalogue',
                to: '/catalogue',
                icon: 'ri-arrow-right-line',
                iconRight: true,
            }
        ],
        searchQuery: ref('')
    };

    return headerParams;
};

