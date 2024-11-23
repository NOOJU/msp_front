import { useCallback, useState } from "react";

/**
 * input값을 담을 state를 선언할때 사용하는 사용자 함수
 * @returns [value, handler, setValue]
 */
export const useInput = (initalValue: string | null | number) => {
  const [value, setValue] = useState<string | null | number>(initalValue);

  const handler = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  }, []);

  return [value, handler, setValue];
};
