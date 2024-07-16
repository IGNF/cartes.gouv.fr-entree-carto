import LogoIGN from "../assets/logo-ign.png"
import LogoTRANSFO from "../assets/logo-transformation-fonction-publiques.png"
import LogoECOLO from "../assets/logo-transition-ecologique.png"
import LogoCNIG from "../assets/logo-cnig.png"

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
                label: 'legifrance.gouv.fr',
                href: 'https://legifrance.gouv.fr',
            },
            {
                label: 'gouvernement.fr',
                href: 'https://gouvernement.fr',
            },
            {
                label: 'service-public.fr',
                href: 'https://service-public.fr',
            },
            {
                label: 'data.gouv.fr',
                href: 'https://data.gouv.fr',
            },
        ],
        partners: {
            title: "Nos partenaires",
            mainPartner: {},
            subPartners: [
                {
                    href: "https://www.ign.fr/",
                    logo: LogoIGN,
                    name: "IGN"
                },
                {
                    href: "https://www.transformation.gouv.fr/",
                    logo: LogoTRANSFO,
                    name: "Ministère de la transformation et de la fonction publiques"
                },
                {
                    href: "https://www.ecologie.gouv.fr/",
                    logo: LogoECOLO,
                    name: "Ministère de la Transition Écologique et de la Cohésion des Territoires"
                },
                {
                    href: "https://cnig.gouv.fr/",
                    logo: LogoCNIG,
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

