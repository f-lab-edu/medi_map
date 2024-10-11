module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  extends: [
    'next/core-web-vitals',
    'next',
    'eslint:recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'eslint-config-prettier',
  ],
  plugins: ['import', '@typescript-eslint', 'react-hooks'],
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  rules: {
    'jsx-a11y/label-has-associated-control': [
      'error',
      {
        required: {
          some: ['nesting', 'id'],
        },
      },
    ],
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    'no-console': 'error',
    'react/jsx-props-no-spreading': 'off',
    'import/order': 'off',
    'react/function-component-definition': 'off',
    'react/require-default-props': 'off',
    'import/no-extraneous-dependencies': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@next/next/no-html-link-for-pages': 'off',
    'import/no-named-as-default': 'off',
  },
  settings: {
    'import/resolver': {
      typescript: {
        project: 'apps/next-client/tsconfig.json', 
      },
    },
  },
};