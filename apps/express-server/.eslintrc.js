module.exports = {
  extends: ['@nish1896/eslint-config/js'],
  overrides: [
    {
      files: ['src/migrations/**/*.js', 'src/models/**/*.js'],
      rules: {
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/no-var-requires': 'off'
      }
    }
  ]
};