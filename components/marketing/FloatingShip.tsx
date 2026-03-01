"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { LottiePlayer } from "./LottiePlayer";

// Free LottieFiles animation (CDN JSON - Lottie Simple License, commercial use ok)
const HERO_LOTTIE_JSON =
  "https://assets10.lottiefiles.com/packages/lf20_32NcN8.json";

export function FloatingShip() {
  const ref = useRef(null);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, -80]);
  const opacity = useTransform(scrollY, [0, 300], [0.9, 0.35]);

  return (
    <motion.div
      ref={ref}
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{ perspective: 1000 }}
    >
      <motion.div
        className="absolute top-1/4 right-[5%] w-72 h-72 max-w-[320px] max-h-[320px] opacity-90"
        style={{ y, opacity }}
      >
        <LottiePlayer
          src={HERO_LOTTIE_JSON}
          className="w-full h-full"
          loop
          autoplay
        />
      </motion.div>
    </motion.div>
  );
}
