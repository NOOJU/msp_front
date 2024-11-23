import styled from "styled-components";

export const HeaderMainStlyed = styled.header`
  height: 70px;
  width: 100%;
  position: fixed;
  z-index: 999;
  flex-wrap: wrap;
  background-color: white;

  /* 중앙 div ( 첫번째 자식 ) */
  & > div:first-child {
    max-width: ${({ theme }) => (theme.isPc ? "1080px" : "90%")};
    width: ${({ theme }) => (theme.isPc ? "60%" : "90%")};
    height: 70px;

    display: flex;
    justify-content: space-between;
  }

  /* PC 왼쪽 text 메뉴 */
  & > div:first-child > ul > li {
    font-size: 1.1rem;
    padding-right: 1.5rem;
  }

  & > div:first-child > ul > li {
    font-size: 1.1rem;
    margin-right: 2rem;
    padding: 10px 0;
    transition: all 0.2s;
    cursor: pointer;
    user-select: none; /* 텍스트 선택 방지 */
  }
  & > div > ul > li:hover {
    font-weight: 700;
  }

  /* 오른쪽 icon 메뉴 */
  & > div:first-child > div:last-child > div {
    width: ${({ theme }) => (theme.isPc ? "70px" : "55px")};
  }

  & > div:first-child > div:last-child > div.logoutDiv {
    color: ${({ theme }) => theme.palette.pointRed};
  }

  & > div:first-child > div:last-child > div > * {
    cursor: pointer;
    font-size: 1.2rem;
    transition: all 0.2s;
    padding: 10px;
    user-select: none; /* 텍스트 선택 방지 */
  }

  & > div:first-child > div:last-child > div > *:hover {
    font-size: 1.3rem;
  }

  /* 모바일: 사이트이름 */
  & > div:first-child > p:first-child {
    font-size: 1.5rem;
    font-weight: 700;
    padding-left: 10px;
  }
`;

export const HeaderMoblieBar = styled.div`
  width: 100%;
  background-color: #fdfdfd;
  border: 1px solid #eeeeee;
  & > ul {
    width: 90%;
    height: 45px;
    font-size: 0.9rem;
    color: #717171;
    justify-content: space-around;
  }
  & > ul > li {
    margin-right: 1rem;
  }
`;
