import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import { MemoryRouter } from 'react-router-dom';
import Login from '../Login/Login';

// axios 모듈을 모킹합니다.
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// window.alert를 모킹합니다.
global.alert = jest.fn();

describe('Login Component', () => {
    // 로그인 컴포넌트를 렌더링하고 기본 요소들이 존재하는지 확인하는 테스트입니다.
    test('renders Login component', () => {
        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );

        // "로그인" 텍스트와 휴대폰 번호 입력 필드가 렌더링되는지 확인합니다.
        expect(screen.getByText('로그인')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('휴대폰 번호를 입력하세요')).toBeInTheDocument();
    });

    // 유효하지 않은 휴대폰 번호를 입력했을 때 에러 메시지가 표시되는지 확인하는 테스트입니다.
    test('shows error message for invalid phone number', () => {
        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );

        const input = screen.getByPlaceholderText('휴대폰 번호를 입력하세요');
        fireEvent.change(input, { target: { value: '12345678' } }); // 유효하지 않은 번호 입력
        const button = screen.getByText('본인인증하기');
        fireEvent.click(button); // 본인인증하기 버튼 클릭

        // 에러 메시지가 표시되는지 확인합니다.
        expect(screen.getByText('유효한 휴대폰 번호를 입력하세요.')).toBeInTheDocument();
    });

    // 유효한 휴대폰 번호를 입력했을 때 인증번호 전송이 성공적으로 이루어지는지 확인하는 테스트입니다.
    test('sends verification code for valid phone number', async () => {
        mockedAxios.post.mockResolvedValueOnce({ data: {} }); // axios POST 요청 모킹

        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );

        const input = screen.getByPlaceholderText('휴대폰 번호를 입력하세요');
        fireEvent.change(input, { target: { value: '01012345678' } }); // 유효한 번호 입력
        const button = screen.getByText('본인인증하기');
        fireEvent.click(button); // 본인인증하기 버튼 클릭

        // 인증번호 전송 API가 호출되었는지 확인합니다.
        await waitFor(() => expect(mockedAxios.post).toHaveBeenCalledWith('http://localhost:8000/send_sms/', { phone_number: '01012345678' }));

        // 인증번호 입력 필드가 렌더링되는지 확인합니다.
        expect(screen.getByPlaceholderText('인증번호를 입력하세요')).toBeInTheDocument();

        // 모킹된 alert가 호출되었는지 확인합니다.
        expect(global.alert).toHaveBeenCalledWith('인증번호가 전송되었습니다.');
    });

    // 인증번호 검증이 성공적으로 이루어지고 홈 페이지로 이동하는지 확인하는 테스트입니다.
    test('verifies code and navigates to home', async () => {
        mockedAxios.post.mockResolvedValueOnce({ data: {} }); // 인증번호 전송 API 모킹
        mockedAxios.post.mockResolvedValueOnce({ data: { token: 'test-token' } }); // 인증번호 검증 API 모킹

        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );

        const phoneInput = screen.getByPlaceholderText('휴대폰 번호를 입력하세요');
        fireEvent.change(phoneInput, { target: { value: '01012345678' } }); // 유효한 번호 입력
        const sendCodeButton = screen.getByText('본인인증하기');
        fireEvent.click(sendCodeButton); // 본인인증하기 버튼 클릭

        // 인증번호 전송 API가 호출되었는지 확인합니다.
        await waitFor(() => expect(mockedAxios.post).toHaveBeenCalledWith('http://localhost:8000/send_sms/', { phone_number: '01012345678' }));

        const codeInput = screen.getByPlaceholderText('인증번호를 입력하세요');
        fireEvent.change(codeInput, { target: { value: '123456' } }); // 인증번호 입력
        const verifyButton = screen.getByText('인증하기');
        fireEvent.click(verifyButton); // 인증하기 버튼 클릭

        // 인증번호 검증 API가 호출되었는지 확인합니다.
        await waitFor(() => expect(mockedAxios.post).toHaveBeenCalledWith('http://localhost:8000/verify_sms/', { phone_number: '01012345678', auth_code: '123456' }));

        // 로컬 스토리지에 토큰이 저장되었는지 확인합니다.
        expect(localStorage.getItem('token')).toBe('test-token');

        // 모킹된 alert가 호출되었는지 확인합니다.
        expect(global.alert).toHaveBeenCalledWith('인증에 성공했습니다.');
    });

    // 유효하지 않은 인증번호를 입력했을 때 에러 메시지가 표시되는지 확인하는 테스트입니다.
    test('shows error message for invalid verification code', async () => {
        mockedAxios.post.mockResolvedValueOnce({ data: {} }); // 인증번호 전송 API 모킹
        mockedAxios.post.mockResolvedValueOnce({ data: {} }); // 인증번호 검증 API 모킹 (유효하지 않은 코드)

        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );

        const phoneInput = screen.getByPlaceholderText('휴대폰 번호를 입력하세요');
        fireEvent.change(phoneInput, { target: { value: '01012345678' } }); // 유효한 번호 입력
        const sendCodeButton = screen.getByText('본인인증하기');
        fireEvent.click(sendCodeButton); // 본인인증하기 버튼 클릭

        // 인증번호 전송 API가 호출되었는지 확인합니다.
        await waitFor(() => expect(mockedAxios.post).toHaveBeenCalledWith('http://localhost:8000/send_sms/', { phone_number: '01012345678' }));

        const codeInput = screen.getByPlaceholderText('인증번호를 입력하세요');
        fireEvent.change(codeInput, { target: { value: '123456' } }); // 유효하지 않은 인증번호 입력
        const verifyButton = screen.getByText('인증하기');
        fireEvent.click(verifyButton); // 인증하기 버튼 클릭

        // 인증번호 검증 API가 호출되었는지 확인합니다.
        await waitFor(() => expect(mockedAxios.post).toHaveBeenCalledWith('http://localhost:8000/verify_sms/', { phone_number: '01012345678', auth_code: '123456' }));

        // 에러 메시지가 표시되는지 확인합니다.
        expect(global.alert).toHaveBeenCalledWith('인증번호가 일치하지 않습니다.');
    });
});