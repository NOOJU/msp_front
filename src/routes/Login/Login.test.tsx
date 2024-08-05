import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom'; // Jest-dom 확장 추가
import axios from 'axios';
import { MemoryRouter } from 'react-router-dom';
import Login from './Login'; // Login 컴포넌트를 가져옵니다.

// 모의 Axios 설정
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Login Component', () => {
    it('renders Login component', () => {
        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );
        expect(screen.getByText('로그인')).toBeInTheDocument();
    });

    it('displays an error message for invalid phone number', () => {
        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );

        const phoneNumberInput = screen.getByPlaceholderText('휴대폰 번호를 입력하세요');
        const sendCodeButton = screen.getByText('본인인증하기');

        fireEvent.change(phoneNumberInput, { target: { value: '12345678' } });
        fireEvent.click(sendCodeButton);

        expect(screen.getByText('유효한 휴대폰 번호를 입력하세요.')).toBeInTheDocument();
    });

    it('sends verification code on valid phone number', async () => {
        mockedAxios.post.mockResolvedValue({ data: { message: 'SMS sent successfully' } });

        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );

        const phoneNumberInput = screen.getByPlaceholderText('휴대폰 번호를 입력하세요');
        const sendCodeButton = screen.getByText('본인인증하기');

        fireEvent.change(phoneNumberInput, { target: { value: '01012345678' } });
        fireEvent.click(sendCodeButton);

        await waitFor(() => expect(mockedAxios.post).toHaveBeenCalledTimes(1));
        expect(screen.getByText('인증번호가 전송되었습니다.')).toBeInTheDocument();
    });

    it('verifies code and navigates to home on success', async () => {
        mockedAxios.post.mockImplementation((url) => {
            if (url === 'http://127.0.0.1:8000/send_sms/') {
                return Promise.resolve({ data: { message: 'SMS sent successfully' } });
            }
            if (url === 'http://127.0.0.1:8000/verify_sms/') {
                return Promise.resolve({ data: { token: 'fake-jwt-token' } });
            }
            return Promise.reject(new Error('not found'));
        });

        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );

        const phoneNumberInput = screen.getByPlaceholderText('휴대폰 번호를 입력하세요');
        const sendCodeButton = screen.getByText('본인인증하기');

        fireEvent.change(phoneNumberInput, { target: { value: '01012345678' } });
        fireEvent.click(sendCodeButton);

        await waitFor(() => expect(mockedAxios.post).toHaveBeenCalledWith('http://127.0.0.1:8000/send_sms/', { phone_number: '01012345678' }));

        const verificationCodeInput = screen.getByPlaceholderText('인증번호를 입력하세요');
        const verifyCodeButton = screen.getByText('인증하기');

        fireEvent.change(verificationCodeInput, { target: { value: '123456' } });
        fireEvent.click(verifyCodeButton);

        await waitFor(() => expect(mockedAxios.post).toHaveBeenCalledWith('http://127.0.0.1:8000/verify_sms/', { phone_number: '01012345678', auth_code: '123456' }));
        expect(screen.getByText('인증에 성공했습니다.')).toBeInTheDocument();
    });

    it('displays error on verification code failure', async () => {
        mockedAxios.post.mockImplementation((url) => {
            if (url === 'http://127.0.0.1:8000/send_sms/') {
                return Promise.resolve({ data: { message: 'SMS sent successfully' } });
            }
            if (url === 'http://127.0.0.1:8000/verify_sms/') {
                return Promise.resolve({ data: {} });
            }
            return Promise.reject(new Error('not found'));
        });

        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );

        const phoneNumberInput = screen.getByPlaceholderText('휴대폰 번호를 입력하세요');
        const sendCodeButton = screen.getByText('본인인증하기');

        fireEvent.change(phoneNumberInput, { target: { value: '01012345678' } });
        fireEvent.click(sendCodeButton);

        await waitFor(() => expect(mockedAxios.post).toHaveBeenCalledWith('http://127.0.0.1:8000/send_sms/', { phone_number: '01012345678' }));

        const verificationCodeInput = screen.getByPlaceholderText('인증번호를 입력하세요');
        const verifyCodeButton = screen.getByText('인증하기');

        fireEvent.change(verificationCodeInput, { target: { value: '123456' } });
        fireEvent.click(verifyCodeButton);

        await waitFor(() => expect(mockedAxios.post).toHaveBeenCalledWith('http://127.0.0.1:8000/verify_sms/', { phone_number: '01012345678', auth_code: '123456' }));
        expect(screen.getByText('인증번호가 일치하지 않습니다.')).toBeInTheDocument();
    });
});
