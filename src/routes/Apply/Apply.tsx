import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom'; // useNavigate를 임포트
import { useRecoilValue } from 'recoil'; // Recoil에서 값을 불러오기 위해 사용
import { LoginState, UserInfoState } from '../../recoil/authAtom'; // Recoil에서 학번과 이메일 상태를 가져옴
import { botClient } from '../../api/apiClient';  // botClient를 가져옴 (axios 대신)
// import axios from 'axios';
// import {API_BASE_URL2} from '../../config';  // config.ts 파일에서 API_BASE_URL 가져오기


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

// Input 컴포넌트에 isValid 속성을 추가하여 유효성 검사를 반영한 스타일링 적용
const Input = styled.input<{ isValid?: boolean }>`
    width: 100%;
    padding: 0.5em;
    border: 1px solid ${props => props.isValid !== false ? '#ced4da' : 'red'};
    border-radius: 4px;
`;

// Input 컴포넌트에 기본값을 설정하여 isValid 속성이 전달되지 않아도 기본값으로 true가 설정되도록 함
Input.defaultProps = {
    isValid: true,
};

const Select = styled.select<{ isValid?: boolean }>`
    width: 100%;
    padding: 0.5em;
    border: 1px solid ${props => props.isValid !== false ? '#ced4da' : 'red'};
    border-radius: 4px;
`;

const TextArea = styled.textarea<{ isValid?: boolean }>`
    width: 100%;
    padding: 0.5em;
    border: 1px solid ${props => props.isValid !== false ? '#ced4da' : 'red'};
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

// 에러 메시지를 표시하기 위한 컴포넌트
const ErrorMessage = styled.div`
    color: red;
    margin-top: 0.5em;
    font-size: 0.875em;
`;


const Apply: React.FC = () => {
    const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate 훅 사용
    // Recoil에서 학번과 이메일 값을 가져옴
    const { student_number, email } = useRecoilValue(UserInfoState);

    const [formData, setFormData] = useState({
        usage: '',
        applyReason: '',
        vmName: '',
        vmimage: '',
        vmSpec: '',
        vmVolume: '',
        inboundRule: '',
        outboundRule: '',
        additionalRequest: '',
    });

    const [agree, setAgree] = useState(false);
    const [errors, setErrors] = useState({
        usage: '',
        applyReason: '',
        vmName: '',
        vmimage: '',
        vmSpec: '',
        vmVolume: '',
        inboundRule: '',
        outboundRule: '',
        additionalRequest: '',
    });

    // 필드 이름을 사용자에게 친숙한 이름으로 매핑하는 객체
    const fieldNames: { [key: string]: string } = {
        usage: '사용 목적',
        applyReason: '사용 목적 설명',
        vmName: 'VM 이름',
        vmimage: '운영체제',
        vmSpec: '스펙',
        vmVolume: '볼륨',
        inboundRule: '인바운드 규칙',
        outboundRule: '아웃바운드 규칙',
        additionalRequest: '기타 요청 사항',
    };


    // 입력 변경 시 호출되는 함수로, 유효성 검사를 포함함
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        // 필수 입력 필드에 대한 유효성 검사
        let error = '';
        if (value.trim() === '') {
            error = `${fieldNames[name]}을 입력해주세요.`;
        }

        // VM 이름 유효성 검사 로직
        if (name === 'vmName') {
            const vmNameRegex = /^[a-zA-Z0-9-_]{1,52}$/;

            // 영문, 숫자, 하이픈(-), 언더바(_) 이외의 문자가 입력된 경우 에러 메시지 설정
            if (!vmNameRegex.test(value)) {
                error = '영문, 숫자, 하이픈(-), 언더바(_)만 입력 가능(1~52자)';
            }

            // 첫 글자가 하이픈(-) 또는 언더바(_)인 경우 에러 메시지 설정
            if (/^[\-_]/.test(value)) {
                error = '첫 글자는 하이픈(-)과 언더바(_)를 사용할 수 없습니다.';
            }

            // 마지막 글자가 하이픈(-) 또는 언더바(_)인 경우 에러 메시지 설정
            if (/[\-_]$/.test(value)) {
                error = '마지막 글자는 하이픈(-)과 언더바(_)를 사용할 수 없습니다.';
            }
        }

        // 에러 상태 업데이트
        setErrors(prevErrors => ({
            ...prevErrors,
            [name]: error,
        }));

        // 입력된 값 업데이트
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    // 동의 체크박스 변경 시 호출되는 함수
    const handleAgree = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAgree(e.target.checked);
    };

    // 폼 제출 시 호출되는 함수
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // 동의하지 않은 경우 경고 메시지 출력
        if (!agree) {
            alert('가상 머신 사용에 대한 모든 조건에 동의해야 합니다.');
            return;
        }

        // 필수 필드에 값이 입력되었는지 확인하고 에러 메시지 설정
        const newErrors = { ...errors };
        let hasError = false;

        // 필수 필드만 유효성 검사 (additionalRequest 제외)
        const requiredFields = ['usage', 'applyReason', 'vmName', 'vmimage', 'vmSpec', 'vmVolume', 'inboundRule', 'outboundRule'];

        requiredFields.forEach((key) => {
            if (formData[key as keyof typeof formData].trim() === '') {
                newErrors[key as keyof typeof errors] = `${fieldNames[key]}을 입력해주세요.`;
                hasError = true;
            }
        });

        // 유효성 검사에 실패하거나 필드가 비어 있는 경우 제출 방지
        if (hasError) {
            setErrors(newErrors);
            return;
        }

        try {

            // Recoil에서 가져온 student_number와 email을 formData에 추가
            const extendedFormData = {
                ...formData,
                student_number, // 학번
                email,          // 이메일
            };

            // 서버에 폼 데이터 전송
            const response = await botClient.post(`/make_pr`, extendedFormData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                }
            });

            if (response.status === 200) {
                alert('제출 완료되었습니다.');
                navigate('/listvm')

            } else {
                throw new Error('서버 응답 오류');
            }
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
                    <Label>사용 목적</Label>
                    <Select name="usage" value={formData.usage} onChange={handleChange} isValid={errors.usage === ''}>
                        <option value="" disabled>옵션을 선택해 주세요</option>
                        <option value="Development">개인 프로젝트</option>
                        <option value="Team">팀 프로젝트</option>
                        <option value="School">학교 수업</option>
                        <option value="research">연구 </option>
                    </Select>
                    {errors.usage && <ErrorMessage>{errors.usage}</ErrorMessage>}
                </FormGroup>
                <FormGroup>
                    <Label>사용 목적 설명 (자세하게 작성)</Label>
                    <TextArea name="applyReason" value={formData.applyReason} onChange={handleChange} isValid={errors.applyReason === ''} />
                    {errors.applyReason && <ErrorMessage>{errors.applyReason}</ErrorMessage>}
                </FormGroup>
                <FormGroup>
                    <Label>VM 이름</Label>
                    <Input
                        type="text"
                        name="vmName"
                        value={formData.vmName}
                        onChange={handleChange}
                        isValid={errors.vmName === ''}
                    />
                    {errors.vmName && <ErrorMessage>{errors.vmName}</ErrorMessage>}
                </FormGroup>
                <FormGroup>
                    <Label>스펙</Label>
                    <Select name="vmSpec" value={formData.vmSpec} onChange={handleChange} isValid={errors.vmSpec === ''}>
                        <option value="" disabled>옵션을 선택해 주세요</option>
                        <option value="m2a.large">2 vCPU, 8GiB memory (m2a.large)</option>
                        <option value="m2a.xlarge">4 vCPU, 16GiB memory (m2a.xlarge)</option>
                        {/*<option value="over-spec">상위 스펙은 검토 후 제공</option>*/}
                    </Select>
                    {errors.vmSpec && <ErrorMessage>{errors.vmSpec}</ErrorMessage>}
                </FormGroup>
                <FormGroup>
                    <Label>볼륨</Label>
                    <Select name="vmVolume" value={formData.vmVolume} onChange={handleChange} isValid={errors.vmVolume === ''}>
                        <option value="" disabled>옵션을 선택해 주세요</option>
                        <option value="30">SSD 30GB</option>
                        <option value="50">SSD 50GB</option>
                    </Select>
                    {errors.vmVolume && <ErrorMessage>{errors.vmVolume}</ErrorMessage>}
                </FormGroup>
                <FormGroup>
                    <Label>운영체제</Label>
                    <Select name="vmimage" value={formData.vmimage} onChange={handleChange}
                            isValid={errors.vmimage === ''}>
                        <option value="" disabled>옵션을 선택해 주세요</option>
                        <option value="CentOS Stream 9">CentOS 9</option>
                        <option value="Ubuntu 20.04">Ubuntu 20.04</option>
                        <option value="Ubuntu 22.04">Ubuntu 22.04</option>
                        <option value="Ubuntu 24.04">Ubuntu 24.04</option>
                    </Select>
                    {errors.vmimage && <ErrorMessage>{errors.vmimage}</ErrorMessage>}
                </FormGroup>
                <FormGroup>
                    <Label>인바운드 규칙</Label>
                    <Input type="text" name="inboundRule" value={formData.inboundRule} placeholder={"ex) 22:tcp:0.0.0.0/0, 80:tcp:0.0.0.0/0"} onChange={handleChange} isValid={errors.inboundRule === ''} />
                    {errors.inboundRule && <ErrorMessage>{errors.inboundRule}</ErrorMessage>}
                </FormGroup>
                <FormGroup>
                    <Label>아웃바운드 규칙 </Label>
                    <Input type="text" name="outboundRule" value={formData.outboundRule} placeholder={"ex) ALL:0.0.0.0/0"} onChange={handleChange} isValid={errors.outboundRule === ''} />
                    {errors.outboundRule && <ErrorMessage>{errors.outboundRule}</ErrorMessage>}
                </FormGroup>
                <FormGroup>
                    <Label>기타 요청 사항</Label>
                    <TextArea name="additionalRequest" value={formData.additionalRequest} onChange={handleChange} isValid={errors.additionalRequest === ''}/>
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
