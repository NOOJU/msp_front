import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';

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

const VMList: React.FC = () => {
    const [vmList, setVmList] = useState<any[]>([]); // VM 목록을 저장할 상태 변수
    const [error, setError] = useState<string | null>(null); // 에러 메시지를 저장할 상태 변수

    useEffect(() => {
        const fetchVMList = async () => {
            try {
                // VM 목록을 가져오는 API 호출
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

    if (error) {
        return <Container>{error}</Container>; // 에러 메시지를 표시
    }

    return (
        <Container>
            <Title>Virtual Machine 목록</Title>
            <Table>
                <thead>
                <tr>
                    <Th>VM 이름</Th>
                    <Th>상태</Th>
                    <Th>스펙</Th>
                    <Th>운영 체제</Th>
                    <Th>Public IP</Th> {/* Public IP 열 추가 */}
                    <Th>시작일</Th>
                    <Th>종료일</Th>
                </tr>
                </thead>
                <tbody>
                {vmList.map((vm) => (
                    <tr key={vm.id}>
                        <Td>{vm.name}</Td>
                        <Td>{vm.status}</Td>
                        <Td>{vm.spec}</Td>
                        <Td>{vm.os}</Td>
                        <Td>{vm.publicIp}</Td> {/* Public IP 데이터 표시 */}
                        <Td>{vm.startDate}</Td>
                        <Td>{vm.endDate}</Td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </Container>
    );
};

export default VMList;
