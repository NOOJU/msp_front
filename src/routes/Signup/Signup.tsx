import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

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
    margin-top: -0.5em;
    margin-bottom: 1em;
`;

const Signup: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        studentId: '',
        department: '',
        email: '',
        phone: '',
    });

    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [validationErrors, setValidationErrors] = useState({
        email: '',
        phone: '',
    });

    const navigate = useNavigate();

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
        const isPhoneValid = validatePhoneNumber(formData.phone);

        if (!isEmailValid || !isPhoneValid) {
            setValidationErrors({
                email: isEmailValid ? '' : '유효한 이메일 주소를 입력해주세요.',
                phone: isPhoneValid ? '' : '유효한 전화번호를 입력해주세요.',
            });
            return;
        }

        setValidationErrors({
            email: '',
            phone: '',
        });

        try {
            const response = await axios.post('https://your-backend-api.com/signup', formData);
            setSuccess('회원가입에 성공했습니다!');
            setError(null);
            console.log('Form Data Submitted:', response.data);
            navigate('/Home'); // 회원가입 성공 시 /Home 경로로 이동
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
                    <Label htmlFor="name">이름:</Label>
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
                    <Label htmlFor="studentId">학번:</Label>
                    <Input
                        type="text"
                        id="studentId"
                        name="studentId"
                        value={formData.studentId}
                        onChange={handleChange}
                        required
                    />
                </FormGroup>
                <FormGroup>
                    <Label htmlFor="department">학과:</Label>
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
                    <Label htmlFor="email">이메일:</Label>
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
                    <Label htmlFor="phone">전화번호:</Label>
                    <Input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                    />
                    {validationErrors.phone && <ErrorMessage>{validationErrors.phone}</ErrorMessage>}
                </FormGroup>
                <Button type="submit">회원가입</Button>
                {error && <ErrorMessage>{error}</ErrorMessage>}
                {success && <ErrorMessage style={{ color: 'green' }}>{success}</ErrorMessage>}
            </form>
        </Container>
    );
};

export default Signup;
