import { useState, useEffect } from "react";

/**
 * @returns {boolean} '사용자의 기기가 pc인가?' 에 대한 T/F 반환
 */
const useIsPC = (): boolean => {
  const [isPC, setIsPC] = useState<boolean>(() => window.matchMedia("(min-width: 769px)").matches);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 769px)");

    const handleChange = (event: MediaQueryListEvent) => {
      setIsPC(event.matches);
    };

    // 미디어 쿼리 변경에 대한 리스너 추가
    mediaQuery.addEventListener("change", handleChange);

    // 마운트 해제 시 리스너 정리
    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  return isPC;
};

export default useIsPC;
