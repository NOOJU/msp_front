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
    color: ${props => (props.value === "" ? '#6c757d' : 'inherit')};
`;

const TextArea = styled.textarea`
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

    &:disabled {
        background-color: #6c757d;
        cursor: not-allowed;
    }
`;

const CheckBox = styled.input`
    margin-right: 0.5em;
    vertical-align: middle;
`;

const AgreementText = styled.div`
    margin-bottom: 1em;
    font-size: 0.85em;
    line-height: 1.5;
    color: #495057;
    text-align: left;
`;

const Apply: React.FC = () => {
    const [formData, setFormData] = useState({
        vmName: '',
        image: '',
        instanceType: '',
        volume: '',
        securityGroup: '',
        usage: '',
        additionalRequest: '',
    });

    const [agree, setAgree] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleAgree = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAgree(e.target.checked);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!agree) {
            alert('가상 머신 사용에 대한 모든 조건에 동의해야 합니다.');
            return;
        }
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
                        <option value="" disabled>옵션을 선택해 주세요</option>
                        <option value="ubuntu-20.04">Ubuntu 20.04</option>
                        <option value="ubuntu-22.04">Ubuntu 22.04</option>
                        <option value="centos-8">CentOS 8</option>
                    </Select>
                </FormGroup>
                <FormGroup>
                    <Label>인스턴스 유형</Label>
                    <Select name="instanceType" value={formData.instanceType} onChange={handleChange} required>
                        <option value="" disabled>옵션을 선택해 주세요</option>
                        <option value="2core-4gb">2Core 4GB</option>
                        <option value="4core-8gb">4Core 8GB</option>
                        <option value="4core-16gb">4Core 16GB</option>
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
                <AgreementText>
                    본 가상 머신 서비스는 삼육대학교 예산을 통해 제공되는 소중한 자산입니다. 사용자는 가상 머신을 목적에 부합하는 용도로만 사용하기로 동의합니다.<br />
                    가상 머신을 사용하는 동안, 다음과 같은 악의적인 용도로 사용하지 않기로 동의합니다.
                    <ul>
                        <li>무단으로 타인의 데이터에 접근하거나 유출하기</li>
                        <li>해킹, 바이러스 배포, 또는 기타 사이버 공격에 관여하기</li>
                        <li>불법적인 콘텐츠의 생성, 저장, 또는 배포하기</li>
                    </ul>
                    가상 머신을 사용하여 다음과 같은 개인적 이득을 취하는 용도로 사용하지 않기로 동의합니다.
                    <ul>
                        <li>상업적인 활동 또는 광고에 사용하기</li>
                    </ul>
                    가상 머신을 요청한 후 사용하지 않을 경우, 즉시 반납(삭제 요청)하기로 합니다.<br />
                    이러한 조건들은 삼육대학교의 자산을 책임감 있게 사용하고, 가상 머신 서비스의 지속 가능성을 보장하기 위해 필수적입니다. 사용자는 이 조건들에 동의함으로써, 가상 머신 서비스를 적절하고 효율적으로 사용할 책임이 있음을 인지합니다.
                </AgreementText>
                <FormGroup>
                    <CheckBox type="checkbox" checked={agree} onChange={handleAgree} />
                    <Label style={{ display: 'inline' }}>위의 모든 조건에 동의합니다.</Label>
                </FormGroup>
                <Button type="submit" disabled={!agree}>제출</Button>
            </form>
        </Container>
    );
};

export default Apply;
