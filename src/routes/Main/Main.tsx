// src/routes/Main/Main.tsx

import React, { useState } from 'react'; // React와 useState를 임포트
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

const UserInfo = styled.div`
    margin-top: 1em;
    text-align: left;
`;

const Main: React.FC = () => {
    const [userInfo, setUserInfo] = useState<any>(null); // userInfo 상태 정의, 초기값은 null

    // 사용자 정보를 가져오는 함수 정의
    const handleGetUserInfo = async () => {
        try {
            const token = localStorage.getItem('token'); // 로컬 스토리지에서 토큰 가져오기
            const response = await axios.get('http://localhost:8000/user-info', {
                headers: {
                    Authorization: `Bearer ${token}` // 토큰을 헤더에 포함하여 API 호출
                }
            });
            setUserInfo(response.data); // 가져온 사용자 정보를 상태에 저장
        } catch (error) {
            console.error(error); // 에러 콘솔 출력
            alert('사용자 정보를 가져오는 데 실패했습니다.'); // 사용자에게 알림
        }
    };

    return (
        <Container>
            <Title>메인 페이지</Title> {/* 메인 페이지 제목 */}
            <Button onClick={handleGetUserInfo}>사용자 정보 보기</Button> {/* 버튼 클릭 시 handleGetUserInfo 호출 */}
            {userInfo && ( // userInfo가 존재할 경우 사용자 정보 출력
                <UserInfo>
                    <p>전화번호: {userInfo.phoneNumber}</p>
                    <p>이름: {userInfo.name}</p>
                    <p>이메일: {userInfo.email}</p>
                </UserInfo>
            )}
            <Button onClick={() => window.location.href = '/vm'}>Virtual Machine</Button> {/* Virtual Machine 버튼 */}
        </Container>
    );
};

export default Main; // Main 컴포넌트 내보내기
