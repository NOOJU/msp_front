import { createGlobalStyle } from "styled-components";
import { reset } from "styled-reset";

const GlobalStyle = createGlobalStyle`
  ${reset}
  *,*::before, *::after{
	  margin: 0;
	  padding: 0;
	  border: 0;
    box-sizing: border-box;
    vertical-align: baseline;

    /* Font 설정 */
    font-family: "Gothic A1", sans-serif;
    font-optical-sizing: auto;
    /* font-weight: <weight>; */
    font-style: normal;

  }
  article, aside, details, figcaption, figure, 
  footer, header, hgroup, menu, nav, section {
	  display: block;
  }
  body {
	  line-height: 1;

    -ms-overflow-style: auto; /* IE and Edge */
    scrollbar-width: auto; /* Firefox */
  }
  ol, ul {
	  list-style: none;
  }
  blockquote, q {
  	quotes: none;
  }
  blockquote:before, blockquote:after,
  q:before, q:after {
	  content: '';
	  content: none;
  }
  table {
	  border-collapse: collapse;
	  border-spacing: 0;
  }
  a, a:link, a:visited, a:hover, a:active{
    color: black;
    text-decoration: none;
  }

  body::-webkit-scrollbar {
    display: block; /* Chrome, Safari, Opera */
    width: 8px;
  }
  body::-webkit-scrollbar-track{
    display: block;
    background: gray;
  }
  body::-webkit-scrollbar-thumb{
    display: block;
    border-radius:10px;
    background: white;
  }
    /* 가로의 중앙 */
    .flexWidthCenter {
    display: flex;
    justify-content: center;
  }

  /* 세로의 중앙 */
  .flexHeightCenter {
    display: flex;
    align-items: center;
  }

  /* 정중앙 */
  .flexCenter {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  /* 그림자 */
  .shadow_25 {
    box-shadow: 0px 0px 25px rgba(0, 0, 0, 0.1);
  }

  .shadow_15 {
    box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);
  }
`;

export default GlobalStyle;
