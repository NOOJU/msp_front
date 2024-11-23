import React, { useState } from "react";
import styled, { useTheme } from "styled-components";
import { botClient } from "../../api/botClient"; // botClient 가져오기 (axios 대신)
// import { API_BASE_URL2 } from '../../config';
// import axios from 'axios';
const SupportRequestMainStyled = styled.section`
  width: 100%;
  height: ${({ theme }) => (theme.isPc ? "calc(100vh - 70px)" : "calc(100vh - 115px)")};
  background-color: ${({ theme }) => (theme.isPc ? ({ theme }) => theme.palette.BgColor : "white")};

  & > section {
    background-color: white;
    max-width: ${({ theme }) => (theme.isPc ? "1080px" : "100%")};
    width: ${({ theme }) => (theme.isPc ? "60%" : "100%")};
    height: ${({ theme }) => (theme.isPc ? "75%" : "100%")};
    max-height: ${({ theme }) => (theme.isPc ? "700px" : "100%")};
    border-radius: ${({ theme }) => (theme.isPc ? "25px" : "0")};
    padding-bottom: ${({ theme }) => (theme.isPc ? "" : "85px")};
    position: relative;
    overflow: auto;
    display: flex;
  }

  & > section > div {
    width: 90%;
  }

  & p {
    margin-bottom: 20px;
    width: 100%;
  }
`;

const SupportRequest: React.FC = () => {
  const isPc = useTheme().isPc;
  // const [formData, setFormData] = useState({
  //   vmName: "",
  //   request: "",
  // });

  // const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  //   const { name, value } = e.target;
  //   setFormData((prevState) => ({
  //     ...prevState,
  //     [name]: value,
  //   }));
  // };

  // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   try {
  //     // botClient를 사용하여 봇 서버로 POST 요청을 보냄
  //     const response = await botClient.post(`/support-request`, formData);
  //     alert("지원 요청이 성공적으로 제출되었습니다.");
  //   } catch (error) {
  //     console.error(error);
  //     alert("지원 요청 제출에 실패했습니다.");
  //   }
  // };

  return (
    <SupportRequestMainStyled className="flexCenter">
      <section className="flexCenter shadow_25">
        <div>
          <p style={{ fontSize: "2.3rem", fontWeight: 700, textAlign: "center" }}>문의사항</p>
          {/* 안내글과 카카오톡 오픈채팅방 링크 들어갈 자리 */}
          <div
            style={{
              margin: "40px auto",
              maxWidth: "85%",
              lineHeight: "180%",
              marginTop: "40px",
              padding: isPc ? "3rem" : "1rem",
              border: "1px solid lightgray",
              borderRadius: "10px",
            }}>
            <p>문의 사항이 있을 경우, 관리자 메일이나 오픈채팅방에 접속하여 질문해주시기 바랍니다. </p>
            <p style={{ fontWeight: 600 }}>
              관리자 메일: {!isPc && <br />} wnsdn3366@naver.com
              <br />
              오픈채팅방: {!isPc && <br />} <a href="https://open.kakao.com/o/ge0aycgg"> open.kakao.com/o/ge0aycgg</a>
            </p>
          </div>
        </div>
      </section>
    </SupportRequestMainStyled>
  );
};

export default SupportRequest;
