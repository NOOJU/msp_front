import axios from 'axios';
import { API_BASE_URL, API_BASE_URL2 } from '../config';  // API 주소를 가져옴
import MockAdapter from 'axios-mock-adapter';  // axios-mock-adapter

// 인증 서버로 요청을 보내기 위한 Axios 인스턴스 생성
const authClient = axios.create({
    baseURL: API_BASE_URL,  // 인증 서버의 기본 URL 설정
    withCredentials: false,  // 쿠키를 포함하지 않음 (Refresh Token은 포함하지 않음)
    // withCredentials: true,  // 쿠키를 포함 (Refresh Token을 포함하여 전송)
});



// 요청 인터셉터: 모든 인증 서버 요청에 Access Token 추가
authClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');  // localStorage에서 Access Token을 가져옴
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;  // Access Token이 있으면 Authorization 헤더에 추가
            console.log(`[Request] Access token 사용: ${token}`);
        }
        return config;
    },
    (error) => Promise.reject(error)  // 요청 에러가 발생하면 그대로 반환
);

// 응답 인터셉터: 401, 403 에러 처리
authClient.interceptors.response.use(
    (response) => response,  // 응답 성공 시 그대로 반환
    async (error) => {
        const originalRequest = error.config;  // 원래의 요청 정보를 저장

        // Access Token 만료로 인한 401 에러 처리
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;  // 무한 재시도를 방지하기 위해 플래그 설정
            console.log('액세스 토큰 만료, 새로운 토큰 발급 요청 중');  // 디버깅용

            try {
                // 인증 서버로 새로운 Access Token 발급 요청
                const response = await axios.post(`${API_BASE_URL}/access_reissue/`, {}, {
                    withCredentials: true,  // 쿠키에 저장된 Refresh Token을 포함하여 요청
                });

                // 새로운 Access Token을 localStorage에 저장
                localStorage.setItem('access_token', response.data.access_token);
                console.log(`새로운 액세스 토큰 발급 완료: ${response.data.access_token}`);  // 디버깅용

                // 원래의 요청 헤더에 새로운 Access Token을 설정
                originalRequest.headers['Authorization'] = `Bearer ${response.data.access_token}`;

                // 원래의 요청을 봇 서버에 재시도
                return authClient(originalRequest);
            } catch (reissueError: any) {
                if (reissueError.response?.status === 403) {
                    // Refresh Token도 만료된 경우 로그아웃 처리
                    localStorage.removeItem('access_token');  // Access Token 삭제
                    console.log('리프레시 토큰도 만료됨 로그아웃 처리');  // 디버깅용
                    window.location.href = '/login';  // 로그인 페이지로 리다이렉트
                }
            }
        }

        // 그 외의 에러는 그대로 반환
        return Promise.reject(error);
    }
);

export { authClient };  // 설정된 botClient와 authClient를 내보냄



// // Mock 테스트 시나리오 함수
// export const mockTestScenario = async () => {
//     console.log('Mock Test 실행');
//
//     // Mock 설정
//     const mockBot = new MockAdapter(botClient);
//     const mockAuth = new MockAdapter(authClient);
//
//     // 1. 401 에러 시나리오 설정 (액세스 토큰 만료)
//     mockBot.onPost('/make_pr').replyOnce(401, {
//         message: 'Access token expired',
//     });
//
//     // 2. 새로운 토큰 발급 시나리오 설정 (/access_reissue)
//     mockAuth.onPost('/access_reissue').reply(200, {
//         access_token: 'new_mocked_access_token',
//     });
//
//     // 3. 새로운 토큰으로 재시도된 /make_pr 요청에 대한 성공 응답
//     mockBot.onPost('/make_pr').reply(200, {
//         message: 'PR created successfully',
//     });
//
//     // 테스트 진행
//     try {
//         // 요청 로직
//         await botClient.post('/make_pr', { data: 'example' });
//     } catch (error) {
//         // 에러 타입 가드
//         if (axios.isAxiosError(error)) {
//             // AxiosError 타입일 때 처리
//             if (error.response?.status === 401) {
//                 console.log('401 에러 발생: 토큰 만료');
//
//                 // 토큰 재발급 요청
//                 const reissueResponse = await authClient.post('/access_reissue');
//                 const newAccessToken = reissueResponse.data.access_token;
//
//                 // 새로운 토큰 저장 및 재시도
//                 localStorage.setItem('access_token', newAccessToken);
//                 botClient.defaults.headers['Authorization'] = `Bearer ${newAccessToken}`;
//
//                 // 원래 요청 재시도
//                 const retryResponse = await botClient.post('/make_pr', { data: 'example' });
//                 console.log('재시도 성공:', retryResponse.data);
//             }
//         } else {
//             // 다른 에러 처리
//             console.error('알 수 없는 에러 발생:', error);
//         }
//     }
// };