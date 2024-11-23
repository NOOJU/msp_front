import { useState } from "react";
import { TextAreaObjProps } from "../../../types/inputType";
import styled from "styled-components";

export const TextAreaInputStyled = styled.div`
  position: relative;
  width: 100%;
  max-width: 425px;
  margin: 0 auto;

  & > p {
    font-size: 0.9rem;
    padding-bottom: 10px;
    user-select: none; /* 기본 설정 */
    -webkit-user-select: none; /* Safari */
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* IE 10+ */
  }

  & > textArea {
    width: 100%;
    font-size: 0.9rem;
    max-width: 425px;
    min-height: 150px;
    outline: 1px solid black;
    border-radius: 10px;
    resize: none; /* 크기 조정 불가 */
    overflow: auto; /* 내용이 넘칠 경우 스크롤 */
    padding: 5%;
  }

  & > textArea:focus {
    outline: 1px solid ${({ theme }) => theme.palette.pointColor};
  }
`;

const TextAreaInput = ({ name, defaultValue, placeholder, onChanger }: TextAreaObjProps) => {
  const [value, setValue] = useState<string>(defaultValue || "");

  const onChangeText = (value: string) => {
    setValue(value);
    if (onChanger) onChanger(value);
  };

  return (
    <TextAreaInputStyled>
      <p>{name}</p>
      <textarea className="textArea" name={name} placeholder={placeholder} onChange={(e) => onChangeText(e.target.value)} value={value} />
    </TextAreaInputStyled>
  );
};
export default TextAreaInput;
