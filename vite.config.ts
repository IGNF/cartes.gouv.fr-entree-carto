/// <reference types="vitest" />
import { URL, fileURLToPath } from 'node:url'

import { defineConfig, ProxyOptions, ViteDevServer } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import EnvRuntime from 'vite-plugin-env-runtime';
import htmlPurge from 'vite-plugin-purgecss'

// INFO 
// mode https avec certificats unsecure (dev)
// import basicSsl from '@vitejs/plugin-basic-ssl'
import { compression, defineAlgorithm } from 'vite-plugin-compression2'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import {
  vueDsfrAutoimportPreset,
  // ohVueIconAutoimportPreset,
  vueDsfrComponentResolver,
} from '@gouvminint/vue-dsfr/meta'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    htmlPurge({
      safelist: [
        /^(?!fr-).*/,
        /^fr-btn--/,
        /^fr-.+::/,
      ],
      variables: true,
    }),
    // INFO mode https
    // basicSsl(),
    AutoImport({
      include: [
        /\.[tj]sx?$/,
        /\.vue$/,
        /\.vue\?vue/,
      ],
      imports: [
        // @ts-expect-error
        'vue',
        // @ts-expect-error
        'vue-router',
        // @ts-expect-error
        vueDsfrAutoimportPreset,
      ],
      vueTemplate: true,
      dts: './src/auto-imports.d.ts',
      eslintrc: {
        enabled: true,
        filepath: './.eslintrc-auto-import.json',
        globalsPropValue: true,
      },
    }),
    // https://github.com/antfu/unplugin-vue-components
    Components({
      extensions: ['vue'],
      dirs: ['src/components'], // Autoimport de vos composants qui sont dans le dossier `src/components`
      include: [/\.vue$/, /\.vue\?vue/],
      dts: './src/components.d.ts',
      resolvers: [
        vueDsfrComponentResolver,
      ],
    }),
    EnvRuntime({
      name: '__ENV__',
      filename: 'env/env.js'
    }),
    // Options de compression pour les fichiers de production
    compression({
      exclude: [/\.(br)$/, /\.(gz)$/],
      algorithms: [
        'gzip',
        'brotliCompress'
      ]
    })
  ],
  // INFO
  // pour tester la collecte des statistiques en local, il faut modifier l'URL (filtre Eulerian) :
  // > BASE_URL=stat.cartes.gouv.fr npm run dev
  base: process.env.BASE_URL || '/cartes.gouv.fr-entree-carto',
  envDir: "env",
  envPrefix: ["VITE_", "IAM_"],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    sourcemap: process.env.SOURCE_MAP === 'true',
    rollupOptions: {
      output: {
        manualChunks(id) {
          // ── Libs cartographiques de base ──────────────────────────────────
          if (id.includes('node_modules/ol/') ||
              id.includes('node_modules/ol-contextmenu/')) {
            return 'vendor-ol';
          }
          if (id.includes('node_modules/ol-mapbox-style/') ||
              id.includes('node_modules/@maplibre/')) {
            return 'vendor-mapbox-style';
          }
          // ── Extensions GPF (contrôles métier lourds) ─────────────────────
          if (id.includes('node_modules/geopf-extensions-openlayers/') ||
              id.includes('node_modules/geoportal-access-lib/')) {
            return 'vendor-geopf';
          }
          // ── Libs de projection ────────────────────────────────────────────
          if (id.includes('node_modules/proj4/') ||
              id.includes('node_modules/wkt-parser/') ||
              id.includes('node_modules/mgrs/')) {
            return 'vendor-proj';
          }
          // ── Validation de schéma ──────────────────────────────────────────
          if (id.includes('node_modules/ajv/') ||
              id.includes('node_modules/fast-uri/') ||
              id.includes('node_modules/fast-deep-equal/') ||
              id.includes('node_modules/json-schema-traverse/')) {
            return 'vendor-ajv';
          }
          // ── DSFR / UI ─────────────────────────────────────────────────────
          if (id.includes('node_modules/@gouvminint/vue-dsfr/') ||
              id.includes('node_modules/cartes.gouv.fr-vue-components/') ||
              id.includes('node_modules/@iconify/') ||
              id.includes('node_modules/notivue/')) {
            return 'vendor-ui';
          }
          // ── Auth ──────────────────────────────────────────────────────────
          if (id.includes('node_modules/keycloak-js/') ||
              id.includes('node_modules/@badgateway/')) {
            return 'vendor-auth';
          }
          // ── Vue / router / state ──────────────────────────────────────────
          if (id.includes('node_modules/vue/') ||
              id.includes('node_modules/@vue/') ||
              id.includes('node_modules/vue-router/') ||
              id.includes('node_modules/pinia/') ||
              id.includes('node_modules/pinia-plugin-store/') ||
              id.includes('node_modules/@vueuse/') ||
              id.includes('node_modules/vue-logger-plugin/')) {
            return 'vendor-vue';
          }
          // ── Utilitaires divers ────────────────────────────────────────────
          if (id.includes('node_modules/sortablejs/') ||
              id.includes('node_modules/html2canvas/') ||
              id.includes('node_modules/marked/') ||
              id.includes('node_modules/dompurify/') ||
              id.includes('node_modules/mitt/') ||
              id.includes('node_modules/eventbusjs/') ||
              id.includes('node_modules/clusterize.js/') ||
              id.includes('node_modules/rbush/') ||
              id.includes('node_modules/pbf/') ||
              id.includes('node_modules/quickselect/')) {
            return 'vendor-misc';
          }
        }
      }
    },
  },
  server: {
    allowedHosts: true,
    cors : true,
    headers : {
      "Access-Control-Allow-Credentials": "true",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Methods": "*",
      "Access-Control-Expose-Headers": "*"
    },
    // proxy : {
    //   '/api': {
    //     target: "https://data.geopf.fr/api",
    //     changeOrigin: true,
    //     secure: false,
    //     ws: true,
    //     configure: (proxy, _options) => {
    //         proxy.on('error', (err, _req, _res) => {
    //           console.log('proxy error', err);
    //         });
    //         proxy.on('proxyReq', (proxyReq, req, _res) => {
    //           console.log('Sending Request to the Target:', req.method, req.url);
    //         });
    //         proxy.on('proxyRes', (proxyRes, req, _res) => {
    //           console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
    //         });
    //     },
    //   }
    // }
  },
  define: {},
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler'
      }
    }
  },
  test: {
    globals: false,
    environment: 'jsdom',
    setupFiles: ["tests/test/vitest.setup.js"],
    include: ["./tests/test/**/*.{test,spec}.{ts,js}"],
    coverage: {
      reporter: ['text', 'json', 'html'], // Génération des rapports de couverture
      exclude: ['node_modules/', 'tests/'], // Exclure certains dossiers
    },
  },
})
