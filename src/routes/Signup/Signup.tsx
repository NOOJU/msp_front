import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useRecoilState } from 'recoil';
import { LoginState } from '../../recoil/authAtom';
import { API_BASE_URL } from '../../config';  // config.ts 파일에서 API_BASE_URL 가져오기

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

const Signup: React.FC = () => {
    const location = useLocation(); // 현재 URL 정보를 가져오기 위한 훅
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useRecoilState(LoginState); // Recoil을 통한 로그인 상태 전역 관리

    // URL에서 쿼리 파라미터 추출
    const queryParams = new URLSearchParams(location.search);
    const phoneNumberFromUrl = queryParams.get('phone_number') || ''; // URL 쿼리에서 phone_number를 추출, 없으면 빈 문자열

    const [formData, setFormData] = useState({
        name: '',
        student_number: '',
        department: '',
        email: '',
        contact: phoneNumberFromUrl, // URL 파라미터로 받은 전화번호를 기본값으로 설정
    });

    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [validationErrors, setValidationErrors] = useState({
        email: '',
        contact: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // 이메일 유효성 검사 함수
    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email); // 정규식을 사용하여 이메일 유효성 검사
    };

    // 휴대폰 번호 유효성 검사 함수
    const validatePhoneNumber = (number: string) => {
        const phoneRegex = /^01[0-9]{8,9}$/; // 한국 휴대폰 번호 정규식
        return phoneRegex.test(number); // 정규식을 사용하여 번호 유효성 검사
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const isEmailValid = validateEmail(formData.email);
        const isPhoneValid = validatePhoneNumber(formData.contact);

        if (!isEmailValid || !isPhoneValid) {
            setValidationErrors({
                email: isEmailValid ? '' : '유효한 이메일 주소를 입력해주세요.',
                contact: isPhoneValid ? '' : '유효한 전화번호를 입력해주세요.',
            });
            return;
        }

        setValidationErrors({
            email: '',
            contact: '',
        });

        try {
            const response = await axios.post(`${API_BASE_URL}/signup/`, formData);
            setSuccess('회원가입에 성공했습니다!');
            setError(null);
            console.log('Form Data Submitted:', response.data);
            setIsLoggedIn(true); // 로그인 전역 상태 관리
            navigate('/main'); // 회원가입 성공 시 /main 경로로 이동
        } catch (error) {
            setError('회원가입에 실패했습니다. 다시 시도해 주세요.');
            setSuccess(null);
            console.error('There was an error submitting the form:', error);
        }
    };

    return (
        <Container>
            <Title>회원가입</Title>
            <form onSubmit={handleSubmit}>
                <FormGroup>
                    <Label htmlFor="name">이름</Label>
                    <Input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </FormGroup>
                <FormGroup>
                    <Label htmlFor="student_number">학번</Label>
                    <Input
                        type="text"
                        id="student_number"
                        name="student_number"
                        value={formData.student_number}
                        onChange={handleChange}
                        required
                    />
                </FormGroup>
                <FormGroup>
                    <Label htmlFor="department">학과</Label>
                    <Input
                        type="text"
                        id="department"
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        required
                    />
                </FormGroup>
                <FormGroup>
                    <Label htmlFor="email">이메일</Label>
                    <Input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    {validationErrors.email && <ErrorMessage>{validationErrors.email}</ErrorMessage>}
                </FormGroup>
                <FormGroup>
                    <Label htmlFor="contact">전화번호</Label>
                    <Input
                        type="tel"
                        id="contact"
                        name="contact"
                        value={formData.contact}
                        onChange={handleChange}
                        required
                    />
                    {validationErrors.contact && <ErrorMessage>{validationErrors.contact}</ErrorMessage>}
                </FormGroup>
                <Button type="submit">회원가입</Button>
                {error && <ErrorMessage>{error}</ErrorMessage>}
                {success && <ErrorMessage style={{ color: 'green' }}>{success}</ErrorMessage>}
            </form>
        </Container>
    );
};

export default Signup;
