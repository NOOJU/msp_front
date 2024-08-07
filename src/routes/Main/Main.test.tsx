import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Main from './Main';
import VMListPage from '../vm/VMList';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

global.alert = jest.fn();

describe('Main Component', () => {
    test('renders Main component', () => {
        render(
            <MemoryRouter>
                <Main />
            </MemoryRouter>
        );

        expect(screen.getByText('메인 페이지')).toBeInTheDocument();
        expect(screen.getByText('사용자 정보 보기')).toBeInTheDocument();
        expect(screen.getByText('Virtual Machine')).toBeInTheDocument();
    });

    test('shows user info when clicking the button', async () => {
        const userInfo = {
            phoneNumber: '01012345678',
            name: 'John Doe',
            email: 'john.doe@example.com',
        };

        mockedAxios.get.mockResolvedValueOnce({ data: userInfo });

        render(
            <MemoryRouter>
                <Main />
            </MemoryRouter>
        );

        fireEvent.click(screen.getByText('사용자 정보 보기'));

        expect(await screen.findByText(`전화번호: ${userInfo.phoneNumber}`)).toBeInTheDocument();
        expect(await screen.findByText(`이름: ${userInfo.name}`)).toBeInTheDocument();
        expect(await screen.findByText(`이메일: ${userInfo.email}`)).toBeInTheDocument();
    });

    test('navigates to VM list page when clicking Virtual Machine button', () => {
        render(
            <MemoryRouter initialEntries={['/']}>
                <Routes>
                    <Route path="/" element={<Main />} />
                    <Route path="/vm" element={<VMListPage />} />
                </Routes>
            </MemoryRouter>
        );

        fireEvent.click(screen.getByText('Virtual Machine'));

        expect(screen.getByText('VM 목록')).toBeInTheDocument(); // VMListPage의 특정 텍스트 확인
    });
});
