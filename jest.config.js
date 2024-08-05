module.exports = {
    transform: {
        "^.+\\.[t|j]sx?$": "babel-jest",
        "^.+\\.tsx?$": "ts-jest"  // TypeScript 파일을 처리하도록 설정
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
    testEnvironment: "jsdom",
    setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
    testMatch: ["**/?(*.)+(test).[jt]s?(x)"],  // 모든 .test.js, .test.jsx, .test.ts, .test.tsx 파일을 인식
};
