import { useState } from "react";
import { inboundRuleList, inboundRulePlusProps } from "../../../types/pages/apply";
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled, { useTheme } from "styled-components";
import SelectInput from "../../_common/input/selectInput";
import TextInput from "../../_common/input/textInput";
import { SelectInputObjProps, TextInputObjProps } from "../../../types/inputType";

const InBoundRulePlusMainStyled = styled.div`
  font-size: 0.9rem;
  margin: 0 auto;
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 425px;
  border-top: 1px solid lightgrey;
  border-bottom: 1px solid lightgrey;
  padding: 20px 0;
  background-size: 20px;

  & > p:first-child {
    font-size: 0.9rem;
    padding-bottom: 10px;
    user-select: none; /* 기본 설정 */
    -webkit-user-select: none; /* Safari */
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* IE 10+ */
  }

  & > p:first-child > span {
    font-size: 0.8rem;
    color: gray;
  }

  & > div {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
  }

  & > div > ul:first-child {
    width: 100%;
    height: 100%;
    padding: 5% 0;
    border-bottom: 1px solid #ededed;
  }

  & > div > ul > li {
    width: 100%;
    padding: 15px 5%;
    position: relative;

    display: flex;
    justify-content: space-between;

    border-bottom: 1px dashed lightgray;
  }

  & > div > ul > li:last-child {
    border-bottom: 0px;
  }

  & li .icon {
    cursor: pointer;
    color: ${({ theme }) => theme.palette.pointRed};
  }

  & > div > div:last-child {
    width: 100%;
    height: 100%;
    padding: 5%;
  }

  & > div > div:last-child > div:first-child {
    margin-top: 0;
  }

  & > div > div:last-child > div:last-child {
    margin-bottom: 0;
  }

  & > div > div:last-child > div {
    margin: 20px 0;
  }

  & > div > div:last-child > p:last-child {
    text-align: right;
  }

  & > div > div:last-child > p:last-child > span {
    cursor: pointer;
    padding: 5px;
  }
`;

const InBoundRulePlus = ({ name, list, onChanger }: inboundRulePlusProps) => {
  const [inPort, setInPort] = useState<string>("");
  const [inTcp, setInTcp] = useState<string>("");
  const [inOrigin, setInOrigin] = useState<string>("");

  /**
   * 선택/입력된 값을 인바우드 규칙 리스트에 추가하는 함수
   * @returns 값이 비었을때, 같은 인바운드 규칙이 존재할 때 멈추고 리턴.
   */
  const inboundRule_push = (e: React.FormEvent) => {
    e.preventDefault();

    if (inPort === "" || inTcp === "" || inOrigin === "") {
      return alert("값을 입력/선택 하세요.");
    }

    if (inPort.length > 6) {
      return alert("포트는 최대 6자리, '65535'까지 입니다.");
    }

    if (Number(inPort) > 65535) {
      return alert("포트는 최대 '65535'까지 입니다.");
    }

    // 중복검사
    const isDuplicate = list.some((rule) => rule.inPort === inPort && rule.inTcp === inTcp && rule.inOrigin === inOrigin);

    if (isDuplicate) {
      return alert("이미 같은 인바운드 규칙이 존재 합니다.");
    }

    const pushData: inboundRuleList = {
      inPort: inPort,
      inTcp: inTcp,
      inOrigin: inOrigin,
    };

    onChanger([...list, pushData]);
  };

  //프로토콜
  const onChangeHandler_InTcp = (value: string) => {
    setInTcp(value);
  };

  const selectObjInTcp: SelectInputObjProps = {
    name: "프로토콜",
    defaultValue: "옵션을 선택 하세요",
    selectList: [
      { value: "tcp", text: "TCP" },
      { value: "udp", text: "UDP" },
      { value: "icmp", text: "ICMP" },
      { value: "all", text: "ALL" },
    ],
    onChanger: onChangeHandler_InTcp,
  };

  //출발지
  const onReplaceInOrigin = (value: string) => {
    return value.trim().replace(/[^0-9./]/g, "");
  };

  const onChangeHandler_InOrigin = (value: string) => {
    setInOrigin(value);
  };

  const textInputProps_InOrigin: TextInputObjProps = {
    name: "출발지",
    value: inOrigin,
    placeholder: "0.0.0.0/0",
    onChanger: onChangeHandler_InOrigin,
    onReplace: onReplaceInOrigin,
  };

  //포트
  const onReplaceInPort = (value: string) => {
    return value.trim().replace(/[^0-9]/g, "");
  };

  const onChangeHandler_InPort = (value: string) => {
    setInPort(value);
  };

  const textInputProps_InPort: TextInputObjProps = {
    name: "포트",
    value: inPort,
    placeholder: "22",
    onChanger: onChangeHandler_InPort,
    onReplace: onReplaceInPort,
  };

  const deleteList = ({ inTcp, inPort, inOrigin }: inboundRuleList) => {
    if (!window.confirm("삭제하시겠습니까?")) {
      // 사용자가 "취소"를 클릭한 경우
      return;
    }
    const filteredData = list.filter((item) => !(item.inPort === inPort && item.inTcp === inTcp && item.inOrigin === inOrigin));

    onChanger(filteredData);
  };

  return (
    <InBoundRulePlusMainStyled>
      <p>{name}</p>
      <div>
        {/* list */}
        <ul>
          {list.map((item, idx) => (
            <li
              key={idx}
              onClick={(e) => {
                deleteList({
                  inPort: item.inPort,
                  inTcp: item.inTcp,
                  inOrigin: item.inOrigin,
                });
              }}>
              {item.inPort}:{item.inTcp}:{item.inOrigin}
              <FontAwesomeIcon icon={faTrash} className="icon" />
            </li>
          ))}
        </ul>
        {/* input */}
        <div>
          <div>
            {/* 프로토콜 */}
            <SelectInput {...selectObjInTcp} />
          </div>
          <div>
            {/* 출발지 */}
            <TextInput textInputProps={textInputProps_InOrigin} />
          </div>
          <div>
            {/* 포트번호 */}
            <TextInput textInputProps={textInputProps_InPort} />
          </div>

          <p>
            <span onClick={inboundRule_push}>
              추가 <FontAwesomeIcon icon={faPlus} className="icon" />
            </span>
          </p>
        </div>
      </div>
    </InBoundRulePlusMainStyled>
  );
};
export default InBoundRulePlus;
