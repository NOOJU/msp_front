import React, { useEffect, useState } from 'react'; // React와 훅 임포트
import axios from 'axios'; // axios 임포트 (현재는 사용되지 않지만, 실제 API 사용 시 필요)
import styled from 'styled-components'; // styled-components 임포트
import dayjs from 'dayjs'; // dayjs 임포트하여 날짜 비교에 사용
import { Link, useNavigate } from 'react-router-dom'; // Link 컴포넌트 임포트
import { API_BASE_URL } from '../../config';  // config.ts 파일에서 API_BASE_URL 가져오기

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

// List 컴포넌트 정의
const ListVM: React.FC = () => {
    const [vmList, setVmList] = useState<any[]>([]); // VM 목록을 저장할 상태 변수
    const [error, setError] = useState<string | null>(null); // 에러 메시지를 저장할 상태 변수
    const navigate = useNavigate();

    // // Mock Adapter 테스트 코드
    // const mock = new MockAdapter(axios);
    // const mockData = [
    //     { instance_name: 'Web1', status: '완료', flavor_name: '2core-4gb', image_name: 'Ubuntu 20.04', floating_ip: '192.168.0.1', start_date: '2024-07-07', end_date: '2024-08-12' },
    //     { instance_name: 'Web2', status: '대기', flavor_name: '4core-8gb', image_name: 'Ubuntu 22.04', floating_ip: '192.168.0.2', start_date: '2024-02-01', end_date: '2024-08-31' },
    // ];
    // mock.onGet(`${API_BASE_URL}/user_instances`).reply(200, mockData);


    // 실제 API 호출을 사용하는 경우
    useEffect(() => {
        const fetchVMList = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/user_instances`, {  // 학번 디코딩 및 삽입 구현 필요
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}` // 토큰을 헤더에 포함
                    }
                });
                console.log(response);
                setVmList(response.data); // API 응답 데이터를 상태에 저장
            } catch (error) {
                setError('VM 목록을 가져오는데 실패했습니다.'); // 에러 발생 시 메시지 설정
                alert('VM 목록을 가져오는데 실패했습니다.');
            }
        };
        fetchVMList(); // 컴포넌트 마운트 시 API 호출
    }, []);

    // 연장 요청 처리 함수
    const handleExtendRequest = (instance_name: string) => {
        navigate(`/extendrequest?instance_name=${instance_name}`);
        // alert(`${instance_name}에 대한 연장 요청이 처리되었습니다.`);
    };

    // 삭제 요청 처리 함수
    const handleDeleteRequest = (instance_name: string) => {
        //삭제 로직 구현 필요!!
        alert(`${instance_name}에 대한 삭제 요청이 처리되었습니다.`);
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
            <Title>가상 머신 목록</Title>
            <ButtonContainer>
                <CreateButton to="/apply">VM 생성 요청</CreateButton>
                <CreateButton to="/supportrequest">기타 요청</CreateButton>
            </ButtonContainer>
            <Table>
                <thead>
                <tr>
                    <Th>이름</Th><Th>Status</Th><Th>Spec</Th><Th>Image</Th><Th>Public IP</Th><Th>시작일</Th><Th>종료일</Th><Th>연장
                </Th><Th>삭제</Th>
                </tr>
                </thead>
                <tbody>
                {vmList.map((vm, index) => (
                    <tr key={index}>
                        <Td>{vm.instance_name}</Td>
                        <Td>{vm.status}</Td>
                        <Td>{vm.flavor_name}</Td>
                        <Td>{vm.image_name}</Td>
                        <Td>{vm.floating_ip}</Td>
                        <Td>{vm.start_date}</Td>
                        <Td>{vm.end_date}</Td>
                        <Td>
                            <Button
                                onClick={() => handleExtendRequest(vm.instance_name)} // 연장 요청 버튼 클릭 시 호출
                                disabled={isButtonDisabled(vm.endDate)} // 종료일이 일주일 이상 남았는지 확인하여 버튼 비활성화 여부 결정
                            >
                                연장 요청
                            </Button>
                        </Td>
                        <Td>
                            <Button
                                onClick={() => handleDeleteRequest(vm.instance_name)} // 삭제 요청 버튼 클릭 시 호출
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