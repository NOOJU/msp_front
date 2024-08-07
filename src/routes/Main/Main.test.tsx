// src/routes/Main/Main.test.tsx

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import axios from 'axios';
import Main from './Main';

// 모의 axios 설정
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Main Component', () => {
    test('사용자 정보 조회', async () => {
        const userInfo = {
            phoneNumber: '01012345678',
            name: 'John Doe',
            email: 'john.doe@example.com',
        };

        // 모의 axios 응답 설정
        mockedAxios.get.mockResolvedValueOnce({ data: userInfo });

        render(<Main />);

        // 사용자 정보 보기 버튼 클릭
        fireEvent.click(screen.getByText('사용자 정보 보기'));

        // 사용자 정보가 화면에 표시될 때까지 기다림
        expect(await screen.findByText(`전화번호: ${userInfo.phoneNumber}`)).toBeInTheDocument();
        expect(await screen.findByText(`이름: ${userInfo.name}`)).toBeInTheDocument();
        expect(await screen.findByText(`이메일: ${userInfo.email}`)).toBeInTheDocument();
    });

    test('Virtual Machine 버튼 클릭 시 VM 목록 페이지로 이동', () => {
        render(<Main />);

        // Virtual Machine 버튼 클릭
        fireEvent.click(screen.getByText('Virtual Machine'));

        // 페이지 이동 확인
        expect(window.location.href).toContain('/vm');
    });
});
