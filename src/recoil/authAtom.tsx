import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';

const { persistAtom } = recoilPersist();

// export const TokenAtom = atom({
//     key: "TokenAtom",
//     default: undefined,
// });

export const LoginState = atom<boolean>({
    key: 'LoginState',
    default: false,
    effects_UNSTABLE: [persistAtom],
});

export const UserInfoState = atom({
    key: 'UserInfoState',
    default: {
        student_number: '',
        email: ''
    },
    effects_UNSTABLE: [persistAtom], // 상태 유지
});