/**
 * Paramètres du composant DSFR Footer
 * @returns
 */
export function useFooterParams(): {
    beforeMandatoryLinks: {
        label: string;
        href: string;
    }[];
    a11yCompliance: string;
    legalLink: string;
    personalDataLink: string;
    cookiesLink: string;
    a11yComplianceLink: string;
    descText: string;
    homeLink: string;
    licenceText: undefined;
    licenceTo: undefined;
    licenceName: undefined;
    licenceLinkProps: undefined;
    ecosystemLinks: {
        label: string;
        href: string;
    }[];
    partners: {
        title: string;
        mainPartner: {
            href: string;
            logo: string;
            name: string;
        };
        subPartners: {
            href: string;
            logo: string;
            name: string;
        }[];
    };
    mandatoryLinks: {
        label: string;
        href: string;
    }[];
};
