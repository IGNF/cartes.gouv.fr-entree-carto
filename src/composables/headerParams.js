import { ref } from 'vue';
import { useBaseUrl } from '@/composables/baseUrl';

/**
 * Paramètres du composant DSFR Header
 * @returns 
 */
export function useHeaderParams() {
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
              to: '/login', 
              href: 'https://sso.geopf.fr/realms/geoplateforme/protocol/openid-connect/auth?scope=openid%20profile%20email&response_type=code&approval_prompt=auto&redirect_uri=http%3A%2F%2Flocalhost%3A5173%2Fcartes.gouv.fr-entree-carto',
              class: 'fr-icon-user-fill'
            },
        ],
        searchQuery: ref('')
    };

    return headerParams;
};

