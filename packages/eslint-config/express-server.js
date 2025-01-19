module.exports = {
  extends: [
    './index.js',
    '@nish1896/eslint-config/js',
    'plugin:@typescript-eslint/recommended',
    'eslint-config-prettier'
  ],
  overrides: [
    {
      files: ['src/migrations/**/*.js', 'src/models/**/*.js'],
      rules: {
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/no-var-requires': 'off'
      }
    }
  ],
  env: {
    node: true,
    es6: true
  }
};
