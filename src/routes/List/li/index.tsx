import styled, { useTheme } from "styled-components";
import { vmListTypeProps } from "../../../types/pages/vmList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faCaretUp, faTrash } from "@fortawesome/free-solid-svg-icons";
import { faCalendar } from "@fortawesome/free-regular-svg-icons";
import { useNavigate } from "react-router-dom";
import { botClient } from "../../../api/botClient";
import dayjs from "dayjs";
import { useState } from "react";

const VmListLiStyled = styled.li`
  width: 100%;

  & > p:last-child {
    height: 35px;
    background-color: rgba(0, 0, 0, 0.03);
    border-top: 1px solid lightgray;
    padding: 0 20px;
    gap: 0 30px;
  }
`;

const VmListLi = ({ csp, instance_name, status, floating_ip, start_date, end_date, flavor_name, image_name, student_number }: vmListTypeProps) => {
  const navigate = useNavigate();
  const theme = useTheme().palette;

  const [openState, setOpenState] = useState<boolean>(false);

  // 연장 요청 처리 함수
  const handleExtendRequest = () => {
    // 버튼 비활성화 여부를 결정하는 함수

    const today = dayjs(); // 현재 날짜
    const end_dateForm = end_date.replace(/(\d{4})년 (\d{2})월 (\d{2})일/, "$1-$2-$3");
    const end = dayjs(end_dateForm); // 종료일

    if (end.diff(today, "day") <= 7) {
      navigate(`/extendrequest?instance_name=${instance_name}&end_date=${end_dateForm}`);
    } else {
      alert("연장은 종료일 7일 전부터 가능합니다.");
    }
  };

  const handleDeleteRequest = async () => {
    if (!window.confirm("삭제 요청을 보냅니다.")) return;

    try {
      const response = await botClient.post("/delete_pr", {
        vm_name: instance_name, // 삭제할 VM 이름
        studentNumber: student_number, // 학번
      });
      // console.log(response.data.message); // 디버깅용 서버 응답 확인
      alert(`${instance_name}에 대한 삭제 요청이 처리되었습니다.`);
    } catch (error) {
      console.error("삭제 요청 중 에러 발생:", error); // 디버깅
      alert("삭제 요청을 처리하는 도중 오류가 발생했습니다.");
    }
  };

  return (
      <VmListLiStyled>
        <div className="flexHeightCenter">
          {/* CSP */}
          <p>{csp}</p>
          {/* 가상머신 이름 */}
          <p>{instance_name}</p>
          {/* 상태 */}
          <p style={{ color: status === "활성화" ? "#549F30" : theme.pointRed }}>{status}</p>
          {/* 퍼블릭 IP */}
          <p>{floating_ip || "-"}</p>
          {/* 시작일 */}
          <p>{start_date.replace(/(\d{2})(\d{2})년 (\d{2})월 (\d{2})일/, "$2. $3. $4") || "-"}</p>
          {/* 종료일 */}
          <p>{end_date.replace(/(\d{2})(\d{2})년 (\d{2})월 (\d{2})일/, "$2. $3. $4") || "-"}</p>
          {/* 기간연장 */}
          <p>
            {status === "활성화" && (
                <span onClick={handleExtendRequest}>
              <FontAwesomeIcon icon={faCalendar} />
            </span>
            )}
            {status !== "활성화" && "-"}
          </p>
          {/* 삭제 */}
          <p>
            {status === "활성화" && (
                <span onClick={handleDeleteRequest} style={{ color: theme.pointRed }}>
              <FontAwesomeIcon icon={faTrash} />
            </span>
            )}
            {status !== "활성화" && "-"}
          </p>
          <p style={{ cursor: "pointer", padding: "5px" }}>
            {!openState && (
                <span onClick={() => setOpenState(true)}>
              <FontAwesomeIcon icon={faCaretDown} />
            </span>
            )}
            {openState && (
                <span onClick={() => setOpenState(false)}>
              <FontAwesomeIcon icon={faCaretUp} />
            </span>
            )}
          </p>
        </div>
        {openState && (
            <p className="flexHeightCenter">
              <span>유형: {flavor_name}</span>
              <span>이미지: {image_name}</span>
            </p>
        )}
      </VmListLiStyled>
  );
};
export default VmListLi;
