import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

// 스타일 컴포넌트
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

const Home: React.FC = () => (
    <Container>
        <Title>삼육대학교 <br/> 가상머신 사용 신청</Title>
        <ButtonLink to="/login">
            <Button>시작하기</Button>
        </ButtonLink>
    </Container>
);

export default Home;
