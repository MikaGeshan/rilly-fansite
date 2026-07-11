"use client";

import { useTheme } from "@/context/theme-context";
import { Button } from "@/components/ui/button";
import { useMounted } from "@/hooks/use-mounted";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const mounted = useMounted();

  // Avoid hydration mismatch by rendering a placeholder until mounted
  if (!mounted) {
    return <Button variant="outline" size="sm" className="w-24">Loading...</Button>;
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleTheme}
      className="flex items-center gap-2 border border-zinc-200 bg-white hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900 transition-all shadow-sm rounded-lg w-28"
    >
      {theme === "light" ? (
        <>
          <span className="text-zinc-600">☀️</span>
          <span className="text-zinc-800 font-semibold text-xs">Light Mode</span>
        </>
      ) : (
        <>
          <span className="text-zinc-400">🌙</span>
          <span className="text-zinc-200 font-semibold text-xs">Dark Mode</span>
        </>
      )}
    </Button>
  );
}
