// src/recoil/requestStatusState.ts
import { atom, selector } from 'recoil';
import axios from 'axios';
import { API_BASE_URL2 } from '../config'; // 신청 상태를 가져올 API 주소

// 신청 상태를 저장하는 atom
export const requestStatusState = atom<{ [key: string]: string }>({
    key: 'requestStatusState',
    default: {},
});

// 신청 상태를 비동기로 가져오는 selector
export const fetchRequestStatusSelector = selector({
    key: 'fetchRequestStatusSelector',
    get: async () => {
        try {
            // 신청 상태를 가져오기 위한 API 호출
            const response = await axios.get(`${API_BASE_URL2}/request_status`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`, // 인증 토큰 포함
                },
            });

            // 신청 상태를 담을 객체 생성
            const statusMap: { [key: string]: string } = {};

            // 서버로부터 받은 데이터에 따라 statusMap을 설정
            response.data.forEach((status: any) => {
                statusMap[status.instance_name] = status.status; // VM 이름을 기준으로 상태를 맵핑
            });

            return statusMap; // Recoil에 반환하여 상태 저장
        } catch (error) {
            console.error('신청 상태를 가져오는데 실패했습니다.', error);
            return {};
        }
    },
});
