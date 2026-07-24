"use client";

import { motion } from "framer-motion";

export interface CursorSpotlightProps {
  mousePos: { x: number; y: number };
  size?: number;
  blur?: number;
  pinkOpacity?: number;
  yellowOpacity?: number;
}

/**
 * A soft radial gradient that trails the cursor, shared across pages.
 */
export function CursorSpotlight({
  mousePos,
  size = 480,
  blur = 60,
  pinkOpacity = 0.12,
  yellowOpacity = 0.08,
}: CursorSpotlightProps) {
  const offset = size / 2;

  return (
    <motion.div
      className="pointer-events-none fixed -z-10 rounded-full"
      style={{
        height: size,
        width: size,
        background: `radial-gradient(circle, rgba(236,72,153,${pinkOpacity}) 0%, rgba(251,191,36,${yellowOpacity}) 50%, transparent 70%)`,
        filter: `blur(${blur}px)`,
      }}
      animate={{ x: mousePos.x - offset, y: mousePos.y - offset }}
      transition={{ type: "spring", damping: 45, stiffness: 75, mass: 0.8 }}
    />
  );
}
