import { useTheme } from "styled-components";
import { HeaderMainStlyed, HeaderMoblieBar } from "./styled";

// 아이콘
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightFromBracket, faHouse, faUser } from "@fortawesome/free-solid-svg-icons";

import { useRecoilValue } from "recoil";
import { UserInfoState } from "../../recoil/authAtom";
import { Logout } from "../../routes/Auth/Logout";
import { Link } from "react-router-dom";

const LayOutHeader = () => {
  const isPc = useTheme().isPc;
  const userInfo = useRecoilValue(UserInfoState);
  const logoutHandler = Logout(); // 로그아웃 핸들러 호출

  return (
    <HeaderMainStlyed className="flexCenter shadow_25">
      <div className="flexHeightCenter">
        {!isPc && <p>SYU CloudLAB</p>}
        {/** Pc 왼쪽 text 메뉴 */}
        {isPc && (
          <ul className="flexHeightCenter">
            <li>
              <Link to="/apply">가상 머신 신청</Link>
            </li>
            <li>
              <Link to="/listvm">가상 머신 목록</Link>
            </li>
            <li>
              <Link to="/supportrequest">기타 문의</Link>
            </li>
          </ul>
        )}
        {/** 공통 오른쪽 icon 메뉴 */}
        <div className="RightDiv flexHeightCenter">
          {/* 로그아웃: 로그인 상태에서 보임, 클릭시 로그아웃 함수 실행 */}
          {userInfo == null && (
            <div className="flexCenter logoutDiv">
              <FontAwesomeIcon icon={faArrowRightFromBracket} onClick={logoutHandler} />
            </div>
          )}
          {/* user정보: 클릭시 /userinfo로 이동 */}
          <div className="flexCenter">
            <Link to="/userinfo">
              <FontAwesomeIcon icon={faUser} />
            </Link>
          </div>
          {/* 홈: 클릭시 홈으로 이동 */}
          <div className="flexCenter">
            <Link to="/">
              <FontAwesomeIcon icon={faHouse} />
            </Link>
          </div>
        </div>
      </div>
      {/** Moblie 하단 text 메뉴 */}
      {!isPc && (
        <HeaderMoblieBar className="flexCenter">
          <ul className="flexCenter">
            <li>
              <Link to="/apply">VM 신청</Link>
            </li>
            <li>
              <Link to="/listvm">VM 목록</Link>
            </li>
            <li>
              <Link to="/supportrequest">문의</Link>
            </li>
          </ul>
        </HeaderMoblieBar>
      )}
    </HeaderMainStlyed>
  );
};
export default LayOutHeader;
