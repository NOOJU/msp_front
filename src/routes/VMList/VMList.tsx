import React, { useEffect, useState } from 'react'; // React와 훅 임포트
import axios from 'axios'; // axios 임포트 (현재는 사용되지 않지만, 실제 API 사용 시 필요)
import styled from 'styled-components'; // styled-components 임포트
import dayjs from 'dayjs'; // dayjs 임포트하여 날짜 비교에 사용

// 스타일 컴포넌트 정의
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

// VMList 컴포넌트 정의
const VMList: React.FC = () => {
    const [vmList, setVmList] = useState<any[]>([]); // VM 목록을 저장할 상태 변수
    const [error, setError] = useState<string | null>(null); // 에러 메시지를 저장할 상태 변수

    // 실제 API 호출을 사용하는 경우
    useEffect(() => {
        const fetchVMList = async () => {
            try {
                const response = await axios.get('http://localhost:8000/vmlist', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}` // 토큰을 헤더에 포함
                    }
                });
                setVmList(response.data); // API 응답 데이터를 상태에 저장
            } catch (error) {
                setError('VM 목록을 가져오는데 실패했습니다.'); // 에러 발생 시 메시지 설정
            }
        };
        fetchVMList(); // 컴포넌트 마운트 시 API 호출
    }, []);

    // 예시 VM 데이터 주석 처리
    // const [vmList, setVmList] = useState<any[]>([
    //     {
    //         id: '1',
    //         name: 'Example VM 1',
    //         status: 'Running',
    //         spec: '2Core 4GB',
    //         os: 'Ubuntu 20.04',
    //         publicIp: '192.168.0.1',
    //         startDate: '2023-08-01',
    //         endDate: '2023-08-15' // 종료일 예시
    //     },
    //     {
    //         id: '2',
    //         name: 'Example VM 2',
    //         status: 'Stopped',
    //         spec: '4Core 8GB',
    //         os: 'CentOS 8',
    //         publicIp: '192.168.0.2',
    //         startDate: '2023-07-20',
    //         endDate: '2023-08-20' // 종료일 예시
    //     }
    // ]);

    // 연장 요청 처리 함수
    const handleExtendRequest = (vmId: string) => {
        alert(`VM ID ${vmId}에 대한 연장 요청이 처리되었습니다.`);
    };

    // 삭제 요청 처리 함수
    const handleDeleteRequest = (vmId: string) => {
        alert(`VM ID ${vmId}에 대한 삭제 요청이 처리되었습니다.`);
    };

    // 버튼 비활성화 여부를 결정하는 함수
    const isButtonDisabled = (endDate: string) => {
        const today = dayjs(); // 현재 날짜
        const end = dayjs(endDate); // 종료일
        return end.diff(today, 'day') > 7; // 종료일이 일주일 이상 남았는지 확인
    };

    if (error) {
        return <Container>{error}</Container>; // 에러 메시지를 표시
    }

    return (
        <Container>
            <Title>Virtual Machine 목록</Title>
            <Table>
                <thead>
                <tr>
                    <Th>VM 이름</Th><Th>상태</Th><Th>유형</Th><Th>이미지</Th><Th>Public IP</Th><Th>시작일</Th><Th>종료일</Th><Th>연장 요청</Th><Th>삭제 요청</Th>
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
                                onClick={() => handleExtendRequest(vm.id)} // 연장 요청 버튼 클릭 시 호출
                                disabled={isButtonDisabled(vm.endDate)} // 종료일이 일주일 이상 남았는지 확인하여 버튼 비활성화 여부 결정
                            >
                                연장 요청
                            </Button>
                        </Td>
                        <Td>
                            <Button
                                onClick={() => handleDeleteRequest(vm.id)} // 삭제 요청 버튼 클릭 시 호출
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

export default VMList;
