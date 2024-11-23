import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import axios from "axios";
import Apply from "./index";
import { API_BASE_URL } from "../../config"; // config.ts 파일에서 API_BASE_URL 가져오기

// axios 모듈을 모킹합니다.
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("Apply Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(global, "alert").mockImplementation(() => {}); // alert 모킹 추가
  });

  afterEach(() => {
    jest.restoreAllMocks(); // alert 모킹 복구
  });

  test("renders Apply component", () => {
    render(<Apply />);
    expect(screen.getByText("VM 신청")).toBeInTheDocument();
    expect(screen.getByLabelText("사용 용도")).toBeInTheDocument();
    expect(screen.getByLabelText("시작일")).toBeInTheDocument();
    expect(screen.getByLabelText("종료일")).toBeInTheDocument();
    expect(screen.getByLabelText("VM 이름")).toBeInTheDocument();
    expect(screen.getByLabelText("스펙")).toBeInTheDocument();
    expect(screen.getByLabelText("운영 체제 (OS)")).toBeInTheDocument();
    expect(screen.getByLabelText("볼륨")).toBeInTheDocument();
    expect(screen.getByLabelText("시큐리티 그룹")).toBeInTheDocument();
    expect(screen.getByLabelText("기타 요청 사항")).toBeInTheDocument();
    expect(screen.getByLabelText("동의 여부")).toBeInTheDocument();
  });

  test("shows error message for invalid VM name", async () => {
    render(<Apply />);

    const vmNameInput = screen.getByLabelText("VM 이름");
    fireEvent.change(vmNameInput, { target: { value: "Invalid VM Name!" } });

    const submitButton = screen.getByText("제출");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText((content, element) => content.includes("VM 이름은 알파벳 대소문자, 숫자, -, _ 만 포함해야 하며 1~239자 이내여야 합니다."))
      ).toBeInTheDocument();
    });
  });

  test("submits the form with valid data", async () => {
    mockedAxios.post.mockResolvedValueOnce({ data: {} });

    render(<Apply />);

    fireEvent.change(screen.getByLabelText("사용 용도"), { target: { value: "Test Usage" } });
    fireEvent.change(screen.getByLabelText("시작일"), { target: { value: "2023-01-01" } });
    fireEvent.change(screen.getByLabelText("VM 이름"), { target: { value: "ValidVMName" } });
    fireEvent.change(screen.getByLabelText("볼륨"), { target: { value: "100GB" } });
    fireEvent.change(screen.getByLabelText("시큐리티 그룹"), { target: { value: "default" } });
    fireEvent.click(screen.getByLabelText("동의 여부"));

    fireEvent.click(screen.getByText("제출"));

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(`${API_BASE_URL}/vm-apply`, expect.any(Object), expect.any(Object));
    });

    expect(global.alert).toHaveBeenCalledWith("신청이 성공적으로 제출되었습니다.");
  });

  test("shows error message when API call fails", async () => {
    mockedAxios.post.mockRejectedValueOnce(new Error("API call failed"));

    render(<Apply />);

    fireEvent.change(screen.getByLabelText("사용 용도"), { target: { value: "Test Usage" } });
    fireEvent.change(screen.getByLabelText("시작일"), { target: { value: "2023-01-01" } });
    fireEvent.change(screen.getByLabelText("VM 이름"), { target: { value: "ValidVMName" } });
    fireEvent.change(screen.getByLabelText("볼륨"), { target: { value: "100GB" } });
    fireEvent.change(screen.getByLabelText("시큐리티 그룹"), { target: { value: "default" } });
    fireEvent.click(screen.getByLabelText("동의 여부"));

    fireEvent.click(screen.getByText("제출"));

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(`${API_BASE_URL}/vm-apply`, expect.any(Object), expect.any(Object));
    });

    expect(global.alert).toHaveBeenCalledWith("신청 제출에 실패했습니다.");
  });
});
