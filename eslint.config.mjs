import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist/**', 'node_modules/**'] },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  { files: ['frontend/src/**/*.{ts,tsx}', 'backend/**/*.ts'], languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } }, rules: { '@typescript-eslint/no-explicit-any': 'off' } },
);
