import {useRecoilState, useResetRecoilState} from 'recoil';
import { LoginState, UserInfoState } from '../../recoil/authAtom';

export const Logout = () => {
    const [isLoggedIn, setIsLoggedIn] = useRecoilState(LoginState);  // 로그인 상태
    const [userInfo, setUserInfo] = useRecoilState(UserInfoState);   // 유저 정보 상태
    const resetUserInfo = useResetRecoilState(UserInfoState);        // 유저 정보 초기화 함수

    const logoutHandler = () => {

        localStorage.removeItem('access_token');    // 토큰 삭제
        setIsLoggedIn(false);                       // 로그인 상태 변경
        resetUserInfo();                            // 유저 정보 초기화

        // // 디버깅 : 초기화된 유저 정보 콘솔에 출력
        // console.log('로그아웃 시 리셋된 유저 정보:', {
        //     student_number: '',
        //     email: ''
        // });

        alert('로그아웃 되었습니다.');
        window.location.href = '/';                 // 홈으로 리다이렉트
    };


    return logoutHandler;
};
