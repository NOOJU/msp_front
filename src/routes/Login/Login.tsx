import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

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

const Login: React.FC = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [isCodeSent, setIsCodeSent] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const validatePhoneNumber = (number: string) => {
        const phoneRegex = /^01[0-9]{8,9}$/;
        return phoneRegex.test(number);
    };

    const handleSendCode = async () => {
        if (!validatePhoneNumber(phoneNumber)) {
            setError('유효한 휴대폰 번호를 입력하세요.');
            return;
        }

        setError('');

        try {
            const response = await axios.post('http://127.0.0.1:8000/send_sms/', { phone_number: phoneNumber });
            console.log(response.data);
            setIsCodeSent(true);
            alert('인증번호가 전송되었습니다.');
        } catch (error) {
            console.error('Error details:', error);
            if (axios.isAxiosError(error)) {
                console.error('Axios error:', error.message);
                if (error.response) {
                    console.error('Response data:', error.response.data);
                    console.error('Response status:', error.response.status);
                    console.error('Response headers:', error.response.headers);
                } else if (error.request) {
                    console.error('Request:', error.request);
                } else {
                    console.error('Error message:', error.message);
                }
            } else {
                console.error('Unexpected error:', error);
            }
            alert('인증번호 전송에 실패했습니다.');
        }
    };

    const handleVerifyCode = async () => {
        try {
            const response = await axios.post('http://127.0.0.1:8000/verify_sms/', { phone_number: phoneNumber, auth_code: verificationCode });
            if (response.data.token) {
                alert('인증에 성공했습니다.');
                navigate('/home');
            } else {
                alert('인증번호가 일치하지 않습니다.');
            }
        } catch (error) {
            console.error('Error details:', error);
            if (axios.isAxiosError(error)) {
                console.error('Axios error:', error.message);
                if (error.response) {
                    console.error('Response data:', error.response.data);
                    console.error('Response status:', error.response.status);
                    console.error('Response headers:', error.response.headers);
                } else if (error.request) {
                    console.error('Request:', error.request);
                } else {
                    console.error('Error message:', error.message);
                }
            } else {
                console.error('Unexpected error:', error);
            }
            alert('인증번호 검증에 실패했습니다.');
        }
    };

    return (
        <Container>
            <Title>로그인</Title>
            <FormGroup>
                <Label>휴대폰 번호</Label>
                <Input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="휴대폰 번호를 입력하세요"
                    disabled={isCodeSent}
                />
                {error && <ErrorMessage>{error}</ErrorMessage>}
            </FormGroup>
            {isCodeSent && (
                <FormGroup>
                    <Label>인증번호</Label>
                    <Input
                        type="text"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        placeholder="인증번호를 입력하세요"
                    />
                </FormGroup>
            )}
            <Button onClick={isCodeSent ? handleVerifyCode : handleSendCode}>
                {isCodeSent ? '인증하기' : '본인인증하기'}
            </Button>
        </Container>
    );
};

export default Login;
