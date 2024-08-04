import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './routes/Home';
import Apply from './routes/Apply';
import Login from './routes/Login/Login';

const App: React.FC = () => (
    <Router>
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/apply" element={<Apply />} />
        </Routes>
    </Router>
);

export default App;
