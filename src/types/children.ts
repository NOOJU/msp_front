import { ReactNode } from "react";

/**
 * props로 children를 받는 타입
 */
export type ChildrenProps = {
  children: ReactNode;
};

export type ChildrenButtonProps = ChildrenProps & {
  color: string;
};
