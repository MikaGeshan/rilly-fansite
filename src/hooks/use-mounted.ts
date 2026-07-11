"use client";

import { useEffect, useState } from "react";

/**
 * A custom hook to determine if the component has mounted on the client.
 * Essential for resolving hydration mismatch issues when rendering client-only UI in Next.js.
 */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  return mounted;
}
