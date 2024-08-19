// src/routes/Login/Login.tsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';
import {
    phoneNumberState,
    verificationCodeState,
    timerState,
    timerActiveState,
    verificationStatusState,
    INITIAL_TIMER_SECONDS,
    PHONE_NUMBER_LENGTH,
    VERIFICATION_CODE_LENGTH,
} from '../../state/recoilState';  // recoilState 경로를 올바르게 설정
import { useNavigate } from 'react-router-dom';

// 스타일 컴포넌트 정의
const Container = styled.div`
    max-width: 400px;
    margin: 2em auto;
    padding: 2em;
    background-color: #f8f9fa;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
    text-align: center;
    color: #343a40;
`;

const FormGroup = styled.div`
    margin-bottom: 1em;
`;

const Label = styled.label`
    display: block;
    margin-bottom: 0.5em;
    color: #495057;
`;

const Input = styled.input`
    width: 100%;
    padding: 0.5em;
    border: 1px solid #ced4da;
    border-radius: 4px;
`;

const Button = styled.button`
    width: 100%;
    padding: 0.75em;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
        background-color: #0056b3;
    }
`;

const ErrorMessage = styled.div`
    color: red;
    margin-top: -0.5em;
    margin-bottom: 1em;
`;

const Timer = styled.div`
    text-align: right;
    font-weight: bold;
    color: #007bff;
    margin-top: -1em;
    margin-bottom: 1em;
`;

// 타이머 로직을 처리하는 커스텀 훅
function useTimer() {
    const [timer, setTimer] = useRecoilState(timerState); // 타이머 상태를 Recoil로 관리
    const [isActive, setIsActive] = useRecoilState(timerActiveState); // 타이머 활성화 상태 관리

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isActive) {
            interval = setInterval(() => {
                setTimer((prevTimer) => (prevTimer > 0 ? prevTimer - 1 : 0)); // 타이머 감소
            }, 1000);
        }
        return () => clearInterval(interval); // 컴포넌트 언마운트 시 타이머 클리어
    }, [isActive, setTimer]);

    const resetTimer = () => {
        setTimer(INITIAL_TIMER_SECONDS); // 타이머를 초기값으로 리셋
        setIsActive(true); // 타이머 활성화
    };

    const stopTimer = () => {
        setIsActive(false); // 타이머 중지
    };

    return { timer, resetTimer, stopTimer };
}

// Login 컴포넌트 정의
const Login: React.FC = () => {
    const [phoneNumber, setPhoneNumber] = useRecoilState(phoneNumberState); // 전화번호 상태 관리
    const [verificationCode, setVerificationCode] = useRecoilState(verificationCodeState); // 인증번호 상태 관리
    const [verificationStatus, setVerificationStatus] = useRecoilState(verificationStatusState); // 인증 상태 관리
    const [error, setError] = useState(''); // 에러 메시지 상태 관리
    const navigate = useNavigate(); // 페이지 이동을 위한 훅 사용
    const { timer, resetTimer, stopTimer } = useTimer(); // 타이머 커스텀 훅 사용

    // 전화번호 입력 시 숫자만 입력하고, 하이픈을 추가하여 포맷
    const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const numbersOnly = e.target.value.replace(/\D/g, ''); // 숫자만 남기기
        if (numbersOnly.length <= PHONE_NUMBER_LENGTH) {
            setPhoneNumber(numbersOnly); // 상태 업데이트
        }
    };

    // 화면에 표시할 때 전화번호를 하이픈 포함한 형식으로 변환
    const displayFormattedPhoneNumber = (numbers: string) => {
        if (numbers.length <= 3) {
            return numbers;
        } else if (numbers.length <= 7) {
            return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
        } else {
            return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7)}`;
        }
    };

    // 인증번호 전송 함수
    const handleSendCode = async () => {
        if (phoneNumber.length !== PHONE_NUMBER_LENGTH) {
            setError('유효한 휴대폰 번호를 입력하세요.'); // 유효성 검사 실패 시 에러 메시지 설정
            return;
        }

        setError('');
        try {
            const response = await axios.post('http://localhost:8000/send_sms/', { phone_number: phoneNumber }); // 인증번호 전송 API 호출
            console.log(response.data);
            setVerificationStatus({ ...verificationStatus, sent: true }); // 인증번호 전송 상태 업데이트
            resetTimer(); // 타이머 리셋 및 시작
            alert('인증번호가 전송되었습니다.');
        } catch (error) {
            console.error(error);
            alert('인증번호 전송에 실패했습니다.'); // 에러 발생 시 알림
        }
    };

    // 인증번호 검증 함수
    const handleVerifyCode = async () => {
        if (verificationCode.length !== VERIFICATION_CODE_LENGTH) {
            setVerificationStatus({ sent: true, verified: false, message: '인증번호가 잘못되었습니다.' });
            return;
        }

        try {
            const response = await axios.post('http://localhost:8000/verify_sms/', {
                phone_number: phoneNumber,
                auth_code: verificationCode,
            });

            if (response.data.token) { // 인증 성공 시 백엔드에서 발급한 JWT 토큰을 로컬 스토리지에 저장
                setVerificationStatus({ sent: true, verified: true, message: '인증 성공' });
                stopTimer(); // 인증 성공 시 타이머 중지
                localStorage.setItem('token', response.data.token); // JWT를 로컬 스토리지에 저장
                navigate('/main'); // 인증 성공 시 메인 페이지로 이동
            } else {
                setVerificationStatus({ sent: true, verified: false, message: '인증번호가 잘못되었습니다.' });
            }
        } catch (error) {
            console.error(error);
            setVerificationStatus({ sent: true, verified: false, message: '인증번호 검증에 실패했습니다.' });
        }
    };

    // 인증번호 입력 시 숫자만 입력하고, 최대 6글자까지 제한
    const handleVerificationCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const numbersOnly = e.target.value.replace(/\D/g, ''); // 숫자만 남기기
        if (numbersOnly.length <= VERIFICATION_CODE_LENGTH) {
            setVerificationCode(numbersOnly); // 상태 업데이트
        }
    };

    return (
        <Container>
            <Title>로그인</Title>
            <FormGroup>
                <Label>휴대폰 번호</Label>
                <Input
                    type="text"
                    value={displayFormattedPhoneNumber(phoneNumber)} // 입력된 전화번호를 포맷하여 출력
                    onChange={handlePhoneNumberChange}
                    placeholder="휴대폰 번호를 입력하세요"
                    disabled={verificationStatus.sent} // 인증번호가 전송된 후에는 입력 비활성화
                />
                {error && <ErrorMessage>{error}</ErrorMessage>}
            </FormGroup>
            <Button onClick={handleSendCode}>
                {!verificationStatus.sent ? '본인인증하기' : '재전송'} {/* 인증번호 전송 상태에 따라 버튼 텍스트 변경 */}
            </Button>
            {verificationStatus.sent && (
                <>
                    <Timer>{`남은 시간: ${Math.floor(timer / 60)}:${timer % 60 < 10 ? '0' : ''}${timer % 60}`}</Timer> {/* 타이머 표시 */}
                    <FormGroup>
                        <Label>인증번호</Label>
                        <Input
                            type="text"
                            value={verificationCode}
                            onChange={handleVerificationCodeChange}
                            placeholder="인증번호를 입력하세요"
                        />
                    </FormGroup>
                    <Button onClick={handleVerifyCode}>
                        인증하기
                    </Button>
                    {verificationStatus.message && (
                        <ErrorMessage>{verificationStatus.message}</ErrorMessage>
                    )}
                </>
            )}
        </Container>
    );
};

export default Login; // Login 컴포넌트를 내보냅니다
