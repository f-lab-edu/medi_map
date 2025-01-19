module.exports = {
  env: {
    browser: true,
    node: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:import/recommended',
    'eslint-config-prettier',
  ],
  plugins: ['import'],
  rules: {
    'no-console': 'warn',
    'import/order': 'off',
  },
};
