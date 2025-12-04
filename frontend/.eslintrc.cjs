/* eslint-env node */
module.exports = {
  root: true,
  env: { browser: true, es2022: true },
  parser: '@typescript-eslint/parser',
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  plugins: ['@typescript-eslint', 'react', 'react-hooks', 'import', 'tailwindcss'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:tailwindcss/recommended',
    'prettier'
  ],
  settings: { react: { version: 'detect' } },
  rules: {
    'import/order': [
      'error',
      {
        'newlines-between': 'always',
        groups: [['builtin', 'external', 'internal'], ['parent', 'sibling', 'index']],
        alphabetize: { order: 'asc', caseInsensitive: true }
      }
    ]
  }
};


