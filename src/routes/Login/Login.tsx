import React, { useState, useEffect } from 'react'; // React와 useState를 임포트
import axios from 'axios'; // axios를 임포트
import { useNavigate } from 'react-router-dom'; // useNavigate를 임포트
import styled from 'styled-components'; // styled-components를 임포트

import MockAdapter from 'axios-mock-adapter'; // axios-mock-adapter 임포트

// 매직넘버 상수로 관리
const INITIAL_TIMER_SECONDS = 180;
const PHONE_NUMBER_LENGTH = 11;
const VERIFICATION_CODE_LENGTH = 6;

// 스타일 컴포넌트
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
    margin-top: 0.5em;
    margin-bottom: 1em;
`;

const Timer = styled.div`
    text-align: right;
    font-weight: bold;
    color: #007bff;
    margin-top: 0.5em;
    margin-bottom: 1em;
`;

// 타이머 훅 구현
function useTimer(initialSeconds: number) {
    const [timer, setTimer] = useState(initialSeconds);
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isActive) {
            interval = setInterval(() => {
                setTimer((prevTimer: number) => (prevTimer > 0 ? prevTimer - 1 : 0));
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isActive]);

    const resetTimer = () => {
        setTimer(initialSeconds);
        setIsActive(true);
    };

    const stopTimer = () => {
        setIsActive(false);
    };

    return { timer, resetTimer, stopTimer };
}

// Login 컴포넌트 정의
const Login: React.FC = () => {
    const [phoneNumber, setPhoneNumber] = useState(''); // phoneNumber 상태를 정의
    const [verificationCode, setVerificationCode] = useState(''); // verificationCode 상태를 정의
    const [isCodeSent, setIsCodeSent] = useState(false); // 인증번호 전송 여부를 나타내는 상태를 정의
    const [error, setError] = useState(''); // 에러 메시지를 나타내는 상태를 정의
    const [verificationStatus, setVerificationStatus] = useState({
        sent: false,
        verified: false,
        message: '',
    });
    const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate 훅 사용

    // 타이머 훅 사용
    const { timer, resetTimer, stopTimer } = useTimer(INITIAL_TIMER_SECONDS);

    // Mock Adapter 테스트 코드
    const mock = new MockAdapter(axios);
    mock.onPost('http://localhost:8000/send_sms/').reply(200, {
        message: '인증번호가 전송되었습니다.',
    });
    mock.onPost('http://localhost:8000/verify_sms/').reply(200, {
        token: 'mocked_token',
    });

    // 전화번호 입력 시 숫자만 입력하고, 하이픈을 추가하여 포맷
    const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const numbersOnly = e.target.value.replace(/\D/g, '');
        if (numbersOnly.length <= PHONE_NUMBER_LENGTH) {
            setPhoneNumber(numbersOnly);
        }
    };

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
            setError('유효한 휴대폰 번호를 입력하세요.');
            return;
        }

        setError('');
        try {
            const response = await axios.post('http://localhost:8000/send_sms/', { phone_number: phoneNumber });
            console.log(response.data);
            setIsCodeSent(true);
            setVerificationStatus({ ...verificationStatus, sent: true });
            resetTimer();
            alert('인증번호가 전송되었습니다.');
        } catch (error) {
            console.error(error);
            alert('인증번호 전송에 실패했습니다.');
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

            if (response.data.token) {
                setVerificationStatus({ sent: true, verified: true, message: '인증 성공' });
                stopTimer();
                localStorage.setItem('token', response.data.token);
                navigate('/main');
            } else {
                setVerificationStatus({ sent: true, verified: false, message: '인증번호가 잘못되었습니다.' });
            }
        } catch (error) {
            console.error(error);
            setVerificationStatus({ sent: true, verified: false, message: '인증번호 검증에 실패했습니다.' });
        }
    };

    const handleVerificationCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const numbersOnly = e.target.value.replace(/\D/g, '');
        if (numbersOnly.length <= VERIFICATION_CODE_LENGTH) {
            setVerificationCode(numbersOnly);
        }
    };

    return (
        <Container>
            <Title>로그인</Title>
            <FormGroup>
                <Label>휴대폰 번호</Label>
                <Input
                    type="text"
                    value={displayFormattedPhoneNumber(phoneNumber)}
                    onChange={handlePhoneNumberChange}
                    placeholder="휴대폰 번호를 입력하세요"
                    disabled={isCodeSent}
                />
                {error && <ErrorMessage>{error}</ErrorMessage>}
            </FormGroup>
            <Button onClick={handleSendCode}>
                {!verificationStatus.sent ? '본인인증하기' : '재전송'}
            </Button>
            {verificationStatus.sent && (
                <>
                    <Timer>{`남은 시간: ${Math.floor(timer / 60)}:${timer % 60 < 10 ? '0' : ''}${timer % 60}`}</Timer>
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