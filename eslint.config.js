import pluginJs from '@eslint/js'
import eslintConfigPrettier from 'eslint-config-prettier'
import pluginVue from 'eslint-plugin-vue'
import pluginVueA11y from 'eslint-plugin-vuejs-accessibility'
import globals from 'globals'
import tseslint from 'typescript-eslint'

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    ignores: ['**/dist/**', 'public/mockServiceWorker.js']
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,vue}']
  },
  {
    languageOptions: {
      globals: globals.browser
    }
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  {
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser
      }
    },
    rules: {
      'vue/require-default-prop': 'off'
    }
  },
  ...pluginVueA11y.configs["flat/recommended"],
  {
    "rules": {
      "vuejs-accessibility/label-has-for": ["error", {
        "required": {
          "some": ["nesting", "id"]
        }
      }]
    },
  },
  eslintConfigPrettier
]
