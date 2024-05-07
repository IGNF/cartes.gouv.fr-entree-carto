import LogoIGN from "../assets/logo-ign.png"
import LogoTRANSFO from "../assets/logo-transformation-fonction-publiques.png"
import LogoECOLO from "../assets/logo-transition-ecologique.png"
import LogoCNIG from "../assets/logo-cnig.png"
import { ref } from 'vue';

export function useFooterParams() {

    // Paramètres pour le Footer
    var footerParams = {
        beforeMandatoryLinks: [{ label: 'Plan du site', to: '/plan-du-site' }],
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
            mainPartner: {
                href: "https://www.ign.fr/",
                logo: LogoIGN,
                name: "IGN"
            },
            subPartners: [
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
        themeModale: {
            title: "Params",
            size: "md",
            legend: "Groupe de cases à cocher simple",
            themeOptions: [
                {
                    label: 'Thème clair',
                    value: 'light',
                    id: 'theme-1',
                    name: 'radio-set',
                },
                {
                    label: 'Thème sombre',
                    id: 'theme-2',
                    value: 'dark',
                    name: 'radio-set',
                },
                {
                    label: 'Système',
                    id: 'theme-3',
                    value: 'system',
                    name: 'radio-set',
                    hint: 'Utilise les paramètres sytème.',
                }
            ]
        }
    }

    return footerParams;
};

