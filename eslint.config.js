import antfu from '@antfu/eslint-config'

export default antfu({
  formatters: true,
  jsonc: false,
  rules: {
    'style/semi': 'off',
    // Node
    'node/prefer-global/process': 'off',
    // 避免 ESLint 和 Prettier 打架
    'prettier/prettier': 'off',
    'style/quotes': 'off',
    'perfectionist/sort-imports': 'off',
    'style/comma-dangle': 'off',
    'import/no-mutable-exports': 'off',
  }
})
