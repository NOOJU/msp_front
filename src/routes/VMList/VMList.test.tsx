import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';
import VMList from './VMList';

// axios 모킹
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// 모킹 데이터
const mockData = [
    {
        id: 1,
        name: 'VM1',
        status: '신청',
        spec: '2Core 4GB',
        os: 'Ubuntu 20.04',
        publicIp: '192.168.0.1',
        startDate: '2023-01-01',
        endDate: '2023-01-31'
    },
    {
        id: 2,
        name: 'VM2',
        status: '승인',
        spec: '4Core 8GB',
        os: 'CentOS 8',
        publicIp: '192.168.0.2',
        startDate: '2023-02-01',
        endDate: '2023-02-28'
    }
];

describe('VMList', () => {
    // 각 테스트 전에 axios 모킹 설정
    beforeEach(() => {
        mockedAxios.get.mockResolvedValue({ data: mockData });
    });

    // 각 테스트 후 모킹된 함수 초기화
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('VMList 컴포넌트를 렌더링하고 VM 데이터를 표시해야 한다', async () => {
        render(<VMList />);

        // 제목이 렌더링되는지 확인
        expect(screen.getByText('Virtual Machine 목록')).toBeInTheDocument();

        // 개별적으로 VM 데이터가 표시되는지 확인
        expect(await screen.findByText('VM1')).toBeInTheDocument();
        expect(await screen.findByText('신청')).toBeInTheDocument();
        expect(await screen.findByText('2Core 4GB')).toBeInTheDocument();
        expect(await screen.findByText('Ubuntu 20.04')).toBeInTheDocument();
        expect(await screen.findByText('192.168.0.1')).toBeInTheDocument();
        expect(await screen.findByText('2023-01-01')).toBeInTheDocument();
        expect(await screen.findByText('2023-01-31')).toBeInTheDocument();

        expect(await screen.findByText('VM2')).toBeInTheDocument();
        expect(await screen.findByText('승인')).toBeInTheDocument();
        expect(await screen.findByText('4Core 8GB')).toBeInTheDocument();
        expect(await screen.findByText('CentOS 8')).toBeInTheDocument();
        expect(await screen.findByText('192.168.0.2')).toBeInTheDocument();
        expect(await screen.findByText('2023-02-01')).toBeInTheDocument();
        expect(await screen.findByText('2023-02-28')).toBeInTheDocument();
    });

    it('API 호출이 실패할 때 에러 메시지를 표시해야 한다', async () => {
        mockedAxios.get.mockRejectedValueOnce(new Error('API call failed'));

        render(<VMList />);

        expect(await screen.findByText('VM 목록을 가져오는데 실패했습니다.')).toBeInTheDocument();
    });
});
