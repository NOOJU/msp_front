import React from 'react';
import ReactDOM from 'react-dom/client'; // ReactDOM을 사용하여 React 컴포넌트를 DOM에 렌더링
import './index.css'; // CSS 파일 임포트
import App from './App'; // App 컴포넌트 임포트
import reportWebVitals from './reportWebVitals'; // 성능 측정을 위한 reportWebVitals 임포트

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement // root DOM 요소를 선택
);
root.render(
    <React.StrictMode> {/* React.StrictMode로 App을 감싸서 잠재적 문제를 감지 */}
        <App /> {/* App 컴포넌트를 렌더링 */}
    </React.StrictMode>
);

// 성능 측정을 위해 reportWebVitals 함수를 호출
reportWebVitals();
