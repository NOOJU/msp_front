import styled from "styled-components";

export const ListVMMainStyled = styled.section`
  width: 100%;
  position: relative;
  z-index: 1;

  & > section {
    background-color: white;
    margin: 0 auto;
    padding: 50px 0;
    max-width: ${({ theme }) => (theme.isPc ? "1080px" : "100%")};
    width: ${({ theme }) => (theme.isPc ? "75%" : "85%")};
    position: relative;
  }

  & > section > p:first-child {
    font-weight: 700;
    width: 100%;
    font-size: 2.3rem;
    padding-bottom: 40px;
    text-align: center;
  }
`;

export const VmListUl = styled.ul`
  width: 100%;
  border: 1px solid lightgray;
  border-radius: 10px;
  position: relative;
  font-size: 0.75rem;

  & > li {
    border-bottom: 1px solid lightgray;
  }

  & > li:first-child {
    background-color: rgba(0, 0, 0, 0.03);
    border-top: 0px;
  }

  & > li:last-child {
    border-bottom: 0px;
  }

  & > li > div {
    width: 100%;
    height: 55px;
    justify-content: space-between;
    position: relative;
    text-align: center;
  }

  & > li > div > p:nth-child(2) {
    white-space: nowrap; /* 텍스트를 한 줄로 제한 */
    overflow: hidden; /* 넘치는 텍스트 숨김 */
    text-overflow: ellipsis; /* 넘치는 텍스트를 '...'로 표시 */
  }

  & > li > div > p:nth-child(1) {
    width: 10%;
  } // CSP
  & > li > div > p:nth-child(2) {
    width: 20%;
  } // 이름
  & > li > div > p:nth-child(3) {
    width: 10%;
  } // 상태
  & > li > div > p:nth-child(4) {
    width: 15%;
  } // 상태

  & > li > div > p:nth-child(5),
  & > li > div > p:nth-child(6) {
    width: 12%;
  }

  & > li > div > p:nth-child(7) > span,
  & > li > div > p:nth-child(8) > span,
  & > li > div > p:nth-child(9) > span {
    cursor: pointer;
    padding: 10px;
  }

  & > li:first-child > div > p {
    padding: 0;
  }

  & > li > div > p:nth-child(7),
  & > li > div > p:nth-child(8),
  & > li > div > p:nth-child(9) {
    width: 7%;
  }
`;
