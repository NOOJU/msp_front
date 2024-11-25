import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLaptopCode, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";

export const Error503MainStyle = styled.section`
  width: 100vw;
  height: ${({ theme }) => (theme.isPc ? "calc(100vh - 70px)" : "calc(100vh - 115px)")};
  text-align: center;
  font-size: 3rem;
  padding-bottom: 3%;
  & .icon {
    font-size: 7rem;
    padding-bottom: 30px;
  }
`;

const Error503 = () => {
  return (
    <Error503MainStyle className="flexCenter">
      <span>
        <FontAwesomeIcon icon={faLaptopCode} className="icon" />
        <br />
        503 Error
        <br />
        <span style={{ fontSize: "1rem" }}>해당 기능을 준비 중입니다.</span>
      </span>
    </Error503MainStyle>
  );
};

export default Error503;
