// src/routes/vm/VMList.test.tsx

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import axios from 'axios';
import VMListPage from './VMList';

// 모의 axios 설정
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('VMListPage Component', () => {
    test('VM 목록 조회', async () => {
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

        // 모의 axios 응답 설정
        mockedAxios.get.mockResolvedValueOnce({ data: vmList });

        render(<VMListPage />);

        // 각 VM 항목이 화면에 표시될 때까지 기다림
        for (const vm of vmList) {
            expect(await screen.findByText(`VM 이름: ${vm.vmName}`)).toBeInTheDocument();
            expect(await screen.findByText(`VM 상태: ${vm.status}`)).toBeInTheDocument();
            expect(await screen.findByText(`시작일: ${vm.startDate}`)).toBeInTheDocument();
            expect(await screen.findByText(`종료일: ${vm.endDate}`)).toBeInTheDocument();
            expect(await screen.findByText(`스펙: ${vm.spec}`)).toBeInTheDocument();
            expect(await screen.findByText(`운영체제: ${vm.os}`)).toBeInTheDocument();
            expect(await screen.findByText(`Public IP: ${vm.publicIp}`)).toBeInTheDocument();
        }
    });

    test('VM 신청 버튼 클릭 시 신청 페이지로 이동', () => {
        render(<VMListPage />);

        // VM 신청 버튼 클릭
        fireEvent.click(screen.getByText('VM 신청'));

        // 페이지 이동 확인
        expect(window.location.href).toContain('/apply');
    });
});
