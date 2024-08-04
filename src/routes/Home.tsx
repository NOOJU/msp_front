import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => (
    <div className="container">
        <h1>가상머신 사용 신청 사이트</h1>
        <Link to="/apply">
            <button className="btn btn-primary">신청</button>
        </Link>
    </div>
);

export default Home;