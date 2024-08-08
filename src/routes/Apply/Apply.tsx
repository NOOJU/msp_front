import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';

// 스타일 컴포넌트
const Container = styled.div`
    max-width: 800px;
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

const Error = styled.div`
    color: red;
    margin-top: 0.5em;
`;

// VM 신청 폼 컴포넌트
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
    const [vmNameError, setVmNameError] = useState<string | null>(null);

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

    const validateVmName = (name: string) => {
        const vmNameRegex = /^[a-zA-Z0-9-_]{1,239}$/;
        return vmNameRegex.test(name);
    };

    // 폼 제출 처리 함수
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!validateVmName(formData.vmName)) {
            setVmNameError('VM 이름은 알파벳 대소문자, 숫자, -, _ 만 포함해야 하며 1~239자 이내여야 합니다.');
            return;
        }

        try {
            // 백엔드로 폼 데이터 전송
            const response = await axios.post('http://localhost:8000/vm-apply', formData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}` // 로컬 스토리지에서 토큰을 가져와 헤더에 포함
                }
            });
            console.log(response.data); // 응답 데이터 콘솔 출력
            alert('신청이 성공적으로 제출되었습니다.'); // 사용자에게 알림
            setVmNameError(null); // 에러 메시지 초기화
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
                    <Label htmlFor="usage">사용 용도</Label>
                    <Input id="usage" type="text" name="usage" value={formData.usage} onChange={handleChange} required />
                </FormGroup>
                <FormGroup>
                    <Label htmlFor="startDate">시작일</Label>
                    <Input id="startDate" type="date" name="startDate" value={formData.startDate} onChange={handleChange} required />
                </FormGroup>
                <FormGroup>
                    <Label htmlFor="endDate">종료일</Label>
                    <Input id="endDate" type="date" name="endDate" value={formData.endDate} readOnly />
                </FormGroup>
                <FormGroup>
                    <Label htmlFor="vmName">VM 이름</Label>
                    <Input id="vmName" type="text" name="vmName" value={formData.vmName} onChange={handleChange} required />
                    {vmNameError && <Error>{vmNameError}</Error>}
                </FormGroup>
                <FormGroup>
                    <Label htmlFor="spec">스펙</Label>
                    <Select id="spec" name="spec" value={formData.spec} onChange={handleChange} required>
                        <option value="1">2Core 4GB</option>
                        <option value="2">4Core 4GB</option>
                        <option value="3">4Core 8GB</option>
                    </Select>
                </FormGroup>
                <FormGroup>
                    <Label htmlFor="os">운영 체제 (OS)</Label>
                    <Select id="os" name="os" value={formData.os} onChange={handleChange} required>
                        <option value="ubuntu">Ubuntu 20.04</option>
                        <option value="ubuntu">Ubuntu 22.04</option>
                        <option value="centos">CentOS 8</option>
                    </Select>
                </FormGroup>
                <FormGroup>
                    <Label htmlFor="volume">볼륨</Label>
                    <Input id="volume" type="text" name="volume" value={formData.volume} onChange={handleChange} required />
                </FormGroup>
                <FormGroup>
                    <Label htmlFor="securityGroup">시큐리티 그룹</Label>
                    <Input id="securityGroup" type="text" name="securityGroup" value={formData.securityGroup} onChange={handleChange} required />
                </FormGroup>
                <FormGroup>
                    <Label htmlFor="additionalRequest">기타 요청 사항</Label>
                    <TextArea id="additionalRequest" name="additionalRequest" value={formData.additionalRequest} onChange={handleChange} />
                </FormGroup>
                <FormGroup>
                    <CheckBox id="agreement" type="checkbox" name="agreement" checked={formData.agreement} onChange={handleChange} required />
                    <Label htmlFor="agreement">동의 여부</Label>
                </FormGroup>
                <Button type="submit">제출</Button>
            </form>
        </Container>
    );
};

export default Apply;
