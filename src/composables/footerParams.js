import { useBaseUrl } from '@/composables/baseUrl';

/**
 * Paramètres du composant DSFR Footer
 * @returns 
 */
export function useFooterParams() {

    // Paramètres pour le Footer
    const footerParams = {
        beforeMandatoryLinks: [
          { 
            label: 'Plan du site', 
            href: useBaseUrl() + '/plan-du-site' 
          }
        ],
        a11yCompliance: 'partiellement conforme',
        legalLink: '/mentions-legales', 
        personalDataLink: '/donnees-personnelles',
        cookiesLink: '/cookies',
        a11yComplianceLink: '/accessibilite',
        descText: 'Cartes.gouv.fr est développé par l’Institut national de l’information géographique et forestière (IGN) et ses partenaires. Le site s’appuie sur la Géoplateforme, la nouvelle infrastructure publique, ouverte et collaborative des données géographiques.',
        homeLink: '/',
        licenceText: undefined,
        licenceTo: undefined,
        licenceName: undefined,
        licenceLinkProps: undefined,
        ecosystemLinks: [
            {
                label: 'info.gouv.fr',
                href: 'https://info.gouv.fr',
            },
            {
                label: 'service-public.gouv.fr',
                href: 'https://service-public.gouv.fr',
            },
            {
                label: 'legifrance.gouv.fr',
                href: 'https://legifrance.gouv.fr',
            },
            {
                label: 'data.gouv.fr',
                href: 'https://data.gouv.fr',
            },
        ],
        partners: {
            title: "Nos partenaires",
            mainPartner: {
              href: "https://www.ign.fr/",
              logo: "https://data.geopf.fr/annexes/ressources/footer/ign.png",
              name: "IGN"
          },
            subPartners: [
                {
                    href: "https://www.transformation.gouv.fr/",
                    logo: "https://data.geopf.fr/annexes/ressources/footer/min_fp.jpg",
                    name: "Ministère de la transformation et de la fonction publiques"
                },
                {
                    href: "https://www.ecologie.gouv.fr/",
                    logo: "https://data.geopf.fr/annexes/ressources/footer/min_ecologie.jpg",
                    name: "Ministère de la Transition Écologique et de la Cohésion des Territoires"
                },
                {
                    href: "https://cnig.gouv.fr/",
                    logo: "https://data.geopf.fr/annexes/ressources/footer/rf_cnig.jpg",
                    name: "Conseil national de l’information géolocalisée"
                },
            ]
        },
        mandatoryLinks: [
          {
            label: 'Accessibilité : partiellement conforme',
            href: useBaseUrl() + '/accessibilite'
          },
          {
            label: 'Mentions légales',
            href: useBaseUrl() + '/mentions-legales'
          },
          {
            label: 'Conditions générales d’utilisation',
            href: useBaseUrl() + '/cgu'
          },
          {
            label: 'Données personnelles',
            href: useBaseUrl() + '/donnees-personnelles'
          },
          {
            label: 'Gestion des cookies',
            href: useBaseUrl() + '/cookies' // par defaut, mais on surcharge pour avoir les cookies en local !
          }
        ],
    }

    return footerParams;
};

