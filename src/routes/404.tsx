import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";

export const Error404MainStyle = styled.section`
  width: 100vw;
  height: ${({ theme }) => (theme.isPc ? "calc(100vh - 70px)" : "calc(100vh - 115px)")};
  text-align: center;
  line-height: 160%;
  font-size: 3rem;
  padding-bottom: 3%;
  & .icon {
    font-size: 12rem;
  }
`;

const Error404 = () => {
  return (
    <Error404MainStyle className="flexCenter">
      <span>
        <FontAwesomeIcon icon={faTriangleExclamation} className="icon" />
        <br />
        404 Error
      </span>
    </Error404MainStyle>
  );
};

export default Error404;
