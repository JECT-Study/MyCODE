import React from "react";

import Svg, {
  Defs,
  FeBlend,
  FeColorMatrix,
  FeComposite,
  FeFlood,
  FeGaussianBlur,
  FeOffset,
  Filter,
  G,
  LinearGradient,
  Path,
  Stop,
} from "react-native-svg";

interface PerformanceIconProps {
  width?: number;
  height?: number;
}

export const PerformanceIcon: React.FC<PerformanceIconProps> = ({
  width = 50,
  height = 43,
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 50 43" fill="none">
      <Path
        d="M8.83497 5.10907L10.8166 0.904569C11.052 0.404989 11.6479 0.190872 12.1475 0.426326L40.0745 13.5884C41.0736 14.0593 41.5019 15.2511 41.0309 16.2502L40.4166 17.5537C39.9126 18.6231 38.5247 18.9615 37.3521 19.1112C36.341 19.2403 35.236 19.8849 34.4268 21.6018C33.5835 23.3912 33.8264 24.7221 34.4028 25.6258C35.0175 26.5898 35.5719 27.833 35.0845 28.8671L34.2697 30.5961C33.7988 31.5952 32.607 32.0235 31.6079 31.5526L4.58546 18.8168C3.5863 18.3459 3.15807 17.1542 3.62897 16.155L5.33959 12.5255C6.57225 13.1736 9.37932 13.7446 10.7464 10.8439C12.1135 7.94331 10.0417 5.8121 8.83497 5.10907Z"
        fill="url(#paint0_linear_1876_2966)"
      />
      <Path
        d="M1.69243 6.69788L0 8.3903L1.69243 10.0827L3.38486 8.3903L1.69243 6.69788Z"
        fill="#6C4DFF"
      />
      <Path
        d="M47.2373 23L45.3239 24.9133L47.2373 26.8267L49.1506 24.9133L47.2373 23Z"
        fill="#FFE43D"
      />
      <Path
        d="M22.7363 38.7336L20.823 40.647L22.7363 42.5603L24.6497 40.647L22.7363 38.7336Z"
        fill="#FA85A7"
      />
      <Path
        d="M12.6149 18.584L13.2884 16.9956"
        stroke="white"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <Path
        d="M14.0966 15.0895L14.7701 13.5012"
        stroke="white"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <Path
        d="M15.713 11.2774L16.3865 9.68907"
        stroke="white"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <Path
        d="M17.1947 7.78303L17.8682 6.19466"
        stroke="white"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <G filter="url(#filter0_d_1876_2966)">
        <Path
          d="M2.4119 20.4059V16.7579C2.4119 15.6533 3.30732 14.7579 4.41189 14.7579H38.8552C39.9598 14.7579 40.8552 15.6533 40.8552 16.7579V20.4059C39.4584 20.2845 36.6647 20.9161 36.6647 24.4142C36.6647 27.9124 39.4584 28.6655 40.8552 28.6047V32.6172C40.8552 33.7218 39.9598 34.6172 38.8552 34.6172H4.4119C3.30733 34.6172 2.4119 33.7218 2.4119 32.6172V28.6047C3.99093 28.6655 7.14899 27.9853 7.14899 24.7786C7.14899 21.572 3.99093 20.5274 2.4119 20.4059Z"
          fill="url(#paint1_linear_1876_2966)"
        />
      </G>
      <G filter="url(#filter1_d_1876_2966)">
        <Path
          d="M2.4119 20.4059V16.7579C2.4119 15.6533 3.30732 14.7579 4.41189 14.7579H38.8552C39.9598 14.7579 40.8552 15.6533 40.8552 16.7579V20.4059C39.4584 20.2845 36.6647 20.9161 36.6647 24.4142C36.6647 27.9124 39.4584 28.6655 40.8552 28.6047V32.6172C40.8552 33.7218 39.9598 34.6172 38.8552 34.6172H4.4119C3.30733 34.6172 2.4119 33.7218 2.4119 32.6172V28.6047C3.99093 28.6655 7.14899 27.9853 7.14899 24.7786C7.14899 21.572 3.99093 20.5274 2.4119 20.4059Z"
          fill="url(#paint2_linear_1876_2966)"
        />
      </G>
      <Path
        d="M13.882 20.5104V20.002H16.6761V20.5104H15.5962V23.3792H14.9667V20.5104H13.882Z"
        fill="#FAFAFA"
      />
      <Path
        d="M17.7252 20.002V23.3792H17.0957V20.002H17.7252Z"
        fill="#FAFAFA"
      />
      <Path
        d="M20.6677 21.1402C20.5951 20.7343 20.2561 20.5011 19.8299 20.5011C19.2537 20.5011 18.8518 20.9256 18.8518 21.6906C18.8518 22.4649 19.2585 22.8801 19.8299 22.8801C20.2464 22.8801 20.5854 22.6562 20.6677 22.2597H21.3021C21.2052 22.9081 20.6532 23.4259 19.8203 23.4259C18.8953 23.4259 18.2174 22.7775 18.2174 21.6906C18.2174 20.5991 18.905 19.9554 19.8203 19.9554C20.5951 19.9554 21.1955 20.3892 21.3021 21.1402H20.6677Z"
        fill="#FAFAFA"
      />
      <Path
        d="M21.77 23.3792V20.002H22.3996V21.5553H22.448L23.8184 20.002H24.5884L23.2325 21.518L24.6029 23.3792H23.8426L22.7918 21.9285L22.3996 22.3716V23.3792H21.77Z"
        fill="#FAFAFA"
      />
      <Path
        d="M24.9159 23.3792V20.002H27.1968V20.5104H25.5455V21.434H27.0757V21.9425H25.5455V22.8661H27.2064V23.3792H24.9159Z"
        fill="#FAFAFA"
      />
      <Path
        d="M27.5727 20.5104V20.002H30.3669V20.5104H29.287V23.3792H28.6574V20.5104H27.5727Z"
        fill="#FAFAFA"
      />
      <Path
        d="M33.8373 32.1021V30.2111"
        stroke="white"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <Path
        d="M33.8373 27.942V26.051"
        stroke="white"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <Path
        d="M33.8373 23.4036V21.5126"
        stroke="white"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <Path
        d="M33.8373 19.2435V17.3525"
        stroke="white"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <Path
        d="M10.4115 32.4314V30.4982"
        stroke="white"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <Path
        d="M10.4115 28.1784V26.2452"
        stroke="white"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <Path
        d="M10.4115 23.5387V21.6055"
        stroke="white"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <Path
        d="M10.4115 19.2857V17.3525"
        stroke="white"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <Defs>
        <Filter
          id="filter0_d_1876_2966"
          x="0.411896"
          y="12.7579"
          width="42.4433"
          height="23.8593"
          filterUnits="userSpaceOnUse"
        >
          <FeFlood floodOpacity="0" result="BackgroundImageFix" />
          <FeColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <FeOffset />
          <FeGaussianBlur stdDeviation="1" />
          <FeComposite in2="hardAlpha" operator="out" />
          <FeColorMatrix
            type="matrix"
            values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0"
          />
          <FeBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_1876_2966"
          />
          <FeBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_1876_2966"
            result="shape"
          />
        </Filter>
        <Filter
          id="filter1_d_1876_2966"
          x="0.411896"
          y="12.7579"
          width="42.4433"
          height="23.8593"
          filterUnits="userSpaceOnUse"
        >
          <FeFlood floodOpacity="0" result="BackgroundImageFix" />
          <FeColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <FeOffset />
          <FeGaussianBlur stdDeviation="1" />
          <FeComposite in2="hardAlpha" operator="out" />
          <FeColorMatrix
            type="matrix"
            values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0"
          />
          <FeBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_1876_2966"
          />
          <FeBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_1876_2966"
            result="shape"
          />
        </Filter>
        <LinearGradient
          id="paint0_linear_1876_2966"
          x1="11.7129"
          y1="0.867625"
          x2="18.0967"
          y2="25.1847"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#62C8FF" />
          <Stop offset="1" stopColor="#A7E0FF" />
        </LinearGradient>
        <LinearGradient
          id="paint1_linear_1876_2966"
          x1="4.33811"
          y1="14.7496"
          x2="40.7783"
          y2="36.4402"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#7859FF" />
          <Stop offset="1" stopColor="#8E73FF" />
        </LinearGradient>
        <LinearGradient
          id="paint2_linear_1876_2966"
          x1="4.33811"
          y1="14.7496"
          x2="40.7783"
          y2="36.4402"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#7859FF" />
          <Stop offset="1" stopColor="#8E73FF" />
        </LinearGradient>
      </Defs>
    </Svg>
  );
};

export default PerformanceIcon;
