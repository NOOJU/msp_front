// 인증서버 로직
export const API_BASE_URL =
    window.location.hostname === "www.syucloud.store"
        ? "https://www.syucloud.store/auth"
        : "https://syucloud.store/auth";

// 봇서버 로직
export const API_BASE_URL2 =
    window.location.hostname === "www.syucloud.store"
        ? "https://www.syucloud.store/bot"
        : "https://syucloud.store/bot";