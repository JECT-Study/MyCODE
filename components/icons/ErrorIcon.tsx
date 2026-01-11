import Svg, { Circle, Path, SvgProps } from "react-native-svg";

interface ErrorIconProps extends SvgProps {
  width?: number;
  height?: number;
  color?: string;
}

export default function ErrorIcon({
  width = 40,
  height = 40,
  color = "#BDBDBD",
  ...props
}: ErrorIconProps) {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 40 40"
      fill="none"
      {...props}
    >
      <Circle cx="20" cy="20" r="18" stroke={color} strokeWidth="2" />
      <Path
        d="M20 12V22"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <Circle cx="20" cy="27" r="1.5" fill={color} />
    </Svg>
  );
}
