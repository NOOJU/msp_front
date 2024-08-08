// setupTests.ts

import '@testing-library/jest-dom';
import axios from 'axios';

// axios 모킹 설정
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// 기본적으로 GET 요청에 대해 빈 배열을 응답하도록 설정
mockedAxios.get.mockImplementation(() => Promise.resolve({ data: [] }));

// JSDOM 환경에서는 window.alert가 기본적으로 구현되지 않으므로 이를 모킹합니다.
beforeAll(() => {
    window.alert = jest.fn();
});
