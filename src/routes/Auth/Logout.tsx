import { useRecoilState, useResetRecoilState } from 'recoil';
import { LoginState, UserInfoState } from '../../recoil/authAtom';
import {authClient} from "../../api/authClient";

export const Logout = () => {
    const [isLoggedIn, setIsLoggedIn] = useRecoilState(LoginState);  // 로그인 상태
    const [userInfo, setUserInfo] = useRecoilState(UserInfoState);   // 유저 정보 상태
    const resetUserInfo = useResetRecoilState(UserInfoState);        // 유저 정보 초기화 함수

    const deleteCookie = (name: string) => {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    };

    const logoutHandler = async () => {
        try {
            // // 1. 로그아웃 요청 보내기 (POST 요청)
            // const response = await authClient.post('/logout/');

            const response = await fetch('/auth/refresh/logout/', {
                method: 'POST',
                credentials: 'include',  // 쿠키를 포함하여 요청
                headers: {
                    'Content-Type': 'application/json',
                }
            });


            // 2. 로컬 스토리지 및 상태 초기화
            localStorage.removeItem('access_token');    // 토큰 삭제
            setIsLoggedIn(false);                       // 로그인 상태 변경
            resetUserInfo();                            // 유저 정보 초기화

            // 저장된 쿠키 삭제 (예: 'refresh_token' 쿠키 삭제)
            deleteCookie('refresh_token');

        // // 디버깅 : 초기화된 유저 정보 콘솔에 출력
        // console.log('로그아웃 시 리셋된 유저 정보:', {
        //     student_number: '',
        //     email: ''
        // });

            // 3. 사용자에게 알림 및 홈으로 리다이렉트
            alert('로그아웃 되었습니다.');
            window.location.href = '/';                 // 홈으로 리다이렉트
        } catch (error) {
            console.error('로그아웃 중 오류가 발생했습니다:', error);
            alert('로그아웃에 실패했습니다. 다시 시도해주세요.');
        }
    };

    return logoutHandler;
};