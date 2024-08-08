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
    // 폼 데이터 상태를 관리합니다. 각 필드의 초기값 설정
    const [formData, setFormData] = useState({
        usage: '',
        vmName: '',
        spec: '1',
        os: 'ubuntu',
        volume: '',
        securityGroup: '',
        agreement: false,
        additionalRequest: '',
    });

    // 입력 값 변경 이벤트를 처리합니다.
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;

        // 입력 요소가 HTMLInputElement이며, type이 'checkbox'인 경우에만 checked 속성을 사용합니다.
        if (e.target instanceof HTMLInputElement && type === 'checkbox') {
            const { checked } = e.target;  // 타입 안정성을 확보하며 checked 속성에 접근
            setFormData(prevState => ({
                ...prevState,
                [name]: checked,
            }));
        } else {
            // 체크박스가 아닌 요소의 값을 업데이트합니다.
            setFormData(prevState => ({
                ...prevState,
                [name]: value,
            }));
        }
    };


    // 폼 제출 이벤트를 처리합니다.
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // 폼 제출에 따른 페이지 새로고침 방지
        try {
            // 서버로 폼 데이터를 전송하고 응답을 처리합니다.
            const response = await axios.post('http://localhost:8000/vm-apply', formData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}` // 헤더에 인증 토큰 추가
                }
            });
            alert('신청이 성공적으로 제출되었습니다.'); // 사용자에게 성공 알림
        } catch (error) {
            console.error(error); // 에러 콘솔에 출력
            alert('신청 제출에 실패했습니다.'); // 사용자에게 실패 알림
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
                    <Label>VM 이름</Label>
                    <Input type="text" name="vmName" value={formData.vmName} onChange={handleChange} required />
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
