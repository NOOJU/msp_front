import React, { useEffect, useState } from "react"; // React와 훅 임포트
import axios from "axios"; // axios 임포트 (현재는 사용되지 않지만, 실제 API 사용 시 필요)
import { useTheme } from "styled-components";
import { useRecoilValue } from "recoil";
import { UserInfoState } from "../../recoil/authAtom";

// import axios from 'axios'; // axios 임포트 (현재는 사용되지 않지만, 실제 API 사용 시 필요)
// import { API_BASE_URL } from "../../config"; // config.ts 파일에서 API_BASE_URL 가져오기

import MockAdapter from "axios-mock-adapter"; // axios-mock-adapter 임포트
import Loading from "../_common/loading";
import { ListVMMainStyled, VmListUl } from "./styled";
import { vmListTypeProps } from "../../types/pages/vmList";
import VmListLi from "./li";
import { botClient } from "../../api/botClient";
import VmListMobileLi from "./li/index_mobile";

// List 컴포넌트 정의
const ListVM: React.FC = () => {
  const [vmList, setVmList] = useState<vmListTypeProps[]>([]); // VM 목록을 저장할 상태 변수
  const [error, setError] = useState<string | null>(null); // 에러 메시지를 저장할 상태 변수
  const userInfo = useRecoilValue(UserInfoState); // Recoil atom에서 전체 값 가져오기
  const studentNumber = userInfo.student_number; // student_number만 선택적으로 사용
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 추가
  const isPc = useTheme().isPc;

  // // Mock Adapter 테스트 코드
  // const mock = new MockAdapter(axios);
  // const mockData: vmListTypeProps[] = [
  //   {
  //     instance_name: "test",
  //     status: "활성화",
  //     flavor_name: "m2a.large",
  //     image_name: "CentOS Stream 9",
  //     floating_ip: "210.109.14.112",
  //     start_date: "2024년 11월 18일",
  //     end_date: "2024년 11월 26일",
  //     csp: "KAKAO",
  //   },
  //   {
  //     instance_name: "테스트12",
  //     status: "활성화",
  //     flavor_name: "m2a.large",
  //     image_name: "CentOS Stream 9",
  //     floating_ip: "210.109.14.112",
  //     start_date: "2024년 11월 18일",
  //     end_date: "2024년 11월 29일",
  //     csp: "KAKAO",
  //   },
  // ];
  // mock.onGet(`${API_BASE_URL}/user_instances`).reply(200, mockData);

  // const testData = [
  //   {
  //     pr_number: 679,
  //     status: "생성 신청",
  //     user_email: "[wnsdn3366@naver.com](mailto:wnsdn3366@naver.com)",
  //     created_at: "2024-11-18 14:06:37.972339",
  //     apply_reason: "1118TEST1",
  //     vm_name: "신청1",
  //     vm_image: "CentOS Stream 9",
  //     inbound_rule: "0:all:0.0.0.0/0",
  //     additional_request: "1118TEST1",
  //     auto_remove: 1,
  //     id: 55,
  //     student_number: "2018100942",
  //     usage: "School",
  //     csp: "KakaoCloud",
  //     vm_spec: "m2a.large",
  //     vm_volume: 30,
  //     outbound_rule: "0:all:0.0.0.0/0",
  //     combined_vm_name: "2018100942_1118TEST1",
  //   },
  //   {
  //     pr_number: 679,
  //     status: "생성 신청",
  //     user_email: "[wnsdn3366@naver.com](mailto:wnsdn3366@naver.com)",
  //     created_at: "2024-11-18 14:06:37.972339",
  //     apply_reason: "1118TEST1",
  //     vm_name: "신청2",
  //     vm_image: "CentOS Stream 9",
  //     inbound_rule: "0:all:0.0.0.0/0",
  //     additional_request: "1118TEST1",
  //     auto_remove: 1,
  //     id: 55,
  //     student_number: "2018100942",
  //     usage: "School",
  //     csp: "KakaoCloud",
  //     vm_spec: "m2a.large",
  //     vm_volume: 30,
  //     outbound_rule: "0:all:0.0.0.0/0",
  //     combined_vm_name: "2018100942_1118TEST1",
  //   },
  // ];

  // useEffect(() => {
  //   const transformedData: vmListTypeProps[] = testData.map((item) => ({
  //     instance_name: item.vm_name,
  //     status: "대기", // 고정값
  //     flavor_name: item.vm_spec,
  //     image_name: item.vm_image,
  //     floating_ip: "", // 기본값
  //     start_date: "", // 기본값
  //     end_date: "", // 기본값
  //     csp: item.csp,
  //   }));

  //   setVmList([...mockData, ...transformedData]); // API 응답 데이터를 상태에 저장
  // }, []); // 빈 배열을 넣어 마운트 시 한 번만 실행되도록 설정

  // 실제 API 호출을 사용하는 경우
  // useEffect(() => {
  //   const fetchStatusList = async (student_number: number) => {
  //     try {
  //       const response = await botClient.get(`/admin_status/`, {
  //         params: {
  //           student_number: student_number,
  //         },
  //       });
  //       console.log(response); // 디버깅용
  //       const transformedData = response.data.map((item: any) => ({
  //         instance_name: item.vm_name,
  //         status: "대기", // 고정값
  //         flavor_name: item.vm_spec,
  //         image_name: item.vm_image,
  //         floating_ip: "", // 기본값
  //         start_date: "", // 기본값
  //         end_date: "", // 기본값
  //         csp: item.csp,
  //       }));
  //       // setVmList([...vmList, ...transformedData]); // API 응답 데이터를 상태에 저장
  //       return transformedData;
  //     } catch (error) {
  //       console.error("Error fetching status List:", error); // 에러 로그 출력
  //     }
  //   };

  //   const fetchVMList = async (student_number: number) => {
  //     try {
  //       const response = await botClient.get(`/user_instances/`, {
  //         params: {
  //           student_number: student_number,
  //         },
  //       });
  //       // console.log(response); // 디버깅용
  //       // setVmList([...vmList, ...response.data]); // API 응답 데이터를 상태에 저장
  //       return response.data;
  //     } catch (error) {
  //       console.error("Error fetching VM List:", error); // 에러 로그 출력
  //     }
  //   };
  //   if (studentNumber) {
  //     // 학번이 존재하는 경우에만 API 요청을 보냄
  //     const data1 = fetchVMList(studentNumber);
  //     const data2 = fetchStatusList(studentNumber);

  //     setVmList([...data1, ...data2]);
  //   }
  // }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (studentNumber) {
          // 학번이 존재하는 경우에만 API 요청
          const data1 = await fetchVMList(studentNumber);
          const data2 = await fetchStatusList(studentNumber);

          // data1과 data2가 없을 경우 빈 배열을 사용하여 상태 업데이트
          setVmList([
            ...(data1 || []), // data1이 없으면 빈 배열
            ...(data2 || []), // data2가 없으면 빈 배열
          ]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [studentNumber]); // studentNumber가 변경되었을 때만 실행

  // fetchStatusList 함수
  const fetchStatusList = async (student_number: number) => {
    try {
      const response = await botClient.get(`/admin_status/`, {
        params: {
          student_number: student_number,
        },
      });
      console.log(response); // 디버깅용
      const transformedData = response.data.map((item: any) => ({
        instance_name: item.vm_name,
        status: "대기", // 고정값
        flavor_name: item.vm_spec,
        image_name: item.vm_image,
        floating_ip: "", // 기본값
        start_date: "", // 기본값
        end_date: "", // 기본값
        csp: item.csp,
      }));
      return transformedData;
    } catch (error) {
      console.error("Error fetching status List:", error);
      return []; // 에러 발생 시 빈 배열 반환
    }
  };

  // fetchVMList 함수
  const fetchVMList = async (student_number: number) => {
    try {
      const response = await botClient.get(`/user_instances/`, {
        params: {
          student_number: student_number,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching VM List:", error);
      return []; // 에러 발생 시 빈 배열 반환
    }
  };

  // console.log(vmList);

  return (
      <ListVMMainStyled>
        <section>
          <p>가상 머신 목록</p>
          {/* PC */}

          {isPc && (
              <VmListUl>
                <li>
                  <div className="flexHeightCenter">
                    <p>CSP</p>
                    <p>가상 머신 이름</p>
                    <p>상태</p>
                    <p>Public IP</p>
                    <p>시작일</p>
                    <p>종료일</p>
                    <p>기간 연장</p>
                    <p>삭제</p>
                    <p>상세</p>
                  </div>
                </li>
                {vmList.map((item, idx) => (
                    <VmListLi key={idx} student_number={studentNumber} {...item} />
                ))}
                {vmList.length === 0 && !isLoading && (
                    <li style={{ width: "100%", height: "300px" }} className="flexCenter">
                      <span>조회된 항목이 없습니다.</span>
                    </li>
                )}
              </VmListUl>
          )}
          {/* mobile */}
          {!isPc && (
              <ul>
                {vmList.map((item, idx) => (
                    <VmListMobileLi key={idx} student_number={studentNumber} {...item} />
                ))}
              </ul>
          )}
        </section>
        {isLoading && <Loading />}
      </ListVMMainStyled>
  );
};

export default ListVM;
