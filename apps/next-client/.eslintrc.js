module.exports = {
  extends: [
    'next/core-web-vitals',
    '@nish1896/eslint-config/js',
    '@nish1896/eslint-config/react'
  ],
  rules: {
    'prettier/prettier': ['error', { endOfLine: 'lf' }] ,
    'linebreak-style': ['error', 'unix'],
  },
  plugins: ['prettier'],
};
