import { Navigate, Outlet, useLocation } from "react-router";
import { useRecoilValue } from "recoil";
import { LoginState } from "../recoil/authAtom";

const ProtectedRoute = () => {
    const isLoggedIn = useRecoilValue(LoginState);
    const currentLocation = useLocation();

    // console.log(isLoggedIn) // 디버깅 확인용

    return isLoggedIn ? (
        <Outlet />
    ) : (
        <Navigate
            to={"/login"}
            replace
            state={{ redirecredFrom: currentLocation }}
        />
    );
};

export default ProtectedRoute;
