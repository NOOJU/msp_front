import styled, { useTheme } from "styled-components";
import { vmListTypeProps } from "../../../types/pages/vmList";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { botClient } from "../../../api/botClient";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar } from "@fortawesome/free-regular-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

export const VmListMobileLiStyled = styled.li`
    font-family: "Noto Sans Telugu", "Apple SD Gothic Neo", sans-serif;
    margin-bottom: 40px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    padding: 5px 10%;
    background-color: white;
    box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.05);

    & > p {
        width: 100%;
        padding: 18px 0;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        position: relative;
        display: flex;
        overflow-y: scroll;
    }

    & > p > p:first-child {
        width: 40%;
    }

    & > p > p:last-child {
        width: 60%;
    }

    & .additionalAttributes {
        background-color: #fcfcfc;
        color: #a6a6a6;
        padding: 14px 0;
    }

    & > div:last-child {
        width: 100%;
        text-align: end;
        font-size: 1.3rem;
    }

    & > div:last-child .icon {
        cursor: pointer;
        padding: 18px 5px;
        margin-left: 25px;
    }

    & > div:last-child .icon.red {
        color: ${({ theme }) => theme.palette.pointRed};
    }
`;

const VmListMobileLi = ({ csp, instance_name, status, floating_ip, start_date, end_date, flavor_name, image_name, student_number }: vmListTypeProps) => {
    const navigate = useNavigate();
    const theme = useTheme().palette;

    // 연장 요청 처리 함수
    const handleExtendRequest = () => {
        // 버튼 비활성화 여부를 결정하는 함수

        const today = dayjs(); // 현재 날짜
        // console.log(end_date);
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
        <VmListMobileLiStyled>
            <p>
                <p>CSP</p>
                <p>{csp}</p>
            </p>
            <p>
                <p>이름</p>
                <p>{instance_name}</p>
            </p>
            <p>
                <p>상태</p>
                <p style={{ color: status === "활성화" ? "#549F30" : theme.pointRed }}>{status}</p>
            </p>
            {status === "활성화" && (
                <p>
                    <p>Public IP</p>
                    <p>{floating_ip}</p>
                </p>
            )}
            {status === "활성화" && (
                <p>
                    <p>시작일</p>
                    <p>{start_date.replace(/(\d{2})(\d{2})년 (\d{2})월 (\d{2})일/, "$2. $3. $4")}</p>
                </p>
            )}
            {status === "활성화" && (
                <p>
                    <p>종료일</p>
                    <span>{end_date.replace(/(\d{2})(\d{2})년 (\d{2})월 (\d{2})일/, "$2. $3. $4")}</span>
                </p>
            )}
            <p className="additionalAttributes">
                <p>유형</p>
                <p>{flavor_name}</p>
            </p>
            <p className="additionalAttributes">
                <p>이미지</p>
                <p>{image_name}</p>
            </p>
            {status === "활성화" && (
                <div>
                    <FontAwesomeIcon icon={faCalendar} className="icon" onClick={handleExtendRequest} />
                    <FontAwesomeIcon icon={faTrash} className="icon red" onClick={handleDeleteRequest} />
                </div>
            )}
        </VmListMobileLiStyled>
    );
};
export default VmListMobileLi;
