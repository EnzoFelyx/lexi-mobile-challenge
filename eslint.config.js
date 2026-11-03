// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const prettierRecommended = require('eslint-plugin-prettier/recommended');
const reactNative = require('eslint-plugin-react-native');

// Cor crua dentro de className (REGRAS.md, regra 4): a no-color-literals não enxerga className.
const RAW_COLOR = '/#[0-9a-fA-F]{3,8}\\b|\\b(rgba?|hsla?)\\(/';
// Valor arbitrário de cor do Tailwind (bg-[#fff], text-[rgb(…)]) em qualquer string, inclusive em mapas de variantes.
const ARBITRARY_COLOR = '/-\\[(#|rgba?\\(|hsla?\\()/';
const COLOR_IN_CLASSNAME_MESSAGE =
  'Use os tokens do tema (bg-surface, text-text-primary…), nunca cor crua ou valor arbitrário.';

module.exports = defineConfig([
  expoConfig,
  prettierRecommended,
  {
    ignores: [
      'dist/*',
      '.expo/*',
      '.claude/*',
      'coverage/*',
      'nativewind-env.d.ts',
      'expo-env.d.ts',
      'src/core/database/migrations/*',
    ],
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: { '@typescript-eslint/no-explicit-any': 'error' },
  },
  {
    plugins: { 'react-native': reactNative },
    rules: {
      'react-native/no-color-literals': 'error',
      'react-native/no-inline-styles': 'error',
      'react-hooks/exhaustive-deps': 'error',
      'no-console': ['error', { allow: ['warn', 'error'] }],
      'no-restricted-syntax': [
        'error',
        {
          selector: `JSXAttribute[name.name='className'] Literal[value=${RAW_COLOR}]`,
          message: COLOR_IN_CLASSNAME_MESSAGE,
        },
        {
          selector: `JSXAttribute[name.name='className'] TemplateElement[value.raw=${RAW_COLOR}]`,
          message: COLOR_IN_CLASSNAME_MESSAGE,
        },
        {
          selector: `Literal[value=${ARBITRARY_COLOR}]`,
          message: COLOR_IN_CLASSNAME_MESSAGE,
        },
        {
          selector: `TemplateElement[value.raw=${ARBITRARY_COLOR}]`,
          message: COLOR_IN_CLASSNAME_MESSAGE,
        },
      ],
    },
  },
]);
