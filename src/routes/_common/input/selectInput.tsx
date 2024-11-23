import styled from "styled-components";
import { SelectInputObjProps } from "../../../types/inputType";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretUp, faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

/* <SelectInput {...selectObj_Purpose} /> */

export const SelectInputStyled = styled.div`
  font-size: 0.9rem;
  margin: 0 auto;
  position: relative;
  width: 100%;
  max-width: 425px;
  height: 55px;
  border-radius: 10px;
  border: 1px solid black;
  background-size: 20px;
  cursor: pointer;
  background-color: white;

  & .icon {
    position: absolute;
    right: 5%;
    top: 19.5px;
    font-size: 1rem;
  }

  & .label {
    width: 100%;
    z-index: 997;
    position: relative;
    display: flex;
    align-items: center;
    height: 55px;
    border: 0 none;
    outline: 0 none;
    padding-left: 5%;
    background-color: white;
    background: transparent;
    cursor: pointer;
  }

  & .optionList {
    z-index: 998;
    position: absolute;
    width: 100%;
    max-width: 425px;
    top: 60px;
    list-style-type: none;
    padding: 0;
    border-radius: 10px;
    border: 1px solid black;
    background-color: white;
  }

  &.active .optionList {
    z-index: 998;
    width: 100%;
    max-width: 425px;
    position: relative;
  }

  & .optionItem {
    z-index: 998;
    width: 100%;
    max-width: 425px;
    height: 55px;
    border-bottom: 1px dashed rgb(0, 0, 0);
    background-color: white;
    transition: 0.1s;
    padding-left: 5%;
    position: relative;
    z-index: 998;
  }

  & .optionItem:hover {
    background: rgb(236, 236, 236);
  }

  & .optionItem:first-child {
    border-radius: 10px 10px 0 0;
  }

  & .optionItem:last-child {
    border-bottom: 0px none;
    border-radius: 10px 10px 10px 10px;
  }

  // 스크롤 커스텀
  & .optionList::-webkit-scrollbar {
    width: 6px;
  }
  & .optionList::-webkit-scrollbar-track {
    background: transparent;
  }
  & .optionList::-webkit-scrollbar-thumb {
    background: #303030;
    border-radius: 45px;
  }
  & .optionList::-webkit-scrollbar-thumb:hover {
    background: #303030;
  }
`;

export const SelectInputStyled2 = styled.div`
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
`;

const SelectInput: React.FC<SelectInputObjProps> = ({ name, defaultValue, selectList, onChanger }) => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [nowName, setNowName] = useState<string>(defaultValue || name);

  const handleToggle = () => setIsActive(!isActive);

  const handleSelect = (value: string, text: string) => {
    setIsActive(false);
    setNowName(text);
    if (onChanger) onChanger(value);
  };

  return (
    <SelectInputStyled2>
      <p>{name || ""}</p>
      <SelectInputStyled>
        {isActive && <FontAwesomeIcon icon={faCaretUp} className="icon" />}
        {!isActive && <FontAwesomeIcon icon={faCaretDown} className="icon" />}
        <button className="label" onClick={handleToggle}>
          {nowName}
        </button>
        {isActive && (
          <ul className="optionList">
            {selectList.map((item, idx) => (
              <li key={idx} className={`optionItem ${item.value} flexHeightCenter`} onClick={() => handleSelect(item.value, item.text)}>
                <span>{item.text}</span>
              </li>
            ))}
          </ul>
        )}
      </SelectInputStyled>
    </SelectInputStyled2>
  );
};

export default SelectInput;
