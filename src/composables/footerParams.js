import LogoIGN from "../assets/logo-ign.png"
import LogoTRANSFO from "../assets/logo-transformation-fonction-publiques.png"
import LogoECOLO from "../assets/logo-transition-ecologique.png"
import LogoCNIG from "../assets/logo-cnig.png"

export function useFooterParams() {

    // Paramètres pour le Footer
    const footerParams = {
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
        themeModale: {
            title: "Paramètres d'affichage",
            size: "md",
            legend: "Choisissez un thème pour personnaliser l'apparence du site.",
            themeOptions: [
                {
                    label: 'Thème clair',
                    value: 'light',
                    id: 'fr-radios-theme-light',
                    name: 'fr-radios-theme',
                    img: ""
                },
                {
                    label: 'Thème sombre',
                    id: 'fr-radios-theme-dark',
                    value: 'dark',
                    name: 'fr-radios-theme',
                    img: ""
                },
                {
                    label: 'Système',
                    id: 'fr-radios-theme-system',
                    value: 'system',
                    name: 'fr-radios-theme',
                    hint: 'Utilise les paramètres sytème.',
                    img: ""
                }
            ]
        }
    }

    return footerParams;
};
