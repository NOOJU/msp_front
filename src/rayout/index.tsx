import React from "react";
import LayOutHeader from "./Header";
import { useTheme } from "styled-components";
import { ChildrenProps } from "../types/children";
import { relative } from "path";

/**
 * 자신의 모든 자식, 자손에게 <LayOutHeader />을 노출시킴
 */
const MainLayOut = ({ children }: ChildrenProps) => {
  const isPc = useTheme().isPc;
  return (
    <div style={{ position: "relative", zIndex: "999" }}>
      <>
        <LayOutHeader />
        <div style={{ paddingTop: isPc ? "70px" : "115px" }}>{children}</div>
      </>
    </div>
  );
};

export default MainLayOut;
