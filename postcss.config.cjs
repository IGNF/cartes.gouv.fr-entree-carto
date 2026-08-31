const purgecss = require('@fullhuman/postcss-purgecss');

const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  plugins: [
    isProd &&
      purgecss({
        content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
        safelist: {
          standard: [
            /^(?!fr-).*/, // Purge prioritairement les classes DSFR (fr-*)
            /^fr-icon-ign-/, // Préserve les icônes DSFR injectées par geopf-extensions-openlayers
            /^fr-btn--/, // Préserve les variantes de boutons DSFR
            /^fr-.+::/, // Préserve les sélecteurs DSFR avec pseudo-éléments
          ],
        },
        variables: true,
      }),
  ].filter(Boolean),
};
