import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';

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

const Info = styled.div`
    margin-bottom: 1em;
    color: #495057;
`;

const UserInfo: React.FC = () => {
    const [userInfo, setUserInfo] = useState<any>(null); // 사용자 정보를 저장할 상태 변수
    const [error, setError] = useState<string | null>(null); // 에러 메시지를 저장할 상태 변수

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                // 사용자 정보를 가져오는 API 호출
                const response = await axios.get('http://localhost:8000/userinfo', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}` // 토큰을 헤더에 포함
                    }
                });
                setUserInfo(response.data); // API 응답 데이터를 상태에 저장
            } catch (error) {
                setError('사용자 정보를 가져오는데 실패했습니다.'); // 에러 발생 시 메시지 설정
            }
        };
        fetchUserInfo(); // 컴포넌트 마운트 시 API 호출
    }, []);

    if (error) {
        return <Container>{error}</Container>; // 에러 메시지를 표시
    }

    if (!userInfo) {
        return <Container>로딩 중...</Container>; // 로딩 중 메시지를 표시
    }

    return (
        <Container>
            <Title>사용자 정보</Title>
            <Info>이름: {userInfo.name}</Info>
            <Info>전화번호: {userInfo.phone}</Info>
            <Info>이메일: {userInfo.email}</Info>
            <Info>학번: {userInfo.studentId}</Info>
            <Info>학과: {userInfo.department}</Info>
        </Container>
    );
};

export default UserInfo;
