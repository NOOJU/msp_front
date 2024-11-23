import styled from "styled-components";

export const ApplyPageMainStyled = styled.section`
  width: 100%;
  position: relative;
  z-index: 1;

  & ul {
    list-style-type: disc;
    /* margin-left: 10px; */
    padding-inline-start: 1.5em;
  }

  /* 중앙, 모바일 전체 */
  & > section {
    background-color: white;
    margin: 0 auto;
    padding: 50px 0;
    max-width: ${({ theme }) => (theme.isPc ? "425px" : "100%")};
    width: ${({ theme }) => (theme.isPc ? "425px" : "85%")};
    position: relative;
  }

  & > section > p:first-child {
    font-weight: 700;
    width: 100%;
    font-size: 2.3rem;
    padding-bottom: 20px;
    text-align: center;
  }

  & > section > div {
    margin: 35px 0;
  }

  & > section div.policy {
    line-height: 160%;
    font-size: 0.8rem;
  }
  & > section div.labelDiv {
    margin-bottom: 80px;
  }

  & > section div.labelDiv input {
    cursor: pointer;
    user-select: none; /* 기본 설정 */
    -webkit-user-select: none; /* Safari */
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* IE 10+ */
  }

  & > section div.labelDiv span {
    margin-left: 10px;
    cursor: pointer;
    user-select: none; /* 기본 설정 */
    -webkit-user-select: none; /* Safari */
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* IE 10+ */
  }

  & .error {
    width: 100%;
    text-align: end;
    font-size: 0.7rem;
    padding-top: 0.5rem;
  }
`;
