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

const TextArea = styled.textarea`
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
        usage: '',
        startDate: '',
        endDate: '',
        vmName: '',
        spec: '1',
        os: 'ubuntu',
        volume: '',
        securityGroup: '',
        agreement: false,
        additionalRequest: '',
    });

    // 입력 값 변경 처리 함수
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;

        if (type === 'checkbox' && e.target instanceof HTMLInputElement) {
            // 체크박스일 경우 체크 여부를 상태로 설정
            setFormData({
                ...formData,
                [name]: e.target.checked,
            });
        } else {
            // 입력 값 변경을 상태로 설정
            setFormData({
                ...formData,
                [name]: value,
            });

            if (name === 'startDate') {
                const startDate = new Date(value);
                const endDate = new Date(startDate);
                endDate.setDate(startDate.getDate() + 30); // 종료일을 시작일로부터 30일 후로 설정
                setFormData((prevState) => ({
                    ...prevState,
                    startDate: value,
                    endDate: endDate.toISOString().split('T')[0],
                }));
            }
        }
    };

    // 폼 제출 처리 함수
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            // 백엔드로 폼 데이터 전송
            const response = await axios.post('http://localhost:8000/vm-apply', formData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}` // 로컬 스토리지에서 토큰을 가져와 헤더에 포함
                }
            });
            console.log(response.data); // 응답 데이터 콘솔 출력
            alert('신청이 성공적으로 제출되었습니다.'); // 사용자에게 알림
        } catch (error) {
            console.error(error); // 에러 콘솔 출력
            alert('신청 제출에 실패했습니다.'); // 사용자에게 알림
        }
    };

    return (
        <Container>
            <Title>VM 신청</Title>
            <form onSubmit={handleSubmit}>
                <FormGroup>
                    <Label>사용 용도</Label>
                    <Input type="text" name="usage" value={formData.usage} onChange={handleChange} required />
                </FormGroup>
                <FormGroup>
                    <Label>시작일</Label>
                    <Input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required />
                </FormGroup>
                <FormGroup>
                    <Label>종료일</Label>
                    <Input type="date" name="endDate" value={formData.endDate} readOnly />
                </FormGroup>
                <FormGroup>
                    <Label>VM 이름</Label>
                    <Input type="text" name="vmName" value={formData.usage} onChange={handleChange} required />
                </FormGroup>
                <FormGroup>
                    <Label>스펙</Label>
                    <Select name="spec" value={formData.spec} onChange={handleChange} required>
                        <option value="1">2Core 4GB</option>
                        <option value="2">4Core 4GB</option>
                        <option value="3">4Core 8GB</option>
                    </Select>
                </FormGroup>
                <FormGroup>
                    <Label>운영 체제 (OS)</Label>
                    <Select name="os" value={formData.os} onChange={handleChange} required>
                        <option value="ubuntu">Ubuntu 20.04</option>
                        <option value="ubuntu">Ubuntu 22.04</option>
                        <option value="centos">CentOS 8</option>
                    </Select>
                </FormGroup>
                <FormGroup>
                    <Label>볼륨</Label>
                    <Input type="text" name="volume" value={formData.volume} onChange={handleChange} required />
                </FormGroup>
                <FormGroup>
                    <Label>시큐리티 그룹</Label>
                    <Input type="text" name="securityGroup" value={formData.securityGroup} onChange={handleChange} required />
                </FormGroup>
                <FormGroup>
                    <Label>기타 요청 사항</Label>
                    <TextArea name="additionalRequest" value={formData.additionalRequest} onChange={handleChange} />
                </FormGroup>
                <FormGroup>
                    <CheckBox type="checkbox" name="agreement" checked={formData.agreement} onChange={handleChange} required />
                    <Label>동의 여부</Label>
                </FormGroup>
                <Button type="submit">제출</Button>
            </form>
        </Container>
    );
};

export default Apply;
