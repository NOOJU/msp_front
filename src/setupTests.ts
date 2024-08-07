import '@testing-library/jest-dom';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

mockedAxios.get.mockImplementation(() => Promise.resolve({ data: [] })); // 기본 응답 설정
