import React, { useEffect, useState } from "react";
import styled, { useTheme } from "styled-components";
import { authClient } from "../../api/authClient";
import { userInfoType } from "../../types/pages/userInfo";
import { UserInfoMainStyled } from "./styled";
import Button from "../_common/Button";
import Loading from "../_common/loading";
// import axios from 'axios';
// import { API_BASE_URL } from '../../config';  // config.ts 파일에서 API_BASE_URL 가져오기

// import MockAdapter from 'axios-mock-adapter'; // axios-mock-adapter 임포트
// import { mockTestScenario } from '../../api/apiClient';
// // Mock 설정을 호출하는 위치
// mockTestScenario();  // Mock 시나리오 실행

const UserInfo: React.FC = () => {
  const [userInfo, setUserInfo] = useState<any>(null); // 사용자 정보를 저장할 상태 변수

  const [error, setError] = useState<string | null>(null); // 에러 메시지를 저장할 상태 변수
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const theme = useTheme();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        // 사용자 정보를 가져오는 API 호출
        const response = await authClient.get(`/user_info`);
        setIsLoading(false);
        // console.log(response); // 디버깅용
        setUserInfo(response.data); // API 응답 데이터를 상태에 저장
      } catch (error) {
        console.error("Error fetching user info:", error); // 에러 로그 출력
        setIsLoading(true);
        setError("사용자 정보를 가져오는데 실패했습니다."); // 에러 발생 시 메시지 설정
      }
    };
    fetchUserInfo(); // 컴포넌트 마운트 시 API 호출
  }, []); // 빈 배열을 디펜던시로 추가하여 최초 마운트 시에만 실행

  if (error) {
    return (
      <div style={{ textAlign: "center", height: "80vh" }} className="flexCenter">
        <div>{error}</div>
      </div>
    );
  }

  if (!userInfo) {
    return <div>{isLoading && <Loading />}</div>;
  }

  return (
    <UserInfoMainStyled className="flexCenter">
      <section className="shadow_15 flexCenter">
        <div>
          <p>My Info</p>
          <ul>
            <li className="flexHeightCenter">
              <p>이름</p>
              <p>{userInfo.name}</p>
            </li>
            <li className="flexHeightCenter">
              <p>학번</p>
              <p>{userInfo.student_number}</p>
            </li>
            <li className="flexHeightCenter">
              <p>EMAIL</p>
              <p>{userInfo.email}</p>
            </li>
            <li className="flexHeightCenter">
              <p>P.N</p>
              <p>{userInfo.phone_number}</p>
            </li>
            <li className="flexHeightCenter">
              <p>학과</p>
              <p>{userInfo.department}</p>
            </li>
          </ul>
          <Button color={theme.palette.pointRed}>LOGOUT</Button>
        </div>
      </section>
    </UserInfoMainStyled>
  );
};

export default UserInfo;
