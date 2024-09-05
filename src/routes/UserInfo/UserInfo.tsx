import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { API_BASE_URL } from '../../config';  // config.ts 파일에서 API_BASE_URL 가져오기

import MockAdapter from 'axios-mock-adapter'; // axios-mock-adapter 임포트

// 스타일 컴포넌트
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

const InfoTable = styled.table`
    width: 100%;
    border-collapse: collapse;
`;

const TableRow = styled.tr`
    border-bottom: 1px solid #dee2e6;
`;

const TableCell = styled.td`
    padding: 0.75em;
    color: #495057;
    text-align: left;
`;

const TableHeader = styled.th`
    padding: 0.75em;
    text-align: left;
    color: #343a40;
    background-color: #e9ecef;
`;

const UserInfo: React.FC = () => {
    const [userInfo, setUserInfo] = useState<any>(null); // 사용자 정보를 저장할 상태 변수
    const [error, setError] = useState<string | null>(null); // 에러 메시지를 저장할 상태 변수

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                // 사용자 정보를 가져오는 API 호출
                const response = await axios.get(`${API_BASE_URL}/user_info`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}` // 토큰을 헤더에 포함
                    }
                });
                console.log(response);
                setUserInfo(response.data); // API 응답 데이터를 상태에 저장
            } catch (error) {
                console.error('Error fetching user info:', error); // 에러 로그 출력
                setError('사용자 정보를 가져오는데 실패했습니다.'); // 에러 발생 시 메시지 설정
            }
        };
        fetchUserInfo(); // 컴포넌트 마운트 시 API 호출
    }, []); // 빈 배열을 디펜던시로 추가하여 최초 마운트 시에만 실행

    if (error) {
        return (
            <Container>
                {error}
            </Container>
        );
    }

    if (!userInfo) {
        return <Container>로딩 중...</Container>; // 로딩 중 메시지를 표시
    }

    return (
        <Container>
            <Title>사용자 정보</Title>
            <InfoTable>
                <tbody>
                <TableRow>
                    <TableHeader>이름</TableHeader>
                    <TableCell>{userInfo.name}</TableCell>
                </TableRow>
                <TableRow>
                    <TableHeader>전화번호</TableHeader>
                    <TableCell>{userInfo.contact}</TableCell>
                </TableRow>
                <TableRow>
                    <TableHeader>이메일</TableHeader>
                    <TableCell>{userInfo.email}</TableCell>
                </TableRow>
                <TableRow>
                    <TableHeader>학번</TableHeader>
                    <TableCell>{userInfo.student_number}</TableCell>
                </TableRow>
                <TableRow>
                    <TableHeader>학과</TableHeader>
                    <TableCell>{userInfo.department}</TableCell>
                </TableRow>
                </tbody>
            </InfoTable>
        </Container>
    );
};

export default UserInfo;