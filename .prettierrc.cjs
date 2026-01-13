const config = {
  arrowParens: 'always',
  printWidth: 100,
  useTabs: false,
  tabWidth: 2,
  endOfLine: 'auto',
  singleQuote: true,
  semi: false,
  jsxSingleQuote: true,
  quoteProps: 'as-needed',
  trailingComma: 'all',
  bracketSpacing: true,
  bracketSameLine: false,
  importOrder: ['^@core/(.*)$', '<THIRD_PARTY_MODULES>', '^@server/(.*)$', '^@ui/(.*)$', '^[./]'],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  plugins: ['prettier-plugin-tailwindcss', '@trivago/prettier-plugin-sort-imports'],
}

module.exports = config
