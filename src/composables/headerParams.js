import { ref } from 'vue';
import { useBaseUrl } from '@/composables/baseUrl';

export function useHeaderParams() {
  console.error(location)
    // Paramètres pour le Header
    const headerParams = {
        serviceTitle: 'cartes.gouv.fr',
        serviceDescription: 'Portail Cartographique',
        logoText: ['RÉPUBLIQUE', 'FRANÇAISE'],
        quickLinks: [
            {
                label: 'Accueil',
                to: '/',
                href: useBaseUrl() + '/',
                icon: 'ri-arrow-right-line',
                iconRight: true
            },
            {
                label: 'Catalogue',
                to: '/catalogue',
                href: useBaseUrl() + '/catalogue',
                icon: 'ri-arrow-right-line',
                iconRight: true,
            }
        ],
        searchQuery: ref('')
    };

    return headerParams;
};

