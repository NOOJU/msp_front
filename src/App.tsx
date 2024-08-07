// src/App.tsx

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // react-router-dom에서 Router, Route, Routes를 임포트
import Home from './routes/Home'; // Home 컴포넌트를 임포트
import Login from './routes/Login/Login'; // Login 컴포넌트를 임포트
import Apply from './routes/Apply/Apply'; // Apply 컴포넌트를 임포트
import Signup from './routes/Signup/Signup'; // Signup 컴포넌트를 임포트
import Main from './routes/Main/Main'; // Main 컴포넌트를 임포트

// App 컴포넌트 정의
const App: React.FC = () => {
    return (
        <Router> {/* Router 컴포넌트로 애플리케이션을 감쌉니다 */}
            <Routes> {/* Routes 컴포넌트로 라우트를 정의합니다 */}
                <Route path="/" element={<Home />} /> {/* 기본 경로로 Home 컴포넌트를 렌더링합니다 */}
                <Route path="/login" element={<Login />} /> {/* /login 경로로 Login 컴포넌트를 렌더링합니다 */}
                <Route path="/apply" element={<Apply />} /> {/* /apply 경로로 Apply 컴포넌트를 렌더링합니다 */}
                <Route path="/signup" element={<Signup />} /> {/* /signup 경로로 Signup 컴포넌트를 렌더링합니다 */}
                <Route path="/main" element={<Main />} /> {/* /main 경로로 Main 컴포넌트를 렌더링합니다 */}
            </Routes>
        </Router>
    );
};

export default App; // App 컴포넌트를 내보냅니다
