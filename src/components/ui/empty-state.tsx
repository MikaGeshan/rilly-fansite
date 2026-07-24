import React from "react";
import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  emoji: string;
  title: string;
  description: string;
  className?: string;
}

/**
 * Dashed placeholder card shown when a section has no content yet.
 */
export function EmptyState({
  emoji,
  title,
  description,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn("text-center py-16 rounded-[2rem] glass-card", className)}
      style={{
        border: "1.5px dashed rgba(236,72,153,0.25)",
        background: "rgba(236,72,153,0.03)",
        boxShadow: "var(--shadow-card)",
      }}
    >
      <p className="text-3xl mb-3">{emoji}</p>
      <h4
        className="font-black tracking-widest text-sm uppercase"
        style={{ color: "#b494a9" }}
      >
        {title}
      </h4>
      <p className="text-xs mt-1" style={{ color: "#b494a9" }}>
        {description}
      </p>
    </div>
  );
}
