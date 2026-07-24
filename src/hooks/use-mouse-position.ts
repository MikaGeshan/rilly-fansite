"use client";

import React, { useState } from "react";

interface MousePosition {
  x: number;
  y: number;
}

/**
 * Tracks the pointer position within a container. Attach the returned
 * `handleMouseMove` to a container's `onMouseMove` and drive cursor-following
 * effects (e.g. the spotlight) from `mousePos`.
 */
export function useMousePosition() {
  const [mousePos, setMousePos] = useState<MousePosition>({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) =>
    setMousePos({ x: e.clientX, y: e.clientY });

  return { mousePos, handleMouseMove };
}
