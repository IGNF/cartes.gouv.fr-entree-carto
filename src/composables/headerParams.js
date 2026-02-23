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
        afterQuickLinks: [
          {
            title: "Aide",
            icon: "ri-question-fill",
            links :[
              {
                  text: "Questions Fréquentes",
                  to: useBaseUrl() + '/aide/fr/',
                  target: "_blank",
                  icon: "ri-question-mark"
              },
              {
                  text: "Guide d'utilisation",
                  to: useBaseUrl() + '/aide/fr/guides-utilisateur/presentation-utilisateur/generalites-utilisateur/',
                  target: "_blank",
                  icon: "ri-book-2-line"
              },
              {
                  text: "Nous contacter",
                  to: useBaseUrl() + '/nous-ecrire',
                  target: "_blank",
                  icon: "ri-mail-line"
              }
            ]   
          },  
          {
            title: "Services",
            icon: "ri-grid-fill",
            links :[
              {
                  text: "Explorer les cartes",
                  to: useBaseUrl() + '/explorer-les-cartes',
                  icon: "ri-road-map-line"
              },
              {
                  text: "Rechercher une donnée",
                  to: useBaseUrl() + '/rechercher-une-donnee/search',
                  icon: "ri-search-line"
              },
              {
                  text: "Publier une donnée",
                  to: useBaseUrl() + '/publier-une-donnee',
                  icon: "ri-database-line"
              },
              // {
              //     text: "Créer une carte",
              //     to: useBaseUrl() + '/creer-une-carte',
              //     icon: "ri-brush-line"
              // },
              {
                  text: "Découvrir cartes.gouv.fr",
                  to: useBaseUrl() + '/decouvrir',
                  icon: "fr-icon-external-link-line",
                  button : true
              }
            ]   
          }       
        ]
    };

    if (import.meta.env.IAM_DISABLE === '0') {
      headerParams.value.afterQuickLinks.push(
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
                text: "Mon compte",
                to: useBaseUrl() + '/mon-compte',
                icon: "ri-user-line"
            }
          ]   
        });
    }

    return headerParams;
};

