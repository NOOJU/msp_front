import styled from "styled-components";

export const SignUpMainStlyed = styled.section`
  width: 100%;
  height: ${({ theme }) => (theme.isPc ? "calc(100vh - 70px)" : "calc(100vh - 115px)")};
  background-color: ${({ theme }) => (theme.isPc ? ({ theme }) => theme.palette.BgColor : "white")};
  overflow: hidden;

  /* 중앙, 모바일 전체 */
  & > section {
    background-color: white;
    max-width: ${({ theme }) => (theme.isPc ? "1080px" : "100%")};
    max-height: ${({ theme }) => (theme.isPc ? "700px" : "100%")};
    width: ${({ theme }) => (theme.isPc ? "60%" : "100%")};
    height: ${({ theme }) => (theme.isPc ? "100%" : "100%")};
    border-radius: ${({ theme }) => (theme.isPc ? "25px" : "0")};
    position: relative;
    display: flex;
    overflow: hidden;
    padding-bottom: ${({ theme }) => (theme.isPc ? "0" : "80px")};
  }

  & > section > div:first-child {
    width: 100%;
  }

  & > section > div:first-child > div {
    width: ${({ theme }) => (theme.isPc ? "100%" : "90%")};
    margin: 0 auto;
  }

  & > section > div:first-child > div > div:nth-child(2) {
    margin: 25px 0 10px 0;
  }

  & > section > div:first-child > div > div:nth-child(2) > * {
    margin: 15px auto;
  }

  & > section > div:first-child > div > p:first-child {
    font-weight: 700;
    width: 100%;
    font-size: 2.3rem;
    ${({ theme }) => (theme.isPc ? "" : "font-family: 'Noto Sans Telugu', 'sans-serif'")};
    text-align: center;
  }

  & > section > div:first-child > div > div:nth-child(2) > p:last-child {
    text-align: right;
    width: 100%;
    font-size: 0.7rem;
    max-width: 425px;
    margin-top: 0px;

    color: white;
  }

  & > section > div:first-child > div > div:nth-child(2) > p:last-child .error {
    color: ${({ theme }) => theme.palette.pointRed};
  }
`;
