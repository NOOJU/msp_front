import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; // react-router-dom에서 Router, Route, Routes를 임포트
// import Home from "./routes/Home"; // Home 컴포넌트를 임포트 <- X 필요없음
import Login from "./routes/Auth/Login"; // Auth 컴포넌트를 임포트
import Apply from "./routes/Apply"; // Apply 컴포넌트를 임포트
import Signup from "./routes/Signup"; // Signup 컴포넌트를 임포트
import UserInfo from "./routes/UserInfo"; // UserInfo 컴포넌트를 임포트
import Main from "./routes/Main"; // Main 컴포넌트를 임포트
import ListVM from "./routes/List";
import LoadBalancer from "./routes/LoadBalancer";
import SupportRequest from "./routes/Request/SupportRequest";
import ExtendRequest from "./routes/Request/ExtendRequest";
import ProtectedRoute from "./routes/ProtectedRoute";

import ScrollToTop from "./routes/_common/ScrollToTop"; // dom 이동시, 스크롤을 최상단으로 이동시키는 훅
import MainLayOut from "./rayout";
import GlobalStyle from "./styles/globalStyle"; /** CSS 초기화 */
import useIsPC from "./hooks/useIsPC";
import { ThemeProvider } from "styled-components";
import { palette } from "./styles/palette";
import Error404 from "./routes/404";


// App 컴포넌트 정의
const App: React.FC = () => {
  const isPc = useIsPC(); //T = Pc , F = mobile
  const theme = { palette: palette, isPc: isPc };

  return (
      <Router>
        <ScrollToTop /> {/* dom 이동시, 스크롤을 최상단으로 이동시키는 훅 */}
        <GlobalStyle /> {/* CSS 초기화 */}
        <ThemeProvider theme={theme}>
          {/* isPc와 포인트 컬러를 전역으로 설정 */}
          <MainLayOut>
            {/* Router 컴포넌트로 애플리케이션을 감쌉니다 */}
            {/* rayOut 을 모든 페이지에 보이도록 합니다. */}
            <Routes>
              {/* Routes 컴포넌트로 라우트를 정의합니다 */}
              {/* <Route path="/" element={<Home />} /> 기본 경로로 Home 컴포넌트를 렌더링합니다 */}
              <Route path="/" element={<Main />} /> {/* 기본 경로로 Main 컴포넌트를 렌더링합니다 */}
              <Route path="/login" element={<Login />} /> {/* /login 경로로 Auth 컴포넌트를 렌더링합니다 */}
              <Route path="/signup" element={<Signup />} /> {/* /signup 경로로 Signup 컴포넌트를 렌더링합니다 */}
              <Route element={<ProtectedRoute />}>
                <Route path="/apply" element={<Apply />} /> {/* /apply 경로로 Apply 컴포넌트를 렌더링합니다 */}
                <Route path="/userinfo" element={<UserInfo />} /> {/* /userinfo 경로로 UserInfo 컴포넌트를 렌더링합니다 */}
                <Route path="/listvm" element={<ListVM />} /> {/* /vmlist 경로로 List 컴포넌트를 렌더링합니다 */}
                <Route path="/supportrequest" element={<SupportRequest />} />
                <Route path="/extendrequest" element={<ExtendRequest />} />
                <Route path="/extendrequest/:vmName" element={<ExtendRequest />} />
                <Route path="/loadbalancer" element={<LoadBalancer />} />
              </Route>
              <Route path="/*" element={<Error404 />} /> {/* 지정된 경로가 아닌 경로 */}
            </Routes>
          </MainLayOut>
        </ThemeProvider>
      </Router>
  );
};

export default App; // App 컴포넌트를 내보냅니다
