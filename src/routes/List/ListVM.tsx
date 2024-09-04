import React, { useEffect, useState } from 'react'; // React와 훅 임포트
import axios from 'axios'; // axios 임포트 (현재는 사용되지 않지만, 실제 API 사용 시 필요)
import styled from 'styled-components'; // styled-components 임포트
import dayjs from 'dayjs'; // dayjs 임포트하여 날짜 비교에 사용
import { Link, useNavigate } from 'react-router-dom'; // Link 컴포넌트 임포트
import { API_BASE_URL } from '../../config';  // config.ts 파일에서 API_BASE_URL 가져오기
// const jwt_decode = require('jwt-decode');  // require 방식으로 가져오기

import MockAdapter from 'axios-mock-adapter'; // axios-mock-adapter 임포트

// 스타일 컴포넌트 정의
const Container = styled.div`
    max-width: 900px;
    margin: 2em auto;
    padding: 2em;
    background-color: #f8f9fa;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    position: relative;
`;

const ButtonContainer = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 0.5em;
    margin-bottom: 1em;
`;

const Title = styled.h1`
    text-align: center;
    color: #343a40;
`;

const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
    margin-top: 2em;
`;

const Th = styled.th`
    background-color: #007bff;
    color: white;
    padding: 0.75em;
    border: 1px solid #dee2e6;
`;

const Td = styled.td`
    padding: 0.75em;
    border: 1px solid #dee2e6;
    text-align: center;
`;

const Button = styled.button`
    padding: 0.5em 1em;
    margin: 0 0.5em;
    background-color: ${props => props.disabled ? '#6c757d' : '#007bff'};
    color: white;
    border: none;
    border-radius: 4px;
    cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
    transition: background-color 0.2s;

    &:hover {
        background-color: ${props => props.disabled ? '#6c757d' : '#0056b3'};
    }
`;

const CreateButton = styled(Link)`
    padding: 0.5em 1em;
    background-color: #28a745;
    color: white;
    text-decoration: none;
    border-radius: 4px;
    transition: background-color 0.2s;

    &:hover {
        background-color: #218838;
    }
`;


// JWT 디코딩 함수
function parseJwt(token: string) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map(function (c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                })
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('Invalid token format', error);
        return null;
    }
}

// List 컴포넌트 정의
const ListVM: React.FC = () => {
    const [vmList, setVmList] = useState<any[]>([]); // VM 목록을 저장할 상태 변수
    const [error, setError] = useState<string | null>(null); // 에러 메시지를 저장할 상태 변수
    const navigate = useNavigate();

    // Mock Adapter 테스트 코드
    // const mock = new MockAdapter(axios);
    // const mockData = [
    //     { id: '1', name: 'Web1', status: '완료', spec: '2core-4gb', os: 'Ubuntu 20.04', publicIp: '192.168.0.1', startDate: '2024-07-07', endDate: '2024-08-12' },
    //     { id: '2', name: 'Web2', status: '대기', spec: '4core-8gb', os: 'Ubuntu 22.04', publicIp: '192.168.0.2', startDate: '2024-02-01', endDate: '2024-08-31' },
    // ];
    // mock.onGet(`${API_BASE_URL}/vmlist`).reply(200, mockData);

    // 실제 API 호출을 사용하는 경우
    useEffect(() => {
        const fetchVMList = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const decodedToken = parseJwt(token);  // JWT 직접 디코딩
                    console.log('Decoded Token:', decodedToken);  // 콘솔에 디코딩된 토큰 출력

                    if (decodedToken) {
                        const studentNumber = decodedToken.sub;  // 학번 추출
                        console.log('Student Number:', studentNumber);  // 학번 출력

                        const response = await axios.get(`${API_BASE_URL}/user_instances/${studentNumber}`, {
                            headers: {
                                'Authorization': `Bearer ${token}`
                            }
                        });

                        console.log('VM List Response:', response.data);  // API 응답 데이터 출력
                        setVmList(response.data);
                    } else {
                        setError('유효하지 않은 토큰입니다.');
                    }
                } else {
                    setError('로그인이 필요합니다.');
                }
            } catch (error) {
                setError('VM 목록을 가져오는데 실패했습니다.');
                alert(error);
            }
        };
        fetchVMList();
    }, []);


    // 연장 요청 처리 함수
    const handleExtendRequest = (vmName: string) => {
        navigate(`/extendrequest/${vmName}`);
        // alert(`${vmName}에 대한 연장 요청이 처리되었습니다.`);
    };

    // 삭제 요청 처리 함수
    const handleDeleteRequest = (vmName: string) => {
        //삭제 로직 구현 필요!!
        alert(`${vmName}에 대한 삭제 요청이 처리되었습니다.`);
    };

    // 버튼 비활성화 여부를 결정하는 함수
    const isButtonDisabled = (endDate: string) => {
        const today = dayjs(); // 현재 날짜
        const end = dayjs(endDate); // 종료일
        return end.diff(today, 'day') > 7; // 종료일이 일주일 이상 남았는지 확인
    };

    // if (error) {
    //     return <Container>{error}</Container>; // 에러 메시지를 표시
    // }

    return (
        <Container>
            <Title>Virtual Machine 목록</Title>
            <ButtonContainer>
                <CreateButton to="/apply">VM 생성 요청</CreateButton>
                <CreateButton to="/supportrequest">기타 요청 사항</CreateButton>
            </ButtonContainer>
            <Table>
                <thead>
                <tr>
                    <Th>VM 이름</Th><Th>status</Th><Th>Spec</Th><Th>Image</Th><Th>Public IP</Th><Th>시작일</Th><Th>종료일</Th><Th>연장
                    요청</Th><Th>삭제 요청</Th>
                </tr>
                </thead>
                <tbody>
                {vmList.map((vm) => (
                    <tr key={vm.id}>
                        <Td>{vm.name}</Td>
                        <Td>{vm.status}</Td>
                        <Td>{vm.spec}</Td>
                        <Td>{vm.os}</Td>
                        <Td>{vm.publicIp}</Td>
                        <Td>{vm.startDate}</Td>
                        <Td>{vm.endDate}</Td>
                        <Td>
                            <Button
                                onClick={() => handleExtendRequest(vm.name)} // 연장 요청 버튼 클릭 시 호출
                                disabled={isButtonDisabled(vm.endDate)} // 종료일이 일주일 이상 남았는지 확인하여 버튼 비활성화 여부 결정
                            >
                                연장 요청
                            </Button>
                        </Td>
                        <Td>
                            <Button
                                onClick={() => handleDeleteRequest(vm.name)} // 삭제 요청 버튼 클릭 시 호출
                                disabled={isButtonDisabled(vm.endDate)} // 종료일이 일주일 이상 남았는지 확인하여 버튼 비활성화 여부 결정
                            >
                                삭제 요청
                            </Button>
                        </Td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </Container>
    );
};

export default ListVM;
