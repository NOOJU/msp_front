import styled from "styled-components";

export const UserInfoMainStyled = styled.section`
  width: 100%;
  height: ${({ theme }) => (theme.isPc ? "calc(100vh - 70px)" : "calc(100vh - 115px)")};
  background-color: ${({ theme }) => (theme.isPc ? ({ theme }) => theme.palette.BgColor : "white")};

  /* 중앙, 모바일 전체 */
  & > section {
    background-color: white;
    max-width: ${({ theme }) => (theme.isPc ? "1080px" : "100%")};
    max-height: ${({ theme }) => (theme.isPc ? "650px" : "100%")};
    width: ${({ theme }) => (theme.isPc ? "60%" : "100%")};
    height: ${({ theme }) => (theme.isPc ? "85%" : "100%")};
    border-radius: ${({ theme }) => (theme.isPc ? "25px" : "0")};
    position: relative;
  }

  & > section > div {
    width: 100%;
  }

  & > section > div > p:first-child {
    font-weight: 700;
    width: 100%;
    font-size: 2.3rem;
    font-family: "Noto Sans Telugu", sans-serif;
    padding-bottom: 20px;
    text-align: center;
  }

  & > section > div > ul {
    width: ${({ theme }) => (theme.isPc ? "70%" : "85%")};
    margin: 0 auto;
    outline: 1px solid lightgray;
    border-radius: 10px;
    margin-bottom: 30px;
  }

  & > section > div > ul > li {
    font-size: 0.9rem;
    padding: 15px 0;
    border-bottom: 1px solid lightgrey;
    position: relative;
    ${({ theme }) => (theme.isPc ? "" : "font-family: 'Noto Sans Telugu', 'sans-serif';")}
  }

  & > section > div > ul > li:last-child {
    border-bottom: 0px;
  }

  & > section > div > ul > li > p:first-child {
    width: 35%;
    text-align: center;
  }

  & > section > div > ul > li > p:last-child {
    text-align: start;
  }
`;
