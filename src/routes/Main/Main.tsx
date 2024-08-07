import React, { useState } from 'react';
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

const UserInfo = styled.div`
    margin-top: 2em;
    text-align: left;
`;

const Main: React.FC = () => {
    const [userInfo, setUserInfo] = useState<any>(null);
    const navigate = useNavigate();

    const handleGetUserInfo = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:8000/user-info', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.data) {
                setUserInfo(response.data);
            } else {
                console.error('No data found in response');
            }
        } catch (error) {
            console.error(error);
            alert('사용자 정보를 가져오는 데 실패했습니다.');
        }
    };

    return (
        <Container>
            <Title>메인 페이지</Title>
            <Button onClick={handleGetUserInfo}>사용자 정보 보기</Button>
            {userInfo && (
                <UserInfo>
                    <p>전화번호: {userInfo.phoneNumber}</p>
                    <p>이름: {userInfo.name}</p>
                    <p>이메일: {userInfo.email}</p>
                </UserInfo>
            )}
            <Button onClick={() => navigate('/vm')}>Virtual Machine</Button>
        </Container>
    );
};

export default Main;
