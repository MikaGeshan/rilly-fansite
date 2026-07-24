import React from "react";
import Image from "next/image";
import Link from "next/link";

export function Footer() {
  const socials = [
    {
      href: "https://instagram.com/rilly.jkt48_",
      label: "Instagram",
      src: "/instagram.png",
      accent: "rgba(236,72,153,0.15)",
      hover: "rgba(236,72,153,0.25)",
      ring: "#ec4899",
    },
    {
      href: "https://x.com/Rilly_JKT48",
      label: "X (Twitter)",
      src: "/x.png",
      accent: "rgba(251,191,36,0.15)",
      hover: "rgba(251,191,36,0.28)",
      ring: "#f59e0b",
    },
    {
      href: "https://tiktok.com/@jkt48.rilly",
      label: "TikTok",
      src: "/tik-tok.png",
      accent: "rgba(236,72,153,0.08)",
      hover: "rgba(251,191,36,0.15)",
      ring: "#f9a8d4",
    },
  ];

  return (
    <footer
      className="mt-32 py-16 relative overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #fff8f9 0%, #fdf2f8 100%)",
        borderTop: "1px solid rgba(236,72,153,0.15)",
      }}
    >
      {/* Decorative top gradient line */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, #ec4899 30%, #f59e0b 70%, transparent)" }}
      />

      {/* Background orbs */}
      <div className="pointer-events-none absolute -bottom-16 left-1/4 w-64 h-64 rounded-full orb-pink opacity-40" />
      <div className="pointer-events-none absolute -bottom-8 right-1/4 w-48 h-48 rounded-full orb-yellow opacity-30" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col items-center gap-10 relative z-10">
        {/* Brand */}
        <div className="flex flex-col items-center gap-2">
          <span className="shimmer-text text-3xl font-black tracking-tight">Aprillivels</span>
          <span className="text-xs font-mono tracking-[0.3em] uppercase" style={{ color: "#b494a9" }}>
            Official Fanbase of Bong Aprilli
          </span>
        </div>

        {/* Divider */}
        <div className="gradient-divider w-48" />

        {/* Socials */}
        <div className="flex gap-5">
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              id={`footer-social-${s.label.toLowerCase().replace(/\s/g, "-")}`}
              className="flex h-13 w-13 items-center justify-center rounded-full transition-all duration-300 hover:scale-110 hover:-translate-y-1"
              style={{
                width: 52,
                height: 52,
                background: s.accent,
                border: `1.5px solid ${s.ring}33`,
                boxShadow: `0 2px 16px ${s.ring}22`,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background = s.hover;
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = `0 6px 24px ${s.ring}44`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background = s.accent;
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = `0 2px 16px ${s.ring}22`;
              }}
            >
              <Image src={s.src} alt={s.label} width={24} height={24} className="object-contain" />
            </a>
          ))}
        </div>

        {/* Nav links */}
        <nav className="flex gap-6 text-xs font-bold uppercase tracking-wider" style={{ color: "#b494a9" }}>
          {[
            { name: "Home", href: "/" },
            { name: "Profile", href: "/profile" },
            { name: "Gallery", href: "/gallery" },
            { name: "Hashtags", href: "/profile#hashtag-guide" },
          ].map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="hover:text-pink-500 transition-colors"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Copyright */}
        <p
          className="text-center text-xs font-medium"
          style={{ color: "#b494a9" }}
        >
          © {new Date().getFullYear()} Aprillivels — JKT48 Rilly Fanbase.
          <br />
          <span className="opacity-70">
            Fan-made website. Not affiliated with JKT48 Operation Team.
          </span>
        </p>
      </div>
    </footer>
  );
}
