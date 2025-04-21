import pluginVue from 'eslint-plugin-vue'
import globals from 'globals'
import vueParser from 'vue-eslint-parser'
import js from '@eslint/js'
import ts from 'typescript-eslint'
import { rejects } from 'assert'
import { inject } from 'vue'

export default [
  js.configs.recommended,
  ...ts.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  {
    rules: {
      // override/add rules settings here, such as:
      // 'vue/no-unused-vars': 'error'
      "vue/multi-word-component-names": 'off',
      'no-undef': 'warn'
    },
    files: ['**/*.{js,ts,vue}'],
    languageOptions: {
      sourceType: 'module',
      globals: {
        ...globals.browser
      },
      parser: vueParser,
      parserOptions: {
        parser: {
          "js": "espree",
          "ts": "@typescript-eslint/parser",
        }
      },
      globals: {
        // Vue 3
        inject: 'readonly',
        provide: 'readonly',
        ref: 'readonly',
        computed: 'readonly',
        watch: 'readonly',
        watchEffect: 'readonly',
        onMounted: 'readonly',
        onBeforeMount: 'readonly',
        onBeforeUpdate: 'readonly',
        onUpdated: 'readonly',
        // Other
        console: 'readonly',
        process: 'readonly',
        location: 'readonly',
        document: 'readonly',
        window: 'readonly',
        navigator: 'readonly',
        history: 'readonly',
        rejects: 'readonly',
        setTimeout: 'readonly',
        setInterval: 'readonly',
        clearTimeout: 'readonly',
        clearInterval: 'readonly',
        fetch: 'readonly',
        localStorage: 'readonly',
        sessionStorage: 'readonly',
        URLSearchParams: 'readonly',
        URL: 'readonly',
        Blob: 'readonly',
        File: 'readonly',
        FileReader: 'readonly',
        FormData: 'readonly',
      }
    },
  }
]