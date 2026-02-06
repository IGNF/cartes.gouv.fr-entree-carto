/// <reference types="vitest" />
import { URL, fileURLToPath } from 'node:url'

import { defineConfig, ProxyOptions, ViteDevServer } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import EnvRuntime from 'vite-plugin-env-runtime';

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
        'vitest',
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
        'brotliCompress',
        defineAlgorithm('deflate', { level: 9 })
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
    globals: true,
    environment: 'jsdom',
    setupFiles: ["tests/test/vitest.setup.js"],
    include: ["./tests/test/**/*.{test,spec}.{ts,js}"],
    coverage: {
      reporter: ['text', 'json', 'html'], // Génération des rapports de couverture
      exclude: ['node_modules/', 'tests/'], // Exclure certains dossiers
    },
  },
})
