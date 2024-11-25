import styled from "styled-components";

export const LoginPadgeMainStlyed = styled.section`
    width: 100%;
    height: ${({ theme }) => (theme.isPc ? "calc(100vh - 70px)" : "calc(100vh - 115px)")};
    background-color: ${({ theme }) => (theme.isPc ? ({ theme }) => theme.palette.BgColor : "white")};

    /* 중앙, 모바일 전체 */
    & > section {
        background-color: white;
        max-width: ${({ theme }) => (theme.isPc ? "1080px" : "100%")};
        max-height: ${({ theme }) => (theme.isPc ? "650px" : "100%")};
        width: ${({ theme }) => (theme.isPc ? "60%" : "100%")};
        height: ${({ theme }) => (theme.isPc ? "70%" : "100%")};
        border-radius: ${({ theme }) => (theme.isPc ? "25px" : "0")};
        position: relative;
        display: flex;
        overflow: hidden;
    }

    /* 왼쪽 */
    & > section > div:nth-child(1) {
        height: 100%;
        display: ${({ theme }) => (theme.isPc ? "flex" : "none")};
        width: ${({ theme }) => (theme.isPc ? "35%" : "100%")};
        padding: 5%;
        position: relative;
        flex-wrap: wrap;
        text-align: center;
    }

    & > section > div:nth-child(1) > div > p:nth-child(1) {
        font-weight: 700;
        width: 100%;
        font-size: 2.3rem;
        font-family: "Noto Sans Telugu", "Apple SD Gothic Neo", sans-serif;
        padding-bottom: 20px;
    }

    & > section > div:nth-child(1) > div > span {
        font-family: "Noto Sans KR", "Apple SD Gothic Neo";
        font-size: 0.8rem;
        line-height: 23px;
        text-align: center;
        color: gray;
    }

    /* 오른쪽 */
    & > section > div:nth-child(2) {
        width: ${({ theme }) => (theme.isPc ? "65%" : "85%")};
        margin: 0 auto;
        padding-bottom: ${({ theme }) => (theme.isPc ? "0" : "80px")};
    }

    & > section > div:nth-child(2) > div:nth-child(1) {
        width: 100%;
        max-width: ${({ theme }) => (theme.isPc ? "60%" : "85%")};
    }

    & > section > div:nth-child(2) > div:nth-child(1) > p:nth-child(1) {
        text-align: center;
        font-weight: 700;
        width: 100%;
        font-size: 2.3rem;
        font-family: "Noto Sans Telugu", "Apple SD Gothic Neo", sans-serif;
    }

    & > section > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) {
        margin: 30px 0;
    }

    & > section > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) {
        margin-bottom: 10px;
    }

    & > section > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:last-child {
        width: 100px;
        height: 55px;
        margin-left: 10px;
        border-radius: 10px;
        margin-top: 10px;
        border: 1px solid black;
        cursor: pointer;
        font-size: 0.9rem;
        transition: 0.2s all;
    }

    & > section > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:hover:last-child {
        border: 1px solid ${({ theme }) => theme.palette.pointColor};
        color: ${({ theme }) => theme.palette.pointColor};
    }

    & > section > div:nth-child(2) > div > span:last-child {
        display: ${({ theme }) => (theme.isPc ? "none" : "block")};
        position: absolute;
        bottom: 15%;
        text-align: center;
        color: gray;
        font-size: 0.8rem;
        width: 75%;
        line-height: 160%;
    }

    & > section > div:nth-child(2) > div:nth-child(1) > div {
        position: relative;
    }

    & > section > div:nth-child(2) > div:nth-child(1) > div > p:last-child {
        text-align: right;
        width: 100%;
        font-size: 0.7rem;
        position: absolute;
        padding-top: 5px;
    }

    & > section > div:nth-child(2) > div:nth-child(1) > div > p:last-child .error {
        color: ${({ theme }) => theme.palette.pointRed};
    }
`;
