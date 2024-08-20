module.exports = {
    env: {
        browser: true,
        es6: true,
        node: true,
    },
    parser: '@typescript-eslint/parser', // TypeScript 파서를 사용
    plugins: [
        '@typescript-eslint', // TypeScript 관련 ESLint 플러그인
        'import', // ES6 import/export 문법 관련 플러그인
        'react', // React 관련 플러그인
        'react-hooks', // React Hooks 관련 플러그인
        'prettier', // 코드 포매팅 플러그인
    ],
    extends: [
        'airbnb', // Airbnb의 JavaScript 스타일 가이드를 따름
        'airbnb/hooks', // Airbnb의 React Hooks 규칙을 따름
        'plugin:@typescript-eslint/recommended', // TypeScript ESLint 추천 설정 사용
        'plugin:prettier/recommended', // Prettier와 ESLint 통합
        'plugin:import/errors', // import 관련 오류 체크
        'plugin:import/warnings', // import 관련 경고 체크
    ],
    parserOptions: {
        ecmaVersion: 2020, // 최신 ECMAScript 문법 지원
        sourceType: 'module', // ECMAScript 모듈 사용
        ecmaFeatures: {
            jsx: true, // JSX 문법 지원
        },
    },
    rules: {
        'linebreak-style': 0, // 줄바꿈 스타일을 강제하지 않음
        'import/no-dynamic-require': 0, // 동적 require 허용
        'import/no-unresolved': 0, // 해결되지 않은 모듈에 대한 오류를 무시
        'import/prefer-default-export': 0, // default export를 강제하지 않음
        'global-require': 0, // 전역 require를 허용
        'import/no-extraneous-dependencies': 0, // 외부 의존성을 허용
        'jsx-quotes': ['error', 'prefer-single'], // JSX 내에서 single quote 사용 강제
        'react/jsx-props-no-spreading': 0, // JSX props 확장을 허용
        'react/forbid-prop-types': 0, // PropTypes 사용 시 경고를 무시
        'react/jsx-filename-extension': [
            2,
            { extensions: ['.js', '.jsx', '.ts', '.tsx'] },
        ], // 특정 확장자 파일에서만 JSX를 허용
        'import/extensions': 0, // 확장자 체크 비활성화
        'no-use-before-define': 0, // 정의 전에 사용하는 것을 허용
        '@typescript-eslint/no-empty-interface': 0, // 빈 인터페이스 허용
        '@typescript-eslint/no-explicit-any': 0, // any 타입 사용 허용
        '@typescript-eslint/no-var-requires': 0, // var로 require를 사용하는 것을 허용
        'no-shadow': 'off', // 변수의 그림자(shadowing) 허용
        'react/prop-types': 0, // prop-types 사용을 비활성화 (TypeScript 사용 시)
        'no-empty-pattern': 0, // 빈 패턴을 허용
        'no-alert': 0, // alert 사용을 허용
        'react-hooks/exhaustive-deps': 0, // React Hooks 의존성 배열 검사를 비활성화
    },
    settings: {
        'import/parsers': {
            '@typescript-eslint/parser': ['.ts', '.tsx'], // TypeScript 파일을 위한 파서 설정
        },
        'import/resolver': {
            typescript: './tsconfig.json', // tsconfig.json을 사용하여 모듈 해석
        },
    },
};
