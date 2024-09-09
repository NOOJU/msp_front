// src/recoil/vmListState.ts
import { atom } from 'recoil';

// VM 목록을 저장하는 atom
export const vmListState = atom<any[]>({
    key: 'vmListState', // 고유 키
    default: [], // 초기 값
});
