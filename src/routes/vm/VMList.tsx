// src/routes/vm/VMList.tsx

import React, { useEffect, useState } from 'react'; // React, useState, useEffect를 임포트
import axios from 'axios'; // axios를 임포트
import styled from 'styled-components'; // styled-components를 임포트

// 스타일 컴포넌트 정의
const Container = styled.div`
    max-width: 800px;
    margin: 2em auto;
    padding: 2em;
    background-color: #f8f9fa;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    text-align: center;
`;

const Title = styled.h1`
    color: #343a40;
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
    margin-bottom: 1em;

    &:hover {
        background-color: #0056b3;
    }
`;

const VMList = styled.div`
    margin-top: 2em;
`;

const VMItem = styled.div`
    border: 1px solid #ced4da;
    border-radius: 4px;
    padding: 1em;
    margin-bottom: 1em;
    text-align: left;
`;

const VMListPage: React.FC = () => {
    const [vmList, setVmList] = useState<any[]>([]); // vmList 상태 정의, 초기값은 빈 배열

    // VM 목록을 가져오는 함수 정의
    const handleGetVMList = async () => {
        try {
            const token = localStorage.getItem('token'); // 로컬 스토리지에서 토큰 가져오기
            const response = await axios.get('http://localhost:8000/vm-list', {
                headers: {
                    Authorization: `Bearer ${token}` // 토큰을 헤더에 포함하여 API 호출
                }
            });
            setVmList(response.data); // 가져온 VM 목록을 상태에 저장
        } catch (error) {
            console.error(error); // 에러 콘솔 출력
            alert('VM 목록을 가져오는 데 실패했습니다.'); // 사용자에게 알림
        }
    };

    // 페이지 로드 시 VM 목록을 자동으로 가져오기 위한 useEffect 훅
    useEffect(() => {
        handleGetVMList(); // 페이지 로드 시 handleGetVMList 함수 호출
    }, []);

    return (
        <Container>
            <Title>VM 목록</Title> {/* VM 목록 제목 */}
            <Button onClick={() => window.location.href = '/apply'}>VM 신청</Button> {/* VM 신청 버튼 */}
            <Button onClick={handleGetVMList}>VM 목록 새로고침</Button> {/* VM 목록 새로고침 버튼 */}
            <VMList>
                {vmList.map(vm => ( // vmList를 순회하며 VM 정보를 출력
                    <VMItem key={vm.id}>
                        <p>VM 이름: {vm.vmName}</p>
                        <p>VM 상태: {vm.status}</p>
                        <p>시작일: {vm.startDate}</p>
                        <p>종료일: {vm.endDate}</p>
                        <p>스펙: {vm.spec}</p>
                        <p>운영체제: {vm.os}</p>
                        <p>Public IP: {vm.publicIp}</p>
                    </VMItem>
                ))}
            </VMList>
        </Container>
    );
};

export default VMListPage; // VMListPage 컴포넌트 내보내기
