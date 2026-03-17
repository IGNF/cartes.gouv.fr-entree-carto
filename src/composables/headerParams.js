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
                  icon: "fr-icon-question-mark"
              },
              {
                  text: "Guide d'utilisation",
                  to: useBaseUrl() + '/aide/fr/guides-utilisateur/visualiseur-cartographique/generalites-visualiseur/',
                  target: "_blank",
                  icon: "fr-icon-book-2-line"
              },
              {
                  text: "Nous contacter",
                  to: useBaseUrl() + '/nous-ecrire',
                  target: "_blank",
                  icon: "fr-icon-mail-line"
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
                  icon: "fr-icon-road-map-line"
              },
              {
                  text: "Rechercher une donnée",
                  to: useBaseUrl() + '/rechercher-une-donnee/search',
                  icon: "fr-icon-search-line"
              },
              {
                  text: "Publier une donnée",
                  to: useBaseUrl() + '/publier-une-donnee',
                  icon: "fr-icon-database-line"
              },
              // {
              //     text: "Créer une carte",
              //     to: useBaseUrl() + '/creer-une-carte',
              //     icon: "ri-brush-line"
              // },
              {
                  text: "Découvrir cartes.gouv.fr ",
                  to: useBaseUrl() + '/decouvrir',
                  target: "_blank",
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
                icon: "fr-icon-dashboard-3-line"
            },
            {
                text: "Mon compte",
                to: useBaseUrl() + '/mon-compte',
                icon: "fr-icon-user-line"
            }
          ]   
        });
    }

    return headerParams;
};

