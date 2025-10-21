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
                  to: useBaseUrl() + '/faq',
                  icon: "ri-question-mark"
              },
              {
                  text: "Documentation",
                  to: useBaseUrl() + '/documentation',
                  icon: "ri-file-text-line"
              },
              {
                  text: "Nous contacter",
                  to: useBaseUrl() + '/nous-ecrire',
                  icon: "ri-mail-line"
              }
            ]   
          },  
        {
            title: "Services",
            icon: "ri-grid-fill",
            links :[
              {
                  text: "Offre de service",
                  to: useBaseUrl() + '/offre',
                  // icon: "ri-user-line"
              },
              {
                  text: "Niveau de service",
                  to: useBaseUrl() + '/niveau-de-service',
                  // icon: "ri-dashboard-3-line"
              }
            ]   
          },  
        {
            title: "Mon espace",
            icon: "ri-account-circle-fill",
            connexionMenu: true,
            links :[
              {
                  text: "Tableau de bord",
                  to: useBaseUrl() + '/',
                  icon: "ri-dashboard-3-line"
              },
              {
                  text: "Mon compte",
                  to: useBaseUrl() + '/',
                  icon: "ri-user-line"
              }
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
      // headerParams.value.quickLinks.push({
      //   label: 'Se déconnecter',
      //   to: '/logout',
      //   class: 'fr-icon-logout-box-r-line',
      //   authenticated: true, // information pour l'authentification
      //   onClick: (e) => {}
      // });
      // headerParams.value.quickLinks.push({
      //   label: "...", 
      //   // to: '/bookmarks',
      //   href: useBaseUrl() + '/tableau-de-bord',
      //   class: 'fr-icon-account-fill',
      //   authenticated: true, // information pour l'authentification
      //   onClick: (e) => {}
      // });
    }

    return headerParams;
};

