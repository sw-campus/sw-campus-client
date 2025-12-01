const config = {
  semi: false,
  singleQuote: true,
  jsxSingleQuote: false,
  trailingComma: 'all',
  arrowParens: 'avoid',
  printWidth: 120,
  tabWidth: 2,
  useTabs: false,
  bracketSpacing: true,
  bracketSameLine: false,
  plugins: [
    '@trivago/prettier-plugin-sort-imports', // import 문 정렬
    'prettier-plugin-tailwindcss', // Tailwind 클래스 정렬
  ],
  importOrder: [
    '^react$', // React를 최상단에
    '^next$',
    '<THIRD_PARTY_MODULES>', // 외부 라이브러리
    '^[@]+/', // @로 시작하는 alias 경로
    '^[.]+/', // 상대 경로 import
  ],
  importOrderSeparation: true, // 그룹 간 빈 줄 추가
  importOrderParserPlugins: ['typescript', 'jsx', 'decorators-legacy'],
}

export default config
