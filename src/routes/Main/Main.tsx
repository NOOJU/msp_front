import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Logout } from '../Auth/Logout'; // useLogout 훅을 임포트

const Container = styled.div`
    max-width: 400px;
    margin: 2em auto;
    padding: 2em;
    background-color: #f8f9fa;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    text-align: center;
`;

const Title = styled.h1`
    text-align: center;
    color: #343a40;
`;

const ButtonLink = styled(Link)`
    display: inline-block;
    width: 100%;
    margin-bottom: 1em;
    text-decoration: none;
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

    &:hover {
        background-color: #0056b3;
    }
`;

const LogoutButton = styled(Button)`
    background-color: #dc3545;

    &:hover {
        background-color: #c82333;
    }
`;

const Main: React.FC = () => {
    const logoutHandler = Logout(); // 로그아웃 핸들러 호출

    return (
        <Container>
            <Title>메인 페이지</Title>
            <ButtonLink to="/userinfo">
                <Button>사용자 정보</Button>
            </ButtonLink>
            <ButtonLink to="/listvm">
                <Button>Virtual Machine</Button>
            </ButtonLink>
            <LogoutButton onClick={logoutHandler}>
                로그아웃
            </LogoutButton>
        </Container>
    );
};

export default Main;
