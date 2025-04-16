import pluginVue from 'eslint-plugin-vue'
import globals from 'globals'
import vueParser from 'vue-eslint-parser'
import js from '@eslint/js'
import ts from 'typescript-eslint'

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
      }
    }
  }
]