import axios from 'axios';
import { API_BASE_URL } from '../config';  // config.ts 파일에서 인증 서버의 baseURL을 가져옴

// 인증 서버로 요청을 보내기 위한 Axios 인스턴스 생성
const authClient = axios.create({
    baseURL: API_BASE_URL,  // 인증 서버의 기본 URL 설정
    withCredentials: true,  // 쿠키 포함 (Refresh Token을 포함하여 전송하기 위해 필요)
});

// 요청 인터셉터를 사용할 필요가 없으므로 따로 설정하지 않음 (Access Token 발급 요청 시 사용)

// 응답 인터셉터가 필요하다면 여기에 추가 가능 (현재는 없음)

export default authClient;  // 설정된 authClient를 다른 파일에서 사용할 수 있도록 내보냄
