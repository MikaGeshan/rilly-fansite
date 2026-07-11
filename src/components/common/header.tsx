"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export function Header() {
  const pathname = usePathname();

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Profile", href: "/profile" },
    { name: "Gallery", href: "/gallery" },
    { name: "Hashtags", href: "/#hashtag-guide" },
  ];

  return (
    <header className="sticky top-4 z-50 mx-auto w-full max-w-6xl px-4 sm:px-6">
      <nav
        className="flex h-20 items-center justify-between rounded-2xl px-4 sm:px-8 shadow-lg"
        style={{
          background: "rgba(255,255,255,0.82)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(236,72,153,0.18)",
          boxShadow: "0 4px 30px rgba(236,72,153,0.1), 0 1px 0 rgba(251,191,36,0.1)",
        }}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group" id="header-logo-link">
          <div className="relative">
            <div
              className="absolute -inset-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: "linear-gradient(135deg, #ec4899, #f59e0b)", filter: "blur(8px)" }}
            />
            <Image
              src="/aprillivels_logo.jpg"
              alt="Aprillivels Logo"
              width={42}
              height={42}
              className="relative rounded-full object-cover transition-transform duration-300 group-hover:scale-105"
              style={{ border: "2px solid rgba(236,72,153,0.3)" }}
            />
          </div>
          <div className="flex flex-col">
            <span className="shimmer-text font-black tracking-tight text-xl">
              Aprillivels
            </span>
            <span
              className="text-[9px] font-mono tracking-[0.28em] uppercase font-bold -mt-0.5"
              style={{ color: "#b494a9" }}
            >
              Official Fanbase
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="hidden md:flex items-center gap-7">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  id={`nav-${item.name.toLowerCase()}`}
                  className="relative text-sm font-bold uppercase tracking-wider group/nav"
                  style={{
                    color: isActive ? "#ec4899" : "#7b5572",
                  }}
                >
                  {item.name}
                  <span
                    className="absolute -bottom-1 left-0 h-0.5 rounded-full transition-all duration-300"
                    style={{
                      background: "linear-gradient(90deg, #ec4899, #f59e0b)",
                      width: isActive ? "100%" : "0%",
                    }}
                  />
                </Link>
              );
            })}
          </div>

          {/* Mobile Nav */}
          <div className="flex md:hidden items-center gap-4">
            {[{ name: "Home", href: "/" }, { name: "Profile", href: "/profile" }].map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-xs font-bold uppercase tracking-wider"
                style={{ color: pathname === item.href ? "#ec4899" : "#7b5572" }}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <Link
            href="/profile"
            id="header-cta-btn"
            className="btn-gradient hidden sm:inline-flex items-center gap-2 text-[11px] px-5 py-2.5 rounded-full"
          >
            <span>✨</span> Meet Rilly
          </Link>
        </div>
      </nav>
    </header>
  );
}
