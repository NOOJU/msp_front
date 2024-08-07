import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

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
    const [vmList, setVmList] = useState<any[]>([]);
    const navigate = useNavigate();

    const handleGetVMList = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:8000/vm-list', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log('Response:', response); // 응답 객체 출력
            if (response && response.data) {
                console.log('Data:', response.data); // 데이터 출력
                setVmList(response.data);
            } else {
                console.error('No data found in response');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('VM 목록을 가져오는 데 실패했습니다.');
        }
    };

    useEffect(() => {
        handleGetVMList();
    }, []);

    return (
        <Container>
            <Title>VM 목록</Title> {/* 페이지 제목 */}
            <Button onClick={() => navigate('/apply')}>VM 신청</Button> {/* VM 신청 페이지로 이동하는 버튼 */}
            <Button onClick={handleGetVMList}>VM 목록 새로고침</Button> {/* VM 목록을 새로고침하는 버튼 */}
            <VMList>
                {vmList.map(vm => (
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

export default VMListPage;
