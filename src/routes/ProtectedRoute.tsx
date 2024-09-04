import { Navigate, Outlet, useLocation } from "react-router";
import { useRecoilValue } from "recoil";
import { LoginState } from "../recoil/authAtom";

const ProtectedRoute = () => {
    const isLogin = useRecoilValue(LoginState);
    const currentLocation = useLocation();

    console.log(isLogin)

    return isLogin ? (
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
