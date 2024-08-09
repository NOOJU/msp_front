import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

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
    height: 150px;
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

const ExtendRequest: React.FC = () => {
    const { vmName } = useParams<{ vmName: string }>(); // URL 파라미터에서 vmName 가져오기
    const [formData, setFormData] = useState({
        vmName: vmName || '', // URL 파라미터로 받은 vmName을 기본값으로 설정
        endDate: '',
        extensionReason: '',
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
            const response = await axios.post('http://localhost:8000/extend-request', formData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            alert('연장 요청이 성공적으로 제출되었습니다.');
        } catch (error) {
            console.error(error);
            alert('연장 요청 제출에 실패했습니다.');
        }
    };

    return (
        <Container>
            <Title>연장 요청</Title>
            <form onSubmit={handleSubmit}>
                <FormGroup>
                    <Label>VM 이름</Label>
                    <Input type="text" name="vmName" value={formData.vmName} onChange={handleChange} required />
                </FormGroup>
                <FormGroup>
                    <Label>연장 기간 기준</Label>
                    <p>최대 1개월 (연장 신청 가능, 연장 횟수는 신청 인원 수를 고려함)</p>
                </FormGroup>
                <FormGroup>
                    <Label>사용 종료일</Label>
                    <Input type="date" name="endDate" value={formData.endDate} onChange={handleChange} required />
                </FormGroup>
                <FormGroup>
                    <Label>연장 사유</Label>
                    <TextArea name="extensionReason" value={formData.extensionReason} onChange={handleChange} required />
                </FormGroup>
                <Button type="submit">제출</Button>
            </form>
        </Container>
    );
};

export default ExtendRequest;
