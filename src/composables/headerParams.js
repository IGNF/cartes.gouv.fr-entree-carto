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
        logoText: ['république', 'française'],
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
            title: "Aide",
            icon: "ri-question-fill",
            links :[
              {
                  text: "Questions Fréquentes",
                  to: useBaseUrl() + '/aide',
                  icon: "ri-question-mark"
              },
              {
                  text: "Aide",
                  to: useBaseUrl() + '/aide/fr/guides-utilisateur/visualiseur-cartographique/',
                  icon: "ri-book-2-line"
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
                  text: "Visualiser les cartes",
                  to: useBaseUrl() + '/explorer-les-cartes',
                  icon: "ri-road-map-line"
              },
              {
                  text: "Rechercher une donnée",
                  to: useBaseUrl() + '/rechercher-une-donnee',
                  icon: "ri-search-line"
              },
              {
                  text: "Publier une donnée",
                  to: useBaseUrl() + '/publier-une-donnee',
                  icon: "ri-database-line"
              },
              {
                  text: "Créer une carte",
                  to: useBaseUrl() + '/creer-une-carte',
                  icon: "ri-brush-line"
              },
              {
                  text: "Découvrir cartes.gouv",
                  to: useBaseUrl() + '/decouvrir',
                  icon: "fr-icon-external-link-line",
                  button : true
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
                  to: useBaseUrl() + '/tableau-de-bord',
                  icon: "ri-dashboard-3-line"
              },
              {
                  text: "Paramètres du compte",
                  to: useBaseUrl() + '/mon-compte',
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

