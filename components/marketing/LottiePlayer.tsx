"use client";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";

type LottiePlayerProps = {
  src: string;
  className?: string;
  loop?: boolean;
  autoplay?: boolean;
  style?: React.CSSProperties;
};

export function LottiePlayer({
  src,
  className,
  loop = true,
  autoplay = true,
  style,
}: LottiePlayerProps) {
  return (
    <div className={className} style={{ ...style, lineHeight: 0 }}>
      <DotLottieReact src={src} loop={loop} autoplay={autoplay} />
    </div>
  );
}
