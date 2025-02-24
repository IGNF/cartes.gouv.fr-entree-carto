import { URL, fileURLToPath } from 'node:url'

import { defineConfig, ProxyOptions, ViteDevServer } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

// INFO 
// mode https avec certificats unsecure (dev)
// import basicSsl from '@vitejs/plugin-basic-ssl'

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
  server: {
    cors : true,
    headers : {
      "Access-Control-Allow-Credentials": "true",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Methods": "*",
      "Access-Control-Expose-Headers": "*"
    },
    // proxy : {
    //   '/': {
    //     target: "http://localhost:5173",
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
  }
})
