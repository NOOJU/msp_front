import axios from 'axios';
import { API_BASE_URL, API_BASE_URL2 } from '../config';  // API 주소를 가져옴

// 인증 서버로 요청을 보내기 위한 Axios 인스턴스 생성
const authClient = axios.create({
    baseURL: API_BASE_URL,  // 인증 서버의 기본 URL 설정
    withCredentials: true,  // 쿠키를 포함 (Refresh Token을 포함하여 전송)
});

// 봇 서버로 요청을 보내기 위한 Axios 인스턴스 생성
const botClient = axios.create({
    baseURL: API_BASE_URL2,  // 봇 서버의 기본 URL 설정
    withCredentials: false,  // 쿠키를 포함하지 않음 (Refresh Token은 포함하지 않음)
});

// 요청 인터셉터: 모든 봇 서버 요청에 Access Token 추가
botClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');  // localStorage에서 Access Token을 가져옴
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;  // Access Token이 있으면 Authorization 헤더에 추가
        }
        return config;
    },
    (error) => Promise.reject(error)  // 요청 에러가 발생하면 그대로 반환
);

// 응답 인터셉터: 401, 403 에러 처리
botClient.interceptors.response.use(
    (response) => response,  // 응답 성공 시 그대로 반환
    async (error) => {
        const originalRequest = error.config;  // 원래의 요청 정보를 저장

        // Access Token 만료로 인한 401 에러 처리
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;  // 무한 재시도를 방지하기 위해 플래그 설정

            try {
                // 인증 서버로 새로운 Access Token 발급 요청
                const response = await authClient.post('/access_reissue/', {}, {
                    withCredentials: true,  // 쿠키에 저장된 Refresh Token을 포함하여 요청
                });

                // 새로운 Access Token을 localStorage에 저장
                localStorage.setItem('access_token', response.data.access_token);

                // 원래의 요청 헤더에 새로운 Access Token을 설정
                originalRequest.headers['Authorization'] = `Bearer ${response.data.access_token}`;

                // 원래의 요청을 봇 서버에 재시도
                return botClient(originalRequest);
            } catch (reissueError: any) {
                if (reissueError.response?.status === 403) {
                    // Refresh Token도 만료된 경우 로그아웃 처리
                    localStorage.removeItem('access_token');  // Access Token 삭제
                    window.location.href = '/login';  // 로그인 페이지로 리다이렉트
                }
            }
        }

        // 그 외의 에러는 그대로 반환
        return Promise.reject(error);
    }
);

export { botClient, authClient };  // 설정된 botClient와 authClient를 내보냄
