import { useRecoilState } from 'recoil';
import { LoginState } from '../../recoil/authAtom';

export const Logout = () => {
    const [isLoggedIn, setIsLoggedIn] = useRecoilState(LoginState);

    const logoutHandler = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        window.location.href = '/';
    };

    return logoutHandler;
};
