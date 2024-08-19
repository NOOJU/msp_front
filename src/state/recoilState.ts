// src/state/recoilState.ts

import { atom } from 'recoil';

// 매직넘버 상수로 관리
export const INITIAL_TIMER_SECONDS = 180;
export const PHONE_NUMBER_LENGTH = 11;
export const VERIFICATION_CODE_LENGTH = 6;

// 전화번호 상태 관리
export const phoneNumberState = atom<string>({
    key: 'phoneNumberState',
    default: '',
});

// 인증번호 상태 관리
export const verificationCodeState = atom<string>({
    key: 'verificationCodeState',
    default: '',
});

// 타이머 상태 관리
export const timerState = atom<number>({
    key: 'timerState',
    default: INITIAL_TIMER_SECONDS,
});

// 타이머 활성화 상태 관리
export const timerActiveState = atom<boolean>({
    key: 'timerActiveState',
    default: false,
});

// 인증 상태 관리
export const verificationStatusState = atom<{
    sent: boolean;
    verified: boolean;
    message: string;
}>({
    key: 'verificationStatusState',
    default: {
        sent: false,
        verified: false,
        message: '',
    },
});
