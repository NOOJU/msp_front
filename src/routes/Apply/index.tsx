import React, { useState } from "react";
import { useTheme } from "styled-components";
import { useNavigate } from "react-router-dom"; // useNavigate를 임포트
import { useRecoilValue } from "recoil"; // Recoil에서 값을 불러오기 위해 사용
import { LoginState, UserInfoState } from "../../recoil/authAtom"; // Recoil에서 학번과 이메일 상태를 가져옴
import { botClient } from "../../api/botClient"; // botClient를 가져옴 (axios 대신)
import { ApplyPageMainStyled } from "./styled";
import { SelectInputObjProps, TextAreaObjProps } from "../../types/inputType";
import SelectInput from "../_common/input/selectInput";
import TextAreaInput from "../_common/input/textAreaInput";
import TextInput from "../_common/input/textInput";

import { applyErrors, inboundRuleList, inboundRulePlusProps, outboundRuleList, outboundRulePlusProps } from "../../types/pages/apply";
import InBoundRulePlus from "./inBoundRule/inBoundRulePlus";
import Button from "../_common/Button";
import OutBoundRulePlus from "./inBoundRule/outBoundRulePlus";
import Loading from "../_common/loading";

// import axios from 'axios';
// import {API_BASE_URL2} from '../../config';  // config.ts 파일에서 API_BASE_URL 가져오기

// import MockAdapter from 'axios-mock-adapter'; // axios-mock-adapter 임포트
// Mock 설정을 호출하는 위치
// mockTestScenario();  // Mock 시나리오 실행

const Apply: React.FC = () => {
  const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate 훅 사용
  // Recoil에서 학번과 이메일 값을 가져옴
  const { student_number, email } = useRecoilValue(UserInfoState);
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 추가

  const theme = useTheme();

  const [usage, setUsage] = useState<string>(""); //사용목적
  const [vmName, setVmName] = useState<string>(""); //vm이름
  const [applyReason, setApplyReason] = useState<string>(""); //상세 사용 목적
  const [csp, setCsp] = useState<string>(""); //csp
  const [vmSpec, setVmSpec] = useState<string>(""); //vm Spec
  const [vmVolume, setVmVolume] = useState<string>(""); //vm 용량
  const [vmImage, setVmImage] = useState<string>(""); //vm 운영체제
  const [inboundRule, setInboundRule] = useState<inboundRuleList[]>([
    { inPort: "22", inTcp: "tcp", inOrigin: "0.0.0.0/0" },
    { inPort: "80", inTcp: "tcp", inOrigin: "0.0.0.0/0" },
  ]); //인바운드 규칙
  const [outboundRule, setOutboundRule] = useState<outboundRuleList[]>([
    {
      outPort: "0",
      outTcp: "all",
      outOrigin: "0.0.0.0/0",
    },
  ]); //아웃바운드규칙
  const [additionalRequest, setAdditionalRequest] = useState<string>(""); //추가요청

  const [agree, setAgree] = useState<boolean>(false);
  const [errors, setErrors] = useState<applyErrors>({
    usage: "",
    applyReason: "",
    vmName: "",
    vmImage: "",
    vmSpec: "",
    vmVolume: "",
    inboundRule: "",
    outboundRule: "",
    additionalRequest: "",
    csp: "",
  });

  // 필드 이름을 사용자에게 친숙한 이름으로 매핑하는 객체
  const fieldNames: { [key: string]: string } = {
    usage: "사용 목적",
    applyReason: "사용 목적 설명",
    csp: "CSP",
    vmName: "VM 이름",
    vmImage: "운영체제",
    vmSpec: "스펙",
    vmVolume: "볼륨",
    inboundRule: "인바운드 규칙",
    outboundRule: "아웃바운드 규칙",
    additionalRequest: "기타 요청 사항",
  };

  // 동의 체크박스 변경 시 호출되는 함수
  const handleAgree = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAgree(e.target.checked);
  };

  // 폼 제출 시 호출되는 함수
  const handleSubmit = async (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();

    const formData = {
      usage: usage,
      applyReason: applyReason,
      vmName: vmName.trim(),
      vmimage: vmImage,
      vmSpec: vmSpec,
      vmVolume: vmVolume,
      inboundRule: inboundRule,
      outboundRule: outboundRule,
      additionalRequest: additionalRequest,
      csp: csp,
    };

    // const [errors, setErrors] = useState({
    setErrors({
      usage: "",
      applyReason: "",
      vmName: "",
      vmImage: "",
      vmSpec: "",
      vmVolume: "",
      inboundRule: "",
      outboundRule: "",
      additionalRequest: "",
      csp: "",
    });

    let error: boolean = false;

    // VM 이름 유효성 검사 로직
    if (formData.vmName === "") {
      const vmNameRegex = /^[a-zA-Z0-9-_]{1,52}$/;

      // 영문, 숫자, 하이픈(-), 언더바(_) 이외의 문자가 입력된 경우 에러 메시지 설정
      if (!vmNameRegex.test(formData.vmName)) {
        setErrors({ ...errors, vmName: "영문, 숫자, 하이픈(-), 언더바(_)만 입력 가능(1~52자)" });
        error = true;
      }

      // 첫 글자가 하이픈(-) 또는 언더바(_)인 경우 에러 메시지 설정
      if (/^[\-_]/.test(formData.vmName)) {
        setErrors({ ...errors, vmName: "첫 글자는 하이픈(-)과 언더바(_)를 사용할 수 없습니다." });
        error = true;
      }

      // 마지막 글자가 하이픈(-) 또는 언더바(_)인 경우 에러 메시지 설정
      if (/[\-_]$/.test(formData.vmName)) {
        setErrors({ ...errors, vmName: "마지막 글자는 하이픈(-)과 언더바(_)를 사용할 수 없습니다." });
        error = true;
      }

      if (error) {
        return alert("VM 이름을 확인해 주세요");
      }
    }

    // 검사에서 제외할 항목
    const excludedKeys: (keyof applyErrors)[] = ["applyReason", "additionalRequest"];

    // 빈 값이 있는 키를 배열에 저장
    const emptyKeys = Object.entries(formData)
      .filter(([key]) => !excludedKeys.includes(key as keyof applyErrors)) // 제외할 키 제외
      .filter(([, value]) => value === "") // 빈 문자열 필터링
      .map(([key]) => key as keyof applyErrors); // 빈 문자열인 키만 추출

    if (emptyKeys.length > 0) {
      // errors 상태 업데이트
      setErrors((prevErrors) => {
        const updatedErrors = { ...prevErrors };

        emptyKeys.forEach((key) => {
          updatedErrors[key] = "옵션을 선택하세요";
        });

        return updatedErrors;
      });
      return alert("선택 안 한 옵션이 있습니다.");
    }

    if (inboundRule.length === 0 || outboundRule.length === 0) {
      return alert("인바운드 규칙 또는 아웃바운드 규칙이 비어있습니다");
    }

    // 동의하지 않은 경우 경고 메시지 출력
    if (!agree) {
      return;
    }

    const formDataLast = {
      ...formData,
      inboundRule: inboundRule.map((item) => `${item.inPort}:${item.inTcp}:${item.inOrigin}`).join(", ") + ", ",
      outboundRule: outboundRule.map((item) => `${item.outPort}:${item.outTcp}:${item.outOrigin}`).join(", ") + ", ",
    };

    setIsLoading(true); // 로딩 상태 시작

    try {
      // Recoil에서 가져온 student_number와 email을 formData에 추가
      const extendedFormData = {
        ...formDataLast,
        student_number, // 학번
        email, // 이메일
      };

      // 서버에 폼 데이터 전송
      const response = await botClient.post(`/make_pr`, extendedFormData);

      if (response.status === 200) {
        alert("제출 완료되었습니다.");
        navigate("/listvm");
      } else {
        throw new Error("서버 응답 오류");
      }
    } catch (error) {
      console.error(error);
      alert("신청 제출에 실패했습니다.");
    } finally {
      setIsLoading(false); // 로딩 상태 종료
    }
  };

  //VM 이름
  const vmNameOnReplace = (value: string) => {
    return value.trim().replace(/[^a-zA-Z0-9-_]{1,52}$/g, "");
  };

  const vmNameOnChanger = (value: string) => {
    setVmName(value);
  };

  const textInputProps_vmName = {
    name: fieldNames.vmName,
    placeholder: "영어, 숫자, 하이픈(-), 언더바(_)",
    onChanger: vmNameOnChanger,
    onReplace: vmNameOnReplace,
  };

  // 사용목적
  /**
   * 값을 해당 위치의 변수에 저장함
   * @param value SelectInput에서 보내오는 변경 값
   */
  const onChangeHandler_Purpose = (value: string) => {
    setUsage(value);
  };

  /**
   * 사용 목적 select의 props 오브젝트
   * @typedef {object: selectObj_Purpose} selectObj_Purpose
   */
  const selectObj_Purpose: SelectInputObjProps = {
    name: fieldNames.usage,
    defaultValue: "옵션을 선택 하세요",
    selectList: [
      { value: "Development", text: "개인 프로젝트" },
      { value: "Team", text: "팀 프로젝트" },
      { value: "School", text: "학교 수업" },
      { value: "research", text: "연구" },
    ],
    onChanger: onChangeHandler_Purpose,
  };

  // 상세 사용 목적
  /**
   * 값을 해당 위치의 변수에 저장함
   * @param value TextAreaInput에서 보내오는 변경 값
   */
  const onChangeHandler_applyReason = (value: string) => {
    setApplyReason(value);
  };

  /**
   * @typedef {object: TextAreaObjProps} textAreaObjProps_applyReason
   */
  const textAreaObjProps_applyReason: TextAreaObjProps = {
    name: fieldNames.applyReason,
    placeholder: "자세하게 작성", //작성 힌트
    onChanger: onChangeHandler_applyReason,
  };

  /**
   * CSP 값을 해당 위치의 변수에 저장
   * @param value select 변경 값
   */
  const onChangeHandler_Csp = (value: string) => {
    setCsp(value);
  };

  const selectObj_Csp: SelectInputObjProps = {
    name: fieldNames.csp,
    defaultValue: "옵션을 선택 하세요",
    selectList: [{ value: "KakaoCloud", text: "KakaoCloud" }],
    onChanger: onChangeHandler_Csp,
  };

  /**
   * 스펙 값을 해당 위치의 변수에 저장
   * @param value select 변경 값
   */
  const onChangeHandler_vmSpec = (value: string) => {
    setVmSpec(value);
  };

  const selectObj_vmSpec: SelectInputObjProps = {
    name: fieldNames.vmSpec,
    defaultValue: "옵션을 선택 하세요",
    selectList: [
      { value: "m2a.large", text: "2 vCPU, 8GiB memory (m2a.large)" },
      { value: "m2a.xlarge", text: "4 vCPU, 16GiB memory (m2a.xlarge)" },
    ],
    onChanger: onChangeHandler_vmSpec,
  };

  /**
   * 볼륨 값을 해당 위치의 변수에 저장
   * @param value select 변경 값
   */
  const onChangeHandler_vmVolume = (value: string) => {
    setVmVolume(value);
  };

  const selectObj_vmVolume: SelectInputObjProps = {
    name: fieldNames.vmVolume,
    defaultValue: "옵션을 선택 하세요",
    selectList: [
      { value: "30", text: "SSD 30GB" },
      { value: "50", text: "SSD 50GB" },
    ],
    onChanger: onChangeHandler_vmVolume,
  };

  /**
   * 볼륨 값을 해당 위치의 변수에 저장
   * @param value select 변경 값
   */
  const onChangeHandler_vmImage = (value: string) => {
    setVmImage(value);
  };

  const selectObj_vmImage: SelectInputObjProps = {
    name: fieldNames.vmImage,
    defaultValue: "옵션을 선택 하세요",
    selectList: [
      { value: "CentOS Stream 9", text: "CentOS 9" },
      { value: "Ubuntu 20.04", text: "Ubuntu 20.04" },
      { value: "Ubuntu 22.04", text: "Ubuntu 22.04" },
      { value: "Ubuntu 24.04", text: "Ubuntu 24.04" },
    ],
    onChanger: onChangeHandler_vmImage,
  };

  const onChangeHandler_additionalRequest = (value: string) => {
    setAdditionalRequest(value);
  };

  /**
   * @typedef {object: TextAreaObjProps} textAreaObjProps_applyReason
   */
  const textAreaObjProps_additionalRequest: TextAreaObjProps = {
    name: fieldNames.additionalRequest,
    onChanger: onChangeHandler_additionalRequest,
  };

  const onChangeInboundRulePlus = (list: inboundRuleList[]) => {
    setInboundRule(list);
  };

  const inboundRulePlusProps: inboundRulePlusProps = {
    name: fieldNames.inboundRule,
    list: inboundRule,
    onChanger: onChangeInboundRulePlus,
  };

  const onChangeOutboundRulePlus = (list: outboundRuleList[]) => {
    setOutboundRule(list);
  };

  const outboundRulePlusProps: outboundRulePlusProps = {
    name: fieldNames.outboundRule,
    list: outboundRule,
    onChanger: onChangeOutboundRulePlus,
  };

  return (
    <ApplyPageMainStyled>
      <section>
        <p>가상 머신 신청</p>
        {/* VM 이름 ( vmName ) */}
        <div>
          <TextInput textInputProps={textInputProps_vmName} />
          <p className="error" style={{ color: errors.vmName === "" ? "rgba(0,0,0,0)" : "rgba(209,98,98,1)" }}>
            {errors.vmName || "not error"}
          </p>
        </div>

        {/* VM 사용 목적 ( usage ) */}
        <div>
          <SelectInput {...selectObj_Purpose} />
          <p className="error" style={{ color: errors.usage === "" ? "rgba(0,0,0,0)" : "rgba(209,98,98,1)" }}>
            {errors.usage || "not error"}
          </p>
        </div>

        {/* VM 상세 사용 목적 ( applyReason ) */}
        <div>
          <TextAreaInput {...textAreaObjProps_applyReason} />
          <p className="error" style={{ color: errors.applyReason === "" ? "rgba(0,0,0,0)" : "rgba(209,98,98,1)" }}>
            {errors.applyReason || "not error"}
          </p>
        </div>

        {/* CSP ( csp ) */}
        <div>
          <SelectInput {...selectObj_Csp} />
          <p className="error" style={{ color: errors.csp === "" ? "rgba(0,0,0,0)" : "rgba(209,98,98,1)" }}>
            {errors.csp || "not error"}
          </p>
        </div>

        {/* 스펙 ( vmSpec ) */}
        <div>
          <SelectInput {...selectObj_vmSpec} />
          <p className="error" style={{ color: errors.vmSpec === "" ? "rgba(0,0,0,0)" : "rgba(209,98,98,1)" }}>
            {errors.vmSpec || "not error"}
          </p>
        </div>

        {/* 볼륨 ( vmVolume ) */}
        <div>
          <SelectInput {...selectObj_vmVolume} />
          <p className="error" style={{ color: errors.vmVolume === "" ? "rgba(0,0,0,0)" : "rgba(209,98,98,1)" }}>
            {errors.vmVolume || "not error"}
          </p>
        </div>

        <div>
          {/* 운영체제 ( vmVolume ) */}
          <SelectInput {...selectObj_vmImage} />
          <p className="error" style={{ color: errors.vmImage === "" ? "rgba(0,0,0,0)" : "rgba(209,98,98,1)" }}>
            {errors.vmImage || "not error"}
          </p>
        </div>

        {/* 인바운드 규칙 ( inboundRule ) */}
        <div>
          <InBoundRulePlus {...inboundRulePlusProps} />
          <p className="error" style={{ color: errors.inboundRule === "" ? "rgba(0,0,0,0)" : "rgba(209,98,98,1)" }}>
            {errors.inboundRule || "not error"}
          </p>
        </div>

        {/* 아웃바운드 규칙 */}
        <div>
          <OutBoundRulePlus {...outboundRulePlusProps} />
          <p className="error" style={{ color: errors.outboundRule === "" ? "rgba(0,0,0,0)" : "rgba(209,98,98,1)" }}>
            {errors.outboundRule || "not error"}
          </p>
        </div>
        {/* 기타 요청 사항 */}
        <div>
          <TextAreaInput {...textAreaObjProps_additionalRequest} />
        </div>

        {/* 약관 */}
        <div className="policy">
          본 가상 머신 서비스는 삼육대학교 예산을 통해 제공되는 소중한 자산입니다. 사용자는 가상 머신을 목적에 부합하는 용도로만 사용한다..
          <br />
          <br />
          가상 머신을 사용하는 동안, 다음과 같은 악의적인 용도로 사용하지 않는다.
          <ul>
            <li>무단으로 타인의 데이터에 접근하거나 유출하는 행위</li>
            <li>해킹, 바이러스 배포, 또는 기타 사이버 공격에 관여하는 행위</li>
            <li>불법적인 콘텐츠의 생성, 저장, 또는 배포하는 행위</li>
          </ul>
          <br />
          가상 머신을 사용하여 다음과 같은 개인적 이득을 취하는 용도로 사용하지 않는다.
          <ul>
            <li>상업적인 활동 또는 광고에 사용하는 행위</li>
          </ul>
          <br />
          가상 머신을 요청한 후 사용하지 않을 경우, 즉시 반납(삭제 요청)한다.
          <br />
          <br />
          이러한 조건들은 삼육대학교의 자산을 책임감 있게 사용하고, 가상 머신 서비스의 지속 가능성을 보장하기 위해 필수적임을 이해하고, 사용자는 이 조건들에
          동의함으로써 가상 머신 서비스를 적절하고 효율적으로 사용할 책임이 있음을 인지하였습니다.
        </div>
        <div className="labelDiv">
          <label>
            <input type="checkbox" checked={agree} onChange={handleAgree} />
            <span>동의합니다.</span>
          </label>
        </div>

        <div onClick={handleSubmit} style={{ pointerEvents: !agree ? "none" : "auto" }}>
          <Button color={agree ? theme.palette.pointColor : "#a5a5a5"}>신청</Button>
        </div>
      </section>

      {/* 로딩 중일 때 스피너 표시 */}
      {isLoading && <Loading />}
    </ApplyPageMainStyled>
  );
};

export default Apply;
