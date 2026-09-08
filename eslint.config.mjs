import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierPlugin from 'eslint-plugin-prettier';
import eslintConfigPrettier from 'eslint-config-prettier';

export default [
  // Arquivos que o ESLint irá analisar
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
  },

  // Ignorar pastas de build e dependências
  {
    ignores: ['node_modules/', 'dist/', 'build/'],
  },

  // Define o ambiente Node.js
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },

  // Configurações recomendadas do JS e TypeScript
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,

  // Integração com o Prettier
  {
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      // Executa o Prettier como uma regra do ESLint (mostra erro se a formatação falhar)
      'prettier/prettier': 'error',

      // Regras personalizadas para Node.js / TypeScript
      'no-console': 'off', // Permite console.log em ambiente Node
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/explicit-module-boundary-types': 'off',
    },
  },

  // Desativa todas as regras do ESLint que possam conflitar com o Prettier
  eslintConfigPrettier,
];
