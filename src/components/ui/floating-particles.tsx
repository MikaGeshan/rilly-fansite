"use client";

import { motion } from "framer-motion";

export interface Particle {
  id: number;
  size: number;
  delay: number;
  x: string;
  y: string;
  symbol: string;
}

export interface FloatingParticlesProps {
  particles: Particle[];
  opacity?: number;
  floatY?: number;
  floatX?: number;
  durationBase?: number;
  durationFactor?: number;
}

/**
 * Ambient floating emoji particles rendered as a fixed background layer.
 */
export function FloatingParticles({
  particles,
  opacity = 0.12,
  floatY = 30,
  floatX = 10,
  durationBase = 12,
  durationFactor = 3,
}: FloatingParticlesProps) {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ zIndex: -5 }}
    >
      {particles.map((p) => (
        <motion.div
          key={p.id}
          style={{
            position: "absolute",
            left: p.x,
            top: p.y,
            fontSize: p.size,
            opacity,
          }}
          animate={{ y: [0, -floatY, 0], x: [0, floatX, 0], rotate: [0, 360] }}
          transition={{
            duration: durationBase + p.id * durationFactor,
            repeat: Infinity,
            ease: "easeInOut",
            delay: p.delay,
          }}
        >
          {p.symbol}
        </motion.div>
      ))}
    </div>
  );
}
