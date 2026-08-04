"use client";

import Image, { type StaticImageData } from "next/image";
import { cn } from "@/lib/utils";

interface ImageFrameProps {
  src: string | StaticImageData;
  alt: string;
  caption?: string;
  stampText?: string;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  sizes?: string;
}

function Perforation({ side }: { side: "top" | "bottom" | "left" | "right" }) {
  const isHorizontal = side === "top" || side === "bottom";

  return (
    <span
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute opacity-70",
        isHorizontal
          ? "left-5 right-5 h-3"
          : "bottom-5 top-5 w-3",
        side === "top" && "-top-1.5",
        side === "bottom" && "-bottom-1.5",
        side === "left" && "-left-1.5",
        side === "right" && "-right-1.5",
      )}
      style={{
        backgroundImage:
          "radial-gradient(circle, rgba(190,24,93,0.34) 0 2px, transparent 2.5px)",
        backgroundSize: isHorizontal ? "14px 10px" : "10px 14px",
        backgroundRepeat: "repeat",
        backgroundPosition: "center",
      }}
    />
  );
}

export function ImageFrame({
  src,
  alt,
  caption,
  stampText = "Aprillivels",
  className,
  imageClassName,
  priority = false,
  sizes = "(max-width: 768px) 82vw, 360px",
}: ImageFrameProps) {
  return (
    <figure
      className={cn(
        "relative w-full max-w-sm rotate-[-1.2deg] rounded-lg bg-white p-4 shadow-[0_24px_60px_rgba(190,24,93,0.16)] ring-1 ring-pink-200/80",
        "before:pointer-events-none before:absolute before:inset-2 before:rounded-md before:border before:border-dashed before:border-pink-300/80",
        className,
      )}
    >
      <Perforation side="top" />
      <Perforation side="bottom" />
      <Perforation side="left" />
      <Perforation side="right" />

      <div className="relative z-10 overflow-hidden rounded-md bg-[linear-gradient(135deg,#fff8fb,#fff3c4)] p-2">
        <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-white">
          <Image
            src={src}
            alt={alt}
            fill
            priority={priority}
            sizes={sizes}
            className={cn("object-cover object-center", imageClassName)}
          />
        </div>
      </div>

      <figcaption className="relative z-10 mt-3 flex items-center justify-between gap-3 px-1">
        <span className="min-w-0 truncate text-sm font-black text-[var(--pink-deep)]">
          {caption ?? alt}
        </span>
        <span className="shrink-0 rounded-full border border-pink-200 bg-pink-50 px-2.5 py-1 text-[10px] font-black uppercase text-[var(--pink-deep)]">
          {stampText}
        </span>
      </figcaption>
    </figure>
  );
}
