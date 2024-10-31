import { ref } from 'vue';
import { useBaseUrl } from '@/composables/baseUrl';
import { useServiceStore } from '@/stores/serviceStore';

/**
 * Paramètres du composant DSFR Header
 * @returns 
*/
export function useHeaderParams() {
    var store = useServiceStore();

    // Paramètres pour le Header
    const headerParams = {
        serviceTitle: 'cartes.gouv.fr',
        serviceDescription: 'Le service public des cartes et données du territoire',
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
            },
            {
              label: 'Se connecter', 
              href:  store.getService().getAccessLogin(),
              class: 'fr-icon-user-fill',
              onClick: (e) => {
                console.debug(e);
              }
            }
        ],
        searchQuery: ref('')
    };

    return headerParams;
};

