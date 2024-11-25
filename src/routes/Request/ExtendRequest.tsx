import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // useLocation으로 쿼리 파라미터 가져오기
import { useRecoilValue } from "recoil"; // Recoil에서 값을 불러오기 위해 사용
import { UserInfoState } from "../../recoil/authAtom"; // Recoil에서 학번과 이메일 상태를 가져옴
import { styled, useTheme } from "styled-components";
import { botClient } from "../../api/botClient";
import Loading from "../_common/loading";
import TextInput from "../_common/input/textInput";
import { TextInputObjProps, TextInputProps } from "../../types/inputType";
import TextAreaInput from "../_common/input/textAreaInput";
import Button from "../_common/Button";
import dayjs from "dayjs";
// import axios from 'axios';
// import { API_BASE_URL2 } from '../../config';  // config.ts 파일에서 API_BASE_URL 가져오기

const ExtendRequestMainStyled = styled.section`
  width: 100%;
  height: ${({ theme }) => (theme.isPc ? "calc(100vh - 70px)" : "calc(100vh - 115px)")};
  background-color: ${({ theme }) => (theme.isPc ? ({ theme }) => theme.palette.BgColor : "white")};

  & > section::-webkit-scrollbar {
    width: 4px; /* 스크롤바 너비 */
  }

  & > section::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0); /* 스크롤바 트랙 색상 */
    padding: 0;
  }

  & > section::-webkit-scrollbar-thumb {
    background: #a6a6a6; /* 스크롤바 색상 */
    border-radius: 4px; /* 스크롤바 둥글게 */
  }

  /* 중앙, 모바일 전체 */
  & > section {
    background-color: white;
    width: ${({ theme }) => (theme.isPc ? "500px" : "100%")};
    height: ${({ theme }) => (theme.isPc ? "85%" : "100%")};
    max-height: ${({ theme }) => (theme.isPc ? "700px" : "100%")};
    border-radius: ${({ theme }) => (theme.isPc ? "25px" : "0")};
    position: relative;
    overflow: auto;
    display: flex;
    padding: 3%;
  }

  & > section > div {
    width: ${({ theme }) => (theme.isPc ? "100%" : "85%")};
    margin: 0 auto;
  }

  & > section > div > div {
    margin-top: 25px;
  }

  & .button {
    height: 100px;
  }

  & > section > div > p:first-child {
    font-weight: 700;
    width: 100%;
    font-size: 2rem;
    margin: ${({ theme }) => (theme.isPc ? "0" : "10% auto")};
    font-family: "Noto Sans Telugu", "Apple SD Gothic Neo", sans-serif;
    text-align: center;
  }

  & .text {
    font-size: 0.8rem;
    margin-top: 0.8rem;
    line-height: 140%;
  }
`;

// URL 쿼리 파라미터를 파싱하는 함수
const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

// ExtendRequest 컴포넌트 정의
const ExtendRequest: React.FC = () => {
  const navigate = useNavigate();
  const query = useQuery(); // 쿼리 파라미터를 가져옴
  const instanceNameFromQuery = query.get("instance_name"); // instance_name 파라미터 가져오기
  const end_date: string | null = query.get("end_date"); // instance_name 파라미터 가져오기
  const { student_number, email } = useRecoilValue(UserInfoState); // Recoil에서 학번과 이메일 값을 가져옴
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 추가

  //   const [formData, setFormData] = useState({
  //     instance_name: instanceNameFromQuery || "", // 쿼리 파라미터로 받은 instance_name을 기본값으로 설정
  //     endDate: "", //종료일
  //     extensionReason: "", //연장사유
  //     studentNumber: "",
  //   });

  const [instance_name, setInstance_name] = useState<string | null>(instanceNameFromQuery);
  const [endDate, setEndDate] = useState<string>("");
  const [extensionReason, setExtensionReason] = useState<string>("");

  const theme = useTheme().palette;

  // 폼 제출 처리 함수
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // if (student_number.length === 0) return alert("오류가 발생하였습니다.");
    if (end_date?.length === 0) return alert("오류가 발생하였습니다.");
    if (endDate === "") return alert("연장일을 입력하십시오.");
    if (extensionReason === "") return alert("사유을 입력하십시오.");

    const newDate = dayjs(end_date).add(parseInt(endDate), "day").format("YYYY-MM-DD");

    const formData = {
      instance_name: instanceNameFromQuery || "",
      endDate: newDate, //종료일
      extensionReason: extensionReason, //연장사유
      studentNumber: student_number,
    };

    setIsLoading(true); // 로딩 상태 시작
    try {
      const response = await botClient.post(`/extend_pr`, formData);
      alert("연장 요청이 성공적으로 제출되었습니다.");
      navigate("/listvm");
    } catch (error) {
      console.error(error);
      alert("연장 요청 제출에 실패했습니다.");
    } finally {
      setIsLoading(false); // 로딩 상태 종료
    }
  };

  const vmNameTextInputProps: TextInputObjProps = {
    name: "VM 이름",
    value: instance_name,
    onChanger: (e: string) => {},
    disabled: true,
  };

  const onChangeEndDate = (value: string) => {
    setEndDate(value.replace(/[^0-9]/g, ""));
  };

  const endDateTextInputProps: TextInputObjProps = {
    name: "연장일",
    placeholder: "N일 (숫자만 입력)",
    onChanger: onChangeEndDate,
  };

  const onChangeExtensionReason = (value: string) => {
    setExtensionReason(value);
  };

  const TextAreaObjProps = {
    name: "사유",
    onChanger: onChangeExtensionReason,
    placeholder: "상세한 사유를 적어주세요",
  };

  return (
      <ExtendRequestMainStyled className="flexCenter">
        <section className="shadow_25">
          <div>
            <p>가상 머신 연장 신청</p>
            <TextInput textInputProps={vmNameTextInputProps} />
            <TextInput textInputProps={endDateTextInputProps} />
            <div className="text">
              <p>1회 최대 30일 연장 신청 가능</p>
              <p>(연장 횟수는 신청 인원, 횟수를 고려함)</p>
            </div>
            <TextAreaInput {...TextAreaObjProps} />

            <div className="button">
              <form onClick={handleSubmit}>
                <Button color={theme.pointColor}>신청하기</Button>
              </form>
            </div>
          </div>
        </section>
        {isLoading && <Loading />}
      </ExtendRequestMainStyled>
  );
};

export default ExtendRequest;
