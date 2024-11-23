import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { useRecoilState } from "recoil";
import { LoginState, UserInfoState } from "../../recoil/authAtom";
import { API_BASE_URL } from "../../config"; // config.ts 파일에서 API_BASE_URL 가져오기
import { jwtDecode } from "jwt-decode";
import TextInput from "../_common/input/textInput";
import Button from "../_common/Button";
import { useTheme } from "styled-components";
import { SignInDataTorm } from "../../types/pages/signIn";
import { on } from "events";
import { SignUpMainStlyed } from "./styled";

const Signup: React.FC = () => {
  const location = useLocation(); // 현재 URL 정보를 가져오기 위한 훅
  const navigate = useNavigate();
  const theme = useTheme();
  const [isLoggedIn, setIsLoggedIn] = useRecoilState(LoginState); // Recoil을 통한 로그인 상태 전역 관리
  const [userInfo, setUserInfo] = useRecoilState(UserInfoState); // 사용자 정보 저장을 위한 Recoil 상태 추가

  // URL에서 쿼리 파라미터 추출
  const queryParams = new URLSearchParams(location.search);
  const phoneNumberFromUrl = queryParams.get("phone_number") || ""; // URL 쿼리에서 phone_number를 추출, 없으면 빈 문자열

  // const [formData, setFormData] = useState<SignInDataTorm>({
  //   name: "",
  //   student_number: "",
  //   department: "",
  //   email: "",
  //   phone_number: phoneNumberFromUrl, // URL 파라미터로 받은 전화번호를 기본값으로 설정
  // });

  const [name, setName] = useState<string>("");
  const [studentNumber, setStudentNumber] = useState<string>("");
  const [department, setDepartment] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [pN, setPN] = useState<string>(phoneNumberFromUrl || "");

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState({
    name: "",
    studentNumber: "",
    department: "",
    email: "",
    phone_number: "",
  });

  /**
   * @param value input에서 보내오는 값
   */
  const onChangeName = (value: string) => {
    setName(value);
  };
  const onReplaceStudentNumber = (value: string) => {
    const onlyN = value.replace(/[^0-9]/g, "");
    return onlyN;
  };

  const onChangeStudentNumber = (value: string) => {
    setStudentNumber(value);
  };

  const onChangeDepartment = (value: string) => {
    setDepartment(value);
  };
  const onReplaceEmail = (value: string) => {
    const email = value.replace(/[^a-zA-Z0-9@.]/g, "");
    return email;
  };

  const onChangeEmail = (value: string) => {
    setEmail(value);
  };

  const onEnterEventHandler = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(e);
  };

  const onInputPropsName = {
    name: "이름",
    onChanger: onChangeName,
  };

  const onInputPropsStudentNumber = {
    name: "학번",
    onChanger: onChangeStudentNumber,
    onReplace: onReplaceStudentNumber,
  };

  const onInputPropsEmail = {
    name: "EMAIL",
    onChanger: onChangeEmail,
    onReplace: onReplaceEmail,
  };

  const onInputPropsDepartment = {
    name: "학과",
    onChanger: onChangeDepartment,
    onEnterEvent: onEnterEventHandler,
  };

  // 이메일 유효성 검사 함수
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email); // 정규식을 사용하여 이메일 유효성 검사
  };

  // 휴대폰 번호 유효성 검사 함수
  const validatePhoneNumber = (number: string) => {
    const phoneRegex = /^01[0-9]{8,9}$/; // 한국 휴대폰 번호 정규식
    return phoneRegex.test(number); // 정규식을 사용하여 번호 유효성 검사
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isEmailValid = validateEmail(email);
    const isPhoneValid = validatePhoneNumber(pN);

    if (name.replace(/\s+/g, "").length === 0) {
      setValidationErrors({
        name: "이름을 입력하세요",
        studentNumber: "",
        department: "",
        email: "",
        phone_number: "",
      });
      return;
    }

    if (studentNumber.replace(/\s+/g, "").length === 0) {
      setValidationErrors({
        studentNumber: "학번을 입력하세요",
        name: "",
        department: "",
        email: "",
        phone_number: "",
      });
      return;
    } else if (studentNumber.replace(/\s+/g, "").length > 10) {
      setValidationErrors({
        studentNumber: "올바른 학번을 입력하세요",
        name: "",
        department: "",
        email: "",
        phone_number: "",
      });
      return;
    }

    if (department.replace(/\s+/g, "").length === 0) {
      setValidationErrors({
        name: "",
        studentNumber: "",
        department: "학과를 입력하세요",
        email: "",
        phone_number: "",
      });
      return;
    }

    if (!isEmailValid || !isPhoneValid) {
      setValidationErrors({
        ...validationErrors,
        email: isEmailValid ? "" : "유효한 이메일 주소를 입력해주세요.",
        phone_number: isPhoneValid ? "" : "유효한 전화번호를 입력해주세요.",
      });
      return;
    }

    const formData: SignInDataTorm = {
      name: name,
      student_number: studentNumber,
      department: department,
      email: email,
      phone_number: pN, // URL 파라미터로 받은 전화번호를 기본값으로 설정
    };

    setValidationErrors({
      name: "",
      studentNumber: "",
      department: "",
      email: "",
      phone_number: "",
    });

    try {
      const response = await axios.post(`${API_BASE_URL}/signup/`, formData, {
        withCredentials: true, // 쿠키가 포함되도록 설정
      });

      if (response.data.access_token) {
        setSuccess("회원가입에 성공했습니다!");
        setError(null);
        // console.log("Form Data Submitted:", response.data);
        // console.log(response);

        // JWT 토큰 디코딩
        const decodedToken: { sub: string; email: string } = jwtDecode(response.data.access_token);
        const { sub: student_number, email } = decodedToken; // 토큰에서 학번과 이메일 추출

        // 학번과 이메일 전역 상태 저장 (Recoil state)
        setUserInfo({
          student_number: student_number, // 서버에서 받은 학번
          email: email, // 서버에서 받은 이메일
        });

        // 확인용 콘솔 로그
        // console.log("학번:", student_number);
        // console.log("이메일:", email);

        // 액세스 토큰을 localStorage에 저장
        localStorage.setItem("access_token", response.data.access_token);

        // 회원가입 성공 메시지가 있으면 로그인 상태를 true로 설정
        if (response.data.message === "Signup successful") {
          setIsLoggedIn(true);
          // 등록된 사용자라면 main 페이지로 이동
          navigate("/main");
        }
      }
    } catch (error) {
      setError("회원가입에 실패했습니다. 다시 시도해 주세요.");
      setSuccess(null);
      console.error("There was an error submitting the form:", error);
    }
  };

  // console.log(studentNumber);

  return (
    <SignUpMainStlyed className="flexCenter">
      <section className="shadow_25">
        <div className="flexCenter">
          <div>
            <p>Sign In</p>
            <div>
              <TextInput textInputProps={onInputPropsName} />
              <TextInput textInputProps={onInputPropsStudentNumber} />
              <TextInput textInputProps={onInputPropsEmail} />
              <TextInput textInputProps={onInputPropsDepartment} />
              <p>
                .{validationErrors.name && <span className="error">{validationErrors.name}</span>}
                {validationErrors.studentNumber && <span className="error">{validationErrors.studentNumber}</span>}
                {validationErrors.department && <span className="error">{validationErrors.department}</span>}
                {validationErrors.email && <span className="error">{validationErrors.email}</span>}
                {validationErrors.phone_number && <span className="error">{validationErrors.phone_number}</span>}
              </p>
            </div>
            <div onClick={handleSubmit} style={{ paddingBottom: "15px" }}>
              <Button color={theme.palette.pointColor}>SIGN IN</Button>
            </div>
          </div>
        </div>
      </section>
    </SignUpMainStlyed>
  );
};

export default Signup;
