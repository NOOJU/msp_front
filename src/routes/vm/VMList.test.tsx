import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import VMListPage from './VMList';
import Apply from '../Apply/Apply';

jest.mock('axios'); // axios 모킹
const mockedAxios = axios as jest.Mocked<typeof axios>;

global.alert = jest.fn(); // window.alert 모킹

describe('VMListPage Component', () => {
    beforeEach(() => {
        jest.clearAllMocks(); // 각 테스트 전마다 모의 호출을 초기화합니다.
    });

    // VMListPage 컴포넌트를 렌더링하고 기본 요소들이 존재하는지 확인하는 테스트입니다.
    test('renders VMListPage component', () => {
        render(
            <MemoryRouter>
                <VMListPage />
            </MemoryRouter>
        );

        expect(screen.getByText('VM 목록')).toBeInTheDocument();
        expect(screen.getByText('VM 신청')).toBeInTheDocument();
        expect(screen.getByText('VM 목록 새로고침')).toBeInTheDocument();
    });

    // VM 목록 새로고침 버튼을 클릭했을 때 VM 목록이 제대로 표시되는지 확인하는 테스트입니다.
    test('shows VM list when clicking the refresh button', async () => {
        const vmList = [
            {
                id: 1,
                vmName: 'Test VM 1',
                status: 'Running',
                startDate: '2023-01-01',
                endDate: '2023-12-31',
                spec: '4Core 8GB',
                os: 'Ubuntu 20.04',
                publicIp: '192.168.0.1',
            },
            {
                id: 2,
                vmName: 'Test VM 2',
                status: 'Stopped',
                startDate: '2023-02-01',
                endDate: '2023-11-30',
                spec: '2Core 4GB',
                os: 'CentOS 8',
                publicIp: '192.168.0.2',
            },
        ];

        mockedAxios.get.mockResolvedValueOnce({ data: vmList });

        render(
            <MemoryRouter>
                <VMListPage />
            </MemoryRouter>
        );

        fireEvent.click(screen.getByText('VM 목록 새로고침'));

        await waitFor(() => expect(screen.getByText('VM 이름: Test VM 1')).toBeInTheDocument());
        expect(screen.getByText('VM 상태: Running')).toBeInTheDocument();
        expect(screen.getByText('시작일: 2023-01-01')).toBeInTheDocument();
        expect(screen.getByText('종료일: 2023-12-31')).toBeInTheDocument();
        expect(screen.getByText('스펙: 4Core 8GB')).toBeInTheDocument();
        expect(screen.getByText('운영체제: Ubuntu 20.04')).toBeInTheDocument();
        expect(screen.getByText('Public IP: 192.168.0.1')).toBeInTheDocument();

        await waitFor(() => expect(screen.getByText('VM 이름: Test VM 2')).toBeInTheDocument());
        expect(screen.getByText('VM 상태: Stopped')).toBeInTheDocument();
        expect(screen.getByText('시작일: 2023-02-01')).toBeInTheDocument();
        expect(screen.getByText('종료일: 2023-11-30')).toBeInTheDocument();
        expect(screen.getByText('스펙: 2Core 4GB')).toBeInTheDocument();
        expect(screen.getByText('운영체제: CentOS 8')).toBeInTheDocument();
        expect(screen.getByText('Public IP: 192.168.0.2')).toBeInTheDocument();
    });

    // VM 신청 버튼을 클릭했을 때 /apply 페이지로 이동하는지 확인하는 테스트입니다.
    test('navigates to apply page when clicking the apply button', () => {
        render(
            <MemoryRouter initialEntries={['/vm']}>
                <Routes>
                    <Route path="/vm" element={<VMListPage />} />
                    <Route path="/apply" element={<Apply />} />
                </Routes>
            </MemoryRouter>
        );

        fireEvent.click(screen.getByText('VM 신청'));

        expect(screen.getByText('VM 신청')).toBeInTheDocument(); // Apply 페이지의 특정 텍스트를 확인
    });
});
