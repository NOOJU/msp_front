import { useState } from "react";
import { outboundRuleList, outboundRulePlusProps } from "../../../types/pages/apply";
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";
import SelectInput from "../../_common/input/selectInput";
import TextInput from "../../_common/input/textInput";
import { SelectInputObjProps, TextInputObjProps } from "../../../types/inputType";

const OutBoundRulePlusMainStyled = styled.div`
  font-size: 0.9rem;
  margin: 0 auto;
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 425px;
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

const OutBoundRulePlus = ({ name, list, onChanger }: outboundRulePlusProps) => {
  const [outPort, setOutPort] = useState<string>("");
  const [outTcp, setOutTcp] = useState<string>("");
  const [outOrigin, setOutOrigin] = useState<string>("");

  /**
   * 선택/입력된 값을 인바우드 규칙 리스트에 추가하는 함수
   * @returns 값이 비었을때, 같은 아웃바운드 규칙이 존재할 때 멈추고 리턴.
   */
  const outboundRule_push = (e: React.FormEvent) => {
    e.preventDefault();

    if (outPort === "" || outTcp === "" || outOrigin === "") {
      return alert("값을 입력/선택 하세요.");
    }

    if (outPort.length > 6) {
      return alert("포트는 최대 6자리, '65535'까지 입니다.");
    }

    if (Number(outPort) > 65535) {
      return alert("포트는 최대 '65535'까지 입니다.");
    }

    // 중복검사
    const isDuplicate = list.some((rule) => rule.outPort === outPort && rule.outTcp === outTcp && rule.outOrigin === outOrigin);

    if (isDuplicate) {
      return alert("이미 같은 아웃바운드 규칙이 존재 합니다.");
    }

    const pushData: outboundRuleList = {
      outPort: outPort,
      outTcp: outTcp,
      outOrigin: outOrigin,
    };

    onChanger([...list, pushData]);
  };

  //프로토콜
  const onChangeHandler_InTcp = (value: string) => {
    setOutTcp(value);
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
    setOutOrigin(value);
  };

  const textInputProps_InOrigin: TextInputObjProps = {
    name: "목적지",
    value: outOrigin,
    placeholder: "0.0.0.0/0",
    onChanger: onChangeHandler_InOrigin,
    onReplace: onReplaceInOrigin,
  };

  //포트
  const onReplaceInPort = (value: string) => {
    return value.trim().replace(/[^0-9]/g, "");
  };

  const onChangeHandler_InPort = (value: string) => {
    setOutPort(value);
  };

  const textInputProps_InPort: TextInputObjProps = {
    name: "포트",
    value: outPort,
    placeholder: "22",
    onChanger: onChangeHandler_InPort,
    onReplace: onReplaceInPort,
  };

  const deleteList = ({ outTcp, outPort, outOrigin }: outboundRuleList) => {
    if (!window.confirm("삭제하시겠습니까?")) {
      // 사용자가 "취소"를 클릭한 경우
      return;
    }
    const filteredData = list.filter((item) => !(item.outPort === outPort && item.outTcp === outTcp && item.outOrigin === outOrigin));

    onChanger(filteredData);
  };

  return (
    <OutBoundRulePlusMainStyled>
      <p>{name}</p>
      <div>
        {/* list */}
        <ul>
          {list.map((item, idx) => (
            <li
              key={idx}
              onClick={(e) => {
                deleteList({
                  outPort: item.outPort,
                  outTcp: item.outTcp,
                  outOrigin: item.outOrigin,
                });
              }}>
              {item.outPort}:{item.outTcp}:{item.outOrigin}
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
            <span onClick={outboundRule_push}>
              추가 <FontAwesomeIcon icon={faPlus} className="icon" />
            </span>
          </p>
        </div>
      </div>
    </OutBoundRulePlusMainStyled>
  );
};
export default OutBoundRulePlus;
