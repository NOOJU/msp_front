import React, { useState } from 'react';
import axios from 'axios';

const Apply: React.FC = () => {
    const [formData, setFormData] = useState({
        usage: '',
        startDate: '',
        endDate: '',
        spec: '1',
        os: 'ubuntu',
        volume: '',
        securityGroup: '',
        agreement: false,
        additionalRequest: '',
    });

    // 입력 값 변경 처리 함수
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;

        if (type === 'checkbox' && e.target instanceof HTMLInputElement) {
            // 체크박스일 경우 체크 여부를 상태로 설정
            setFormData({
                ...formData,
                [name]: e.target.checked,
            });
        } else {
            // 입력 값 변경을 상태로 설정
            setFormData({
                ...formData,
                [name]: value,
            });

            if (name === 'startDate') {
                const startDate = new Date(value);
                const endDate = new Date(startDate);
                endDate.setDate(startDate.getDate() + 30); // 종료일을 시작일로부터 30일 후로 설정
                setFormData((prevState) => ({
                    ...prevState,
                    startDate: value,
                    endDate: endDate.toISOString().split('T')[0],
                }));
            }
        }
    };

    // 폼 제출 처리 함수
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            // 백엔드로 폼 데이터 전송
            const response = await axios.post('http://localhost:8000/vm-apply', formData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}` // 로컬 스토리지에서 토큰을 가져와 헤더에 포함
                }
            });
            console.log(response.data); // 응답 데이터 콘솔 출력
            alert('신청이 성공적으로 제출되었습니다.'); // 사용자에게 알림
        } catch (error) {
            console.error(error); // 에러 콘솔 출력
            alert('신청 제출에 실패했습니다.'); // 사용자에게 알림
        }
    };

    return (
        <div className="container">
            <h1>VM 신청</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>사용 용도</label>
                    <input type="text" name="usage" className="form-control" value={formData.usage} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>시작일</label>
                    <input type="date" name="startDate" className="form-control" value={formData.startDate} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>종료일</label>
                    <input type="date" name="endDate" className="form-control" value={formData.endDate} readOnly />
                </div>
                <div className="form-group">
                    <label>스펙</label>
                    <select name="spec" className="form-control" value={formData.spec} onChange={handleChange} required>
                        <option value="1">2Core 4GB</option>
                        <option value="2">4Core 4GB</option>
                        <option value="3">4Core 8GB</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>운영 체제 (OS)</label>
                    <select name="os" className="form-control" value={formData.os} onChange={handleChange} required>
                        <option value="ubuntu">Ubuntu 20.04</option>
                        <option value="ubuntu">Ubuntu 22.04</option>
                        <option value="centos">CentOS 8</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>볼륨</label>
                    <input type="text" name="volume" className="form-control" value={formData.volume} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>시큐리티 그룹</label>
                    <input type="text" name="securityGroup" className="form-control" value={formData.securityGroup} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>기타 요청 사항</label>
                    <textarea name="additionalRequest" className="form-control" value={formData.additionalRequest} onChange={handleChange} />
                </div>
                <div className="form-group form-check">
                    <input type="checkbox" name="agreement" className="form-check-input" checked={formData.agreement} onChange={handleChange} required />
                    <label className="form-check-label">동의 여부</label>
                </div>
                <button type="submit" className="btn btn-primary">제출</button>
            </form>
        </div>
    );
};

export default Apply; // Apply 컴포넌트를 내보냅니다