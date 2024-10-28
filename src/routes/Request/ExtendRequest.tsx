import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // useLocation으로 쿼리 파라미터 가져오기
import { useRecoilValue } from 'recoil'; // Recoil에서 값을 불러오기 위해 사용
import { UserInfoState } from '../../recoil/authAtom'; // Recoil에서 학번과 이메일 상태를 가져옴
import { styled, keyframes } from 'styled-components';
import { botClient } from "../../api/botClient";
// import axios from 'axios';
// import { API_BASE_URL2 } from '../../config';  // config.ts 파일에서 API_BASE_URL 가져오기

// 로딩 스피너 애니메이션 추가
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

const Spinner = styled.div`
  border: 8px solid #f3f3f3;
  border-top: 8px solid #007bff;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  animation: ${spin} 1s linear infinite;
`;



// 스타일 컴포넌트 정의
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

const FixedInstanceName = styled.div`
    padding: 0.5em;
    background-color: #e9ecef;
    border: 1px solid #ced4da;
    border-radius: 4px;
    color: #495057;
`;

// URL 쿼리 파라미터를 파싱하는 함수
const useQuery = () => {
    return new URLSearchParams(useLocation().search);
};

// ExtendRequest 컴포넌트 정의
const ExtendRequest: React.FC = () => {
    const navigate = useNavigate();
    const query = useQuery(); // 쿼리 파라미터를 가져옴
    const instanceNameFromQuery = query.get('instance_name'); // instance_name 파라미터 가져오기
    const { student_number, email } = useRecoilValue(UserInfoState);  // Recoil에서 학번과 이메일 값을 가져옴
    const [isLoading, setIsLoading] = useState(false); // 로딩 상태 추가


    const [formData, setFormData] = useState({
        instance_name: instanceNameFromQuery || '', // 쿼리 파라미터로 받은 instance_name을 기본값으로 설정
        endDate: '',
        extensionReason: '',
        studentNumber: '',
    });

    // student_number 값이 변경되면 formData를 업데이트
    useEffect(() => {
        if (student_number) {
            setFormData((prevState) => ({
                ...prevState,
                studentNumber: student_number,  // Recoil에서 가져온 student_number를 업데이트
            }));
        }
    }, [student_number]);

    // 쿼리 파라미터로 받은 instance_name을 상태에 반영
    useEffect(() => {
        setFormData(prevState => ({
            ...prevState,
            instance_name: instanceNameFromQuery || '', // instance_name이 없으면 빈 문자열 사용
        }));
    }, [instanceNameFromQuery]);

    // 입력 필드 변경 처리 함수
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    // 폼 제출 처리 함수
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true); // 로딩 상태 시작
        try {
            const response = await botClient.post(`/extend_pr`, formData);
            alert('연장 요청이 성공적으로 제출되었습니다.');
            navigate('/listvm')
        } catch (error) {
            console.error(error);
            alert('연장 요청 제출에 실패했습니다.');
        } finally {
            setIsLoading(false); // 로딩 상태 종료
        }
    };

    return (
        <Container>
            <Title>연장 요청</Title>
            <form onSubmit={handleSubmit}>
                <FormGroup>
                    <Label>VM 이름</Label>
                    <FixedInstanceName>{formData.instance_name}</FixedInstanceName>
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

            {/* 로딩 중일 때 스피너 표시 */}
            {isLoading && (
                <LoadingOverlay>
                    <Spinner />
                </LoadingOverlay>
            )}

        </Container>
    );
};

export default ExtendRequest;
