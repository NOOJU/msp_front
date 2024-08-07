// src/routes/Login/Login.tsx

import React, { useState } from 'react'; // React와 useState를 임포트
import axios from 'axios'; // axios를 임포트
import { useNavigate } from 'react-router-dom'; // useNavigate를 임포트
import styled from 'styled-components'; // styled-components를 임포트

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

// Login 컴포넌트 정의
const Login: React.FC = () => {
    const [phoneNumber, setPhoneNumber] = useState(''); // phoneNumber 상태를 정의
    const [verificationCode, setVerificationCode] = useState(''); // verificationCode 상태를 정의
    const [isCodeSent, setIsCodeSent] = useState(false); // 인증번호 전송 여부를 나타내는 상태를 정의
    const [error, setError] = useState(''); // 에러 메시지를 나타내는 상태를 정의
    const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate 훅 사용

    // 휴대폰 번호 유효성 검사 함수
    const validatePhoneNumber = (number: string) => {
        const phoneRegex = /^01[0-9]{8,9}$/; // 한국 휴대폰 번호 정규식
        return phoneRegex.test(number); // 정규식을 사용하여 번호 유효성 검사
    };

    // 인증번호 전송 함수
    const handleSendCode = async () => {
        if (!validatePhoneNumber(phoneNumber)) { // 휴대폰 번호 유효성 검사
            setError('유효한 휴대폰 번호를 입력하세요.'); // 유효하지 않으면 에러 메시지 설정
            return; // 함수 종료
        }

        setError(''); // 에러 메시지 초기화

        try {
            // 인증번호 전송 API 호출
            const response = await axios.post('http://localhost:8000/send_sms/', { phone_number: phoneNumber });
            console.log(response.data); // 응답 데이터 콘솔 출력
            setIsCodeSent(true); // 인증번호 전송 여부 상태 설정
            alert('인증번호가 전송되었습니다.'); // 사용자에게 알림
        } catch (error) {
            console.error(error); // 에러 콘솔 출력
            alert('인증번호 전송에 실패했습니다.'); // 사용자에게 알림
        }
    };

    // 인증번호 검증 함수
    const handleVerifyCode = async () => {
        try {
            // 인증번호 검증 API 호출
            const response = await axios.post('http://localhost:8000/verify_sms/', { phone_number: phoneNumber, auth_code: verificationCode });
            if (response.data.token) { // 인증 성공 여부 확인
                alert('인증에 성공했습니다.'); // 사용자에게 알림
                localStorage.setItem('token', response.data.token); // 토큰을 로컬 스토리지에 저장
                navigate('/main'); // 메인 페이지로 이동
            } else {
                alert('인증번호가 일치하지 않습니다.'); // 사용자에게 알림
            }
        } catch (error) {
            console.error(error); // 에러 콘솔 출력
            alert('인증번호 검증에 실패했습니다.'); // 사용자에게 알림
        }
    };

    return (
        <Container> {/* 컨테이너 스타일 적용 */}
            <Title>로그인</Title> {/* 제목 스타일 적용 */}
            <FormGroup> {/* 폼 그룹 스타일 적용 */}
                <Label>휴대폰 번호</Label> {/* 라벨 스타일 적용 */}
                <Input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)} // 입력 값 변경 시 상태 업데이트
                    placeholder="휴대폰 번호를 입력하세요"
                    disabled={isCodeSent} // 인증번호 전송 후 입력 비활성화
                />
                {/* 에러 메시지 표시 */}
                {error && <ErrorMessage>{error}</ErrorMessage>}
            </FormGroup>
            {isCodeSent && ( // 인증번호가 전송된 경우
                <FormGroup>
                    <Label>인증번호</Label>
                    <Input
                        type="text"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)} // 입력 값 변경 시 상태 업데이트
                        placeholder="인증번호를 입력하세요"
                    />
                </FormGroup>
            )}
            <Button onClick={isCodeSent ? handleVerifyCode : handleSendCode}>
                {isCodeSent ? '인증하기' : '본인인증하기'} {/* 버튼 텍스트 조건에 따라 변경 */}
            </Button>
        </Container>
    );
};

export default Login; // Login 컴포넌트를 내보냅니다
