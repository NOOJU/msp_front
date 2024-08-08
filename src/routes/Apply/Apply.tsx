import React, { useState } from 'react';
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

const Select = styled.select`
    width: 100%;
    padding: 0.5em;
    border: 1px solid #ced4da;
    border-radius: 4px;
`;

const TextArea = styled.textarea`
    width: 100%;
    padding: 0.5em;
    border: 1px solid #ced4da;
    border-radius: 4px;
`;

const CheckBox = styled.input`
    margin-right: 0.5em;
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

const Apply: React.FC = () => {
    const [formData, setFormData] = useState({
        vmName: '',
        image: 'ubuntu',
        instanceType: '1',
        volume: '',
        securityGroup: '',
        usage: '',
        additionalRequest: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/vm-apply', formData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            alert('신청이 성공적으로 제출되었습니다.');
        } catch (error) {
            console.error(error);
            alert('신청 제출에 실패했습니다.');
        }
    };

    return (
        <Container>
            <Title>VM 신청</Title>
            <form onSubmit={handleSubmit}>
                <FormGroup>
                    <Label>VM 이름</Label>
                    <Input type="text" name="vmName" value={formData.vmName} onChange={handleChange} required />
                </FormGroup>
                <FormGroup>
                    <Label>이미지</Label>
                    <Select name="image" value={formData.image} onChange={handleChange} required>
                        <option value="ubuntu">Ubuntu 20.04</option>
                        <option value="ubuntu">Ubuntu 22.04</option>
                        <option value="centos">CentOS 8</option>
                    </Select>
                </FormGroup>
                <FormGroup>
                    <Label>인스턴스 유형</Label>
                    <Select name="instanceType" value={formData.instanceType} onChange={handleChange} required>
                        <option value="1">2Core 4GB</option>
                        <option value="2">4Core 4GB</option>
                        <option value="3">4Core 8GB</option>
                    </Select>
                </FormGroup>
                <FormGroup>
                    <Label>볼륨</Label>
                    <Input type="text" name="volume" value={formData.volume} onChange={handleChange} required />
                </FormGroup>
                <FormGroup>
                    <Label>보안 그룹</Label>
                    <Input type="text" name="securityGroup" value={formData.securityGroup} onChange={handleChange} required />
                </FormGroup>
                <FormGroup>
                    <Label>사용 용도</Label>
                    <Input type="text" name="usage" value={formData.usage} onChange={handleChange} required />
                </FormGroup>
                <FormGroup>
                    <Label>기타 요청 사항</Label>
                    <TextArea name="additionalRequest" value={formData.additionalRequest} onChange={handleChange} />
                </FormGroup>
                <Button type="submit">제출</Button>
            </form>
        </Container>
    );
};

export default Apply;
