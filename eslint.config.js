import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default [
  { ignores: ['node_modules/**', 'db/migrations/**'] },
  js.configs.recommended,
  ...tseslint.configs.strict,
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
    },
  },
];
