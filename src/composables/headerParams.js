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
        // serviceDescription: 'Le service public des cartes et données du territoire',
        logoText: [''],
        quickLinks: [
            // {
            //   label: 'Accueil',
            //   to: '/',
            //   href: useBaseUrl() + '/',
            //   icon: 'ri-arrow-right-line',
            //   iconRight: true
            // },
            // {
            //   label: 'Catalogue',
            //   to: '/catalogue',
            //   href: useBaseUrl() + '/catalogue',
            //   icon: 'ri-arrow-right-line',
            //   iconRight: true,
            // }
        ],
        afterQuickLinks: [
          {
            title: "Aides",
            icon: "ri-question-fill",
            links :[
              {
                  text: "Questions Fréquentes",
                  to: "#",
                  icon: "ri-question-mark"
              },
              {
                  text: "Documentation",
                  to: "#",
                  icon: "ri-file-text-line"
              },
              {
                  text: "Nous contacter",
                  to: "#",
                  icon: "ri-mail-line"
              }
            ]   
          },  
        {
            title: "Services",
            icon: "ri-grid-fill",
            links :[
              {
                  text: `<div class="fr-grid-row fr-grid-row--left">
                                  <div class="fr-description__label fr-text--bold fr-text--sm fr-text-action-high--grey">Nom
                                    utilisateur</div>
                                </div>    
                                <div class="fr-grid-row fr-grid-row--left">
                                  <div class="fr-description__info fr-text--xs fr-text-mention--grey">
                                    adresseutilisateur@email.com</div>
                                </div>`,
                  type: "html"
              },
              {
                  text: "Tableau de bord",
                  to: "#",
                  icon: "ri-dashboard-3-line"
              },
              {
                  text: "Mon compte",
                  to: "#",
                  icon: "ri-user-line"
              }
            ]   
          },  
        {
            title: "Mon espace",
            icon: "ri-account-circle-fill",
            links :[
              {
                  text: `<div class="fr-grid-row fr-grid-row--left">
                                  <div class="fr-description__label fr-text--bold fr-text--sm fr-text-action-high--grey">Nom
                                    utilisateur</div>
                                </div>    
                                <div class="fr-grid-row fr-grid-row--left">
                                  <div class="fr-description__info fr-text--xs fr-text-mention--grey">
                                    adresseutilisateur@email.com</div>
                                </div>`,
                  type: "html"
              },
              {
                  text: "Tableau de bord",
                  to: "#",
                  icon: "ri-dashboard-3-line"
              },
              {
                  text: "Mon compte",
                  to: "#",
                  icon: "ri-user-line"
              },
              {
                  text: `<div class="fr-grid-row fr-grid-row--center">
                                  <button class="fr-icon-logout-box-r-line fr-btn fr-btn--tertiary fr-btn--icon-left">
                                    <i class="ri-logout-box-line"></i> Se déconnecter
                                  </button>
                          </div>`,
                  type: "html"
              },
            ]   
          }
        ],
        searchQuery: ref('')
    };

    // activation de la connexion aux favoris
    if (import.meta.env.IAM_DISABLE === '0') {
      headerParams.value.quickLinks.push({
        label: '',
        to: '#',
        class: '',
        authenticated: false, // information pour l'authentification
        onClick: (e) => {}
      });
      headerParams.value.quickLinks.push({
        label: 'Se déconnecter',
        to: '/logout',
        class: 'fr-icon-logout-box-r-line',
        authenticated: true, // information pour l'authentification
        onClick: (e) => {}
      });
      headerParams.value.quickLinks.push({
        label: "...", 
        // to: '/bookmarks',
        href: useBaseUrl() + '/tableau-de-bord',
        class: 'fr-icon-account-fill',
        authenticated: true, // information pour l'authentification
        onClick: (e) => {}
      });
    }

    return headerParams;
};

