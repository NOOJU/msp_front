import React, { useState, useEffect } from "react"; // React와 useState를 임포트
import axios from "axios"; // axios를 임포트
import { useNavigate } from "react-router-dom"; // useNavigate를 임포트
import { useTheme } from "styled-components"; // styled-components를 임포트
import { useRecoilState } from "recoil";
import { LoginState, UserInfoState } from "../../../recoil/authAtom";
import { API_BASE_URL } from "../../../config"; // config.ts 파일에서 API_BASE_URL 가져오기
import { jwtDecode } from "jwt-decode";

import MockAdapter from "axios-mock-adapter"; // axios-mock-adapter 임포트
import { LoginPadgeMainStlyed } from "./style";
import Button from "../../_common/Button";
import TextInput from "../../_common/input/textInput";
import Loading from "../../_common/loading";

// 매직넘버 상수로 관리
const INITIAL_TIMER_SECONDS = 299; // 5분
const PHONE_NUMBER_LENGTH = 11;
const VERIFICATION_CODE_LENGTH = 6;

// 타이머 훅 구현
function useTimer(initialSeconds: number) {
  const [timer, setTimer] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive) {
      interval = setInterval(() => {
        setTimer((prevTimer: number) => (prevTimer > 0 ? prevTimer - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const resetTimer = () => {
    setTimer(initialSeconds);
    setIsActive(true);
  };

  const stopTimer = () => {
    setIsActive(false);
  };

  return { timer, resetTimer, stopTimer };
}

// Auth 컴포넌트 정의
const Login: React.FC = () => {
  const theme = useTheme();

  const [phoneNumber, setPhoneNumber] = useState(""); // phoneNumber 상태를 정의
  const [verificationCode, setVerificationCode] = useState(""); // verificationCode 상태를 정의
  const [isCodeSent, setIsCodeSent] = useState(false); // 인증번호 전송 여부를 나타내는 상태를 정의
  const [error, setError] = useState(""); // 에러 메시지를 나타내는 상태를 정의
  const [verificationStatus, setVerificationStatus] = useState({
    sent: false,
    verified: false,
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate 훅 사용
  const [isLoggedIn, setIsLoggedIn] = useRecoilState(LoginState); // recoil을 통한 로그인 상태 전역 관리
  const [userInfo, setUserInfo] = useRecoilState(UserInfoState); // 사용자 정보 저장을 위한 Recoil 상태 추가
  const [isExpired, setIsExpired] = useState(false); // 인증 시간 만료 여부 상태

  // 타이머 훅 사용
  const { timer, resetTimer, stopTimer } = useTimer(INITIAL_TIMER_SECONDS);

  useEffect(() => {
    if (timer === 0) {
      setIsExpired(true); // 인증 시간 만료로 설정
      stopTimer(); // 타이머 정지
    }
  }, [timer]);

  // // // MockAdapter 설정
  // const mock = new MockAdapter(axios);

  // // Mock 데이터 설정: 인증번호 전송 응답
  // mock.onPost(`${API_BASE_URL}/send_sms/`).reply(200, {
  //   message: "인증번호가 전송되었습니다.",
  // });

  // // Mock 데이터 설정: 인증번호 검증 응답
  // mock.onPost(`${API_BASE_URL}/verify_sms/`).reply(200, {
  //   access_token: "mocked_token",
  //   message: "Login successful",
  // });

  // 인증번호 전송 함수
  const handleSendCode = async () => {
    if (phoneNumber.length !== PHONE_NUMBER_LENGTH) {
      setError("유효한 휴대폰 번호를 입력하세요.");
      return;
    }
    setIsLoading(true);
    setError("");
    setIsExpired(false); // 재전송 시 만료 상태 초기화
    try {
      const response = await axios.post(`${API_BASE_URL}/send_sms/`, { phone_number: phoneNumber });
      // console.log(response.data);
      setIsCodeSent(true);
      setIsLoading(false);
      setVerificationStatus({ ...verificationStatus, sent: true });
      resetTimer();
      alert("인증번호가 전송되었습니다.");
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      alert("인증번호 전송에 실패했습니다.");
    }
  };

  // 인증번호 검증 함수
  const handleVerifyCode = async () => {
    if (verificationCode.length !== VERIFICATION_CODE_LENGTH) {
      setVerificationStatus({ sent: true, verified: false, message: "인증번호가 잘못되었습니다." });
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/verify_sms/`, {
        phone_number: phoneNumber,
        auth_code: verificationCode,
      });

      // 코드 다듬기 필요!!
      if (response.data.message === "Verification successful, proceed to signup") {
        // 등록되지 않은 사용자라면 signup 페이지로 이동
        navigate(`/signup?phone_number=${phoneNumber}`);
      }

      if (response.data.access_token) {
        setVerificationStatus({ sent: true, verified: true, message: "인증 성공" });
        stopTimer();

        // JWT 토큰 디코딩
        const decodedToken: { sub: string; email: string } = jwtDecode(response.data.access_token);
        const { sub: student_number, email } = decodedToken; // 토큰에서 학번과 이메일 추출

        // 학번과 이메일 전역 상태 저장 (Recoil state)
        setUserInfo({
          student_number: student_number, // 서버에서 받은 학번
          email: email, // 서버에서 받은 이메일
        });

        // 디버그용 콘솔 출력
        // console.log("학번:", student_number);
        // console.log("이메일:", email);

        // 토큰 로컬 스토리지에 저장
        localStorage.setItem("access_token", response.data.access_token);

        if (response.data.message === "Login successful") {
          setIsLoggedIn(true);

          // 등록된 사용자라면 main 페이지로 이동
          navigate("/");
        }
      } else {
        setVerificationStatus({ sent: true, verified: false, message: "인증번호가 잘못되었습니다." });
      }
    } catch (error) {
      console.error(error);
      setVerificationStatus({ sent: true, verified: false, message: "인증번호 검증에 실패했습니다." });
    }
  };

  /**
   * input에서 엔터를 누르면 작동하는 함수
   */

  const onEnterEvent1 = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendCode(); // 보내기
  };

  const onEnterEvent2 = (e: React.FormEvent) => {
    e.preventDefault();
    handleVerifyCode(); // 검사
  };

  /**
   * 인증번호 replace
   * @param {string} value input의 값
   * @returns 조건에 맞는 값 반환
   */
  const handleVerificationReplace = (value: string) => {
    const numbersOnly = value.replace(/\D/g, "");
    if (numbersOnly.length <= VERIFICATION_CODE_LENGTH) {
      return numbersOnly;
    } else return numbersOnly.slice(0, VERIFICATION_CODE_LENGTH);
  };

  const onInputChanger = (value: string) => {
    setVerificationCode(value);
  };

  const TextInputOptionVerification = {
    placeholder: "인증번호",
    default: "", //기본 값
    onChanger: onInputChanger, //이벤트 핸들러
    onReplace: handleVerificationReplace,
    disabled: false, //입력 가능 여부
    onEnterEvent: onEnterEvent2,
  };

  const displayFormattedPhoneNumber = (value: string) => {
    const numbersOnly = value.replace(/\D/g, "");
    if (numbersOnly.length > PHONE_NUMBER_LENGTH) {
      return `${numbersOnly.slice(0, PHONE_NUMBER_LENGTH).slice(0, 3)} - ${numbersOnly.slice(0, PHONE_NUMBER_LENGTH).slice(3, 7)} - ${numbersOnly
          .slice(0, PHONE_NUMBER_LENGTH)
          .slice(7)}`;
    }

    if (numbersOnly.length <= 3) {
      return numbersOnly;
    } else if (numbersOnly.length <= 7) {
      return `${numbersOnly.slice(0, 3)} - ${numbersOnly.slice(3)}`;
    } else {
      return `${numbersOnly.slice(0, 3)} - ${numbersOnly.slice(3, 7)} - ${numbersOnly.slice(7)}`;
    }
  };

  const onChangePN = (value: string) => {
    setPhoneNumber(value.replace(/[^0-9]/g, ""));
  };

  const TextInputOptionPhoneNumber = {
    placeholder: "핸드폰 번호",
    default: "",
    onReplace: displayFormattedPhoneNumber,
    onChanger: onChangePN,
    disabled: isCodeSent, //입력 가능 여부
    onEnterEvent: onEnterEvent1,
  };

  return (
      <LoginPadgeMainStlyed className="flexCenter">
        <section className="shadow_25">
          <div className="shadow_15 flexCenter">
            <div>
              <p>Welcome!</p>
              <span>
              휴대전화 번호 인증 이후, 계정이 없다면
              <br />
              회원가입으로 이동됩니다.
            </span>
            </div>
          </div>
          <div className="flexCenter">
            <div>
              <p>Login</p>
              <div>
                <div className="flexHeightCenter">
                  <TextInput textInputProps={TextInputOptionPhoneNumber} />
                  <div className="flexCenter" onClick={handleSendCode} style={{ pointerEvents: isLoading ? "none" : "auto", userSelect: "none" }}>
                    {!verificationStatus.sent ? "본인 인증" : "재전송"}
                  </div>
                </div>
                <TextInput textInputProps={TextInputOptionVerification} />
                <p>
                  {isExpired && <span className="error">인증 시간 만료</span>}
                  {verificationStatus.message.length === 0 && isCodeSent && !isExpired && !error && (
                      <span>{`남은 시간: ${Math.floor(timer / 60)}:${timer % 60 < 10 ? "0" : ""}${timer % 60}`}</span>
                  )}
                  {error.length !== 0 && <span className="error">{error}</span>}
                  {verificationStatus.message.length !== 0 && <span className="error">{verificationStatus.message}</span>}
                </p>
              </div>
              {/* 버튼 컴포넌트 */}
              <div onClick={handleVerifyCode} style={{ paddingTop: "10px" }}>
                <Button color={theme.palette.pointColor}>LOGIN</Button>
              </div>
              <span>
              휴대전화 번호 인증 이후, 계정이 없다면
              <br />
              회원가입으로 이동됩니다.
            </span>
            </div>
          </div>
        </section>
        {/* {isLoading && <Loading />} */}
      </LoginPadgeMainStlyed>
  );
};

export default Login; // Auth 컴포넌트를 내보냅니다
