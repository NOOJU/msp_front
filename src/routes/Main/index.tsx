import React, { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// 아이콘
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause } from "@fortawesome/free-solid-svg-icons";

import { MainPageSlider1, MainPageSlider2, MainPageStyled } from "./styled";
import { Link } from "react-router-dom";
import { useTheme } from "styled-components";

const Main: React.FC = () => {
  // 슬라이더 재생, 멈춤
  let sliderRef: Slider | null = null;
  const [onPlay, setOnPlay] = useState<Boolean>(true); //슬라이더의 재생 여부를 가지고 있음
  const isPc = useTheme().isPc;

  // 백그라운드 이미지 패치
  const vmImagePath = "/image/VM1.webp";
  const vmMobileImagePath = "/image/VM2.webp";
  const LoadBalancerImagePath = "/image/LoadBalancer.webp";

  const play = () => {
    sliderRef?.slickPlay();
    setOnPlay(true);
  };

  const pause = () => {
    sliderRef?.slickPause();
    setOnPlay(false);
  };

  /**
   * 슬라이더 양 옆의 화살표 제거
   */
  function SampleNextArrow(props: any) {
    const { style } = props;
    return <div style={{ ...style, display: "none" }} />;
  }
  /**
   * 슬라이더 양 옆의 화살표 제거
   */
  function SamplePrevArrow(props: any) {
    const { style } = props;
    return <div style={{ ...style, display: "none" }} />;
  }

  const settings = {
    dots: true, // 도트
    infinite: true, // 무한
    autoplaySpeed: 5000, // 자동 재생 속도
    speed: 500, // 속도
    slidesToShow: 1, // 슬라이드 표시
    slidesToScroll: 1, // 슬라이드로스크롤
    autoplay: true, // 자동재생
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };

  return (
      <MainPageStyled>
        <div className="slider-container">
          <Slider ref={(slider) => (sliderRef = slider)} {...settings}>
            {/* 1번 슬라이드 _ 가상머신 생성 */}
            <MainPageSlider1>
              <div className="flexCenter">
                <div>
                <span>
                  VIRTUAL MACHINE
                  <br />
                </span>
                  <span>가상머신</span>
                </div>
                {/* 신청하기 버튼 */}
                <Link to="/apply" className="shadow_15 flexCenter">
                  신청하기
                </Link>
              </div>
              <div style={{ backgroundImage: `url(${isPc ? vmImagePath : vmMobileImagePath})` }}>{/* 배경화면 */}</div>
            </MainPageSlider1>
            {/* 2번 슬라이더 _  */}
            <MainPageSlider2>
              <div className="flexCenter">
                <div>
                <span>
                  LOAD BALANCER
                  <br />
                </span>
                  <span>로드밸런서</span>
                </div>
                {/* 신청하기 버튼 */}
                <Link to="/loadbalancer" className="shadow_15 flexCenter">
                  신청하기
                </Link>
              </div>
              <div style={{ backgroundImage: `url(${LoadBalancerImagePath})` }}>{/* 배경화면 */}</div>
            </MainPageSlider2>
          </Slider>
          {/* 재생 / 정지 버튼 */}
          <div className="slider-button-div flexCenter shadow_15" style={{ textAlign: "center" }} onClick={onPlay ? pause : play}>
            {!onPlay && (
                <button className="button">
                  <FontAwesomeIcon icon={faPlay} className="icon" style={{ paddingLeft: "0.3rem", cursor: "pointer" }} />
                </button>
            )}
            {onPlay && (
                <button className="button">
                  <FontAwesomeIcon icon={faPause} className="icon" style={{ cursor: "pointer" }} />
                </button>
            )}
          </div>
        </div>
      </MainPageStyled>
  );
};

export default Main;
