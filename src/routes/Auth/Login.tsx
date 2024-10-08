import React, { useState, useEffect } from 'react'; // React와 useState를 임포트
import axios from 'axios'; // axios를 임포트
import { useNavigate } from 'react-router-dom'; // useNavigate를 임포트
import styled from 'styled-components'; // styled-components를 임포트
import { useRecoilState } from 'recoil';
import { LoginState, UserInfoState } from '../../recoil/authAtom';
import { API_BASE_URL } from '../../config';  // config.ts 파일에서 API_BASE_URL 가져오기
import { jwtDecode } from 'jwt-decode';

import MockAdapter from 'axios-mock-adapter'; // axios-mock-adapter 임포트

// 매직넘버 상수로 관리
const INITIAL_TIMER_SECONDS = 299; // 5분
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

const InfoText = styled.p`
    font-size: 0.85em;
    color: #6c757d;
    text-align: center;
    margin-top: 1.5em;
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

// Auth 컴포넌트 정의
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
    const [isLoggedIn, setIsLoggedIn] = useRecoilState(LoginState); // recoil을 통한 로그인 상태 전역 관리
    const [userInfo, setUserInfo] = useRecoilState(UserInfoState); // 사용자 정보 저장을 위한 Recoil 상태 추가
    const [isExpired, setIsExpired] = useState(false); // 인증 시간 만료 여부 상태

    // 타이머 훅 사용
    const { timer, resetTimer, stopTimer } = useTimer(INITIAL_TIMER_SECONDS);

    useEffect(() => {
        if (timer === 0) {
            setIsExpired(true); // 인증 시간 만료로 설정
            stopTimer(); // 타이머 정지
        }
    }, [timer]);


    // // MockAdapter 설정
    // const mock = new MockAdapter(axios);
    //
    // // Mock 데이터 설정: 인증번호 전송 응답
    // mock.onPost(`${API_BASE_URL}/send_sms/`).reply(200, {
    //     message: '인증번호가 전송되었습니다.',
    // });
    //
    // // Mock 데이터 설정: 인증번호 검증 응답
    // mock.onPost(`${API_BASE_URL}/verify_sms/`).reply(200, {
    //     access_token: 'mocked_token',
    //     message: 'Login successful'
    // });


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
        setIsExpired(false); // 재전송 시 만료 상태 초기화
        try {
            const response = await axios.post(`${API_BASE_URL}/send_sms/`, { phone_number: phoneNumber });
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
            const response = await axios.post(`${API_BASE_URL}/verify_sms/`, {
                phone_number: phoneNumber,
                auth_code: verificationCode,});

            // 코드 다듬기 필요!!
            if (response.data.message === "Verification successful, proceed to signup") {
                // 등록되지 않은 사용자라면 signup 페이지로 이동
                navigate(`/signup?phone_number=${phoneNumber}`);
            }

            if (response.data.access_token) {
                setVerificationStatus({ sent: true, verified: true, message: '인증 성공' });
                stopTimer();

                // JWT 토큰 디코딩
                const decodedToken: { sub: string; email: string } = jwtDecode(response.data.access_token);
                const { sub: student_number, email } = decodedToken; // 토큰에서 학번과 이메일 추출

                // 학번과 이메일 전역 상태 저장 (Recoil state)
                setUserInfo({
                    student_number: student_number, // 서버에서 받은 학번
                    email: email                    // 서버에서 받은 이메일
                });

                // 디버그용 콘솔 출력
                console.log('학번:', student_number);
                console.log('이메일:', email);

                // 토큰 로컬 스토리지에 저장
                localStorage.setItem('access_token', response.data.access_token);

                if (response.data.message === "Login successful") {
                    setIsLoggedIn(true);

                    // 등록된 사용자라면 main 페이지로 이동
                    navigate('/main');
                }
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
            <Title>휴대폰 번호로 로그인</Title>
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
                    {isExpired && <ErrorMessage>인증 시간이 만료되었습니다. 재전송해주세요.</ErrorMessage>}
                    <FormGroup>
                        <Label>인증번호</Label>
                        <Input
                            type="text"
                            value={verificationCode}
                            onChange={handleVerificationCodeChange}
                            placeholder="인증번호를 입력하세요"
                            disabled={isExpired} // 만료 시 입력 필드 비활성화
                        />
                    </FormGroup>
                    <Button onClick={handleVerifyCode} disabled={isExpired}>
                        인증하기
                    </Button>
                    {verificationStatus.message && (
                        <ErrorMessage>{verificationStatus.message}</ErrorMessage>
                    )}
                </>
            )}
            <InfoText>
                휴대폰 번호 인증 시 자동으로 회원가입 화면으로 넘어갑니다.
            </InfoText>
        </Container>
    );
};

export default Login; // Auth 컴포넌트를 내보냅니다