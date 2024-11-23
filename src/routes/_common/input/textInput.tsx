import { useState } from "react";
import { TextInputProps } from "../../../types/inputType";
import styled from "styled-components";

const TextInputMainStyled = styled.div`
  font-size: 0.9rem;
  margin: 0 auto;
  z-index: 997;
  position: relative;
  width: 100%;
  max-width: 425px;
  background-color: white;

  & input {
    border-radius: 10px;
    outline: 1px solid black;
    height: 55px;
    width: 100%;
    max-width: 425px;
    border: none; /* 테두리 제거 */
    padding: 5%;
  }
  & input:focus {
    border: none; /* 테두리 제거 */
    outline: 1px solid ${({ theme }) => theme.palette.pointColor};
  }

  & > p:first-child {
    font-size: 0.9rem;
    padding-bottom: 10px;
    user-select: none; /* 기본 설정 */
    -webkit-user-select: none; /* Safari */
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* IE 10+ */
  }
`;

/**
 * 아래의 속성을 가지는 textInput 컴포넌트,
 * @param textInputProps:{
 *   @param {string} name 속성 이름
 *   @param {any} default? 기본 값
 *   @param {string} placeholder? 입력 필드에 아무 값도 없을 때 표시되는 안내 텍스트입니다.
 *   @param onChanger 이벤트 핸들러
 *   @param onReplace? 검사 핸들러
 *   @param {boolean} disabled?입력 불 가능 여부
 *   @param {string} value? 기본 값
 *   @param onEnterEvent (e: React.FormEvent) => { e.preventDefault() }  필수
 * }
 * @returns onReplace을 검사 후, onChanger를 통해 str 전달
 */
const TextInput = ({ textInputProps }: TextInputProps) => {
  const [value, setValue] = useState<string>(textInputProps.value || "");

  return (
    <TextInputMainStyled>
      <p>{textInputProps.name || ""}</p>
      <input
        style={{ backgroundColor: textInputProps.disabled ? "#f0f0f0" : "#FFF" }}
        type="text"
        onChange={(e) => {
          // 현재 문자열
          const valueNow = e.target.value;
          if (textInputProps.onReplace) {
            const replaceValue = textInputProps.onReplace(valueNow);
            setValue(replaceValue);
            textInputProps.onChanger(replaceValue);
          } else {
            setValue(valueNow);
            textInputProps.onChanger(valueNow);
          }
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            if (textInputProps.onEnterEvent) textInputProps.onEnterEvent(e);
          }
        }}
        placeholder={textInputProps.placeholder || ""}
        disabled={textInputProps.disabled || false}
        value={value}
      />
    </TextInputMainStyled>
  );
};
export default TextInput;
