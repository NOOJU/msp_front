import styled from "styled-components";
import { ChildrenButtonProps } from "../../types/children";

const ButtonStyled = styled.div`
  width: 155px;
  height: 45px;
  text-align: center;
  line-height: center;
  border-radius: 85px;
  font-size: 1rem;
  font-weight: 700;
  color: white;
  margin: 0 auto;
  cursor: pointer;
  user-select: none; /* 기본 설정 */
  -webkit-user-select: none; /* Safari */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* IE 10+ */
  ${({ theme }) => (theme.isPc ? "" : "font-family: 'Noto Sans Telugu', 'sans-serif';")}padding-top:${({ theme }) => (theme.isPc ? "0" : "3px")};
`;

const Button = ({ children, color }: ChildrenButtonProps) => {
  return (
    <ButtonStyled style={{ backgroundColor: `${color}` }} className={"flexCenter shadow_15"}>
      <span>{children}</span>
    </ButtonStyled>
  );
};
export default Button;
