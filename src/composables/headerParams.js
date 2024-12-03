import { ref } from 'vue';
import { useBaseUrl } from '@/composables/baseUrl';

const headerParams = ref({});
/**
 * Paramètres du composant DSFR Header
 * @returns 
*/
export function useHeaderParams() {

    // Paramètres pour le Header
    headerParams.value = {
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
              to: '/login',
              class: 'fr-icon-user-fill',
              onClick: (e) => {}
            },
            // {
            //   label: null, 
            //   to: '/bookmarks',
            //   href: useBaseUrl() + '/tableau-de-bord',
            //   class: null,
            //   onClick: (e) => {}
            // }
        ],
        searchQuery: ref('')
    };

    return headerParams;
};

