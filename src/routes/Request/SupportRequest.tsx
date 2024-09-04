import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { API_BASE_URL2 } from '../../config';  // config.ts 파일에서 API_BASE_URL 가져오기

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

const TextArea = styled.textarea`
    width: 100%;
    padding: 0.75em;
    border: 1px solid #ced4da;
    border-radius: 4px;
    height: 150px; /* Increased height for more space */
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

    &:disabled {
        background-color: #6c757d;
        cursor: not-allowed;
    }
`;

const SupportRequest: React.FC = () => {
    const [formData, setFormData] = useState({
        vmName: '',
        request: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${API_BASE_URL2}/support-request`, formData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            alert('지원 요청이 성공적으로 제출되었습니다.');
        } catch (error) {
            console.error(error);
            alert('지원 요청 제출에 실패했습니다.');
        }
    };

    return (
        <Container>
            <Title>기타 요청 사항</Title>
            <form onSubmit={handleSubmit}>
                <FormGroup>
                    <Label>VM 이름</Label>
                    <Input type="text" name="vmName" value={formData.vmName} onChange={handleChange} required />
                </FormGroup>
                <FormGroup>
                    <Label>요청 사항</Label>
                    <TextArea name="request" value={formData.request} onChange={handleChange} required />
                </FormGroup>
                <Button type="submit">제출</Button>
            </form>
        </Container>
    );
};

export default SupportRequest;
