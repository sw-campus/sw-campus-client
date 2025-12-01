import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'
import prettier from 'eslint-config-prettier/flat'
import { defineConfig, globalIgnores } from 'eslint/config'

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  prettier,
  {
    rules: {
      // TypeScript 규칙
      '@typescript-eslint/no-explicit-any': 'warn', // any 타입 사용하면 막지는 않고 경고만
      '@typescript-eslint/no-unused-vars': [
        'error', // 사용되지 않는 변수/매개변수 방지. 단, _로 시작하는 변수/매개변수는 제외
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-misused-promises': [
        'error', // async/promise 잘못 사용하면 에러(app router)
        { checksVoidReturn: { arguments: false, attributes: false } },
      ],
      '@typescript-eslint/explicit-module-boundary-types': 'off', // api 함수 반환 타입 명시하지 않음(app router)
      '@typescript-eslint/explicit-function-return-type': 'off', // 함수 반환 타입 명시하지 않음
      '@typescript-eslint/no-non-null-assertion': 'off', // optional chaining 쓰세요(app router)

      // Next.js 규칙
      '@next/next/no-html-link-for-pages': 'off', // app router에서는 의미 없음

      // General 규칙
      'no-console': ['warn', { allow: ['warn', 'error'] }], // console.log 사용하면 경고
      'no-unused-vars': 'off', // 대신 TypeScript 버전 사용
      'prefer-const': 'error', // const 사용 권장
      'no-var': 'error', // var 사용 금지
      eqeqeq: 'error', // ==, != 금지
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
  ]),
])

export default eslintConfig
