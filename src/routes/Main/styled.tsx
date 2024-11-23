import styled from "styled-components";

export const MainPageStyled = styled.section`
  height: ${({ theme }) => (theme.isPc ? "calc(100vh - 70px)" : "calc(100vh - 115px)")};
  position: relative;

  /* 슬라이더를 감싸는 Div */
  & > div.slider-container > div:first-child > div {
    height: ${({ theme }) => (theme.isPc ? "calc(100vh - 70px)" : "calc(100vh - 115px)")};
  }

  /* 슬라이더 play, pause버튼 */
  & > div.slider-container .slider-button-div {
    position: absolute;
    width: 3rem;
    height: 3rem;
    bottom: ${({ theme }) => (theme.isPc ? "3vh" : "10vh")};
    right: 3vh;
    background-color: white;
    border-radius: 2.5rem;
    cursor: pointer;
  }

  & > div.slider-container .slider-button-div .button {
    font-size: 1.3rem;
    background-color: white;
    color: #454545;
  }

  /* 슬라이더 dots */
  & > div.slider-container .slick-dots {
    position: absolute;
    text-align: end;
    bottom: ${({ theme }) => (theme.isPc ? "calc(3vh + 0.9rem)" : "calc(10vh + 0.9rem)")};
    right: calc(3rem + 3vh + 15px);
  }
`;

// 슬라이더 1
export const MainPageSlider1 = styled.section`
  height: ${({ theme }) => (theme.isPc ? "calc(100vh - 70px)" : "calc(100vh - 115px)")};
  width: 100vw;
  position: relative;

  & > div:first-child {
    max-width: ${({ theme }) => (theme.isPc ? "600px" : "90%")};
    flex-wrap: wrap;
    position: absolute;
    top: 50%; /* 화면의 50% 아래 */
    left: 50%; /* 화면의 50% 오른쪽 */
    transform: translate(-50%, -50%); /* 요소 크기만큼 반대로 이동 */
  }

  & > div:first-child > div:first-child {
    flex-wrap: wrap;
    text-align: center;
    margin-bottom: ${({ theme }) => (theme.isPc ? "40px" : "15px")};
  }
  /* background-color: blue; */

  & > div:first-child > div:first-child > span:first-child {
    font-size: ${({ theme }) => (theme.isPc ? "2.8rem" : "1.7rem")};
  }

  & > div:first-child > div:first-child > span:last-child {
    font-size: ${({ theme }) => (theme.isPc ? "7rem" : "4.5rem")};
    font-weight: 700;
  }

  & > div:first-child > div:last-child {
    max-width: 500px;
    width: ${({ theme }) => (theme.isPc ? "28vw" : "75vw")};
    height: ${({ theme }) => (theme.isPc ? "50px" : "50px")};
    background-color: white;
    border-radius: 50px;
    text-align: center;
    margin-bottom: ${({ theme }) => (theme.isPc ? "0" : "calc(10vh + 0.9rem)")};
    font-weight: 600;
    cursor: pointer;
  }

  /* 백그라운드 이미지 */
  /* & > div:last-child {
    width: 100%;
    height: 100%;
  } */
`;
