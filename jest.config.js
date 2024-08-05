module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
    moduleNameMapper: {
        '^.+\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    },
    transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest',
        '^.+\\.(js|jsx)$': 'babel-jest', // Babel을 사용하여 JS/JSX 파일 변환
    },
    transformIgnorePatterns: [
        'node_modules/(?!(axios)/)', // axios를 변환하도록 설정
    ],
    testMatch: ['**/?(*.)+(spec|test).[tj]s?(x)'],
};
